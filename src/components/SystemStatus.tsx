'use client';

import React, { useState, useEffect } from 'react';
import styles from './SystemStatus.module.css';

const SystemStatus = () => {
    const [scrollAlt, setScrollAlt] = useState(0);
    const [signal, setSignal] = useState(98);
    const [time, setTime] = useState('');
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const muted = localStorage.getItem('audioMuted') === 'true';
        setIsMuted(muted);

        const handleScroll = () => {
            const scrolled = window.scrollY;
            setScrollAlt(Math.floor(scrolled));
        };

        const interval = setInterval(() => {
            setSignal(prev => Math.max(90, Math.min(99, prev + (Math.random() - 0.5) * 2)));
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={styles.statusBar}>
            <div className={styles.section}>
                <span className={styles.label}>[ ALTITUDE ]</span>
                <span className={styles.value}>{scrollAlt.toString().padStart(4, '0')}m</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.section}>
                <span className={styles.label}>[ SEC_LINK ]</span>
                <span className={styles.value}>{signal.toFixed(1)}%</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.section}>
                <span className={styles.label}>[ SYSTEM_TIME ]</span>
                <span className={styles.value}>{time}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.section}>
                <div className={styles.pulse} />
                <span className={styles.status}>ENCRYPTED_SESSION</span>
            </div>
            <div className={styles.divider} />
            <button
                className={`${styles.audioToggle} ${isMuted ? styles.muted : ''}`}
                onClick={() => {
                    const newState = !isMuted;
                    setIsMuted(newState);
                    localStorage.setItem('audioMuted', String(newState));
                }}
                title={isMuted ? "Enable Audio" : "Disable Audio"}
            >
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
};

export default SystemStatus;
