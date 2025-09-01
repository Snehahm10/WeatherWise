"use client";

import { useState, useEffect, useCallback } from 'react';
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
  city: string;
  country: string;
}

interface Suggestion {
  name: string;
  country: string;
  state?: string;
  fullName: string;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const handleFetchWeather = async (selectedCity: string) => {
    if (!selectedCity) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a city name.',
      });
      return;
    }
    
    setIsLoading(true);
    setWeatherData(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setCity(selectedCity);

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: selectedCity }),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchWeather(city);
  };
  
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/suggestions?q=${query}`);
      const result = await response.json();
      if (result.success) {
        setSuggestions(result.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(city);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [city, fetchSuggestions]);

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
        
        <form onSubmit={handleSubmit} className="relative flex w-full max-w-md items-center space-x-2">
          <Input 
            type="text"
            placeholder="E.g., Davangere, London, Tokyo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => city.length > 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Get Weather</span>
          </Button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border bg-background shadow-lg z-10">
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-3 py-2 text-left text-sm text-foreground hover:bg-muted cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleFetchWeather(suggestion.name)
                    }}
                  >
                    {suggestion.fullName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {isLoading && (
            <div className="mt-6 w-full max-w-md">
                 <Skeleton className="h-[320px] w-full rounded-lg" />
            </div>
        )}

        {weatherData && !isLoading && <WeatherDisplay data={weatherData} />}
      </div>
    </main>
  );
}
