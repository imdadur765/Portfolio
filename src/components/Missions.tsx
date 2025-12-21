"use client";

import styles from './Missions.module.css';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: 1,
        title: "Audio X",
        category: "MOBILE APP",
        description: "A premium local music player with dynamic glassmorphism and real-time lyrics synchronization.",
        tags: ["Flutter", "Firebase", "BLOC"],
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Neon Market",
        category: "E-COMMERCE",
        description: "High-end marketplace featuring 3D product previews and a sleek, futuristic checkout experience.",
        tags: ["Next.js", "Three.js", "Stripe"],
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Cyber Vision",
        category: "SAAS PLATFORM",
        description: "AI-driven analytics dashboard for security systems, featuring real-time data streaming.",
        tags: ["React", "Python", "WebSockets"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    }
];

export default function Missions() {
    const sectionRef = useRef(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(cardsRef.current);

            cards.forEach((card: any) => {
                gsap.from(card, {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                    }
                });

                // 3D Tilt Effect
                card.addEventListener('mousemove', (e: MouseEvent) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    gsap.to(card, {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        scale: 1.05,
                        duration: 0.5,
                        ease: "power3.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: "power3.out"
                    });
                });
            });
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

                <div className={styles.grid}>
                    {projects.map((project, i) => (
                        <div
                            key={project.id}
                            ref={(el) => { if (el) cardsRef.current[i] = el; }}
                            className={styles.cardWrapper}
                        >
                            <div className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img src={project.image} alt={project.title} className={styles.cardImage} />
                                    <div className={styles.imageOverlay} />
                                    <span className={styles.projectNumber}>OBJ_{project.id}</span>
                                </div>
                                <div className={styles.content}>
                                    <span className={styles.category}>{project.category}</span>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <p className={styles.description}>{project.description}</p>
                                    <div className={styles.tags}>
                                        {project.tags.map(tag => (
                                            <span key={tag} className={styles.tagItem}>{tag}</span>
                                        ))}
                                    </div>
                                    <button className={styles.viewBtn}>
                                        <span>ESTABLISH LINK</span>
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
