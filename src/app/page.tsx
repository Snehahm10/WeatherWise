
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main 
      className="relative min-h-screen w-full p-4 sm:p-8 text-foreground"
    >
      {/* Top Left Content */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 text-left max-w-xl z-10">
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground font-headline">
          Global Weather at Your Fingertips
        </h1>
        <p className="text-lg lg:text-xl text-foreground/90 my-8">
          Stay updated with real-time weather, view a detailed 5-day forecast, and explore in-depth insights for any city worldwide—all in a clean and intuitive interface.
        </p>
        <Link href="/today">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg px-8 py-6 group">
            Check the Weather <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Bottom Right Logo */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8">
        <Logo />
      </div>
    </main>
  );
}
