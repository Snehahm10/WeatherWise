
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main 
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 text-center"
    >
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
            <Logo />
        </div>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tighter text-foreground sm:text-3xl md:text-4xl font-headline">
          Global Weather at Your Fingertips
        </h1>
        <p className="mx-auto mt-6 max-w-[700px] text-lg text-foreground/90 md:text-xl">
          Stay updated with real-time weather, view a detailed 5-day forecast, and explore in-depth insights for any city worldwide—all in a clean and intuitive interface.
        </p>
        <div className="mt-8">
          <Link href="/today">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg px-8 py-6 group">
              Check the Weather <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
