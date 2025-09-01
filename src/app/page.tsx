"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /today page
    router.replace('/today');
  }, [router]);

  // Render a loading state or null while redirecting
  return null;
}
