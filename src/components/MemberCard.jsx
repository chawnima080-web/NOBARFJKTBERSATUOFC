import React from 'react';
import { motion } from 'framer-motion';

const MemberCard = ({ member }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative group w-full max-w-sm mx-auto overflow-hidden"
            style={{
                background: 'rgba(10,22,40,0.7)',
                border: '1px solid rgba(212,168,67,0.2)',
                boxShadow: '0 4px 24px rgba(212,168,67,0.06)',
            }}
        >
            {/* Bottom gradient overlay */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: 'linear-gradient(to top, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.5) 45%, transparent 100%)',
                }}
            />

            {/* Gold border on hover */}
            <div
                className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                    border: '1px solid rgba(212,168,67,0.55)',
                    boxShadow: 'inset 0 0 30px rgba(212,168,67,0.07), 0 0 20px rgba(212,168,67,0.12)',
                }}
            />

            {/* Gold corner accents (always visible) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '2px solid rgba(212,168,67,0.6)', borderLeft: '2px solid rgba(212,168,67,0.6)', zIndex: 25 }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '2px solid rgba(212,168,67,0.6)', borderRight: '2px solid rgba(212,168,67,0.6)', zIndex: 25 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '2px solid rgba(212,168,67,0.6)', borderLeft: '2px solid rgba(212,168,67,0.6)', zIndex: 25 }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '2px solid rgba(212,168,67,0.6)', borderRight: '2px solid rgba(212,168,67,0.6)', zIndex: 25 }} />

            {/* Photo */}
            <div
                className="h-96 relative w-full overflow-hidden"
                style={{ backgroundColor: '#0a1628' }}
            >
                {/* Fallback initial */}
                <div
                    className="absolute inset-0 flex items-center justify-center font-display text-5xl select-none"
                    style={{ color: 'rgba(212,168,67,0.08)' }}
                >
                    {member.name.split(' ')[0]}
                </div>
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-108"
                    style={{ '--tw-scale-x': 1.08, '--tw-scale-y': 1.08 }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = '#0a1628';
                    }}
                />
            </div>

            {/* Name / Gen info */}
            <div className="absolute bottom-0 left-0 w-full p-5 z-20">
                <p
                    className="font-sans text-xs tracking-[0.2em] uppercase mb-1.5"
                    style={{ color: '#d4a84388' }}
                >
                    ✦ Gen {member.generation}
                </p>
                <h3
                    className="text-xl font-display font-bold leading-tight"
                    style={{ color: '#f9e6a0' }}
                >
                    {member.name}
                </h3>

                {/* Social links (on hover) */}
                <div className="flex space-x-3 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {member.social && (
                        <>
                            {member.social.instagram && (
                                <a
                                    href={member.social.instagram}
                                    className="text-xs uppercase tracking-wider transition-colors font-sans"
                                    style={{ color: '#d4a84399' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#f0c060'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#d4a84399'}
                                >
                                    Instagram
                                </a>
                            )}
                            {member.social.twitter && (
                                <a
                                    href={member.social.twitter}
                                    className="text-xs uppercase tracking-wider transition-colors font-sans"
                                    style={{ color: '#d4a84399' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#f0c060'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#d4a84399'}
                                >
                                    Twitter
                                </a>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MemberCard;
