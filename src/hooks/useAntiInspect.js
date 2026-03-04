import { useEffect } from 'react';

const REDIRECT_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const IS_DEV = import.meta.env.DEV;

export function useAntiInspect() {
    useEffect(() => {
        if (IS_DEV) return; // Nonaktif saat development

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
        let devDetected = false;
        const redirectOnce = () => {
            if (!devDetected) {
                devDetected = true;
                window.location.replace(REDIRECT_URL);
            }
        };

        const detectSize = () => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            if (widthDiff > 160 || heightDiff > 160) {
                redirectOnce();
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
            if (t2 - t1 > 100) redirectOnce();
        };
        const consoleInterval = setInterval(detectConsole, 1000);

        // ─── 6. Image getter trick (DevTools console inspect) ────────────────
        const trap = new Image();
        Object.defineProperty(trap, 'id', {
            get() {
                redirectOnce();
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
    }, []);
}
