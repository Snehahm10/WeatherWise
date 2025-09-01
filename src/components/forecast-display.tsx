
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
}

export function ForecastDisplay({ data }: ForecastDisplayProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ul className="space-y-3">
          {data.map((day, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-secondary/50">
              <div className="flex items-center gap-4">
                <WeatherIcon iconName={day.condition} className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{day.dayOfWeek}</p>
                  <p className="text-sm text-muted-foreground capitalize">{day.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{day.temp_max}&deg; / {day.temp_min}&deg;</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
