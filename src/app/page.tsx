
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WeatherDisplay } from '@/components/weather-display';
import { ForecastDisplay, DailyForecast } from '@/components/forecast-display';
import { Loader2, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  city: string;
  country: string;
  windSpeed: number;
  feelsLike: number;
  sunrise: number;
  sunset: number;
}

interface Suggestion {
  name: string;
  country: string;
  state?: string;
  fullName: string;
}

export default function Home() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<DailyForecast[] | null>(null);
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
    setForecastData(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setCityInput(selectedCity);

    try {
      // Fetch current weather and forecast in parallel
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch('/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: selectedCity }),
        }),
        fetch('/api/forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: selectedCity }),
        })
      ]);
      
      const weatherResult = await weatherResponse.json();
      const forecastResult = await forecastResponse.json();

      if (weatherResult.success) {
        setWeatherData(weatherResult.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: weatherResult.error,
        });
        setWeatherData(null);
      }

      if (forecastResult.success) {
        setForecastData(forecastResult.data);
      } else {
        // You might want to show a non-blocking toast for forecast errors
        console.warn("Could not fetch forecast:", forecastResult.error);
        setForecastData(null);
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
       setWeatherData(null);
       setForecastData(null);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchWeather(cityInput);
  };
  
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/suggestions?q=${query}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setSuggestions(result.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (cityInput && cityInput !== weatherData?.city) {
        fetchSuggestions(cityInput);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [cityInput, fetchSuggestions, weatherData?.city]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-8 bg-gradient-to-b from-[#0c1445] to-[#2c3e50]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center animate-in fade-in-0 duration-500">
          <h1 className="text-5xl font-bold tracking-tighter text-white">
            Weather
            <span className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Forecasts
            </span>
          </h1>
          <p className="text-lg text-foreground/80">
              Get the latest weather updates for your city.
          </p>
        </div>

        <div className='space-y-6'>
          <form onSubmit={handleSubmit} className="relative flex w-full max-w-md items-center space-x-2">
            <Input 
              type="text"
              placeholder="E.g., Davangere, London, Tokyo"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onFocus={() => cityInput.length > 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="flex-1 bg-card text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary"
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading} variant="default" size="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
              <span className="sr-only">Get Weather</span>
            </Button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full rounded-md border border-border bg-card shadow-lg z-10 overflow-hidden">
                <ul className="py-1 max-h-60">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      className="px-3 py-2 text-left text-sm text-foreground hover:bg-secondary cursor-pointer"
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
              <div className="mt-6 w-full max-w-md space-y-4">
                  <Skeleton className="h-40 w-full rounded-lg bg-card" />
                   <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-24 w-full rounded-lg bg-card" />
                      <Skeleton className="h-24 w-full rounded-lg bg-card" />
                      <Skeleton className="h-24 w-full rounded-lg bg-card" />
                      <Skeleton className="h-24 w-full rounded-lg bg-card" />
                   </div>
                   <Skeleton className="h-48 w-full rounded-lg bg-card" />
              </div>
          )}
          
          <div className="space-y-6">
            {weatherData && !isLoading && <WeatherDisplay data={weatherData} />}
            {forecastData && !isLoading && <ForecastDisplay data={forecastData} />}
          </div>

        </div>
      </div>
    </main>
  );
}
