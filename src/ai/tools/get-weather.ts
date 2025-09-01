/**
 * @fileOverview A weather tool that fetches weather data from a third-party API.
 * This file defines a Genkit tool for fetching weather data.
 *
 * - getWeatherTool - A Genkit tool for fetching weather data.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const WeatherDataSchema = z.object({
  temperature: z.number().describe('The temperature in Celsius.'),
  humidity: z.number().describe('The humidity as a percentage.'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Cloudy").'),
  city: z.string().describe('The name of the city.'),
  country: z.string().describe('The country code of the city.'),
  windSpeed: z.number().describe('The wind speed in meters per second.'),
  feelsLike: z.number().describe('The "feels like" temperature in Celsius.'),
  sunrise: z.number().describe('The sunrise time, as a Unix timestamp.'),
  sunset: z.number().describe('The sunset time, as a Unix timestamp.'),
});

export const getWeatherTool = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Get the current weather for a specified city.',
    inputSchema: z.object({
      city: z.string().describe('The city to get the weather for.'),
    }),
    outputSchema: WeatherDataSchema,
  },
  async (input) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('OPENWEATHER_API_KEY is not set in the environment variables.');
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${input.city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        
        if (response.status === 404) {
             const error = new Error(`City not found: ${input.city}`) as any;
             error.status = 404;
             throw error;
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            condition: data.weather[0].main,
            city: data.name,
            country: data.sys.country,
            windSpeed: data.wind.speed,
            feelsLike: Math.round(data.main.feels_like),
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
        };
    } catch (error) {
        console.error("Error in getWeatherTool:", error);
        if ((error as any).status === 404) {
            throw error;
        }
        throw new Error(`An error occurred while fetching weather for ${input.city}`);
    }
  }
);