/**
 * Golden Barbers – Premium Seasonal Theme Effects v25
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
       Used for web patterns and corner decorations.
    ═══════════════════════════════════════════ */
    var SVG = {
        web: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5">'
            + '<line x1="0" y1="0" x2="200" y2="200"/><line x1="0" y1="0" x2="200" y2="80"/>'
            + '<line x1="0" y1="0" x2="80" y2="200"/><line x1="0" y1="0" x2="200" y2="0"/>'
            + '<line x1="0" y1="0" x2="0" y2="200"/><line x1="0" y1="0" x2="140" y2="200"/>'
            + '<line x1="0" y1="0" x2="200" y2="140"/>'
            + '<path d="M30,0 Q20,20 0,30"/><path d="M70,0 Q45,45 0,70"/>'
            + '<path d="M115,0 Q75,75 0,115"/><path d="M165,0 Q110,110 0,165"/></svg>',

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
            + '<circle cx="66" cy="72" r="5"/><circle cx="78" cy="72" r="5"/></svg>'
    };

    /* ═══════════════════════════════════════════
       CONNOTATION ICON SYSTEM
       All icons are PNGs: original high-quality
       assets + Twemoji (Twitter Emoji) downloads
       for consistent, colourful rendering at any size.
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
        // Christmas
        santaHat: 'santa-hat.png', ornament: 'ornament.png', holly: 'holly.png', candyCane: 'candy-cane.png',
        // Valentine's
        heart: 'heart.png', rose: 'rose.png', cupidArrow: 'tw-heart-arrow.png', loveLetter: 'tw-love-letter.png',
        // Halloween
        witchHat: 'witch-hat.png', bat: 'bat.png', pumpkin: 'tw-pumpkin.png',
        // Easter
        easterEgg: 'easter-egg.png', bunnyEars: 'tw-bunny.png', springFlower: 'tw-cherry-blossom.png', basket: 'tw-basket.png',
        // Summer
        sunglasses: 'sunglasses.png', palmFrond: 'tw-palm.png', sun: 'tw-sun.png',
        // Autumn
        acorn: 'tw-chestnut.png', mushroom: 'tw-mushroom.png', hotDrink: 'tw-coffee.png',
        // Winter
        scarf: 'tw-scarf.png',
        // Ramadan
        lantern: 'tw-lantern.png', crescentStar: 'tw-crescent-star.png', star: 'tw-star.png', mosque: 'tw-mosque.png',
        // Eid
        ketupat: 'tw-gift.png', firework: 'tw-fireworks.png',
        // Black Friday
        saleTag: 'tw-tag.png', shoppingBag: 'tw-shopping-bag.png',
        // New Year
        champagne: 'tw-champagne.png', clock: 'tw-clock.png', confetti: 'tw-confetti.png',
        // Flash Sale
        lightning: 'tw-lightning.png', megaphone: 'tw-megaphone.png', timer: 'tw-stopwatch.png'
    };

    function createIcon(name, size) {
        var el = document.createElement('div');
        el.className = 'gb-con';
        if (PNG_ICONS[name]) {
            el.style.cssText = 'width:' + size + 'px;height:' + size + 'px;pointer-events:none;line-height:0;flex-shrink:0';
            var img = document.createElement('img');
            img.src = ASSET_PATH + PNG_ICONS[name];
            img.alt = '';
            img.draggable = false;
            img.style.cssText = 'width:100%;height:100%;object-fit:contain;pointer-events:none';
            el.appendChild(img);
        } else {
            // SVG fallback (spider web pattern)
            el.style.cssText = 'width:' + size + 'px;height:' + size + 'px;pointer-events:none;line-height:0;flex-shrink:0';
            var svgStr = SVG[name] || '';
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
       CONNOTATION ICON SYSTEM — v25 FINAL (Luxury Micro-Accents)
       Golden Barbers — minimal, premium, barely-noticeable
       Vanilla JS / ES5 / drop-in replacement
    ═══════════════════════════════════════════ */
    var CONNOTATIONS = {
      christmas: [
        { place: "logoPin", icon: "santaHat", sizeD: 18, sizeM: 14, opacity: 0.26, anchor: "tl", dx: -6, dy: -8, rot: -10, anim: "fade" },
        { place: "heroMark", icon: "ornament", sizeD: 24, sizeM: 16, opacity: 0.14, anchor: "bl", dx: 26, dy: 26, rot: 10, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "holly", sizeD: 18, sizeM: 14, opacity: 0.12, anchor: "br", dx: 22, dy: 18, rot: -8, anim: "none" }
      ],
      valentines: [
        { place: "logoPin", icon: "heart", sizeD: 16, sizeM: 14, opacity: 0.22, anchor: "tl", dx: -4, dy: -6, rot: -8, anim: "fade" },
        { place: "heroMark", icon: "twLoveLetter", sizeD: 24, sizeM: 16, opacity: 0.13, anchor: "bl", dx: 26, dy: 26, rot: 8, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twHeartArrow", sizeD: 18, sizeM: 14, opacity: 0.11, anchor: "br", dx: 22, dy: 18, rot: -10, anim: "none" }
      ],
      halloween: [
        { place: "logoPin", icon: "witchHat", sizeD: 18, sizeM: 14, opacity: 0.24, anchor: "tl", dx: -6, dy: -8, rot: -12, anim: "fade" },
        { place: "heroCornerSvg", which: "web", sizeD: 140, sizeM: 92, opacity: 0.10, anchor: "tr", dx: -2, dy: -2 },
        { place: "footerMark", icon: "bat", sizeD: 18, sizeM: 14, opacity: 0.11, anchor: "bl", dx: 22, dy: 18, rot: 8, anim: "none" }
      ],
      easter: [
        { place: "logoPin", icon: "twBunny", sizeD: 16, sizeM: 14, opacity: 0.20, anchor: "tl", dx: -4, dy: -6, rot: -6, anim: "fade" },
        { place: "heroMark", icon: "twCherryBlossom", sizeD: 24, sizeM: 16, opacity: 0.12, anchor: "bl", dx: 26, dy: 26, rot: 10, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "easterEgg", sizeD: 18, sizeM: 14, opacity: 0.11, anchor: "br", dx: 22, dy: 18, rot: -8, anim: "none" }
      ],
      summer: [
        { place: "logoPin", icon: "sunglasses", sizeD: 18, sizeM: 14, opacity: 0.20, anchor: "tl", dx: -6, dy: -6, rot: -8, anim: "fade" },
        { place: "heroMark", icon: "twSun", sizeD: 24, sizeM: 16, opacity: 0.12, anchor: "bl", dx: 26, dy: 26, rot: 12, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twPalm", sizeD: 18, sizeM: 14, opacity: 0.11, anchor: "br", dx: 22, dy: 18, rot: -10, anim: "none" }
      ],
      autumn: [
        { place: "logoPin", icon: "twChestnut", sizeD: 16, sizeM: 14, opacity: 0.20, anchor: "tl", dx: -4, dy: -6, rot: -8, anim: "fade" },
        { place: "heroMark", icon: "twCoffee", sizeD: 24, sizeM: 16, opacity: 0.12, anchor: "bl", dx: 26, dy: 26, rot: 10, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twMushroom", sizeD: 18, sizeM: 14, opacity: 0.11, anchor: "br", dx: 22, dy: 18, rot: -10, anim: "none" }
      ],
      winter: [
        { place: "logoPin", icon: "twScarf", sizeD: 16, sizeM: 14, opacity: 0.20, anchor: "tl", dx: -4, dy: -6, rot: -6, anim: "fade" },
        { place: "heroMark", icon: "twScarf", sizeD: 22, sizeM: 16, opacity: 0.11, anchor: "bl", dx: 26, dy: 26, rot: 8, blend: "screen", anim: "none" }
      ],
      ramadan: [
        { place: "logoPin", icon: "twCrescentStar", sizeD: 16, sizeM: 14, opacity: 0.20, anchor: "tl", dx: -4, dy: -6, rot: -8, anim: "fade" },
        { place: "heroMark", icon: "twLantern", sizeD: 24, sizeM: 16, opacity: 0.12, anchor: "bl", dx: 26, dy: 26, rot: 8, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twStar", sizeD: 18, sizeM: 14, opacity: 0.10, anchor: "br", dx: 22, dy: 18, rot: -8, anim: "none" }
      ],
      eid: [
        { place: "logoPin", icon: "twGift", sizeD: 16, sizeM: 14, opacity: 0.18, anchor: "tl", dx: -4, dy: -6, rot: -8, anim: "fade" },
        { place: "heroMark", icon: "twFireworks", sizeD: 24, sizeM: 16, opacity: 0.11, anchor: "bl", dx: 26, dy: 26, rot: 10, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twCrescentStar", sizeD: 18, sizeM: 14, opacity: 0.10, anchor: "br", dx: 22, dy: 18, rot: -10, anim: "none" }
      ],
      blackfriday: [
        { place: "logoPin", icon: "twTag", sizeD: 16, sizeM: 14, opacity: 0.18, anchor: "tl", dx: -4, dy: -6, rot: -10, anim: "fade" },
        { place: "heroMark", icon: "twTag", sizeD: 22, sizeM: 16, opacity: 0.11, anchor: "bl", dx: 26, dy: 26, rot: 10, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twShoppingBag", sizeD: 18, sizeM: 14, opacity: 0.10, anchor: "br", dx: 22, dy: 18, rot: -8, anim: "none" }
      ],
      newyear: [
        { place: "logoPin", icon: "twClock", sizeD: 16, sizeM: 14, opacity: 0.18, anchor: "tl", dx: -4, dy: -6, rot: -8, anim: "fade" },
        { place: "heroMark", icon: "twConfetti", sizeD: 24, sizeM: 16, opacity: 0.10, anchor: "bl", dx: 26, dy: 26, rot: 12, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twChampagne", sizeD: 18, sizeM: 14, opacity: 0.10, anchor: "br", dx: 22, dy: 18, rot: -8, anim: "none" }
      ],
      flashsale: [
        { place: "logoPin", icon: "twLightning", sizeD: 16, sizeM: 14, opacity: 0.18, anchor: "tl", dx: -4, dy: -6, rot: -10, anim: "fade" },
        { place: "heroMark", icon: "twStopwatch", sizeD: 22, sizeM: 16, opacity: 0.11, anchor: "bl", dx: 26, dy: 26, rot: 10, blend: "screen", anim: "none" },
        { place: "footerMark", icon: "twMegaphone", sizeD: 18, sizeM: 14, opacity: 0.10, anchor: "br", dx: 22, dy: 18, rot: -10, anim: "none" }
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
        fog: renderFog,
        frost: function(container) { renderFrost(container); },
        border: renderBorder
    };

    /* ═══════════════════════════════════════════
       v25 UTILITIES (ES5 safe)
    ═══════════════════════════════════════════ */

    function gbq(sel, root) { try { return (root || document).querySelector(sel); } catch (e) { return null; } }
    function clamp(n, a, b) { if (n < a) return a; if (n > b) return b; return n; }
    function px(n) { return (n || 0) + "px"; }

    function ensureRelative(el) {
      if (!el) return;
      var cs = window.getComputedStyle ? window.getComputedStyle(el) : null;
      var pos = cs ? cs.position : el.style.position;
      if (!pos || pos === "static") el.style.position = "relative";
    }

    /* --- PATCHED safeCreateIcon: alias resolver ---
       1. Try PNG_ICONS[name] directly
       2. Strip "tw" prefix, lowercase first char → try that
       3. Reverse-lookup by filename: twCamelCase → tw-kebab-case.png
       4. Not found → skip silently (return null) */
    function safeCreateIcon(name, size) {
      if (!name) return null;
      // 1. Direct match
      if (PNG_ICONS[name]) return createIcon(name, size);
      // 2. Strip "tw" prefix
      if (name.indexOf("tw") === 0 && name.length > 2) {
        var stripped = name.charAt(2).toLowerCase() + name.slice(3);
        if (PNG_ICONS[stripped]) return createIcon(stripped, size);
      }
      // 3. Reverse lookup by filename: convert twCamelCase → tw-kebab-case.png
      var fname = name.replace(/([A-Z])/g, function(m) { return "-" + m.toLowerCase(); }) + ".png";
      for (var key in PNG_ICONS) {
        if (PNG_ICONS.hasOwnProperty(key) && PNG_ICONS[key] === fname) return createIcon(key, size);
      }
      // 4. Not found
      return null;
    }

    function getSize(cfg) {
      var s = isMobile ? (cfg.sizeM || cfg.sizeD || 16) : (cfg.sizeD || cfg.sizeM || 20);
      if (!isMobile) s = clamp(s, 18, 26);
      else s = clamp(s, 14, 18);
      return s;
    }

    function getOpacity(cfg, isLogo) {
      var o = (typeof cfg.opacity === "number") ? cfg.opacity : 0.12;
      if (isLogo) o = clamp(o, 0.14, 0.30);
      else o = clamp(o, 0.10, 0.18);
      return o;
    }

    function positionAbs(el, anchor, dx, dy) {
      el.style.position = "absolute";
      el.style.left = "auto"; el.style.right = "auto";
      el.style.top = "auto"; el.style.bottom = "auto";
      el.style.transform = "none";
      var a = anchor || "br";
      var x = dx || 0;
      var y = dy || 0;
      if (a === "tl") { el.style.left = px(x);  el.style.top = px(y); }
      if (a === "tr") { el.style.right = px(x); el.style.top = px(y); }
      if (a === "bl") { el.style.left = px(x);  el.style.bottom = px(y); }
      if (a === "br") { el.style.right = px(x); el.style.bottom = px(y); }
    }

    function applyLuxuryFinish(wrap, accent, opacity, cfg) {
      wrap.style.opacity = String(opacity);
      var filt =
        "grayscale(0.25) " +
        "saturate(0.85) " +
        "contrast(1.05) " +
        "brightness(0.98) " +
        "drop-shadow(0 8px 22px " + rgba("#000000", 0.42) + ") " +
        "drop-shadow(0 1px 0 " + rgba(accent || "#FFFFFF", Math.min(0.08, opacity * 0.35)) + ")";
      wrap.style.filter = filt;
      if (cfg && cfg.blend) wrap.style.mixBlendMode = cfg.blend;
    }

    /* --- PATCHED safeAnim: uses CSS keyframe names, respects reduced-motion --- */
    function safeAnim(el, animName) {
      if (reducedMotion) return;
      if (animName === "fade") el.style.animation = "gbFadeIn 1.2s ease";
      else if (animName === "twinkle") el.style.animation = "gbTwinkle 4s ease-in-out infinite";
      else if (animName === "swing") el.style.animation = "gbSwing 5s ease-in-out infinite";
    }

    /* ═══════════════════════════════════════════
       v25 PLACERS (only 4)
    ═══════════════════════════════════════════ */

    function placeLogoPin(cfg, accent) {
      var logo = gbq(".nav-logo") || gbq(".nav .nav-logo") || gbq(".nav-inner .nav-logo");
      if (!logo) return;
      ensureRelative(logo);
      var size = getSize(cfg);
      var wrap = safeCreateIcon(cfg.icon, size);
      if (!wrap) return;
      wrap = trackEl(wrap);
      wrap.style.zIndex = "3";
      positionAbs(wrap, cfg.anchor || "tl", cfg.dx || -4, cfg.dy || -6);
      var op = getOpacity(cfg, true);
      applyLuxuryFinish(wrap, accent, op, cfg);
      var rot = (typeof cfg.rot === "number") ? cfg.rot : -8;
      wrap.style.transform = "rotate(" + rot + "deg)";
      safeAnim(wrap, cfg.anim || "fade");
      logo.appendChild(wrap);
    }

    function placeHeroMark(cfg, accent) {
      var hero = gbq(".hero");
      if (!hero) return;
      ensureRelative(hero);
      var size = getSize(cfg);
      var wrap = safeCreateIcon(cfg.icon, size);
      if (!wrap) return;
      wrap = trackEl(wrap);
      wrap.style.zIndex = "0";
      positionAbs(wrap, cfg.anchor || "bl", cfg.dx || 26, cfg.dy || 26);
      var op = getOpacity(cfg, false);
      applyLuxuryFinish(wrap, accent, op, cfg);
      var rot = (typeof cfg.rot === "number") ? cfg.rot : 8;
      wrap.style.transform = "rotate(" + rot + "deg)";
      safeAnim(wrap, cfg.anim || "none");
      hero.appendChild(wrap);
    }

    function placeFooterMark(cfg, accent) {
      var footer = gbq(".footer") || gbq("footer");
      if (!footer) return;
      ensureRelative(footer);
      var size = getSize(cfg);
      var wrap = safeCreateIcon(cfg.icon, size);
      if (!wrap) return;
      wrap = trackEl(wrap);
      wrap.style.zIndex = "0";
      positionAbs(wrap, cfg.anchor || "br", cfg.dx || 22, cfg.dy || 18);
      var op = getOpacity(cfg, false);
      applyLuxuryFinish(wrap, accent, op, cfg);
      var rot = (typeof cfg.rot === "number") ? cfg.rot : -8;
      wrap.style.transform = "rotate(" + rot + "deg)";
      safeAnim(wrap, cfg.anim || "none");
      footer.appendChild(wrap);
    }

    function placeHeroCornerSvg(cfg, accent) {
      if (!cfg || cfg.which !== "web") return;
      var hero = gbq(".hero");
      if (!hero) return;
      ensureRelative(hero);
      var size = isMobile ? clamp((cfg.sizeM || 92), 72, 110) : clamp((cfg.sizeD || 140), 110, 170);
      var op = clamp((typeof cfg.opacity === "number" ? cfg.opacity : 0.10), 0.06, 0.12);
      var el = document.createElement("div");
      el.className = "gb-con";
      el.style.cssText =
        "width:" + size + "px;height:" + size + "px;pointer-events:none;position:absolute;z-index:0;opacity:" + op + ";" +
        "filter:drop-shadow(0 10px 26px " + rgba("#000000", 0.45) + ");";
      el.innerHTML =
        '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<g fill="none" stroke="' + rgba(accent || "#FFFFFF", 0.55) + '" stroke-width="0.85" stroke-linecap="round" opacity="0.9">' +
            '<path d="M0,0 L100,0 L0,100 Z" />' +
            '<path d="M0,0 L100,100" />' +
            '<path d="M0,24 Q24,24 24,0" />' +
            '<path d="M0,44 Q44,44 44,0" />' +
            '<path d="M0,64 Q64,64 64,0" />' +
            '<path d="M0,84 Q84,84 84,0" />' +
          '</g>' +
        "</svg>";
      el = trackEl(el);
      positionAbs(el, cfg.anchor || "tr", cfg.dx || -2, cfg.dy || -2);
      var a = cfg.anchor || "tr";
      if (a === "tl") el.style.transform = "scaleX(-1)";
      if (a === "br") el.style.transform = "scaleY(-1)";
      if (a === "bl") el.style.transform = "scale(-1,-1)";
      hero.appendChild(el);
    }

    /* ═══════════════════════════════════════════
       v25 DISPATCH
    ═══════════════════════════════════════════ */
    var CON_PLACERS = {
      logoPin: placeLogoPin,
      heroMark: placeHeroMark,
      footerMark: placeFooterMark,
      heroCornerSvg: placeHeroCornerSvg
    };

    function renderConnotations(themeId, accent) {
      var items = CONNOTATIONS[themeId];
      if (!items || !items.length) return;
      for (var i = 0; i < items.length; i++) {
        var cfg = items[i];
        var fn = CON_PLACERS[cfg.place];
        if (fn) fn(cfg, accent);
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
