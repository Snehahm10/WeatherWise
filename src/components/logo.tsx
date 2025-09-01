
import { Sun } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
        <Sun className="h-8 w-8 text-white" />
      </div>
      <span className="text-5xl font-bold text-white tracking-wider">WeatherWise</span>
    </div>
  );
}
