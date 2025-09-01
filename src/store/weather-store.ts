
import { create } from 'zustand';

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

interface DailyForecast {
  date: string;
  dayOfWeek: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  condition: string;
  description: string;
}

interface WeatherState {
  city: string | null;
  weatherData: WeatherData | null;
  forecastData: DailyForecast[] | null;
  isLoading: boolean;
  setCity: (city: string) => void;
  setWeatherData: (data: WeatherData | null) => void;
  setForecastData: (data: DailyForecast[] | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  city: null,
  weatherData: null,
  forecastData: null,
  isLoading: false,
  setCity: (city) => set({ city }),
  setWeatherData: (data) => set({ weatherData: data }),
  setForecastData: (data) => set({ forecastData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
