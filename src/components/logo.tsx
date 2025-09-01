
import { Sun } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-foreground tracking-wider font-headline">WeatherWise</span>
      <div className="p-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md shadow-md">
        <Sun className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}
