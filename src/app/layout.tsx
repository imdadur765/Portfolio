"use client";

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import './globals.css';
import MobileAlert from '@/components/MobileAlert';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Imdadur Rahman | Creative Developer</title>
      </head>
      <body>
        <div className="noise-overlay" />
        <MobileAlert />
        {children}
      </body>
    </html>
  );
}
