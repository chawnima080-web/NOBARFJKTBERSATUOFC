import { useEffect, useRef } from 'react';

/**
 * GoldenParticles — debu emas melayang ke atas.
 * Sesuai referensi: partikel naik dari bawah layar ke atas,
 * reset ke bawah saat keluar layar atas, dengan efek glow emas.
 */

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.cw = canvasWidth;
        this.ch = canvasHeight;
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * this.cw;
        // Saat init, sebar di seluruh layar. Saat respawn, muncul dari bawah
        this.y = initial ? Math.random() * this.ch : this.ch + Math.random() * 20;
        this.size = Math.random() * 3 + 1;                     // 1–4px
        this.speedX = Math.random() * 1 - 0.5;                   // drift kiri-kanan lambat
        this.speedY = -(Math.random() * 1.5 + 0.5);              // naik ke atas
        const alpha = Math.random() * 0.8 + 0.2;                 // 0.2–1.0
        this.color = `rgba(255, 215, 0, ${alpha.toFixed(2)})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Keluar atas → reset ke bawah
        if (this.y < -this.size) {
            this.y = this.ch + this.size;
            this.x = Math.random() * this.cw;
        }
        // Wrap horizontal agar tidak menghilang ke samping
        if (this.x < -this.size) this.x = this.cw + this.size;
        if (this.x > this.cw + this.size) this.x = -this.size;
    }

    draw(ctx) {
        // Efek glow/cahaya emas
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'gold';

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const GoldenParticles = ({ count = 150, style = {} }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId = null;
        let running = true;

        function initParticles() {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        }

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        function animate() {
            if (!running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Reset shadow setelah semua partikel digambar
            ctx.shadowBlur = 0;

            for (let i = 0; i < particles.length; i++) {
                particles[i].cw = canvas.width;
                particles[i].ch = canvas.height;
                particles[i].update();
                particles[i].draw(ctx);
            }

            // Bersihkan shadow agar tidak bocor ke elemen lain
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';

            animId = requestAnimationFrame(animate);
        }

        resize();
        animate();

        window.addEventListener('resize', resize, { passive: true });

        return () => {
            running = false;
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            id="particleCanvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                willChange: 'transform',
                transform: 'translateZ(0)',
                ...style,
            }}
        />
    );
};

export default GoldenParticles;
