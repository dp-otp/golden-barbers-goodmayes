/**
 * Golden Barbers – Premium Seasonal Theme Effects v21
 *
 * Clean rewrite: premium quality, subtle execution.
 * Colour palette + atmospheric decorations + connotation elements + banner.
 *
 * API: window.GBThemeEffects = { apply(data), remove() }
 * Called by each page's Firebase listener on siteTheme changes.
 */
(function () {
    'use strict';

    /* ═══════════════════════════════════════════
       STATE
    ═══════════════════════════════════════════ */
    var state = {
        active: false,
        themeId: null,
        savedVars: null,
        styleEl: null,
        animStyleEl: null,
        themeStyleEl: null,
        container: null,
        banner: null,
        conEls: [],
        conStyleEl: null
    };

    var isMobile = window.innerWidth < 768;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.addEventListener('resize', function () { isMobile = window.innerWidth < 768; });

    /* ═══════════════════════════════════════════
       COLOUR UTILITIES
    ═══════════════════════════════════════════ */
    function hexRGB(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        return { r: parseInt(hex.substr(0,2),16), g: parseInt(hex.substr(2,2),16), b: parseInt(hex.substr(4,2),16) };
    }

    function toHex(r, g, b) {
        return '#' + [r,g,b].map(function(c){ return Math.max(0,Math.min(255,Math.round(c))).toString(16).padStart(2,'0'); }).join('');
    }

    function darken(hex, amt) {
        var c = hexRGB(hex); amt = amt || 0.3;
        return toHex(c.r*(1-amt), c.g*(1-amt), c.b*(1-amt));
    }

    function lighten(hex, amt) {
        var c = hexRGB(hex); amt = amt || 0.35;
        return toHex(c.r+(255-c.r)*amt, c.g+(255-c.g)*amt, c.b+(255-c.b)*amt);
    }

    function rgba(hex, a) {
        var c = hexRGB(hex);
        return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
    }

    /* ═══════════════════════════════════════════
       ACCENT MAPPING
       Which colour from data.colors to use as the
       site-wide accent (replaces --gold).
       Default: primary. Override per theme if needed.
    ═══════════════════════════════════════════ */
    var ACCENT_KEY = {
        christmas: 'secondary'  // Use red, not green, for UI elements
    };

    function getAccent(data) {
        var key = ACCENT_KEY[data.themeId] || 'primary';
        return (data.colors && data.colors[key]) || (data.colors && data.colors.primary) || '#d4af37';
    }

    /* ═══════════════════════════════════════════
       DECORATION CONFIGS PER THEME
       Each theme gets max 2-3 subtle decorations.
    ═══════════════════════════════════════════ */
    var DECOR = {
        christmas: [
            { type: 'lights', colors: ['#ff3333','#33cc33','#d4af37','#3377ff','#ff8833'] },
            { type: 'particles', chars: ['\u2744','\u2745'], count: 8, colors: ['#fff','#cde8ff'], speed: [14,24], dir: 'down', drift: 20 }
        ],
        valentines: [
            { type: 'particles', chars: ['\u2665'], count: 6, colors: ['#e91e63','#f48fb1','#ff4081'], speed: [10,18], dir: 'up', drift: 15 },
            { type: 'particles', chars: ['\u2726'], count: 4, colors: ['#f48fb1','#fce4ec'], speed: [16,24], dir: 'up', drift: 10 }
        ],
        winter: [
            { type: 'particles', chars: ['\u2744','\u2745','\u2726'], count: 10, colors: ['#fff','#bbdefb','#e3f2fd'], speed: [12,22], dir: 'down', drift: 25 },
            { type: 'frost' }
        ],
        halloween: [
            { type: 'fog', color: 'rgba(74,20,140,0.06)', height: 100 }
        ],
        easter: [
            { type: 'particles', chars: ['\u273F','\u2740','\u273E'], count: 6, colors: ['#f48fb1','#ce93d8','#81c784','#fff59d'], speed: [10,18], dir: 'up', drift: 15 },
            { type: 'corner', svg: 'flower', pos: ['top-right','bottom-left'], size: 100, opacity: 0.12 }
        ],
        summer: [],
        eid: [
            { type: 'border', style: 'geo', color: '#FDD835' }
        ],
        ramadan: [
            { type: 'border', style: 'geo', color: '#B8860B' }
        ],
        autumn: [
            { type: 'particles', chars: ['\uD83C\uDF42','\uD83C\uDF41'], count: 8, colors: ['#DD2C00','#FF6F00','#FFAB91','#BF360C'], speed: [10,20], dir: 'down', drift: 30 },
            { type: 'corner', svg: 'leaves', pos: ['top-left','top-right'], size: 130, opacity: 0.12 }
        ],
        blackfriday: [
            { type: 'particles', chars: ['\u25CF','\u25A0'], count: 10, colors: ['#FF1744','#FFD600','#fff','#333'], speed: [6,12], dir: 'down', drift: 20 }
        ],
        newyear: [
            { type: 'particles', chars: ['\u2726','\u2727','\u2605'], count: 10, colors: ['#FFD700','#fff','#FFFDE7'], speed: [10,18], dir: 'down', drift: 15 },
            { type: 'border', style: 'sparkle', color: '#FFD700' }
        ],
        flashsale: [
            { type: 'particles', chars: ['\u25CF','\u25A0','\u2605'], count: 12, colors: ['#FF1744','#FFD600','#fff'], speed: [5,10], dir: 'down', drift: 25 }
        ]
    };

    /* ═══════════════════════════════════════════
       SVG TEMPLATES (compact, clean vectors)
    ═══════════════════════════════════════════ */
    var SVG = {
        web: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5">'
            + '<line x1="0" y1="0" x2="200" y2="200"/><line x1="0" y1="0" x2="200" y2="80"/>'
            + '<line x1="0" y1="0" x2="80" y2="200"/><line x1="0" y1="0" x2="200" y2="0"/>'
            + '<line x1="0" y1="0" x2="0" y2="200"/><line x1="0" y1="0" x2="140" y2="200"/>'
            + '<line x1="0" y1="0" x2="200" y2="140"/>'
            + '<path d="M30,0 Q20,20 0,30"/><path d="M70,0 Q45,45 0,70"/>'
            + '<path d="M115,0 Q75,75 0,115"/><path d="M165,0 Q110,110 0,165"/></svg>',

        lantern: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 55" fill="currentColor">'
            + '<rect x="12" y="0" width="6" height="5" rx="1" opacity="0.5"/>'
            + '<path d="M15,5 Q4,5 4,28 Q4,45 15,47 Q26,45 26,28 Q26,5 15,5Z" opacity="0.5"/>'
            + '<ellipse cx="15" cy="26" rx="4" ry="8" fill="rgba(255,200,50,0.3)"/></svg>',

        crescent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">'
            + '<path d="M35,5 A30,30 0 1,0 35,75 A22,22 0 1,1 35,5Z" opacity="0.7"/>'
            + '<polygon points="62,12 64,18 70,18 65,22 67,28 62,24 57,28 59,22 54,18 60,18" opacity="0.6"/></svg>',

        leaves: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="currentColor" opacity="0.8">'
            + '<ellipse cx="35" cy="30" rx="20" ry="10" transform="rotate(-30 35 30)"/>'
            + '<ellipse cx="70" cy="20" rx="16" ry="8" transform="rotate(-55 70 20)"/>'
            + '<ellipse cx="25" cy="65" rx="18" ry="9" transform="rotate(-15 25 65)"/>'
            + '<ellipse cx="60" cy="55" rx="14" ry="7" transform="rotate(-40 60 55)"/>'
            + '<ellipse cx="85" cy="45" rx="16" ry="8" transform="rotate(-25 85 45)"/></svg>',

        flower: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" opacity="0.7">'
            + '<circle cx="30" cy="30" r="9"/><circle cx="22" cy="21" r="6"/><circle cx="38" cy="21" r="6"/>'
            + '<circle cx="22" cy="39" r="6"/><circle cx="38" cy="39" r="6"/>'
            + '<circle cx="72" cy="65" r="7"/><circle cx="66" cy="58" r="5"/><circle cx="78" cy="58" r="5"/>'
            + '<circle cx="66" cy="72" r="5"/><circle cx="78" cy="72" r="5"/></svg>',

        palm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" fill="currentColor">'
            + '<rect x="44" y="80" width="12" height="120" rx="4" opacity="0.6"/>'
            + '<path d="M50,85 Q15,45 5,55 Q28,25 50,18 Q72,25 95,55 Q85,45 50,85Z" opacity="0.5"/>'
            + '<path d="M50,65 Q8,22 0,35 Q32,2 50,0 Q68,2 100,35 Q92,22 50,65Z" opacity="0.4"/></svg>'
    };

    /* ═══════════════════════════════════════════
       CONNOTATION ICON SYSTEM
       PNGs for high-quality existing assets,
       inline SVGs for everything else.
    ═══════════════════════════════════════════ */
    var ASSET_PATH = (function () {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf('theme-effects') !== -1)
                return scripts[i].src.replace(/[^\/]*$/, '') + 'theme-assets/';
        }
        return 'theme-assets/';
    })();

    var PNG_ICONS = {
        santaHat: 'santa-hat.png', ornament: 'ornament.png', holly: 'holly.png',
        candyCane: 'candy-cane.png', witchHat: 'witch-hat.png', bat: 'bat.png',
        heart: 'heart.png', rose: 'rose.png', easterEgg: 'easter-egg.png'
    };

    var SVG_ICONS = {
        pumpkin: '<svg viewBox="0 0 40 40" fill="currentColor"><path d="M20,5c-2,0-3,1-3,3v2c-5,0-10,4-10,12s5,14,13,14s13-6,13-14S25,10,23,10V8c0-2-1-3-3-3z" opacity="0.9"/><path d="M18,8c0-1.5,1-2,2-2s2,.5,2,2v3h-4V8z" fill="#4a7c10"/><circle cx="15" cy="22" r="2" fill="rgba(0,0,0,0.7)"/><circle cx="25" cy="22" r="2" fill="rgba(0,0,0,0.7)"/><path d="M16,28c2,2,6,2,8,0" fill="none" stroke="rgba(0,0,0,0.7)" stroke-width="1.5"/></svg>',
        bunnyEars: '<svg viewBox="0 0 50 30"><ellipse cx="15" cy="15" rx="5" ry="14" fill="currentColor" opacity="0.85"/><ellipse cx="15" cy="13" rx="2.5" ry="10" fill="#ffb6c1" opacity="0.5"/><ellipse cx="35" cy="15" rx="5" ry="14" fill="currentColor" opacity="0.85"/><ellipse cx="35" cy="13" rx="2.5" ry="10" fill="#ffb6c1" opacity="0.5"/></svg>',
        springFlower: '<svg viewBox="0 0 30 30" fill="currentColor"><circle cx="15" cy="15" r="4" fill="#ffeb3b" opacity="0.8"/><ellipse cx="15" cy="7" rx="4" ry="5" opacity="0.6"/><ellipse cx="15" cy="23" rx="4" ry="5" opacity="0.6"/><ellipse cx="7" cy="15" rx="5" ry="4" opacity="0.6"/><ellipse cx="23" cy="15" rx="5" ry="4" opacity="0.6"/></svg>',
        basket: '<svg viewBox="0 0 40 35" fill="currentColor"><path d="M5,15h30l-3,18c-.5,2-2,2-2,2H10s-1.5,0-2-2L5,15z" opacity="0.7"/><path d="M8,15c0,0,4-12,12-12s12,12,12,12" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/><line x1="5" y1="15" x2="35" y2="15" stroke="currentColor" stroke-width="2.5" opacity="0.8"/></svg>',
        sunglasses: '<svg viewBox="0 0 50 22"><path d="M4,10c0-1,1-2,2-2h38c1,0,2,1,2,2" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><rect x="3" y="9" width="16" height="12" rx="3" fill="currentColor" opacity="0.85"/><rect x="31" y="9" width="16" height="12" rx="3" fill="currentColor" opacity="0.85"/><path d="M19,14c2-2,10-2,12,0" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/></svg>',
        palmFrond: '<svg viewBox="0 0 60 80" fill="currentColor"><path d="M30,78c0-30,0-50,0-75" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/><path d="M30,10C15,15,5,30,2,45c5-10,15-20,28-20" opacity="0.5"/><path d="M30,10C45,15,55,30,58,45c-5-10-15-20-28-20" opacity="0.5"/><path d="M30,25C18,28,10,40,8,50c4-8,12-16,22-14" opacity="0.4"/><path d="M30,25C42,28,50,40,52,50c-4-8-12-16-22-14" opacity="0.4"/></svg>',
        sun: '<svg viewBox="0 0 60 60" fill="currentColor"><circle cx="30" cy="30" r="12" opacity="0.8"/><g opacity="0.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="30" y1="4" x2="30" y2="14"/><line x1="30" y1="46" x2="30" y2="56"/><line x1="4" y1="30" x2="14" y2="30"/><line x1="46" y1="30" x2="56" y2="30"/><line x1="11" y1="11" x2="18" y2="18"/><line x1="42" y1="42" x2="49" y2="49"/><line x1="49" y1="11" x2="42" y2="18"/><line x1="18" y1="42" x2="11" y2="49"/></g></svg>',
        acorn: '<svg viewBox="0 0 24 30" fill="currentColor"><ellipse cx="12" cy="20" rx="8" ry="10" opacity="0.7"/><path d="M4,14c0-4,3-7,8-7s8,3,8,7c0,1-1,2-2,2H6c-1,0-2-1-2-2z" opacity="0.85"/><rect x="11" y="3" width="2" height="5" rx="1" opacity="0.6"/></svg>',
        mushroom: '<svg viewBox="0 0 36 40" fill="currentColor"><path d="M18,2C8,2,2,10,2,17c0,2,1,3,3,3h26c2,0,3-1,3-3C34,10,28,2,18,2z" opacity="0.8"/><rect x="13" y="18" width="10" height="18" rx="2" opacity="0.6"/><circle cx="10" cy="12" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="22" cy="9" r="2" fill="rgba(255,255,255,0.3)"/></svg>',
        hotDrink: '<svg viewBox="0 0 30 32" fill="currentColor"><rect x="4" y="10" width="18" height="18" rx="2" opacity="0.7"/><path d="M22,14c4,0,6,2,6,5s-2,5-6,5" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/><path d="M8,8c1-3,2-3,3,0s2,3,3,0" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"/></svg>',
        scarf: '<svg viewBox="0 0 60 25" fill="currentColor"><path d="M0,8c10-3,20,3,30,0s20-3,30,0v8c-10,3-20-3-30,0s-20,3-30,0z" opacity="0.75"/><path d="M28,16v8c0,1,2,1,2,0v-8" opacity="0.65"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 16.5,14 18.5,22 12,17.5 5.5,22 7.5,14 2,9 9,9" opacity="0.8"/></svg>',
        mosque: '<svg viewBox="0 0 120 60" fill="currentColor" opacity="0.08"><rect x="10" y="30" width="100" height="30"/><path d="M30,30c0-15,10-25,30-25s30,10,30,25"/><rect x="15" y="15" width="6" height="45" rx="3"/><rect x="99" y="15" width="6" height="45" rx="3"/></svg>',
        crescentStar: '<svg viewBox="0 0 40 40" fill="currentColor"><path d="M18,4A15,15,0,1,0,18,36A11,11,0,1,1,18,4Z" opacity="0.7"/><polygon points="34,8 35.5,12 40,12 36.5,15 38,19 34,16.5 30,19 31.5,15 28,12 32.5,12" opacity="0.6"/></svg>',
        ketupat: '<svg viewBox="0 0 30 40" fill="currentColor"><path d="M15,2L4,15v10l11,13l11-13V15L15,2z" opacity="0.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8,15h14M8,20h14M8,25h14" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>',
        firework: '<svg viewBox="0 0 40 40" fill="currentColor"><circle cx="20" cy="20" r="3" opacity="0.8"/><g stroke="currentColor" stroke-width="1" opacity="0.5" stroke-linecap="round"><line x1="20" y1="5" x2="20" y2="13"/><line x1="20" y1="27" x2="20" y2="35"/><line x1="5" y1="20" x2="13" y2="20"/><line x1="27" y1="20" x2="35" y2="20"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="25" y1="25" x2="31" y2="31"/></g></svg>',
        saleTag: '<svg viewBox="0 0 28 32" fill="currentColor"><path d="M4,4l20,0l0,22l-10,6l-10-6z" opacity="0.8"/><circle cx="14" cy="10" r="3" fill="rgba(255,255,255,0.4)"/><rect x="9" y="17" width="10" height="1.5" rx="0.5" fill="rgba(255,255,255,0.3)"/></svg>',
        shoppingBag: '<svg viewBox="0 0 30 36" fill="currentColor"><rect x="3" y="10" width="24" height="24" rx="2" opacity="0.7"/><path d="M10,12V8c0-3,2-5,5-5s5,2,5,5v4" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/></svg>',
        champagne: '<svg viewBox="0 0 20 44" fill="currentColor"><path d="M7,0h6l2,20c0,3-2,5-5,5s-5-2-5-5L7,0z" opacity="0.65"/><rect x="9" y="24" width="2" height="14" opacity="0.5"/><ellipse cx="10" cy="40" rx="6" ry="2" opacity="0.5"/></svg>',
        clock: '<svg viewBox="0 0 40 40" fill="currentColor"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><line x1="20" y1="20" x2="20" y2="8" stroke="currentColor" stroke-width="2" opacity="0.7" stroke-linecap="round"/><line x1="20" y1="20" x2="28" y2="17" stroke="currentColor" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/><circle cx="20" cy="20" r="2" opacity="0.8"/></svg>',
        lightning: '<svg viewBox="0 0 24 36" fill="currentColor"><polygon points="14,0 6,16 12,16 8,36 20,14 13,14 18,0" opacity="0.8"/></svg>',
        megaphone: '<svg viewBox="0 0 40 30" fill="currentColor"><path d="M12,8h4l16-6v26l-16-6h-4c-2,0-4-2-4-4v-6c0-2,2-4,4-4z" opacity="0.7"/><rect x="6" y="18" width="6" height="8" rx="1" opacity="0.5"/></svg>',
        timer: '<svg viewBox="0 0 36 40" fill="currentColor"><rect x="14" y="1" width="8" height="4" rx="1" opacity="0.5"/><circle cx="18" cy="23" r="13" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><line x1="18" y1="23" x2="18" y2="13" stroke="currentColor" stroke-width="2" opacity="0.7" stroke-linecap="round"/><circle cx="18" cy="23" r="2" opacity="0.7"/></svg>',
        cupidArrow: '<svg viewBox="0 0 120 20" fill="currentColor"><line x1="10" y1="10" x2="110" y2="10" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><polygon points="110,10 100,5 100,15" opacity="0.7"/><path d="M10,10L5,5M10,10L5,15" stroke="currentColor" stroke-width="1" opacity="0.5"/><circle cx="12" cy="7" r="3" fill="#e91e63" opacity="0.5"/></svg>',
        loveLetter: '<svg viewBox="0 0 36 28" fill="currentColor"><rect x="2" y="6" width="32" height="20" rx="2" opacity="0.7"/><path d="M2,6l16,11L34,6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><path d="M14,2l4,6l4-6" fill="#e91e63" opacity="0.6"/></svg>'
    };

    function createIcon(name, size, color) {
        var el = document.createElement('div');
        el.className = 'gb-con';
        el.style.cssText = 'width:' + size + 'px;height:' + size + 'px;pointer-events:none;line-height:0;flex-shrink:0';
        if (color) el.style.color = color;
        if (PNG_ICONS[name]) {
            var img = document.createElement('img');
            img.src = ASSET_PATH + PNG_ICONS[name];
            img.alt = '';
            img.draggable = false;
            img.style.cssText = 'width:100%;height:100%;object-fit:contain;pointer-events:none';
            el.appendChild(img);
        } else {
            var svgStr = SVG_ICONS[name] || SVG[name] || '';
            if (svgStr) {
                el.innerHTML = svgStr;
                var s = el.querySelector('svg');
                if (s) s.style.cssText = 'width:100%;height:100%';
            }
        }
        return el;
    }

    function trackEl(el) { state.conEls.push(el); return el; }

    /* ═══════════════════════════════════════════
       CONNOTATIONS CONFIG PER THEME
    ═══════════════════════════════════════════ */
    var CONNOTATIONS = {
        christmas: [
            { icon: 'santaHat', place: 'logo', tilt: 15, oY: -15, oX: 5 },
            { icon: 'ornament', place: 'navHang', count: 3 },
            { icon: 'holly', place: 'titleDivider' },
            { icon: 'holly', place: 'footerGarland' },
            { icon: 'holly', place: 'cardCorner', pos: 'bottom-left' },
            { icon: 'candyCane', place: 'titleCross' },
            { icon: 'candyCane', place: 'ctaAccent' }
        ],
        valentines: [
            { icon: 'rose', place: 'titleFlank' },
            { icon: 'rose', place: 'logoPin', oY: 10, oX: 20 },
            { icon: 'rose', place: 'footerGarland' },
            { icon: 'heart', place: 'cardCorner', pos: 'top-right' },
            { icon: 'cupidArrow', place: 'heroThrough' },
            { icon: 'loveLetter', place: 'footerItem' }
        ],
        halloween: [
            { icon: 'witchHat', place: 'logo', tilt: -15, oY: -18, oX: -5 },
            { icon: 'web', place: 'pageCorner', positions: ['top-left', 'top-right'] },
            { icon: 'web', place: 'cardCorner', pos: 'top-right' },
            { icon: 'bat', place: 'heroScatter', count: 5 },
            { icon: 'pumpkin', place: 'logoPin', oY: 10, oX: 22 },
            { icon: 'pumpkin', place: 'titleFlank' },
            { icon: 'pumpkin', place: 'footerScene' }
        ],
        easter: [
            { icon: 'easterEgg', place: 'cardCorner', pos: 'bottom-right' },
            { icon: 'easterEgg', place: 'titleFlank' },
            { icon: 'easterEgg', place: 'footerScene' },
            { icon: 'bunnyEars', place: 'logo', tilt: 0, oY: -20, oX: 0 },
            { icon: 'springFlower', place: 'titleDivider' },
            { icon: 'basket', place: 'footerItem' }
        ],
        summer: [
            { icon: 'sunglasses', place: 'titleLetter' },
            { icon: 'palmFrond', place: 'edgePeek' },
            { icon: 'palmFrond', place: 'titleFlank' },
            { icon: 'palmFrond', place: 'footerScene' },
            { icon: 'sun', place: 'heroCorner', pos: 'top-right' },
            { icon: 'sun', place: 'logoBehind' },
            { place: 'css', css: 'waveFooter' },
            { place: 'css', css: 'waveDivider' }
        ],
        autumn: [
            { icon: 'acorn', place: 'cardCorner', pos: 'top-right' },
            { icon: 'acorn', place: 'logoPin', oY: 10, oX: 22 },
            { icon: 'acorn', place: 'ctaAccent' },
            { icon: 'mushroom', place: 'edgePeek' },
            { icon: 'hotDrink', place: 'ctaAccent' }
        ],
        winter: [
            { icon: 'scarf', place: 'logoWrap' },
            { place: 'css', css: 'icicleNav' },
            { place: 'css', css: 'icicleCards' },
            { place: 'css', css: 'snowMound' },
            { place: 'css', css: 'frostBorder' }
        ],
        ramadan: [
            { icon: 'crescentStar', place: 'heroCorner', pos: 'top-right' },
            { icon: 'crescentStar', place: 'logoPin', oY: -15, oX: 22 },
            { icon: 'lantern', place: 'navHang', count: 3 },
            { icon: 'lantern', place: 'titleFlank' },
            { icon: 'lantern', place: 'edgePeek' },
            { icon: 'star', place: 'heroScatter', count: 7 },
            { icon: 'star', place: 'cardCorner', pos: 'top-right' },
            { icon: 'mosque', place: 'heroBg' }
        ],
        eid: [
            { icon: 'crescentStar', place: 'logoPin', oY: -15, oX: 22 },
            { icon: 'crescentStar', place: 'heroCorner', pos: 'top-right' },
            { icon: 'ketupat', place: 'navHang', count: 3 },
            { icon: 'ketupat', place: 'cardCorner', pos: 'top-right' },
            { icon: 'ketupat', place: 'titleFlank' },
            { place: 'css', css: 'geoBorder' },
            { place: 'css', css: 'geoDivider' },
            { icon: 'firework', place: 'heroBurst', count: 3 }
        ],
        blackfriday: [
            { icon: 'saleTag', place: 'navHang', count: 3 },
            { icon: 'saleTag', place: 'cardCorner', pos: 'top-right' },
            { icon: 'saleTag', place: 'titleFlank' },
            { icon: 'shoppingBag', place: 'footerScene' },
            { place: 'css', css: 'heroPercent' }
        ],
        newyear: [
            { icon: 'firework', place: 'heroBurst', count: 4 },
            { icon: 'champagne', place: 'logoPin', oY: 5, oX: 22 },
            { icon: 'champagne', place: 'titleFlank' },
            { icon: 'champagne', place: 'footerScene' },
            { icon: 'clock', place: 'heroCorner', pos: 'top-right' }
        ],
        flashsale: [
            { icon: 'lightning', place: 'titleFlank' },
            { icon: 'lightning', place: 'cardCorner', pos: 'top-right' },
            { icon: 'megaphone', place: 'heroAccent' },
            { icon: 'timer', place: 'heroCorner', pos: 'top-right' },
            { place: 'css', css: 'bgFlash' },
            { place: 'css', css: 'ctaSparkle' }
        ]
    };

    /* ═══════════════════════════════════════════
       ANIMATION CSS (injected once)
    ═══════════════════════════════════════════ */
    function injectAnimCSS() {
        if (state.animStyleEl) return;
        state.animStyleEl = document.createElement('style');
        state.animStyleEl.id = 'gb-theme-anim';
        state.animStyleEl.textContent = [
            '@keyframes gbFall{0%{transform:translateY(-5vh) translateX(0) rotate(0);opacity:0}',
            '8%{opacity:var(--gb-o,0.25)}88%{opacity:var(--gb-o,0.25)}',
            '100%{transform:translateY(105vh) translateX(var(--gb-dx,0px)) rotate(var(--gb-rot,0deg));opacity:0}}',

            '@keyframes gbRise{0%{transform:translateY(105vh) translateX(0);opacity:0}',
            '8%{opacity:var(--gb-o,0.25)}88%{opacity:var(--gb-o,0.25)}',
            '100%{transform:translateY(-5vh) translateX(var(--gb-dx,0px));opacity:0}}',

            '@keyframes gbTwinkle{0%,100%{opacity:0.8}50%{opacity:0.3}}',
            '@keyframes gbSwing{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}',

            '@keyframes gbSparkle{0%,100%{opacity:0.5}50%{opacity:0.15}}',

            '@keyframes gbBannerIn{from{max-height:0;padding-top:0;padding-bottom:0;opacity:0}',
            'to{max-height:50px;padding-top:10px;padding-bottom:10px;opacity:1}}',

            '@keyframes gbFadeIn{from{opacity:0}to{opacity:1}}'
        ].join('');
        document.head.appendChild(state.animStyleEl);
    }

    /* ═══════════════════════════════════════════
       CSS VARIABLE OVERRIDE
       Replaces --gold family with theme accent.
    ═══════════════════════════════════════════ */
    function applyCSS(accent, colors) {
        var root = document.documentElement;
        var accentDark = darken(accent);
        var accentLight = lighten(accent);
        var accentGlow = rgba(accent, 0.5);
        var accentNeon = lighten(accent, 0.2);

        // Save originals for restore
        var vars = ['--gold','--gold-dark','--gold-light','--gold-glow','--gold-neon'];
        state.savedVars = {};
        vars.forEach(function(v) {
            state.savedVars[v] = getComputedStyle(root).getPropertyValue(v).trim();
        });

        root.style.setProperty('--gold', accent);
        root.style.setProperty('--gold-dark', accentDark);
        root.style.setProperty('--gold-light', accentLight);
        root.style.setProperty('--gold-glow', accentGlow);
        root.style.setProperty('--gold-neon', accentNeon);

        document.body.setAttribute('data-gb-theme', 'active');

        // Additional themed CSS for sections
        state.themeStyleEl = document.createElement('style');
        state.themeStyleEl.id = 'gb-theme-sections';
        state.themeStyleEl.textContent = [
            /* Hero subtle radial glow */
            '[data-gb-theme] .hero{position:relative}',
            '[data-gb-theme] .hero::after{content:"";position:absolute;inset:0;',
            'background:radial-gradient(ellipse at 50% 30%,' + rgba(accent,0.08) + ',transparent 65%);',
            'pointer-events:none;z-index:1;animation:gbFadeIn 2s ease}',
            '[data-gb-theme] .hero-content{position:relative;z-index:5}',
            '[data-gb-theme] .hero-showcase{position:relative;z-index:4}',

            /* Showcase neon ring */
            '[data-gb-theme] .showcase-neon-circle{box-shadow:0 0 50px ' + rgba(accent,0.3) + ',0 0 100px ' + rgba(accent,0.12) + ',inset 0 0 40px ' + rgba(accent,0.08) + ' !important;transition:box-shadow 2s}',

            /* Service cards */
            '[data-gb-theme] .service-card{border-color:' + rgba(accent,0.15) + ' !important;transition:border-color .6s,box-shadow .6s}',
            '[data-gb-theme] .service-card:hover{border-color:' + rgba(accent,0.4) + ' !important;box-shadow:0 8px 32px ' + rgba(accent,0.12) + ' !important}',
            '[data-gb-theme] .service-icon svg{color:' + accent + ' !important}',

            /* Stats */
            '[data-gb-theme] .stat-number{color:' + accent + ' !important;text-shadow:0 0 20px ' + rgba(accent,0.4) + ' !important}',

            /* Testimonial stars */
            '[data-gb-theme] .testimonial-stars{color:' + accent + ' !important}',
            '[data-gb-theme] .testimonial-card{border-color:' + rgba(accent,0.12) + ' !important}',

            /* CTA glow */
            '[data-gb-theme] .cta{position:relative;overflow:hidden}',
            '[data-gb-theme] .cta::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,' + rgba(accent,0.1) + ',transparent 65%);pointer-events:none}',

            /* Footer */
            '[data-gb-theme] .footer{border-top-color:' + rgba(accent,0.2) + ' !important}',
            '[data-gb-theme] .footer::after{background:radial-gradient(ellipse at 50% 0%,' + rgba(accent,0.06) + ',transparent 60%) !important}',

            /* Buttons */
            '[data-gb-theme] .hero-cta-primary{background:linear-gradient(135deg,' + accentLight + ',' + accent + ',' + accentDark + ') !important}',
            '[data-gb-theme] .hero-cta-primary:hover{box-shadow:0 8px 30px ' + rgba(accent,0.4) + ' !important}'
        ].join('');
        document.head.appendChild(state.themeStyleEl);
    }

    function restoreCSS() {
        if (state.savedVars) {
            var root = document.documentElement;
            Object.keys(state.savedVars).forEach(function(v) {
                if (state.savedVars[v]) root.style.setProperty(v, state.savedVars[v]);
                else root.style.removeProperty(v);
            });
            state.savedVars = null;
        }
        document.body.removeAttribute('data-gb-theme');
        if (state.themeStyleEl) { state.themeStyleEl.remove(); state.themeStyleEl = null; }
    }

    /* ═══════════════════════════════════════════
       DECORATION CONTAINER
    ═══════════════════════════════════════════ */
    function createContainer() {
        var el = document.createElement('div');
        el.id = 'gb-theme-deco';
        el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden';
        document.body.appendChild(el);
        return el;
    }

    /* ═══════════════════════════════════════════
       RENDERERS
    ═══════════════════════════════════════════ */

    /* --- String Lights (Christmas) --- */
    function renderLights(container, cfg) {
        if (reducedMotion) return;
        var count = isMobile ? 10 : 18;
        var wrap = document.createElement('div');
        wrap.style.cssText = 'position:absolute;top:0;left:0;right:0;height:32px';

        // Wire
        var wire = document.createElement('div');
        wire.style.cssText = 'position:absolute;top:7px;left:0;right:0;height:1px;background:rgba(255,255,255,0.08)';
        wrap.appendChild(wire);

        // Bulbs
        for (var i = 0; i < count; i++) {
            var bulb = document.createElement('div');
            var color = cfg.colors[i % cfg.colors.length];
            var left = ((i + 0.5) / count) * 100;
            bulb.style.cssText = 'position:absolute;top:7px;left:' + left + '%;width:5px;height:8px;'
                + 'border-radius:50% 50% 50% 50%;background:' + color + ';'
                + 'box-shadow:0 0 3px ' + color + ',0 0 6px ' + color + ';'
                + 'opacity:0.7;animation:gbTwinkle ' + (2 + Math.random()*3) + 's ' + (Math.random()*2) + 's ease-in-out infinite';
            wrap.appendChild(bulb);
        }
        container.appendChild(wrap);
    }

    /* --- Floating Particles (snow, hearts, sparkles, etc.) --- */
    function renderParticles(container, cfg) {
        if (reducedMotion) return;
        var n = isMobile ? Math.ceil(cfg.count * 0.5) : cfg.count;
        var anim = cfg.dir === 'up' ? 'gbRise' : 'gbFall';
        var drift = cfg.drift || 20;

        for (var i = 0; i < n; i++) {
            var el = document.createElement('div');
            var ch = cfg.chars[Math.floor(Math.random() * cfg.chars.length)];
            var col = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
            var size = 6 + Math.random() * 8;
            var dur = cfg.speed[0] + Math.random() * (cfg.speed[1] - cfg.speed[0]);
            var delay = Math.random() * dur;
            var x = Math.random() * 100;
            var op = 0.12 + Math.random() * 0.2;
            var dx = (Math.random() - 0.5) * drift * 2;
            var rot = Math.random() * 360;

            el.textContent = ch;
            el.style.cssText = 'position:absolute;left:' + x + '%;font-size:' + size + 'px;color:' + col
                + ';opacity:0;pointer-events:none;will-change:transform;'
                + '--gb-o:' + op + ';--gb-dx:' + dx + 'px;--gb-rot:' + rot + 'deg;'
                + 'animation:' + anim + ' ' + dur + 's ' + delay + 's linear infinite';
            container.appendChild(el);
        }
    }

    /* --- Corner SVG Decoration --- */
    function renderCorner(container, cfg) {
        var svgContent = SVG[cfg.svg];
        if (!svgContent) return;

        cfg.pos.forEach(function(pos) {
            var el = document.createElement('div');
            el.innerHTML = svgContent;
            var parts = pos.split('-');
            var y = parts[0], x = parts[1];
            var transforms = [];
            if (x === 'right') transforms.push('scaleX(-1)');
            if (y === 'bottom') transforms.push('scaleY(-1)');
            var sz = isMobile ? Math.round(cfg.size * 0.55) : cfg.size;

            el.style.cssText = 'position:absolute;' + y + ':0;' + x + ':0;width:' + sz + 'px;height:' + sz + 'px;'
                + 'opacity:' + (cfg.opacity || 0.15) + ';'
                + 'transform:' + (transforms.join(' ') || 'none') + ';'
                + 'animation:gbFadeIn 1.5s ease';
            var svg = el.querySelector('svg');
            if (svg) svg.style.cssText = 'width:100%;height:100%';
            container.appendChild(el);
        });
    }

    /* --- Hanging Elements (lanterns, ornaments) --- */
    function renderHang(container, cfg) {
        var svgContent = SVG[cfg.svg];
        if (!svgContent) return;
        var count = isMobile ? Math.max(2, cfg.count - 1) : cfg.count;

        for (var i = 0; i < count; i++) {
            var wrap = document.createElement('div');
            var left = 12 + (i / Math.max(count - 1, 1)) * 76;
            var stringH = 15 + Math.random() * 35;
            var sz = 18 + Math.random() * 12;

            wrap.style.cssText = 'position:absolute;top:0;left:' + left + '%;'
                + 'display:flex;flex-direction:column;align-items:center;'
                + 'transform-origin:top center;'
                + (reducedMotion ? '' : 'animation:gbSwing ' + (3 + Math.random()*2) + 's ' + (Math.random()*2) + 's ease-in-out infinite;');

            // String
            var str = document.createElement('div');
            str.style.cssText = 'width:1px;height:' + stringH + 'px;background:rgba(255,255,255,0.1)';

            // Element
            var item = document.createElement('div');
            item.innerHTML = svgContent;
            item.style.cssText = 'width:' + sz + 'px;height:' + Math.round(sz * 1.4) + 'px;color:' + (cfg.color || '#d4af37') + ';opacity:0.5';
            var svgEl = item.querySelector('svg');
            if (svgEl) svgEl.style.cssText = 'width:100%;height:100%';

            wrap.appendChild(str);
            wrap.appendChild(item);
            container.appendChild(wrap);
        }
    }

    /* --- Bottom Overlay (fog) --- */
    function renderFog(container, cfg) {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:' + (cfg.height || 80) + 'px;'
            + 'background:linear-gradient(to top,' + (cfg.color || 'rgba(0,0,0,0.05)') + ',transparent);'
            + 'animation:gbFadeIn 2s ease';
        container.appendChild(el);
    }

    /* --- Frost Effect (winter corners) --- */
    function renderFrost(container) {
        ['top-left','top-right','bottom-left','bottom-right'].forEach(function(pos) {
            var el = document.createElement('div');
            var parts = pos.split('-');
            var sz = isMobile ? 60 : 100;
            el.style.cssText = 'position:absolute;' + parts[0] + ':0;' + parts[1] + ':0;'
                + 'width:' + sz + 'px;height:' + sz + 'px;'
                + 'background:radial-gradient(ellipse at ' + parts[1] + ' ' + parts[0] + ','
                + 'rgba(200,225,255,0.1) 0%,rgba(200,225,255,0.03) 40%,transparent 70%);'
                + 'animation:gbFadeIn 2s ease';
            container.appendChild(el);
        });
    }

    /* --- Top Border (geometric / wave / sparkle) --- */
    function renderBorder(container, cfg) {
        var el = document.createElement('div');

        if (cfg.style === 'geo') {
            // Repeating diamond pattern
            el.style.cssText = 'position:absolute;top:0;left:0;right:0;height:3px;'
                + 'background:repeating-linear-gradient(90deg,'
                + cfg.color + ' 0px,' + cfg.color + ' 6px,transparent 6px,transparent 14px);'
                + 'opacity:0.35;animation:gbFadeIn 1s ease';
        } else if (cfg.style === 'wave') {
            el.innerHTML = '<svg viewBox="0 0 1200 16" preserveAspectRatio="none" style="width:100%;height:16px;display:block">'
                + '<path d="M0,8 Q150,0 300,8 Q450,16 600,8 Q750,0 900,8 Q1050,16 1200,8" '
                + 'fill="none" stroke="' + cfg.color + '" stroke-width="1.5" opacity="0.25"/></svg>';
            el.style.cssText = 'position:absolute;top:0;left:0;right:0;animation:gbFadeIn 1s ease';
        } else if (cfg.style === 'sparkle') {
            el.style.cssText = 'position:absolute;top:0;left:0;right:0;height:2px;'
                + 'background:linear-gradient(90deg,'
                + 'transparent,' + cfg.color + ',transparent 15%,'
                + 'transparent 25%,' + cfg.color + ',transparent 40%,'
                + 'transparent 50%,' + cfg.color + ',transparent 65%,'
                + 'transparent 75%,' + cfg.color + ',transparent 90%,'
                + 'transparent);opacity:0.4;'
                + (reducedMotion ? '' : 'animation:gbSparkle 3s ease-in-out infinite');
        }
        container.appendChild(el);
    }

    /* ═══════════════════════════════════════════
       RENDERER DISPATCH
    ═══════════════════════════════════════════ */
    var RENDERERS = {
        lights: renderLights,
        particles: renderParticles,
        corner: renderCorner,
        hang: renderHang,
        fog: renderFog,
        frost: function(container) { renderFrost(container); },
        border: renderBorder
    };

    /* ═══════════════════════════════════════════
       CONNOTATION PLACEMENT RENDERERS
    ═══════════════════════════════════════════ */

    /* --- Logo accessory (hat, ears on logo) --- */
    function placeOnLogo(cfg, accent) {
        var logo = document.querySelector('.nav-logo');
        if (!logo) return;
        logo.style.position = 'relative';
        logo.style.overflow = 'visible';
        var size = isMobile ? 28 : 36;
        var el = createIcon(cfg.icon, size, accent);
        el.style.cssText = 'position:absolute;top:' + (cfg.oY || -12) + 'px;left:50%;'
            + 'transform:translateX(-50%) rotate(' + (cfg.tilt || 0) + 'deg);'
            + 'z-index:10;opacity:0.9;animation:gbFadeIn 1s ease;pointer-events:none';
        logo.appendChild(trackEl(el));
    }

    /* --- Logo pin (small icon beside logo) --- */
    function placeLogoPin(cfg, accent) {
        var logo = document.querySelector('.nav-logo');
        if (!logo) return;
        logo.style.position = 'relative';
        logo.style.overflow = 'visible';
        var size = isMobile ? 18 : 24;
        var el = createIcon(cfg.icon, size, accent);
        el.style.cssText = 'position:absolute;top:' + (cfg.oY || 5) + 'px;'
            + 'right:-' + (cfg.oX || 15) + 'px;z-index:10;opacity:0.8;'
            + 'animation:gbFadeIn 1s ease;pointer-events:none';
        logo.appendChild(trackEl(el));
    }

    /* --- Logo wrap (scarf around logo) --- */
    function placeLogoWrap(cfg, accent) {
        var logo = document.querySelector('.nav-logo');
        if (!logo) return;
        logo.style.position = 'relative';
        logo.style.overflow = 'visible';
        var size = isMobile ? 48 : 60;
        var el = createIcon(cfg.icon, size, accent);
        el.style.cssText = 'position:absolute;left:50%;bottom:-6px;'
            + 'transform:translateX(-50%);opacity:0.75;z-index:10;'
            + 'pointer-events:none;animation:gbFadeIn 1s ease';
        logo.appendChild(trackEl(el));
    }

    /* --- Sun glow behind logo --- */
    function placeLogoBehind(cfg, accent) {
        var logo = document.querySelector('.nav-logo');
        if (!logo) return;
        logo.style.position = 'relative';
        var size = isMobile ? 60 : 80;
        var el = document.createElement('div');
        el.className = 'gb-con';
        el.style.cssText = 'position:absolute;left:50%;top:50%;width:' + size + 'px;height:' + size + 'px;'
            + 'transform:translate(-50%,-50%);border-radius:50%;z-index:-1;pointer-events:none;'
            + 'background:radial-gradient(circle,' + rgba(accent, 0.25) + ',' + rgba(accent, 0.08) + ' 40%,transparent 70%);'
            + 'animation:gbFadeIn 2s ease';
        logo.appendChild(trackEl(el));
    }

    /* --- Hang items from nav bar --- */
    function placeNavHang(cfg, accent) {
        var nav = document.querySelector('.nav-inner') || document.querySelector('.nav');
        if (!nav) return;
        nav.style.position = 'relative';
        nav.style.overflow = 'visible';
        var count = isMobile ? Math.max(2, (cfg.count || 3) - 1) : (cfg.count || 3);
        for (var i = 0; i < count; i++) {
            var wrap = document.createElement('div');
            wrap.className = 'gb-con';
            var pct = 20 + (i / Math.max(count - 1, 1)) * 60;
            var stringH = 12 + Math.random() * 20;
            var size = isMobile ? 22 : 30;
            wrap.style.cssText = 'position:absolute;bottom:-' + (stringH + size) + 'px;left:' + pct + '%;'
                + 'display:flex;flex-direction:column;align-items:center;z-index:9999;pointer-events:none;'
                + 'transform-origin:top center;'
                + (reducedMotion ? '' : 'animation:gbSwing ' + (3 + Math.random() * 2) + 's ease-in-out infinite;');
            var thread = document.createElement('div');
            thread.style.cssText = 'width:1px;height:' + stringH + 'px;background:' + rgba(accent, 0.2);
            wrap.appendChild(thread);
            wrap.appendChild(createIcon(cfg.icon, size, accent));
            nav.appendChild(trackEl(wrap));
        }
    }

    /* --- Flank section titles with icons --- */
    function placeTitleFlank(cfg, accent) {
        var tags = document.querySelectorAll('.section-tag');
        if (!tags.length) tags = document.querySelectorAll('.section-header h2');
        for (var t = 0; t < tags.length; t++) {
            var tag = tags[t];
            tag.style.position = 'relative';
            tag.style.overflow = 'visible';
            var size = isMobile ? 20 : 28;
            var left = createIcon(cfg.icon, size, accent);
            left.style.cssText = 'position:absolute;left:-' + (size + 8) + 'px;top:50%;'
                + 'transform:translateY(-50%);opacity:0.65;animation:gbFadeIn 1s ease;pointer-events:none';
            tag.appendChild(trackEl(left));
            var right = createIcon(cfg.icon, size, accent);
            right.style.cssText = 'position:absolute;right:-' + (size + 8) + 'px;top:50%;'
                + 'transform:translateY(-50%) scaleX(-1);opacity:0.65;animation:gbFadeIn 1s ease;pointer-events:none';
            tag.appendChild(trackEl(right));
        }
    }

    /* --- Icon beside section title divider lines --- */
    function placeTitleDivider(cfg, accent) {
        var lines = document.querySelectorAll('.section-tag-line');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            line.style.position = 'relative';
            line.style.overflow = 'visible';
            var size = isMobile ? 14 : 18;
            var icon = createIcon(cfg.icon, size, accent);
            var side = line.nextElementSibling ? 'right' : 'left';
            icon.style.cssText = 'position:absolute;top:50%;' + side + ':-' + (size / 2 + 4) + 'px;'
                + 'transform:translateY(-50%);opacity:0.55;animation:gbFadeIn 1s ease;pointer-events:none';
            line.appendChild(trackEl(icon));
        }
    }

    /* --- Candy canes crossed behind section title text --- */
    function placeTitleCross(cfg, accent) {
        var titles = document.querySelectorAll('.section-tag span');
        if (!titles.length) titles = document.querySelectorAll('.section-header h2');
        for (var i = 0; i < titles.length; i++) {
            var title = titles[i];
            title.style.position = 'relative';
            var size = isMobile ? 30 : 45;
            var l = createIcon(cfg.icon, size, accent);
            l.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-70%,-50%) rotate(-30deg);'
                + 'opacity:0.12;z-index:-1;animation:gbFadeIn 1s ease;pointer-events:none';
            title.appendChild(trackEl(l));
            var r = createIcon(cfg.icon, size, accent);
            r.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-30%,-50%) rotate(30deg) scaleX(-1);'
                + 'opacity:0.12;z-index:-1;animation:gbFadeIn 1s ease;pointer-events:none';
            title.appendChild(trackEl(r));
        }
    }

    /* --- Sunglasses perched on a title letter --- */
    function placeTitleLetter(cfg, accent) {
        var title = document.querySelector('.section-tag span') || document.querySelector('.section-header h2');
        if (!title) return;
        title.style.position = 'relative';
        title.style.overflow = 'visible';
        var size = isMobile ? 22 : 30;
        var el = createIcon(cfg.icon, size, accent);
        el.style.cssText = 'position:absolute;left:2px;top:-' + Math.round(size * 0.3) + 'px;'
            + 'opacity:0.6;z-index:10;pointer-events:none;animation:gbFadeIn 1s ease';
        title.appendChild(trackEl(el));
    }

    /* --- CTA button accent (small icon beside Book Now) --- */
    function placeCTAAccent(cfg, accent) {
        var cta = document.querySelector('.nav-cta');
        if (!cta) return;
        cta.style.position = 'relative';
        cta.style.overflow = 'visible';
        var size = isMobile ? 14 : 18;
        var el = createIcon(cfg.icon, size, accent);
        el.style.cssText = 'position:absolute;right:-' + (size + 2) + 'px;top:50%;'
            + 'transform:translateY(-50%);opacity:0.7;animation:gbFadeIn 1s ease;pointer-events:none';
        cta.appendChild(trackEl(el));
    }

    /* --- Card corner badge --- */
    function placeCardCorner(cfg, accent) {
        var cards = document.querySelectorAll('.service-card');
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.style.position = 'relative';
            card.style.overflow = 'visible';
            var size = isMobile ? 18 : 24;
            var icon = createIcon(cfg.icon, size, accent);
            var pos = cfg.pos || 'top-right';
            var p = pos.split('-');
            icon.style.cssText = 'position:absolute;' + p[0] + ':-' + Math.round(size / 3) + 'px;'
                + p[1] + ':-' + Math.round(size / 3) + 'px;opacity:0.65;z-index:5;'
                + 'animation:gbFadeIn 1s ease;pointer-events:none';
            card.appendChild(trackEl(icon));
        }
    }

    /* --- Footer scene (multiple items along footer top) --- */
    function placeFooterScene(cfg, accent) {
        var footer = document.querySelector('.footer');
        if (!footer) return;
        footer.style.position = 'relative';
        footer.style.overflow = 'visible';
        var count = isMobile ? 2 : 3;
        var size = isMobile ? 24 : 32;
        for (var i = 0; i < count; i++) {
            var icon = createIcon(cfg.icon, size, accent);
            var pct = 15 + (i / Math.max(count - 1, 1)) * 70;
            icon.style.cssText = 'position:absolute;top:-' + Math.round(size * 0.6) + 'px;left:' + pct + '%;'
                + 'opacity:0.55;animation:gbFadeIn 1.5s ease;pointer-events:none';
            footer.appendChild(trackEl(icon));
        }
    }

    /* --- Footer single item --- */
    function placeFooterItem(cfg, accent) {
        var footer = document.querySelector('.footer');
        if (!footer) return;
        footer.style.position = 'relative';
        footer.style.overflow = 'visible';
        var size = isMobile ? 28 : 36;
        var icon = createIcon(cfg.icon, size, accent);
        icon.style.cssText = 'position:absolute;top:-' + Math.round(size * 0.5) + 'px;right:15%;'
            + 'opacity:0.5;animation:gbFadeIn 1.5s ease;pointer-events:none';
        footer.appendChild(trackEl(icon));
    }

    /* --- Footer garland (repeating icons across footer top) --- */
    function placeFooterGarland(cfg, accent) {
        var footer = document.querySelector('.footer');
        if (!footer) return;
        footer.style.position = 'relative';
        footer.style.overflow = 'visible';
        var count = isMobile ? 4 : 7;
        var size = isMobile ? 16 : 22;
        var wrap = document.createElement('div');
        wrap.className = 'gb-con';
        wrap.style.cssText = 'position:absolute;top:-' + Math.round(size * 0.4) + 'px;left:5%;right:5%;'
            + 'display:flex;justify-content:space-between;pointer-events:none;animation:gbFadeIn 1.5s ease';
        for (var i = 0; i < count; i++) {
            var icon = createIcon(cfg.icon, size, accent);
            icon.style.opacity = '0.45';
            wrap.appendChild(icon);
        }
        footer.appendChild(trackEl(wrap));
    }

    /* --- Edge peekers (items peeking from page edges) --- */
    function placeEdgePeek(cfg, accent) {
        var size = isMobile ? 40 : 60;
        var left = createIcon(cfg.icon, size, accent);
        left.style.cssText = 'position:fixed;left:-' + Math.round(size * 0.35) + 'px;bottom:20%;'
            + 'opacity:0.3;z-index:9997;pointer-events:none;animation:gbFadeIn 2s ease';
        document.body.appendChild(trackEl(left));
        var right = createIcon(cfg.icon, size, accent);
        right.style.cssText = 'position:fixed;right:-' + Math.round(size * 0.35) + 'px;bottom:30%;'
            + 'opacity:0.3;z-index:9997;pointer-events:none;transform:scaleX(-1);animation:gbFadeIn 2s ease';
        document.body.appendChild(trackEl(right));
    }

    /* --- Hero corner element (crescent, clock, timer, sun) --- */
    function placeHeroCorner(cfg, accent) {
        var hero = document.querySelector('.hero-content') || document.querySelector('.hero');
        if (!hero) return;
        hero.style.position = 'relative';
        var size = isMobile ? 40 : 60;
        var icon = createIcon(cfg.icon, size, accent);
        var pos = cfg.pos || 'top-right';
        var p = pos.split('-');
        icon.style.cssText = 'position:absolute;' + p[0] + ':10px;' + p[1] + ':10px;'
            + 'opacity:0.35;z-index:5;animation:gbFadeIn 2s ease;pointer-events:none';
        hero.appendChild(trackEl(icon));
    }

    /* --- Hero scattered elements (bats, stars) --- */
    function placeHeroScatter(cfg, accent) {
        var hero = document.querySelector('.hero');
        if (!hero) return;
        hero.style.position = 'relative';
        var count = isMobile ? Math.ceil((cfg.count || 5) * 0.6) : (cfg.count || 5);
        var size = isMobile ? 16 : 24;
        for (var i = 0; i < count; i++) {
            var icon = createIcon(cfg.icon, size, accent);
            icon.style.cssText = 'position:absolute;left:' + (10 + Math.random() * 80) + '%;'
                + 'top:' + (10 + Math.random() * 70) + '%;'
                + 'transform:rotate(' + (Math.random() * 40 - 20) + 'deg);'
                + 'opacity:' + (0.15 + Math.random() * 0.2) + ';z-index:3;pointer-events:none;'
                + 'animation:gbFadeIn 2s ease';
            hero.appendChild(trackEl(icon));
        }
    }

    /* --- Arrow through hero title --- */
    function placeHeroThrough(cfg, accent) {
        var title = document.querySelector('.hero-title') || document.querySelector('.hero h1');
        if (!title) return;
        title.style.position = 'relative';
        title.style.overflow = 'visible';
        var icon = createIcon(cfg.icon, isMobile ? 80 : 120, accent);
        icon.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-8deg);'
            + 'opacity:0.3;z-index:10;pointer-events:none;animation:gbFadeIn 1.5s ease';
        title.appendChild(trackEl(icon));
    }

    /* --- Hero background (mosque silhouette) --- */
    function placeHeroBg(cfg, accent) {
        var hero = document.querySelector('.hero');
        if (!hero) return;
        hero.style.position = 'relative';
        var icon = createIcon(cfg.icon, isMobile ? 200 : 350, accent);
        icon.style.cssText = 'position:absolute;bottom:0;left:50%;transform:translateX(-50%);'
            + 'z-index:1;pointer-events:none;animation:gbFadeIn 3s ease';
        hero.appendChild(trackEl(icon));
    }

    /* --- Hero firework bursts --- */
    function placeHeroBurst(cfg, accent) {
        var hero = document.querySelector('.hero');
        if (!hero) return;
        hero.style.position = 'relative';
        var spots = [{x:'15%',y:'20%'},{x:'75%',y:'15%'},{x:'50%',y:'35%'},{x:'85%',y:'40%'}];
        var count = Math.min(cfg.count || 3, spots.length);
        for (var i = 0; i < count; i++) {
            var size = (isMobile ? 30 : 50) + Math.random() * 20;
            var icon = createIcon(cfg.icon, size, accent);
            icon.style.cssText = 'position:absolute;left:' + spots[i].x + ';top:' + spots[i].y + ';'
                + 'opacity:' + (0.15 + Math.random() * 0.15) + ';z-index:2;pointer-events:none;'
                + 'animation:gbFadeIn 2s ' + (i * 0.5) + 's ease both'
                + (reducedMotion ? '' : ',gbTwinkle ' + (3 + Math.random() * 2) + 's ease-in-out infinite');
            hero.appendChild(trackEl(icon));
        }
    }

    /* --- Hero accent (megaphone) --- */
    function placeHeroAccent(cfg, accent) {
        var hero = document.querySelector('.hero-content') || document.querySelector('.hero');
        if (!hero) return;
        hero.style.position = 'relative';
        var size = isMobile ? 35 : 50;
        var icon = createIcon(cfg.icon, size, accent);
        icon.style.cssText = 'position:absolute;left:10%;top:30%;transform:rotate(-15deg);'
            + 'opacity:0.3;z-index:3;pointer-events:none;animation:gbFadeIn 1.5s ease';
        hero.appendChild(trackEl(icon));
    }

    /* --- Page corner webs --- */
    function placePageCorner(cfg, accent) {
        var positions = cfg.positions || ['top-left', 'top-right'];
        for (var i = 0; i < positions.length; i++) {
            var p = positions[i].split('-');
            var size = isMobile ? 80 : 120;
            var el = document.createElement('div');
            el.className = 'gb-con';
            el.innerHTML = SVG.web;
            el.style.cssText = 'position:fixed;' + p[0] + ':0;' + p[1] + ':0;'
                + 'width:' + size + 'px;height:' + size + 'px;opacity:0.15;z-index:9997;pointer-events:none;'
                + (p[1] === 'right' ? 'transform:scaleX(-1);' : '')
                + 'animation:gbFadeIn 1.5s ease';
            var svg = el.querySelector('svg');
            if (svg) svg.style.cssText = 'width:100%;height:100%';
            document.body.appendChild(trackEl(el));
        }
    }

    /* ═══════════════════════════════════════════
       CONNOTATION CSS EFFECTS
       Icicles, frost, waves, geo patterns, etc.
    ═══════════════════════════════════════════ */
    function injectConnotationCSS(themeId, accent) {
        var css = [];

        if (themeId === 'winter') {
            var icicleSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 12"><polygon points="5,0 7,12 3,12" fill="rgba(200,225,255,0.4)"/><polygon points="20,0 23,10 17,10" fill="rgba(200,225,255,0.3)"/><polygon points="38,0 41,11 35,11" fill="rgba(200,225,255,0.35)"/><polygon points="55,0 58,9 52,9" fill="rgba(200,225,255,0.3)"/><polygon points="72,0 75,12 69,12" fill="rgba(200,225,255,0.4)"/><polygon points="90,0 93,10 87,10" fill="rgba(200,225,255,0.35)"/></svg>');
            css.push('.nav{position:relative;overflow:visible !important}');
            css.push('.nav::after{content:"";position:absolute;bottom:-12px;left:0;right:0;height:12px;pointer-events:none;z-index:9999;background:url("data:image/svg+xml,' + icicleSvg + '");background-size:100px 12px;background-repeat:repeat-x}');
            var icicleSmall = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 8"><polygon points="8,0 10,8 6,8" fill="rgba(200,225,255,0.3)"/><polygon points="25,0 27,6 23,6" fill="rgba(200,225,255,0.25)"/><polygon points="42,0 44,7 40,7" fill="rgba(200,225,255,0.3)"/><polygon points="58,0 60,6 56,6" fill="rgba(200,225,255,0.25)"/><polygon points="73,0 75,8 71,8" fill="rgba(200,225,255,0.3)"/></svg>');
            css.push('.service-card{position:relative;overflow:visible !important}');
            css.push('.service-card::before{content:"";position:absolute;top:-1px;left:0;right:0;height:8px;pointer-events:none;z-index:5;background:url("data:image/svg+xml,' + icicleSmall + '");background-size:80px 8px;background-repeat:repeat-x}');
            var snowSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 25" preserveAspectRatio="none"><path d="M0,25 C50,5 100,15 150,8 C200,0 250,12 300,5 C350,0 380,10 400,8 L400,25Z" fill="rgba(230,240,255,0.12)"/></svg>');
            css.push('.footer{position:relative;overflow:visible !important}');
            css.push('.footer::before{content:"";position:absolute;top:-20px;left:0;right:0;height:25px;pointer-events:none;z-index:5;background:url("data:image/svg+xml,' + snowSvg + '");background-size:100% 25px}');
            css.push('section{position:relative}');
            css.push('section::after{content:"";position:absolute;bottom:0;left:0;right:0;height:3px;pointer-events:none;background:linear-gradient(90deg,transparent,' + rgba(accent, 0.15) + ' 20%,' + rgba(accent, 0.25) + ' 50%,' + rgba(accent, 0.15) + ' 80%,transparent);animation:gbFadeIn 2s ease}');
        }

        if (themeId === 'summer') {
            var waveSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 16" preserveAspectRatio="none"><path d="M0,8 Q150,0 300,8 Q450,16 600,8 Q750,0 900,8 Q1050,16 1200,8" fill="none" stroke="' + accent + '" stroke-width="1.5" opacity="0.3"/></svg>');
            css.push('.footer{position:relative;overflow:visible !important}');
            css.push('.footer::before{content:"";position:absolute;top:-16px;left:0;right:0;height:16px;pointer-events:none;background:url("data:image/svg+xml,' + waveSvg + '");background-size:100% 16px}');
            var waveSmall = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 8" preserveAspectRatio="none"><path d="M0,4 Q75,0 150,4 Q225,8 300,4 Q375,0 450,4 Q525,8 600,4" fill="none" stroke="' + accent + '" stroke-width="1" opacity="0.2"/></svg>');
            css.push('section{position:relative}');
            css.push('section + section::before{content:"";position:absolute;top:-8px;left:0;right:0;height:8px;pointer-events:none;background:url("data:image/svg+xml,' + waveSmall + '");background-size:100% 8px}');
        }

        if (themeId === 'eid') {
            css.push('.service-card{border:1px solid ' + rgba(accent, 0.2) + ' !important}');
            var geoSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 4"><path d="M0,2L5,0L10,2L15,0L20,2" fill="none" stroke="' + accent + '" stroke-width="0.8" opacity="0.3"/></svg>');
            css.push('section{position:relative}');
            css.push('section + section::before{content:"";position:absolute;top:-2px;left:10%;right:10%;height:4px;pointer-events:none;background:url("data:image/svg+xml,' + geoSvg + '");background-size:20px 4px;background-repeat:repeat-x}');
        }

        if (themeId === 'blackfriday') {
            css.push('.hero{position:relative}');
            css.push('.hero .gb-con-pct{position:absolute;right:8%;top:15%;font-size:' + (isMobile ? '100' : '180') + 'px;font-weight:900;color:' + accent + ';opacity:0.06;z-index:1;pointer-events:none;font-family:-apple-system,sans-serif;line-height:1;animation:gbFadeIn 2s ease}');
        }

        if (themeId === 'flashsale') {
            css.push('@keyframes gbPulse{0%,100%{opacity:0}50%{opacity:0.03}}');
            css.push('.hero{position:relative}');
            css.push('.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,' + accent + ',transparent 70%);animation:gbPulse 2s ease-in-out infinite;pointer-events:none;z-index:1}');
            css.push('@keyframes gbCtaSpark{0%,100%{box-shadow:0 0 5px ' + rgba(accent, 0.3) + '}50%{box-shadow:0 0 20px ' + rgba(accent, 0.6) + ',0 0 40px ' + rgba(accent, 0.3) + '}}');
            css.push('.nav-cta,.hero-cta-primary{animation:gbCtaSpark 1.5s ease-in-out infinite !important}');
        }

        if (css.length) {
            state.conStyleEl = document.createElement('style');
            state.conStyleEl.id = 'gb-con-css';
            state.conStyleEl.textContent = css.join('');
            document.head.appendChild(state.conStyleEl);
        }
    }

    /* ═══════════════════════════════════════════
       CONNOTATION DISPATCH
    ═══════════════════════════════════════════ */
    var CON_PLACERS = {
        logo: placeOnLogo, logoPin: placeLogoPin, logoWrap: placeLogoWrap,
        logoBehind: placeLogoBehind, navHang: placeNavHang,
        titleFlank: placeTitleFlank, titleDivider: placeTitleDivider,
        titleCross: placeTitleCross, titleLetter: placeTitleLetter,
        ctaAccent: placeCTAAccent, cardCorner: placeCardCorner,
        footerScene: placeFooterScene, footerItem: placeFooterItem,
        footerGarland: placeFooterGarland, edgePeek: placeEdgePeek,
        heroCorner: placeHeroCorner, heroScatter: placeHeroScatter,
        heroThrough: placeHeroThrough, heroBg: placeHeroBg,
        heroBurst: placeHeroBurst, heroAccent: placeHeroAccent,
        pageCorner: placePageCorner
    };

    function renderConnotations(themeId, accent) {
        var items = CONNOTATIONS[themeId];
        if (!items) return;

        injectConnotationCSS(themeId, accent);

        // Black Friday hero percent sign (DOM element via CSS class)
        if (themeId === 'blackfriday') {
            var hero = document.querySelector('.hero');
            if (hero) {
                var pct = document.createElement('div');
                pct.className = 'gb-con gb-con-pct';
                pct.textContent = '%';
                hero.appendChild(trackEl(pct));
            }
        }

        for (var i = 0; i < items.length; i++) {
            var cfg = items[i];
            if (cfg.place === 'css') continue; // handled by injectConnotationCSS
            var placer = CON_PLACERS[cfg.place];
            if (placer) placer(cfg, accent);
        }
    }

    function removeConnotations() {
        for (var i = 0; i < state.conEls.length; i++) {
            if (state.conEls[i] && state.conEls[i].parentNode)
                state.conEls[i].parentNode.removeChild(state.conEls[i]);
        }
        state.conEls = [];
        if (state.conStyleEl) { state.conStyleEl.remove(); state.conStyleEl = null; }
    }

    /* ═══════════════════════════════════════════
       PROMOTIONAL BANNER
       Slim bar at top of page, dismissible.
    ═══════════════════════════════════════════ */
    function createBanner(text, colors, textColor, emoji) {
        if (!text) return;
        if (sessionStorage.getItem('gb-banner-dismissed-' + text)) return;

        var banner = document.createElement('div');
        banner.id = 'gb-banner';
        var primary = colors.primary || '#d4af37';
        var secondary = colors.secondary || darken(primary);

        banner.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;gap:8px;'
            + 'padding:10px 40px 10px 20px;position:relative;z-index:10000;overflow:hidden;'
            + 'background:linear-gradient(135deg,' + secondary + ',' + primary + ');'
            + 'color:' + (textColor || '#fff') + ';font-size:13px;font-weight:600;letter-spacing:0.3px;'
            + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
            + 'animation:gbBannerIn 0.4s 0.3s ease both';

        // Content
        if (emoji) {
            var emojiEl = document.createElement('span');
            emojiEl.textContent = emoji;
            emojiEl.style.cssText = 'font-size:15px;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3))';
            banner.appendChild(emojiEl);
        }
        var titleEl = document.createElement('span');
        titleEl.textContent = text;
        banner.appendChild(titleEl);

        // Close button
        var close = document.createElement('button');
        close.textContent = '\u2715';
        close.setAttribute('aria-label', 'Dismiss');
        close.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);'
            + 'background:none;border:none;color:inherit;opacity:0.6;cursor:pointer;'
            + 'font-size:13px;padding:4px 6px;line-height:1';
        close.onmouseover = function() { close.style.opacity = '1'; };
        close.onmouseout = function() { close.style.opacity = '0.6'; };
        close.onclick = function() {
            banner.style.transition = 'max-height 0.3s ease,opacity 0.3s ease,padding 0.3s ease';
            banner.style.maxHeight = '0';
            banner.style.opacity = '0';
            banner.style.paddingTop = '0';
            banner.style.paddingBottom = '0';
            banner.style.overflow = 'hidden';
            sessionStorage.setItem('gb-banner-dismissed-' + text, '1');
            setTimeout(function() { banner.remove(); }, 300);
        };
        banner.appendChild(close);

        document.body.insertBefore(banner, document.body.firstChild);
        state.banner = banner;
    }

    /* ═══════════════════════════════════════════
       APPLY THEME
    ═══════════════════════════════════════════ */
    function apply(data) {
        if (!data || !data.themeId) { remove(); return; }
        if (state.active && state.themeId === data.themeId) return;
        remove();

        var accent = getAccent(data);
        state.active = true;
        state.themeId = data.themeId;

        // 1. Override CSS variables
        applyCSS(accent, data.colors);

        // 2. Inject animation keyframes
        injectAnimCSS();

        // 3. Create decoration container and render
        var container = createContainer();
        state.container = container;

        var decos = DECOR[data.themeId] || [];
        decos.forEach(function(d) {
            var renderer = RENDERERS[d.type];
            if (renderer) renderer(container, d);
        });

        // 4. Render connotation elements
        renderConnotations(data.themeId, accent);

        // 5. Show banner if enabled
        if (data.showStickyBar !== false) {
            var bannerText = data.stickyText || data.banner || '';
            createBanner(bannerText, data.colors || {}, data.textColor, data.emoji);
        }
    }

    /* ═══════════════════════════════════════════
       REMOVE THEME
    ═══════════════════════════════════════════ */
    function remove() {
        if (!state.active) return;

        // Remove decoration container (removes all decorations at once)
        if (state.container) { state.container.remove(); state.container = null; }

        // Remove connotation elements
        removeConnotations();

        // Remove banner
        if (state.banner) { state.banner.remove(); state.banner = null; }

        // Remove animation CSS
        if (state.animStyleEl) { state.animStyleEl.remove(); state.animStyleEl = null; }

        // Restore CSS variables
        restoreCSS();

        state.active = false;
        state.themeId = null;
    }

    /* ═══════════════════════════════════════════
       EXPORT
    ═══════════════════════════════════════════ */
    window.GBThemeEffects = { apply: apply, remove: remove };
})();
