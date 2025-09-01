'use server';

import { displayWeatherCondition } from '@/ai/flows/display-weather-condition-with-ai';
import type { DisplayWeatherConditionInput, DisplayWeatherConditionOutput } from '@/ai/flows/display-weather-condition-with-ai';

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
