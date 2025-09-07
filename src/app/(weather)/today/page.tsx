
"use client";

import { useWeatherStore } from '@/store/weather-store';
import { WeatherDisplay } from '@/components/weather-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function TodayPage() {
  const { weatherData, isLoading } = useWeatherStore();

  if (isLoading && !weatherData) {
     return (
        <div className="w-full max-w-md space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <Skeleton className="h-8 w-48 rounded-md bg-muted" />
                    <Skeleton className="h-5 w-40 rounded-md bg-muted" />
                </div>
                <div className="flex items-center justify-center my-6 space-x-4">
                    <Skeleton className="h-24 w-24 rounded-full bg-muted" />
                    <Skeleton className="h-20 w-32 rounded-md bg-muted" />
                </div>
            </Card>
             <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full rounded-lg bg-card" />
                <Skeleton className="h-24 w-full rounded-lg bg-card" />
                <Skeleton className="h-24 w-full rounded-lg bg-card" />
                <Skeleton className="h-24 w-full rounded-lg bg-card" />
             </div>
        </div>
    );
  }

  if (!weatherData) {
    return null; // Or some placeholder/error state
  }

  return (
      <WeatherDisplay data={weatherData} />
  );
}
