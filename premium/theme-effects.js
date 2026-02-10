/**
 * Golden Barbers - Immersive Seasonal Theme Effects
 * Particles, banners, borders, logo decorations & color overrides
 *
 * Usage: GBThemeEffects.apply(firebaseThemeData)
 *        GBThemeEffects.remove()
 */
(function() {
    'use strict';

    var state = { container: null, banner: null, border: null, style: null, logoDeco: [], id: null };
    var isMobile = window.innerWidth < 768;

    // ════════════════════════════════════════
    // THEME DEFINITIONS - Colors, particles, decorations
    // ════════════════════════════════════════
    var THEMES = {

        // ─── CHRISTMAS ──────────────────────
        christmas: {
            colors: {
                gold: '#C62828', goldDark: '#1B5E20', goldLight: '#FFCDD2',
                glow: 'rgba(198,40,40,0.35)', bg: '#0C0606'
            },
            particles: [
                { emoji: '❄', count: 12, size: [14,24], opacity: [0.25,0.65] },
                { emoji: '🎄', count: 2, size: [18,26], opacity: [0.45,0.75] },
                { emoji: '🎁', count: 2, size: [16,22], opacity: [0.4,0.7] },
                { emoji: '⭐', count: 3, size: [10,16], opacity: [0.3,0.55] },
                { emoji: '🍬', count: 2, size: [14,20], opacity: [0.4,0.65] },
                { emoji: '🔔', count: 2, size: [14,20], opacity: [0.35,0.6] }
            ],
            anim: 'fall', speed: [8,18],
            banner: {
                icon: '🎄', iconR: '🎅',
                title: 'MERRY CHRISTMAS',
                sub: 'Wishing you a festive season full of style!',
                bg: 'linear-gradient(135deg, #B71C1C, #1B5E20)',
                color: '#fff'
            },
            border: 'candy-cane',
            logoDeco: '🎅', logoPos: { top: '-10px', right: '-6px', size: '20px', rotate: '15deg' }
        },

        // ─── VALENTINE'S ────────────────────
        valentines: {
            colors: {
                gold: '#E91E63', goldDark: '#880E4F', goldLight: '#FCE4EC',
                glow: 'rgba(233,30,99,0.3)', bg: '#120608'
            },
            particles: [
                { emoji: '❤️', count: 7, size: [14,24], opacity: [0.2,0.5] },
                { emoji: '💕', count: 4, size: [12,20], opacity: [0.2,0.5] },
                { emoji: '💗', count: 3, size: [14,22], opacity: [0.2,0.45] },
                { emoji: '🌹', count: 3, size: [16,22], opacity: [0.35,0.6] },
                { emoji: '💘', count: 2, size: [16,22], opacity: [0.25,0.5] }
            ],
            anim: 'rise', speed: [12,22],
            banner: {
                icon: '💕', iconR: '❤️',
                title: "VALENTINE'S DAY",
                sub: 'Look sharp for your special someone!',
                bg: 'linear-gradient(135deg, #C2185B, #E91E63, #F06292)',
                color: '#fff'
            },
            border: 'hearts',
            logoDeco: '💝', logoPos: { top: '-8px', right: '-6px', size: '18px', rotate: '-10deg' }
        },

        // ─── WINTER ─────────────────────────
        winter: {
            colors: {
                gold: '#4FC3F7', goldDark: '#01579B', goldLight: '#E1F5FE',
                glow: 'rgba(79,195,247,0.25)', bg: '#060A10'
            },
            particles: [
                { emoji: '❄', count: 15, size: [10,22], opacity: [0.15,0.5] },
                { emoji: '✨', count: 4, size: [8,14], opacity: [0.2,0.4] },
                { emoji: '🌨️', count: 2, size: [16,22], opacity: [0.2,0.4] }
            ],
            anim: 'fall', speed: [14,28],
            banner: {
                icon: '❄️', iconR: '🌨️',
                title: 'WINTER WARMTH',
                sub: 'Warm up with a fresh cut this winter',
                bg: 'linear-gradient(135deg, #0D47A1, #4FC3F7)',
                color: '#E1F5FE'
            },
            border: 'frost',
            logoDeco: '❄️', logoPos: { top: '-8px', right: '-4px', size: '16px', rotate: '0deg' }
        },

        // ─── HALLOWEEN ──────────────────────
        halloween: {
            colors: {
                gold: '#FF6F00', goldDark: '#4A148C', goldLight: '#FFE0B2',
                glow: 'rgba(255,111,0,0.3)', bg: '#0A0410'
            },
            particles: [
                { emoji: '🦇', count: 5, size: [18,28], opacity: [0.35,0.65] },
                { emoji: '🎃', count: 3, size: [20,28], opacity: [0.4,0.7] },
                { emoji: '👻', count: 3, size: [18,26], opacity: [0.3,0.6] },
                { emoji: '🕷️', count: 3, size: [12,18], opacity: [0.25,0.5] },
                { emoji: '💀', count: 2, size: [14,20], opacity: [0.25,0.5] }
            ],
            anim: 'sway', speed: [6,14],
            banner: {
                icon: '🎃', iconR: '👻',
                title: 'SPOOKY SEASON',
                sub: 'Get a killer look this Halloween!',
                bg: 'linear-gradient(135deg, #E65100, #4A148C)',
                color: '#FFE0B2'
            },
            border: 'eerie',
            logoDeco: '🎃', logoPos: { top: '-10px', right: '-6px', size: '20px', rotate: '10deg' }
        },

        // ─── EASTER ─────────────────────────
        easter: {
            colors: {
                gold: '#AB47BC', goldDark: '#4CAF50', goldLight: '#F3E5F5',
                glow: 'rgba(171,71,188,0.25)', bg: '#0E0810'
            },
            particles: [
                { emoji: '🌸', count: 6, size: [12,20], opacity: [0.25,0.5] },
                { emoji: '🥚', count: 3, size: [14,22], opacity: [0.35,0.6] },
                { emoji: '🐣', count: 3, size: [16,24], opacity: [0.4,0.65] },
                { emoji: '🐰', count: 2, size: [18,26], opacity: [0.4,0.65] },
                { emoji: '🌷', count: 3, size: [14,20], opacity: [0.3,0.55] },
                { emoji: '🦋', count: 2, size: [14,20], opacity: [0.25,0.5] }
            ],
            anim: 'fall', speed: [14,26],
            banner: {
                icon: '🐣', iconR: '🐰',
                title: 'HAPPY EASTER',
                sub: 'Spring into a fresh new look!',
                bg: 'linear-gradient(135deg, #CE93D8, #81C784)',
                color: '#fff'
            },
            border: 'pastel',
            logoDeco: '🐰', logoPos: { top: '-12px', right: '-4px', size: '20px', rotate: '-5deg' }
        },

        // ─── SUMMER ─────────────────────────
        summer: {
            colors: {
                gold: '#FF8F00', goldDark: '#0277BD', goldLight: '#FFF3E0',
                glow: 'rgba(255,143,0,0.3)', bg: '#0A0806'
            },
            particles: [
                { emoji: '☀️', count: 2, size: [22,32], opacity: [0.2,0.4] },
                { emoji: '🌊', count: 3, size: [16,24], opacity: [0.2,0.4] },
                { emoji: '🌴', count: 2, size: [22,30], opacity: [0.3,0.5] },
                { emoji: '🏖️', count: 2, size: [18,26], opacity: [0.25,0.45] },
                { emoji: '🍦', count: 2, size: [14,20], opacity: [0.3,0.5] },
                { emoji: '😎', count: 2, size: [16,22], opacity: [0.3,0.5] }
            ],
            anim: 'sway', speed: [8,16],
            banner: {
                icon: '☀️', iconR: '🌴',
                title: 'SUMMER VIBES',
                sub: 'Stay fresh all summer long!',
                bg: 'linear-gradient(135deg, #E65100, #0288D1)',
                color: '#fff'
            },
            border: 'wave',
            logoDeco: '🕶️', logoPos: { top: '-4px', right: '-8px', size: '20px', rotate: '-8deg' }
        },

        // ─── EID ────────────────────────────
        eid: {
            colors: {
                gold: '#FDD835', goldDark: '#2E7D32', goldLight: '#FFF9C4',
                glow: 'rgba(253,216,53,0.3)', bg: '#080A06'
            },
            particles: [
                { emoji: '✨', count: 8, size: [8,16], opacity: [0.25,0.5] },
                { emoji: '⭐', count: 4, size: [10,18], opacity: [0.25,0.5] },
                { emoji: '🏮', count: 3, size: [18,26], opacity: [0.4,0.65] },
                { emoji: '☪️', count: 2, size: [20,28], opacity: [0.3,0.55] },
                { emoji: '🌙', count: 2, size: [16,24], opacity: [0.3,0.55] }
            ],
            anim: 'float', speed: [8,16],
            banner: {
                icon: '☪️', iconR: '✨',
                title: 'EID MUBARAK',
                sub: 'Celebrate in style with a fresh look!',
                bg: 'linear-gradient(135deg, #2E7D32, #F9A825)',
                color: '#FFF9C4'
            },
            border: 'gold-dots',
            logoDeco: '☪️', logoPos: { top: '-8px', right: '-6px', size: '18px', rotate: '0deg' }
        },

        // ─── RAMADAN ────────────────────────
        ramadan: {
            colors: {
                gold: '#B8860B', goldDark: '#1A237E', goldLight: '#E8EAF6',
                glow: 'rgba(184,134,11,0.3)', bg: '#060610'
            },
            particles: [
                { emoji: '☪️', count: 3, size: [20,28], opacity: [0.2,0.45] },
                { emoji: '🌙', count: 4, size: [16,24], opacity: [0.2,0.45] },
                { emoji: '⭐', count: 7, size: [8,16], opacity: [0.15,0.35] },
                { emoji: '🏮', count: 3, size: [18,26], opacity: [0.35,0.6] },
                { emoji: '✨', count: 4, size: [8,14], opacity: [0.2,0.4] }
            ],
            anim: 'float', speed: [10,20],
            banner: {
                icon: '🌙', iconR: '🏮',
                title: 'RAMADAN KAREEM',
                sub: 'Wishing you a blessed and beautiful month',
                bg: 'linear-gradient(135deg, #1A237E, #B8860B)',
                color: '#E8EAF6'
            },
            border: 'lantern',
            logoDeco: '🌙', logoPos: { top: '-8px', right: '-4px', size: '18px', rotate: '15deg' }
        },

        // ─── BLACK FRIDAY ───────────────────
        'black-friday': {
            colors: {
                gold: '#FF1744', goldDark: '#212121', goldLight: '#FFD600',
                glow: 'rgba(255,23,68,0.4)', bg: '#050505'
            },
            particles: [
                { emoji: '💰', count: 3, size: [16,24], opacity: [0.35,0.6] },
                { emoji: '⚡', count: 5, size: [14,22], opacity: [0.4,0.7] },
                { emoji: '🏷️', count: 3, size: [16,22], opacity: [0.35,0.6] },
                { emoji: '💥', count: 3, size: [18,26], opacity: [0.35,0.6] },
                { emoji: '🔥', count: 3, size: [14,22], opacity: [0.35,0.6] }
            ],
            anim: 'fall', speed: [3,8],
            banner: {
                icon: '⚡', iconR: '🔥',
                title: 'BLACK FRIDAY',
                sub: 'Biggest deals of the year!',
                bg: 'linear-gradient(135deg, #000, #D50000)',
                color: '#FFD600'
            },
            border: 'neon',
            logoDeco: '🏷️', logoPos: { top: '-8px', right: '-8px', size: '20px', rotate: '25deg' }
        },

        // ─── NEW YEAR ───────────────────────
        'new-year': {
            colors: {
                gold: '#FFD700', goldDark: '#0D47A1', goldLight: '#FFFDE7',
                glow: 'rgba(255,215,0,0.35)', bg: '#060614'
            },
            particles: [
                { emoji: '🎉', count: 4, size: [16,24], opacity: [0.35,0.6] },
                { emoji: '🎊', count: 3, size: [14,22], opacity: [0.35,0.6] },
                { emoji: '🥂', count: 2, size: [18,26], opacity: [0.4,0.65] },
                { emoji: '✨', count: 6, size: [8,16], opacity: [0.25,0.5] },
                { emoji: '🎆', count: 3, size: [20,28], opacity: [0.35,0.6] }
            ],
            anim: 'fall', speed: [7,16],
            banner: {
                icon: '🎉', iconR: '🥂',
                title: 'HAPPY NEW YEAR',
                sub: 'New year, new look!',
                bg: 'linear-gradient(135deg, #0D47A1, #FFD700)',
                color: '#fff'
            },
            border: 'sparkle',
            logoDeco: '🎉', logoPos: { top: '-10px', right: '-6px', size: '20px', rotate: '-15deg' }
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
    // CSS INJECTION
    // ════════════════════════════════════════
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            // Particle container
            '.gb-fx{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9990;overflow:hidden}',

            // Particle base
            '.gb-p{position:absolute;pointer-events:none;z-index:9990;will-change:transform,opacity;line-height:1}',

            // ── FALL ──
            '@keyframes gb-fall{' +
                '0%{transform:translateY(-8vh) translateX(0) rotate(0deg);opacity:0}' +
                '6%{opacity:var(--op)}' +
                '25%{transform:translateY(25vh) translateX(calc(var(--dx) * .4)) rotate(90deg)}' +
                '50%{transform:translateY(50vh) translateX(calc(var(--dx) * -.25)) rotate(180deg)}' +
                '75%{transform:translateY(75vh) translateX(calc(var(--dx) * .6)) rotate(270deg)}' +
                '94%{opacity:var(--op)}' +
                '100%{transform:translateY(108vh) translateX(var(--dx)) rotate(360deg);opacity:0}}',

            // ── RISE ──
            '@keyframes gb-rise{' +
                '0%{transform:translateY(108vh) translateX(0) scale(.4);opacity:0}' +
                '8%{opacity:var(--op);transform:translateY(92vh) scale(.65)}' +
                '30%{transform:translateY(70vh) translateX(calc(var(--dx) * .5)) scale(.85) rotate(-8deg)}' +
                '50%{transform:translateY(50vh) translateX(calc(var(--dx) * -.3)) scale(1) rotate(4deg)}' +
                '70%{transform:translateY(30vh) translateX(calc(var(--dx) * .6)) scale(.9) rotate(-4deg)}' +
                '92%{opacity:var(--op)}' +
                '100%{transform:translateY(-8vh) translateX(0) scale(.5) rotate(8deg);opacity:0}}',

            // ── FLOAT ──
            '@keyframes gb-float{' +
                '0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}' +
                '20%{transform:translate(14px,-20px) scale(1.06) rotate(3deg)}' +
                '40%{transform:translate(-10px,12px) scale(.96) rotate(-2deg)}' +
                '60%{transform:translate(16px,-8px) scale(1.03) rotate(2deg)}' +
                '80%{transform:translate(-12px,16px) scale(.97) rotate(-3deg)}}',

            // ── SWAY ──
            '@keyframes gb-sway{' +
                '0%,100%{transform:translate(0,0) rotate(0deg)}' +
                '15%{transform:translate(28px,-30px) rotate(10deg)}' +
                '35%{transform:translate(-24px,20px) rotate(-8deg)}' +
                '55%{transform:translate(32px,-15px) rotate(7deg)}' +
                '75%{transform:translate(-20px,25px) rotate(-10deg)}}',

            // ── BANNER ──
            '.gb-tb{position:fixed;top:0;left:0;width:100%;z-index:10001;' +
                'font-family:"Outfit",sans-serif;pointer-events:auto;' +
                'transform:translateY(-100%);animation:gb-tbin .6s cubic-bezier(.34,1.56,.64,1) .3s forwards;' +
                'box-shadow:0 4px 30px rgba(0,0,0,.4)}',
            '@keyframes gb-tbin{to{transform:translateY(0)}}',
            '.gb-tb-in{padding:10px 44px 10px 16px;display:flex;align-items:center;justify-content:center;gap:10px}',
            '.gb-tb-ic{font-size:22px;animation:gb-iconpulse 2.5s ease-in-out infinite;line-height:1;flex-shrink:0}',
            '@keyframes gb-iconpulse{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.2) rotate(-5deg)}50%{transform:scale(1) rotate(0deg)}75%{transform:scale(1.15) rotate(5deg)}}',
            '.gb-tb-txt{text-align:center}',
            '.gb-tb-t{font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;line-height:1.3}',
            '.gb-tb-s{font-size:11px;font-weight:500;opacity:.8;line-height:1.3;margin-top:1px}',
            '.gb-tb-x{position:absolute;right:10px;top:50%;transform:translateY(-50%);' +
                'background:rgba(255,255,255,.12);border:none;color:inherit;' +
                'width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:16px;' +
                'display:flex;align-items:center;justify-content:center;transition:background .2s;line-height:1}',
            '.gb-tb-x:hover{background:rgba(255,255,255,.22)}',
            'body.gb-has-banner{padding-top:54px!important;transition:padding-top .3s ease}',

            // ── BORDERS ──
            '.gb-bdr{position:fixed;left:0;width:100%;z-index:10000;pointer-events:none;top:54px}',
            // Candy cane (Christmas)
            '.gb-bdr-candy{height:5px;background:repeating-linear-gradient(90deg,#C62828 0,#C62828 12px,#fff 12px,#fff 24px,#C62828 24px)}',
            // Hearts (Valentine's)
            '.gb-bdr-hearts{height:3px;background:linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63);background-size:200% 100%;animation:gb-shift 4s linear infinite}',
            '@keyframes gb-shift{0%{background-position:0 0}100%{background-position:200% 0}}',
            // Frost (Winter)
            '.gb-bdr-frost{height:3px;background:linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,.7),rgba(225,245,254,.9),rgba(79,195,247,.7),rgba(79,195,247,0));animation:gb-shimmer 3s ease-in-out infinite}',
            '@keyframes gb-shimmer{0%,100%{opacity:.6}50%{opacity:1}}',
            // Eerie (Halloween)
            '.gb-bdr-eerie{height:3px;background:linear-gradient(90deg,#4A148C,#FF6F00,#4A148C);box-shadow:0 0 8px rgba(255,111,0,.4),0 0 16px rgba(74,20,140,.3)}',
            // Pastel (Easter)
            '.gb-bdr-pastel{height:4px;background:repeating-linear-gradient(90deg,#CE93D8 0,#CE93D8 15px,#81C784 15px,#81C784 30px,#FFF59D 30px,#FFF59D 45px,#F48FB1 45px,#F48FB1 60px)}',
            // Wave (Summer)
            '.gb-bdr-wave{height:4px;background:linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1);background-size:200% 100%;animation:gb-shift 3s linear infinite}',
            // Gold dots (Eid)
            '.gb-bdr-golddots{height:3px;background:repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)}',
            // Lantern (Ramadan)
            '.gb-bdr-lantern{height:3px;background:linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,.5),#B8860B,rgba(184,134,11,0));animation:gb-shimmer 4s ease-in-out infinite}',
            // Neon (Black Friday)
            '.gb-bdr-neon{height:2px;background:#FF1744;box-shadow:0 0 6px #FF1744,0 0 12px #FF1744,0 0 24px rgba(255,23,68,.5);animation:gb-neonflash 1.5s ease-in-out infinite}',
            '@keyframes gb-neonflash{0%,100%{opacity:1;box-shadow:0 0 6px #FF1744,0 0 12px #FF1744,0 0 24px rgba(255,23,68,.5)}50%{opacity:.6;box-shadow:0 0 3px #FF1744,0 0 6px #FF1744}}',
            // Sparkle (New Year)
            '.gb-bdr-sparkle{height:3px;background:linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent);background-size:200% 100%;animation:gb-shift 2.5s linear infinite}',

            // ── LOGO DECORATION ──
            '.gb-logo-deco{position:absolute;pointer-events:none;z-index:10;line-height:1;' +
                'animation:gb-logobounce 3s ease-in-out infinite;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}',
            '@keyframes gb-logobounce{0%,100%{transform:rotate(var(--lr)) scale(1)}50%{transform:rotate(var(--lr)) scale(1.15)}}',

            // ── AMBIENT GLOW ──
            '.gb-glow{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9989;' +
                'background:radial-gradient(ellipse at 50% 0%,var(--gb-glow) 0%,transparent 65%);opacity:0;' +
                'animation:gb-glowin 2s ease forwards .8s}',
            '@keyframes gb-glowin{to{opacity:1}}',

            // ── RESPONSIVE ──
            '@media(max-width:600px){' +
                '.gb-tb-in{padding:8px 38px 8px 12px}' +
                '.gb-tb-ic{font-size:18px}' +
                '.gb-tb-t{font-size:10px;letter-spacing:2px}' +
                '.gb-tb-s{font-size:9px}' +
                'body.gb-has-banner{padding-top:48px!important}' +
                '.gb-bdr{top:48px}' +
            '}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    // ════════════════════════════════════════
    // PARTICLES
    // ════════════════════════════════════════
    function createParticles(theme) {
        if (state.container) state.container.remove();
        state.container = document.createElement('div');
        state.container.className = 'gb-fx';

        var mult = isMobile ? 0.5 : 1;

        theme.particles.forEach(function(p) {
            var count = Math.max(1, Math.round(p.count * mult));
            for (var i = 0; i < count; i++) {
                var el = document.createElement('span');
                el.className = 'gb-p';
                el.textContent = p.emoji;

                var size = rand(p.size[0], p.size[1]);
                var opacity = rand(p.opacity[0], p.opacity[1]);
                var duration = rand(theme.speed[0], theme.speed[1]);
                var delay = rand(0, duration * 0.8);
                var drift = rand(-70, 70);
                var left = rand(3, 97);

                el.style.fontSize = size + 'px';
                el.style.setProperty('--op', opacity.toFixed(2));
                el.style.setProperty('--dx', drift + 'px');
                el.style.setProperty('--rot', Math.floor(rand(180, 720)) + 'deg');
                el.style.left = left + '%';

                var animName;
                if (theme.anim === 'rise') {
                    animName = 'gb-rise';
                } else if (theme.anim === 'float') {
                    animName = 'gb-float';
                    el.style.top = rand(8, 85) + '%';
                    el.style.opacity = opacity;
                    duration = rand(7, 16);
                } else if (theme.anim === 'sway') {
                    animName = 'gb-sway';
                    el.style.top = rand(8, 85) + '%';
                    el.style.opacity = opacity;
                    duration = rand(8, 18);
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
    // BANNER
    // ════════════════════════════════════════
    function createBanner(theme) {
        if (state.banner) state.banner.remove();
        // Check if user dismissed this theme's banner this session
        try { if (sessionStorage.getItem('gb-dismissed') === state.id) return; } catch(e) {}

        var b = theme.banner;
        state.banner = document.createElement('div');
        state.banner.className = 'gb-tb';
        state.banner.style.background = b.bg;
        state.banner.style.color = b.color;

        state.banner.innerHTML =
            '<div class="gb-tb-in">' +
                '<span class="gb-tb-ic">' + b.icon + '</span>' +
                '<div class="gb-tb-txt">' +
                    '<div class="gb-tb-t">' + b.title + '</div>' +
                    '<div class="gb-tb-s">' + b.sub + '</div>' +
                '</div>' +
                '<span class="gb-tb-ic">' + b.iconR + '</span>' +
            '</div>' +
            '<button class="gb-tb-x" onclick="GBThemeEffects.dismiss()" aria-label="Close">&times;</button>';

        document.body.insertBefore(state.banner, document.body.firstChild);
        document.body.classList.add('gb-has-banner');
    }

    // ════════════════════════════════════════
    // BORDER
    // ════════════════════════════════════════
    function createBorder(type) {
        if (state.border) state.border.remove();
        if (!type) return;

        state.border = document.createElement('div');
        state.border.className = 'gb-bdr';

        var map = {
            'candy-cane': 'gb-bdr-candy',
            'hearts': 'gb-bdr-hearts',
            'frost': 'gb-bdr-frost',
            'eerie': 'gb-bdr-eerie',
            'pastel': 'gb-bdr-pastel',
            'wave': 'gb-bdr-wave',
            'gold-dots': 'gb-bdr-golddots',
            'lantern': 'gb-bdr-lantern',
            'neon': 'gb-bdr-neon',
            'sparkle': 'gb-bdr-sparkle'
        };

        if (map[type]) state.border.classList.add(map[type]);
        document.body.appendChild(state.border);
    }

    // ════════════════════════════════════════
    // LOGO DECORATION
    // ════════════════════════════════════════
    function decorateLogos(theme) {
        // Remove old
        state.logoDeco.forEach(function(d) { d.remove(); });
        state.logoDeco = [];
        // Remove old position:relative we set
        document.querySelectorAll('.nav-logo').forEach(function(logo) {
            logo.style.removeProperty('position');
            logo.style.removeProperty('overflow');
        });

        if (!theme.logoDeco) return;

        var logos = document.querySelectorAll('.nav-logo');
        logos.forEach(function(logo) {
            logo.style.position = 'relative';
            logo.style.overflow = 'visible';

            var deco = document.createElement('span');
            deco.className = 'gb-logo-deco';
            deco.textContent = theme.logoDeco;
            deco.style.fontSize = theme.logoPos.size;
            deco.style.top = theme.logoPos.top;
            deco.style.right = theme.logoPos.right;
            deco.style.setProperty('--lr', theme.logoPos.rotate);

            logo.appendChild(deco);
            state.logoDeco.push(deco);
        });

        // Also decorate Adam chat button if it exists
        var adamBtn = document.getElementById('adamChatBtn');
        if (adamBtn) {
            adamBtn.style.position = 'relative';
            adamBtn.style.overflow = 'visible';
            var deco2 = document.createElement('span');
            deco2.className = 'gb-logo-deco';
            deco2.textContent = theme.logoDeco;
            deco2.style.fontSize = '16px';
            deco2.style.top = '-8px';
            deco2.style.right = '-6px';
            deco2.style.setProperty('--lr', theme.logoPos.rotate);
            adamBtn.appendChild(deco2);
            state.logoDeco.push(deco2);
        }
    }

    // ════════════════════════════════════════
    // AMBIENT GLOW
    // ════════════════════════════════════════
    function createGlow(theme) {
        // Remove existing
        var old = document.querySelector('.gb-glow');
        if (old) old.remove();

        if (!theme.colors.glow) return;

        var glow = document.createElement('div');
        glow.className = 'gb-glow';
        glow.style.setProperty('--gb-glow', theme.colors.glow);
        document.body.appendChild(glow);
    }

    // ════════════════════════════════════════
    // COLOR APPLICATION
    // ════════════════════════════════════════
    function applyColors(c) {
        if (!c) return;
        var r = document.documentElement;
        r.style.setProperty('--gold', c.gold);
        r.style.setProperty('--gold-dark', c.goldDark);
        r.style.setProperty('--gold-light', c.goldLight);
        r.style.setProperty('--gold-glow', c.glow);
        if (c.bg) {
            r.style.setProperty('--black', c.bg);
            r.style.setProperty('--dark', c.bg);
        }
        document.body.classList.add('themed');
    }

    function removeColors() {
        var r = document.documentElement;
        ['--gold','--gold-dark','--gold-light','--gold-glow','--black','--dark'].forEach(function(p) {
            r.style.removeProperty(p);
        });
        document.body.classList.remove('themed');
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
        applyColors(theme.colors);
        createParticles(theme);
        createBanner(theme);
        createBorder(theme.border);
        decorateLogos(theme);
        createGlow(theme);
    }

    function remove() {
        if (state.container) { state.container.remove(); state.container = null; }
        if (state.banner) { state.banner.remove(); state.banner = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        state.logoDeco.forEach(function(d) { d.remove(); }); state.logoDeco = [];
        var glow = document.querySelector('.gb-glow'); if (glow) glow.remove();
        document.body.classList.remove('gb-has-banner');
        // Reset logo styles
        document.querySelectorAll('.nav-logo').forEach(function(l) {
            l.style.removeProperty('position');
            l.style.removeProperty('overflow');
        });
        var adamBtn = document.getElementById('adamChatBtn');
        if (adamBtn) { adamBtn.style.removeProperty('position'); adamBtn.style.removeProperty('overflow'); }
        removeColors();
        state.id = null;
    }

    function dismiss() {
        if (state.banner) { state.banner.remove(); state.banner = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        document.body.classList.remove('gb-has-banner');
        try { sessionStorage.setItem('gb-dismissed', state.id); } catch(e) {}
    }

    // ════════════════════════════════════════
    // EXPOSE
    // ════════════════════════════════════════
    window.GBThemeEffects = { apply: apply, remove: remove, dismiss: dismiss };

})();
