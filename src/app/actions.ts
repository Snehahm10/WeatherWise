'use server';

import { getWeather } from '@/ai/flows/get-weather';

export async function getWeatherForCity(
  city: string
): Promise<
  { success: true; data: any } | { success: false; error: string }
> {
  try {
    const weatherData = await getWeather(city);
    return {
      success: true,
      data: weatherData,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        if (error.message.includes('404')) {
            return {
                success: false,
                error: `Could not find weather for "${city}". Please check the city name and try again.`,
            };
        }
        return {
            success: false,
            error: error.message,
        };
    }
    return {
      success: false,
      error: 'An unknown error occurred while fetching weather data.',
    };
  }
}
