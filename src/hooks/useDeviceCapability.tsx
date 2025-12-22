'use client';

import { useState, useEffect, useCallback } from 'react';

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface DeviceFeatures {
    particles: boolean;
    particleCount: number;
    magnetic3D: boolean;
    smoothScroll: boolean;
    glitchEffects: boolean;
    layerCount: number;
    typingSpeed: number;
    floatingAnimations: boolean;
}

export interface DeviceCapability {
    tier: PerformanceTier;
    score: number;
    isMobile: boolean;
    features: DeviceFeatures;
    performanceMode: boolean;
    setPerformanceMode: (enabled: boolean) => void;
    prefersReducedMotion: boolean;
}

const PERFORMANCE_MODE_KEY = 'portfolio_performance_mode';

function calculatePerformanceScore(): { score: number; isMobile: boolean } {
    if (typeof window === 'undefined') {
        return { score: 100, isMobile: false };
    }

    let score = 100;
    let isMobile = false;

    // Check if mobile device
    const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i;
    isMobile = mobileRegex.test(navigator.userAgent);

    if (isMobile) {
        score -= 30;
    }

    // Check screen size
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        score -= 15;
    } else if (screenWidth < 1024) {
        score -= 5;
    }

    // Check CPU cores (if available)
    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 2) {
        score -= 25;
    } else if (cores <= 4) {
        score -= 10;
    }

    // Check device memory (if available - Chrome only)
    const memory = (navigator as any).deviceMemory;
    if (memory !== undefined) {
        if (memory <= 2) {
            score -= 20;
        } else if (memory <= 4) {
            score -= 10;
        }
    }

    // Check connection type (if available)
    const connection = (navigator as any).connection;
    if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
            score -= 15;
        } else if (effectiveType === '3g') {
            score -= 5;
        }
    }

    // Check if low-power mode or battery saving (if available)
    if ('getBattery' in navigator) {
        // We can't await here, so we'll just reduce score slightly for battery-powered devices
        score -= 5;
    }

    return { score: Math.max(0, Math.min(100, score)), isMobile };
}

function getTierFromScore(score: number): PerformanceTier {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

function getFeaturesForTier(tier: PerformanceTier, performanceMode: boolean, prefersReducedMotion: boolean): DeviceFeatures {
    // If user prefers reduced motion or performance mode is on, use minimal features
    if (prefersReducedMotion || performanceMode) {
        return {
            particles: false,
            particleCount: 0,
            magnetic3D: false,
            smoothScroll: false,
            glitchEffects: false,
            layerCount: 2,
            typingSpeed: 100,
            floatingAnimations: false,
        };
    }

    switch (tier) {
        case 'high':
            return {
                particles: true,
                particleCount: 80,
                magnetic3D: true,
                smoothScroll: true,
                glitchEffects: true,
                layerCount: 8,
                typingSpeed: 40,
                floatingAnimations: true,
            };
        case 'medium':
            return {
                particles: true,
                particleCount: 40,
                magnetic3D: false,
                smoothScroll: true,
                glitchEffects: true,
                layerCount: 4,
                typingSpeed: 60,
                floatingAnimations: true,
            };
        case 'low':
            return {
                particles: true,
                particleCount: 15,
                magnetic3D: false,
                smoothScroll: false,
                glitchEffects: false,
                layerCount: 3,
                typingSpeed: 80,
                floatingAnimations: false,
            };
    }
}

export function useDeviceCapability(): DeviceCapability {
    const [performanceMode, setPerformanceModeState] = useState(true); // Default to performance mode ON
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<{ score: number; isMobile: boolean }>({ score: 100, isMobile: false });

    useEffect(() => {
        // Check localStorage for performance mode preference (user can override default)
        const savedMode = localStorage.getItem(PERFORMANCE_MODE_KEY);
        if (savedMode !== null) {
            setPerformanceModeState(savedMode === 'true');
        }

        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleMotionChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleMotionChange);

        // Calculate device score
        setDeviceInfo(calculatePerformanceScore());

        // Re-calculate on resize
        const handleResize = () => {
            setDeviceInfo(calculatePerformanceScore());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            mediaQuery.removeEventListener('change', handleMotionChange);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const setPerformanceMode = useCallback((enabled: boolean) => {
        setPerformanceModeState(enabled);
        localStorage.setItem(PERFORMANCE_MODE_KEY, String(enabled));
    }, []);

    const tier = getTierFromScore(deviceInfo.score);
    const features = getFeaturesForTier(tier, performanceMode, prefersReducedMotion);

    return {
        tier,
        score: deviceInfo.score,
        isMobile: deviceInfo.isMobile,
        features,
        performanceMode,
        setPerformanceMode,
        prefersReducedMotion,
    };
}

// Create a context for global access
import { createContext, useContext, ReactNode } from 'react';

const DeviceCapabilityContext = createContext<DeviceCapability | null>(null);

export function DeviceCapabilityProvider({ children }: { children: ReactNode }) {
    const capability = useDeviceCapability();

    return (
        <DeviceCapabilityContext.Provider value={capability}>
            {children}
        </DeviceCapabilityContext.Provider>
    );
}

export function useDeviceContext(): DeviceCapability {
    const context = useContext(DeviceCapabilityContext);
    if (!context) {
        // Return default high-end values if not in provider (SSR fallback)
        return {
            tier: 'high',
            score: 100,
            isMobile: false,
            features: {
                particles: true,
                particleCount: 80,
                magnetic3D: true,
                smoothScroll: true,
                glitchEffects: true,
                layerCount: 8,
                typingSpeed: 40,
                floatingAnimations: true,
            },
            performanceMode: false,
            setPerformanceMode: () => { },
            prefersReducedMotion: false,
        };
    }
    return context;
}
