/**
 * Golden Barbers - Premium Seasonal Theme Effects v3
 * Pure CSS/SVG decorations - no emojis. Professional quality.
 *
 * Usage: GBThemeEffects.apply(firebaseThemeData)
 *        GBThemeEffects.remove()
 */
(function() {
    'use strict';

    var state = { container: null, toast: null, border: null, style: null, navLine: null, logoDeco: [], id: null };
    var isMobile = window.innerWidth < 768;

    /* ═══════════════════════════════════════════
       REALISTIC SVG SANTA HAT
       Detailed with fabric folds, fur trim, pompom
    ═══════════════════════════════════════════ */
    var SANTA_HAT_SVG = '<svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
            '<linearGradient id="gbHatFabric" x1="0.2" y1="0" x2="0.8" y2="1">' +
                '<stop offset="0%" stop-color="#E53935"/>' +
                '<stop offset="50%" stop-color="#C62828"/>' +
                '<stop offset="100%" stop-color="#B71C1C"/>' +
            '</linearGradient>' +
            '<radialGradient id="gbPompom" cx="0.4" cy="0.35" r="0.6">' +
                '<stop offset="0%" stop-color="#FFFFFF"/>' +
                '<stop offset="70%" stop-color="#F5F5F5"/>' +
                '<stop offset="100%" stop-color="#E0E0E0"/>' +
            '</radialGradient>' +
            '<linearGradient id="gbFurBrim" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#FFFFFF"/>' +
                '<stop offset="40%" stop-color="#FAFAFA"/>' +
                '<stop offset="100%" stop-color="#E8E8E8"/>' +
            '</linearGradient>' +
        '</defs>' +
        /* Hat body - curved cone shape */
        '<path d="M18 72 C22 42, 38 18, 58 6 C62 3, 67 4, 66 10 C62 28, 72 52, 84 72 Z" fill="url(#gbHatFabric)"/>' +
        /* Fabric highlight fold */
        '<path d="M28 68 C32 44, 44 22, 58 10 C52 30, 50 48, 54 68 Z" fill="#E53935" opacity="0.5"/>' +
        /* Fabric dark fold */
        '<path d="M65 18 C68 35, 76 55, 82 70 C74 60, 70 40, 66 22 Z" fill="#9B1B1B" opacity="0.3"/>' +
        /* White fur brim - elliptical band */
        '<path d="M10 70 C10 62, 25 57, 50 57 C75 57, 90 62, 90 70 C90 80, 75 84, 50 84 C25 84, 10 80, 10 70 Z" fill="url(#gbFurBrim)"/>' +
        /* Fur texture lines */
        '<path d="M16 72 C28 66, 38 64, 50 64 C62 64, 72 66, 84 72" stroke="#E0E0E0" stroke-width="1.2" fill="none" opacity="0.6"/>' +
        '<path d="M20 76 C32 72, 40 71, 50 71 C60 71, 68 72, 80 76" stroke="#D5D5D5" stroke-width="0.8" fill="none" opacity="0.4"/>' +
        /* Pompom - fluffy ball */
        '<circle cx="62" cy="8" r="10" fill="url(#gbPompom)"/>' +
        '<circle cx="59" cy="5" r="3.5" fill="#fff" opacity="0.7"/>' +
        '<circle cx="65" cy="11" r="2" fill="#D5D5D5" opacity="0.4"/>' +
    '</svg>';

    /* ═══════════════════════════════════════════
       THEME DEFINITIONS
       Pure CSS shapes, researched color palettes
    ═══════════════════════════════════════════ */
    var THEMES = {

        /* ─── CHRISTMAS ─────────────────── */
        christmas: {
            colors: { gold: '#2E7D32', goldLight: '#4CAF50', goldDark: '#1B5E20', glow: 'rgba(46,125,50,0.22)' },
            particles: [
                { shape: 'circle', color: '#fff', count: 18, size: [4,10], opacity: [0.2,0.55] },
                { shape: 'circle', color: '#4CAF50', count: 5, size: [3,7], opacity: [0.15,0.35] },
                { shape: 'circle', color: '#d4af37', count: 4, size: [2,5], opacity: [0.15,0.35] },
                { shape: 'circle', color: '#C62828', count: 3, size: [3,6], opacity: [0.12,0.3] }
            ],
            anim: 'fall', speed: [12,28], drift: [3,7],
            toast: { title: 'MERRY CHRISTMAS', sub: 'Wishing you a festive season full of style!', bg: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: '#fff' },
            border: { bg: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 12px,#fff 12px,#fff 24px,#2E7D32 24px,#2E7D32 36px,#fff 36px,#fff 48px)', height: 4 },
            navLine: 'linear-gradient(90deg, #2E7D32, #d4af37, #C62828, #d4af37, #2E7D32)',
            santaHat: true
        },

        /* ─── VALENTINE'S ───────────────── */
        valentines: {
            colors: { gold: '#E91E63', goldLight: '#F48FB1', goldDark: '#AD1457', glow: 'rgba(233,30,99,0.16)' },
            particles: [
                { shape: 'heart', color: '#E91E63', count: 7, size: [10,18], opacity: [0.15,0.4] },
                { shape: 'heart', color: '#F48FB1', count: 5, size: [8,14], opacity: [0.12,0.35] },
                { shape: 'circle', color: '#FCE4EC', count: 6, size: [3,6], opacity: [0.12,0.3] }
            ],
            anim: 'rise', speed: [14,28], drift: [4,8],
            toast: { title: "VALENTINE'S DAY", sub: 'Look sharp for your special someone!', bg: 'linear-gradient(135deg, #AD1457, #E91E63)', color: '#fff' },
            border: { bg: 'linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63)', height: 3, animated: true },
            navLine: 'linear-gradient(90deg, transparent, #F48FB1, #E91E63, #F48FB1, transparent)'
        },

        /* ─── WINTER ────────────────────── */
        winter: {
            colors: { gold: '#4FC3F7', goldLight: '#E1F5FE', goldDark: '#0288D1', glow: 'rgba(79,195,247,0.16)' },
            particles: [
                { shape: 'circle', color: '#fff', count: 20, size: [3,9], opacity: [0.15,0.5] },
                { shape: 'circle', color: '#B3E5FC', count: 5, size: [2,5], opacity: [0.1,0.3] }
            ],
            anim: 'fall', speed: [18,38], drift: [3,6],
            toast: { title: 'WINTER WARMTH', sub: 'Warm up with a fresh cut this winter', bg: 'linear-gradient(135deg, #01579B, #0288D1)', color: '#E1F5FE' },
            border: { bg: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,0.5),rgba(225,245,254,0.8),rgba(79,195,247,0.5),rgba(79,195,247,0))', height: 3, shimmer: true },
            navLine: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.4), rgba(225,245,254,0.7), rgba(79,195,247,0.4), transparent)'
        },

        /* ─── HALLOWEEN ─────────────────── */
        halloween: {
            colors: { gold: '#FF6F00', goldLight: '#FFE0B2', goldDark: '#E65100', glow: 'rgba(255,111,0,0.18)' },
            particles: [
                { shape: 'circle', color: '#FF6F00', count: 7, size: [4,10], opacity: [0.12,0.35] },
                { shape: 'circle', color: '#6A1B9A', count: 6, size: [5,12], opacity: [0.1,0.3] },
                { shape: 'circle', color: '#FFE0B2', count: 4, size: [2,5], opacity: [0.1,0.25] }
            ],
            anim: 'sway', speed: [10,22], drift: [5,10],
            toast: { title: 'SPOOKY SEASON', sub: 'Get a killer look this Halloween!', bg: 'linear-gradient(135deg, #4A148C, #E65100)', color: '#FFE0B2' },
            border: { bg: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)', height: 3, glow: 'rgba(255,111,0,0.4)' },
            navLine: 'linear-gradient(90deg, #4A148C, #FF6F00, #4A148C, #FF6F00, #4A148C)'
        },

        /* ─── EASTER ────────────────────── */
        easter: {
            colors: { gold: '#81C784', goldLight: '#FFF59D', goldDark: '#66BB6A', glow: 'rgba(129,199,132,0.16)' },
            particles: [
                { shape: 'petal', color: '#F48FB1', count: 7, size: [8,14], opacity: [0.18,0.42] },
                { shape: 'petal', color: '#81C784', count: 5, size: [6,12], opacity: [0.15,0.35] },
                { shape: 'circle', color: '#FFF59D', count: 4, size: [3,7], opacity: [0.12,0.3] },
                { shape: 'circle', color: '#90CAF9', count: 3, size: [3,6], opacity: [0.1,0.25] }
            ],
            anim: 'fall', speed: [16,32], drift: [4,8],
            toast: { title: 'HAPPY EASTER', sub: 'Spring into a fresh new look!', bg: 'linear-gradient(135deg, #66BB6A, #81C784)', color: '#fff' },
            border: { bg: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 15px,#81C784 15px,#81C784 30px,#FFF59D 30px,#FFF59D 45px,#90CAF9 45px,#90CAF9 60px)', height: 4 },
            navLine: 'linear-gradient(90deg, #F48FB1, #81C784, #FFF59D, #81C784, #F48FB1)'
        },

        /* ─── SUMMER ────────────────────── */
        summer: {
            colors: { gold: '#FF8F00', goldLight: '#FFF3E0', goldDark: '#E65100', glow: 'rgba(255,143,0,0.16)' },
            particles: [
                { shape: 'circle', color: '#FF8F00', count: 6, size: [4,10], opacity: [0.12,0.3] },
                { shape: 'circle', color: '#0288D1', count: 5, size: [3,8], opacity: [0.1,0.28] },
                { shape: 'circle', color: '#FFF3E0', count: 4, size: [2,5], opacity: [0.1,0.25] }
            ],
            anim: 'float', speed: [8,16], drift: [3,6],
            toast: { title: 'SUMMER VIBES', sub: 'Stay fresh all summer long!', bg: 'linear-gradient(135deg, #E65100, #FF8F00)', color: '#fff' },
            border: { bg: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)', height: 3, animated: true },
            navLine: 'linear-gradient(90deg, #FF8F00, #0288D1, #FF8F00, #0288D1, #FF8F00)'
        },

        /* ─── EID ───────────────────────── */
        eid: {
            colors: { gold: '#FDD835', goldLight: '#FFF9C4', goldDark: '#F9A825', glow: 'rgba(253,216,53,0.16)' },
            particles: [
                { shape: 'star', color: '#FDD835', count: 7, size: [6,12], opacity: [0.18,0.4] },
                { shape: 'circle', color: '#2E7D32', count: 5, size: [3,7], opacity: [0.12,0.3] },
                { shape: 'circle', color: '#FFF9C4', count: 4, size: [2,5], opacity: [0.1,0.25] }
            ],
            anim: 'float', speed: [8,16], drift: [3,6],
            toast: { title: 'EID MUBARAK', sub: 'Celebrate in style with a fresh look!', bg: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#FFF9C4' },
            border: { bg: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)', height: 3 },
            navLine: 'linear-gradient(90deg, transparent, #2E7D32, #FDD835, #2E7D32, transparent)'
        },

        /* ─── RAMADAN ───────────────────── */
        ramadan: {
            colors: { gold: '#B8860B', goldLight: '#E8EAF6', goldDark: '#8B6914', glow: 'rgba(184,134,11,0.16)' },
            particles: [
                { shape: 'star', color: '#B8860B', count: 6, size: [5,10], opacity: [0.14,0.35] },
                { shape: 'circle', color: '#1A237E', count: 4, size: [4,8], opacity: [0.08,0.22] },
                { shape: 'circle', color: '#E8EAF6', count: 4, size: [2,5], opacity: [0.08,0.2] }
            ],
            anim: 'float', speed: [12,24], drift: [3,6],
            toast: { title: 'RAMADAN KAREEM', sub: 'Wishing you a blessed and beautiful month', bg: 'linear-gradient(135deg, #1A237E, #283593)', color: '#E8EAF6' },
            border: { bg: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,0.5),#B8860B,rgba(184,134,11,0))', height: 3, shimmer: true },
            navLine: 'linear-gradient(90deg, transparent, #1A237E, #B8860B, #1A237E, transparent)'
        },

        /* ─── BLACK FRIDAY ──────────────── */
        'black-friday': {
            colors: { gold: '#FF1744', goldLight: '#FFD600', goldDark: '#D50000', glow: 'rgba(255,23,68,0.18)' },
            particles: [
                { shape: 'circle', color: '#FF1744', count: 6, size: [3,7], opacity: [0.18,0.45] },
                { shape: 'circle', color: '#FFD600', count: 5, size: [2,5], opacity: [0.15,0.4] },
                { shape: 'circle', color: '#fff', count: 3, size: [1,3], opacity: [0.1,0.25] }
            ],
            anim: 'fall', speed: [3,8], drift: [2,5],
            toast: { title: 'BLACK FRIDAY', sub: 'Biggest deals of the year!', bg: 'linear-gradient(135deg, #000, #212121)', color: '#FFD600' },
            border: { bg: '#FF1744', height: 2, neon: '#FF1744' },
            navLine: 'linear-gradient(90deg, #FF1744, #FFD600, #FF1744, #FFD600, #FF1744)'
        },

        /* ─── NEW YEAR ──────────────────── */
        'new-year': {
            colors: { gold: '#FFD700', goldLight: '#FFFDE7', goldDark: '#FFC107', glow: 'rgba(255,215,0,0.18)' },
            particles: [
                { shape: 'star', color: '#FFD700', count: 7, size: [5,10], opacity: [0.18,0.42] },
                { shape: 'circle', color: '#0D47A1', count: 5, size: [3,7], opacity: [0.1,0.28] },
                { shape: 'circle', color: '#fff', count: 5, size: [2,4], opacity: [0.15,0.35] }
            ],
            anim: 'fall', speed: [8,18], drift: [3,7],
            toast: { title: 'HAPPY NEW YEAR', sub: 'New year, new look!', bg: 'linear-gradient(135deg, #0D47A1, #1565C0)', color: '#FFD700' },
            border: { bg: 'linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent)', height: 3, animated: true },
            navLine: 'linear-gradient(90deg, transparent, #0D47A1, #FFD700, #0D47A1, transparent)'
        }
    };

    THEMES['blackfriday'] = THEMES['black-friday'];
    THEMES['newyear'] = THEMES['new-year'];

    /* ═══════════════════════════════════════════
       HELPERS
    ═══════════════════════════════════════════ */
    function rand(a, b) { return Math.random() * (b - a) + a; }
    function getTheme(id) {
        if (!id) return null;
        var k = id.toLowerCase().replace(/[\s_']/g, '-');
        return THEMES[k] || THEMES[k.replace(/-/g, '')] || null;
    }

    /* ═══════════════════════════════════════════
       CSS
    ═══════════════════════════════════════════ */
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            /* Container */
            '.gb-fx{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden}',

            /* Particle wrapper (for dual animation) */
            '.gb-pw{position:absolute;pointer-events:none;will-change:transform}',
            '.gb-p{pointer-events:none;will-change:transform}',

            /* Heart shape */
            '.gb-heart{position:relative;display:inline-block}',
            '.gb-heart::before,.gb-heart::after{content:"";position:absolute;border-radius:50% 50% 0 0}',
            '.gb-heart::before{left:50%;transform:rotate(-45deg);transform-origin:0 100%}',
            '.gb-heart::after{left:0;transform:rotate(45deg);transform-origin:100% 100%}',

            /* Star shape */
            '.gb-star{clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}',

            /* Petal shape */
            '.gb-petal{border-radius:50% 0 50% 0}',

            /* ── FALL ── */
            '@keyframes gb-fall{0%{transform:translateY(-5vh);opacity:0}5%{opacity:var(--op)}95%{opacity:var(--op)}100%{transform:translateY(105vh);opacity:0}}',

            /* ── DRIFT (horizontal sway - combined with fall/rise) ── */
            '@keyframes gb-drift{0%,100%{transform:translateX(0)}25%{transform:translateX(calc(var(--dx) * 0.6))}50%{transform:translateX(calc(var(--dx) * -0.4))}75%{transform:translateX(var(--dx))}}',

            /* ── RISE ── */
            '@keyframes gb-rise{0%{transform:translateY(105vh);opacity:0}8%{opacity:var(--op)}92%{opacity:var(--op)}100%{transform:translateY(-5vh);opacity:0}}',

            /* ── FLOAT ── */
            '@keyframes gb-vert-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}',

            /* ── SWAY ── */
            '@keyframes gb-vert-sway{0%,100%{transform:translateY(0)}30%{transform:translateY(-25px)}60%{transform:translateY(15px)}}',

            /* ── TOAST ── */
            '.gb-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(120px);z-index:10001;' +
                'font-family:"Outfit",sans-serif;pointer-events:auto;border-radius:16px;overflow:hidden;' +
                'box-shadow:0 10px 50px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.08);' +
                'animation:gb-tin .6s cubic-bezier(.34,1.56,.64,1) .4s forwards;max-width:440px;width:calc(100% - 40px)}',
            '@keyframes gb-tin{to{transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-tout{to{transform:translateX(-50%) translateY(120px);opacity:0}}',
            '.gb-toast-in{display:flex;align-items:center;gap:14px;padding:18px 48px 18px 22px}',
            '.gb-toast-t{font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;line-height:1.3}',
            '.gb-toast-s{font-size:14px;font-weight:500;opacity:.85;line-height:1.4;margin-top:3px}',
            '.gb-toast-x{position:absolute;right:12px;top:50%;transform:translateY(-50%);' +
                'background:rgba(255,255,255,.12);border:none;color:inherit;' +
                'width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:18px;' +
                'display:flex;align-items:center;justify-content:center;transition:background .2s;line-height:1}',
            '.gb-toast-x:hover{background:rgba(255,255,255,.22)}',
            '.gb-toast-bar{height:3px;background:rgba(255,255,255,0.2);position:relative;overflow:hidden}',
            '.gb-toast-bar::after{content:"";position:absolute;left:0;top:0;height:100%;width:100%;background:rgba(255,255,255,0.5);animation:gb-tbar 8s linear forwards}',
            '@keyframes gb-tbar{to{transform:translateX(-100%)}}',

            /* ── BORDER ── */
            '.gb-bdr{position:fixed;top:0;left:0;width:100%;z-index:9998;pointer-events:none}',
            '@keyframes gb-shift{0%{background-position:0 0}100%{background-position:200% 0}}',
            '@keyframes gb-shimmer{0%,100%{opacity:.5}50%{opacity:1}}',
            '@keyframes gb-neon{0%,100%{box-shadow:0 0 6px var(--nc),0 0 14px var(--nc)}50%{box-shadow:0 0 3px var(--nc),0 0 6px var(--nc);opacity:.7}}',

            /* ── NAV LINE ── */
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-nlin 1s ease .8s forwards}',
            '@keyframes gb-nlin{to{opacity:.75}}',

            /* ── AMBIENT GLOW ── */
            '.gb-glow{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;' +
                'background:radial-gradient(ellipse at 50% 0%,var(--gb-glow) 0%,transparent 60%);opacity:0;animation:gb-gin 2s ease .8s forwards}',
            '@keyframes gb-gin{to{opacity:1}}',

            /* ── SANTA HAT ── */
            '.gb-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.4));' +
                'animation:gb-hatbob 3.5s ease-in-out infinite}',
            '@keyframes gb-hatbob{0%,100%{transform:rotate(var(--hr)) translateY(0)}50%{transform:rotate(var(--hr)) translateY(-4px)}}',

            /* Responsive */
            '@media(max-width:600px){' +
                '.gb-toast{bottom:20px;max-width:calc(100% - 30px)}' +
                '.gb-toast-in{padding:14px 42px 14px 18px;gap:10px}' +
                '.gb-toast-t{font-size:10px;letter-spacing:2px}' +
                '.gb-toast-s{font-size:12px}' +
            '}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    /* ═══════════════════════════════════════════
       PARTICLES - Pure CSS shapes, dual animation
    ═══════════════════════════════════════════ */
    function createParticles(theme) {
        if (state.container) state.container.remove();
        state.container = document.createElement('div');
        state.container.className = 'gb-fx';

        var mult = isMobile ? 0.45 : 1;

        theme.particles.forEach(function(p) {
            var count = Math.max(1, Math.round(p.count * mult));
            for (var i = 0; i < count; i++) {
                var size = rand(p.size[0], p.size[1]);
                var opacity = rand(p.opacity[0], p.opacity[1]);
                var fallDur = rand(theme.speed[0], theme.speed[1]);
                var driftDur = rand(theme.drift[0], theme.drift[1]);
                var delay = rand(0, fallDur * 0.8);
                var drift = rand(-50, 50);
                var left = rand(2, 98);

                /* Outer wrapper: vertical movement */
                var wrapper = document.createElement('div');
                wrapper.className = 'gb-pw';
                wrapper.style.left = left + '%';
                wrapper.style.setProperty('--op', opacity.toFixed(2));

                /* Inner element: horizontal drift + shape */
                var el = document.createElement('div');
                el.className = 'gb-p';
                el.style.setProperty('--dx', drift + 'px');

                /* Create shape */
                if (p.shape === 'heart') {
                    var half = size / 2;
                    el.classList.add('gb-heart');
                    el.style.width = size + 'px';
                    el.style.height = size * 0.9 + 'px';
                    el.style.cssText += ';--hc:' + p.color + ';';
                    /* Using pseudo-elements for heart lobes */
                    var heartStyle = document.createElement('style');
                    /* Each heart gets unique color via inline */
                    el.innerHTML = '<span style="position:absolute;width:' + half + 'px;height:' + (size * 0.7) + 'px;background:' + p.color + ';border-radius:' + half + 'px ' + half + 'px 0 0;left:' + half + 'px;top:0;transform:rotate(-45deg);transform-origin:0 100%"></span>' +
                                   '<span style="position:absolute;width:' + half + 'px;height:' + (size * 0.7) + 'px;background:' + p.color + ';border-radius:' + half + 'px ' + half + 'px 0 0;left:0;top:0;transform:rotate(45deg);transform-origin:100% 100%"></span>';
                } else if (p.shape === 'star') {
                    el.classList.add('gb-star');
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                    el.style.background = p.color;
                } else if (p.shape === 'petal') {
                    el.classList.add('gb-petal');
                    el.style.width = size + 'px';
                    el.style.height = size * 1.5 + 'px';
                    el.style.background = p.color;
                } else {
                    /* Circle (default) */
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                    el.style.borderRadius = '50%';
                    el.style.background = p.color;
                }

                /* Animation assignments */
                if (theme.anim === 'rise') {
                    wrapper.style.animation = 'gb-rise ' + fallDur.toFixed(1) + 's ' + delay.toFixed(1) + 's linear infinite';
                    el.style.animation = 'gb-drift ' + driftDur.toFixed(1) + 's ' + (delay * 0.5).toFixed(1) + 's ease-in-out infinite';
                } else if (theme.anim === 'float') {
                    wrapper.style.top = rand(8, 85) + '%';
                    wrapper.style.opacity = opacity;
                    wrapper.style.animation = 'gb-vert-float ' + rand(6, 14).toFixed(1) + 's ' + delay.toFixed(1) + 's ease-in-out infinite';
                    el.style.animation = 'gb-drift ' + driftDur.toFixed(1) + 's ' + (delay * 0.5).toFixed(1) + 's ease-in-out infinite';
                } else if (theme.anim === 'sway') {
                    wrapper.style.top = rand(8, 85) + '%';
                    wrapper.style.opacity = opacity;
                    wrapper.style.animation = 'gb-vert-sway ' + rand(6, 14).toFixed(1) + 's ' + delay.toFixed(1) + 's ease-in-out infinite';
                    el.style.animation = 'gb-drift ' + rand(4, 10).toFixed(1) + 's ' + (delay * 0.3).toFixed(1) + 's ease-in-out infinite';
                } else {
                    /* fall (default) */
                    wrapper.style.animation = 'gb-fall ' + fallDur.toFixed(1) + 's ' + delay.toFixed(1) + 's linear infinite';
                    el.style.animation = 'gb-drift ' + driftDur.toFixed(1) + 's ' + (delay * 0.5).toFixed(1) + 's ease-in-out infinite';
                }

                wrapper.appendChild(el);
                state.container.appendChild(wrapper);
            }
        });

        document.body.appendChild(state.container);
    }

    /* ═══════════════════════════════════════════
       TOAST
    ═══════════════════════════════════════════ */
    function createToast(theme) {
        if (state.toast) state.toast.remove();
        try { if (sessionStorage.getItem('gb-dismissed') === state.id) return; } catch(e) {}

        var t = theme.toast;
        state.toast = document.createElement('div');
        state.toast.className = 'gb-toast';
        state.toast.style.background = t.bg;
        state.toast.style.color = t.color;

        state.toast.innerHTML =
            '<div class="gb-toast-in">' +
                '<div class="gb-toast-body">' +
                    '<div class="gb-toast-t">' + t.title + '</div>' +
                    '<div class="gb-toast-s">' + t.sub + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="gb-toast-bar"></div>' +
            '<button class="gb-toast-x" aria-label="Close">&times;</button>';

        document.body.appendChild(state.toast);
        state.toast.querySelector('.gb-toast-x').addEventListener('click', function() { dismissToast(); });
        setTimeout(function() { if (state.toast) dismissToast(); }, 8000);
    }

    function dismissToast() {
        if (!state.toast) return;
        state.toast.style.animation = 'gb-tout .4s ease forwards';
        var ref = state.toast;
        setTimeout(function() { if (ref && ref.parentNode) ref.remove(); }, 400);
        state.toast = null;
        try { sessionStorage.setItem('gb-dismissed', state.id); } catch(e) {}
    }

    /* ═══════════════════════════════════════════
       THEMED BORDER
    ═══════════════════════════════════════════ */
    function createBorder(theme) {
        if (state.border) state.border.remove();
        if (!theme.border) return;
        var b = theme.border;

        state.border = document.createElement('div');
        state.border.className = 'gb-bdr';
        state.border.style.height = (b.height || 3) + 'px';
        state.border.style.background = b.bg;

        if (b.animated) {
            state.border.style.backgroundSize = '200% 100%';
            state.border.style.animation = 'gb-shift 4s linear infinite';
        }
        if (b.shimmer) {
            state.border.style.animation = 'gb-shimmer 3s ease-in-out infinite';
        }
        if (b.neon) {
            state.border.style.setProperty('--nc', b.neon);
            state.border.style.animation = 'gb-neon 1.5s ease-in-out infinite';
        }
        if (b.glow) {
            state.border.style.boxShadow = '0 0 8px ' + b.glow + ',0 0 16px ' + b.glow;
        }

        document.body.appendChild(state.border);
    }

    /* ═══════════════════════════════════════════
       NAV ACCENT LINE
    ═══════════════════════════════════════════ */
    function createNavLine(theme) {
        removeNavLine();
        var nav = document.querySelector('.nav') || document.querySelector('.floating-nav');
        if (!nav) return;

        state.navLine = document.createElement('div');
        state.navLine.className = 'gb-nav-line';
        state.navLine.style.background = theme.navLine;
        nav.appendChild(state.navLine);
    }
    function removeNavLine() {
        if (state.navLine) { state.navLine.remove(); state.navLine = null; }
    }

    /* ═══════════════════════════════════════════
       AMBIENT GLOW
    ═══════════════════════════════════════════ */
    function createGlow(theme) {
        var old = document.querySelector('.gb-glow');
        if (old) old.remove();
        if (!theme.colors.glow) return;

        var glow = document.createElement('div');
        glow.className = 'gb-glow';
        glow.style.setProperty('--gb-glow', theme.colors.glow);
        document.body.appendChild(glow);
    }

    /* ═══════════════════════════════════════════
       SANTA HAT (Realistic SVG)
       Applied to nav logo + big hero logo
    ═══════════════════════════════════════════ */
    function addSantaHats() {
        /* Nav logos */
        document.querySelectorAll('.nav-logo').forEach(function(logo) {
            logo.style.position = 'relative';
            logo.style.overflow = 'visible';

            var hat = document.createElement('div');
            hat.className = 'gb-hat';
            hat.style.width = '36px';
            hat.style.height = '32px';
            hat.style.top = '-14px';
            hat.style.right = '-8px';
            hat.style.setProperty('--hr', '12deg');
            hat.innerHTML = SANTA_HAT_SVG;
            hat.querySelector('svg').style.width = '100%';
            hat.querySelector('svg').style.height = '100%';
            logo.appendChild(hat);
            state.logoDeco.push(hat);
        });

        /* Big hero logo - .showcase-neon-circle on index.html */
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle) {
            heroCircle.style.overflow = 'visible';

            var bigHat = document.createElement('div');
            bigHat.className = 'gb-hat';
            bigHat.style.width = '100px';
            bigHat.style.height = '88px';
            bigHat.style.top = '-30px';
            bigHat.style.right = '-15px';
            bigHat.style.setProperty('--hr', '15deg');
            bigHat.innerHTML = SANTA_HAT_SVG;
            bigHat.querySelector('svg').style.width = '100%';
            bigHat.querySelector('svg').style.height = '100%';
            heroCircle.appendChild(bigHat);
            state.logoDeco.push(bigHat);
        }
    }

    function removeSantaHats() {
        state.logoDeco.forEach(function(d) { d.remove(); });
        state.logoDeco = [];
        document.querySelectorAll('.nav-logo').forEach(function(l) {
            l.style.removeProperty('position');
            l.style.removeProperty('overflow');
        });
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle) heroCircle.style.removeProperty('overflow');
    }

    /* ═══════════════════════════════════════════
       COLORS (shifts gold accent - doesn't touch backgrounds)
    ═══════════════════════════════════════════ */
    function applyColors(c) {
        if (!c) return;
        var r = document.documentElement;
        r.style.setProperty('--gold', c.gold);
        r.style.setProperty('--gold-dark', c.goldDark);
        r.style.setProperty('--gold-light', c.goldLight);
        r.style.setProperty('--gold-glow', c.glow);
    }
    function removeColors() {
        ['--gold','--gold-dark','--gold-light','--gold-glow'].forEach(function(p) {
            document.documentElement.style.removeProperty(p);
        });
    }

    /* ═══════════════════════════════════════════
       MAIN API
    ═══════════════════════════════════════════ */
    function apply(data) {
        if (!data || !data.themeId) { remove(); return; }
        var theme = getTheme(data.themeId);
        if (!theme) { remove(); return; }
        if (state.id === data.themeId && state.container) return;

        remove();
        state.id = data.themeId;

        injectCSS();
        applyColors(theme.colors);
        createParticles(theme);
        createToast(theme);
        createBorder(theme);
        createNavLine(theme);
        createGlow(theme);
        if (theme.santaHat) addSantaHats();
    }

    function remove() {
        if (state.container) { state.container.remove(); state.container = null; }
        if (state.toast) { state.toast.remove(); state.toast = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        removeNavLine();
        var glow = document.querySelector('.gb-glow'); if (glow) glow.remove();
        removeSantaHats();
        removeColors();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };

})();
