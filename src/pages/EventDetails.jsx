import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Monitor, Clock, Users } from 'lucide-react';
import { members } from '../data/members';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

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

    return (
        <div className="min-h-screen pt-20 px-4 pb-20" style={{ backgroundColor: '#fdf6ee' }}>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" style={{ color: '#3b2a1a' }}>SHOW DETAIL</h1>
                    <div className="w-24 h-1 mx-auto mb-8 rounded-full" style={{ backgroundColor: '#8b5e3c' }}></div>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: '#7a5c3e' }}>
                        Prepare for an unforgettable night with JKT48. High-quality streaming, exclusive content, and real-time interaction awaiting you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl p-8"
                        style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a30' }}
                    >
                        <h2 className="text-3xl font-display font-bold mb-8 text-center flex items-center justify-center gap-3" style={{ color: '#8b5e3c' }}>
                            <Users style={{ color: '#3b2a1a' }} /> MEMBER LINEUP
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredMembers.map((member) => (
                                <div key={member.id} className="relative group overflow-hidden rounded-xl transition-all duration-300" style={{ border: '1px solid #c9956a30', backgroundColor: '#fdf6ee' }}>
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(59,42,26,0.9), rgba(59,42,26,0.1), transparent)', opacity: 1 }} />
                                    <div className="absolute bottom-0 left-0 w-full p-4">
                                        <p className="text-xs font-mono tracking-widest mb-1" style={{ color: '#f0e6d3' }}>{member.generation} Gen</p>
                                        <h3 className="font-bold text-lg leading-tight text-white">{member.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl p-8"
                        style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a30' }}
                    >
                        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3" style={{ color: '#7a9e7e' }}>
                            <Monitor style={{ color: '#3b2a1a' }} /> STREAMING INFO
                        </h2>
                        <ul className="space-y-6" style={{ color: '#7a5c3e' }}>
                            <li className="flex items-start gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: '#c9956a20' }}>
                                    <MapPin size={20} style={{ color: '#a0785a' }} />
                                </div>
                                <div>
                                    <strong className="block mb-1" style={{ color: '#3b2a1a' }}>Online Only Event</strong>
                                    <p className="text-sm">Join from anywhere. No physical venue.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: '#c9956a20' }}>
                                    <Monitor size={20} style={{ color: '#8b5e3c' }} />
                                </div>
                                <div>
                                    <strong className="block mb-1" style={{ color: '#3b2a1a' }}>1080p 60fps Quality</strong>
                                    <p className="text-sm">Experience crystal clear visuals with high bitrate streaming.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: '#c9956a20' }}>
                                    <Clock size={20} style={{ color: '#c9956a' }} />
                                </div>
                                <div>
                                    <strong className="block mb-1" style={{ color: '#3b2a1a' }}>Zero Latency Interactive</strong>
                                    <p className="text-sm">Real-time interaction with members during the show.</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
