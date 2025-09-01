import { NextResponse } from "next/server";
import { getAIDescriptionForWeather } from "@/app/actions";
import { DisplayWeatherConditionInput } from "@/ai/flows/display-weather-condition-with-ai";

export async function POST(req: Request) {
  try {
    const body: DisplayWeatherConditionInput = await req.json();
    if (!body.weatherCondition || !body.timeOfDay) {
        return NextResponse.json({ success: false, error: "Missing weatherCondition or timeOfDay" }, { status: 400 });
    }
    const result = await getAIDescriptionForWeather(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Weather API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch AI weather description" },
      { status: 500 }
    );
  }
}
