
import { Sun } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl font-bold text-white tracking-wider font-headline">WeatherWise</span>
      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
        <Sun className="h-7 w-7 text-white" />
      </div>
    </div>
  );
}
