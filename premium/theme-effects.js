/**
 * Golden Barbers – Premium Seasonal Theme Effects v7
 * ════════════════════════════════════════════════════
 * Agency-quality. Canvas particles with depth, bokeh light
 * overlays, frosted-glass banners, shimmer effects.
 * Brand gold STAYS – atmosphere transforms, not decorates.
 *
 * Usage: GBThemeEffects.apply(firebaseThemeData)
 *        GBThemeEffects.remove()
 */
(function () {
    'use strict';

    var state = {
        canvas: null, ctx: null, raf: null, particles: [],
        bokehEls: [], cornerEls: [], extraEls: [],
        banner: null, toast: null, border: null, navLine: null,
        style: null, hatEls: [],
        savedNeon: null, savedNavGlow: null, id: null
    };
    var isMobile = window.innerWidth < 768;
    var W = window.innerWidth, H = window.innerHeight;

    window.addEventListener('resize', function () { W = window.innerWidth; H = window.innerHeight; if (state.canvas) { state.canvas.width = W; state.canvas.height = H; } });

    /* ═══════════════════════════════════════════
       THEME CONFIGS
       Each theme defines: particles, bokeh, glow,
       banner, corner, and creative settings.
    ═══════════════════════════════════════════ */

    function snowflake(x, y, r) {
        var c = state.ctx; c.save(); c.translate(x, y); c.strokeStyle = 'rgba(255,255,255,' + (0.4 + r / 10) + ')'; c.lineWidth = r > 3 ? 1.2 : 0.8; c.lineCap = 'round';
        for (var i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -r); if (r > 2.5) { c.moveTo(0, -r * 0.55); c.lineTo(-r * 0.3, -r * 0.75); c.moveTo(0, -r * 0.55); c.lineTo(r * 0.3, -r * 0.75); } c.stroke(); c.rotate(Math.PI / 3); }
        c.restore();
    }

    function heart(x, y, s, color) {
        var c = state.ctx; c.save(); c.translate(x, y); c.scale(s / 16, s / 16);
        c.beginPath(); c.moveTo(0, 3); c.bezierCurveTo(-1, -2, -8, -4, -8, 0); c.bezierCurveTo(-8, 5, 0, 10, 0, 14);
        c.moveTo(0, 3); c.bezierCurveTo(1, -2, 8, -4, 8, 0); c.bezierCurveTo(8, 5, 0, 10, 0, 14);
        c.fillStyle = color; c.shadowBlur = s * 0.6; c.shadowColor = color; c.fill(); c.restore();
    }

    function ember(x, y, r, color) {
        var c = state.ctx; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = color; c.shadowBlur = r * 4; c.shadowColor = color; c.fill(); c.shadowBlur = 0;
    }

    function star5(x, y, r, color) {
        var c = state.ctx; c.save(); c.translate(x, y); c.beginPath();
        for (var i = 0; i < 5; i++) { var a = (i * 4 * Math.PI / 5) - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); a = ((i * 4 + 2) * Math.PI / 5) - Math.PI / 2; c.lineTo(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4); }
        c.closePath(); c.fillStyle = color; c.shadowBlur = r * 2; c.shadowColor = color; c.fill(); c.restore();
    }

    function tag(x, y, s, color) {
        var c = state.ctx; c.save(); c.translate(x, y); c.scale(s / 20, s / 20);
        c.beginPath(); c.moveTo(-6, -10); c.lineTo(6, -10); c.lineTo(6, 6); c.lineTo(0, 12); c.lineTo(-6, 6); c.closePath();
        c.fillStyle = color; c.shadowBlur = 6; c.shadowColor = color; c.fill();
        c.beginPath(); c.arc(0, -4, 2, 0, Math.PI * 2); c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 0.8; c.stroke();
        c.restore();
    }

    var THEMES = {
        christmas: {
            particleType: 'snow',
            particleCount: isMobile ? 35 : 70,
            bokeh: [
                { color: 'rgba(200,60,60,0.06)', size: 180, x: 15, y: 20, blur: 60 },
                { color: 'rgba(46,125,50,0.05)', size: 140, x: 80, y: 30, blur: 50 },
                { color: 'rgba(212,175,55,0.07)', size: 200, x: 50, y: 60, blur: 70 },
                { color: 'rgba(200,60,60,0.04)', size: 120, x: 70, y: 80, blur: 45 },
                { color: 'rgba(212,175,55,0.05)', size: 160, x: 25, y: 75, blur: 55 }
            ],
            neon: { border: '3px solid rgba(200,60,60,0.7)', shadow: '0 0 30px rgba(200,60,60,0.4), 0 0 60px rgba(46,125,50,0.25), inset 0 0 20px rgba(200,60,60,0.1)' },
            navGlow: '0 0 12px rgba(200,60,60,0.2), 0 0 24px rgba(46,125,50,0.1)',
            banner: { text: 'SEASON\'S GREETINGS', sub: 'Wishing you joy & style this festive season', bg: 'rgba(20,20,20,0.6)', border: 'rgba(200,60,60,0.2)', color: '#fff' },
            toast: { title: 'MERRY CHRISTMAS', sub: 'Wishing you a festive season full of style!', bg: 'linear-gradient(135deg, #1B5E20, #C62828)', color: '#fff' },
            topBorder: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 8px,transparent 8px,transparent 14px,#1B5E20 14px,#1B5E20 22px,transparent 22px,transparent 28px)',
            navLine: 'linear-gradient(90deg, transparent, #C62828, #d4af37, #1B5E20, transparent)',
            corner: 'holly',
            hat: true,
            lights: true
        },

        valentines: {
            particleType: 'hearts',
            particleCount: isMobile ? 15 : 30,
            bokeh: [
                { color: 'rgba(233,30,99,0.06)', size: 200, x: 25, y: 25, blur: 65 },
                { color: 'rgba(244,143,177,0.05)', size: 160, x: 75, y: 40, blur: 55 },
                { color: 'rgba(233,30,99,0.04)', size: 140, x: 50, y: 70, blur: 50 },
                { color: 'rgba(212,175,55,0.04)', size: 120, x: 15, y: 80, blur: 45 }
            ],
            neon: { border: '3px solid rgba(233,30,99,0.65)', shadow: '0 0 25px rgba(233,30,99,0.35), 0 0 50px rgba(233,30,99,0.15), inset 0 0 15px rgba(233,30,99,0.08)' },
            navGlow: '0 0 10px rgba(233,30,99,0.18), 0 0 20px rgba(200,100,120,0.08)',
            banner: { text: "HAPPY VALENTINE'S", sub: 'Look sharp for your special someone!', bg: 'rgba(20,10,15,0.6)', border: 'rgba(233,30,99,0.2)', color: '#F8BBD0' },
            toast: { title: "VALENTINE'S DAY", sub: 'Look sharp for your special someone!', bg: 'linear-gradient(135deg, #880E4F, #E91E63)', color: '#fff' },
            topBorder: 'linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63)',
            topBorderAnim: true,
            navLine: 'linear-gradient(90deg, transparent, #F48FB1, #E91E63, #F48FB1, transparent)'
        },

        winter: {
            particleType: 'snow',
            particleCount: isMobile ? 40 : 85,
            bokeh: [
                { color: 'rgba(100,180,246,0.05)', size: 180, x: 20, y: 20, blur: 60 },
                { color: 'rgba(79,195,247,0.04)', size: 150, x: 70, y: 35, blur: 50 },
                { color: 'rgba(225,245,254,0.05)', size: 200, x: 45, y: 65, blur: 70 },
                { color: 'rgba(100,180,246,0.03)', size: 130, x: 85, y: 80, blur: 45 }
            ],
            neon: { border: '3px solid rgba(100,180,246,0.7)', shadow: '0 0 25px rgba(100,180,246,0.35), 0 0 50px rgba(79,195,247,0.2), inset 0 0 15px rgba(100,180,246,0.08)' },
            navGlow: '0 0 10px rgba(100,180,246,0.18), 0 0 20px rgba(79,195,247,0.08)',
            banner: { text: 'WINTER WARMTH', sub: 'Warm up with a fresh new look', bg: 'rgba(10,20,35,0.6)', border: 'rgba(100,180,246,0.2)', color: '#E1F5FE' },
            toast: { title: 'WINTER WARMTH', sub: 'Warm up with a fresh cut this winter', bg: 'linear-gradient(135deg, #01579B, #0288D1)', color: '#E1F5FE' },
            topBorder: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,0.5),rgba(225,245,254,0.8),rgba(79,195,247,0.5),rgba(79,195,247,0))',
            topBorderShimmer: true,
            navLine: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.4), rgba(225,245,254,0.7), rgba(79,195,247,0.4), transparent)',
            frost: true
        },

        halloween: {
            particleType: 'embers',
            particleCount: isMobile ? 20 : 40,
            bokeh: [
                { color: 'rgba(255,111,0,0.06)', size: 180, x: 20, y: 25, blur: 60 },
                { color: 'rgba(106,27,154,0.05)', size: 160, x: 75, y: 35, blur: 55 },
                { color: 'rgba(255,111,0,0.04)', size: 140, x: 50, y: 70, blur: 50 },
                { color: 'rgba(106,27,154,0.04)', size: 200, x: 30, y: 85, blur: 65 }
            ],
            neon: { border: '3px solid rgba(255,111,0,0.75)', shadow: '0 0 25px rgba(255,111,0,0.4), 0 0 50px rgba(106,27,154,0.25), inset 0 0 15px rgba(255,111,0,0.1)' },
            navGlow: '0 0 10px rgba(255,111,0,0.22), 0 0 20px rgba(106,27,154,0.1)',
            banner: { text: 'HAPPY HALLOWEEN', sub: 'Get a killer look this spooky season', bg: 'rgba(15,5,25,0.7)', border: 'rgba(255,111,0,0.2)', color: '#FFE0B2' },
            toast: { title: 'SPOOKY SEASON', sub: 'Get a killer look this Halloween!', bg: 'linear-gradient(135deg, #4A148C, #E65100)', color: '#FFE0B2' },
            topBorder: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)',
            topBorderGlow: 'rgba(255,111,0,0.35)',
            navLine: 'linear-gradient(90deg, #4A148C, #FF6F00, #4A148C, #FF6F00, #4A148C)',
            corner: 'cobweb',
            fog: true,
            vignette: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)'
        },

        easter: {
            particleType: 'petals',
            particleCount: isMobile ? 18 : 35,
            bokeh: [
                { color: 'rgba(129,199,132,0.05)', size: 170, x: 20, y: 30, blur: 55 },
                { color: 'rgba(244,143,177,0.05)', size: 150, x: 75, y: 25, blur: 50 },
                { color: 'rgba(144,202,249,0.04)', size: 140, x: 45, y: 70, blur: 50 },
                { color: 'rgba(255,245,157,0.04)', size: 130, x: 80, y: 80, blur: 45 }
            ],
            neon: { border: '3px solid rgba(129,199,132,0.65)', shadow: '0 0 25px rgba(129,199,132,0.3), 0 0 50px rgba(244,143,177,0.2), inset 0 0 15px rgba(129,199,132,0.08)' },
            navGlow: '0 0 10px rgba(129,199,132,0.18), 0 0 20px rgba(244,143,177,0.08)',
            banner: { text: 'HAPPY EASTER', sub: 'Spring into a fresh new look!', bg: 'rgba(15,25,15,0.55)', border: 'rgba(129,199,132,0.2)', color: '#C8E6C9' },
            toast: { title: 'HAPPY EASTER', sub: 'Spring into a fresh new look!', bg: 'linear-gradient(135deg, #66BB6A, #81C784)', color: '#fff' },
            topBorder: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px)',
            navLine: 'linear-gradient(90deg, #F48FB1, #81C784, #FFF59D, #81C784, #F48FB1)'
        },

        summer: {
            particleType: 'sparkle',
            particleCount: isMobile ? 12 : 25,
            bokeh: [
                { color: 'rgba(255,200,100,0.07)', size: 220, x: 80, y: 10, blur: 80 },
                { color: 'rgba(2,136,209,0.04)', size: 160, x: 20, y: 60, blur: 55 },
                { color: 'rgba(255,143,0,0.05)', size: 180, x: 55, y: 40, blur: 60 },
                { color: 'rgba(255,200,100,0.04)', size: 140, x: 35, y: 85, blur: 50 }
            ],
            neon: { border: '3px solid rgba(255,143,0,0.65)', shadow: '0 0 25px rgba(255,143,0,0.3), 0 0 50px rgba(2,136,209,0.2), inset 0 0 15px rgba(255,143,0,0.08)' },
            navGlow: '0 0 10px rgba(255,143,0,0.18), 0 0 20px rgba(2,136,209,0.08)',
            banner: { text: 'SUMMER VIBES', sub: 'Stay fresh all summer long!', bg: 'rgba(25,15,5,0.55)', border: 'rgba(255,143,0,0.2)', color: '#FFF3E0' },
            toast: { title: 'SUMMER VIBES', sub: 'Stay fresh all summer long!', bg: 'linear-gradient(135deg, #E65100, #FF8F00)', color: '#fff' },
            topBorder: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)',
            topBorderAnim: true,
            navLine: 'linear-gradient(90deg, #FF8F00, #0288D1, #FF8F00, #0288D1, #FF8F00)'
        },

        eid: {
            particleType: 'stars',
            particleCount: isMobile ? 15 : 30,
            bokeh: [
                { color: 'rgba(253,216,53,0.06)', size: 190, x: 30, y: 20, blur: 65 },
                { color: 'rgba(46,125,50,0.04)', size: 150, x: 70, y: 45, blur: 50 },
                { color: 'rgba(253,216,53,0.05)', size: 170, x: 50, y: 75, blur: 60 }
            ],
            neon: { border: '3px solid rgba(253,216,53,0.8)', shadow: '0 0 25px rgba(253,216,53,0.4), 0 0 50px rgba(46,125,50,0.2), inset 0 0 15px rgba(253,216,53,0.1)' },
            navGlow: '0 0 10px rgba(253,216,53,0.22), 0 0 20px rgba(46,125,50,0.08)',
            banner: { text: 'EID MUBARAK', sub: 'Celebrate in style with a fresh look!', bg: 'rgba(10,20,10,0.6)', border: 'rgba(253,216,53,0.2)', color: '#FFF9C4' },
            toast: { title: 'EID MUBARAK', sub: 'Celebrate in style with a fresh look!', bg: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#FFF9C4' },
            topBorder: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)',
            navLine: 'linear-gradient(90deg, transparent, #2E7D32, #FDD835, #2E7D32, transparent)',
            sparkleField: true
        },

        ramadan: {
            particleType: 'stars',
            particleCount: isMobile ? 12 : 25,
            bokeh: [
                { color: 'rgba(184,134,11,0.06)', size: 190, x: 25, y: 20, blur: 65 },
                { color: 'rgba(26,35,126,0.05)', size: 170, x: 70, y: 40, blur: 55 },
                { color: 'rgba(184,134,11,0.04)', size: 150, x: 45, y: 75, blur: 50 },
                { color: 'rgba(26,35,126,0.04)', size: 200, x: 80, y: 85, blur: 70 }
            ],
            neon: { border: '3px solid rgba(184,134,11,0.8)', shadow: '0 0 25px rgba(184,134,11,0.35), 0 0 50px rgba(26,35,126,0.25), inset 0 0 15px rgba(184,134,11,0.08)' },
            navGlow: '0 0 10px rgba(184,134,11,0.18), 0 0 20px rgba(26,35,126,0.08)',
            banner: { text: 'RAMADAN KAREEM', sub: 'Wishing you a blessed & beautiful month', bg: 'rgba(8,10,30,0.65)', border: 'rgba(184,134,11,0.2)', color: '#E8EAF6' },
            toast: { title: 'RAMADAN KAREEM', sub: 'Wishing you a blessed and beautiful month', bg: 'linear-gradient(135deg, #1A237E, #283593)', color: '#E8EAF6' },
            topBorder: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,0.5),#B8860B,rgba(184,134,11,0))',
            topBorderShimmer: true,
            navLine: 'linear-gradient(90deg, transparent, #1A237E, #B8860B, #1A237E, transparent)',
            sparkleField: true
        },

        'black-friday': {
            particleType: 'tags',
            particleCount: isMobile ? 10 : 20,
            bokeh: [
                { color: 'rgba(255,23,68,0.06)', size: 200, x: 30, y: 25, blur: 70 },
                { color: 'rgba(255,214,0,0.05)', size: 170, x: 70, y: 40, blur: 55 },
                { color: 'rgba(255,23,68,0.04)', size: 150, x: 50, y: 75, blur: 50 }
            ],
            neon: { border: '3px solid rgba(255,23,68,0.75)', shadow: '0 0 25px rgba(255,23,68,0.4), 0 0 50px rgba(255,214,0,0.15), inset 0 0 15px rgba(255,23,68,0.08)' },
            navGlow: '0 0 10px rgba(255,23,68,0.22), 0 0 20px rgba(255,214,0,0.08)',
            banner: { text: 'BLACK FRIDAY DEALS', sub: 'Biggest deals of the year!', bg: 'rgba(0,0,0,0.75)', border: 'rgba(255,23,68,0.3)', color: '#FFD600' },
            toast: { title: 'BLACK FRIDAY', sub: 'Biggest deals of the year!', bg: 'linear-gradient(135deg, #000, #212121)', color: '#FFD600' },
            topBorder: '#FF1744',
            topBorderNeon: '#FF1744',
            navLine: 'linear-gradient(90deg, #FF1744, #FFD600, #FF1744, #FFD600, #FF1744)',
            neonFlash: true
        },

        'new-year': {
            particleType: 'confetti',
            particleCount: isMobile ? 30 : 60,
            bokeh: [
                { color: 'rgba(255,215,0,0.07)', size: 210, x: 40, y: 20, blur: 70 },
                { color: 'rgba(13,71,161,0.05)', size: 170, x: 75, y: 45, blur: 55 },
                { color: 'rgba(255,215,0,0.05)', size: 160, x: 20, y: 70, blur: 55 },
                { color: 'rgba(192,192,192,0.04)', size: 140, x: 60, y: 85, blur: 50 }
            ],
            neon: { border: '3px solid rgba(255,215,0,0.85)', shadow: '0 0 30px rgba(255,215,0,0.45), 0 0 60px rgba(13,71,161,0.2), inset 0 0 15px rgba(255,215,0,0.12)' },
            navGlow: '0 0 12px rgba(255,215,0,0.25), 0 0 24px rgba(13,71,161,0.1)',
            banner: { text: 'HAPPY NEW YEAR', sub: 'New year, fresh look – Start the year right!', bg: 'rgba(5,15,40,0.65)', border: 'rgba(255,215,0,0.25)', color: '#FFD700' },
            toast: { title: 'HAPPY NEW YEAR', sub: 'New year, new look!', bg: 'linear-gradient(135deg, #0D47A1, #1565C0)', color: '#FFD700' },
            topBorder: 'linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent)',
            topBorderAnim: true,
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
       CSS INJECTION
    ═══════════════════════════════════════════ */
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            /* Canvas */
            '.gb-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1}',
            /* Bokeh */
            '.gb-bokeh{position:fixed;border-radius:50%;pointer-events:none;z-index:0;animation:gb-bokeh-float 30s ease-in-out infinite}',
            '@keyframes gb-bokeh-float{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(15px,-20px) scale(1.05)}50%{transform:translate(-10px,15px) scale(0.95)}75%{transform:translate(20px,10px) scale(1.03)}}',
            /* Frosted Banner */
            '.gb-fbanner{position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-15px);z-index:999;' +
                'font-family:"Outfit",sans-serif;text-align:center;pointer-events:none;' +
                'border-radius:16px;padding:18px 36px;min-width:260px;max-width:440px;' +
                'backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);' +
                'box-shadow:0 8px 32px rgba(0,0,0,0.4);' +
                'opacity:0;animation:gb-fbannerin 1.2s cubic-bezier(.34,1.56,.64,1) 1.2s forwards}',
            '.gb-fbanner-title{font-size:13px;font-weight:800;letter-spacing:4px;text-transform:uppercase}',
            '.gb-fbanner-sub{font-size:12px;font-weight:400;opacity:0.75;margin-top:4px;letter-spacing:0.5px}',
            '.gb-fbanner-shimmer{position:absolute;top:0;left:-100%;width:100%;height:100%;border-radius:16px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);animation:gb-shimmerslide 5s ease-in-out 2.5s infinite}',
            '@keyframes gb-fbannerin{to{opacity:1;transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-fbannerhide{to{opacity:0;transform:translateX(-50%) translateY(-20px)}}',
            '@keyframes gb-shimmerslide{0%{left:-100%}40%{left:100%}100%{left:100%}}',
            /* Vignette */
            '.gb-vignette{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-fin 2.5s ease 0.5s forwards}',
            /* Fog */
            '.gb-fog{position:fixed;bottom:0;left:0;width:200%;height:35vh;pointer-events:none;z-index:1;opacity:0}',
            '.gb-fog-a{background:linear-gradient(to top,rgba(255,255,255,0.07) 0%,transparent 100%);animation:gb-fin 3s ease 1s forwards,gb-fogd 28s linear infinite}',
            '.gb-fog-b{background:linear-gradient(to top,rgba(255,255,255,0.05) 0%,transparent 100%);animation:gb-fin 3s ease 1.5s forwards,gb-fogd 42s linear infinite reverse}',
            '@keyframes gb-fogd{to{transform:translateX(-50%)}}',
            /* Frost corners */
            '.gb-frost{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-frost-tl{top:0;left:0;width:220px;height:220px;background:radial-gradient(ellipse at 0% 0%,rgba(200,230,255,0.1) 0%,transparent 70%)}',
            '.gb-frost-tr{top:0;right:0;width:220px;height:220px;background:radial-gradient(ellipse at 100% 0%,rgba(200,230,255,0.1) 0%,transparent 70%)}',
            '.gb-frost-bl{bottom:0;left:0;width:180px;height:180px;background:radial-gradient(ellipse at 0% 100%,rgba(200,230,255,0.07) 0%,transparent 70%)}',
            '.gb-frost-br{bottom:0;right:0;width:180px;height:180px;background:radial-gradient(ellipse at 100% 100%,rgba(200,230,255,0.07) 0%,transparent 70%)}',
            /* Corner SVG */
            '.gb-corner{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 2s ease 0.8s forwards}',
            '.gb-corner svg{width:100%;height:100%}',
            /* Sparkle field */
            '.gb-sparkle{position:fixed;pointer-events:none;z-index:1;border-radius:50%;animation:gb-twinkle var(--sd) ease-in-out infinite}',
            '@keyframes gb-twinkle{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:var(--op);transform:scale(1)}}',
            /* Neon flash */
            '.gb-nflash{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-nf 4s ease-in-out infinite}',
            '@keyframes gb-nf{0%,100%{opacity:0}20%{opacity:0.07}35%{opacity:0}55%{opacity:0.05}70%{opacity:0}85%{opacity:0.09}95%{opacity:0}}',
            /* String lights */
            '.gb-lights{position:fixed;top:78px;left:0;width:100%;height:65px;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease 0.5s forwards}',
            '.gb-bulb{position:absolute;width:13px;height:17px;border-radius:50% 50% 50% 50%/55% 55% 45% 45%;transform:translateX(-50%);animation:gb-glow 3s ease-in-out infinite}',
            '.gb-bulb::after{content:"";position:absolute;top:2px;left:3px;width:5px;height:5px;background:rgba(255,255,255,0.22);border-radius:50%}',
            '.gb-cap{position:absolute;width:9px;height:5px;background:#555;border-radius:2px 2px 0 0;transform:translateX(-50%)}',
            '@keyframes gb-glow{0%,100%{box-shadow:0 3px 10px var(--gc),0 0 18px var(--gc);opacity:0.8}50%{box-shadow:0 3px 20px var(--gc),0 0 30px var(--gc);opacity:1}}',
            /* Toast */
            '.gb-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(120px);z-index:10001;' +
                'font-family:"Outfit",sans-serif;pointer-events:auto;border-radius:16px;overflow:hidden;' +
                'box-shadow:0 10px 50px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.08);' +
                'animation:gb-tin .6s cubic-bezier(.34,1.56,.64,1) .4s forwards;max-width:440px;width:calc(100% - 40px)}',
            '@keyframes gb-tin{to{transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-tout{to{transform:translateX(-50%) translateY(120px);opacity:0}}',
            '.gb-toast-in{display:flex;align-items:center;gap:14px;padding:18px 48px 18px 22px}',
            '.gb-toast-t{font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase}',
            '.gb-toast-s{font-size:14px;font-weight:500;opacity:.85;margin-top:3px}',
            '.gb-toast-x{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;color:inherit;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:background .2s}',
            '.gb-toast-x:hover{background:rgba(255,255,255,.22)}',
            '.gb-toast-bar{height:3px;background:rgba(255,255,255,0.2);position:relative;overflow:hidden}',
            '.gb-toast-bar::after{content:"";position:absolute;left:0;top:0;height:100%;width:100%;background:rgba(255,255,255,0.5);animation:gb-tbar 8s linear forwards}',
            '@keyframes gb-tbar{to{transform:translateX(-100%)}}',
            /* Top border */
            '.gb-bdr{position:fixed;top:0;left:0;width:100%;z-index:9998;pointer-events:none}',
            '@keyframes gb-shift{0%{background-position:0 0}100%{background-position:200% 0}}',
            '@keyframes gb-shimr{0%,100%{opacity:.5}50%{opacity:1}}',
            '@keyframes gb-nbar{0%,100%{box-shadow:0 0 6px var(--nc),0 0 14px var(--nc)}50%{box-shadow:0 0 3px var(--nc),0 0 6px var(--nc);opacity:.7}}',
            /* Nav line */
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-fin 1s ease .8s forwards}',
            /* Santa hat */
            '.gb-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));animation:gb-hatdrop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.5s both}',
            '@keyframes gb-hatdrop{0%{transform:rotate(var(--hr)) translateY(-12px) scale(0.8);opacity:0}100%{transform:rotate(var(--hr)) translateY(0) scale(1);opacity:1}}',
            /* Shared */
            '@keyframes gb-fin{to{opacity:1}}',
            /* Responsive */
            '@media(max-width:600px){.gb-toast{bottom:20px;max-width:calc(100% - 30px)}.gb-toast-in{padding:14px 42px 14px 18px}.gb-lights{display:none}.gb-fbanner{max-width:calc(100% - 40px);padding:14px 22px;top:70px}.gb-fbanner-title{font-size:11px;letter-spacing:3px}.gb-fbanner-sub{font-size:11px}}',
            /* Reduced motion */
            '@media(prefers-reduced-motion:reduce){.gb-canvas,.gb-bokeh,.gb-fog,.gb-sparkle,.gb-nflash{animation:none!important}}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    /* ═══════════════════════════════════════════
       CANVAS PARTICLE SYSTEM
       One <canvas> for all particles. GPU-friendly.
       3 depth layers with parallax.
    ═══════════════════════════════════════════ */
    function initCanvas() {
        state.canvas = document.createElement('canvas');
        state.canvas.className = 'gb-canvas';
        state.canvas.width = W; state.canvas.height = H;
        document.body.appendChild(state.canvas);
        state.ctx = state.canvas.getContext('2d');
    }

    function spawnParticles(theme) {
        state.particles = [];
        var type = theme.particleType;
        var count = theme.particleCount || 40;
        var colors;

        if (type === 'hearts') colors = ['#E91E63', '#F48FB1', '#EC407A', '#AD1457', '#F8BBD0'];
        else if (type === 'embers') colors = ['#FF6F00', '#FF8F00', '#FFB300', '#E65100'];
        else if (type === 'petals') colors = ['#F48FB1', '#CE93D8', '#90CAF9', '#81C784', '#FFF59D'];
        else if (type === 'stars') colors = ['#FDD835', '#FFF9C4', '#FFD54F', '#B8860B'];
        else if (type === 'tags') colors = ['#FF1744', '#FFD600', '#FF1744', '#FFD600'];
        else if (type === 'confetti') colors = ['#FFD700', '#C0C0C0', '#E91E63', '#0D47A1', '#fff', '#4CAF50', '#FF6F00'];
        else if (type === 'sparkle') colors = ['#FFD54F', '#FF8F00', '#FFF9C4', '#0288D1'];

        for (var i = 0; i < count; i++) {
            // 3 depth layers: far(0), mid(1), near(2)
            var layer = i < count * 0.4 ? 0 : i < count * 0.75 ? 1 : 2;
            var sizeMult = layer === 0 ? 0.5 : layer === 1 ? 1 : 1.8;
            var speedMult = layer === 0 ? 0.3 : layer === 1 ? 0.6 : 1;
            var opMult = layer === 0 ? 0.35 : layer === 1 ? 0.6 : 1;

            var p = {
                x: rand(0, W),
                y: rand(-H * 0.2, H),
                baseSize: type === 'snow' ? rand(2, 6) : type === 'hearts' ? rand(8, 18) : type === 'embers' ? rand(1, 3.5) : type === 'petals' ? rand(3, 7) : type === 'stars' ? rand(3, 8) : type === 'tags' ? rand(8, 16) : type === 'confetti' ? rand(3, 8) : rand(2, 5),
                size: 0,
                speed: (type === 'embers' ? rand(0.3, 0.8) : type === 'confetti' ? rand(0.8, 2.5) : rand(0.4, 1.2)) * speedMult,
                drift: rand(-0.3, 0.3),
                wobbleAmp: rand(15, 40),
                wobbleSpeed: rand(0.005, 0.02),
                wobbleOff: rand(0, Math.PI * 2),
                opacity: rand(0.2, 0.7) * opMult,
                layer: layer,
                sizeMult: sizeMult,
                color: colors ? colors[Math.floor(rand(0, colors.length))] : '#fff',
                rotation: rand(0, Math.PI * 2),
                rotSpeed: rand(-0.01, 0.01),
                type: type
            };
            p.size = p.baseSize * p.sizeMult;
            state.particles.push(p);
        }
    }

    function animateParticles() {
        if (!state.ctx || !state.canvas) return;
        var c = state.ctx;
        c.clearRect(0, 0, W, H);
        c.shadowBlur = 0;

        for (var i = 0; i < state.particles.length; i++) {
            var p = state.particles[i];
            var type = p.type;

            // Movement
            if (type === 'embers') {
                p.y -= p.speed;
                if (p.y < -20) { p.y = H + 20; p.x = rand(0, W); }
            } else if (type === 'hearts') {
                p.y -= p.speed * 0.7;
                if (p.y < -p.size * 2) { p.y = H + p.size * 2; p.x = rand(0, W); }
            } else {
                p.y += p.speed;
                if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); }
            }
            p.x += p.drift + Math.sin(p.y * p.wobbleSpeed + p.wobbleOff) * 0.4;
            if (p.x < -30) p.x = W + 30;
            if (p.x > W + 30) p.x = -30;
            p.rotation += p.rotSpeed;

            c.globalAlpha = p.opacity;

            if (type === 'snow') {
                snowflake(p.x, p.y, p.size);
            } else if (type === 'hearts') {
                heart(p.x, p.y, p.size, p.color);
            } else if (type === 'embers') {
                ember(p.x, p.y, p.size, p.color);
            } else if (type === 'stars') {
                star5(p.x, p.y, p.size, p.color);
            } else if (type === 'tags') {
                tag(p.x, p.y, p.size, p.color);
            } else if (type === 'confetti') {
                c.save(); c.translate(p.x, p.y); c.rotate(p.rotation);
                c.fillStyle = p.color;
                if (Math.random() > 0.5) { c.fillRect(-p.size / 2, -1, p.size, 2.5); }
                else { c.fillRect(-1.5, -p.size / 2, 3, p.size); }
                c.restore();
            } else if (type === 'petals') {
                c.save(); c.translate(p.x, p.y); c.rotate(p.rotation);
                c.fillStyle = p.color;
                c.beginPath(); c.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
                c.fill(); c.restore();
            } else if (type === 'sparkle') {
                c.save(); c.translate(p.x, p.y);
                var pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + p.wobbleOff);
                c.globalAlpha = p.opacity * pulse;
                c.fillStyle = p.color; c.shadowBlur = p.size * 3; c.shadowColor = p.color;
                c.beginPath(); c.arc(0, 0, p.size * pulse, 0, Math.PI * 2); c.fill();
                c.shadowBlur = 0; c.restore();
            }
        }
        c.globalAlpha = 1;
        c.shadowBlur = 0;
        state.raf = requestAnimationFrame(animateParticles);
    }

    /* ═══════════════════════════════════════════
       BOKEH LIGHT OVERLAY
       Large, soft, blurred gold circles.
       The single biggest "premium" upgrade.
    ═══════════════════════════════════════════ */
    function createBokeh(theme) {
        if (!theme.bokeh) return;
        theme.bokeh.forEach(function (b, i) {
            var el = document.createElement('div');
            el.className = 'gb-bokeh';
            el.style.width = b.size + 'px';
            el.style.height = b.size + 'px';
            el.style.left = b.x + '%';
            el.style.top = b.y + '%';
            el.style.background = 'radial-gradient(circle,' + b.color + ' 0%, transparent 70%)';
            el.style.filter = 'blur(' + b.blur + 'px)';
            el.style.animationDelay = (i * 4) + 's';
            el.style.animationDuration = rand(25, 40).toFixed(0) + 's';
            document.body.appendChild(el);
            state.bokehEls.push(el);
        });
    }

    /* ═══════════════════════════════════════════
       FROSTED GLASS BANNER
    ═══════════════════════════════════════════ */
    function createBanner(theme) {
        if (!theme.banner) return;
        try { if (sessionStorage.getItem('gb-ban7') === state.id) return; } catch (e) { }
        var b = theme.banner;
        state.banner = document.createElement('div');
        state.banner.className = 'gb-fbanner';
        state.banner.style.background = b.bg;
        state.banner.style.border = '1px solid ' + b.border;
        state.banner.style.color = b.color;
        state.banner.innerHTML =
            '<div class="gb-fbanner-title">' + b.text + '</div>' +
            '<div class="gb-fbanner-sub">' + b.sub + '</div>' +
            '<div class="gb-fbanner-shimmer"></div>';
        document.body.appendChild(state.banner);
        setTimeout(function () {
            if (state.banner) {
                state.banner.style.animation = 'gb-fbannerhide 0.6s ease forwards';
                var ref = state.banner;
                setTimeout(function () { if (ref && ref.parentNode) ref.remove(); }, 600);
                state.banner = null;
                try { sessionStorage.setItem('gb-ban7', state.id); } catch (e) { }
            }
        }, 10000);
    }

    /* ═══════════════════════════════════════════
       STRING LIGHTS (Christmas)
    ═══════════════════════════════════════════ */
    function createLights() {
        if (isMobile) return;
        var el = document.createElement('div');
        el.className = 'gb-lights';
        var n = 18, m = 5;
        var colors = [
            { bg: 'rgba(255,245,220,0.9)', gc: 'rgba(255,245,220,0.5)' },
            { bg: 'rgba(220,55,55,0.9)', gc: 'rgba(220,55,55,0.45)' },
            { bg: 'rgba(212,175,55,0.9)', gc: 'rgba(212,175,55,0.45)' },
            { bg: 'rgba(70,160,70,0.9)', gc: 'rgba(70,160,70,0.4)' },
            { bg: 'rgba(70,130,220,0.88)', gc: 'rgba(70,130,220,0.38)' }
        ];
        var pts = [];
        for (var i = 0; i < n; i++) {
            var pct = m + (i / (n - 1)) * (100 - 2 * m);
            var droop = Math.sin((i / (n - 1)) * Math.PI) * 22;
            pts.push((pct * 10) + ',' + (5 + droop));
        }
        el.innerHTML = '<svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 1000 65" preserveAspectRatio="none"><polyline points="' + pts.join(' ') + '" stroke="rgba(80,80,80,0.35)" stroke-width="1.5" fill="none"/></svg>';
        for (var i = 0; i < n; i++) {
            var pct = m + (i / (n - 1)) * (100 - 2 * m);
            var droop = Math.sin((i / (n - 1)) * Math.PI) * 22;
            var c = colors[i % colors.length];
            var yp = 8 + droop * 0.33;
            var cap = document.createElement('div'); cap.className = 'gb-cap'; cap.style.left = pct + '%'; cap.style.top = yp + '%'; el.appendChild(cap);
            var bulb = document.createElement('div'); bulb.className = 'gb-bulb'; bulb.style.left = pct + '%'; bulb.style.top = (yp + 5) + '%'; bulb.style.background = c.bg; bulb.style.setProperty('--gc', c.gc); bulb.style.animationDelay = (i * 0.2) + 's'; el.appendChild(bulb);
        }
        document.body.appendChild(el);
        state.extraEls.push(el);
    }

    /* ═══════════════════════════════════════════
       CORNER SVG DECORATIONS
    ═══════════════════════════════════════════ */
    var HOLLY = '<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5 Q50 10,80 40 Q100 60,115 95 Q125 115,130 145" stroke="#2d5a27" stroke-width="2.5" fill="none" opacity="0.5"/><path d="M5 12 Q15 2,30 5 Q40-2,50 8 Q58 2,55 16 Q44 24,34 18 Q24 26,18 16 Q8 20,5 12Z" fill="#1a472a" opacity="0.85"/><path d="M30 28 Q42 18,56 25 Q66 16,72 28 Q78 22,74 36 Q64 44,54 38 Q44 46,38 36 Q28 40,30 28Z" fill="#1a472a" opacity="0.8"/><path d="M62 52 Q74 42,88 50 Q96 42,100 54 Q106 48,102 62 Q92 70,82 64 Q72 72,66 62 Q56 66,62 52Z" fill="#2d5a27" opacity="0.7"/><circle cx="38" cy="14" r="5.5" fill="#C62828"/><circle cx="32" cy="10" r="4.5" fill="#D32F2F"/><circle cx="36" cy="20" r="5" fill="#B71C1C"/><circle cx="36" cy="12" r="1.8" fill="#E57373" opacity="0.5"/><circle cx="60" cy="36" r="4.5" fill="#C62828"/><circle cx="55" cy="32" r="4" fill="#D32F2F"/></svg>';
    var COBWEB = '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0L200 0" stroke="rgba(255,255,255,0.18)" stroke-width="1"/><path d="M0 0L0 200" stroke="rgba(255,255,255,0.18)" stroke-width="1"/><path d="M0 0L190 190" stroke="rgba(255,255,255,0.14)" stroke-width="0.8"/><path d="M0 0L95 200" stroke="rgba(255,255,255,0.1)" stroke-width="0.6"/><path d="M0 0L200 95" stroke="rgba(255,255,255,0.1)" stroke-width="0.6"/><path d="M25 0Q25 25,0 25" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" fill="none"/><path d="M55 0Q55 55,0 55" stroke="rgba(255,255,255,0.13)" stroke-width="0.6" fill="none"/><path d="M90 0Q90 90,0 90" stroke="rgba(255,255,255,0.1)" stroke-width="0.6" fill="none"/><path d="M130 0Q130 130,0 130" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" fill="none"/><path d="M175 0Q175 175,0 175" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" fill="none"/></svg>';

    function createCorners(type) {
        var svg = type === 'holly' ? HOLLY : type === 'cobweb' ? COBWEB : null;
        if (!svg) return;
        var size = type === 'holly' ? (isMobile ? 110 : 170) : (isMobile ? 130 : 210);
        var el = document.createElement('div');
        el.className = 'gb-corner'; el.style.width = size + 'px'; el.style.height = size + 'px'; el.style.top = '0'; el.style.left = '0';
        el.innerHTML = svg; document.body.appendChild(el); state.cornerEls.push(el);
        if (type === 'cobweb') {
            var el2 = document.createElement('div');
            el2.className = 'gb-corner'; el2.style.width = (size * 0.65) + 'px'; el2.style.height = (size * 0.65) + 'px'; el2.style.top = '0'; el2.style.right = '0'; el2.style.transform = 'scaleX(-1)';
            el2.innerHTML = svg; document.body.appendChild(el2); state.cornerEls.push(el2);
        }
    }

    /* ═══════════════════════════════════════════
       SANTA HAT – Bigger, better positioned
    ═══════════════════════════════════════════ */
    var HAT_SVG = '<svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ghf" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#E53935"/><stop offset="40%" stop-color="#D32F2F"/><stop offset="100%" stop-color="#B71C1C"/></linearGradient><radialGradient id="gpm" cx=".4" cy=".35" r=".6"><stop offset="0%" stop-color="#fff"/><stop offset="60%" stop-color="#F5F5F5"/><stop offset="100%" stop-color="#E0E0E0"/></radialGradient><linearGradient id="gfb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="40%" stop-color="#FAFAFA"/><stop offset="100%" stop-color="#EEE"/></linearGradient></defs><path d="M18 72C22 42,38 18,58 6c4-3,9-2,8 4-4 18,6 42,18 62Z" fill="url(#ghf)"/><path d="M28 68C32 44,44 22,58 10 52 30,50 48,54 68Z" fill="#E53935" opacity=".45"/><path d="M10 70C10 62,25 57,50 57s40 5,40 13c0 10-15 14-40 14S10 80,10 70Z" fill="url(#gfb)"/><circle cx="62" cy="8" r="10" fill="url(#gpm)"/><circle cx="59" cy="5" r="3.5" fill="#fff" opacity=".7"/></svg>';

    function addHats() {
        document.querySelectorAll('.nav-logo').forEach(function (logo) {
            logo.style.position = 'relative'; logo.style.overflow = 'visible';
            var h = document.createElement('div'); h.className = 'gb-hat';
            h.style.width = '38px'; h.style.height = '34px'; h.style.top = '-20px'; h.style.left = '4px';
            h.style.setProperty('--hr', '16deg');
            h.innerHTML = HAT_SVG; h.querySelector('svg').style.cssText = 'width:100%;height:100%';
            logo.appendChild(h); state.hatEls.push(h);
        });
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) {
            hero.style.overflow = 'visible';
            var bh = document.createElement('div'); bh.className = 'gb-hat';
            bh.style.width = '110px'; bh.style.height = '98px'; bh.style.top = '-42px'; bh.style.left = '50%'; bh.style.marginLeft = '-15px';
            bh.style.setProperty('--hr', '14deg');
            bh.innerHTML = HAT_SVG; bh.querySelector('svg').style.cssText = 'width:100%;height:100%';
            hero.appendChild(bh); state.hatEls.push(bh);
        }
    }

    /* ═══════════════════════════════════════════
       LOGO GLOW
    ═══════════════════════════════════════════ */
    function applyGlow(theme) {
        if (!theme.neon) return;
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) {
            if (!state.savedNeon) state.savedNeon = { border: hero.style.border, boxShadow: hero.style.boxShadow };
            hero.style.border = theme.neon.border; hero.style.boxShadow = theme.neon.shadow; hero.style.transition = 'border 1.5s,box-shadow 1.5s';
        }
        if (theme.navGlow) {
            document.querySelectorAll('.nav-logo img').forEach(function (img) {
                if (!state.savedNavGlow) state.savedNavGlow = img.style.boxShadow || '';
                img.style.boxShadow = theme.navGlow; img.style.transition = 'box-shadow 1.5s';
            });
        }
    }
    function removeGlow() {
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero && state.savedNeon) { hero.style.border = ''; hero.style.boxShadow = ''; hero.style.transition = ''; }
        state.savedNeon = null;
        document.querySelectorAll('.nav-logo img').forEach(function (img) { img.style.boxShadow = ''; img.style.transition = ''; });
        state.savedNavGlow = null;
    }

    /* ═══════════════════════════════════════════
       EXTRAS: Fog, Frost, Sparkle, NeonFlash
    ═══════════════════════════════════════════ */
    function createFog() {
        ['a', 'b'].forEach(function (x) {
            var el = document.createElement('div'); el.className = 'gb-fog gb-fog-' + x;
            document.body.appendChild(el); state.extraEls.push(el);
        });
    }
    function createFrost() {
        ['tl', 'tr', 'bl', 'br'].forEach(function (p) {
            var el = document.createElement('div'); el.className = 'gb-frost gb-frost-' + p;
            document.body.appendChild(el); state.extraEls.push(el);
        });
    }
    function createSparkles() {
        var n = isMobile ? 18 : 40;
        for (var i = 0; i < n; i++) {
            var el = document.createElement('div'); el.className = 'gb-sparkle';
            var s = rand(2, 5); el.style.width = s + 'px'; el.style.height = s + 'px';
            el.style.left = rand(2, 98) + '%'; el.style.top = rand(2, 95) + '%';
            el.style.background = Math.random() > 0.5 ? '#FDD835' : '#FFF9C4';
            el.style.setProperty('--sd', rand(2, 5).toFixed(1) + 's');
            el.style.setProperty('--op', rand(0.25, 0.6).toFixed(2));
            el.style.animationDelay = rand(0, 4).toFixed(1) + 's';
            document.body.appendChild(el); state.extraEls.push(el);
        }
    }
    function createNeonFlash() {
        var el = document.createElement('div'); el.className = 'gb-nflash';
        el.style.background = 'radial-gradient(ellipse at 50% 50%,rgba(255,23,68,0.15) 0%,transparent 70%)';
        document.body.appendChild(el); state.extraEls.push(el);
    }
    function createVignette(bg) {
        var el = document.createElement('div'); el.className = 'gb-vignette'; el.style.background = bg;
        document.body.appendChild(el); state.extraEls.push(el);
    }

    /* ═══════════════════════════════════════════
       TOAST
    ═══════════════════════════════════════════ */
    function createToast(theme) {
        try { if (sessionStorage.getItem('gb-dis7') === state.id) return; } catch (e) { }
        var t = theme.toast; if (!t) return;
        state.toast = document.createElement('div'); state.toast.className = 'gb-toast';
        state.toast.style.background = t.bg; state.toast.style.color = t.color;
        state.toast.innerHTML = '<div class="gb-toast-in"><div><div class="gb-toast-t">' + t.title + '</div><div class="gb-toast-s">' + t.sub + '</div></div></div><div class="gb-toast-bar"></div><button class="gb-toast-x" aria-label="Close">&times;</button>';
        document.body.appendChild(state.toast);
        state.toast.querySelector('.gb-toast-x').addEventListener('click', dismissToast);
        setTimeout(function () { if (state.toast) dismissToast(); }, 8000);
    }
    function dismissToast() {
        if (!state.toast) return;
        state.toast.style.animation = 'gb-tout .4s ease forwards';
        var r = state.toast; setTimeout(function () { if (r && r.parentNode) r.remove(); }, 400);
        state.toast = null; try { sessionStorage.setItem('gb-dis7', state.id); } catch (e) { }
    }

    /* ═══════════════════════════════════════════
       TOP BORDER + NAV LINE
    ═══════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════
       MAIN API
    ═══════════════════════════════════════════ */
    function apply(data) {
        if (!data || !data.themeId) { remove(); return; }
        var theme = getTheme(data.themeId);
        if (!theme) { remove(); return; }
        if (state.id === data.themeId && state.canvas) return;
        remove();
        state.id = data.themeId;
        injectCSS();

        applyGlow(theme);
        createBokeh(theme);
        initCanvas(); spawnParticles(theme); animateParticles();
        if (theme.corner) createCorners(theme.corner);
        if (theme.fog) createFog();
        if (theme.frost) createFrost();
        if (theme.sparkleField) createSparkles();
        if (theme.neonFlash) createNeonFlash();
        if (theme.vignette) createVignette(theme.vignette);
        if (theme.lights) createLights();
        if (theme.hat) addHats();
        createBanner(theme);
        createToast(theme);
        createBorder(theme);
        createNavLine(theme);
    }

    function remove() {
        if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; }
        if (state.canvas) { state.canvas.remove(); state.canvas = null; state.ctx = null; }
        state.particles = [];
        state.bokehEls.forEach(function (e) { e.remove(); }); state.bokehEls = [];
        state.cornerEls.forEach(function (e) { e.remove(); }); state.cornerEls = [];
        state.extraEls.forEach(function (e) { e.remove(); }); state.extraEls = [];
        if (state.banner) { state.banner.remove(); state.banner = null; }
        if (state.toast) { state.toast.remove(); state.toast = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        if (state.navLine) { state.navLine.remove(); state.navLine = null; }
        state.hatEls.forEach(function (e) { if (e.parentNode) e.remove(); }); state.hatEls = [];
        document.querySelectorAll('.nav-logo').forEach(function (l) { l.style.removeProperty('position'); l.style.removeProperty('overflow'); });
        var hero = document.querySelector('.showcase-neon-circle'); if (hero) hero.style.removeProperty('overflow');
        removeGlow();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };
})();
