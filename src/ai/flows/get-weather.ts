import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getWeatherTool, WeatherDataSchema } from '@/ai/tools/get-weather';

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

export async function getWeatherForCityFlow(city: string) {
    return await getWeatherFlow(city);
}
