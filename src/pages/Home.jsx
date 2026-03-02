import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { members } from '../data/members';
import MemberCard from '../components/MemberCard';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

const Home = () => {
    const [settings, setSettings] = useState(() => {
        const cached = localStorage.getItem('jkt_home_settings');
        return cached ? JSON.parse(cached) : {
            title: 'NOBAR JKT48',
            subtitle: 'LIVE STREAMING EXPERIENCE',
            date: '2026-02-28T19:00:00'
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

    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen" style={{ backgroundColor: '#fdf6ee' }}>
            {/* Subtle Linen Pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #c9956a18 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)'
                }}
            />

            {/* Hero Section */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 pt-10">

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center z-10 max-w-5xl relative"
                >
                    {/* Soft warm glow */}
                    <div className="absolute -inset-10 rounded-full blur-[120px]" style={{ backgroundColor: '#c9956a1a' }} />

                    {/* Title */}
                    <h1
                        className="font-display font-black mb-6 relative z-20 uppercase leading-tight"
                        style={{
                            fontSize: `clamp(2.5rem, ${settings.title.length > 15 ? 12 : 18}vw, ${settings.title.length > 20 ? '5rem' : '8rem'})`,
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            background: 'linear-gradient(to bottom, #3b2a1a, #8b5e3c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {settings.title}
                    </h1>

                    <div className="relative inline-block mb-10">
                        <div className="absolute inset-0 blur-xl" style={{ backgroundColor: '#c9956a25' }} />
                        <p className="relative z-10 text-xl md:text-3xl font-mono tracking-[0.2em] border-y py-4 px-10 backdrop-blur-sm uppercase" style={{ color: '#8b5e3c', borderColor: '#8b5e3c40' }}>
                            {settings.subtitle}
                        </p>
                    </div>

                    <div className="mb-12 scale-110">
                        <div className="font-mono text-sm mb-4 tracking-widest" style={{ color: '#a0785a' }}>EVENT STARTS IN</div>
                        <CountdownTimer targetDate={targetDate} />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-8">
                        <Link to="/details" className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none">
                            <div className="absolute inset-0 w-full h-full border skew-x-12 transition-all duration-300" style={{ borderColor: '#c9956a60' }} />
                            <span className="relative z-10 font-display font-bold text-xl tracking-widest transition-colors" style={{ color: '#8b5e3c' }}>
                                DETAILS
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Featured Members Section */}
            <section className="w-full py-32 px-4 relative border-t" style={{ borderColor: '#c9956a20' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1" style={{ background: 'linear-gradient(to right, transparent, #c9956a, transparent)' }} />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 uppercase">
                            <span style={{ color: '#3b2a1a' }}>Featuring </span>
                            <span style={{ color: '#c9956a' }}>Stars</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {featuredMembers.map((member) => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>

                    <div className="text-center mt-20">
                        <Link to="/members" className="inline-block relative group">
                            <span className="text-xl font-mono tracking-widest transition-colors" style={{ color: '#a0785a' }}>VIEW ALL MEMBERS</span>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500" style={{ backgroundColor: '#8b5e3c' }} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Home;
