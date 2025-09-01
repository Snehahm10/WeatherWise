'use server';

// Mock data to simulate API responses
const weatherData: { [city: string]: { temperature: number; humidity: number; condition: string; } } = {
  'london': { temperature: 15, humidity: 70, condition: 'Cloudy' },
  'new york': { temperature: 22, humidity: 55, condition: 'Sunny' },
  'tokyo': { temperature: 28, humidity: 80, condition: 'Rainy' },
  'paris': { temperature: 18, humidity: 65, condition: 'Partly cloudy' },
  'sydney': { temperature: 25, humidity: 60, condition: 'Sunny' },
};

export async function getWeatherForCity(city: string): Promise<{ success: true; data: any } | { success: false; error: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  const normalizedCity = city.toLowerCase().trim();

  if (weatherData[normalizedCity]) {
    return {
      success: true,
      data: weatherData[normalizedCity],
    };
  }

  return {
    success: false,
    error: 'City not found. Please try London, New York, Tokyo, Paris, or Sydney.',
  };
}
