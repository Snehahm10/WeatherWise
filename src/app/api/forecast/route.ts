import { NextResponse } from "next/server";
import { getForecastTool } from '@/ai/tools/get-forecast';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city } = body;

    if (!city) {
        return NextResponse.json({ success: false, error: "City is required" }, { status: 400 });
    }

    const forecastData = await getForecastTool({ city });

    return NextResponse.json({
      success: true,
      data: forecastData,
    });
  } catch (error) {
    console.error("Error in forecast API:", error);
    const city = (await req.clone().json()).city || 'the specified city';
     if (error instanceof Error) {
        if (error.message.includes('404') || error.message.toLowerCase().includes('city not found')) {
            return NextResponse.json({
                success: false,
                error: `Could not find forecast for "${city}". Please check the city name and try again.`,
            }, { status: 404 });
        }
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
    return NextResponse.json({
      success: false,
      error: 'An unknown error occurred while fetching forecast data.',
    }, { status: 500 });
  }
}
