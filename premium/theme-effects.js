/**
 * Golden Barbers - Premium Seasonal Theme Effects v4
 * Agency-quality seasonal theming. Brand gold STAYS - seasonal colors
 * come through decorations, logo glow, and creative elements only.
 *
 * Usage: GBThemeEffects.apply(firebaseThemeData)
 *        GBThemeEffects.remove()
 */
(function() {
    'use strict';

    var state = {
        container: null,    // Particle overlay
        toast: null,        // Toast notification
        border: null,       // Top border accent
        style: null,        // Injected stylesheet
        navLine: null,      // Nav accent line
        corners: [],        // Corner ornament elements
        creative: null,     // Creative element (lights, fog, etc.)
        atmosphere: null,   // Atmosphere overlay
        logoDeco: [],       // Logo decorations (hat)
        savedNeon: null,    // Original neon circle styles
        savedNavGlow: null, // Original nav logo styles
        id: null
    };
    var isMobile = window.innerWidth < 768;

    /* ═══════════════════════════════════════════
       SVG ASSETS
    ═══════════════════════════════════════════ */

    /* Realistic Santa Hat - fabric gradients, fur trim, pompom */
    var SANTA_HAT_SVG = '<svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
            '<linearGradient id="gbHF" x1="0.2" y1="0" x2="0.8" y2="1">' +
                '<stop offset="0%" stop-color="#E53935"/>' +
                '<stop offset="40%" stop-color="#D32F2F"/>' +
                '<stop offset="100%" stop-color="#B71C1C"/>' +
            '</linearGradient>' +
            '<radialGradient id="gbPM" cx="0.4" cy="0.35" r="0.6">' +
                '<stop offset="0%" stop-color="#FFFFFF"/>' +
                '<stop offset="60%" stop-color="#F5F5F5"/>' +
                '<stop offset="100%" stop-color="#E0E0E0"/>' +
            '</radialGradient>' +
            '<linearGradient id="gbFB" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#FFFFFF"/>' +
                '<stop offset="40%" stop-color="#FAFAFA"/>' +
                '<stop offset="100%" stop-color="#EEEEEE"/>' +
            '</linearGradient>' +
        '</defs>' +
        '<path d="M18 72 C22 42, 38 18, 58 6 C62 3, 67 4, 66 10 C62 28, 72 52, 84 72 Z" fill="url(#gbHF)"/>' +
        '<path d="M28 68 C32 44, 44 22, 58 10 C52 30, 50 48, 54 68 Z" fill="#E53935" opacity="0.45"/>' +
        '<path d="M65 18 C68 35, 76 55, 82 70 C74 60, 70 40, 66 22 Z" fill="#9B1B1B" opacity="0.25"/>' +
        '<path d="M10 70 C10 62, 25 57, 50 57 C75 57, 90 62, 90 70 C90 80, 75 84, 50 84 C25 84, 10 80, 10 70 Z" fill="url(#gbFB)"/>' +
        '<path d="M16 72 C28 66, 38 64, 50 64 C62 64, 72 66, 84 72" stroke="#E8E8E8" stroke-width="1" fill="none" opacity="0.5"/>' +
        '<path d="M20 76 C32 72, 40 71, 50 71 C60 71, 68 72, 80 76" stroke="#DEDEDE" stroke-width="0.7" fill="none" opacity="0.35"/>' +
        '<circle cx="62" cy="8" r="10" fill="url(#gbPM)"/>' +
        '<circle cx="59" cy="5" r="3.5" fill="#fff" opacity="0.7"/>' +
        '<circle cx="65" cy="11" r="2" fill="#D5D5D5" opacity="0.4"/>' +
    '</svg>';

    /* Holly Corner SVG - top-left positioning */
    var HOLLY_SVG = '<svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M10 5 Q40 8, 65 30 Q80 45, 90 70 Q95 85, 100 110" stroke="#2d5a27" stroke-width="2" fill="none" opacity="0.7"/>' +
        '<path d="M25 10 Q35 3, 48 8 Q55 0, 62 10 Q68 5, 65 18 Q55 25, 45 20 Q35 28, 28 18 Q20 22, 25 10Z" fill="#1a472a" opacity="0.85"/>' +
        '<path d="M55 30 Q63 22, 75 28 Q82 20, 88 30 Q94 25, 90 38 Q82 45, 72 40 Q63 48, 58 38 Q50 42, 55 30Z" fill="#1a472a" opacity="0.8"/>' +
        '<path d="M40 18 Q48 12, 58 17 Q62 10, 58 22 Q50 28, 43 23 Q36 26, 40 18Z" fill="#2d5a27" opacity="0.7"/>' +
        '<path d="M70 55 Q78 48, 88 54 Q92 47, 88 60 Q80 66, 73 60 Q66 64, 70 55Z" fill="#2d5a27" opacity="0.65"/>' +
        '<circle cx="50" cy="16" r="5" fill="#C62828"/>' +
        '<circle cx="43" cy="12" r="4" fill="#D32F2F"/>' +
        '<circle cx="47" cy="22" r="4.5" fill="#B71C1C"/>' +
        '<circle cx="48" cy="14" r="1.5" fill="#E57373" opacity="0.5"/>' +
        '<circle cx="75" cy="38" r="4" fill="#C62828"/>' +
        '<circle cx="70" cy="35" r="3.5" fill="#D32F2F"/>' +
        '<circle cx="73" cy="30" r="1.2" fill="#E57373" opacity="0.5"/>' +
    '</svg>';

    /* Cobweb SVG for Halloween - top-left corner */
    var COBWEB_SVG = '<svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0 0 L150 0" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>' +
        '<path d="M0 0 L0 150" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>' +
        '<path d="M0 0 L140 140" stroke="rgba(255,255,255,0.12)" stroke-width="0.6"/>' +
        '<path d="M0 0 L70 150" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>' +
        '<path d="M0 0 L150 70" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>' +
        '<path d="M20 0 Q20 20, 0 20" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" fill="none"/>' +
        '<path d="M50 0 Q50 50, 0 50" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" fill="none"/>' +
        '<path d="M85 0 Q85 85, 0 85" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" fill="none"/>' +
        '<path d="M120 0 Q120 120, 0 120" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" fill="none"/>' +
    '</svg>';

    /* ═══════════════════════════════════════════
       THEME DEFINITIONS
       --gold is NEVER overridden. Seasonal color
       comes through decorations + logo glow only.
    ═══════════════════════════════════════════ */
    var THEMES = {

        christmas: {
            neon: {
                border: '3px solid rgba(200, 60, 60, 0.8)',
                shadow: '0 0 25px rgba(200,60,60,0.45), 0 0 50px rgba(46,125,50,0.3), 0 0 80px rgba(200,60,60,0.15), inset 0 0 15px rgba(200,60,60,0.12)'
            },
            navGlow: '0 0 10px rgba(200,60,60,0.25), 0 0 20px rgba(46,125,50,0.12)',
            snow: true,
            creative: 'stringLights',
            corner: 'holly',
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(30,60,100,0.04) 0%, transparent 55%)',
            toast: { title: 'MERRY CHRISTMAS', sub: 'Wishing you a festive season full of style!', bg: 'linear-gradient(135deg, #1B5E20, #C62828)', color: '#fff' },
            border: { bg: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 8px,transparent 8px,transparent 14px,#1B5E20 14px,#1B5E20 22px,transparent 22px,transparent 28px)', height: 3 },
            navLine: 'linear-gradient(90deg, transparent, #C62828, #d4af37, #1B5E20, transparent)',
            hat: true
        },

        valentines: {
            neon: {
                border: '3px solid rgba(200, 100, 120, 0.8)',
                shadow: '0 0 25px rgba(200,100,120,0.45), 0 0 50px rgba(233,30,99,0.2), inset 0 0 15px rgba(200,100,120,0.1)'
            },
            navGlow: '0 0 10px rgba(233,30,99,0.2), 0 0 20px rgba(200,100,120,0.1)',
            particles: [
                { shape: 'heart', color: '#E91E63', count: 6, size: [12, 20], opacity: [0.18, 0.42] },
                { shape: 'heart', color: '#F48FB1', count: 4, size: [8, 14], opacity: [0.14, 0.35] },
                { shape: 'circle', color: '#FCE4EC', count: 5, size: [3, 6], opacity: [0.1, 0.25] }
            ],
            anim: 'rise', speed: [16, 30], drift: [4, 8],
            atmosphere: 'radial-gradient(ellipse at 30% 50%, rgba(233,30,99,0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(200,100,120,0.03) 0%, transparent 50%)',
            toast: { title: "VALENTINE'S DAY", sub: 'Look sharp for your special someone!', bg: 'linear-gradient(135deg, #880E4F, #E91E63)', color: '#fff' },
            border: { bg: 'linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63)', height: 3, animated: true },
            navLine: 'linear-gradient(90deg, transparent, #F48FB1, #E91E63, #F48FB1, transparent)'
        },

        winter: {
            neon: {
                border: '3px solid rgba(100, 180, 246, 0.75)',
                shadow: '0 0 25px rgba(100,180,246,0.4), 0 0 50px rgba(79,195,247,0.25), inset 0 0 15px rgba(100,180,246,0.1)'
            },
            navGlow: '0 0 10px rgba(100,180,246,0.2), 0 0 20px rgba(79,195,247,0.1)',
            snow: true,
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(79,195,247,0.04) 0%, transparent 55%)',
            toast: { title: 'WINTER WARMTH', sub: 'Warm up with a fresh cut this winter', bg: 'linear-gradient(135deg, #01579B, #0288D1)', color: '#E1F5FE' },
            border: { bg: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,0.5),rgba(225,245,254,0.8),rgba(79,195,247,0.5),rgba(79,195,247,0))', height: 3, shimmer: true },
            navLine: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.4), rgba(225,245,254,0.7), rgba(79,195,247,0.4), transparent)'
        },

        halloween: {
            neon: {
                border: '3px solid rgba(255, 111, 0, 0.8)',
                shadow: '0 0 25px rgba(255,111,0,0.45), 0 0 50px rgba(106,27,154,0.25), inset 0 0 15px rgba(255,111,0,0.1)'
            },
            navGlow: '0 0 10px rgba(255,111,0,0.25), 0 0 20px rgba(106,27,154,0.12)',
            particles: [
                { shape: 'circle', color: '#FF6F00', count: 6, size: [4, 9], opacity: [0.12, 0.3] },
                { shape: 'circle', color: '#6A1B9A', count: 5, size: [5, 11], opacity: [0.08, 0.25] },
                { shape: 'circle', color: '#FFE0B2', count: 3, size: [2, 5], opacity: [0.08, 0.2] }
            ],
            anim: 'sway', speed: [10, 22], drift: [5, 10],
            creative: 'fog',
            corner: 'cobweb',
            atmosphere: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)',
            toast: { title: 'SPOOKY SEASON', sub: 'Get a killer look this Halloween!', bg: 'linear-gradient(135deg, #4A148C, #E65100)', color: '#FFE0B2' },
            border: { bg: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)', height: 3, glow: 'rgba(255,111,0,0.4)' },
            navLine: 'linear-gradient(90deg, #4A148C, #FF6F00, #4A148C, #FF6F00, #4A148C)'
        },

        easter: {
            neon: {
                border: '3px solid rgba(129, 199, 132, 0.75)',
                shadow: '0 0 25px rgba(129,199,132,0.35), 0 0 50px rgba(244,143,177,0.2), inset 0 0 15px rgba(129,199,132,0.1)'
            },
            navGlow: '0 0 10px rgba(129,199,132,0.2), 0 0 20px rgba(244,143,177,0.1)',
            particles: [
                { shape: 'petal', color: '#F48FB1', count: 6, size: [8, 14], opacity: [0.2, 0.45] },
                { shape: 'petal', color: '#81C784', count: 4, size: [6, 12], opacity: [0.15, 0.35] },
                { shape: 'circle', color: '#FFF59D', count: 3, size: [3, 7], opacity: [0.12, 0.28] }
            ],
            anim: 'fall', speed: [16, 32], drift: [4, 8],
            atmosphere: 'radial-gradient(ellipse at 25% 40%, rgba(129,199,132,0.03) 0%, transparent 45%), radial-gradient(ellipse at 75% 60%, rgba(244,143,177,0.03) 0%, transparent 45%)',
            toast: { title: 'HAPPY EASTER', sub: 'Spring into a fresh new look!', bg: 'linear-gradient(135deg, #66BB6A, #81C784)', color: '#fff' },
            border: { bg: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px)', height: 3 },
            navLine: 'linear-gradient(90deg, #F48FB1, #81C784, #FFF59D, #81C784, #F48FB1)'
        },

        summer: {
            neon: {
                border: '3px solid rgba(255, 143, 0, 0.75)',
                shadow: '0 0 25px rgba(255,143,0,0.35), 0 0 50px rgba(2,136,209,0.2), inset 0 0 15px rgba(255,143,0,0.1)'
            },
            navGlow: '0 0 10px rgba(255,143,0,0.2), 0 0 20px rgba(2,136,209,0.1)',
            particles: [
                { shape: 'circle', color: '#FF8F00', count: 5, size: [4, 9], opacity: [0.12, 0.28] },
                { shape: 'circle', color: '#0288D1', count: 4, size: [3, 7], opacity: [0.1, 0.25] },
                { shape: 'circle', color: '#FFF3E0', count: 3, size: [2, 5], opacity: [0.08, 0.2] }
            ],
            anim: 'float', speed: [8, 16], drift: [3, 6],
            creative: 'sunFlare',
            atmosphere: 'radial-gradient(ellipse at 85% 10%, rgba(255,200,100,0.06) 0%, transparent 50%)',
            toast: { title: 'SUMMER VIBES', sub: 'Stay fresh all summer long!', bg: 'linear-gradient(135deg, #E65100, #FF8F00)', color: '#fff' },
            border: { bg: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)', height: 3, animated: true },
            navLine: 'linear-gradient(90deg, #FF8F00, #0288D1, #FF8F00, #0288D1, #FF8F00)'
        },

        eid: {
            neon: {
                border: '3px solid rgba(253, 216, 53, 0.85)',
                shadow: '0 0 25px rgba(253,216,53,0.45), 0 0 50px rgba(46,125,50,0.2), inset 0 0 15px rgba(253,216,53,0.12)'
            },
            navGlow: '0 0 10px rgba(253,216,53,0.25), 0 0 20px rgba(46,125,50,0.1)',
            particles: [
                { shape: 'star', color: '#FDD835', count: 6, size: [6, 12], opacity: [0.2, 0.42] },
                { shape: 'circle', color: '#2E7D32', count: 4, size: [3, 7], opacity: [0.1, 0.25] },
                { shape: 'circle', color: '#FFF9C4', count: 3, size: [2, 5], opacity: [0.08, 0.2] }
            ],
            anim: 'float', speed: [8, 16], drift: [3, 6],
            toast: { title: 'EID MUBARAK', sub: 'Celebrate in style with a fresh look!', bg: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#FFF9C4' },
            border: { bg: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)', height: 3 },
            navLine: 'linear-gradient(90deg, transparent, #2E7D32, #FDD835, #2E7D32, transparent)'
        },

        ramadan: {
            neon: {
                border: '3px solid rgba(184, 134, 11, 0.85)',
                shadow: '0 0 25px rgba(184,134,11,0.4), 0 0 50px rgba(26,35,126,0.25), inset 0 0 15px rgba(184,134,11,0.1)'
            },
            navGlow: '0 0 10px rgba(184,134,11,0.2), 0 0 20px rgba(26,35,126,0.1)',
            particles: [
                { shape: 'star', color: '#B8860B', count: 5, size: [5, 10], opacity: [0.15, 0.35] },
                { shape: 'circle', color: '#1A237E', count: 3, size: [4, 8], opacity: [0.06, 0.18] },
                { shape: 'circle', color: '#E8EAF6', count: 3, size: [2, 5], opacity: [0.06, 0.16] }
            ],
            anim: 'float', speed: [12, 24], drift: [3, 6],
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(26,35,126,0.04) 0%, transparent 55%)',
            toast: { title: 'RAMADAN KAREEM', sub: 'Wishing you a blessed and beautiful month', bg: 'linear-gradient(135deg, #1A237E, #283593)', color: '#E8EAF6' },
            border: { bg: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,0.5),#B8860B,rgba(184,134,11,0))', height: 3, shimmer: true },
            navLine: 'linear-gradient(90deg, transparent, #1A237E, #B8860B, #1A237E, transparent)'
        },

        'black-friday': {
            neon: {
                border: '3px solid rgba(255, 23, 68, 0.8)',
                shadow: '0 0 25px rgba(255,23,68,0.45), 0 0 50px rgba(255,214,0,0.2), inset 0 0 15px rgba(255,23,68,0.1)'
            },
            navGlow: '0 0 10px rgba(255,23,68,0.25), 0 0 20px rgba(255,214,0,0.1)',
            particles: [
                { shape: 'circle', color: '#FF1744', count: 5, size: [3, 7], opacity: [0.18, 0.4] },
                { shape: 'circle', color: '#FFD600', count: 4, size: [2, 5], opacity: [0.15, 0.35] },
                { shape: 'circle', color: '#fff', count: 3, size: [1, 3], opacity: [0.08, 0.2] }
            ],
            anim: 'fall', speed: [3, 8], drift: [2, 5],
            toast: { title: 'BLACK FRIDAY', sub: 'Biggest deals of the year!', bg: 'linear-gradient(135deg, #000, #212121)', color: '#FFD600' },
            border: { bg: '#FF1744', height: 2, neon: '#FF1744' },
            navLine: 'linear-gradient(90deg, #FF1744, #FFD600, #FF1744, #FFD600, #FF1744)'
        },

        'new-year': {
            neon: {
                border: '3px solid rgba(255, 215, 0, 0.9)',
                shadow: '0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(13,71,161,0.25), inset 0 0 15px rgba(255,215,0,0.15)'
            },
            navGlow: '0 0 12px rgba(255,215,0,0.3), 0 0 24px rgba(13,71,161,0.12)',
            particles: [
                { shape: 'star', color: '#FFD700', count: 6, size: [5, 10], opacity: [0.2, 0.45] },
                { shape: 'circle', color: '#0D47A1', count: 4, size: [3, 7], opacity: [0.08, 0.22] },
                { shape: 'circle', color: '#fff', count: 4, size: [2, 4], opacity: [0.12, 0.3] }
            ],
            anim: 'fall', speed: [8, 18], drift: [3, 7],
            creative: 'confetti',
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(13,71,161,0.04) 0%, transparent 55%)',
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
       CSS STYLES
    ═══════════════════════════════════════════ */
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            /* Container */
            '.gb-fx{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden}',

            /* Particle wrapper (dual animation) */
            '.gb-pw{position:absolute;pointer-events:none;will-change:transform}',
            '.gb-p{pointer-events:none;will-change:transform}',

            /* Heart shape via spans */
            '.gb-heart{position:relative;display:inline-block}',

            /* Star shape */
            '.gb-star{clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}',

            /* Petal shape */
            '.gb-petal{border-radius:50% 0 50% 0}',

            /* ── FALL ── */
            '@keyframes gb-fall{0%{transform:translateY(-5vh);opacity:0}5%{opacity:var(--op)}95%{opacity:var(--op)}100%{transform:translateY(105vh);opacity:0}}',

            /* ── DRIFT ── */
            '@keyframes gb-drift{0%,100%{transform:translateX(0)}25%{transform:translateX(calc(var(--dx) * 0.6))}50%{transform:translateX(calc(var(--dx) * -0.4))}75%{transform:translateX(var(--dx))}}',

            /* ── RISE ── */
            '@keyframes gb-rise{0%{transform:translateY(105vh);opacity:0}8%{opacity:var(--op)}92%{opacity:var(--op)}100%{transform:translateY(-5vh);opacity:0}}',

            /* ── FLOAT ── */
            '@keyframes gb-vfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}',

            /* ── SWAY ── */
            '@keyframes gb-vsway{0%,100%{transform:translateY(0)}30%{transform:translateY(-25px)}60%{transform:translateY(15px)}}',

            /* ── SNOW LAYERS (box-shadow technique) ── */
            '.gb-snow{position:fixed;top:0;left:0;pointer-events:none;z-index:1;border-radius:50%;width:3px;height:3px;background:transparent}',
            '@keyframes gb-snowfall1{from{transform:translateY(0)}to{transform:translateY(var(--sh))}}',
            '@keyframes gb-snowfall2{from{transform:translateY(0)}to{transform:translateY(var(--sh))}}',
            '@keyframes gb-snowfall3{from{transform:translateY(0)}to{transform:translateY(var(--sh))}}',

            /* ── STRING LIGHTS ── */
            '.gb-lights{position:fixed;top:78px;left:0;width:100%;height:55px;pointer-events:none;z-index:998;opacity:0;animation:gb-fadein 1.5s ease 0.5s forwards}',
            '.gb-lights-wire{position:absolute;top:0;left:0;width:100%;height:100%}',
            '.gb-bulb{position:absolute;width:10px;height:14px;border-radius:50% 50% 50% 50% / 55% 55% 45% 45%;transform:translateX(-50%);animation:gb-glow 2.5s ease-in-out infinite}',
            '.gb-bulb-string{position:absolute;width:1px;background:rgba(120,120,120,0.4);top:0;left:50%;transform:translateX(-50%)}',
            '@keyframes gb-glow{0%,100%{box-shadow:0 2px 6px var(--gc),0 0 10px var(--gc);opacity:0.75}50%{box-shadow:0 2px 12px var(--gc),0 0 18px var(--gc);opacity:1}}',

            /* ── CORNER ORNAMENTS ── */
            '.gb-corner{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fadein 2s ease 0.8s forwards}',
            '.gb-corner svg{width:100%;height:100%}',

            /* ── FOG (Halloween) ── */
            '.gb-fog{position:fixed;bottom:0;left:0;width:200%;height:30vh;pointer-events:none;z-index:1;opacity:0;animation:gb-fadein 3s ease 1s forwards}',
            '.gb-fog-1{background:linear-gradient(to top,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.02) 40%,transparent 100%);animation:gb-fadein 3s ease 1s forwards, gb-fogdrift 30s linear infinite}',
            '.gb-fog-2{background:linear-gradient(to top,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 50%,transparent 100%);animation:gb-fadein 3s ease 1.5s forwards, gb-fogdrift 45s linear infinite reverse}',
            '@keyframes gb-fogdrift{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',

            /* ── SUN FLARE (Summer) ── */
            '.gb-sunflare{position:fixed;top:0;right:0;width:50vw;height:50vh;pointer-events:none;z-index:0;background:radial-gradient(ellipse at 90% 10%,rgba(255,200,100,0.08) 0%,transparent 60%);opacity:0;animation:gb-fadein 2s ease 0.5s forwards,gb-sunpulse 8s ease-in-out infinite}',
            '@keyframes gb-sunpulse{0%,100%{opacity:0.7}50%{opacity:1}}',

            /* ── CONFETTI (New Year - one-shot) ── */
            '.gb-confetti-wrap{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;overflow:hidden}',
            '.gb-conf{position:absolute;top:-10px;pointer-events:none;animation:gb-conffall var(--cd) ease-out forwards}',
            '@keyframes gb-conffall{0%{transform:translateY(0) rotate(0deg);opacity:1}80%{opacity:0.8}100%{transform:translateY(100vh) rotate(var(--cr));opacity:0}}',

            /* ── ATMOSPHERE OVERLAY ── */
            '.gb-atmo{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-fadein 2s ease 0.8s forwards}',

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
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-fadein 1s ease .8s forwards}',

            /* ── SANTA HAT ── */
            '.gb-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));' +
                'animation:gb-hatsettle 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.5s both}',
            '@keyframes gb-hatsettle{0%{transform:rotate(var(--hr)) translateY(-8px);opacity:0}100%{transform:rotate(var(--hr)) translateY(0);opacity:1}}',

            /* ── SHARED ── */
            '@keyframes gb-fadein{to{opacity:1}}',

            /* Responsive */
            '@media(max-width:600px){' +
                '.gb-toast{bottom:20px;max-width:calc(100% - 30px)}' +
                '.gb-toast-in{padding:14px 42px 14px 18px;gap:10px}' +
                '.gb-toast-t{font-size:10px;letter-spacing:2px}' +
                '.gb-toast-s{font-size:12px}' +
                '.gb-lights{display:none}' +
            '}',

            /* Reduced motion */
            '@media(prefers-reduced-motion:reduce){' +
                '.gb-pw,.gb-p,.gb-snow,.gb-bulb,.gb-fog,.gb-fog-1,.gb-fog-2,.gb-sunflare,.gb-conf{animation:none!important}' +
            '}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    /* ═══════════════════════════════════════════
       SNOWFALL - 3-layer parallax using box-shadow
       Each layer = 1 DOM element. Ultra-performant.
    ═══════════════════════════════════════════ */
    function createSnowfall() {
        if (state.container) state.container.remove();
        state.container = document.createElement('div');
        state.container.className = 'gb-fx';

        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var layers = [
            { count: isMobile ? 20 : 45, minS: 0, maxS: 1.2, minO: 0.2, maxO: 0.5, dur: 14 },
            { count: isMobile ? 12 : 28, minS: 0.5, maxS: 2.2, minO: 0.25, maxO: 0.55, dur: 20 },
            { count: isMobile ? 6 : 15, minS: 1.0, maxS: 3.0, minO: 0.3, maxO: 0.65, dur: 28 }
        ];

        layers.forEach(function(layer, idx) {
            var shadows = [];
            /* Generate dots for first pass */
            for (var i = 0; i < layer.count; i++) {
                var x = Math.floor(Math.random() * vw);
                var y = Math.floor(Math.random() * vh);
                var s = layer.minS + Math.random() * (layer.maxS - layer.minS);
                var o = layer.minO + Math.random() * (layer.maxO - layer.minO);
                shadows.push(x + 'px ' + y + 'px 0 ' + s.toFixed(1) + 'px rgba(255,255,255,' + o.toFixed(2) + ')');
            }
            /* Duplicate for seamless loop */
            for (var i = 0; i < layer.count; i++) {
                var x = Math.floor(Math.random() * vw);
                var y = Math.floor(Math.random() * vh) + vh;
                var s = layer.minS + Math.random() * (layer.maxS - layer.minS);
                var o = layer.minO + Math.random() * (layer.maxO - layer.minO);
                shadows.push(x + 'px ' + y + 'px 0 ' + s.toFixed(1) + 'px rgba(255,255,255,' + o.toFixed(2) + ')');
            }

            var el = document.createElement('div');
            el.className = 'gb-snow';
            el.style.boxShadow = shadows.join(',');
            el.style.setProperty('--sh', '-' + vh + 'px');
            el.style.animation = 'gb-snowfall' + (idx + 1) + ' ' + layer.dur + 's linear infinite';
            state.container.appendChild(el);
        });

        document.body.appendChild(state.container);
    }

    /* ═══════════════════════════════════════════
       PARTICLES - DOM-based for hearts, stars, petals
    ═══════════════════════════════════════════ */
    function createParticles(theme) {
        if (!theme.particles) return;
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

                var wrapper = document.createElement('div');
                wrapper.className = 'gb-pw';
                wrapper.style.left = left + '%';
                wrapper.style.setProperty('--op', opacity.toFixed(2));

                var el = document.createElement('div');
                el.className = 'gb-p';
                el.style.setProperty('--dx', drift + 'px');

                if (p.shape === 'heart') {
                    var half = size / 2;
                    el.classList.add('gb-heart');
                    el.style.width = size + 'px';
                    el.style.height = size * 0.9 + 'px';
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
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                    el.style.borderRadius = '50%';
                    el.style.background = p.color;
                }

                if (theme.anim === 'rise') {
                    wrapper.style.animation = 'gb-rise ' + fallDur.toFixed(1) + 's ' + delay.toFixed(1) + 's linear infinite';
                    el.style.animation = 'gb-drift ' + driftDur.toFixed(1) + 's ' + (delay * 0.5).toFixed(1) + 's ease-in-out infinite';
                } else if (theme.anim === 'float') {
                    wrapper.style.top = rand(8, 85) + '%';
                    wrapper.style.opacity = opacity;
                    wrapper.style.animation = 'gb-vfloat ' + rand(6, 14).toFixed(1) + 's ' + delay.toFixed(1) + 's ease-in-out infinite';
                    el.style.animation = 'gb-drift ' + driftDur.toFixed(1) + 's ' + (delay * 0.5).toFixed(1) + 's ease-in-out infinite';
                } else if (theme.anim === 'sway') {
                    wrapper.style.top = rand(8, 85) + '%';
                    wrapper.style.opacity = opacity;
                    wrapper.style.animation = 'gb-vsway ' + rand(6, 14).toFixed(1) + 's ' + delay.toFixed(1) + 's ease-in-out infinite';
                    el.style.animation = 'gb-drift ' + rand(4, 10).toFixed(1) + 's ' + (delay * 0.3).toFixed(1) + 's ease-in-out infinite';
                } else {
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
       STRING LIGHTS - Premium Christmas feature
       Teardrop bulbs with glow, hanging from thin strings
    ═══════════════════════════════════════════ */
    function createStringLights() {
        if (isMobile) return; /* too cluttered on mobile */
        var el = document.createElement('div');
        el.className = 'gb-lights';

        var numBulbs = 14;
        var marginPct = 8;
        var colors = [
            { bg: 'rgba(255,245,224,0.9)', glow: 'rgba(255,245,224,0.5)' },
            { bg: 'rgba(220,70,70,0.9)', glow: 'rgba(220,70,70,0.4)' },
            { bg: 'rgba(212,175,55,0.9)', glow: 'rgba(212,175,55,0.45)' },
            { bg: 'rgba(100,180,100,0.9)', glow: 'rgba(100,180,100,0.4)' }
        ];

        /* SVG wire with catenary droop */
        var points = [];
        for (var i = 0; i < numBulbs; i++) {
            var pct = marginPct + (i / (numBulbs - 1)) * (100 - 2 * marginPct);
            var droop = Math.sin((i / (numBulbs - 1)) * Math.PI) * 18;
            points.push((pct * 10) + ',' + (5 + droop));
        }
        var wireSvg = '<svg class="gb-lights-wire" viewBox="0 0 1000 55" preserveAspectRatio="none">' +
            '<polyline points="' + points.join(' ') + '" stroke="rgba(100,100,100,0.35)" stroke-width="1.5" fill="none"/>' +
        '</svg>';
        el.innerHTML = wireSvg;

        /* Bulbs with hanging strings */
        for (var i = 0; i < numBulbs; i++) {
            var pct = marginPct + (i / (numBulbs - 1)) * (100 - 2 * marginPct);
            var droop = Math.sin((i / (numBulbs - 1)) * Math.PI) * 18;
            var c = colors[i % colors.length];
            var stringH = 3 + droop * 0.3;

            /* String from wire to bulb */
            var string = document.createElement('div');
            string.className = 'gb-bulb-string';
            string.style.left = pct + '%';
            string.style.top = (9 + droop * 0.33) + '%';
            string.style.height = stringH + 'px';
            el.appendChild(string);

            /* Bulb */
            var bulb = document.createElement('div');
            bulb.className = 'gb-bulb';
            bulb.style.left = pct + '%';
            bulb.style.top = (9 + droop * 0.33 + stringH) + '%';
            bulb.style.background = c.bg;
            bulb.style.setProperty('--gc', c.glow);
            bulb.style.animationDelay = (i * 0.28) + 's';
            el.appendChild(bulb);
        }

        document.body.appendChild(el);
        state.creative = el;
    }

    /* ═══════════════════════════════════════════
       FOG - Halloween atmospheric effect
       Two layers drifting at different speeds
    ═══════════════════════════════════════════ */
    function createFog() {
        var f1 = document.createElement('div');
        f1.className = 'gb-fog gb-fog-1';
        document.body.appendChild(f1);

        var f2 = document.createElement('div');
        f2.className = 'gb-fog gb-fog-2';
        document.body.appendChild(f2);

        state.creative = f1;
        /* Store both for cleanup */
        f1._pair = f2;
    }

    /* ═══════════════════════════════════════════
       SUN FLARE - Summer warm glow effect
    ═══════════════════════════════════════════ */
    function createSunFlare() {
        var el = document.createElement('div');
        el.className = 'gb-sunflare';
        document.body.appendChild(el);
        state.creative = el;
    }

    /* ═══════════════════════════════════════════
       CONFETTI - New Year one-shot burst
       Fires once on apply, 60-80 pieces, fades out
    ═══════════════════════════════════════════ */
    function createConfetti() {
        var wrap = document.createElement('div');
        wrap.className = 'gb-confetti-wrap';
        var count = isMobile ? 35 : 65;
        var colors = ['#FFD700', '#C0C0C0', '#f5e6cc', '#0D47A1', '#FFD700', '#fff'];
        var shapes = ['rect', 'rect', 'circle', 'strip'];

        for (var i = 0; i < count; i++) {
            var piece = document.createElement('div');
            piece.className = 'gb-conf';
            var color = colors[Math.floor(Math.random() * colors.length)];
            var shape = shapes[Math.floor(Math.random() * shapes.length)];
            var left = rand(5, 95);
            var dur = rand(2.5, 5);
            var rot = rand(360, 1080);
            var delay = rand(0, 0.8);

            piece.style.left = left + '%';
            piece.style.setProperty('--cd', dur.toFixed(1) + 's');
            piece.style.setProperty('--cr', rot.toFixed(0) + 'deg');
            piece.style.animationDelay = delay.toFixed(1) + 's';
            piece.style.background = color;

            if (shape === 'circle') {
                piece.style.width = rand(5, 9) + 'px';
                piece.style.height = piece.style.width;
                piece.style.borderRadius = '50%';
            } else if (shape === 'strip') {
                piece.style.width = rand(2, 4) + 'px';
                piece.style.height = rand(12, 20) + 'px';
                piece.style.borderRadius = '2px';
            } else {
                piece.style.width = rand(6, 10) + 'px';
                piece.style.height = rand(4, 7) + 'px';
                piece.style.borderRadius = '1px';
            }

            wrap.appendChild(piece);
        }

        document.body.appendChild(wrap);
        state.creative = wrap;

        /* Auto-remove after animation completes */
        setTimeout(function() {
            if (wrap.parentNode) wrap.remove();
            if (state.creative === wrap) state.creative = null;
        }, 6000);
    }

    /* ═══════════════════════════════════════════
       CORNER ORNAMENTS - SVG decorations in viewport corners
    ═══════════════════════════════════════════ */
    function createCorners(type) {
        var svg, size, pos;

        if (type === 'holly') {
            svg = HOLLY_SVG;
            size = isMobile ? 80 : 130;
            pos = { top: '0', left: '0' };
        } else if (type === 'cobweb') {
            svg = COBWEB_SVG;
            size = isMobile ? 100 : 170;
            pos = { top: '0', left: '0' };
        } else {
            return;
        }

        var el = document.createElement('div');
        el.className = 'gb-corner';
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        for (var p in pos) el.style[p] = pos[p];
        el.innerHTML = svg;
        document.body.appendChild(el);
        state.corners.push(el);
    }

    /* ═══════════════════════════════════════════
       LOGO NEON CIRCLE GLOW
       Changes the hero circle border/shadow per theme
    ═══════════════════════════════════════════ */
    function applyLogoGlow(theme) {
        if (!theme.neon) return;

        /* Hero neon circle */
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle) {
            /* Save originals for restore */
            if (!state.savedNeon) {
                state.savedNeon = {
                    border: heroCircle.style.border || '',
                    boxShadow: heroCircle.style.boxShadow || '',
                    cssText: heroCircle.style.cssText
                };
            }
            heroCircle.style.border = theme.neon.border;
            heroCircle.style.boxShadow = theme.neon.shadow;
            heroCircle.style.transition = 'border 1.5s ease, box-shadow 1.5s ease';
        }

        /* Nav logo glow */
        if (theme.navGlow) {
            document.querySelectorAll('.nav-logo img').forEach(function(img) {
                if (!state.savedNavGlow) {
                    state.savedNavGlow = img.style.boxShadow || '';
                }
                img.style.boxShadow = theme.navGlow;
                img.style.transition = 'box-shadow 1.5s ease';
            });
        }
    }

    function removeLogoGlow() {
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle && state.savedNeon) {
            heroCircle.style.border = '';
            heroCircle.style.boxShadow = '';
            heroCircle.style.transition = '';
        }
        state.savedNeon = null;

        document.querySelectorAll('.nav-logo img').forEach(function(img) {
            img.style.boxShadow = '';
            img.style.transition = '';
        });
        state.savedNavGlow = null;
    }

    /* ═══════════════════════════════════════════
       SANTA HAT - Properly positioned on logos
    ═══════════════════════════════════════════ */
    function addSantaHats() {
        /* Nav logos - 45px images */
        document.querySelectorAll('.nav-logo').forEach(function(logo) {
            logo.style.position = 'relative';
            logo.style.overflow = 'visible';

            var hat = document.createElement('div');
            hat.className = 'gb-hat';
            hat.style.width = '32px';
            hat.style.height = '28px';
            hat.style.top = '-16px';
            hat.style.left = '8px';
            hat.style.setProperty('--hr', '18deg');
            hat.innerHTML = SANTA_HAT_SVG;
            hat.querySelector('svg').style.width = '100%';
            hat.querySelector('svg').style.height = '100%';
            logo.appendChild(hat);
            state.logoDeco.push(hat);
        });

        /* Big hero logo - .showcase-neon-circle (320px) */
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle) {
            heroCircle.style.overflow = 'visible';

            var bigHat = document.createElement('div');
            bigHat.className = 'gb-hat';
            bigHat.style.width = '95px';
            bigHat.style.height = '85px';
            bigHat.style.top = '-32px';
            bigHat.style.left = '50%';
            bigHat.style.marginLeft = '-10px';
            bigHat.style.setProperty('--hr', '15deg');
            bigHat.innerHTML = SANTA_HAT_SVG;
            bigHat.querySelector('svg').style.width = '100%';
            bigHat.querySelector('svg').style.height = '100%';
            heroCircle.appendChild(bigHat);
            state.logoDeco.push(bigHat);
        }
    }

    function removeSantaHats() {
        state.logoDeco.forEach(function(d) { if (d.parentNode) d.remove(); });
        state.logoDeco = [];
        document.querySelectorAll('.nav-logo').forEach(function(l) {
            l.style.removeProperty('position');
            l.style.removeProperty('overflow');
        });
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle) heroCircle.style.removeProperty('overflow');
    }

    /* ═══════════════════════════════════════════
       ATMOSPHERE OVERLAY
       Subtle gradient overlays for mood
    ═══════════════════════════════════════════ */
    function createAtmosphere(theme) {
        if (!theme.atmosphere) return;
        var el = document.createElement('div');
        el.className = 'gb-atmo';
        el.style.background = theme.atmosphere;
        document.body.appendChild(el);
        state.atmosphere = el;
    }

    /* ═══════════════════════════════════════════
       TOAST NOTIFICATION
    ═══════════════════════════════════════════ */
    function createToast(theme) {
        if (state.toast) state.toast.remove();
        try { if (sessionStorage.getItem('gb-dismissed') === state.id) return; } catch(e) {}

        var t = theme.toast;
        if (!t) return;
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
       TOP BORDER ACCENT
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
        if (!nav || !theme.navLine) return;

        state.navLine = document.createElement('div');
        state.navLine.className = 'gb-nav-line';
        state.navLine.style.background = theme.navLine;
        nav.appendChild(state.navLine);
    }

    function removeNavLine() {
        if (state.navLine) { state.navLine.remove(); state.navLine = null; }
    }

    /* ═══════════════════════════════════════════
       CREATIVE ELEMENTS DISPATCHER
    ═══════════════════════════════════════════ */
    function createCreative(theme) {
        if (!theme.creative) return;
        if (theme.creative === 'stringLights') createStringLights();
        else if (theme.creative === 'fog') createFog();
        else if (theme.creative === 'sunFlare') createSunFlare();
        else if (theme.creative === 'confetti') createConfetti();
    }

    function removeCreative() {
        if (state.creative) {
            if (state.creative._pair) state.creative._pair.remove();
            state.creative.remove();
            state.creative = null;
        }
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

        /* 1. Logo glow (highest impact, zero performance cost) */
        applyLogoGlow(theme);

        /* 2. Particles or Snowfall */
        if (theme.snow) {
            createSnowfall();
        } else if (theme.particles) {
            createParticles(theme);
        }

        /* 3. Creative element (string lights, fog, confetti, sun flare) */
        createCreative(theme);

        /* 4. Corner ornaments */
        if (theme.corner) createCorners(theme.corner);

        /* 5. Atmosphere overlay */
        createAtmosphere(theme);

        /* 6. Santa hat */
        if (theme.hat) addSantaHats();

        /* 7. Toast notification */
        createToast(theme);

        /* 8. Top border accent */
        createBorder(theme);

        /* 9. Nav accent line */
        createNavLine(theme);
    }

    function remove() {
        if (state.container) { state.container.remove(); state.container = null; }
        if (state.toast) { state.toast.remove(); state.toast = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        removeNavLine();
        removeCreative();
        if (state.atmosphere) { state.atmosphere.remove(); state.atmosphere = null; }
        state.corners.forEach(function(c) { if (c.parentNode) c.remove(); });
        state.corners = [];
        removeSantaHats();
        removeLogoGlow();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };

})();
