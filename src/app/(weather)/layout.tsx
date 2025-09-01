
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWeatherStore } from '@/store/weather-store';

interface Suggestion {
  name: string;
  country: string;
  state?: string;
  fullName: string;
}

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { 
    city, 
    setCity,
    setWeatherData, 
    setForecastData, 
    setIsLoading,
    isLoading 
  } = useWeatherStore();

  const [cityInput, setCityInput] = useState(city || 'New York');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const handleFetchWeather = useCallback(async (selectedCity: string) => {
    if (!selectedCity) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a city name.',
      });
      return;
    }
    
    setIsLoading(true);
    setCity(selectedCity);
    setSuggestions([]);
    setShowSuggestions(false);
    setCityInput(selectedCity);

    try {
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
        toast({ variant: 'destructive', title: 'Error', description: weatherResult.error });
        setWeatherData(null);
      }

      if (forecastResult.success) {
        setForecastData(forecastResult.data);
      } else {
        console.warn("Could not fetch forecast:", forecastResult.error);
        setForecastData(null);
      }

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
       setWeatherData(null);
       setForecastData(null);
    }
    setIsLoading(false);
  }, [setIsLoading, setCity, setWeatherData, setForecastData, toast]);

  useEffect(() => {
    // Fetch weather for default city on initial load
    if (!city) {
      handleFetchWeather(cityInput);
    }
  }, [city, cityInput, handleFetchWeather]);


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
      if (cityInput && cityInput !== city) {
        fetchSuggestions(cityInput);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [cityInput, fetchSuggestions, city]);

  const navLinks = [
    { href: '/today', label: 'Today' },
    { href: '/forecast', label: 'Next 5 Days' },
    { href: '/details', label: 'Forecast' },
  ];

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-8 bg-gradient-to-b from-[#0c1445] to-[#2c3e50]">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-white">
                Weather <span className="ml-1 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Forecasts</span>
            </h1>
            <p className="text-lg text-foreground/80 capitalize">
              {city}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex w-full max-w-md items-center space-x-2">
          <Input 
            type="text"
            placeholder="E.g., London, Tokyo"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onFocus={() => cityInput.length > 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="flex-1 bg-card text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary"
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading} variant="default" size="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border border-border bg-card shadow-lg z-10 overflow-hidden">
              <ul className="py-1 max-h-60">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-3 py-2 text-left text-sm text-foreground hover:bg-secondary cursor-pointer"
                    onMouseDown={(e) => { e.preventDefault(); handleFetchWeather(suggestion.name) }}
                  >
                    {suggestion.fullName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        
        <nav className="flex justify-center w-full">
            <div className="flex items-center justify-center space-x-2 rounded-full bg-card/80 p-1 backdrop-blur-sm border-border/50 shadow-lg">
                {navLinks.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    pathname === href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary/50'
                    )}
                >
                    {label}
                </Link>
                ))}
            </div>
        </nav>
        
        <div className="mt-6">
            {children}
        </div>
      </div>
    </main>
  );
}
