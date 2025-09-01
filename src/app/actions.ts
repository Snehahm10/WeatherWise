'use server';

import { getWeatherFlow } from '@/ai/flows/get-weather';
import { displayWeatherCondition } from '@/ai/flows/display-weather-condition-with-ai';
import type { DisplayWeatherConditionInput, DisplayWeatherConditionOutput } from '@/ai/flows/display-weather-condition-with-ai';

export async function getWeatherForCity(
  city: string
): Promise<
  { success: true; data: any } | { success: false; error: string }
> {
  try {
    const weatherData = await getWeatherFlow(city);
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

export async function getAIDescriptionForWeather(
    input: DisplayWeatherConditionInput
  ): Promise<
    { success: true; data: DisplayWeatherConditionOutput } | { success: false; error: string }
  > {
    try {
      const result = await displayWeatherCondition(input);
      return { success: true, data: result };
    } catch (error) {
        console.error("AI data fetch failed:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unknown error occurred while fetching AI weather description."}
    }
  }
