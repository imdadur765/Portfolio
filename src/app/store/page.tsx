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
        desc: "The ultimate high-fidelity auditory interface. Real-time neural lyric synchronization powered by a hyper-optimized Flutter engine for peak arm64-v8a performance.",
        rarity: "legendary",
        status: "available",
        icon: "/audio-x-logo.png",
        file: "/apks/audio-x-arm64-v8a.apk"
    },
    {
        id: 1,
        name: "VIDEO X",
        version: "v0.5-alpha",
        desc: "Next-gen video manipulation and playback. Currently being optimized.",
        rarity: "legendary",
        status: "in-progress",
        icon: "🎬",
        file: "#"
    },
    {
        id: 2,
        name: "HEALTH X",
        version: "LOCKED",
        desc: "Track vital signs and neural activity in real-time. Direct interface.",
        rarity: "epic",
        status: "locked",
        icon: "🧬",
        file: "#"
    },
    {
        id: 3,
        name: "CYBER-HEIST",
        version: "LOCKED",
        desc: "Encrypted data package. Decryption algorithm not yet developed.",
        rarity: "rare",
        status: "locked",
        icon: "🔐",
        file: "#"
    }
];

export default function StorePage() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Entrance Animation removed to prevent layout conflicts with 3D effects
    useEffect(() => {
        // No-op
    }, []);

    const handleDownload = (appFile: string, appName: string, status: string) => {
        if (status !== 'available') return;

        const link = document.createElement('a');
        link.href = appFile;
        link.download = `${appName.toLowerCase()}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Keep the alert as a "hacking" feedback
        alert(`ACCESS GRANTED: ${appName} \nDownloading encrypted package...`);
    };

    return (
        <main className={styles.storePage} ref={containerRef}>
            <Navbar />

            <div className={styles.header}>
                <h1 className={styles.title}>Black Market</h1>
                <p className={styles.subtitle}>Acquire Illegal Tech & Software</p>
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
            </div>
        </main>
    );
}
