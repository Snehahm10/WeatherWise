"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './weather-icon';
import { Skeleton } from './ui/skeleton';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  city: string;
  country: string;
}

interface WeatherDisplayProps {
  data: WeatherData;
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

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  const [aiData, setAiData] = useState<AIData | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    if (!data.condition) {
      setAiData({ description: 'Weather data unavailable', icon: 'cloud' });
      setIsAiLoading(false);
      return;
    };
  
    const fetchAIData = async () => {
      setIsAiLoading(true);
      try {
        const response = await fetch("/api/ai-weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weatherCondition: data.condition,
            timeOfDay: getTimeOfDay(),
          }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          setAiData(result.data);
        } else {
          console.error("AI data fetch failed:", result.error);
          setAiData({ description: data.condition, icon: data.condition });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setAiData({ description: data.condition, icon: data.condition });
      } finally {
        setIsAiLoading(false);
      }
    };
  
    fetchAIData();
  }, [data.condition]);

  return (
    <Card className="mt-6 w-full max-w-md animate-in fade-in-0 duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold capitalize font-headline">{`${data.city}, ${data.country}`}</CardTitle>
        {isAiLoading ? (
          <Skeleton className="h-5 w-40 mt-1" />
        ) : (
          <CardDescription className="text-base">{aiData?.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-6">
        <div className="flex items-center space-x-6">
          {isAiLoading ? (
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
