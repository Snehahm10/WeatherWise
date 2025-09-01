"use client";

import { useState, useEffect } from 'react';
import { WeatherIcon } from './weather-icon';
import { Skeleton } from './ui/skeleton';
import { Sunrise, Sunset, Wind, Thermometer } from 'lucide-react';

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

interface WeatherDisplayProps {
  data: WeatherData;
}

interface AIData {
  description: string;
  icon: string;
}

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  const [aiData, setAiData] = useState<AIData | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    if (!data.condition) {
      setAiData({ description: 'Weather data unavailable', icon: 'cloud' });
      setIsAiLoading(false);
      return;
    };
  
    const fetchAIData = async () => {
      setIsAiLoading(true);
      try {
        const response = await fetch("/api/ai-weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weatherCondition: data.condition,
            timeOfDay: getTimeOfDay(),
          }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          setAiData(result.data);
        } else {
          console.error("AI data fetch failed:", result.error);
          setAiData({ description: data.condition, icon: data.condition });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setAiData({ description: data.condition, icon: data.condition });
      } finally {
        setIsAiLoading(false);
      }
    };
  
    fetchAIData();
  }, [data.condition]);

  return (
    <div className="mt-6 w-full max-w-md animate-in fade-in-0 duration-500 bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white">
      <div className="p-6 md:p-8 flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight capitalize font-headline">{`${data.city}, ${data.country}`}</h2>
            {isAiLoading ? (
                <Skeleton className="h-5 w-48 mt-2 mx-auto bg-white/20" />
            ) : (
                <p className="text-lg text-white/80">{aiData?.description}</p>
            )}
        </div>
        
        {/* Main Temp */}
        <div className="flex items-center justify-center space-x-6">
          {isAiLoading ? (
            <Skeleton className="h-28 w-28 rounded-full bg-white/20" />
          ) : (
            <WeatherIcon iconName={aiData?.icon || data.condition} className="h-28 w-28 drop-shadow-lg" />
          )}
          <div className="flex items-start">
            <span className="text-8xl font-bold tracking-tighter">{data.temperature}</span>
            <span className="mt-2 text-2xl font-medium">&deg;C</span>
          </div>
        </div>
        
        {/* Extra Details Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20 text-left">
          <div className="flex items-center gap-3">
            <Thermometer className="h-6 w-6 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Feels Like</p>
              <p className="text-xl font-semibold">{data.feelsLike}&deg;C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="h-6 w-6 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Wind</p>
              <p className="text-xl font-semibold">{data.windSpeed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sunrise className="h-6 w-6 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Sunrise</p>
              <p className="text-xl font-semibold">{formatTime(data.sunrise)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sunset className="h-6 w-6 text-white/80" />
            <div>
              <p className="text-sm text-white/80">Sunset</p>
              <p className="text-xl font-semibold">{formatTime(data.sunset)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}