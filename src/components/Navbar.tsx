"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Missions', href: '#work' },
    { name: 'Stats', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants: Variants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const linkVariants: Variants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return (
        <>
            <motion.nav
                className={styles.navbar}
                initial={{ y: -100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className={styles.logo}>IMDAD</div>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="#work" className={styles.link}>Missions</Link>
                    <Link href="#about" className={styles.link}>Stats</Link>
                    <Link href="/store" className={`${styles.link} ${styles.nav3D}`}>Black Market</Link>
                    <Link href="#contact" className={styles.link}>Contact</Link>
                </div>

                {/* Hamburger Button */}
                <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
                    <div className={styles.bar} style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transformOrigin: 'center' }} />
                    <div className={styles.bar} style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'translateX(20px)' : 'translateX(0)' }} />
                    <div className={styles.bar} style={{ transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)', transformOrigin: 'center' }} />
                </button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <button className={styles.closeButton} onClick={toggleMenu} aria-label="Close menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {navItems.map((item) => (
                            <motion.div key={item.name} variants={linkVariants}>
                                <Link
                                    href={item.href}
                                    className={styles.mobileLink}
                                    onClick={toggleMenu}
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div variants={linkVariants}>
                            <Link
                                href="/store"
                                className={`${styles.mobileLink} ${styles.nav3D}`}
                                onClick={toggleMenu}
                                style={{ color: 'var(--neon-pink)', textShadow: '0 0 10px var(--neon-pink)' }}
                            >
                                BLACK MARKET
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
