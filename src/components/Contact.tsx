"use client";

import styles from './Contact.module.css';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const containerRef = useRef(null);
    const boardRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(boardRef.current, {
                y: 100,
                opacity: 0,
                scale: 0.95,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" className={styles.contact} ref={containerRef}>
            <div className={styles.backgroundText}>CONTACT</div>

            <div className={styles.header}>
                <span className={styles.tag}>// COMMS_LINK</span>
                <h2 className={styles.title}>INITIATE PROTOCOL</h2>
            </div>

            <div className={styles.board} ref={boardRef}>
                <div className={styles.boardHeader}>
                    <div className={styles.dots}>
                        <div className={styles.dot} />
                        <div className={styles.dot} />
                        <div className={styles.dot} />
                    </div>
                    <span className={styles.boardTitle}>SECURE_ENCRYPTED_CHANNEL.V3</span>
                </div>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>[ IDENTITY_CODENAME ]</label>
                            <input type="text" className={styles.input} placeholder="ENTER_NAME" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>[ CONTACT_CHANNEL ]</label>
                            <input type="email" className={styles.input} placeholder="SECURE_EMAIL" required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>[ MISSION_OBJECTIVE ]</label>
                        <textarea className={styles.textarea} placeholder="DESCRIBE THE OPERATION IN DETAIL..." required />
                    </div>

                    <div className={styles.actionRow}>
                        <div className={styles.disclaimer}>
                            ENCRYPTION_STATUS: <span className={styles.neonText}>ACTIVE</span>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            <span className={styles.btnText}>ESTABLISH LINK</span>
                            <div className={styles.btnGlow} />
                        </button>
                    </div>
                </form>
            </div>

            <footer className={styles.footer}>
                <div className={styles.footerLine} />
                <p>© 2025 IMDADUR RAHMAN // ALL RIGHTS RESERVED</p>
                <div className={styles.socials}>
                    <a href="#" className={styles.socialLink}>GITHUB</a>
                    <a href="#" className={styles.socialLink}>LINKEDIN</a>
                    <a href="#" className={styles.socialLink}>TWITTER</a>
                </div>
            </footer>
        </section>
    );
}
