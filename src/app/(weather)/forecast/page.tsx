
"use client";

import { useWeatherStore } from '@/app/(weather)/layout';
import { ForecastDisplay } from '@/components/forecast-display';
import { Skeleton } from '@/components/ui/skeleton';

export default function ForecastPage() {
  const { city, forecastData, isLoading } = useWeatherStore();

  if (isLoading && !forecastData) {
    return (
        <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-48 w-full rounded-lg bg-card" />
            <Skeleton className="h-64 w-full rounded-lg bg-card" />
        </div>
    );
  }
  
  if (!forecastData || !city) {
    return null;
  }

  return (
    <ForecastDisplay data={forecastData} city={city} />
  );
}
