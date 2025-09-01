"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getWeatherForCity } from '@/app/actions';
import { WeatherDisplay } from '@/components/weather-display';
import { Loader2, CloudSun } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  city: z.string().min(2, {
    message: 'City name must be at least 2 characters.',
  }),
});

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [lastCity, setLastCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setWeatherData(null);
    const result = await getWeatherForCity(values.city);
    if (result.success) {
      setWeatherData(result.data);
      setLastCity(values.city);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
            <CloudSun className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                WeatherWise
            </h1>
        </div>
        <p className="text-muted-foreground">
          Enter a city name to get the latest weather updates, powered by AI.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-2 pt-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="E.g., London, New York..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Get Weather'
              )}
            </Button>
          </form>
        </Form>
        
        {isLoading && (
            <div className="mt-6 w-full max-w-md">
                 <Skeleton className="h-[320px] w-full rounded-lg" />
            </div>
        )}

        {weatherData && !isLoading && <WeatherDisplay data={weatherData} city={lastCity} />}
      </div>
    </main>
  );
}
