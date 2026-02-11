/**
 * Golden Barbers – Premium Seasonal Theme Effects v20
 *
 * Clean rewrite: premium quality, subtle execution.
 * Colour palette override + 2 tasteful decorations per theme + optional banner.
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
        banner: null
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
            { type: 'corner', svg: 'web', pos: ['top-left','top-right'], size: 160, opacity: 0.15 },
            { type: 'fog', color: 'rgba(74,20,140,0.06)', height: 100 }
        ],
        easter: [
            { type: 'particles', chars: ['\u273F','\u2740','\u273E'], count: 6, colors: ['#f48fb1','#ce93d8','#81c784','#fff59d'], speed: [10,18], dir: 'up', drift: 15 },
            { type: 'corner', svg: 'flower', pos: ['top-right','bottom-left'], size: 100, opacity: 0.12 }
        ],
        summer: [
            { type: 'border', style: 'wave', color: '#0277BD' },
            { type: 'corner', svg: 'palm', pos: ['bottom-left','bottom-right'], size: 160, opacity: 0.1 }
        ],
        eid: [
            { type: 'border', style: 'geo', color: '#FDD835' },
            { type: 'hang', svg: 'lantern', count: 3, color: '#FDD835' }
        ],
        ramadan: [
            { type: 'border', style: 'geo', color: '#B8860B' },
            { type: 'corner', svg: 'crescent', pos: ['top-right'], size: 80, opacity: 0.2 }
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
        var ar = rgba(accent, 0.0); // just a base
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

        // 4. Show banner if enabled
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
