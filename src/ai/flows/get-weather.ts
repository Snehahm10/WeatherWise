'use server';
/**
 * @fileOverview A weather tool that fetches weather data from a third-party API.
 * This file defines a Genkit tool for fetching weather data and a flow that uses it.
 *
 * - getWeather - A function that fetches weather for a given city.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WeatherDataSchema = z.object({
  temperature: z.number().describe('The temperature in Celsius.'),
  humidity: z.number().describe('The humidity as a percentage.'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Cloudy").'),
});

const getWeatherTool = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Get the current weather for a specified city.',
    inputSchema: z.object({
      city: z.string().describe('The city to get the weather for.'),
    }),
    outputSchema: WeatherDataSchema,
  },
  async (input) => {
    // In a real application, you would fetch this from a weather API.
    // We will simulate this for now with some randomness.
    const temperature = Math.floor(Math.random() * 25) + 5; // Temp between 5 and 30
    const humidity = Math.floor(Math.random() * 50) + 30; // Humidity between 30 and 80
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly cloudy', 'Stormy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    // Simulate an error for a specific city for demonstration purposes
    if (input.city.toLowerCase() === 'error') {
      throw new Error('Simulated error fetching weather data.');
    }
    
    // Simulate city not found
    if (input.city.toLowerCase() === 'notfound') {
        const error = new Error(`City not found: ${input.city}`) as any;
        error.status = 404;
        throw error;
    }

    return {
      temperature,
      humidity,
      condition,
    };
  }
);

const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: z.string(),
    outputSchema: WeatherDataSchema,
    config: {
        timeout: 30000,
    }
  },
  async (city) => {
    const { output } = await ai.runTool(getWeatherTool, { city });
    return output!;
  }
);

export async function getWeather(city: string): Promise<z.infer<typeof WeatherDataSchema>> {
    return getWeatherFlow(city);
}
