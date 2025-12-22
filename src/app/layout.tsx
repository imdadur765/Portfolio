"use client";

import { ReactNode, useEffect, useState } from 'react';
import Lenis from 'lenis';
import './globals.css';
import MobileAlert from '@/components/MobileAlert';
import SystemStatus from '@/components/SystemStatus';
import GlitchOverlay from '@/components/GlitchOverlay';
import BootSequence from '@/components/BootSequence';
import PerformanceToggle from '@/components/PerformanceToggle';
import { DeviceCapabilityProvider, useDeviceContext } from '@/hooks/useDeviceCapability';

function LayoutContent({ children }: { children: ReactNode }) {
  const { features, performanceMode, prefersReducedMotion } = useDeviceContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only enable Lenis if smooth scroll is allowed
    if (!features.smoothScroll || prefersReducedMotion) {
      return;
    }

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
  }, [features.smoothScroll, prefersReducedMotion]);

  // Add performance mode class to body
  useEffect(() => {
    if (performanceMode || prefersReducedMotion) {
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  }, [performanceMode, prefersReducedMotion]);

  return (
    <>
      <BootSequence />
      {/* Only show noise overlay if glitch effects are enabled */}
      {features.glitchEffects && <div className="noise-overlay" />}
      <SystemStatus />
      {features.glitchEffects && <GlitchOverlay />}
      <MobileAlert />
      {isClient && <PerformanceToggle />}
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Imdadur Rahman | Creative Developer</title>
      </head>
      <body>
        <DeviceCapabilityProvider>
          <LayoutContent>{children}</LayoutContent>
        </DeviceCapabilityProvider>
      </body>
    </html>
  );
}
