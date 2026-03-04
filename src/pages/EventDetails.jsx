import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Monitor, Clock, Users } from 'lucide-react';
import { members } from '../data/members';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import RamadanOrnaments, { ArabesqueDivider, IslamicStar } from '../components/RamadanOrnaments';
import GoldenParticles from '../components/GoldenParticles';

const EventDetails = () => {
    const [lineupIds, setLineupIds] = useState([1, 2, 3, 4, 5, 20]);

    useEffect(() => {
        const lineupRef = ref(db, 'lineup');
        const unsubscribe = onValue(lineupRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setLineupIds(data);
        });
        return () => unsubscribe();
    }, []);

    const featuredMembers = members.filter(m => lineupIds.includes(m.id));

    const infoItems = [
        {
            icon: <MapPin size={20} style={{ color: '#d4a843' }} />,
            label: 'Online Only Event',
            desc: 'Join from anywhere. No physical venue.',
        },
        {
            icon: <Monitor size={20} style={{ color: '#d4a843' }} />,
            label: '1080p 60fps Quality',
            desc: 'Experience crystal clear visuals with high bitrate streaming.',
        },
        {
            icon: <Clock size={20} style={{ color: '#d4a843' }} />,
            label: 'Zero Latency Interactive',
            desc: 'Real-time interaction with members during the show.',
        },
    ];

    return (
        <div
            className="min-h-screen pt-20 px-4 pb-20 relative"
            style={{
                background: 'linear-gradient(180deg, #020810 0%, #060f1c 50%, #020810 100%)',
            }}
        >
            {/* Background ornaments */}
            <RamadanOrnaments />
            <GoldenParticles count={120} />

            {/* Starfield pattern */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,168,67,0.07) 1px, transparent 0)',
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Top glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.14) 0%, transparent 70%)' }}
            />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Page heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center mb-4">
                        <IslamicStar size={22} opacity={0.6} />
                    </div>

                    <h1
                        className="text-4xl md:text-6xl font-display font-bold mb-4 uppercase"
                        style={{
                            background: 'linear-gradient(90deg, #d4a843, #f0c060, #f9e6a0, #f0c060, #d4a843)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'shimmer 4s linear infinite',
                            textShadow: 'none',
                        }}
                    >
                        Show Detail
                    </h1>

                    <ArabesqueDivider className="max-w-sm mx-auto mt-2 mb-6 opacity-70" />

                    <p className="text-base max-w-2xl mx-auto font-sans leading-relaxed" style={{ color: '#d4c4a088' }}>
                        Prepare for an unforgettable night with JKT48. High-quality streaming, exclusive content, and real-time interaction awaiting you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 mb-16">
                    {/* Member Lineup Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8"
                        style={{
                            background: 'rgba(10,22,40,0.65)',
                            border: '1px solid rgba(212,168,67,0.25)',
                            boxShadow: '0 0 40px rgba(212,168,67,0.06)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Gold corner accents */}
                        {[
                            { top: 0, left: 0, borderTop: '2px solid #d4a843', borderLeft: '2px solid #d4a843', width: 24, height: 24 },
                            { top: 0, right: 0, borderTop: '2px solid #d4a843', borderRight: '2px solid #d4a843', width: 24, height: 24 },
                            { bottom: 0, left: 0, borderBottom: '2px solid #d4a843', borderLeft: '2px solid #d4a843', width: 24, height: 24 },
                            { bottom: 0, right: 0, borderBottom: '2px solid #d4a843', borderRight: '2px solid #d4a843', width: 24, height: 24 },
                        ].map((s, i) => (
                            <div key={i} style={{ position: 'absolute', ...s }} />
                        ))}

                        <h2
                            className="text-2xl font-display font-bold mb-8 text-center flex items-center justify-center gap-3"
                            style={{ color: '#f0c060' }}
                        >
                            <Users size={22} style={{ color: '#d4a843' }} />
                            MEMBER LINEUP
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="relative group overflow-hidden transition-all duration-300"
                                    style={{
                                        border: '1px solid rgba(212,168,67,0.2)',
                                        background: 'rgba(5,13,26,0.5)',
                                    }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                    {/* Gradient overlay */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(to top, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.4) 50%, transparent 100%)',
                                        }}
                                    />
                                    {/* Gold hover border */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ border: '1px solid rgba(212,168,67,0.5)', boxShadow: 'inset 0 0 20px rgba(212,168,67,0.08)' }}
                                    />
                                    <div className="absolute bottom-0 left-0 w-full p-4">
                                        <p className="text-xs font-sans tracking-widest mb-1" style={{ color: '#d4a84399' }}>
                                            Member Gen
                                        </p>
                                        <h3 className="font-display font-bold text-base leading-tight" style={{ color: '#f9e6a0' }}>
                                            {member.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Streaming Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 relative"
                        style={{
                            background: 'rgba(10,22,40,0.65)',
                            border: '1px solid rgba(212,168,67,0.25)',
                            boxShadow: '0 0 40px rgba(212,168,67,0.06)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* corners */}
                        {[
                            { top: 0, left: 0, borderTop: '2px solid #d4a843', borderLeft: '2px solid #d4a843', width: 24, height: 24 },
                            { top: 0, right: 0, borderTop: '2px solid #d4a843', borderRight: '2px solid #d4a843', width: 24, height: 24 },
                            { bottom: 0, left: 0, borderBottom: '2px solid #d4a843', borderLeft: '2px solid #d4a843', width: 24, height: 24 },
                            { bottom: 0, right: 0, borderBottom: '2px solid #d4a843', borderRight: '2px solid #d4a843', width: 24, height: 24 },
                        ].map((s, i) => <div key={i} style={{ position: 'absolute', ...s }} />)}

                        <h2
                            className="text-2xl font-display font-bold mb-8 flex items-center gap-3"
                            style={{ color: '#f0c060' }}
                        >
                            <Monitor size={22} style={{ color: '#d4a843' }} />
                            STREAMING INFO
                        </h2>

                        <ul className="space-y-6">
                            {infoItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div
                                        className="p-2 flex-shrink-0"
                                        style={{
                                            background: 'rgba(212,168,67,0.1)',
                                            border: '1px solid rgba(212,168,67,0.2)',
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <strong className="block mb-1 font-display text-sm" style={{ color: '#f5e6c8' }}>
                                            {item.label}
                                        </strong>
                                        <p className="text-sm font-sans" style={{ color: '#d4c4a070' }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
