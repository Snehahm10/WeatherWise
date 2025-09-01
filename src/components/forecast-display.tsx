
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './weather-icon';

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  condition: string;
  description: string;
}

interface ForecastDisplayProps {
  data: DailyForecast[];
  city: string;
}

export function ForecastDisplay({ data, city }: ForecastDisplayProps) {
  if (!data || data.length === 0) {
    return null;
  }
  
  const tomorrow = data[0];

  return (
    <div className="w-full max-w-md animate-in fade-in-0 duration-500 space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
         <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold tracking-tight capitalize">Tomorrow</h2>
            <p className="text-base text-muted-foreground capitalize">{tomorrow.description}</p>

            <div className="flex items-center justify-center my-4 space-x-4">
              <WeatherIcon iconName={tomorrow.condition} className="h-20 w-20 drop-shadow-lg text-primary" />
              <div className="flex items-start">
                <span className="text-6xl font-bold tracking-tighter">{tomorrow.temp_max}&deg;/{tomorrow.temp_min}&deg;</span>
              </div>
            </div>
        </CardContent>
      </Card>
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-4 pt-4">
          <ul className="space-y-3">
            {data.map((day, index) => (
              <li key={index} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-secondary/50">
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-foreground w-24">{day.dayOfWeek}</p>
                  <WeatherIcon iconName={day.condition} className="h-8 w-8 text-primary" />
                  <p className="text-sm text-muted-foreground capitalize">{day.condition}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{day.temp_max}&deg; / {day.temp_min}&deg;</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
