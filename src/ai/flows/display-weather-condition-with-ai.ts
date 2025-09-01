'use server';
/**
 * @fileOverview A weather condition display AI agent that picks the appropriate
 * text and icon based on the current time of day.
 *
 * - displayWeatherCondition - A function that handles the weather condition display process.
 * - DisplayWeatherConditionInput - The input type for the displayWeatherCondition function.
 * - DisplayWeatherConditionOutput - The return type for the displayWeatherCondition function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const DisplayWeatherConditionInputSchema = z.object({
  weatherCondition: z.string().describe('The current weather condition (e.g., sunny, cloudy, rainy).'),
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
});
export type DisplayWeatherConditionInput = z.infer<typeof DisplayWeatherConditionInputSchema>;

const DisplayWeatherConditionOutputSchema = z.object({
  description: z.string().describe('A descriptive text of the weather condition, appropriate for the time of day.'),
  icon: z.string().describe('A corresponding icon representing the weather condition, appropriate for the time of day.'),
});
export type DisplayWeatherConditionOutput = z.infer<typeof DisplayWeatherConditionOutputSchema>;

export async function displayWeatherCondition(input: DisplayWeatherConditionInput): Promise<DisplayWeatherConditionOutput> {
  return displayWeatherConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayWeatherConditionPrompt',
  input: {schema: DisplayWeatherConditionInputSchema},
  output: {schema: DisplayWeatherConditionOutputSchema},
  prompt: `You are a weather expert who provides concise and friendly weather descriptions and icon suggestions based on the current weather condition and time of day.

Weather Condition: {{{weatherCondition}}}
Time of Day: {{{timeOfDay}}}

Provide a short, engaging description of the weather condition that is appropriate for the time of day. Also suggest an icon to represent the weather condition, appropriate for the time of day. Do not mention the time of day in the description; the user already knows it.
`,
});

const displayWeatherConditionFlow = ai.defineFlow(
  {
    name: 'displayWeatherConditionFlow',
    inputSchema: DisplayWeatherConditionInputSchema,
    outputSchema: DisplayWeatherConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {model: googleAI.model('gemini-1.5-flash')});
    return output!;
  }
);
