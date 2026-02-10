/**
 * Golden Barbers - Professional Seasonal Theme Effects v2
 * CSS-only shapes, subtle atmospheric effects, toast notifications
 *
 * Usage: GBThemeEffects.apply(firebaseThemeData)
 *        GBThemeEffects.remove()
 */
(function() {
    'use strict';

    var state = { container: null, toast: null, style: null, accentLine: null, id: null };
    var isMobile = window.innerWidth < 768;

    // ════════════════════════════════════════
    // RESEARCHED THEME DEFINITIONS
    // Each theme uses culturally accurate colors
    // and CSS-only decorative shapes
    // ════════════════════════════════════════
    var THEMES = {

        // ─── CHRISTMAS ──────────────────────
        // Traditional: deep green, rich red, warm gold. Green-dominant with gold accents.
        christmas: {
            accent: '#2E7D32',            // forest green - main accent
            accentAlt: '#C62828',         // deep red - secondary
            glowColor: 'rgba(46,125,50,0.12)',
            navLine: 'linear-gradient(90deg, #2E7D32, #C62828, #d4af37, #C62828, #2E7D32)',
            particles: [
                { shape: 'snowflake', color: 'rgba(255,255,255,0.08)', count: 14, size: [4,10], anim: 'fall' },
                { shape: 'circle', color: 'rgba(46,125,50,0.1)', count: 4, size: [3,6], anim: 'fall' },
                { shape: 'circle', color: 'rgba(212,175,55,0.08)', count: 3, size: [2,5], anim: 'fall' }
            ],
            speed: [12,28],
            toast: {
                title: 'MERRY CHRISTMAS',
                sub: 'Wishing you a festive season full of style!',
                bg: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                color: '#fff',
                icon: 'christmas'
            },
            logoDecor: 'santa-hat',
            heroDecor: 'christmas'
        },

        // ─── VALENTINE'S ────────────────────
        // Classic: deep rose, warm pink, soft blush
        valentines: {
            accent: '#E91E63',
            accentAlt: '#AD1457',
            glowColor: 'rgba(233,30,99,0.08)',
            navLine: 'linear-gradient(90deg, transparent, #F48FB1, #E91E63, #F48FB1, transparent)',
            particles: [
                { shape: 'heart', color: 'rgba(233,30,99,0.1)', count: 8, size: [6,12], anim: 'rise' },
                { shape: 'circle', color: 'rgba(244,143,177,0.08)', count: 5, size: [3,6], anim: 'rise' }
            ],
            speed: [14,26],
            toast: {
                title: "VALENTINE'S DAY",
                sub: 'Look sharp for your special someone!',
                bg: 'linear-gradient(135deg, #AD1457, #E91E63)',
                color: '#fff',
                icon: 'heart'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── WINTER ─────────────────────────
        // Cool: ice blue, frost white, silver
        winter: {
            accent: '#4FC3F7',
            accentAlt: '#0288D1',
            glowColor: 'rgba(79,195,247,0.08)',
            navLine: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.3), rgba(225,245,254,0.6), rgba(79,195,247,0.3), transparent)',
            particles: [
                { shape: 'snowflake', color: 'rgba(225,245,254,0.1)', count: 16, size: [3,8], anim: 'fall' },
                { shape: 'circle', color: 'rgba(79,195,247,0.06)', count: 4, size: [2,5], anim: 'fall' }
            ],
            speed: [16,34],
            toast: {
                title: 'WINTER WARMTH',
                sub: 'Warm up with a fresh cut this winter',
                bg: 'linear-gradient(135deg, #01579B, #0288D1)',
                color: '#E1F5FE',
                icon: 'snowflake'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── HALLOWEEN ──────────────────────
        // Spooky: burnt orange, deep purple, eerie green glow
        halloween: {
            accent: '#FF6F00',
            accentAlt: '#6A1B9A',
            glowColor: 'rgba(255,111,0,0.08)',
            navLine: 'linear-gradient(90deg, #4A148C, #FF6F00, #4A148C, #FF6F00, #4A148C)',
            particles: [
                { shape: 'circle', color: 'rgba(255,111,0,0.07)', count: 6, size: [3,8], anim: 'sway' },
                { shape: 'circle', color: 'rgba(106,27,154,0.06)', count: 5, size: [4,10], anim: 'sway' }
            ],
            speed: [10,22],
            toast: {
                title: 'SPOOKY SEASON',
                sub: 'Get a killer look this Halloween!',
                bg: 'linear-gradient(135deg, #4A148C, #E65100)',
                color: '#FFE0B2',
                icon: 'halloween'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── EASTER ─────────────────────────
        // Spring pastels: soft pink, mint green, butter yellow, sky blue. NO purple.
        easter: {
            accent: '#81C784',            // mint green
            accentAlt: '#F48FB1',         // soft pink
            glowColor: 'rgba(129,199,132,0.08)',
            navLine: 'linear-gradient(90deg, #F48FB1, #81C784, #FFF59D, #81C784, #F48FB1)',
            particles: [
                { shape: 'petal', color: 'rgba(244,143,177,0.1)', count: 6, size: [5,10], anim: 'fall' },
                { shape: 'circle', color: 'rgba(129,199,132,0.08)', count: 5, size: [3,7], anim: 'fall' },
                { shape: 'circle', color: 'rgba(255,245,157,0.07)', count: 3, size: [3,6], anim: 'fall' }
            ],
            speed: [16,30],
            toast: {
                title: 'HAPPY EASTER',
                sub: 'Spring into a fresh new look!',
                bg: 'linear-gradient(135deg, #81C784, #66BB6A)',
                color: '#fff',
                icon: 'easter'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── SUMMER ─────────────────────────
        // Warm: golden amber, ocean blue, sunset orange
        summer: {
            accent: '#FF8F00',
            accentAlt: '#0288D1',
            glowColor: 'rgba(255,143,0,0.08)',
            navLine: 'linear-gradient(90deg, #FF8F00, #0288D1, #FF8F00, #0288D1, #FF8F00)',
            particles: [
                { shape: 'circle', color: 'rgba(255,143,0,0.07)', count: 5, size: [3,7], anim: 'float' },
                { shape: 'circle', color: 'rgba(2,136,209,0.06)', count: 4, size: [3,6], anim: 'float' }
            ],
            speed: [10,20],
            toast: {
                title: 'SUMMER VIBES',
                sub: 'Stay fresh all summer long!',
                bg: 'linear-gradient(135deg, #E65100, #FF8F00)',
                color: '#fff',
                icon: 'summer'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── EID ────────────────────────────
        // Celebration: warm gold, emerald green, cream
        eid: {
            accent: '#FDD835',
            accentAlt: '#2E7D32',
            glowColor: 'rgba(253,216,53,0.08)',
            navLine: 'linear-gradient(90deg, transparent, #2E7D32, #FDD835, #2E7D32, transparent)',
            particles: [
                { shape: 'star', color: 'rgba(253,216,53,0.08)', count: 8, size: [4,9], anim: 'float' },
                { shape: 'circle', color: 'rgba(46,125,50,0.06)', count: 4, size: [3,6], anim: 'float' }
            ],
            speed: [10,20],
            toast: {
                title: 'EID MUBARAK',
                sub: 'Celebrate in style with a fresh look!',
                bg: 'linear-gradient(135deg, #2E7D32, #388E3C)',
                color: '#FFF9C4',
                icon: 'eid'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── RAMADAN ────────────────────────
        // Serene: midnight navy, rich gold, soft indigo
        ramadan: {
            accent: '#B8860B',
            accentAlt: '#1A237E',
            glowColor: 'rgba(184,134,11,0.08)',
            navLine: 'linear-gradient(90deg, transparent, #1A237E, #B8860B, #1A237E, transparent)',
            particles: [
                { shape: 'star', color: 'rgba(184,134,11,0.07)', count: 7, size: [3,8], anim: 'float' },
                { shape: 'circle', color: 'rgba(26,35,126,0.05)', count: 4, size: [3,6], anim: 'float' }
            ],
            speed: [12,24],
            toast: {
                title: 'RAMADAN KAREEM',
                sub: 'Wishing you a blessed and beautiful month',
                bg: 'linear-gradient(135deg, #1A237E, #283593)',
                color: '#E8EAF6',
                icon: 'ramadan'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── BLACK FRIDAY ───────────────────
        // Bold: pure black, neon red, electric yellow
        'black-friday': {
            accent: '#FF1744',
            accentAlt: '#FFD600',
            glowColor: 'rgba(255,23,68,0.06)',
            navLine: 'linear-gradient(90deg, #FF1744, #FFD600, #FF1744, #FFD600, #FF1744)',
            particles: [
                { shape: 'circle', color: 'rgba(255,23,68,0.08)', count: 5, size: [2,5], anim: 'fall' },
                { shape: 'circle', color: 'rgba(255,214,0,0.06)', count: 4, size: [2,4], anim: 'fall' }
            ],
            speed: [4,10],
            toast: {
                title: 'BLACK FRIDAY',
                sub: 'Biggest deals of the year!',
                bg: 'linear-gradient(135deg, #000, #212121)',
                color: '#FFD600',
                icon: 'sale'
            },
            logoDecor: null,
            heroDecor: null
        },

        // ─── NEW YEAR ───────────────────────
        // Festive: champagne gold, midnight blue, sparkle
        'new-year': {
            accent: '#FFD700',
            accentAlt: '#0D47A1',
            glowColor: 'rgba(255,215,0,0.08)',
            navLine: 'linear-gradient(90deg, transparent, #0D47A1, #FFD700, #0D47A1, transparent)',
            particles: [
                { shape: 'star', color: 'rgba(255,215,0,0.08)', count: 8, size: [3,7], anim: 'fall' },
                { shape: 'circle', color: 'rgba(13,71,161,0.06)', count: 4, size: [2,5], anim: 'fall' }
            ],
            speed: [8,18],
            toast: {
                title: 'HAPPY NEW YEAR',
                sub: 'New year, new look!',
                bg: 'linear-gradient(135deg, #0D47A1, #1565C0)',
                color: '#FFD700',
                icon: 'newyear'
            },
            logoDecor: null,
            heroDecor: null
        }
    };

    // Aliases
    THEMES['blackfriday'] = THEMES['black-friday'];
    THEMES['newyear'] = THEMES['new-year'];

    // ════════════════════════════════════════
    // HELPERS
    // ════════════════════════════════════════
    function rand(a, b) { return Math.random() * (b - a) + a; }
    function getTheme(id) {
        if (!id) return null;
        var k = id.toLowerCase().replace(/[\s_']/g, '-');
        return THEMES[k] || THEMES[k.replace(/-/g, '')] || null;
    }

    // ════════════════════════════════════════
    // SVG ICON DEFINITIONS (for toast)
    // ════════════════════════════════════════
    var TOAST_ICONS = {
        christmas: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l-1 4h-3l2.5 3L9 13h6l-1.5-4L16 6h-3L12 2z"/><rect x="11" y="13" width="2" height="4" fill="currentColor" rx="0.5"/><path d="M8 17h8" stroke-linecap="round"/></svg>',
        heart: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        snowflake: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/></svg>',
        halloween: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 14c-.6 0-1-.7-.7-1.2l1-2c.2-.3.2-.6 0-.8l-1-2c-.3-.5.1-1.2.7-1.2h.5c.3 0 .6.2.7.5l.8 2c.1.2.1.4 0 .6l-.8 2c-.1.3-.4.5-.7.5H10zm4.5 0c-.6 0-1-.7-.7-1.2l1-2c.2-.3.2-.6 0-.8l-1-2c-.3-.5.1-1.2.7-1.2h.5c.3 0 .6.2.7.5l.8 2c.1.2.1.4 0 .6l-.8 2c-.1.3-.4.5-.7.5h-.5z"/></svg>',
        easter: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 2 6.5 7 6.5 12.5S9 22 12 22s5.5-3 5.5-9.5S15 2 12 2zm0 2c.5 0 1.5 1.5 2.2 4H9.8C10.5 5.5 11.5 4 12 4z"/></svg>',
        summer: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></g></svg>',
        eid: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6L12 2z"/></svg>',
        ramadan: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.91 9.91 0 00-2.13.24A7 7 0 0015 16a7 7 0 005.13-13.76A9.91 9.91 0 0012 2z" transform="translate(-1,2)"/></svg>',
        sale: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2l1.5 3.5L14 4l-1 3.5L16.5 9 13 9.5 12 13l-1-3.5L7.5 9 11 7.5 10 4l3.5 1.5z"/><line x1="4" y1="20" x2="20" y2="4"/><circle cx="7" cy="7" r="2" fill="currentColor"/><circle cx="17" cy="17" r="2" fill="currentColor"/></svg>',
        newyear: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1 4 4-1-2 3.5 4 2.5h-4.5L12 15l-2.5-4H5l4-2.5L7 5l4 1L12 2z"/></svg>'
    };

    // ════════════════════════════════════════
    // CSS INJECTION
    // ════════════════════════════════════════
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            /* Particle container */
            '.gb-fx{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden}',

            /* Particle base */
            '.gb-p{position:absolute;pointer-events:none;will-change:transform,opacity;border-radius:50%}',

            /* Snowflake shape - 6-pointed star via box-shadow */
            '.gb-p-snowflake{border-radius:0;background:transparent;width:1px!important;height:1px!important}',

            /* Heart shape */
            '.gb-p-heart{border-radius:0;background:transparent;width:0!important;height:0!important}',
            '.gb-p-heart::before,.gb-p-heart::after{content:"";position:absolute;border-radius:50%}',

            /* Star shape */
            '.gb-p-star{border-radius:0;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}',

            /* Petal shape */
            '.gb-p-petal{border-radius:50% 0 50% 0;transform-origin:center}',

            /* ── FALL ── */
            '@keyframes gb-fall{' +
                '0%{transform:translateY(-5vh) translateX(0);opacity:0}' +
                '5%{opacity:var(--op)}' +
                '50%{transform:translateY(50vh) translateX(calc(var(--dx) * 0.6))}' +
                '95%{opacity:var(--op)}' +
                '100%{transform:translateY(105vh) translateX(var(--dx));opacity:0}}',

            /* ── RISE ── */
            '@keyframes gb-rise{' +
                '0%{transform:translateY(105vh) translateX(0) scale(0.6);opacity:0}' +
                '8%{opacity:var(--op)}' +
                '50%{transform:translateY(50vh) translateX(calc(var(--dx) * -0.4)) scale(1)}' +
                '92%{opacity:var(--op)}' +
                '100%{transform:translateY(-5vh) translateX(var(--dx)) scale(0.6);opacity:0}}',

            /* ── FLOAT ── */
            '@keyframes gb-float{' +
                '0%,100%{transform:translate(0,0)}' +
                '25%{transform:translate(10px,-15px)}' +
                '50%{transform:translate(-8px,10px)}' +
                '75%{transform:translate(12px,-8px)}}',

            /* ── SWAY ── */
            '@keyframes gb-sway{' +
                '0%,100%{transform:translate(0,0)}' +
                '20%{transform:translate(20px,-18px)}' +
                '40%{transform:translate(-16px,14px)}' +
                '60%{transform:translate(22px,-10px)}' +
                '80%{transform:translate(-14px,18px)}}',

            /* ── TOAST NOTIFICATION (bottom-center) ── */
            '.gb-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(120px);' +
                'z-index:10001;font-family:"Outfit",sans-serif;pointer-events:auto;' +
                'border-radius:16px;padding:0;overflow:hidden;' +
                'box-shadow:0 8px 40px rgba(0,0,0,0.5);' +
                'animation:gb-toast-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.5s forwards;' +
                'max-width:420px;width:calc(100% - 40px);backdrop-filter:blur(10px)}',
            '@keyframes gb-toast-in{to{transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-toast-out{to{transform:translateX(-50%) translateY(120px);opacity:0}}',

            '.gb-toast-inner{display:flex;align-items:center;gap:14px;padding:16px 20px}',
            '.gb-toast-icon{flex-shrink:0;width:40px;height:40px;border-radius:10px;' +
                'display:flex;align-items:center;justify-content:center;' +
                'background:rgba(255,255,255,0.15)}',
            '.gb-toast-icon svg{width:22px;height:22px}',
            '.gb-toast-body{flex:1;min-width:0}',
            '.gb-toast-title{font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;line-height:1.3;opacity:0.9}',
            '.gb-toast-sub{font-size:13px;font-weight:500;line-height:1.4;margin-top:2px;opacity:0.8}',
            '.gb-toast-close{flex-shrink:0;background:rgba(255,255,255,0.1);border:none;color:inherit;' +
                'width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;' +
                'display:flex;align-items:center;justify-content:center;transition:background 0.2s;line-height:1}',
            '.gb-toast-close:hover{background:rgba(255,255,255,0.2)}',

            /* ── NAV ACCENT LINE ── */
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;' +
                'pointer-events:none;opacity:0;animation:gb-line-in 1s ease 1s forwards}',
            '@keyframes gb-line-in{to{opacity:0.7}}',

            /* ── AMBIENT GLOW (very subtle) ── */
            '.gb-glow{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;' +
                'background:radial-gradient(ellipse at 50% 0%,var(--gb-glow) 0%,transparent 55%);' +
                'opacity:0;animation:gb-glow-in 2s ease 1s forwards}',
            '@keyframes gb-glow-in{to{opacity:1}}',

            /* ── SANTA HAT (CSS-only) ── */
            '.gb-santa-hat{position:absolute;top:-14px;right:-6px;z-index:10;pointer-events:none;' +
                'width:28px;height:28px}',
            '.gb-santa-hat-body{position:absolute;bottom:4px;left:2px;width:0;height:0;' +
                'border-left:12px solid transparent;border-right:12px solid transparent;' +
                'border-bottom:20px solid #C62828;transform:rotate(12deg)}',
            '.gb-santa-hat-brim{position:absolute;bottom:2px;left:-2px;right:-2px;height:6px;' +
                'background:#fff;border-radius:3px}',
            '.gb-santa-hat-pom{position:absolute;top:0;right:2px;width:8px;height:8px;' +
                'background:#fff;border-radius:50%}',

            /* ── RESPONSIVE ── */
            '@media(max-width:600px){' +
                '.gb-toast{bottom:20px;max-width:calc(100% - 30px)}' +
                '.gb-toast-inner{padding:12px 16px;gap:10px}' +
                '.gb-toast-title{font-size:10px;letter-spacing:2px}' +
                '.gb-toast-sub{font-size:12px}' +
                '.gb-santa-hat{width:22px;height:22px;top:-11px;right:-4px}' +
                '.gb-santa-hat-body{border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:16px solid #C62828}' +
                '.gb-santa-hat-brim{height:5px}' +
                '.gb-santa-hat-pom{width:6px;height:6px}' +
            '}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    // ════════════════════════════════════════
    // CSS-ONLY PARTICLES
    // ════════════════════════════════════════
    function createParticles(theme) {
        if (state.container) state.container.remove();
        state.container = document.createElement('div');
        state.container.className = 'gb-fx';

        var mult = isMobile ? 0.4 : 1;

        theme.particles.forEach(function(p) {
            var count = Math.max(1, Math.round(p.count * mult));
            for (var i = 0; i < count; i++) {
                var el = document.createElement('div');
                el.className = 'gb-p';

                // Add shape class
                if (p.shape === 'snowflake') {
                    el.classList.add('gb-p-snowflake');
                    var flakeSize = rand(p.size[0], p.size[1]);
                    var half = flakeSize / 2;
                    el.style.boxShadow =
                        '0 -' + half + 'px 0 0 ' + p.color + ',' +
                        '0 ' + half + 'px 0 0 ' + p.color + ',' +
                        '-' + half + 'px 0 0 0 ' + p.color + ',' +
                        half + 'px 0 0 0 ' + p.color + ',' +
                        '-' + (half*0.7).toFixed(1) + 'px -' + (half*0.7).toFixed(1) + 'px 0 0 ' + p.color + ',' +
                        (half*0.7).toFixed(1) + 'px ' + (half*0.7).toFixed(1) + 'px 0 0 ' + p.color;
                } else if (p.shape === 'heart') {
                    el.classList.add('gb-p-heart');
                    var hSize = rand(p.size[0], p.size[1]);
                    var hh = hSize / 2;
                    el.style.cssText += 'width:' + hSize + 'px!important;height:' + hSize + 'px!important;';
                    el.innerHTML = '<span style="position:absolute;width:' + hh + 'px;height:' + hSize*0.8 + 'px;background:' + p.color + ';border-radius:' + hh + 'px ' + hh + 'px 0 0;left:' + hh + 'px;top:0;transform:rotate(-45deg);transform-origin:0 100%"></span>' +
                                   '<span style="position:absolute;width:' + hh + 'px;height:' + hSize*0.8 + 'px;background:' + p.color + ';border-radius:' + hh + 'px ' + hh + 'px 0 0;left:0;top:0;transform:rotate(45deg);transform-origin:100% 100%"></span>';
                } else if (p.shape === 'star') {
                    el.classList.add('gb-p-star');
                    var sSize = rand(p.size[0], p.size[1]);
                    el.style.width = sSize + 'px';
                    el.style.height = sSize + 'px';
                    el.style.background = p.color;
                } else if (p.shape === 'petal') {
                    el.classList.add('gb-p-petal');
                    var ptSize = rand(p.size[0], p.size[1]);
                    el.style.width = ptSize + 'px';
                    el.style.height = ptSize * 1.4 + 'px';
                    el.style.background = p.color;
                } else {
                    // Default circle
                    var cSize = rand(p.size[0], p.size[1]);
                    el.style.width = cSize + 'px';
                    el.style.height = cSize + 'px';
                    el.style.background = p.color;
                }

                var opacity = rand(0.5, 1);
                var duration = rand(theme.speed[0], theme.speed[1]);
                var delay = rand(0, duration * 0.8);
                var drift = rand(-50, 50);
                var left = rand(2, 98);

                el.style.setProperty('--op', opacity.toFixed(2));
                el.style.setProperty('--dx', drift + 'px');
                el.style.left = left + '%';

                var animName;
                if (p.anim === 'rise') {
                    animName = 'gb-rise';
                } else if (p.anim === 'float') {
                    animName = 'gb-float';
                    el.style.top = rand(10, 80) + '%';
                    el.style.opacity = opacity * 0.8;
                    duration = rand(8, 18);
                } else if (p.anim === 'sway') {
                    animName = 'gb-sway';
                    el.style.top = rand(10, 80) + '%';
                    el.style.opacity = opacity * 0.8;
                    duration = rand(10, 20);
                } else {
                    animName = 'gb-fall';
                }

                el.style.animation = animName + ' ' + duration.toFixed(1) + 's ' + delay.toFixed(1) + 's linear infinite';
                state.container.appendChild(el);
            }
        });

        document.body.appendChild(state.container);
    }

    // ════════════════════════════════════════
    // TOAST NOTIFICATION (bottom-center, auto-dismiss)
    // ════════════════════════════════════════
    function createToast(theme) {
        if (state.toast) state.toast.remove();
        try { if (sessionStorage.getItem('gb-dismissed') === state.id) return; } catch(e) {}

        var t = theme.toast;
        state.toast = document.createElement('div');
        state.toast.className = 'gb-toast';
        state.toast.style.background = t.bg;
        state.toast.style.color = t.color;

        var iconSvg = TOAST_ICONS[t.icon] || '';

        state.toast.innerHTML =
            '<div class="gb-toast-inner">' +
                '<div class="gb-toast-icon">' + iconSvg + '</div>' +
                '<div class="gb-toast-body">' +
                    '<div class="gb-toast-title">' + t.title + '</div>' +
                    '<div class="gb-toast-sub">' + t.sub + '</div>' +
                '</div>' +
                '<button class="gb-toast-close" aria-label="Close">&times;</button>' +
            '</div>';

        document.body.appendChild(state.toast);

        // Close button
        var closeBtn = state.toast.querySelector('.gb-toast-close');
        closeBtn.addEventListener('click', function() {
            dismissToast();
        });

        // Auto-dismiss after 8 seconds
        setTimeout(function() {
            if (state.toast) dismissToast();
        }, 8000);
    }

    function dismissToast() {
        if (!state.toast) return;
        state.toast.style.animation = 'gb-toast-out 0.4s ease forwards';
        var toastRef = state.toast;
        setTimeout(function() {
            if (toastRef && toastRef.parentNode) toastRef.remove();
        }, 400);
        state.toast = null;
        try { sessionStorage.setItem('gb-dismissed', state.id); } catch(e) {}
    }

    // ════════════════════════════════════════
    // NAV ACCENT LINE
    // ════════════════════════════════════════
    function createNavLine(theme) {
        removeNavLine();
        // Find nav element (different selectors across pages)
        var nav = document.querySelector('.nav') || document.querySelector('.floating-nav');
        if (!nav) return;

        state.accentLine = document.createElement('div');
        state.accentLine.className = 'gb-nav-line';
        state.accentLine.style.background = theme.navLine;
        nav.style.position = nav.style.position || 'fixed'; // ensure it stays positioned
        nav.appendChild(state.accentLine);
    }

    function removeNavLine() {
        if (state.accentLine) {
            state.accentLine.remove();
            state.accentLine = null;
        }
    }

    // ════════════════════════════════════════
    // AMBIENT GLOW (very subtle top radial)
    // ════════════════════════════════════════
    function createGlow(theme) {
        var old = document.querySelector('.gb-glow');
        if (old) old.remove();
        if (!theme.glowColor) return;

        var glow = document.createElement('div');
        glow.className = 'gb-glow';
        glow.style.setProperty('--gb-glow', theme.glowColor);
        document.body.appendChild(glow);
    }

    // ════════════════════════════════════════
    // LOGO DECORATION (CSS-only santa hat for Christmas)
    // ════════════════════════════════════════
    function decorateLogos(theme) {
        // Clean up any existing decorations
        document.querySelectorAll('.gb-santa-hat').forEach(function(el) { el.remove(); });
        // Reset logo containers
        document.querySelectorAll('.nav-logo').forEach(function(logo) {
            logo.style.removeProperty('position');
            logo.style.removeProperty('overflow');
        });
        // Clean hero logo decorations
        document.querySelectorAll('.gb-hero-santa-hat').forEach(function(el) { el.remove(); });

        if (!theme.logoDecor) return;

        if (theme.logoDecor === 'santa-hat') {
            // Add santa hat to nav logos
            var navLogos = document.querySelectorAll('.nav-logo');
            navLogos.forEach(function(logo) {
                logo.style.position = 'relative';
                logo.style.overflow = 'visible';

                var hat = document.createElement('div');
                hat.className = 'gb-santa-hat';
                hat.innerHTML = '<div class="gb-santa-hat-pom"></div>' +
                                '<div class="gb-santa-hat-body"></div>' +
                                '<div class="gb-santa-hat-brim"></div>';
                logo.appendChild(hat);
            });

            // Add to hero showcase logo if exists (index.html)
            var heroLogo = document.querySelector('.showcase-badge img, .hero-logo img');
            if (heroLogo && heroLogo.parentElement) {
                var parent = heroLogo.parentElement;
                parent.style.position = 'relative';
                parent.style.overflow = 'visible';
                var bigHat = document.createElement('div');
                bigHat.className = 'gb-santa-hat gb-hero-santa-hat';
                bigHat.style.cssText = 'width:44px;height:44px;top:-22px;right:-10px;';
                bigHat.innerHTML = '<div class="gb-santa-hat-pom" style="width:12px;height:12px"></div>' +
                                   '<div class="gb-santa-hat-body" style="border-left:18px solid transparent;border-right:18px solid transparent;border-bottom:32px solid #C62828"></div>' +
                                   '<div class="gb-santa-hat-brim" style="height:8px;border-radius:4px"></div>';
                parent.appendChild(bigHat);
            }
        }
    }

    // ════════════════════════════════════════
    // SUBTLE COLOR ACCENT (minimal - only gold tint shift)
    // Keep it very light - just shift the gold accent slightly
    // ════════════════════════════════════════
    function applyAccentColor(theme) {
        if (!theme.accent) return;
        document.body.classList.add('gb-themed');
        document.body.setAttribute('data-gb-theme', state.id);
    }

    function removeAccentColor() {
        document.body.classList.remove('gb-themed');
        document.body.removeAttribute('data-gb-theme');
    }

    // ════════════════════════════════════════
    // MAIN API
    // ════════════════════════════════════════
    function apply(data) {
        if (!data || !data.themeId) { remove(); return; }
        var theme = getTheme(data.themeId);
        if (!theme) { remove(); return; }
        // Don't rebuild if same theme
        if (state.id === data.themeId && state.container) return;

        remove();
        state.id = data.themeId;

        injectCSS();
        applyAccentColor(theme);
        createParticles(theme);
        createToast(theme);
        createNavLine(theme);
        createGlow(theme);
        decorateLogos(theme);
    }

    function remove() {
        if (state.container) { state.container.remove(); state.container = null; }
        if (state.toast) { state.toast.remove(); state.toast = null; }
        removeNavLine();
        var glow = document.querySelector('.gb-glow'); if (glow) glow.remove();
        // Clean up logo decorations
        document.querySelectorAll('.gb-santa-hat').forEach(function(el) { el.remove(); });
        document.querySelectorAll('.gb-hero-santa-hat').forEach(function(el) { el.remove(); });
        document.querySelectorAll('.nav-logo').forEach(function(l) {
            l.style.removeProperty('position');
            l.style.removeProperty('overflow');
        });
        removeAccentColor();
        state.id = null;
    }

    // ════════════════════════════════════════
    // EXPOSE
    // ════════════════════════════════════════
    window.GBThemeEffects = { apply: apply, remove: remove };

})();
