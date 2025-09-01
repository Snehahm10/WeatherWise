import { NextResponse } from "next/server";
import { getWeatherTool } from '@/ai/tools/get-weather';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city } = body;

    if (!city) {
        return NextResponse.json({ success: false, error: "City is required" }, { status: 400 });
    }

    const weatherData = await getWeatherTool.run({ city });
    return NextResponse.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error(error);
    // This is a workaround to get the city name for the error message
    // as the original request object is already consumed.
    const city = (await req.clone().json()).city || 'the specified city';
    if (error instanceof Error) {
        // Error from OpenWeather API for "city not found" can be identified.
        if (error.message.includes('404') || error.message.toLowerCase().includes('city not found')) {
            return NextResponse.json({
                success: false,
                error: `Could not find weather for "${city}". Please check the city name and try again.`,
            }, { status: 404 });
        }
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
    return NextResponse.json({
      success: false,
      error: 'An unknown error occurred while fetching weather data.',
    }, { status: 500 });
  }
}
