import React from 'react';
import { motion } from 'framer-motion';

const MemberCard = ({ member }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="relative group w-full max-w-sm mx-auto overflow-hidden rounded-xl"
            style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a40' }}
        >
            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, #3b2a1a, transparent)' }} />

            {/* Member Photo */}
            <div className="h-96 relative w-full overflow-hidden" style={{ backgroundColor: '#e0d0b8' }}>
                <div className="absolute inset-0 flex items-center justify-center font-display text-4xl opacity-10" style={{ color: '#8b5e3c' }}>
                    {member.name.split(' ')[0]}
                </div>
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = '#d5c4aa';
                    }}
                />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                <h3 className="text-2xl font-display font-bold text-white mb-1">{member.name}</h3>
                <p className="font-mono text-sm mb-4" style={{ color: '#f0e6d3' }}>Gen {member.generation}</p>

                <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    {member.social && (
                        <>
                            <a href={member.social.instagram} className="text-white/70 hover:text-white text-xs uppercase tracking-wider">Instagram</a>
                            <a href={member.social.twitter} className="text-white/70 hover:text-white text-xs uppercase tracking-wider">Twitter</a>
                        </>
                    )}
                </div>
            </div>

            {/* Border Glow Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-brown-light/50 rounded-xl transition-all duration-300 pointer-events-none" style={{ '--tw-border-opacity': 1 }} />
        </motion.div>
    );
};

export default MemberCard;
