"use client";

import styles from './Missions.module.css';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Missions() {
    const sectionRef = useRef(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (cardRef.current) {
                gsap.from(cardRef.current, {
                    y: 80,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    lazy: true,
                    force3D: true,
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 90%",
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="work" className={styles.missions} ref={sectionRef}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.tag}>// MISSION_LOG</span>
                    <h2 className={styles.title}>FIELD OPERATIONS</h2>
                </div>

                {/* Audio X - Main Project Card */}
                <div className={styles.featuredCard} ref={cardRef}>
                    <div className={styles.featuredImageWrapper}>
                        <img
                            src="/audio-x-logo.png"
                            alt="Audio X"
                            className={styles.featuredImage}
                            loading="lazy"
                        />
                        <div className={styles.featuredBadge}>LIVE PROJECT</div>
                    </div>

                    <div className={styles.featuredContent}>
                        <div className={styles.trustWarning}>
                            <p className={styles.subtitle}>// PROTOCOL: ARCHITECT_VERIFIED</p>
                            <div className={styles.boldMessage}>
                                CURATED TOOLS FOR THE MODERN DEVELOPER.
                                <br />
                                DOWNLOAD ONLY IF YOU TURST THE WORK BEHIND IT <span>IF YOU&apos;RE UNSURE IT&apos;S OKAY TO SKIP.</span>
                            </div>
                        </div>
                        <span className={styles.category}>📱 MOBILE APP</span>
                        <h3 className={styles.featuredTitle}>Audio X</h3>
                        <p className={styles.featuredDesc}>
                            A premium local music player with dynamic glassmorphism UI,
                            real-time lyrics synchronization, and an immersive listening experience.
                            Built with Flutter for blazing-fast performance.
                        </p>

                        <div className={styles.features}>
                            <span className={styles.feature}>🎵 Offline Playback</span>
                            <span className={styles.feature}>📝 Synced Lyrics</span>
                            <span className={styles.feature}>🎨 Glass UI</span>
                            <span className={styles.feature}>🌙 Theme Modes</span>
                        </div>

                        <div className={styles.tags}>
                            <span className={styles.tagItem}>Flutter</span>
                            <span className={styles.tagItem}>Dart</span>
                            <span className={styles.tagItem}>Firebase</span>
                            <span className={styles.tagItem}>BLOC</span>
                        </div>

                        <div className={styles.actionButtons}>
                            <a href="/apks/audio-x-arm64-v8a.apk" download className={styles.downloadBtn}>
                                <span>⬇️ DOWNLOAD APK</span>
                            </a>
                            <button
                                className={styles.instructionBtn}
                                onClick={() => setShowInstructions(!showInstructions)}
                            >
                                <span>{showInstructions ? '✕ CLOSE' : '❓ INSTALL GUIDE'}</span>
                            </button>
                        </div>

                        {/* Installation Instructions */}
                        {showInstructions && (
                            <div className={styles.instructions}>
                                <h4>📲 Installation Guide</h4>
                                <div className={styles.warning}>
                                    ⚠️ <strong>Google Play Protect Warning</strong><br />
                                    Since this APK is not from Play Store, Google may show a warning.
                                    This is normal for developer-distributed apps.
                                </div>
                                <ol className={styles.steps}>
                                    <li>Download the APK file using the button above</li>
                                    <li>Open your Downloads folder and tap the APK file</li>
                                    <li>If prompted, enable &quot;Install from unknown sources&quot;</li>
                                    <li>When Google Play Protect shows warning, tap <strong>&quot;More details&quot;</strong></li>
                                    <li>Then tap <strong>&quot;Install anyway&quot;</strong></li>
                                    <li>Wait for installation to complete</li>
                                    <li>Enjoy Audio X! 🎉</li>
                                </ol>
                                <p className={styles.note}>
                                    💡 This app is safe - I built it myself! It&apos;s not on Play Store
                                    because this is my personal portfolio project.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div className={styles.comingSoon}>
                    <div className={styles.comingSoonIcon}>🚧</div>
                    <h3>More Projects Coming Soon</h3>
                    <p>Currently working on exciting new projects. Stay tuned!</p>
                </div>
            </div>
        </section>
    );
}

