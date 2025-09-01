
"use client";

import { useWeatherStore } from '@/app/(weather)/layout';
import { TemperatureChart } from '@/components/temperature-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from '@/components/weather-icon';

export default function DetailsPage() {
  const { city, forecastData, isLoading } = useWeatherStore();

   if (isLoading && !forecastData) {
    return (
        <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-64 w-full rounded-lg bg-card" />
            <Skeleton className="h-48 w-full rounded-lg bg-card" />
        </div>
    );
  }

  if (!forecastData || !city) {
    return null;
  }

  // Mock data for popular cities
  const popularCities = [
      { name: 'New York', condition: 'Sunny', temp: 26 },
      { name: 'California', condition: 'Rainy', temp: 17 },
      { name: 'London', condition: 'Cloudy', temp: 15 },
  ]

  return (
    <div className="w-full max-w-md space-y-4 animate-in fade-in-0 duration-500">
        <TemperatureChart data={forecastData} />

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Popular Cities</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                {popularCities.map((city, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-secondary/50">
                    <div className="flex items-center gap-4">
                        <div>
                        <p className="font-semibold text-foreground">{city.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{city.condition}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                         <WeatherIcon iconName={city.condition} className="h-8 w-8 text-primary" />
                        <p className="text-2xl font-semibold text-foreground">{city.temp}&deg;</p>
                    </div>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
