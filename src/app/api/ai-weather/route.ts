import { NextResponse } from "next/server";
import { displayWeatherCondition, DisplayWeatherConditionInput } from "@/ai/flows/display-weather-condition-with-ai";

export async function POST(req: Request) {
  try {
    const body: DisplayWeatherConditionInput = await req.json();
    if (!body.weatherCondition || !body.timeOfDay) {
        return NextResponse.json({ success: false, error: "Missing weatherCondition or timeOfDay" }, { status: 400 });
    }
    const result = await displayWeatherCondition(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("AI Weather API Error:", error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch AI weather description" },
      { status: 500 }
    );
  }
}
