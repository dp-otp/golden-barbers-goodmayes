/**
 * Golden Barbers – Premium Seasonal Theme Effects (Final)
 * Real connotations, positioned decorations, unique banners.
 * Main pages (index/services): full effects. Others: glow+border only.
 */
(function () {
    'use strict';

    var state = {
        canvas: null, ctx: null, raf: null, particles: [],
        bokehEls: [], decorEls: [], extraEls: [],
        banner: null, border: null, navLine: null,
        style: null, hatEls: [], id: null,
        savedBorder: null, savedShadow: null, savedNavGlow: null
    };

    var isMainPage = (function () {
        var seg = window.location.pathname.toLowerCase().split('/').pop().replace('.html', '');
        return !seg || seg === '' || seg === 'index' || seg === 'services';
    })();

    var isMobile = window.innerWidth < 768;
    var W = window.innerWidth, H = window.innerHeight;
    window.addEventListener('resize', function () {
        W = window.innerWidth; H = window.innerHeight; isMobile = W < 768;
        if (state.canvas) { state.canvas.width = W; state.canvas.height = H; }
    });

    function rand(a, b) { return Math.random() * (b - a) + a; }
    function getTheme(id) {
        if (!id) return null;
        var k = id.toLowerCase().replace(/[\s_']/g, '-');
        return THEMES[k] || THEMES[k.replace(/-/g, '')] || null;
    }

    /* ═══ CANVAS DRAW FUNCTIONS ═══ */
    function snowflake(x, y, r) {
        var c = state.ctx; c.save(); c.translate(x, y);
        c.strokeStyle = 'rgba(255,255,255,' + Math.min(0.3 + r * 0.08, 0.8) + ')';
        c.lineWidth = r > 3.5 ? 1 : 0.7; c.lineCap = 'round';
        for (var i = 0; i < 6; i++) {
            c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -r);
            if (r > 2.5) { c.moveTo(0, -r * .55); c.lineTo(-r * .3, -r * .75); c.moveTo(0, -r * .55); c.lineTo(r * .3, -r * .75); }
            if (r > 4) { c.moveTo(0, -r * .35); c.lineTo(-r * .2, -r * .5); c.moveTo(0, -r * .35); c.lineTo(r * .2, -r * .5); }
            c.stroke(); c.rotate(Math.PI / 3);
        }
        c.restore();
    }
    function heart(x, y, s, col) {
        var c = state.ctx; c.save(); c.translate(x, y); c.scale(s / 16, s / 16);
        c.beginPath(); c.moveTo(0, 3); c.bezierCurveTo(-1, -2, -8, -4, -8, 0); c.bezierCurveTo(-8, 5, 0, 10, 0, 14);
        c.moveTo(0, 3); c.bezierCurveTo(1, -2, 8, -4, 8, 0); c.bezierCurveTo(8, 5, 0, 10, 0, 14);
        c.fillStyle = col; c.shadowBlur = s * .5; c.shadowColor = col; c.fill();
        c.beginPath(); c.arc(-3, 1, 2.5, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,.2)'; c.shadowBlur = 0; c.fill(); c.restore();
    }
    function ember(x, y, r, col) {
        var c = state.ctx; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = col; c.shadowBlur = r * 4; c.shadowColor = col; c.fill(); c.shadowBlur = 0;
    }
    function star5(x, y, r, col) {
        var c = state.ctx; c.save(); c.translate(x, y); c.beginPath();
        for (var i = 0; i < 5; i++) { var a = (i * 4 * Math.PI / 5) - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); a = ((i * 4 + 2) * Math.PI / 5) - Math.PI / 2; c.lineTo(Math.cos(a) * r * .4, Math.sin(a) * r * .4); }
        c.closePath(); c.fillStyle = col; c.shadowBlur = r * 2; c.shadowColor = col; c.fill(); c.restore();
    }
    function tag(x, y, s, col) {
        var c = state.ctx; c.save(); c.translate(x, y); c.scale(s / 20, s / 20);
        c.beginPath(); c.moveTo(-6, -10); c.lineTo(6, -10); c.lineTo(6, 6); c.lineTo(0, 12); c.lineTo(-6, 6); c.closePath();
        c.fillStyle = col; c.shadowBlur = 6; c.shadowColor = col; c.fill();
        c.beginPath(); c.arc(0, -4, 2, 0, Math.PI * 2); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = .8; c.stroke(); c.restore();
    }

    /* ═══ SVG DECORATIONS ═══ */
    var SVG = {};
    // Hero accessories
    SVG.santaHat = '<svg viewBox="0 0 100 90"><defs><linearGradient id="shf" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#E53935"/><stop offset="40%" stop-color="#D32F2F"/><stop offset="100%" stop-color="#B71C1C"/></linearGradient></defs><path d="M18 72C22 42,38 18,58 6c4-3,9-2,8 4-4 18,6 42,18 62Z" fill="url(#shf)"/><path d="M28 68C32 44,44 22,58 10 52 30,50 48,54 68Z" fill="#E53935" opacity=".4"/><path d="M10 70C10 62,25 57,50 57s40 5,40 13c0 10-15 14-40 14S10 80,10 70Z" fill="#F5F5F5"/><circle cx="62" cy="8" r="10" fill="white"/><circle cx="59" cy="5" r="3.5" fill="#fff" opacity=".7"/></svg>';
    SVG.witchHat = '<svg viewBox="0 0 90 100"><path d="M45 5L20 70h50z" fill="#2a0845"/><path d="M45 5L30 55h30z" fill="#3a1060" opacity=".5"/><ellipse cx="45" cy="72" rx="38" ry="8" fill="#1a0530"/><ellipse cx="45" cy="70" rx="42" ry="10" fill="#2a0845"/><path d="M32 68c3-3 10-4 18-1" stroke="#FF6F00" stroke-width="2.5" fill="none"/><circle cx="52" cy="65" r="2" fill="#FF6F00"/></svg>';
    SVG.bunnyEars = '<svg viewBox="0 0 80 55"><ellipse cx="22" cy="22" rx="9" ry="24" fill="#F8BBD0" transform="rotate(-12 22 22)"/><ellipse cx="22" cy="22" rx="5" ry="18" fill="#FFE4EC" transform="rotate(-12 22 22)"/><ellipse cx="58" cy="22" rx="9" ry="24" fill="#F8BBD0" transform="rotate(12 58 22)"/><ellipse cx="58" cy="22" rx="5" ry="18" fill="#FFE4EC" transform="rotate(12 58 22)"/></svg>';
    SVG.sunglasses = '<svg viewBox="0 0 80 32"><rect x="5" y="8" width="28" height="20" rx="4" fill="#1a1a1a" stroke="#d4af37" stroke-width="1.5"/><rect x="47" y="8" width="28" height="20" rx="4" fill="#1a1a1a" stroke="#d4af37" stroke-width="1.5"/><path d="M33 15c3-3 8-3 14 0" stroke="#d4af37" stroke-width="1.5" fill="none"/><line x1="5" y1="15" x2="0" y2="13" stroke="#d4af37" stroke-width="1.5"/><line x1="75" y1="15" x2="80" y2="13" stroke="#d4af37" stroke-width="1.5"/></svg>';
    SVG.topHat = '<svg viewBox="0 0 80 75"><rect x="18" y="10" width="44" height="45" rx="3" fill="#111"/><ellipse cx="40" cy="12" rx="22" ry="5" fill="#1a1a1a"/><ellipse cx="40" cy="55" rx="36" ry="8" fill="#111"/><rect x="18" y="40" width="44" height="5" fill="#d4af37"/><rect x="32" y="38" width="16" height="9" rx="2" fill="#B8860B"/></svg>';
    // Corners
    SVG.holly = '<svg viewBox="0 0 160 160"><path d="M5 12Q15 2,30 5Q40-2,50 8Q58 2,55 16Q44 24,34 18Q24 26,18 16Q8 20,5 12Z" fill="#1a472a" opacity=".85"/><path d="M30 28Q42 18,56 25Q66 16,72 28Q78 22,74 36Q64 44,54 38Q44 46,38 36Q28 40,30 28Z" fill="#1a472a" opacity=".75"/><circle cx="38" cy="14" r="5" fill="#C62828"/><circle cx="32" cy="10" r="4" fill="#D32F2F"/><circle cx="36" cy="20" r="4.5" fill="#B71C1C"/><circle cx="60" cy="36" r="4" fill="#C62828"/><circle cx="55" cy="32" r="3.5" fill="#D32F2F"/></svg>';
    SVG.cobweb = '<svg viewBox="0 0 200 200"><g stroke="rgba(255,255,255,.15)" fill="none"><line x1="0" y1="0" x2="200" y2="0" stroke-width="1"/><line x1="0" y1="0" x2="0" y2="200" stroke-width="1"/><line x1="0" y1="0" x2="190" y2="190" stroke-width=".8"/><line x1="0" y1="0" x2="95" y2="200" stroke-width=".6"/><line x1="0" y1="0" x2="200" y2="95" stroke-width=".6"/><path d="M25 0Q25 25,0 25" stroke-width=".7"/><path d="M55 0Q55 55,0 55" stroke-width=".6"/><path d="M90 0Q90 90,0 90" stroke-width=".5"/><path d="M130 0Q130 130,0 130" stroke-width=".4"/><path d="M175 0Q175 175,0 175" stroke-width=".4"/></g><circle cx="100" cy="3" r="2.5" fill="rgba(255,255,255,.2)"/><circle cx="97" cy="5" r="1.2" fill="rgba(255,255,255,.15)"/><circle cx="103" cy="5" r="1.2" fill="rgba(255,255,255,.15)"/></svg>';
    SVG.heartCluster = '<svg viewBox="0 0 100 100"><path d="M50 45c-3-6-12-8-15-3s1 10 15 20c14-10 18-15 15-20s-12-3-15 3z" fill="#E91E63" opacity=".7"/><path d="M75 25c-2-4-8-5-10-2s1 7 10 13c9-6 12-10 10-13s-8-2-10 2z" fill="#F48FB1" opacity=".5"/><path d="M30 65c-1.5-3-6-4-8-1.5s.5 5 8 10c7.5-5 9-7.5 8-10s-6.5-1.5-8 1.5z" fill="#EC407A" opacity=".4"/></svg>';
    SVG.crescentStar = '<svg viewBox="0 0 100 100"><path d="M60 10a35 35 0 11-25 60A30 30 0 0060 10z" fill="#FDD835" opacity=".8"/><polygon points="75,25 77.5,32 85,32 79,37 81,44 75,39.5 69,44 71,37 65,32 72.5,32" fill="#FDD835" opacity=".9"/></svg>';
    SVG.firework = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="4" fill="#FFD700"/><g stroke="#FFD700" stroke-width="1.5" stroke-linecap="round" opacity=".8"><line x1="50" y1="10" x2="50" y2="25"/><line x1="50" y1="75" x2="50" y2="90"/><line x1="10" y1="50" x2="25" y2="50"/><line x1="75" y1="50" x2="90" y2="50"/><line x1="22" y1="22" x2="33" y2="33"/><line x1="67" y1="67" x2="78" y2="78"/><line x1="78" y1="22" x2="67" y2="33"/><line x1="33" y1="67" x2="22" y2="78"/></g><g fill="#FFD700" opacity=".4"><circle cx="50" cy="15" r="2"/><circle cx="85" cy="50" r="2"/><circle cx="50" cy="85" r="2"/><circle cx="15" cy="50" r="2"/></g></svg>';
    SVG.palmTree = '<svg viewBox="0 0 60 120"><path d="M28 120V55" stroke="#5D4037" stroke-width="4" fill="none"/><path d="M30 55C20 48 5 50 2 56c8-3 18-1 28 2" fill="#2E7D32" opacity=".7"/><path d="M30 55C25 45 12 35 5 38c8 2 16 10 25 20" fill="#388E3C" opacity=".6"/><path d="M30 55C40 48 55 50 58 56c-8-3-18-1-28 2" fill="#2E7D32" opacity=".7"/><path d="M30 55C35 45 48 35 55 38c-8 2-16 10-25 20" fill="#388E3C" opacity=".6"/><path d="M30 55C30 42 31 30 30 22c-1 8 0 18 0 33" fill="#1B5E20" opacity=".8"/></svg>';
    SVG.easterEggs = '<svg viewBox="0 0 130 90"><ellipse cx="30" cy="50" rx="15" ry="22" fill="#F48FB1" opacity=".7"/><path d="M15 45h30" stroke="#fff" stroke-width="2.5" opacity=".4"/><path d="M15 55h30" stroke="#FFF59D" stroke-width="2" opacity=".4"/><ellipse cx="68" cy="55" rx="13" ry="19" fill="#90CAF9" opacity=".7"/><path d="M55 50h26" stroke="#fff" stroke-width="2" opacity=".4"/><circle cx="68" cy="44" r="2.5" fill="#fff" opacity=".3"/><circle cx="68" cy="60" r="2.5" fill="#fff" opacity=".3"/><ellipse cx="103" cy="52" rx="12" ry="17" fill="#FFF59D" opacity=".65"/><path d="M91 48h24" stroke="#81C784" stroke-width="2.5" opacity=".5"/><path d="M91 56h24" stroke="#CE93D8" stroke-width="2" opacity=".4"/></svg>';
    SVG.geometricCorner = '<svg viewBox="0 0 120 120"><g stroke="currentColor" stroke-width="1" fill="none" opacity=".5"><polygon points="10,10 30,10 20,27"/><polygon points="30,10 50,10 40,27"/><polygon points="20,27 40,27 30,44"/><polygon points="10,10 20,27 0,27"/><polygon points="50,10 60,27 40,27"/></g></svg>';
    SVG.lightningBolt = '<svg viewBox="0 0 50 100"><path d="M30 0L10 45h15L15 100 45 40H28z" fill="#FF1744" opacity=".7"/></svg>';
    // Bottom silhouettes
    SVG.graveyard = '<svg viewBox="0 0 800 55" preserveAspectRatio="none"><path d="M0 55V48h40V28c0-8 7-14 14-14s14 6 14 14v20h60V32c0-6 5-11 11-11s11 5 11 11v16h80V35c0-10 8-18 18-18s18 8 18 18v13h60V30c0-8 7-14 14-14s14 6 14 14v18h55V40h10V22c0-5 4-9 9-9s9 4 9 9v18h10v8h70V42c0-7 6-13 13-13s13 6 13 13v6h55V32c0-10 8-18 18-18s18 8 18 18v16h50V55z" fill="rgba(20,0,35,.5)"/></svg>';
    SVG.waves = '<svg viewBox="0 0 800 40" preserveAspectRatio="none"><path d="M0 40V25c30-10 60-10 90 0s60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 60 10 90 0 55-10 80 0V40z" fill="rgba(2,136,209,.12)"/><path d="M0 40V32c25-7 50-7 75 0s50 7 75 0 50-7 75 0 50 7 75 0 50-7 75 0 50 7 75 0 50-7 75 0 50 7 75 0 50-7 80 0V40z" fill="rgba(2,136,209,.07)"/></svg>';
    SVG.grass = '<svg viewBox="0 0 800 30" preserveAspectRatio="none"><path d="M0 30V22l5-8 5 8 8-12 6 12 4-6 5 6 7-10 6 10 5-7 4 7 8-14 5 14 6-9 5 9 4-5 5 5 7-11 6 11 5-8 4 8 8-13 5 13 6-7 5 7 4-10 5 10 7-12 6 12 5-6 4 6 8-9 5 9 6-11 5 11 4-8 5 8 7-10 6 10 5-7 4 7 8-12 5 12 6-8 5 8 4-6 5 6 7-9 6 9 5-10 5 10 7-12 6 12 5-6 4 6 8-14 5 14 6-9 5 9 4-5 5 5 7-11 6 11 5-8 4 8 8-13 5 13 6-7 5 7V30z" fill="rgba(129,199,132,.15)"/></svg>';
    SVG.mosque = '<svg viewBox="0 0 800 50" preserveAspectRatio="none"><path d="M0 50V42h100V28c20-20 40-20 60 0v14h80V22c15-18 35-18 50 0v20h120V30c10-15 30-15 40 0v12h80V18c25-22 45-22 70 0v24h100V50z" fill="rgba(26,35,70,.4)"/><rect x="175" y="6" width="4" height="22" fill="rgba(184,134,11,.3)"/><circle cx="177" cy="5" r="3" fill="rgba(184,134,11,.3)"/><rect x="415" y="4" width="4" height="18" fill="rgba(184,134,11,.3)"/><circle cx="417" cy="3" r="3" fill="rgba(184,134,11,.3)"/></svg>';

    // Banner icons
    var BI = {
        christmas: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3L2 9.2h7.6z" fill="#FFD700"/></svg>',
        valentines: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21C5.5 15.5 3 12 3 8.5 3 5.4 5.4 3 8 3c1.6 0 3 .8 4 2.1C13 3.8 14.4 3 16 3c2.6 0 5 2.4 5 5.5 0 3.5-2.5 7-9 12.5z" fill="#E91E63"/></svg>',
        winter: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#64B5F6" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/></svg>',
        halloween: '<svg viewBox="0 0 24 24" width="22" height="22"><ellipse cx="12" cy="14" rx="9" ry="8" fill="#FF6F00"/><rect x="11" y="4" width="2" height="5" rx="1" fill="#2E7D32"/><circle cx="9" cy="13" r="1.3" fill="#1a0800"/><circle cx="15" cy="13" r="1.3" fill="#1a0800"/><path d="M9 17c2 1.5 4 1.5 6 0" stroke="#1a0800" stroke-width="1" fill="none"/></svg>',
        easter: '<svg viewBox="0 0 24 24" width="22" height="22"><ellipse cx="12" cy="13" rx="7" ry="9" fill="#81C784" opacity=".85"/><path d="M5.5 11h13" stroke="#F48FB1" stroke-width="2.5"/><path d="M6 16h12" stroke="#FFF59D" stroke-width="2"/></svg>',
        summer: '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="4.5" fill="#FFB300"/><g stroke="#FFB300" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2.5" x2="12" y2="5.5"/><line x1="12" y1="18.5" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5.5" y2="12"/><line x1="18.5" y1="12" x2="21.5" y2="12"/></g></svg>',
        eid: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M14 3a8 8 0 11-6 14.5A7 7 0 0014 3z" fill="#FDD835"/><path d="M17 8l.8 2.5h2.6l-2.1 1.5.8 2.5-2.1-1.5-2.1 1.5.8-2.5-2.1-1.5h2.6z" fill="#FDD835"/></svg>',
        ramadan: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#B8860B" stroke-width="1.3"><path d="M8 5h8l-1 3H9z"/><rect x="9" y="8" width="6" height="2.5" rx=".5"/><path d="M7.5 10.5h9L18 20H6z"/><line x1="12" y1="5" x2="12" y2="3"/><ellipse cx="12" cy="2.5" rx="1" ry=".8" fill="#FFD54F" stroke="none"/></svg>',
        'black-friday': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FF1744" stroke-width="1.8"><path d="M20.6 8.6l-7.2 7.2a2 2 0 01-2.8 0L3 8.2V3h5.2l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5" fill="#FF1744" stroke="none"/></svg>',
        'new-year': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="2.5" fill="#FFD700" stroke="none"/></svg>'
    };
    BI.blackfriday = BI['black-friday']; BI.newyear = BI['new-year'];

    /* ═══ THEME CONFIGS ═══ */
    var THEMES = {
        christmas: {
            particleType: 'snow', particleCount: isMobile ? 12 : 22,
            bokeh: [
                { color: 'rgba(200,60,60,.06)', size: 180, x: 15, y: 20, blur: 60 },
                { color: 'rgba(46,125,50,.05)', size: 150, x: 75, y: 35, blur: 55 },
                { color: 'rgba(212,175,55,.06)', size: 190, x: 50, y: 65, blur: 70 }
            ],
            glow: { border: '2.5px solid rgba(200,60,60,.6)', shadowMin: '0 0 20px rgba(200,60,60,.3),0 0 40px rgba(46,125,50,.15),inset 0 0 12px rgba(200,60,60,.06)', shadowMax: '0 0 35px rgba(200,60,60,.5),0 0 65px rgba(46,125,50,.25),inset 0 0 20px rgba(200,60,60,.12)', nav: '0 0 10px rgba(200,60,60,.15),0 0 20px rgba(46,125,50,.08)' },
            banner: { bg: 'linear-gradient(135deg,#0d1f12,#1f0d0d)', accent: '#C62828', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(198,40,40,.12)', iconBg: 'rgba(198,40,40,.12)', title: 'MERRY CHRISTMAS', titleColor: '#FFD700', sub: 'Wishing you joy & style this festive season', timer: '#C62828' },
            topBorder: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 8px,transparent 8px,transparent 14px,#1B5E20 14px,#1B5E20 22px,transparent 22px,transparent 28px)',
            navLine: 'linear-gradient(90deg,transparent,#C62828,#d4af37,#1B5E20,transparent)',
            corners: [{ svg: 'holly', pos: 'tl', w: isMobile ? 100 : 160, h: isMobile ? 100 : 160 }],
            heroAccessory: 'santaHat', lights: true
        },
        valentines: {
            particleType: 'hearts', particleCount: isMobile ? 8 : 16,
            bokeh: [
                { color: 'rgba(233,30,99,.06)', size: 190, x: 25, y: 25, blur: 65 },
                { color: 'rgba(244,143,177,.05)', size: 150, x: 70, y: 45, blur: 50 },
                { color: 'rgba(233,30,99,.04)', size: 140, x: 50, y: 75, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(233,30,99,.55)', shadowMin: '0 0 20px rgba(233,30,99,.25),0 0 40px rgba(233,30,99,.1),inset 0 0 12px rgba(233,30,99,.05)', shadowMax: '0 0 35px rgba(233,30,99,.45),0 0 65px rgba(233,30,99,.2),inset 0 0 20px rgba(233,30,99,.1)', nav: '0 0 10px rgba(233,30,99,.15)' },
            banner: { bg: 'linear-gradient(135deg,#2a0815,#1f0d18)', accent: '#E91E63', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(233,30,99,.1)', iconBg: 'rgba(233,30,99,.12)', title: "HAPPY VALENTINE'S", titleColor: '#F48FB1', sub: 'Look sharp for your special someone!', timer: '#E91E63' },
            topBorder: 'linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#F48FB1,#E91E63,#F48FB1,transparent)',
            corners: [{ svg: 'heartCluster', pos: 'tr', w: isMobile ? 70 : 110, h: isMobile ? 70 : 110, flip: true }]
        },
        winter: {
            particleType: 'snow', particleCount: isMobile ? 14 : 25,
            bokeh: [
                { color: 'rgba(100,180,246,.05)', size: 180, x: 20, y: 20, blur: 60 },
                { color: 'rgba(79,195,247,.04)', size: 160, x: 70, y: 40, blur: 55 },
                { color: 'rgba(225,245,254,.05)', size: 200, x: 45, y: 70, blur: 70 }
            ],
            glow: { border: '2.5px solid rgba(100,180,246,.6)', shadowMin: '0 0 20px rgba(100,180,246,.3),0 0 40px rgba(79,195,247,.15),inset 0 0 12px rgba(100,180,246,.06)', shadowMax: '0 0 35px rgba(100,180,246,.5),0 0 65px rgba(79,195,247,.25),inset 0 0 20px rgba(100,180,246,.12)', nav: '0 0 10px rgba(100,180,246,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0a1628,#0d2137)', accent: '#64B5F6', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(100,181,246,.1)', iconBg: 'rgba(100,181,246,.12)', title: 'WINTER WARMTH', titleColor: '#E1F5FE', sub: 'Warm up with a fresh new look', timer: '#64B5F6' },
            topBorder: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,.5),rgba(225,245,254,.8),rgba(79,195,247,.5),rgba(79,195,247,0))', topBorderShimmer: true,
            navLine: 'linear-gradient(90deg,transparent,rgba(79,195,247,.4),rgba(225,245,254,.7),rgba(79,195,247,.4),transparent)',
            frost: true, hanging: 'icicles'
        },
        halloween: {
            particleType: 'embers', particleCount: isMobile ? 8 : 15,
            bokeh: [
                { color: 'rgba(255,111,0,.06)', size: 180, x: 20, y: 25, blur: 60 },
                { color: 'rgba(106,27,154,.05)', size: 160, x: 75, y: 40, blur: 55 },
                { color: 'rgba(255,111,0,.04)', size: 150, x: 50, y: 75, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(255,111,0,.65)', shadowMin: '0 0 20px rgba(255,111,0,.3),0 0 40px rgba(106,27,154,.18),inset 0 0 12px rgba(255,111,0,.06)', shadowMax: '0 0 35px rgba(255,111,0,.5),0 0 65px rgba(106,27,154,.3),inset 0 0 20px rgba(255,111,0,.12)', nav: '0 0 10px rgba(255,111,0,.18)' },
            banner: { bg: 'linear-gradient(135deg,#1a0a2e,#2e1500)', accent: '#FF6F00', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(255,111,0,.12)', iconBg: 'rgba(255,111,0,.12)', title: 'HAPPY HALLOWEEN', titleColor: '#FFE0B2', sub: 'Get a killer look this spooky season', timer: '#FF6F00' },
            topBorder: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)', topBorderGlow: 'rgba(255,111,0,.3)',
            navLine: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C,#FF6F00,#4A148C)',
            corners: [
                { svg: 'cobweb', pos: 'tl', w: isMobile ? 120 : 200, h: isMobile ? 120 : 200 },
                { svg: 'cobweb', pos: 'tr', w: isMobile ? 80 : 130, h: isMobile ? 80 : 130, flip: true }
            ],
            bottom: 'graveyard', heroAccessory: 'witchHat', fog: true,
            vignette: 'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.35) 100%)'
        },
        easter: {
            particleType: 'petals', particleCount: isMobile ? 8 : 16,
            bokeh: [
                { color: 'rgba(129,199,132,.05)', size: 170, x: 20, y: 30, blur: 55 },
                { color: 'rgba(244,143,177,.05)', size: 150, x: 75, y: 35, blur: 50 },
                { color: 'rgba(255,245,157,.04)', size: 140, x: 45, y: 75, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(129,199,132,.55)', shadowMin: '0 0 20px rgba(129,199,132,.25),0 0 40px rgba(244,143,177,.12),inset 0 0 12px rgba(129,199,132,.05)', shadowMax: '0 0 35px rgba(129,199,132,.45),0 0 65px rgba(244,143,177,.2),inset 0 0 20px rgba(129,199,132,.1)', nav: '0 0 10px rgba(129,199,132,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0f1f0f,#1a0f1a)', accent: '#81C784', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(129,199,132,.1)', iconBg: 'rgba(129,199,132,.12)', title: 'HAPPY EASTER', titleColor: '#C8E6C9', sub: 'Spring into a fresh new look!', timer: '#81C784' },
            topBorder: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px)',
            navLine: 'linear-gradient(90deg,#F48FB1,#81C784,#FFF59D,#81C784,#F48FB1)',
            corners: [{ svg: 'easterEggs', pos: 'bl', w: isMobile ? 85 : 130, h: isMobile ? 60 : 90 }],
            bottom: 'grass', heroAccessory: 'bunnyEars'
        },
        summer: {
            particleType: 'sparkle', particleCount: isMobile ? 8 : 15,
            bokeh: [
                { color: 'rgba(255,200,100,.07)', size: 200, x: 80, y: 10, blur: 75 },
                { color: 'rgba(2,136,209,.04)', size: 160, x: 20, y: 60, blur: 55 },
                { color: 'rgba(255,143,0,.05)', size: 170, x: 50, y: 40, blur: 60 }
            ],
            glow: { border: '2.5px solid rgba(255,143,0,.55)', shadowMin: '0 0 20px rgba(255,143,0,.25),0 0 40px rgba(2,136,209,.12),inset 0 0 12px rgba(255,143,0,.05)', shadowMax: '0 0 35px rgba(255,143,0,.45),0 0 65px rgba(2,136,209,.2),inset 0 0 20px rgba(255,143,0,.1)', nav: '0 0 10px rgba(255,143,0,.15)' },
            banner: { bg: 'linear-gradient(135deg,#1f1200,#001520)', accent: '#FF8F00', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(255,143,0,.1)', iconBg: 'rgba(255,143,0,.12)', title: 'SUMMER VIBES', titleColor: '#FFF3E0', sub: 'Stay fresh all summer long!', timer: '#FF8F00' },
            topBorder: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1,#FF8F00)',
            corners: [{ svg: 'palmTree', pos: 'bl', w: isMobile ? 40 : 60, h: isMobile ? 80 : 120 }],
            bottom: 'waves', heroAccessory: 'sunglasses'
        },
        eid: {
            particleType: 'stars', particleCount: isMobile ? 8 : 16,
            bokeh: [
                { color: 'rgba(253,216,53,.06)', size: 190, x: 30, y: 20, blur: 65 },
                { color: 'rgba(46,125,50,.04)', size: 150, x: 70, y: 50, blur: 50 },
                { color: 'rgba(253,216,53,.05)', size: 170, x: 50, y: 80, blur: 60 }
            ],
            glow: { border: '2.5px solid rgba(253,216,53,.7)', shadowMin: '0 0 20px rgba(253,216,53,.3),0 0 40px rgba(46,125,50,.12),inset 0 0 12px rgba(253,216,53,.06)', shadowMax: '0 0 35px rgba(253,216,53,.5),0 0 65px rgba(46,125,50,.2),inset 0 0 20px rgba(253,216,53,.12)', nav: '0 0 10px rgba(253,216,53,.18)' },
            banner: { bg: 'linear-gradient(135deg,#0f1f0a,#1a1a05)', accent: '#FDD835', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(253,216,53,.1)', iconBg: 'rgba(253,216,53,.12)', title: 'EID MUBARAK', titleColor: '#FFF9C4', sub: 'Celebrate in style with a fresh look!', timer: '#FDD835' },
            topBorder: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)',
            navLine: 'linear-gradient(90deg,transparent,#2E7D32,#FDD835,#2E7D32,transparent)',
            corners: [
                { svg: 'crescentStar', pos: 'tr', w: isMobile ? 65 : 100, h: isMobile ? 65 : 100 },
                { svg: 'geometricCorner', pos: 'tl', w: isMobile ? 70 : 110, h: isMobile ? 70 : 110, color: '#FDD835' }
            ],
            bottom: 'mosque', hanging: 'lanterns', sparkleField: true
        },
        ramadan: {
            particleType: 'stars', particleCount: isMobile ? 8 : 15,
            bokeh: [
                { color: 'rgba(184,134,11,.06)', size: 190, x: 25, y: 20, blur: 65 },
                { color: 'rgba(26,35,126,.05)', size: 170, x: 70, y: 45, blur: 55 },
                { color: 'rgba(184,134,11,.04)', size: 150, x: 45, y: 80, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(184,134,11,.7)', shadowMin: '0 0 20px rgba(184,134,11,.3),0 0 40px rgba(26,35,126,.15),inset 0 0 12px rgba(184,134,11,.06)', shadowMax: '0 0 35px rgba(184,134,11,.5),0 0 65px rgba(26,35,126,.25),inset 0 0 20px rgba(184,134,11,.12)', nav: '0 0 10px rgba(184,134,11,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0a0a2e,#1a1025)', accent: '#B8860B', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(184,134,11,.1)', iconBg: 'rgba(184,134,11,.12)', title: 'RAMADAN KAREEM', titleColor: '#E8EAF6', sub: 'Wishing you a blessed & beautiful month', timer: '#B8860B' },
            topBorder: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,.5),#B8860B,rgba(184,134,11,0))', topBorderShimmer: true,
            navLine: 'linear-gradient(90deg,transparent,#1A237E,#B8860B,#1A237E,transparent)',
            corners: [
                { svg: 'crescentStar', pos: 'tr', w: isMobile ? 60 : 90, h: isMobile ? 60 : 90 },
                { svg: 'geometricCorner', pos: 'tl', w: isMobile ? 65 : 100, h: isMobile ? 65 : 100, color: '#B8860B' }
            ],
            bottom: 'mosque', hanging: 'lanterns', sparkleField: true
        },
        'black-friday': {
            particleType: 'tags', particleCount: isMobile ? 6 : 12,
            bokeh: [
                { color: 'rgba(255,23,68,.06)', size: 200, x: 30, y: 25, blur: 70 },
                { color: 'rgba(255,214,0,.05)', size: 170, x: 70, y: 45, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,23,68,.65)', shadowMin: '0 0 20px rgba(255,23,68,.3),0 0 40px rgba(255,214,0,.1),inset 0 0 12px rgba(255,23,68,.06)', shadowMax: '0 0 35px rgba(255,23,68,.55),0 0 65px rgba(255,214,0,.18),inset 0 0 20px rgba(255,23,68,.12)', nav: '0 0 10px rgba(255,23,68,.18)' },
            banner: { bg: '#000', accent: '#FF1744', shadow: '0 12px 40px rgba(0,0,0,.6),0 0 25px rgba(255,23,68,.2)', iconBg: 'rgba(255,23,68,.15)', title: 'BLACK FRIDAY', titleColor: '#fff', sub: 'Biggest deals of the year!', timer: '#FF1744' },
            topBorder: '#FF1744', topBorderNeon: '#FF1744',
            navLine: 'linear-gradient(90deg,#FF1744,#FFD600,#FF1744,#FFD600,#FF1744)',
            corners: [{ svg: 'lightningBolt', pos: 'tr', w: isMobile ? 30 : 50, h: isMobile ? 60 : 100 }],
            neonFlash: true
        },
        'new-year': {
            particleType: 'confetti', particleCount: isMobile ? 12 : 25,
            bokeh: [
                { color: 'rgba(255,215,0,.07)', size: 210, x: 40, y: 20, blur: 70 },
                { color: 'rgba(13,71,161,.05)', size: 170, x: 75, y: 50, blur: 55 },
                { color: 'rgba(255,215,0,.04)', size: 150, x: 20, y: 75, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,215,0,.75)', shadowMin: '0 0 20px rgba(255,215,0,.3),0 0 40px rgba(13,71,161,.12),inset 0 0 12px rgba(255,215,0,.06)', shadowMax: '0 0 35px rgba(255,215,0,.55),0 0 65px rgba(13,71,161,.22),inset 0 0 20px rgba(255,215,0,.12)', nav: '0 0 12px rgba(255,215,0,.2)' },
            banner: { bg: 'linear-gradient(135deg,#0a0a2e,#0d1535)', accent: '#FFD700', shadow: '0 12px 40px rgba(0,0,0,.5),0 0 20px rgba(255,215,0,.12)', iconBg: 'rgba(255,215,0,.12)', title: 'HAPPY NEW YEAR', titleColor: '#FFD700', sub: 'New year, fresh look \u2013 Start the year right!', timer: '#FFD700' },
            topBorder: 'linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#0D47A1,#FFD700,#0D47A1,transparent)',
            corners: [
                { svg: 'firework', pos: 'tl', w: isMobile ? 60 : 100, h: isMobile ? 60 : 100 },
                { svg: 'firework', pos: 'tr', w: isMobile ? 45 : 75, h: isMobile ? 45 : 75 }
            ],
            heroAccessory: 'topHat'
        }
    };
    THEMES.blackfriday = THEMES['black-friday'];
    THEMES.newyear = THEMES['new-year'];

    /* ═══ CSS ═══ */
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            '.gb-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1}',
            '.gb-bokeh{position:fixed;border-radius:50%;pointer-events:none;z-index:0;animation:gb-bfloat 30s ease-in-out infinite}',
            '@keyframes gb-bfloat{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(15px,-20px) scale(1.05)}50%{transform:translate(-10px,15px) scale(.95)}75%{transform:translate(20px,10px) scale(1.03)}}',
            /* Banner */
            '.gb-banner{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(100px);z-index:10001;font-family:"Outfit",sans-serif;border-radius:14px;overflow:hidden;max-width:400px;width:calc(100% - 36px);pointer-events:auto;opacity:0;animation:gb-bin .6s cubic-bezier(.34,1.56,.64,1) .8s forwards}',
            '.gb-banner-body{display:flex;align-items:center;gap:12px;padding:14px 42px 14px 14px}',
            '.gb-banner-icon{flex-shrink:0;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center}',
            '.gb-banner-title{font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase}',
            '.gb-banner-sub{font-size:12px;font-weight:400;margin-top:2px;color:rgba(255,255,255,.65)}',
            '.gb-banner-x{position:absolute;right:8px;top:50%;transform:translateY(-60%);background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.5);width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .2s}',
            '.gb-banner-x:hover{background:rgba(255,255,255,.15)}',
            '.gb-banner-bar{height:2px;background:rgba(255,255,255,.08)}',
            '.gb-banner-bar-fill{height:100%;width:100%;transform-origin:left;animation:gb-barfill 8s linear forwards}',
            '@keyframes gb-bin{to{opacity:1;transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-bout{to{opacity:0;transform:translateX(-50%) translateY(100px)}}',
            '@keyframes gb-barfill{to{transform:scaleX(0)}}',
            /* Decorations */
            '.gb-decor{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 2s ease .6s forwards}',
            '.gb-decor svg{width:100%;height:100%;display:block}',
            '.gb-bottom{position:fixed;bottom:0;left:0;width:100%;pointer-events:none;z-index:1;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-bottom svg{width:100%;height:100%;display:block}',
            /* Hanging elements */
            '.gb-hanging{position:fixed;top:70px;left:0;width:100%;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            /* Frost */
            '.gb-frost{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-frost-tl{top:0;left:0;width:220px;height:220px;background:radial-gradient(ellipse at 0% 0%,rgba(200,230,255,.1) 0%,transparent 70%)}',
            '.gb-frost-tr{top:0;right:0;width:220px;height:220px;background:radial-gradient(ellipse at 100% 0%,rgba(200,230,255,.1) 0%,transparent 70%)}',
            /* Fog */
            '.gb-fog{position:fixed;bottom:0;left:0;width:200%;height:35vh;pointer-events:none;z-index:1;opacity:0}',
            '.gb-fog-a{background:linear-gradient(to top,rgba(255,255,255,.07) 0%,transparent 100%);animation:gb-fin 3s ease 1s forwards,gb-fogd 28s linear infinite}',
            '.gb-fog-b{background:linear-gradient(to top,rgba(255,255,255,.05) 0%,transparent 100%);animation:gb-fin 3s ease 1.5s forwards,gb-fogd 42s linear infinite reverse}',
            '@keyframes gb-fogd{to{transform:translateX(-50%)}}',
            /* Vignette */
            '.gb-vignette{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-fin 2.5s ease .5s forwards}',
            /* Sparkle field */
            '.gb-sparkle{position:fixed;pointer-events:none;z-index:1;border-radius:50%;animation:gb-twinkle var(--sd) ease-in-out infinite}',
            '@keyframes gb-twinkle{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:var(--op);transform:scale(1)}}',
            /* Neon flash */
            '.gb-nflash{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-nf 4s ease-in-out infinite}',
            '@keyframes gb-nf{0%,100%{opacity:0}20%{opacity:.07}35%{opacity:0}55%{opacity:.05}70%{opacity:0}85%{opacity:.09}95%{opacity:0}}',
            /* Hat */
            '.gb-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));animation:gb-hatdrop .8s cubic-bezier(.34,1.56,.64,1) .5s both}',
            '@keyframes gb-hatdrop{0%{transform:rotate(var(--hr)) translateY(-12px) scale(.8);opacity:0}100%{transform:rotate(var(--hr)) translateY(0) scale(1);opacity:1}}',
            /* Lights */
            '.gb-lights{position:fixed;top:70px;left:0;width:100%;height:75px;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            /* Top border */
            '.gb-bdr{position:fixed;top:0;left:0;width:100%;z-index:9998;pointer-events:none}',
            '@keyframes gb-shift{0%{background-position:0 0}100%{background-position:200% 0}}',
            '@keyframes gb-shimr{0%,100%{opacity:.5}50%{opacity:1}}',
            '@keyframes gb-nbar{0%,100%{box-shadow:0 0 6px var(--nc),0 0 14px var(--nc)}50%{box-shadow:0 0 3px var(--nc),0 0 6px var(--nc);opacity:.7}}',
            /* Nav line */
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-fin 1s ease .8s forwards}',
            /* Shared */
            '@keyframes gb-fin{to{opacity:1}}',
            /* Responsive */
            '@media(max-width:600px){.gb-banner{bottom:20px;max-width:calc(100% - 24px)}.gb-banner-body{padding:12px 38px 12px 12px}.gb-lights{display:none}.gb-hanging{display:none}.gb-frost-tl,.gb-frost-tr{width:140px;height:140px}}',
            '@media(prefers-reduced-motion:reduce){.gb-canvas,.gb-bokeh,.gb-fog,.gb-sparkle,.gb-nflash{animation:none!important}}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    /* ═══ CANVAS PARTICLES ═══ */
    function initCanvas() {
        state.canvas = document.createElement('canvas');
        state.canvas.className = 'gb-canvas';
        state.canvas.width = W; state.canvas.height = H;
        document.body.appendChild(state.canvas);
        state.ctx = state.canvas.getContext('2d');
    }
    function spawnParticles(theme) {
        state.particles = [];
        var type = theme.particleType, count = theme.particleCount || 18, colors;
        if (type === 'hearts') colors = ['#E91E63', '#F48FB1', '#EC407A', '#AD1457'];
        else if (type === 'embers') colors = ['#FF6F00', '#FF8F00', '#FFB300', '#E65100'];
        else if (type === 'petals') colors = ['#F48FB1', '#CE93D8', '#90CAF9', '#81C784', '#FFF59D'];
        else if (type === 'stars') colors = ['#FDD835', '#FFF9C4', '#FFD54F', '#B8860B'];
        else if (type === 'tags') colors = ['#FF1744', '#FFD600', '#FF1744', '#FFD600'];
        else if (type === 'confetti') colors = ['#FFD700', '#C0C0C0', '#E91E63', '#0D47A1', '#fff', '#4CAF50'];
        else if (type === 'sparkle') colors = ['#FFD54F', '#FF8F00', '#FFF9C4', '#0288D1'];
        for (var i = 0; i < count; i++) {
            var layer = i < count * .4 ? 0 : i < count * .75 ? 1 : 2;
            var sm = layer === 0 ? .5 : layer === 1 ? 1 : 1.8;
            var spm = layer === 0 ? .3 : layer === 1 ? .6 : 1;
            var om = layer === 0 ? .35 : layer === 1 ? .6 : 1;
            var bs = type === 'snow' ? rand(2, 6) : type === 'hearts' ? rand(8, 18) : type === 'embers' ? rand(1, 3.5) : type === 'petals' ? rand(3, 7) : type === 'stars' ? rand(3, 8) : type === 'tags' ? rand(8, 16) : type === 'confetti' ? rand(3, 8) : rand(2, 5);
            state.particles.push({
                x: rand(0, W), y: rand(-H * .2, H), baseSize: bs, size: bs * sm,
                speed: (type === 'embers' ? rand(.3, .8) : type === 'confetti' ? rand(.8, 2.5) : rand(.4, 1.2)) * spm,
                drift: rand(-.3, .3), wobbleAmp: rand(15, 40), wobbleSpeed: rand(.005, .02), wobbleOff: rand(0, Math.PI * 2),
                opacity: rand(.2, .7) * om, layer: layer, sizeMult: sm,
                color: colors ? colors[Math.floor(rand(0, colors.length))] : '#fff',
                rotation: rand(0, Math.PI * 2), rotSpeed: rand(-.01, .01), type: type
            });
        }
    }
    function animateParticles() {
        if (!state.ctx || !state.canvas) return;
        var c = state.ctx; c.clearRect(0, 0, W, H); c.shadowBlur = 0;
        for (var i = 0; i < state.particles.length; i++) {
            var p = state.particles[i];
            if (p.type === 'embers' || p.type === 'hearts') { p.y -= p.speed; if (p.y < -p.size * 2) { p.y = H + p.size * 2; p.x = rand(0, W); } }
            else { p.y += p.speed; if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); } }
            p.x += p.drift + Math.sin(p.y * p.wobbleSpeed + p.wobbleOff) * .4;
            if (p.x < -30) p.x = W + 30; if (p.x > W + 30) p.x = -30;
            p.rotation += p.rotSpeed; c.globalAlpha = p.opacity;
            if (p.type === 'snow') snowflake(p.x, p.y, p.size);
            else if (p.type === 'hearts') heart(p.x, p.y, p.size, p.color);
            else if (p.type === 'embers') ember(p.x, p.y, p.size, p.color);
            else if (p.type === 'stars') star5(p.x, p.y, p.size, p.color);
            else if (p.type === 'tags') tag(p.x, p.y, p.size, p.color);
            else if (p.type === 'confetti') { c.save(); c.translate(p.x, p.y); c.rotate(p.rotation); c.fillStyle = p.color; c.fillRect(-p.size / 2, -1, p.size, 2.5); c.restore(); }
            else if (p.type === 'petals') { c.save(); c.translate(p.x, p.y); c.rotate(p.rotation); c.fillStyle = p.color; c.beginPath(); c.ellipse(0, 0, p.size * .5, p.size, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
            else if (p.type === 'sparkle') { c.save(); c.translate(p.x, p.y); var pulse = .5 + .5 * Math.sin(Date.now() * .002 + p.wobbleOff); c.globalAlpha = p.opacity * pulse; c.fillStyle = p.color; c.shadowBlur = p.size * 3; c.shadowColor = p.color; c.beginPath(); c.arc(0, 0, p.size * pulse, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0; c.restore(); }
        }
        c.globalAlpha = 1; c.shadowBlur = 0;
        state.raf = requestAnimationFrame(animateParticles);
    }

    /* ═══ BOKEH ═══ */
    function createBokeh(theme) {
        if (!theme.bokeh) return;
        theme.bokeh.forEach(function (b, i) {
            var el = document.createElement('div'); el.className = 'gb-bokeh';
            el.style.cssText = 'width:' + b.size + 'px;height:' + b.size + 'px;left:' + b.x + '%;top:' + b.y + '%;background:radial-gradient(circle,' + b.color + ' 0%,transparent 70%);filter:blur(' + b.blur + 'px);animation-delay:' + (i * 4) + 's;animation-duration:' + rand(25, 40).toFixed(0) + 's';
            document.body.appendChild(el); state.bokehEls.push(el);
        });
    }

    /* ═══ BANNER ═══ */
    function createBanner(theme, themeId) {
        if (!theme.banner) return;
        try { if (sessionStorage.getItem('gb-ban8') === state.id) return; } catch (e) { }
        var b = theme.banner;
        var icon = BI[themeId] || BI[themeId.replace(/-/g, '')] || '';
        var el = document.createElement('div'); el.className = 'gb-banner';
        el.style.cssText = 'background:' + b.bg + ';border-left:3px solid ' + b.accent + ';box-shadow:' + b.shadow;
        el.innerHTML = '<div class="gb-banner-body">' +
            '<div class="gb-banner-icon" style="background:' + b.iconBg + '">' + icon + '</div>' +
            '<div><div class="gb-banner-title" style="color:' + b.titleColor + '">' + b.title + '</div>' +
            '<div class="gb-banner-sub">' + b.sub + '</div></div></div>' +
            '<button class="gb-banner-x" aria-label="Close">&times;</button>' +
            '<div class="gb-banner-bar"><div class="gb-banner-bar-fill" style="background:' + b.timer + '"></div></div>';
        document.body.appendChild(el);
        state.banner = el;
        el.querySelector('.gb-banner-x').addEventListener('click', dismissBanner);
        setTimeout(function () { if (state.banner) dismissBanner(); }, 8000);
    }
    function dismissBanner() {
        if (!state.banner) return;
        state.banner.style.animation = 'gb-bout .4s ease forwards';
        var r = state.banner;
        setTimeout(function () { if (r && r.parentNode) r.remove(); }, 400);
        state.banner = null;
        try { sessionStorage.setItem('gb-ban8', state.id); } catch (e) { }
    }

    /* ═══ STRING LIGHTS (Christmas) ═══ */
    function createLights() {
        if (isMobile) return;
        var el = document.createElement('div'); el.className = 'gb-lights';
        var n = 16, margin = 4;
        var colors = [
            { fill: '#FFE8CC', glow: 'rgba(255,232,204,.4)' },
            { fill: '#E53935', glow: 'rgba(229,57,53,.35)' },
            { fill: '#FFD700', glow: 'rgba(255,215,0,.35)' },
            { fill: '#2E7D32', glow: 'rgba(46,125,50,.3)' },
            { fill: '#1565C0', glow: 'rgba(21,101,192,.3)' }
        ];
        var defs = '<defs>', wire = '', bulbs = '', pts = [];
        for (var i = 0; i < n; i++) {
            var pct = margin + (i / (n - 1)) * (100 - 2 * margin);
            var xvb = pct * 10, droop = Math.sin((i / (n - 1)) * Math.PI) * 20;
            var wy = 6 + droop; pts.push(xvb + ',' + wy);
            var c = colors[i % colors.length], by = wy + 4, id = 'bl' + i;
            defs += '<radialGradient id="' + id + '" cx=".35" cy=".25" r=".7"><stop offset="0%" stop-color="#fff" stop-opacity=".5"/><stop offset="50%" stop-color="' + c.fill + '"/><stop offset="100%" stop-color="' + c.fill + '" stop-opacity=".75"/></radialGradient>';
            bulbs += '<circle cx="' + xvb + '" cy="' + (by + 6) + '" r="12" fill="' + c.glow + '"><animate attributeName="opacity" values=".3;.6;.3" dur="' + (3 + (i % 5) * .5).toFixed(1) + 's" repeatCount="indefinite"/></circle>';
            bulbs += '<rect x="' + (xvb - 3) + '" y="' + (wy - 1) + '" width="6" height="4" rx="1" fill="#444"/>';
            bulbs += '<path d="M' + xvb + ',' + by + ' C' + (xvb - 4.5) + ',' + (by + 3) + ' ' + (xvb - 5.5) + ',' + (by + 9) + ' ' + xvb + ',' + (by + 13) + ' C' + (xvb + 5.5) + ',' + (by + 9) + ' ' + (xvb + 4.5) + ',' + (by + 3) + ' ' + xvb + ',' + by + 'Z" fill="url(#' + id + ')"/>';
            bulbs += '<ellipse cx="' + (xvb - 1.5) + '" cy="' + (by + 3.5) + '" rx="1.5" ry="2" fill="rgba(255,255,255,.3)"/>';
        }
        defs += '</defs>';
        wire = '<polyline points="' + pts.join(' ') + '" stroke="#444" stroke-width="1.2" fill="none"/>';
        el.innerHTML = '<svg viewBox="0 0 1000 65" preserveAspectRatio="none" style="width:100%;height:100%">' + defs + wire + bulbs + '</svg>';
        document.body.appendChild(el); state.extraEls.push(el);
    }

    /* ═══ HANGING ELEMENTS ═══ */
    function createHanging(type) {
        if (isMobile) return;
        var el = document.createElement('div'); el.className = 'gb-hanging';
        if (type === 'icicles') {
            el.innerHTML = '<svg viewBox="0 0 1000 40" preserveAspectRatio="none" style="width:100%;height:40px"><g fill="rgba(200,230,255,.12)"><path d="M50 0v18l-4 0v-18z"/><path d="M150 0v28l-5 0v-28z"/><path d="M280 0v14l-4 0v-14z"/><path d="M370 0v22l-4 0v-22z"/><path d="M500 0v32l-5 0v-32z"/><path d="M600 0v16l-4 0v-16z"/><path d="M720 0v26l-5 0v-26z"/><path d="M830 0v20l-4 0v-20z"/><path d="M920 0v12l-3 0v-12z"/></g></svg>';
        } else if (type === 'lanterns') {
            var svg = '<svg viewBox="0 0 1000 60" preserveAspectRatio="none" style="width:100%;height:60px"><g stroke="#B8860B" stroke-width="1" fill="none">';
            var lx = [120, 350, 580, 780, 940]; var lh = [35, 45, 30, 40, 25];
            for (var i = 0; i < lx.length; i++) {
                var x = lx[i], h = lh[i];
                svg += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + (h - 18) + '"/>';
                svg += '<path d="M' + (x - 5) + ',' + (h - 18) + 'h10l-1,3h-8z"/>';
                svg += '<rect x="' + (x - 4) + '" y="' + (h - 15) + '" width="8" height="2" rx=".5"/>';
                svg += '<path d="M' + (x - 6) + ',' + (h - 13) + 'h12l1.5,' + 13 + 'h-15z"/>';
                svg += '<ellipse cx="' + x + '" cy="' + (h - 4) + '" rx="2.5" ry="3" fill="rgba(255,200,50,.2)" stroke="none"/>';
            }
            svg += '</g></svg>';
            el.innerHTML = svg;
        }
        document.body.appendChild(el); state.extraEls.push(el);
    }

    /* ═══ CORNER DECORATIONS ═══ */
    function createCorners(theme) {
        if (!theme.corners) return;
        theme.corners.forEach(function (cfg) {
            var svgStr = SVG[cfg.svg]; if (!svgStr) return;
            var el = document.createElement('div'); el.className = 'gb-decor';
            el.style.width = cfg.w + 'px'; el.style.height = cfg.h + 'px';
            if (cfg.color) el.style.color = cfg.color;
            if (cfg.pos === 'tl') { el.style.top = '0'; el.style.left = '0'; }
            else if (cfg.pos === 'tr') { el.style.top = '0'; el.style.right = '0'; if (cfg.flip) el.style.transform = 'scaleX(-1)'; }
            else if (cfg.pos === 'bl') { el.style.bottom = '0'; el.style.left = '0'; }
            else if (cfg.pos === 'br') { el.style.bottom = '0'; el.style.right = '0'; }
            el.innerHTML = svgStr;
            document.body.appendChild(el); state.decorEls.push(el);
        });
    }

    /* ═══ BOTTOM SILHOUETTE ═══ */
    function createBottom(type) {
        var svgStr = SVG[type]; if (!svgStr) return;
        var el = document.createElement('div'); el.className = 'gb-bottom';
        el.style.height = type === 'graveyard' ? '55px' : type === 'mosque' ? '50px' : '35px';
        el.innerHTML = svgStr;
        document.body.appendChild(el); state.decorEls.push(el);
    }

    /* ═══ HERO ACCESSORIES ═══ */
    function addAccessory(type) {
        var svgStr = SVG[type]; if (!svgStr) return;
        // Hero circle
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) {
            hero.style.overflow = 'visible';
            var h = document.createElement('div'); h.className = 'gb-hat';
            h.innerHTML = '<div style="width:100%;height:100%">' + svgStr + '</div>';
            h.querySelector('svg').style.cssText = 'width:100%;height:100%';
            if (type === 'santaHat') {
                h.style.cssText = 'width:80px;height:70px;top:-20px;right:18px;left:auto'; h.style.setProperty('--hr', '18deg');
            } else if (type === 'witchHat') {
                h.style.cssText = 'width:75px;height:82px;top:-45px;right:15px;left:auto'; h.style.setProperty('--hr', '10deg');
            } else if (type === 'bunnyEars') {
                h.style.cssText = 'width:90px;height:55px;top:-40px;left:50%;margin-left:-45px'; h.style.setProperty('--hr', '0deg');
            } else if (type === 'sunglasses') {
                h.style.cssText = 'width:100px;height:40px;top:35%;left:50%;margin-left:-50px'; h.style.setProperty('--hr', '0deg');
            } else if (type === 'topHat') {
                h.style.cssText = 'width:70px;height:65px;top:-42px;left:50%;margin-left:-20px'; h.style.setProperty('--hr', '-8deg');
            }
            hero.appendChild(h); state.hatEls.push(h);
        }
        // Nav logo
        document.querySelectorAll('.nav-logo').forEach(function (logo) {
            logo.style.position = 'relative'; logo.style.overflow = 'visible';
            var nh = document.createElement('div'); nh.className = 'gb-hat';
            nh.innerHTML = '<div style="width:100%;height:100%">' + svgStr + '</div>';
            nh.querySelector('svg').style.cssText = 'width:100%;height:100%';
            if (type === 'santaHat') {
                nh.style.cssText = 'width:28px;height:24px;top:-14px;right:-4px;left:auto'; nh.style.setProperty('--hr', '16deg');
            } else if (type === 'witchHat') {
                nh.style.cssText = 'width:26px;height:28px;top:-18px;right:-2px;left:auto'; nh.style.setProperty('--hr', '10deg');
            } else if (type === 'bunnyEars') {
                nh.style.cssText = 'width:32px;height:20px;top:-14px;left:50%;margin-left:-16px'; nh.style.setProperty('--hr', '0deg');
            } else if (type === 'sunglasses') {
                nh.style.cssText = 'width:36px;height:14px;top:8px;left:50%;margin-left:-18px'; nh.style.setProperty('--hr', '0deg');
            } else if (type === 'topHat') {
                nh.style.cssText = 'width:24px;height:22px;top:-14px;left:50%;margin-left:-6px'; nh.style.setProperty('--hr', '-8deg');
            }
            logo.appendChild(nh); state.hatEls.push(nh);
        });
    }

    /* ═══ PULSING GLOW ═══ */
    function applyGlow(theme) {
        if (!theme.glow) return;
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) {
            if (!state.savedBorder) state.savedBorder = hero.style.border;
            if (!state.savedShadow) state.savedShadow = hero.style.boxShadow;
            hero.style.border = theme.glow.border;
            hero.style.transition = 'border 1.5s';
            var kn = 'gb-p' + Date.now();
            try {
                if (state.style && state.style.sheet) {
                    state.style.sheet.insertRule('@keyframes ' + kn + '{0%,100%{box-shadow:' + theme.glow.shadowMin + '}50%{box-shadow:' + theme.glow.shadowMax + '}}', state.style.sheet.cssRules.length);
                }
            } catch (e) { }
            hero.style.animation = kn + ' 4s ease-in-out infinite';
        }
        if (theme.glow.nav) {
            document.querySelectorAll('.nav-logo img').forEach(function (img) {
                if (!state.savedNavGlow) state.savedNavGlow = img.style.boxShadow || '';
                img.style.boxShadow = theme.glow.nav; img.style.transition = 'box-shadow 1.5s';
            });
        }
    }
    function removeGlow() {
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) { hero.style.border = ''; hero.style.boxShadow = ''; hero.style.animation = ''; hero.style.transition = ''; }
        state.savedBorder = null; state.savedShadow = null;
        document.querySelectorAll('.nav-logo img').forEach(function (img) { img.style.boxShadow = ''; img.style.transition = ''; });
        state.savedNavGlow = null;
    }

    /* ═══ EXTRAS ═══ */
    function createFog() {
        ['a', 'b'].forEach(function (x) { var el = document.createElement('div'); el.className = 'gb-fog gb-fog-' + x; document.body.appendChild(el); state.extraEls.push(el); });
    }
    function createFrost() {
        ['tl', 'tr'].forEach(function (p) { var el = document.createElement('div'); el.className = 'gb-frost gb-frost-' + p; document.body.appendChild(el); state.extraEls.push(el); });
    }
    function createSparkles() {
        var n = isMobile ? 15 : 35;
        for (var i = 0; i < n; i++) {
            var el = document.createElement('div'); el.className = 'gb-sparkle';
            var s = rand(2, 5); el.style.width = s + 'px'; el.style.height = s + 'px';
            el.style.left = rand(2, 98) + '%'; el.style.top = rand(2, 95) + '%';
            el.style.background = Math.random() > .5 ? '#FDD835' : '#FFF9C4';
            el.style.setProperty('--sd', rand(2, 5).toFixed(1) + 's');
            el.style.setProperty('--op', rand(.25, .6).toFixed(2));
            el.style.animationDelay = rand(0, 4).toFixed(1) + 's';
            document.body.appendChild(el); state.extraEls.push(el);
        }
    }
    function createNeonFlash() {
        var el = document.createElement('div'); el.className = 'gb-nflash';
        el.style.background = 'radial-gradient(ellipse at 50% 50%,rgba(255,23,68,.15) 0%,transparent 70%)';
        document.body.appendChild(el); state.extraEls.push(el);
    }
    function createVignette(bg) {
        var el = document.createElement('div'); el.className = 'gb-vignette'; el.style.background = bg;
        document.body.appendChild(el); state.extraEls.push(el);
    }

    /* ═══ BORDER & NAV LINE ═══ */
    function createBorder(theme) {
        if (!theme.topBorder) return;
        state.border = document.createElement('div'); state.border.className = 'gb-bdr';
        state.border.style.height = '3px'; state.border.style.background = theme.topBorder;
        if (theme.topBorderAnim) { state.border.style.backgroundSize = '200% 100%'; state.border.style.animation = 'gb-shift 4s linear infinite'; }
        if (theme.topBorderShimmer) state.border.style.animation = 'gb-shimr 3s ease-in-out infinite';
        if (theme.topBorderNeon) { state.border.style.setProperty('--nc', theme.topBorderNeon); state.border.style.animation = 'gb-nbar 1.5s ease-in-out infinite'; }
        if (theme.topBorderGlow) state.border.style.boxShadow = '0 0 8px ' + theme.topBorderGlow + ',0 0 16px ' + theme.topBorderGlow;
        document.body.appendChild(state.border);
    }
    function createNavLine(theme) {
        var nav = document.querySelector('.nav') || document.querySelector('.floating-nav');
        if (!nav || !theme.navLine) return;
        state.navLine = document.createElement('div'); state.navLine.className = 'gb-nav-line';
        state.navLine.style.background = theme.navLine; nav.appendChild(state.navLine);
    }

    /* ═══ MAIN API ═══ */
    function apply(data) {
        if (!data || !data.themeId) { remove(); return; }
        var theme = getTheme(data.themeId);
        if (!theme) { remove(); return; }
        if (state.id === data.themeId && state.canvas) return;
        remove();
        state.id = data.themeId;
        var themeKey = data.themeId.toLowerCase().replace(/[\s_']/g, '-');
        injectCSS();

        // ALL PAGES: glow, border, nav line
        applyGlow(theme);
        createBorder(theme);
        createNavLine(theme);

        // MAIN PAGES ONLY: everything else
        if (isMainPage) {
            createBokeh(theme);
            initCanvas(); spawnParticles(theme); animateParticles();
            createCorners(theme);
            if (theme.bottom) createBottom(theme.bottom);
            if (theme.hanging) createHanging(theme.hanging);
            if (theme.fog) createFog();
            if (theme.frost) createFrost();
            if (theme.sparkleField) createSparkles();
            if (theme.neonFlash) createNeonFlash();
            if (theme.vignette) createVignette(theme.vignette);
            if (theme.lights) createLights();
            if (theme.heroAccessory) addAccessory(theme.heroAccessory);
            createBanner(theme, themeKey);
        }
    }

    function remove() {
        if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; }
        if (state.canvas) { state.canvas.remove(); state.canvas = null; state.ctx = null; }
        state.particles = [];
        state.bokehEls.forEach(function (e) { e.remove(); }); state.bokehEls = [];
        state.decorEls.forEach(function (e) { e.remove(); }); state.decorEls = [];
        state.extraEls.forEach(function (e) { e.remove(); }); state.extraEls = [];
        if (state.banner) { state.banner.remove(); state.banner = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        if (state.navLine) { state.navLine.remove(); state.navLine = null; }
        state.hatEls.forEach(function (e) { if (e.parentNode) e.remove(); }); state.hatEls = [];
        document.querySelectorAll('.nav-logo').forEach(function (l) { l.style.removeProperty('position'); l.style.removeProperty('overflow'); });
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) { hero.style.removeProperty('overflow'); }
        removeGlow();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };
})();
