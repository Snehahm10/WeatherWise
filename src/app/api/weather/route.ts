import { NextResponse } from "next/server";
import { getWeatherTool } from '@/ai/tools/get-weather';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city } = body;

    if (!city) {
        return NextResponse.json({ success: false, error: "City is required" }, { status: 400 });
    }

    // The weather data is already normalized by the tool
    const weatherData = await getWeatherTool({ city });

    return NextResponse.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error(error);
    const city = (await req.clone().json()).city || 'the specified city';
    if (error instanceof Error) {
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
