"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WeatherDisplay } from '@/components/weather-display';
import { Loader2, CloudSun, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a city name.',
      });
      return;
    }
    
    setIsLoading(true);
    setWeatherData(null);
    setSubmittedCity(city);

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
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
  };

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
          Enter a city to get the latest weather.
        </p>
        
        <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center space-x-2">
          <Input 
            type="text"
            placeholder="E.g., New York, London, Tokyo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Get Weather</span>
          </Button>
        </form>

        {isLoading && (
            <div className="mt-6 w-full max-w-md">
                 <Skeleton className="h-[320px] w-full rounded-lg" />
            </div>
        )}

        {weatherData && !isLoading && <WeatherDisplay data={weatherData} city={submittedCity} />}
      </div>
    </main>
  );
}
