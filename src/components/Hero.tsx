"use client";

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const titleContainer = titleContainerRef.current;
        if (!canvas || !container || !titleContainer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize per-layer magnetic setters
        const layerSetters = layerRefs.current.map(layer => {
            if (!layer) return null;
            return {
                x: gsap.quickTo(layer, "x", { duration: 0.6, ease: "power2.out" }),
                y: gsap.quickTo(layer, "y", { duration: 0.6, ease: "power2.out" }),
                rotateY: gsap.quickTo(layer, "rotateY", { duration: 0.8, ease: "power2.out" }),
                rotateX: gsap.quickTo(layer, "rotateX", { duration: 0.8, ease: "power2.out" })
            };
        }).filter(Boolean);

        const handleMove = (x: number, y: number) => {
            const rect = container.getBoundingClientRect();
            const mouseX = (x - rect.left) / rect.width;
            const mouseY = (y - rect.top) / rect.height;

            const pullStrength = 80; // How far the text stretches

            layerSetters.forEach((setter, index) => {
                if (!setter) return;
                // Deeper layers (index 0-3) move less, front layers (index 4-7) move more
                const factor = (index / (layerSetters.length - 1)) * pullStrength;

                setter.x((mouseX - 0.5) * factor);
                setter.y((mouseY - 0.5) * factor);

                // Keep some rotation for 3D feel
                setter.rotateY((mouseX - 0.5) * 20);
                setter.rotateX((mouseY - 0.5) * -20);
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            handleMove(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        // Canvas Particle Logic
        let particles: any[] = [];
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
            for (let i = 0; i < 150; i++) particles.push(new Particle(canvas.width, canvas.height));
        };

        const animateCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrameId = requestAnimationFrame(animateCanvas);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        resize();
        initCanvas();
        animateCanvas();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const name = "IMDADUR RAHMAN";

    return (
        <section className={styles.hero} ref={containerRef}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.overlay} />

            <div className={styles.content}>
                <div className={styles.titleWrapper} ref={titleContainerRef}>
                    {/* 8-Layer Magnetic Extrusion Stack */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            ref={el => { layerRefs.current[i] = el; }}
                            className={`${styles.titleLayer} ${styles[`layer${i + 1}`]}`}
                        >
                            {name}
                        </div>
                    ))}
                </div>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    Creative Developer <span className={styles.dot}>•</span> Designer <span className={styles.dot}>•</span> Visionary
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className={styles.ctaWrapper}
                >
                    <button className={styles.ctaButton}>
                        <span className={styles.ctaText}>Start Experience</span>
                        <div className={styles.ctaBlob} />
                    </button>
                </motion.div>
            </div>

            <div className={styles.scrollIndicator}>
                <div className={styles.line} />
                <span className={styles.scrollText}>SCROLL</span>
            </div>
        </section>
    );
}
