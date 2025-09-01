"use client";

import { useState, useEffect } from 'react';
import type { displayWeatherCondition as displayWeatherConditionType } from '@/ai/flows/display-weather-condition-with-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './weather-icon';
import { Skeleton } from './ui/skeleton';

// This is a workaround to get the type of a server action
// because we can't import it directly in a client component.
const displayWeatherCondition: typeof displayWeatherConditionType = 
  (globalThis as any).displayWeatherCondition ||
  (async () => {
    const { displayWeatherCondition } = await import('@/ai/flows/display-weather-condition-with-ai');
    (globalThis as any).displayWeatherCondition = displayWeatherCondition;
    return displayWeatherCondition;
  });

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
}

interface WeatherDisplayProps {
  data: WeatherData;
  city: string;
}

interface AIData {
  description: string;
  icon: string;
}

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export function WeatherDisplay({ data, city }: WeatherDisplayProps) {
  const [aiData, setAiData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      setLoading(true);
      try {
        const fn = typeof displayWeatherCondition === 'function' ? displayWeatherCondition : await displayWeatherCondition;
        const result = await fn({
          weatherCondition: data.condition,
          timeOfDay: getTimeOfDay(),
        });
        setAiData(result);
      } catch (error) {
        console.error("AI data fetch failed:", error);
        setAiData({ description: data.condition, icon: data.condition });
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
  }, [data]);

  return (
    <Card className="mt-6 w-full max-w-md animate-in fade-in-0 duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold capitalize font-headline">{city}</CardTitle>
        {loading ? (
          <Skeleton className="h-5 w-40 mt-1" />
        ) : (
          <CardDescription className="text-base">{aiData?.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-6">
        <div className="flex items-center space-x-6">
          {loading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <WeatherIcon iconName={aiData?.icon || data.condition} className="h-24 w-24 text-accent" />
          )}
          <div className="flex items-start">
            <span className="text-8xl font-bold text-foreground">{data.temperature}</span>
            <span className="mt-3 text-2xl font-medium text-muted-foreground">&deg;C</span>
          </div>
        </div>
        <div className="text-center bg-muted/50 p-3 rounded-lg w-40">
          <p className="text-sm font-medium text-muted-foreground">Humidity</p>
          <p className="text-3xl font-semibold text-foreground">{data.humidity}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
