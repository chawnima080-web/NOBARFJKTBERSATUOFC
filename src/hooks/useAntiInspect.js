import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const IS_DEV = import.meta.env.DEV;

export function useAntiInspect() {
    const location = useLocation();

    useEffect(() => {
        if (IS_DEV) return; // Nonaktif saat development

        // Jangan aktifkan di halaman Admin Panel agar admin bisa copy key
        if (location.pathname.startsWith('/managemen-web-nobar')) {
            return;
        }

        // ─── 1. Block klik kanan ─────────────────────────────────────────────
        const blockContext = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        document.addEventListener('contextmenu', blockContext, true);

        // ─── 2. Block shortcut keyboard DevTools ────────────────────────────
        const blockKeys = (e) => {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+Shift+K
            if (e.ctrlKey && e.shiftKey && [73, 74, 67, 75].includes(e.keyCode)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Ctrl+U (view source)
            if (e.ctrlKey && !e.shiftKey && e.keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Ctrl+S (save page)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
        };
        document.addEventListener('keydown', blockKeys, true);

        // ─── 3. Debugger loop — freeze DevTools ──────────────────────────────
        const debugLoop = setInterval(() => {
            try {
                (function () { return false; }
                ['constructor']('debugger')
                ['call']());
            } catch (_) { /* ignore */ }
        }, 50);

        // ─── 4. Window size detection (DevTools docked) ──────────────────────
        const detectSize = () => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            if (widthDiff > 160 || heightDiff > 160) {
                // Not redirecting anymore
            }
        };
        const sizeInterval = setInterval(detectSize, 500);
        // Juga deteksi saat resize
        window.addEventListener('resize', detectSize);

        // ─── 5. Console timing detection ─────────────────────────────────────
        const detectConsole = () => {
            const t1 = performance.now();
            // eslint-disable-next-line no-console
            debugger; // eslint-disable-line no-debugger
            const t2 = performance.now();
            if (t2 - t1 > 100) {
                // Not redirecting anymore
            }
        };
        const consoleInterval = setInterval(detectConsole, 1000);

        // ─── 6. Image getter trick (DevTools console inspect) ────────────────
        const trap = new Image();
        Object.defineProperty(trap, 'id', {
            get() {
                // Not redirecting anymore
                return 'trap';
            },
        });
        // eslint-disable-next-line no-console
        console.log('%c ', 'font-size:0px;', trap);

        // ─── 7. Block drag & drop source ─────────────────────────────────────
        document.addEventListener('dragstart', (e) => e.preventDefault(), true);

        // ─── Cleanup ──────────────────────────────────────────────────────────
        return () => {
            document.removeEventListener('contextmenu', blockContext, true);
            document.removeEventListener('keydown', blockKeys, true);
            document.removeEventListener('dragstart', (e) => e.preventDefault(), true);
            window.removeEventListener('resize', detectSize);
            clearInterval(debugLoop);
            clearInterval(sizeInterval);
            clearInterval(consoleInterval);
        };
    }, [location.pathname]);
}
