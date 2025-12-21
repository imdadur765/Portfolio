'use strict';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MobileAlert.module.css';

const MobileAlert = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // Show only on mobile devices/small screens
            if (window.innerWidth < 1024) {
                // Check if user has already dismissed it this session
                const isDismissed = sessionStorage.getItem('mobileAlertDismissed');
                if (!isDismissed) {
                    setIsVisible(true);
                }
            } else {
                setIsVisible(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('mobileAlertDismissed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                    <div className={styles.container}>
                        <div className={styles.glitchBox}></div>
                        <div className={styles.content}>
                            <div className={styles.tag}>SYSTEM ADVISORY</div>
                            <h3 className={styles.title}>OPTIMAL EXPERIENCE DETECTED</h3>
                            <p className={styles.message}>
                                For the full 3D interactive visuals and extreme performance, switching to
                                <span className={styles.highlight}> Desktop Mode</span> is highly recommended.
                            </p>
                            <button className={styles.dismissBtn} onClick={handleDismiss}>
                                <span className={styles.btnText}>ACKNOWLEDGE</span>
                                <div className={styles.btnGlow}></div>
                            </button>
                        </div>
                        <div className={styles.cornerTR}></div>
                        <div className={styles.cornerBL}></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileAlert;
