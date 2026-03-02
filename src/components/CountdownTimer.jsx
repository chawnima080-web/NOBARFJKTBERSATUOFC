import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
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

    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center mx-4">
                <div
                    className="text-4xl md:text-6xl font-display font-bold"
                    style={{
                        background: 'linear-gradient(to bottom, #3b2a1a, #8b5e3c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {timeLeft[interval] < 10 ? `0${timeLeft[interval]}` : timeLeft[interval]}
                </div>
                <div className="text-xs uppercase tracking-widest mt-2" style={{ color: '#8b5e3c' }}>
                    {interval}
                </div>
            </div>
        );
    });

    return (
        <div
            className="flex justify-center flex-wrap my-12 p-8 backdrop-blur-sm rounded-2xl"
            style={{ backgroundColor: 'rgba(240,230,211,0.6)', border: '1px solid #c9956a30', boxShadow: '0 4px 30px rgba(139,94,60,0.1)' }}
        >
            {timerComponents.length ? timerComponents : <span style={{ color: '#8b5e3c' }}>Event Started!</span>}
        </div>
    );
};

export default CountdownTimer;
