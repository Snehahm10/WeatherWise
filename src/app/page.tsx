"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/today');
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#0c1445] to-[#2c3e50]">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <p className="text-lg text-foreground/80">
          Loading the weather dashboard...
        </p>
      </div>
    </main>
  );
}
