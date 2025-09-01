import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not set in the environment variables.');
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
    }

    const data = await response.json();
    
    const suggestions = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      fullName: `${item.name}, ${item.state ? `${item.state}, ` : ''}${item.country}`
    }));

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error) {
    console.error("Error in suggestions API:", error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred while fetching suggestions.' }, { status: 500 });
  }
}
