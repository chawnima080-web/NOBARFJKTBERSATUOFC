import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
                jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
                menit: Math.floor((difference / 1000 / 60) % 60),
                detik: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval, idx) => {
        const isLast = idx === Object.keys(timeLeft).length - 1;
        timerComponents.push(
            <React.Fragment key={interval}>
                <div className="flex flex-col items-center">
                    {/* Number box */}
                    <div
                        className="relative flex items-center justify-center"
                        style={{
                            width: '72px',
                            height: '80px',
                            background: 'linear-gradient(135deg, rgba(212,168,67,0.12), rgba(212,168,67,0.04))',
                            border: '1px solid rgba(212,168,67,0.45)',
                            boxShadow: '0 0 18px rgba(212,168,67,0.12), inset 0 0 12px rgba(212,168,67,0.05)',
                        }}
                    >
                        {/* Corner accents */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: 8, borderTop: '1px solid #d4a843', borderLeft: '1px solid #d4a843' }} />
                        <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderTop: '1px solid #d4a843', borderRight: '1px solid #d4a843' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 8, height: 8, borderBottom: '1px solid #d4a843', borderLeft: '1px solid #d4a843' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderBottom: '1px solid #d4a843', borderRight: '1px solid #d4a843' }} />

                        <span
                            className="font-display font-bold text-4xl md:text-5xl"
                            style={{
                                background: 'linear-gradient(to bottom, #f9e6a0, #d4a843)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: 'none',
                                filter: 'drop-shadow(0 0 6px rgba(212,168,67,0.5))',
                            }}
                        >
                            {timeLeft[interval] < 10 ? `0${timeLeft[interval]}` : timeLeft[interval]}
                        </span>
                    </div>

                    {/* Label */}
                    <div
                        className="text-xs uppercase tracking-widest mt-2 font-sans"
                        style={{ color: '#d4a84399', letterSpacing: '0.2em' }}
                    >
                        {interval}
                    </div>
                </div>

                {/* Separator */}
                {!isLast && (
                    <div
                        className="flex flex-col gap-2 items-center self-start mt-4"
                        style={{ color: '#d4a843', fontSize: '1.2rem', lineHeight: 1 }}
                    >
                        <span>✦</span>
                    </div>
                )}
            </React.Fragment>
        );
    });

    return (
        <div className="flex justify-center items-center flex-wrap gap-3 my-8">
            {timerComponents.length
                ? timerComponents
                : (
                    <span
                        className="font-display tracking-widest text-xl"
                        style={{ color: '#d4a843' }}
                    >
                        ✦ Event Telah Dimulai! ✦
                    </span>
                )
            }
        </div>
    );
};

export default CountdownTimer;
