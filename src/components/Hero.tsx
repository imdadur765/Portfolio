"use client";

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useDeviceContext } from '@/hooks/useDeviceCapability';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { features, prefersReducedMotion } = useDeviceContext();

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const titleContainer = titleContainerRef.current;
        if (!canvas || !container || !titleContainer) return;

        // Skip heavy effects if reduced motion is preferred
        if (prefersReducedMotion) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Lightweight magnetic effect for title (always enabled, uses CSS transforms only)
        const titleMagnetic = {
            x: gsap.quickTo(titleContainer, "x", { duration: 0.4, ease: "power2.out" }),
            y: gsap.quickTo(titleContainer, "y", { duration: 0.4, ease: "power2.out" }),
        };

        // Only initialize heavy 3D effects if enabled
        let layerSetters: any[] = [];
        if (features.magnetic3D) {
            layerSetters = layerRefs.current.map(layer => {
                if (!layer) return null;
                return {
                    x: gsap.quickTo(layer, "x", { duration: 0.6, ease: "power2.out" }),
                    y: gsap.quickTo(layer, "y", { duration: 0.6, ease: "power2.out" }),
                    rotateY: gsap.quickTo(layer, "rotateY", { duration: 0.8, ease: "power2.out" }),
                    rotateX: gsap.quickTo(layer, "rotateX", { duration: 0.8, ease: "power2.out" })
                };
            }).filter(Boolean);
        }

        const handleMove = (x: number, y: number) => {
            const rect = container.getBoundingClientRect();
            const titleRect = titleContainer.getBoundingClientRect();

            const mouseX = (x - rect.left) / rect.width;
            const mouseY = (y - rect.top) / rect.height;

            (window as any)._lastMouseX = x;
            (window as any)._lastMouseY = y;

            const centerX = titleRect.left + titleRect.width / 2;
            const centerY = titleRect.top + titleRect.height / 2;
            const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            // Lightweight magnetic effect - always active (attracts text to cursor)
            const magnetLimit = 400;
            if (dist < magnetLimit) {
                const magnetStrength = 15; // Subtle but noticeable
                titleMagnetic.x((mouseX - 0.5) * magnetStrength);
                titleMagnetic.y((mouseY - 0.5) * magnetStrength);
            }

            // Heavy 3D effects - only if enabled
            if (features.magnetic3D) {
                const pullStrength = 80;
                const limit = 600;

                layerSetters.forEach((setter, index) => {
                    if (!setter) return;

                    let targetX = 0;
                    let targetY = 0;
                    let targetRotY = 0;
                    let targetRotX = 0;

                    if (dist < limit) {
                        const factor = (index / (layerSetters.length - 1)) * pullStrength;
                        targetX = (mouseX - 0.5) * factor;
                        targetY = (mouseY - 0.5) * factor;
                        targetRotY = (mouseX - 0.5) * 20;
                        targetRotX = (mouseY - 0.5) * -20;
                    }

                    setter.x(targetX);
                    setter.y(targetY);
                    setter.rotateY(targetRotY);
                    setter.rotateX(targetRotX);
                });
            }
        };

        const handleMouseLeave = () => {
            // Reset lightweight magnetic effect
            titleMagnetic.x(0);
            titleMagnetic.y(0);

            // Reset heavy 3D effects if enabled
            if (features.magnetic3D) {
                layerSetters.forEach(setter => {
                    if (!setter) return;
                    setter.x(0);
                    setter.y(0);
                    setter.rotateY(0);
                    setter.rotateX(0);
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            handleMove(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        // Canvas Particle Logic - only if particles are enabled
        let particles: Particle[] = [];
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number; y: number; size: number; speedX: number; speedY: number; color: string; width: number; height: number;
            constructor(w: number, h: number) {
                this.width = w; this.height = h;
                this.x = Math.random() * w; this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = Math.random() > 0.5 ? '#ff007f' : '#00f3ff';
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;

                // Only apply magnetic attraction if 3D effects are enabled
                if (features.magnetic3D) {
                    const mX = (window as any)._lastMouseX || 0;
                    const mY = (window as any)._lastMouseY || 0;
                    const dx = mX - this.x;
                    const dy = mY - this.y;
                    const distSq = dx * dx + dy * dy;
                    const radiusSq = 300 * 300;

                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq);
                        const force = (300 - dist) / 300;
                        this.x += dx * force * 0.04;
                        this.y += dy * force * 0.04;
                    }
                }

                if (this.x > this.width) this.x = 0; else if (this.x < 0) this.x = this.width;
                if (this.y > this.height) this.y = 0; else if (this.y < 0) this.y = this.height;
            }
            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color; ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }

        const initCanvas = () => {
            particles = [];
            // Use dynamic particle count from device capability
            const count = features.particleCount;
            for (let i = 0; i < count; i++) particles.push(new Particle(canvas.width, canvas.height));
        };

        const animateCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrameId = requestAnimationFrame(animateCanvas);
        };

        // Always attach mouse events for lightweight magnetic effect
        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchmove', handleTouchMove);

        // Set up canvas and particles if enabled
        if (features.particles) {
            window.addEventListener('resize', resize);
            resize();
            initCanvas();
            animateCanvas();
        }

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchmove', handleTouchMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [features, prefersReducedMotion]);

    const name = "IMDADUR RAHMAN";
    const layerCount = features.layerCount;

    return (
        <section className={styles.hero} ref={containerRef}>
            {features.particles && <canvas ref={canvasRef} className={styles.canvas} />}
            <div className={styles.overlay} />

            <div className={styles.content}>
                <div className={styles.titleWrapper} ref={titleContainerRef}>
                    {/* Dynamic layer count based on device capability */}
                    {[...Array(layerCount)].map((_, i) => (
                        <div
                            key={i}
                            ref={el => { layerRefs.current[i] = el; }}
                            className={`${styles.titleLayer} ${styles[`layer${i + 1}`]} ${i % 2 !== 0 ? styles.mobileHide : ''}`}
                        >
                            {name}
                        </div>
                    ))}
                </div>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 1, duration: prefersReducedMotion ? 0 : 1 }}
                >
                    Creative Developer <span className={styles.dot}>•</span> Designer <span className={styles.dot}>•</span> Visionary
                </motion.p>

                {/* Under Construction Notice */}
                <motion.div
                    className={styles.constructionBanner}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 1.2, duration: prefersReducedMotion ? 0 : 0.5 }}
                >
                    <span className={styles.constructionIcon}>🚧</span>
                    <span className={styles.constructionText}>UNDER CONSTRUCTION</span>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '30%' }} />
                    </div>
                    <span className={styles.progressText}>30% COMPLETE</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 1.5, duration: prefersReducedMotion ? 0 : 1 }}
                    className={styles.ctaWrapper}
                >
                    <button className={styles.ctaButton}>
                        <span className={styles.ctaText}>Start Experience</span>
                        <div className={styles.ctaBlob} />
                    </button>
                </motion.div>

                <motion.div
                    className={styles.systemAdvisory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 1.8, duration: prefersReducedMotion ? 0 : 0.8 }}
                >
                    <span className={styles.advisoryHeader}>SYSTEM_ADVISORY //</span> This interface is a functional prototype. Architectural integrity: 30%. True custom engineering takes time I don&apos;t build fake, drag-and-drop WordPress templates. Expect deep-system upgrades in forthcoming cycles. Built for stability, destined for evolution.
                </motion.div>
            </div>

            <div className={styles.scrollIndicator}>
                <div className={styles.line} />
                <span className={styles.scrollText}>SCROLL</span>
            </div>
        </section>
    );
}
