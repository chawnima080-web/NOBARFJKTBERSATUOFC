import React from 'react';
import { motion } from 'framer-motion';
import MemberCard from '../components/MemberCard';
import { members } from '../data/members';
import RamadanOrnaments, { ArabesqueDivider, IslamicStar } from '../components/RamadanOrnaments';
import GoldenParticles from '../components/GoldenParticles';

const Members = () => {
    return (
        <div
            className="min-h-screen pt-20 px-4 pb-20 relative"
            style={{
                background: 'linear-gradient(180deg, #020810 0%, #060f1c 50%, #020810 100%)',
            }}
        >
            {/* Background ornaments layer */}
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


            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section heading */}
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
                            filter: 'drop-shadow(0 0 12px rgba(212,168,67,0.25))',
                        }}
                    >
                        All Members
                    </h1>

                    <ArabesqueDivider className="max-w-sm mx-auto mt-2 mb-4 opacity-70" />

                    <p className="text-sm tracking-widest uppercase font-sans" style={{ color: '#d4a84388' }}>
                        ✦ JKT48 Generation ✦
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                        >
                            <MemberCard member={member} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Members;
