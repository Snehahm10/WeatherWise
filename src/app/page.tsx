
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main 
      className="relative min-h-screen w-full flex-col p-4 sm:p-8 text-foreground bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgba(135, 206, 250, 0.7), rgba(173, 216, 230, 0.5)), url('https://picsum.photos/seed/clouds-only-2/1200/800')"
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="container mx-auto flex flex-col items-center justify-between gap-12 text-center">
          {/* Text Content */}
          <div className="flex flex-col items-center max-w-xl z-10">
            
            <Logo />

            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mt-12 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground font-headline">
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
        </div>
      </div>
    </main>
  );
}
