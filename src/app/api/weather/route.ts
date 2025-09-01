import { NextResponse } from "next/server";
import { getWeatherForCityFlow } from '@/ai/flows/get-weather';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city } = body;

    if (!city) {
        return NextResponse.json({ success: false, error: "City is required" }, { status: 400 });
    }

    const weatherData = await getWeatherForCityFlow(city);
    return NextResponse.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        // Error from OpenWeather API for "city not found" is a 404, but the tool throws an error.
        // We'll check the message for '404' or 'not found' keywords.
        if (error.message.includes('404') || error.message.toLowerCase().includes('city not found')) {
            const city = (await req.clone().json()).city;
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
