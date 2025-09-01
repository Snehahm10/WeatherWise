"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#0c1445] to-[#2c3e50]">
      <div className="flex flex-col items-center justify-center gap-6 text-center animate-in fade-in-0 duration-1000">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
          Welcome to WeatherWise
        </h1>
        <p className="max-w-md text-lg text-foreground/80">
          Get real-time weather forecasts and detailed insights for any city in the world.
        </p>
        <Link href="/today">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
