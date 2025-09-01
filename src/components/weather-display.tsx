
"use client";

import { useState, useEffect } from 'react';
import { WeatherIcon } from './weather-icon';
import { Skeleton } from './ui/skeleton';
import { Sunrise, Sunset, Wind, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
           if (typeof result.error === 'string' && (result.error.includes('429') || result.error.includes('quota'))) {
            console.warn("AI data fetch failed (Rate Limit Exceeded). Falling back to basic data.");
          } else {
            console.error("AI data fetch failed:", result.error);
          }
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
  
  const weatherDetails = [
    {
      title: 'Sunrise & Sunset',
      icon: Sunrise,
      content: (
          <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                  <Sunrise className="h-5 w-5" />
                  <p className="font-semibold">{formatTime(data.sunrise)}</p>
              </div>
              <div className='flex items-center gap-2'>
                  <Sunset className="h-5 w-5" />
                  <p className="font-semibold">{formatTime(data.sunset)}</p>
              </div>
          </div>
      )
    },
    {
      title: 'Feels Like',
      icon: Thermometer,
      content: <p className="text-3xl font-bold">{data.feelsLike}&deg;C</p>
    },
    {
      title: 'Wind',
      icon: Wind,
      content: <p className="text-3xl font-bold">{data.windSpeed} m/s</p>
    },
    {
      title: 'Humidity',
      icon: Droplets,
      content: <p className="text-3xl font-bold">{data.humidity}%</p>
    },
  ];

  return (
    <div className="w-full max-w-md animate-in fade-in-0 duration-500 space-y-4">
      {/* Main weather card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold tracking-tight capitalize">{`${data.city}, ${data.country}`}</h2>
            {isAiLoading ? (
                <Skeleton className="h-5 w-48 mt-1 mx-auto bg-muted" />
            ) : (
                <p className="text-base text-muted-foreground">{aiData?.description}</p>
            )}

            <div className="flex items-center justify-center my-6 space-x-4">
              {isAiLoading ? (
                <Skeleton className="h-24 w-24 rounded-full bg-muted" />
              ) : (
                <WeatherIcon iconName={aiData?.icon || data.condition} className="h-24 w-24 drop-shadow-lg text-primary" />
              )}
              <div className="flex items-start">
                <span className="text-8xl font-bold tracking-tighter">{data.temperature}</span>
                <span className="mt-2 text-2xl font-medium">&deg;C</span>
              </div>
            </div>
        </CardContent>
      </Card>
      
      {/* Grid for extra details */}
      <div className="grid grid-cols-2 gap-4">
        {weatherDetails.map((detail, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <detail.icon className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{detail.title}</p>
              </div>
              {detail.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
