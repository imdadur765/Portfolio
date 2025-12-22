'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { useDeviceContext } from '@/hooks/useDeviceCapability';
import styles from './GlitchOverlay.module.css';

const GlitchOverlay = () => {
    const [isGlitching, setIsGlitching] = useState(false);
    const { playSound } = useSound();
    const { features, prefersReducedMotion } = useDeviceContext();

    useEffect(() => {
        // Skip glitch effects if disabled or reduced motion is preferred
        if (!features.glitchEffects || prefersReducedMotion) return;

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const sections = ['hero', 'about', 'work', 'contact'];

            // Detect if we entered a new section threshold
            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the top of the section is near the middle of the viewport
                    if (Math.abs(rect.top) < 50 && !isGlitching) {
                        triggerGlitch();
                    }
                }
            });

            lastScrollY = currentScrollY;
        };

        const triggerGlitch = () => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 300);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isGlitching, playSound, features.glitchEffects, prefersReducedMotion]);

    // Don't render anything if glitch effects are disabled
    if (!features.glitchEffects || prefersReducedMotion) {
        return null;
    }

    return (
        <AnimatePresence>
            {isGlitching && (
                <motion.div
                    className={styles.glitchContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Render fewer layers for better performance */}
                    <div className={styles.glitchLayer} />
                    <div className={styles.scanlines} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlitchOverlay;
