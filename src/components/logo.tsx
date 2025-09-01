
import { Sun } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary rounded-full">
        <Sun className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold text-white">WeatherWise</span>
    </div>
  );
}
