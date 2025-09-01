/**
 * @fileOverview A tool to fetch 5-day weather forecast data.
 * This file defines a Genkit tool for fetching a 5-day weather forecast.
 *
 * - getForecastTool - A Genkit tool for fetching forecast data.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for a single day's forecast
export const DailyForecastSchema = z.object({
  date: z.string().describe("The date of the forecast in 'YYYY-MM-DD' format."),
  dayOfWeek: z.string().describe("The day of the week (e.g., 'Monday')."),
  temp: z.number().describe('The average temperature for the day in Celsius.'),
  temp_min: z.number().describe('The minimum temperature for the day in Celsius.'),
  temp_max: z.number().describe('The maximum temperature for the day in Celsius.'),
  condition: z.string().describe('The main weather condition (e.g., "Rain", "Clouds").'),
  description: z.string().describe('A more detailed weather description (e.g., "light rain").'),
});

// Schema for the entire 5-day forecast
export const ForecastDataSchema = z.array(DailyForecastSchema);

export const getForecastTool = ai.defineTool(
  {
    name: 'get5DayForecast',
    description: 'Get the 5-day weather forecast for a specified city.',
    inputSchema: z.object({
      city: z.string().describe('The city to get the forecast for.'),
    }),
    outputSchema: ForecastDataSchema,
  },
  async (input) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('The OPENWEATHER_API_KEY is not set in the environment variables. Please add it to your hosting provider configuration.');
        }

        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${input.city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        
        if (response.status === 404) {
             const error = new Error(`City not found: ${input.city}`) as any;
             error.status = 404;
             throw error;
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch forecast data: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Process the 3-hour interval data to get one forecast per day
        const dailyData: { [key: string]: any } = {};

        data.list.forEach((item: any) => {
            const date = item.dt_txt.split(' ')[0]; // Get YYYY-MM-DD
            if (!dailyData[date]) {
                dailyData[date] = {
                    temps: [],
                    conditions: {},
                    descriptions: {},
                    date: date,
                };
            }
            dailyData[date].temps.push(item.main.temp);
            
            // Count condition occurrences to find the most frequent one
            const condition = item.weather[0].main;
            const description = item.weather[0].description;
            dailyData[date].conditions[condition] = (dailyData[date].conditions[condition] || 0) + 1;
            dailyData[date].descriptions[description] = (dailyData[date].descriptions[description] || 0) + 1;
        });

        const formattedForecast = Object.values(dailyData).slice(0, 5).map(day => {
            const temps = day.temps as number[];
            const temp_max = Math.round(Math.max(...temps));
            const temp_min = Math.round(Math.min(...temps));
            const temp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);

            // Find the most frequent condition and description
            const mostFrequent = (obj: {[key: string]: number}) => Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
            const condition = mostFrequent(day.conditions);
            const description = mostFrequent(day.descriptions);

            const dateObj = new Date(day.date);
            // Ensure correct timezone offset when creating date string
            const dayOfWeek = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000).toLocaleDateString('en-US', { weekday: 'long' });

            return {
                date: day.date,
                dayOfWeek,
                temp,
                temp_min,
                temp_max,
                condition,
                description,
            };
        });
        
        return formattedForecast;

    } catch (error) {
        console.error("Error in getForecastTool:", error);
        if ((error as any).status === 404) {
            throw error;
        }
        throw new Error(`An error occurred while fetching forecast for ${input.city}`);
    }
  }
);
