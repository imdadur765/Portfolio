'use client';

import { useDeviceContext } from '@/hooks/useDeviceCapability';
import styles from './PerformanceToggle.module.css';

export default function PerformanceToggle() {
    const { performanceMode, setPerformanceMode, tier, score } = useDeviceContext();

    return (
        <button
            className={`${styles.toggle} ${performanceMode ? styles.active : ''}`}
            onClick={() => setPerformanceMode(!performanceMode)}
            title={`Performance Mode ${performanceMode ? 'ON' : 'OFF'} | Device: ${tier} (${score})`}
            aria-label="Toggle Performance Mode"
        >
            <span className={styles.icon}>⚡</span>
            <span className={styles.label}>
                {performanceMode ? 'PERF' : 'FULL'}
            </span>
        </button>
    );
}
