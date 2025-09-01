
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WeatherDisplay } from '@/components/weather-display';
import { Loader2, Search, CloudSun } from 'lucide-react';
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

const getBackgroundClass = (condition: string | null) => {
  const lowerCaseCondition = condition?.toLowerCase() || '';

  if (lowerCaseCondition.includes('clear') || lowerCaseCondition.includes('sunny')) {
    return 'bg-gradient-to-br from-blue-400 to-cyan-300';
  }
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
    return 'bg-gradient-to-br from-blue-700 to-gray-600';
  }
  if (lowerCaseCondition.includes('snow')) {
    return 'bg-gradient-to-br from-indigo-400 to-purple-600';
  }
  if (lowerCaseCondition.includes('cloud')) {
    return 'bg-gradient-to-br from-gray-600 to-gray-800';
  }
  if (lowerCaseCondition.includes('storm') || lowerCaseCondition.includes('thunder')) {
    return 'bg-gradient-to-br from-gray-800 to-gray-900';
  }
  
  return 'bg-gradient-to-br from-gray-700 to-gray-900';
};


export default function Home() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const backgroundClass = useMemo(() => getBackgroundClass(weatherData?.condition || null), [weatherData?.condition]);

  const subtitles = useMemo(() => ["Check the weather 🌦️", "Plan your day 🗓️", "Stay prepared ☂️"], []);
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
    }, 3000); // Change subtitle every 3 seconds

    return () => clearInterval(interval);
  }, [subtitles.length]);

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
    setCityInput(selectedCity);

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
        setWeatherData(null);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
       setWeatherData(null);
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
    <main className={cn("flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 transition-all duration-1000", backgroundClass)}>
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
            <div className='flex items-center gap-3'>
              <CloudSun className="h-12 w-12 text-white drop-shadow-lg" />
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl font-headline">
                  Weather Wise
              </h1>
            </div>
            <p className="text-md text-white drop-shadow-lg transition-opacity duration-500">{subtitles[subtitleIndex]}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="relative flex w-full max-w-md items-center space-x-2">
          <Input 
            type="text"
            placeholder="E.g., Davangere, London, Tokyo"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onFocus={() => cityInput.length > 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="flex-1 bg-black/20 text-white placeholder:text-gray-300 border-white/30 focus:border-white focus:ring-white backdrop-blur-md"
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading} className='bg-white/20 text-white hover:bg-white/30 border-white/30 backdrop-blur-md'>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Get Weather</span>
          </Button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border border-white/20 bg-black/20 backdrop-blur-md shadow-lg z-10 overflow-hidden">
              <ul className="py-1 max-h-60">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-3 py-2 text-left text-sm text-white hover:bg-white/10 cursor-pointer"
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
                 <Skeleton className="h-[460px] w-full rounded-lg bg-white/10" />
            </div>
        )}

        {weatherData && !isLoading && <WeatherDisplay data={weatherData} />}
      </div>
    </main>
  );
}
