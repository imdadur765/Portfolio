'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BootSequence.module.css';
import { useSound } from '@/hooks/useSound';

const bootMessages = [
    'INITIATING SECURE CONNECTION...',
    'DECRYPTING IDENTITY MATRIX...',
    'LOADING NEURAL INTERFACE...',
    'BYPASSING FIREWALL...',
    'ACCESS GRANTED.',
];

export default function BootSequence() {
    const [isBooting, setIsBooting] = useState(true);
    const [currentLine, setCurrentLine] = useState(0);
    const [progress, setProgress] = useState(0);
    const { playSound } = useSound();

    useEffect(() => {
        // Check if already seen this session
        if (sessionStorage.getItem('bootComplete')) {
            setIsBooting(false);
            return;
        }

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        // Line-by-line reveal
        const lineInterval = setInterval(() => {
            setCurrentLine(prev => {
                if (prev < bootMessages.length - 1) {
                    playSound('typing');
                    return prev + 1;
                }
                return prev;
            });
        }, 600);

        // End boot sequence
        const endTimer = setTimeout(() => {
            playSound('glitch');
            setTimeout(() => {
                setIsBooting(false);
                sessionStorage.setItem('bootComplete', 'true');
            }, 500);
        }, 3500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(lineInterval);
            clearTimeout(endTimer);
        };
    }, [playSound]);

    return (
        <AnimatePresence>
            {isBooting && (
                <motion.div
                    className={styles.bootOverlay}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.bootContent}>
                        <div className={styles.logo}>IR_</div>
                        <div className={styles.terminal}>
                            {bootMessages.slice(0, currentLine + 1).map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`${styles.line} ${i === currentLine ? styles.active : ''}`}
                                >
                                    <span className={styles.prefix}>&gt;</span> {msg}
                                </motion.div>
                            ))}
                        </div>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                        </div>
                        <div className={styles.progressText}>{progress}%</div>
                    </div>
                    <div className={styles.scanlines} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
