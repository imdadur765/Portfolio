"use client";

import styles from './Store.module.css';
import Navbar from '@/components/Navbar';
import { useRef, useEffect } from 'react';

// Mock Data for Apps
const apps = [
    {
        id: 0,
        name: "AUDIO X",
        version: "v1.0.0",
        desc: "A premium local music player with dynamic glassmorphism UI, real-time lyrics synchronization, and an immersive listening experience. Built with Flutter for blazing-fast performance.",
        rarity: "legendary",
        status: "available",
        icon: "/audio-x-logo.png",
        file: "/apks/audio-x-arm64-v8a.apk"
    }
];

export default function StorePage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Entrance animations or other logic
    }, []);

    const handleDownload = (appFile: string, appName: string, status: string) => {
        if (status !== 'available') return;

        const link = document.createElement('a');
        link.href = appFile;
        link.download = `${appName.toLowerCase()}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className={styles.storePage} ref={containerRef}>
            <Navbar />

            <div className={styles.header}>
                <h1 className={styles.title}>Black Market</h1>
                <div className={styles.trustWarning}>
                    <p className={styles.subtitle}>// PROTOCOL: ARCHITECT_VERIFIED</p>
                    <div className={styles.boldMessage}>
                        CURATED TOOLS FOR THE MODERN DEVELOPER.
                        <br />
                        DOWNLOAD ONLY IF YOU TURST THE WORK BEHIND IT <span>IF YOU'RE UNSURE IT'S OKAY TO SKIP.</span>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {apps.map((app) => (
                    <div key={app.id} className={`${styles.card} loaded-card ${styles[app.status]}`}>
                        <div className={`${styles.rarity} ${styles[app.rarity]}`}>
                            {app.rarity}
                        </div>

                        <div className={styles.iconWrapper}>
                            {app.icon.startsWith('/') ? (
                                <img src={app.icon} alt={app.name} className={styles.iconImage} />
                            ) : (
                                app.icon
                            )}
                        </div>

                        <h2 className={styles.appName}>{app.name}</h2>
                        <span className={styles.appVersion}>{app.version}</span>
                        <p className={styles.appDesc}>{app.desc}</p>

                        <button
                            className={`${styles.downloadBtn} ${app.status !== 'available' ? styles.disabled : ''}`}
                            onClick={() => handleDownload(app.file, app.name, app.status)}
                            disabled={app.status !== 'available'}
                        >
                            {app.status === 'available' ? 'Purchase (Free)' :
                                app.status === 'in-progress' ? 'In Progress' : 'Locked'}
                        </button>
                    </div>
                ))}

                {/* Placeholders for future tech */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${styles.card} ${styles.locked}`}>
                        <div className={`${styles.rarity} ${styles.epic}`}>
                            ENCRYPTED
                        </div>
                        <div className={styles.iconWrapper}>🔒</div>
                        <h2 className={styles.appName}>CLASSIFIED</h2>
                        <span className={styles.appVersion}>LOCKED</span>
                        <p className={styles.appDesc}>Data fragment corrupted. Decryption required. Estimated arrival: UNKNOWN.</p>
                        <button className={`${styles.downloadBtn} ${styles.disabled}`} disabled>
                            LOCKED
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}
