
"use client";

import { useWeatherStore } from '@/store/weather-store';
import { ForecastDisplay } from '@/components/forecast-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

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
    return (
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    <span>Data Unavailable</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    The forecast data for the selected city could not be loaded. This might be due to a missing API key in the application's configuration. Please ensure the API key is correctly set up and try again.
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <ForecastDisplay data={forecastData} city={city} />
  );
}
