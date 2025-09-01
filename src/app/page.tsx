"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WeatherDisplay } from '@/components/weather-display';
import { Loader2, CloudSun } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDefaultWeather() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: 'London' }),
        });
        const result = await response.json();

        if (result.success) {
          setWeatherData(result.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An unexpected error occurred.',
        });
      }
      setIsLoading(false);
    }

    fetchDefaultWeather();
  }, [toast]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
            <CloudSun className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                WeatherWise
            </h1>
        </div>
        <p className="text-muted-foreground">
          Displaying weather for London, UK.
        </p>
        
        {isLoading && (
            <div className="mt-6 w-full max-w-md">
                 <Skeleton className="h-[320px] w-full rounded-lg" />
            </div>
        )}

        {weatherData && !isLoading && <WeatherDisplay data={weatherData} city={"London"} />}
      </div>
    </main>
  );
}
