"use client";

import styles from './Character.module.css';
import { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { useDeviceContext } from '@/hooks/useDeviceCapability';

gsap.registerPlugin(ScrollTrigger);

const skills = [
    { name: "FLUTTER ARCHITECT", level: "95%", icon: "📱" },
    { name: "NEXT.JS NINJA", level: "90%", icon: "⚡" },
    { name: "UI/UX DESIGNER", level: "85%", icon: "🎨" },
    { name: "3D WEB EXPERT", level: "80%", icon: "🧊" },
];

// Isolated Terminal Component - Only this re-renders during typing
const TerminalText = memo(function TerminalText({ typingSpeed }: { typingSpeed: number }) {
    const [terminalText, setTerminalText] = useState("");
    const { playSound } = useSound();

    const fullText = `> ID: IMDADUR_RAHMAN
> ROLE: ARCHITECT // NINJA

[SUMMARY]
Architecting scalable digital assets.
Clean code is my non-negotiable standard.

[VISION]
Clarifying UI/UX through 3D experimentation.

> GITHUB: github.com/imdadur765`;

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTerminalText(fullText.slice(0, i));
            if (fullText[i - 1] && fullText[i - 1] !== ' ' && fullText[i - 1] !== '\n') {
                // playSound('typing');
            }
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, typingSpeed); // Use dynamic typing speed

        return () => clearInterval(interval);
    }, [fullText, playSound, typingSpeed]);

    return (
        <p className={styles.bioText}>
            {terminalText}
            <span className={styles.cursor}>_</span>
        </p>
    );
});

export default function Character() {
    const containerRef = useRef(null);
    const skillRefs = useRef<HTMLDivElement[]>([]);
    const { features, prefersReducedMotion } = useDeviceContext();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".statCard", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                lazy: true,
                force3D: true,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            });

            skillRefs.current.forEach((bar, index) => {
                if (bar) {
                    gsap.to(bar, {
                        width: skills[index].level,
                        duration: 2,
                        ease: "power4.out",
                        lazy: true,
                        force3D: true,
                        scrollTrigger: {
                            trigger: bar,
                            start: "top 90%",
                        }
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" className={styles.characterSection} ref={containerRef}>
            <div className={styles.backgroundGrid} />
            <div className={styles.noiseOverlay} />

            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className={styles.tag}
                    >
                        SYSTEM_O1 // BIOGRAPHY_V2.0
                    </motion.span>
                    <h2 className={styles.title}>IDENTITY STATUS</h2>
                </div>

                <div className={styles.mainGrid}>
                    <div className={styles.sidePanel}>
                        <div className={`${styles.card} statCard`}>
                            <div className={styles.cornerMarker} />
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon}>👤</span>
                                <h3>PROFILE</h3>
                            </div>
                            <TerminalText typingSpeed={features.typingSpeed} />
                            <div className={styles.dataLine}>
                                <span>LOCATION:</span>
                                <span className={styles.neonText}>ASSAM, IN</span>
                            </div>
                            <div className={styles.dataLine}>
                                <span>STATUS:</span>
                                <span className={styles.neonText}>AVAILABLE FOR HIRE</span>
                            </div>
                        </div>

                        <div className={`${styles.card} statCard`}>
                            <div className={styles.cornerMarker} />
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon}>🔋</span>
                                <h3>CAPABILITIES</h3>
                            </div>
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>STAMINA</span>
                                    <span className={styles.statVal}>99%</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>CREATIVITY</span>
                                    <span className={styles.statVal}>MAX</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>LATENCY</span>
                                    <span className={styles.statVal}>0.2ms</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.visualPanel}>
                        <div className={styles.characterContainer}>
                            <div className={styles.glitchBox} />
                            <div className={styles.scanline} />
                            <div className={styles.circle} />
                            <img src="/character.png" alt="Identity" className={styles.characterImage} />

                            {features.floatingAnimations && !prefersReducedMotion && (
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className={styles.floatingTag}
                                    style={{ top: '10%', right: '-10%' }}
                                >
                                    [ AUTH_LEVEL: MASTER ]
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className={styles.sidePanel}>
                        <div className={`${styles.card} statCard`}>
                            <div className={styles.cornerMarker} />
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon}>🛠</span>
                                <h3>TECH STACK</h3>
                            </div>
                            <div className={styles.skillsList}>
                                {skills.map((skill, i) => (
                                    <div key={skill.name} className={styles.skillItem}>
                                        <div className={styles.skillInfo}>
                                            <span>{skill.icon} {skill.name}</span>
                                            <span>{skill.level}</span>
                                        </div>
                                        <div className={styles.skillBar}>
                                            <div
                                                className={styles.skillFill}
                                                ref={(el) => { if (el) skillRefs.current[i] = el; }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`${styles.card} statCard`}>
                            <div className={styles.cornerMarker} />
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon}>📂</span>
                                <h3>ENGINEERING LOGS</h3>
                            </div>
                            <div className={styles.expItem}>
                                <span className={styles.expYear}>FLUTTER</span>
                                <span className={styles.expText}>ARCHITECT LEVEL // SCALABLE APPS</span>
                            </div>
                            <div className={styles.expItem}>
                                <span className={styles.expYear}>NEXT.JS</span>
                                <span className={styles.expText}>NINJA // SEO-SMOOTH WEB UI</span>
                            </div>
                            <div className={styles.expItem}>
                                <span className={styles.expYear}>GitHub</span>
                                <a
                                    href="https://github.com/imdadur765"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.neonLink}
                                >
                                    @imdadur765
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
