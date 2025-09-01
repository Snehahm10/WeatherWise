
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';


export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex-col p-4 sm:p-8 bg-gradient-to-br from-[#0c1445] via-[#1a2e68] to-[#2c3e50] text-white">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start max-w-xl z-10">
            
            <Logo />

            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mt-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 font-headline">
              Global Weather at Your Fingertips
            </h1>
            <p className="text-lg lg:text-xl text-foreground/80 my-8">
              Stay updated with real-time weather, view a detailed 5-day forecast, and explore in-depth insights for any city worldwide—all in a clean and intuitive interface.
            </p>
            <Link href="/today">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg px-8 py-6 group">
                Check the Weather <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Image Content */}
          <div className="relative w-full max-w-lg h-80 lg:h-96 mt-8 lg:mt-0">
              <Image
                  src="https://picsum.photos/800/600"
                  alt="Weather App Screenshot"
                  fill
                  className="object-cover rounded-2xl shadow-2xl border-4 border-white/20 transform-gpu transition-transform hover:scale-105"
                  data-ai-hint="weather forecast"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
