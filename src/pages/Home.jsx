import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { members } from '../data/members';
import MemberCard from '../components/MemberCard';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import RamadanOrnaments, { ArabesqueDivider, IslamicStar } from '../components/RamadanOrnaments';
import GoldenParticles from '../components/GoldenParticles';

const Home = () => {
    const [settings, setSettings] = useState(() => {
        const cached = localStorage.getItem('jkt_home_settings');
        return cached ? JSON.parse(cached) : {
            title: 'NOBAR JKT48',
            subtitle: 'LIVE STREAMING EXPERIENCE',
            date: '2026-02-28T19:00:00',
            priceLabel: 'TIKET NOBAR',
            priceAmount: '',
            priceNote: 'per orang',
        };
    });

    const [selectedLineup, setSelectedLineup] = useState(() => {
        const cached = localStorage.getItem('jkt_home_lineup');
        return cached ? JSON.parse(cached) : [1, 5, 20];
    });

    useEffect(() => {
        const settingsRef = ref(db, 'settings');
        const unsubSettings = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSettings(prev => {
                    const next = { ...prev, ...data };
                    localStorage.setItem('jkt_home_settings', JSON.stringify(next));
                    return next;
                });
            }
        });

        const lineupRef = ref(db, 'lineup');
        const unsubLineup = onValue(lineupRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lineupArray = Array.isArray(data) ? data : [];
                setSelectedLineup(lineupArray);
                localStorage.setItem('jkt_home_lineup', JSON.stringify(lineupArray));
            }
        });

        return () => {
            unsubSettings();
            unsubLineup();
        };
    }, []);

    const featuredMembers = members.filter(m => selectedLineup.includes(m.id)).slice(0, 3);
    const targetDate = settings.date;

    /* ── Stagger variants ─────────────────────────── */
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 28 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <div
            className="relative flex flex-col min-h-screen overflow-x-hidden"
            style={{
                background: 'linear-gradient(180deg, #020810 0%, #060f1c 40%, #020810 100%)',
            }}
        >
            {/* Ramadan Ornamental Background Layer */}
            <RamadanOrnaments />

            {/* Golden dust particles floating up */}
            <GoldenParticles count={150} />

            {/* Starfield dot pattern overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,168,67,0.08) 1px, transparent 0)',
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Top golden arch glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.18) 0%, transparent 70%)',
                }}
            />

            {/* ═══ HERO SECTION ═══════════════════════════════════════ */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-10 z-10">

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center z-10 max-w-5xl relative w-full"
                >
                    {/* 1 — Special Show Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <span style={{ color: '#d4a843', fontSize: 16 }}>✦</span>
                        <span
                            className="font-sans uppercase tracking-[0.35em] text-sm font-medium"
                            style={{ color: '#d4a843' }}
                        >
                            Special Show
                        </span>
                        <span style={{ color: '#d4a843', fontSize: 16 }}>✦</span>
                    </motion.div>


                    {/* 2 — Main Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="font-display font-black mb-6 relative z-20 uppercase leading-tight text-gold-shimmer"
                        style={{
                            fontSize: `clamp(2.5rem, ${settings.title.length > 15 ? 11 : 16}vw, ${settings.title.length > 20 ? '4.5rem' : '7rem'})`,
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            letterSpacing: '0.04em',
                            textShadow: '0 0 40px rgba(212,168,67,0.3)',
                        }}
                    >
                        {settings.title}
                    </motion.h1>

                    {/* 3 — Arabesque divider */}
                    <motion.div variants={itemVariants}>
                        <ArabesqueDivider className="mb-8 opacity-70" />
                    </motion.div>

                    {/* 4 — Subtitle */}
                    <motion.div variants={itemVariants} className="relative inline-block mb-8 w-full">
                        <p
                            className="relative z-10 text-lg md:text-2xl font-sans tracking-[0.25em] py-3 px-8 uppercase"
                            style={{
                                color: '#f5e6c8',
                                letterSpacing: '0.25em',
                                textShadow: '0 0 20px rgba(212,168,67,0.15)',
                            }}
                        >
                            {settings.subtitle}
                        </p>
                    </motion.div>

                    {/* 5 — Price */}
                    {settings.priceAmount && (
                        <motion.p
                            variants={itemVariants}
                            className="font-sans tracking-[0.2em] mb-8 text-lg"
                            style={{ color: '#d4a843' }}
                        >
                            HARGA : Rp {Number(settings.priceAmount).toLocaleString('id-ID')}
                        </motion.p>
                    )}

                    {/* 6 — Countdown */}
                    <motion.div variants={itemVariants} className="mb-10">
                        <div
                            className="font-sans text-xs mb-4 tracking-[0.4em] uppercase"
                            style={{ color: '#d4a84399' }}
                        >
                            ✦ EVENT DIMULAI DALAM ✦
                        </div>
                        <CountdownTimer targetDate={targetDate} />
                    </motion.div>

                    {/* 7 — CTA Button */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 justify-center items-center mt-4">
                        <Link
                            to="/details"
                            className="group relative px-10 py-4 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))',
                                border: '1px solid rgba(212,168,67,0.6)',
                                boxShadow: '0 0 20px rgba(212,168,67,0.15)',
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.25), rgba(240,192,96,0.1))' }}
                            />
                            <span
                                className="relative z-10 font-display font-semibold text-base tracking-[0.3em]"
                                style={{ color: '#f0c060' }}
                            >
                                ✦ LIHAT DETAIL
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ FEATURED MEMBERS SECTION ═══════════════════════════ */}
            <section
                className="w-full py-24 px-4 relative z-10"
                style={{ borderTop: '1px solid rgba(212,168,67,0.15)' }}
            >
                {/* Top gold line accent */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, #d4a843, transparent)' }}
                />

                {/* Section bg glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,168,67,0.04) 0%, transparent 70%)' }}
                />

                <div className="max-w-7xl mx-auto">
                    {/* Section heading */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-center mb-4">
                                <IslamicStar size={20} opacity={0.6} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase text-gold-shimmer">
                                Featuring Stars
                            </h2>
                            <ArabesqueDivider className="max-w-md mx-auto mt-4 opacity-60" />
                        </motion.div>
                    </div>

                    {/* Member cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredMembers.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                viewport={{ once: true }}
                            >
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </div>

                    {/* View all link */}
                    <div className="text-center mt-16">
                        <Link to="/members" className="inline-block relative group">
                            <span
                                className="text-lg font-sans tracking-[0.3em] uppercase transition-colors"
                                style={{ color: '#d4a843' }}
                            >
                                ✦ LIHAT SEMUA MEMBER ✦
                            </span>
                            <div
                                className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
                                style={{ backgroundColor: '#f0c060' }}
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
