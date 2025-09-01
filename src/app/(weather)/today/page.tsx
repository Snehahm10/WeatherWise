
"use client";

import { useWeatherStore } from '@/app/(weather)/layout';
import { WeatherDisplay } from '@/components/weather-display';
import { Skeleton } from '@/components/ui/skeleton';

export default function TodayPage() {
  const { weatherData, isLoading } = useWeatherStore();

  if (isLoading && !weatherData) {
     return (
        <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-40 w-full rounded-lg bg-card" />
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
