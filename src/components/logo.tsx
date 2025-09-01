
import { Sun } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
        <Sun className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-white tracking-wider font-headline">WeatherWise</span>
    </div>
  );
}
