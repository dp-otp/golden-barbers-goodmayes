/**
 * Golden Barbers – Premium Seasonal Theme Effects (Renovated Final)
 * Real PNG images + Twemoji SVGs, hero overlay banners, full connotations.
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

    /* ═══════════════════════════════════════════
       IMAGE ASSETS
       Real PNGs from theme-assets/ folder +
       Twemoji SVGs inline for missing items
    ═══════════════════════════════════════════ */
    var IMG = {
        santaHat: 'theme-assets/santa-hat.png',
        candyCane: 'theme-assets/candy-cane.png',
        heart: 'theme-assets/heart.png',
        rose: 'theme-assets/rose.png',
        sunglasses: 'theme-assets/sunglasses.png',
        bat: 'theme-assets/bat.png',
        snowflake: 'theme-assets/snowflake2.png',
        crescentMoon: 'theme-assets/crescent-moon.png',
        easterEgg: 'theme-assets/easter-egg.png',
        lantern: 'theme-assets/lantern.png',
        bunny: 'theme-assets/bunny.png'
    };

    // Twemoji SVGs (inline, high-quality, scalable) for items without real PNGs
    var ESVG = {};
    ESVG.pumpkin = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#F4900C" d="M32.664 8.519C29.364 5.134 23.42 4.75 18 4.75S6.636 5.134 3.336 8.519C.582 11.344 0 15.751 0 19.791c0 5.263 1.982 11.311 6.357 14.244C9.364 36.051 13.95 35.871 18 35.871s8.636.18 11.643-1.836C34.018 31.101 36 25.054 36 19.791c0-4.04-.582-8.447-3.336-11.272z"/><path fill="#3F7123" d="M20.783 5.444c.069.42-.222.764-.647.764h-4.451c-.426 0-.717-.344-.647-.764l.745-4.472c.07-.421.476-.764.902-.764h2.451c.426 0 .832.344.901.764l.746 4.472z"/><path fill="#642116" d="M20.654 21.159l-1.598-2.596c-.291-.542-.673-.813-1.057-.817-.383.004-.766.275-1.057.817l-1.598 2.596c-.587 1.093.873 1.716 2.654 1.716s3.243-.624 2.656-1.716z"/></svg>';
    ESVG.spiderWeb = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g stroke="rgba(255,255,255,.18)" fill="none" stroke-linecap="round"><line x1="0" y1="0" x2="200" y2="0" stroke-width="1.2"/><line x1="0" y1="0" x2="0" y2="200" stroke-width="1.2"/><line x1="0" y1="0" x2="190" y2="190" stroke-width=".9"/><line x1="0" y1="0" x2="95" y2="200" stroke-width=".7"/><line x1="0" y1="0" x2="200" y2="95" stroke-width=".7"/><path d="M30 0Q30 30,0 30" stroke-width=".8"/><path d="M65 0Q65 65,0 65" stroke-width=".7"/><path d="M105 0Q105 105,0 105" stroke-width=".6"/><path d="M150 0Q150 150,0 150" stroke-width=".5"/><path d="M190 0Q190 190,0 190" stroke-width=".4"/></g><circle cx="3" cy="3" r="3" fill="rgba(255,255,255,.15)"/></svg>';
    ESVG.fireworks = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#269" d="M36 32c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V4c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v28z"/><path fill="#55ACEE" d="M18 2.249L21.751 6H27v5.249L30.751 15 27 18.751V24h-5.249L18 27.751 14.249 24H9v-5.249L5.249 15 9 11.249V6h5.249z"/><path fill="#FFD983" d="M15 15zm3-10.406l2.234 5.069 4.852-1.417-1.418 4.851 6.486 2.235-6.486 2.234 1.418 4.851L20.234 21 18 33.154 15.765 21l-4.85 1.417 1.417-4.851-6.487-2.234 6.487-2.235-1.417-4.851 4.85 1.417z"/><circle fill="#F5F8FA" cx="18" cy="15" r="3"/></svg>';
    ESVG.champagne = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#264612" d="M34.9 23.787l-5.067-5.067c-3.664-3.664-7.322-4.14-14.358-6.945l-3.149 3.149c3.231 6.61 3.236 10.739 6.9 14.403l5.068 5.068c.993.993 1.787 1.81 2.782.816l8.409-8.412c.996-.996.408-2.019-.585-3.012z"/><path fill="#FFE8B6" d="M16.205 12.164s1.739.644-.56 2.943c-2.122 2.122-2.917.651-2.917.651l-3.447-3.447 3.536-3.536 3.388 3.389z"/><path fill="#FFE8B6" d="M28.373 20.089c-.781-.78-2.048-.78-2.829 0l-4.949 4.95c-.781.78-.781 2.047 0 2.828l4.242 4.242c.781.781 2.048.781 2.829 0l4.949-4.949c.781-.781.781-2.048 0-2.828l-4.242-4.243z"/><circle fill="#CCD6DD" cx="7.189" cy="27.5" r="1.5"/><path fill="#CCD6DD" d="M9.609 13.234c.051-.237.08-.482.08-.734 0-1.933-1.567-3.5-3.5-3.5-1.764 0-3.208 1.308-3.45 3.005-.017 0-.033-.005-.05-.005-1.104 0-2 .896-2 2s.896 2 2 2c.033 0 .063-.008.095-.01-.058.16-.095.33-.095.51 0 .46.212.867.539 1.143-.332.357-.539.831-.539 1.357 0 1.104.896 2 2 2 0 .375.11.721.289 1.021-.727.103-1.289.723-1.289 1.479 0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5c0-.18-.037-.35-.095-.51.032.002.062.01.095.01 1.104 0 2-.896 2-2 0-.601-.27-1.133-.69-1.5.419-.367.69-.899.69-1.5 0-.378-.111-.728-.294-1.03.097.015.193.03.294.03 1.104 0 2-.896 2-2 0-.771-.441-1.432-1.08-1.766z"/></svg>';
    ESVG.topHat = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#31373D" d="M30.198 27.385L32 3.816c0-.135-.008-.263-.021-.373.003-.033.021-.075.021-.11C32 1.529 25.731.066 18 .066c-7.732 0-14 1.462-14 3.267 0 .035.017.068.022.102-.014.11-.022.23-.022.365l1.802 23.585C2.298 28.295 0 29.576 0 31c0 2.762 8.611 5 18 5s18-2.238 18-5c0-1.424-2.298-2.705-5.802-3.615z"/><path fill="#744EAA" d="M30.198 27.385l.446-5.829c-7.705 2.157-17.585 2.207-25.316-.377l.393 5.142c.069.304.113.65.113 1.076 0 1.75 1.289 2.828 2.771 3.396 4.458 1.708 13.958 1.646 18.807.149 1.467-.453 2.776-1.733 2.776-3.191 0-.119.015-.241.024-.361l-.014-.005z"/></svg>';
    ESVG.palmTree = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#C1694F" d="M21.978 20.424c-.054-.804-.137-1.582-.247-2.325-.133-.89-.299-1.728-.485-2.513-.171-.723-.356-1.397-.548-2.017-.288-.931-.584-1.738-.852-2.4-.527-1.299-.943-2.043-.943-2.043l-3.613.466s.417.87.868 2.575c.183.692.371 1.524.54 2.495.086.49.166 1.012.238 1.573.1.781.183 1.632.242 2.549.034.518.058 1.058.074 1.619.006.204.015.401.018.611.01.656-.036 1.323-.118 1.989-.074.6-.182 1.197-.311 1.789-.185.848-.413 1.681-.67 2.475-.208.643-.431 1.261-.655 1.84-.344.891-.69 1.692-.989 2.359-.502 1.119-.871 1.863-.871 2.018 0 .49.35 1.408 2.797 2.02 3.827.956 4.196-.621 4.196-.621s.243-.738.526-2.192c.14-.718.289-1.605.424-2.678.081-.642.156-1.348.222-2.116.068-.8.125-1.667.165-2.605.03-.71.047-1.47.055-2.259.002-.246.008-.484.008-.737 0-.64-.03-1.261-.071-1.872z"/><path fill="#3E721D" d="M32.61 4.305c-.044-.061-4.48-5.994-10.234-3.39-2.581 1.167-4.247 3.074-4.851 5.535-1.125-1.568-2.835-2.565-5.093-2.968C6.233 2.376 2.507 9.25 2.47 9.32c-.054.102-.031.229.056.305s.217.081.311.015c.028-.02 2.846-1.993 7.543-1.157 4.801.854 8.167 1.694 8.201 1.702.02.005.041.007.061.007.069 0 .136-.028.184-.08.032-.035 3.22-3.46 6.153-4.787 4.339-1.961 7.298-.659 7.326-.646.104.046.227.018.298-.07.072-.087.075-.213.007-.304z"/><path fill="#5C913B" d="M27.884 7.63c-4.405-2.328-7.849-1.193-9.995.22-2.575-.487-7.334-.459-11.364 4.707-4.983 6.387-.618 14.342-.573 14.422.067.119.193.191.327.191.015 0 .031-.001.046-.003.151-.019.276-.127.316-.274.015-.054 1.527-5.52 5.35-10.118 2.074-2.496 4.55-4.806 6.308-6.34 1.762.298 4.327.947 6.846 2.354 4.958 2.773 7.234 7.466 7.257 7.513.068.144.211.226.379.212.158-.018.289-.133.325-.287.02-.088 1.968-8.8-5.222-12.597z"/></svg>';
    ESVG.priceTag = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFD983" d="M32.017 20.181L17.345 5.746C16.687 5.087 15.823 5 14.96 5H4.883C3.029 5 2 6.029 2 7.883v10.082c0 .861.089 1.723.746 2.38L17.3 35.017c1.311 1.31 3.378 1.31 4.688 0l10.059-10.088c1.31-1.312 1.28-3.438-.03-4.748zm-23.596-8.76c-.585.585-1.533.585-2.118 0s-.586-1.533 0-2.118c.585-.586 1.533-.585 2.118 0 .585.586.586 1.533 0 2.118z"/><path fill="#D99E82" d="M9.952 7.772c-1.43-1.431-3.749-1.431-5.179 0-1.431 1.43-1.431 3.749 0 5.18 1.43 1.43 3.749 1.43 5.18 0 1.43-1.431 1.429-3.749-.001-5.18zm-1.53 3.65c-.585.585-1.534.585-2.119 0-.585-.585-.586-1.534 0-2.119.585-.587 1.534-.585 2.119 0 .585.585.586 1.533 0 2.119z"/></svg>';
    ESVG.mosque = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#F4900C" d="M23 4.326c0 4.368-9.837 6.652-9.837 13.206 0 2.184 1.085 4.468 2.177 4.468h15.291c1.093 0 2.192-2.284 2.192-4.468C32.823 10.977 23 8.694 23 4.326z"/><path fill="#FFD983" d="M35 33.815C35 35.022 34.711 36 32.815 36h-19.66C11.26 36 11 35.022 11 33.815V22.894c0-1.206.26-1.894 2.156-1.894h19.66c1.895 0 2.184.688 2.184 1.894v10.921z"/><path fill="#662113" d="M26 29c0-3-1.896-5-3-5s-3 2-3 5v7h6v-7zm-8 2.333c0-2-1.264-3.333-2-3.333s-2 1.333-2 3.333V36h4v-4.667zm14 0c0-2-1.264-3.333-2-3.333s-2 1.333-2 3.333V36h4v-4.667z"/><path fill="#FFD983" d="M9 34c0 1.104-.896 2-2 2H5c-1.104 0-2-.896-2-2V8c0-1.104.896-2 2-2h2c1.104 0 2 .896 2 2v26z"/><path fill="#F4900C" d="M5.995.326c0 1.837-2.832 2.918-2.832 5.675 0 .919.312 2 .627 2h4.402c.314 0 .631-1.081.631-2 0-2.757-2.828-3.838-2.828-5.675z"/></svg>';
    ESVG.gift = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FDD888" d="M33 31c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V14c0-2.2 1.8-4 4-4h22c2.2 0 4 1.8 4 4v17z"/><path fill="#FDD888" d="M36 11c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4s1.8-4 4-4h28c2.2 0 4 1.8 4 4z"/><path fill="#DA2F47" d="M19 3h-2c-1.657 0-3 1.343-3 3v29h8V6c0-1.656-1.343-3-3-3z"/><path fill="#DA2F47" d="M16 7c1.1 0 1.263-.516.361-1.147L9.639 1.147c-.902-.631-2.085-.366-2.631.589L4.992 5.264C4.446 6.219 4.9 7 6 7h10zm4 0c-1.1 0-1.263-.516-.361-1.147l6.723-4.706c.901-.631 2.085-.366 2.631.589l2.016 3.527C31.554 6.219 31.1 7 30 7H20z"/></svg>';

    // Custom detailed SVGs for items without real PNGs or emoji
    var CSVG = {};
    CSVG.mistletoe = '<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mberry" cx=".35" cy=".3" r=".65"><stop offset="0%" stop-color="#fff" stop-opacity=".6"/><stop offset="100%" stop-color="#f5f5f5"/></radialGradient><linearGradient id="mleaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a8c3f"/><stop offset="100%" stop-color="#2d5a27"/></linearGradient><linearGradient id="mbow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/></linearGradient></defs><g transform="translate(60,20)"><ellipse cx="-18" cy="10" rx="22" ry="8" fill="url(#mleaf)" transform="rotate(-35 -18 10)"/><path d="M-18 10L-18 2" stroke="#2d5a27" stroke-width=".8" opacity=".5"/><ellipse cx="18" cy="10" rx="22" ry="8" fill="url(#mleaf)" transform="rotate(35 18 10)"/><path d="M18 10L18 2" stroke="#2d5a27" stroke-width=".8" opacity=".5"/><ellipse cx="-10" cy="30" rx="20" ry="7" fill="url(#mleaf)" transform="rotate(-20 -10 30)"/><ellipse cx="10" cy="30" rx="20" ry="7" fill="url(#mleaf)" transform="rotate(20 10 30)"/><ellipse cx="0" cy="18" rx="18" ry="7" fill="url(#mleaf)" transform="rotate(-5 0 18)"/><circle cx="-5" cy="42" r="5.5" fill="url(#mberry)" stroke="#ddd" stroke-width=".3"/><circle cx="5" cy="44" r="5" fill="url(#mberry)" stroke="#ddd" stroke-width=".3"/><circle cx="0" cy="36" r="4.5" fill="url(#mberry)" stroke="#ddd" stroke-width=".3"/><circle cx="-3" cy="42" r="1.5" fill="white" opacity=".4"/><circle cx="3" cy="44" r="1.2" fill="white" opacity=".35"/><path d="M-15 52C-15 52,-8 60,0 56C8 60,15 52,15 52" fill="url(#mbow)" stroke="#8e0000" stroke-width=".5"/><path d="M-12 54C-16 58,-18 64,-14 68L-8 60Z" fill="url(#mbow)"/><path d="M12 54C16 58,18 64,14 68L8 60Z" fill="url(#mbow)"/><line x1="0" y1="0" x2="0" y2="-12" stroke="#5a3a1a" stroke-width="2" stroke-linecap="round"/></g></svg>';
    CSVG.holly = '<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hleaf1" x1="0" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#2e7d32"/><stop offset="100%" stop-color="#1b5e20"/></linearGradient><radialGradient id="hberry" cx=".35" cy=".3" r=".65"><stop offset="0%" stop-color="#ef5350"/><stop offset="40%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/></radialGradient></defs><path d="M10 55C5 45,15 30,25 35C30 25,45 20,55 30C65 20,80 22,85 35C95 28,108 38,100 52C110 60,105 78,90 75C95 85,85 92,72 85C62 95,45 92,42 80C30 88,15 80,22 68C10 72,2 62,10 55Z" fill="url(#hleaf1)" opacity=".9"/><path d="M52 30L55 55L58 75" stroke="#1b5e20" stroke-width="1.5" fill="none" opacity=".4"/><path d="M25 38L45 50L72 82" stroke="#1b5e20" stroke-width="1" fill="none" opacity=".3"/><path d="M85 38L65 52L45 78" stroke="#1b5e20" stroke-width="1" fill="none" opacity=".3"/><circle cx="50" cy="55" r="8" fill="url(#hberry)"/><circle cx="62" cy="50" r="7" fill="url(#hberry)"/><circle cx="55" cy="64" r="6.5" fill="url(#hberry)"/><circle cx="47" cy="53" r="2.5" fill="white" opacity=".3"/><circle cx="59" cy="48" r="2" fill="white" opacity=".25"/><circle cx="52" cy="62" r="2" fill="white" opacity=".25"/></svg>';
    CSVG.ornament = '<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="oball" cx=".35" cy=".3" r=".7"><stop offset="0%" stop-color="#ef5350"/><stop offset="40%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/></radialGradient><linearGradient id="ocap"><stop offset="0%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#f9a825"/></linearGradient></defs><circle cx="40" cy="62" r="38" fill="url(#oball)"/><ellipse cx="30" cy="50" rx="12" ry="18" fill="white" opacity=".12" transform="rotate(-20 30 50)"/><rect x="33" y="18" width="14" height="10" rx="2" fill="url(#ocap)"/><rect x="36" y="14" width="8" height="6" rx="3" fill="url(#ocap)"/><circle cx="40" cy="12" r="4" fill="none" stroke="#d4af37" stroke-width="2"/><path d="M25 62C25 62,40 48,55 62" stroke="rgba(255,255,255,.15)" stroke-width="1.5" fill="none"/><path d="M22 72C22 72,40 58,58 72" stroke="rgba(255,255,255,.1)" stroke-width="1" fill="none"/></svg>';
    CSVG.witchHat = '<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="what" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#4a148c"/><stop offset="100%" stop-color="#1a0530"/></linearGradient></defs><path d="M50 2C48 2,35 50,22 78h56C65 50,52 2,50 2Z" fill="url(#what)"/><path d="M50 2C52 15,44 45,35 70h30C56 45,53 15,50 2Z" fill="#6a1b9a" opacity=".25"/><ellipse cx="50" cy="80" rx="46" ry="10" fill="url(#what)"/><ellipse cx="50" cy="78" rx="42" ry="8" fill="#2a0845"/><rect x="30" y="68" width="40" height="8" rx="1" fill="#FF6F00" opacity=".85"/><rect x="42" y="66" width="16" height="12" rx="2" fill="#FFB300"/><path d="M50 2Q55 8,48 20Q58 18,50 2Z" fill="#6a1b9a" opacity=".4"/></svg>';

    // Banner icon SVGs (small, 22x22)
    var BI = {
        christmas: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3L2 9.2h7.6z" fill="#FFD700"/></svg>',
        valentines: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21C5.5 15.5 3 12 3 8.5 3 5.4 5.4 3 8 3c1.6 0 3 .8 4 2.1C13 3.8 14.4 3 16 3c2.6 0 5 2.4 5 5.5 0 3.5-2.5 7-9 12.5z" fill="#E91E63"/></svg>',
        winter: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#64B5F6" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/></svg>',
        halloween: '<svg viewBox="0 0 24 24" width="22" height="22"><ellipse cx="12" cy="14" rx="9" ry="8" fill="#FF6F00"/><rect x="11" y="4" width="2" height="5" rx="1" fill="#2E7D32"/><circle cx="9" cy="13" r="1.3" fill="#1a0800"/><circle cx="15" cy="13" r="1.3" fill="#1a0800"/><path d="M9 17c2 1.5 4 1.5 6 0" stroke="#1a0800" stroke-width="1" fill="none"/></svg>',
        easter: '<svg viewBox="0 0 24 24" width="22" height="22"><ellipse cx="12" cy="13" rx="7" ry="9" fill="#81C784" opacity=".85"/><path d="M5.5 11h13" stroke="#F48FB1" stroke-width="2.5"/><path d="M6 16h12" stroke="#FFF59D" stroke-width="2"/></svg>',
        summer: '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="4.5" fill="#FFB300"/><g stroke="#FFB300" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2.5" x2="12" y2="5.5"/><line x1="12" y1="18.5" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5.5" y2="12"/><line x1="18.5" y1="12" x2="21.5" y2="12"/></g></svg>',
        eid: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M14 3a8 8 0 11-6 14.5A7 7 0 0014 3z" fill="#FDD835"/><path d="M17 8l.8 2.5h2.6l-2.1 1.5.8 2.5-2.1-1.5-2.1 1.5.8-2.5-2.1-1.5h2.6z" fill="#FDD835"/></svg>',
        ramadan: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#B8860B" stroke-width="1.3"><path d="M8 5h8l-1 3H9z"/><rect x="9" y="8" width="6" height="2.5" rx=".5"/><path d="M7.5 10.5h9L18 20H6z"/><ellipse cx="12" cy="2.5" rx="1" ry=".8" fill="#FFD54F" stroke="none"/></svg>',
        'black-friday': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FF1744" stroke-width="1.8"><path d="M20.6 8.6l-7.2 7.2a2 2 0 01-2.8 0L3 8.2V3h5.2l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5" fill="#FF1744" stroke="none"/></svg>',
        'new-year': '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="2.5" fill="#FFD700" stroke="none"/></svg>'
    };
    BI.blackfriday = BI['black-friday']; BI.newyear = BI['new-year'];

    /* ═══ CANVAS DRAW FUNCTIONS ═══ */
    function snowflake(x, y, r) {
        var c = state.ctx; c.save(); c.translate(x, y);
        c.strokeStyle = 'rgba(255,255,255,' + Math.min(0.3 + r * 0.08, 0.8) + ')';
        c.lineWidth = r > 3.5 ? 1 : 0.7; c.lineCap = 'round';
        for (var i = 0; i < 6; i++) {
            c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -r);
            if (r > 2.5) { c.moveTo(0, -r * .55); c.lineTo(-r * .3, -r * .75); c.moveTo(0, -r * .55); c.lineTo(r * .3, -r * .75); }
            c.stroke(); c.rotate(Math.PI / 3);
        }
        c.restore();
    }
    function heart(x, y, s, col) {
        var c = state.ctx; c.save(); c.translate(x, y); c.scale(s / 16, s / 16);
        c.beginPath(); c.moveTo(0, 3); c.bezierCurveTo(-1, -2, -8, -4, -8, 0); c.bezierCurveTo(-8, 5, 0, 10, 0, 14);
        c.moveTo(0, 3); c.bezierCurveTo(1, -2, 8, -4, 8, 0); c.bezierCurveTo(8, 5, 0, 10, 0, 14);
        c.fillStyle = col; c.shadowBlur = s * .5; c.shadowColor = col; c.fill(); c.restore();
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
        c.fillStyle = col; c.shadowBlur = 6; c.shadowColor = col; c.fill(); c.restore();
    }

    /* ═══ BOTTOM SILHOUETTES (custom SVGs, keep inline) ═══ */
    var SILHOUETTE = {};
    SILHOUETTE.graveyard = '<svg viewBox="0 0 800 55" preserveAspectRatio="none"><path d="M0 55V48h40V28c0-8 7-14 14-14s14 6 14 14v20h60V32c0-6 5-11 11-11s11 5 11 11v16h80V35c0-10 8-18 18-18s18 8 18 18v13h60V30c0-8 7-14 14-14s14 6 14 14v18h55V40h10V22c0-5 4-9 9-9s9 4 9 9v18h10v8h70V42c0-7 6-13 13-13s13 6 13 13v6h55V32c0-10 8-18 18-18s18 8 18 18v16h50V55z" fill="rgba(20,0,35,.5)"/></svg>';
    SILHOUETTE.waves = '<svg viewBox="0 0 800 40" preserveAspectRatio="none"><path d="M0 40V25c30-10 60-10 90 0s60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 55-10 80 0V40z" fill="rgba(2,136,209,.12)"/><path d="M0 40V32c25-7 50-7 75 0s50 7 75 0 50-7 75 0 50 7 75 0 50-7 75 0 50 7 75 0 50-7 75 0 50 7 75 0 50-7 80 0V40z" fill="rgba(2,136,209,.07)"/></svg>';
    SILHOUETTE.grass = '<svg viewBox="0 0 800 30" preserveAspectRatio="none"><path d="M0 30V22l5-8 5 8 8-12 6 12 4-6 5 6 7-10 6 10 5-7 4 7 8-14 5 14 6-9 5 9 4-5 5 5 7-11 6 11 5-8 4 8 8-13 5 13 6-7 5 7 4-10 5 10 7-12 6 12 5-6 4 6 8-9 5 9 6-11 5 11 4-8 5 8 7-10 6 10 5-7 4 7 8-12 5 12 6-8 5 8 4-6 5 6 7-9 6 9 5-10 5 10 7-12 6 12 5-6 4 6 8-14 5 14 6-9 5 9 4-5 5 5 7-11 6 11 5-8 4 8 8-13 5 13 6-7 5 7V30z" fill="rgba(129,199,132,.15)"/></svg>';

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
            banner: { bg: 'linear-gradient(135deg,#0d1f12 0%,#1a0808 50%,#0d1f12 100%)', accent: '#C62828', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(198,40,40,.15)', title: 'MERRY CHRISTMAS', titleColor: '#FFD700', sub: 'Wishing you joy & style this festive season!', timer: '#C62828' },
            topBorder: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 8px,transparent 8px,transparent 14px,#1B5E20 14px,#1B5E20 22px,transparent 22px,transparent 28px)',
            navLine: 'linear-gradient(90deg,transparent,#C62828,#d4af37,#1B5E20,transparent)',
            decor: [
                { type: 'img', src: IMG.candyCane, pos: 'tr', w: 55, h: 55, mw: 35, mh: 35, rotate: 15 },
                { type: 'svg', svg: 'holly', pos: 'tl', w: isMobile ? 80 : 130, h: isMobile ? 65 : 110 },
                { type: 'svg', svg: 'mistletoe', pos: 'tr-low', w: isMobile ? 55 : 85, h: isMobile ? 65 : 100, right: 60, top: 5 },
                { type: 'svg', svg: 'ornament', pos: 'bl', w: isMobile ? 35 : 55, h: isMobile ? 48 : 75 }
            ],
            heroHat: { type: 'img', src: IMG.santaHat }, lights: true
        },
        valentines: {
            particleType: 'hearts', particleCount: isMobile ? 8 : 16,
            bokeh: [
                { color: 'rgba(233,30,99,.06)', size: 190, x: 25, y: 25, blur: 65 },
                { color: 'rgba(244,143,177,.05)', size: 150, x: 70, y: 45, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(233,30,99,.55)', shadowMin: '0 0 20px rgba(233,30,99,.25),0 0 40px rgba(233,30,99,.1),inset 0 0 12px rgba(233,30,99,.05)', shadowMax: '0 0 35px rgba(233,30,99,.45),0 0 65px rgba(233,30,99,.2),inset 0 0 20px rgba(233,30,99,.1)', nav: '0 0 10px rgba(233,30,99,.15)' },
            banner: { bg: 'linear-gradient(135deg,#2a0815,#1f0d18)', accent: '#E91E63', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(233,30,99,.15)', title: "HAPPY VALENTINE'S", titleColor: '#F48FB1', sub: 'Look sharp for your special someone!', timer: '#E91E63' },
            topBorder: 'linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#F48FB1,#E91E63,#F48FB1,transparent)',
            decor: [
                { type: 'img', src: IMG.heart, pos: 'tr', w: 60, h: 60, mw: 40, mh: 40, rotate: -15 },
                { type: 'img', src: IMG.rose, pos: 'bl', w: 45, h: 100, mw: 30, mh: 70 }
            ]
        },
        winter: {
            particleType: 'snow', particleCount: isMobile ? 14 : 25,
            bokeh: [
                { color: 'rgba(100,180,246,.05)', size: 180, x: 20, y: 20, blur: 60 },
                { color: 'rgba(79,195,247,.04)', size: 160, x: 70, y: 40, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(100,180,246,.6)', shadowMin: '0 0 20px rgba(100,180,246,.3),0 0 40px rgba(79,195,247,.15),inset 0 0 12px rgba(100,180,246,.06)', shadowMax: '0 0 35px rgba(100,180,246,.5),0 0 65px rgba(79,195,247,.25),inset 0 0 20px rgba(100,180,246,.12)', nav: '0 0 10px rgba(100,180,246,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0a1628,#0d2137)', accent: '#64B5F6', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(100,181,246,.15)', title: 'WINTER WARMTH', titleColor: '#E1F5FE', sub: 'Warm up with a fresh new look', timer: '#64B5F6' },
            topBorder: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,.5),rgba(225,245,254,.8),rgba(79,195,247,.5),rgba(79,195,247,0))', topBorderShimmer: true,
            navLine: 'linear-gradient(90deg,transparent,rgba(79,195,247,.4),rgba(225,245,254,.7),rgba(79,195,247,.4),transparent)',
            decor: [
                { type: 'img', src: IMG.snowflake, pos: 'tr', w: 60, h: 60, mw: 40, mh: 40, opacity: .4 },
                { type: 'img', src: IMG.snowflake, pos: 'tl', w: 40, h: 40, mw: 25, mh: 25, opacity: .25, rotate: 45 }
            ],
            frost: true, hanging: 'icicles'
        },
        halloween: {
            particleType: 'embers', particleCount: isMobile ? 8 : 15,
            bokeh: [
                { color: 'rgba(255,111,0,.06)', size: 180, x: 20, y: 25, blur: 60 },
                { color: 'rgba(106,27,154,.05)', size: 160, x: 75, y: 40, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,111,0,.65)', shadowMin: '0 0 20px rgba(255,111,0,.3),0 0 40px rgba(106,27,154,.18),inset 0 0 12px rgba(255,111,0,.06)', shadowMax: '0 0 35px rgba(255,111,0,.5),0 0 65px rgba(106,27,154,.3),inset 0 0 20px rgba(255,111,0,.12)', nav: '0 0 10px rgba(255,111,0,.18)' },
            banner: { bg: 'linear-gradient(135deg,#1a0a2e,#2e1500)', accent: '#FF6F00', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(255,111,0,.15)', title: 'HAPPY HALLOWEEN', titleColor: '#FFE0B2', sub: 'Get a killer look this spooky season', timer: '#FF6F00' },
            topBorder: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)', topBorderGlow: 'rgba(255,111,0,.3)',
            navLine: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C,#FF6F00,#4A148C)',
            decor: [
                { type: 'esvg', svg: 'spiderWeb', pos: 'tl', w: isMobile ? 120 : 200, h: isMobile ? 120 : 200 },
                { type: 'img', src: IMG.bat, pos: 'tr', w: 50, h: 50, mw: 35, mh: 35, rotate: -10 },
                { type: 'esvg', svg: 'pumpkin', pos: 'bl', w: isMobile ? 40 : 60, h: isMobile ? 40 : 60 }
            ],
            bottom: 'graveyard', heroHat: { type: 'svg', svg: 'witchHat' }, fog: true,
            vignette: 'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.35) 100%)'
        },
        easter: {
            particleType: 'petals', particleCount: isMobile ? 8 : 16,
            bokeh: [
                { color: 'rgba(129,199,132,.05)', size: 170, x: 20, y: 30, blur: 55 },
                { color: 'rgba(244,143,177,.05)', size: 150, x: 75, y: 35, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(129,199,132,.55)', shadowMin: '0 0 20px rgba(129,199,132,.25),0 0 40px rgba(244,143,177,.12),inset 0 0 12px rgba(129,199,132,.05)', shadowMax: '0 0 35px rgba(129,199,132,.45),0 0 65px rgba(244,143,177,.2),inset 0 0 20px rgba(129,199,132,.1)', nav: '0 0 10px rgba(129,199,132,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0f1f0f,#1a0f1a)', accent: '#81C784', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(129,199,132,.15)', title: 'HAPPY EASTER', titleColor: '#C8E6C9', sub: 'Spring into a fresh new look!', timer: '#81C784' },
            topBorder: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px)',
            navLine: 'linear-gradient(90deg,#F48FB1,#81C784,#FFF59D,#81C784,#F48FB1)',
            decor: [
                { type: 'img', src: IMG.easterEgg, pos: 'bl', w: isMobile ? 80 : 130, h: isMobile ? 43 : 70 },
                { type: 'img', src: IMG.bunny, pos: 'tr', w: 50, h: 50, mw: 35, mh: 35 }
            ],
            bottom: 'grass', heroHat: { type: 'img', src: IMG.bunny, isBunny: true }
        },
        summer: {
            particleType: 'sparkle', particleCount: isMobile ? 8 : 15,
            bokeh: [
                { color: 'rgba(255,200,100,.07)', size: 200, x: 80, y: 10, blur: 75 },
                { color: 'rgba(2,136,209,.04)', size: 160, x: 20, y: 60, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,143,0,.55)', shadowMin: '0 0 20px rgba(255,143,0,.25),0 0 40px rgba(2,136,209,.12),inset 0 0 12px rgba(255,143,0,.05)', shadowMax: '0 0 35px rgba(255,143,0,.45),0 0 65px rgba(2,136,209,.2),inset 0 0 20px rgba(255,143,0,.1)', nav: '0 0 10px rgba(255,143,0,.15)' },
            banner: { bg: 'linear-gradient(135deg,#1f1200,#001520)', accent: '#FF8F00', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(255,143,0,.15)', title: 'SUMMER VIBES', titleColor: '#FFF3E0', sub: 'Stay fresh all summer long!', timer: '#FF8F00' },
            topBorder: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1,#FF8F00)',
            decor: [
                { type: 'esvg', svg: 'palmTree', pos: 'bl', w: isMobile ? 50 : 80, h: isMobile ? 80 : 130 }
            ],
            bottom: 'waves', heroHat: { type: 'img', src: IMG.sunglasses, isGlasses: true }
        },
        eid: {
            particleType: 'stars', particleCount: isMobile ? 8 : 16,
            bokeh: [
                { color: 'rgba(253,216,53,.06)', size: 190, x: 30, y: 20, blur: 65 },
                { color: 'rgba(46,125,50,.04)', size: 150, x: 70, y: 50, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(253,216,53,.7)', shadowMin: '0 0 20px rgba(253,216,53,.3),0 0 40px rgba(46,125,50,.12),inset 0 0 12px rgba(253,216,53,.06)', shadowMax: '0 0 35px rgba(253,216,53,.5),0 0 65px rgba(46,125,50,.2),inset 0 0 20px rgba(253,216,53,.12)', nav: '0 0 10px rgba(253,216,53,.18)' },
            banner: { bg: 'linear-gradient(135deg,#0f1f0a,#1a1a05)', accent: '#FDD835', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(253,216,53,.15)', title: 'EID MUBARAK', titleColor: '#FFF9C4', sub: 'Celebrate in style with a fresh look!', timer: '#FDD835' },
            topBorder: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)',
            navLine: 'linear-gradient(90deg,transparent,#2E7D32,#FDD835,#2E7D32,transparent)',
            decor: [
                { type: 'img', src: IMG.crescentMoon, pos: 'tr', w: 55, h: 55, mw: 40, mh: 40, opacity: .7 },
                { type: 'img', src: IMG.lantern, pos: 'tl', w: 50, h: 50, mw: 35, mh: 35, top: 80 }
            ],
            hanging: 'lanterns', sparkleField: true
        },
        ramadan: {
            particleType: 'stars', particleCount: isMobile ? 8 : 15,
            bokeh: [
                { color: 'rgba(184,134,11,.06)', size: 190, x: 25, y: 20, blur: 65 },
                { color: 'rgba(26,35,126,.05)', size: 170, x: 70, y: 45, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(184,134,11,.7)', shadowMin: '0 0 20px rgba(184,134,11,.3),0 0 40px rgba(26,35,126,.15),inset 0 0 12px rgba(184,134,11,.06)', shadowMax: '0 0 35px rgba(184,134,11,.5),0 0 65px rgba(26,35,126,.25),inset 0 0 20px rgba(184,134,11,.12)', nav: '0 0 10px rgba(184,134,11,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0a0a2e,#1a1025)', accent: '#B8860B', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(184,134,11,.15)', title: 'RAMADAN KAREEM', titleColor: '#E8EAF6', sub: 'Wishing you a blessed & beautiful month', timer: '#B8860B' },
            topBorder: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,.5),#B8860B,rgba(184,134,11,0))', topBorderShimmer: true,
            navLine: 'linear-gradient(90deg,transparent,#1A237E,#B8860B,#1A237E,transparent)',
            decor: [
                { type: 'img', src: IMG.crescentMoon, pos: 'tr', w: 50, h: 50, mw: 35, mh: 35, opacity: .6 },
                { type: 'img', src: IMG.lantern, pos: 'tl', w: 45, h: 45, mw: 30, mh: 30, top: 80 }
            ],
            hanging: 'lanterns', sparkleField: true
        },
        'black-friday': {
            particleType: 'tags', particleCount: isMobile ? 6 : 12,
            bokeh: [
                { color: 'rgba(255,23,68,.06)', size: 200, x: 30, y: 25, blur: 70 },
                { color: 'rgba(255,214,0,.05)', size: 170, x: 70, y: 45, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,23,68,.65)', shadowMin: '0 0 20px rgba(255,23,68,.3),0 0 40px rgba(255,214,0,.1),inset 0 0 12px rgba(255,23,68,.06)', shadowMax: '0 0 35px rgba(255,23,68,.55),0 0 65px rgba(255,214,0,.18),inset 0 0 20px rgba(255,23,68,.12)', nav: '0 0 10px rgba(255,23,68,.18)' },
            banner: { bg: '#000', accent: '#FF1744', shadow: '0 8px 32px rgba(0,0,0,.7),0 0 25px rgba(255,23,68,.2)', iconBg: 'rgba(255,23,68,.18)', title: 'BLACK FRIDAY', titleColor: '#fff', sub: 'Biggest deals of the year!', timer: '#FF1744' },
            topBorder: '#FF1744', topBorderNeon: '#FF1744',
            navLine: 'linear-gradient(90deg,#FF1744,#FFD600,#FF1744,#FFD600,#FF1744)',
            decor: [
                { type: 'esvg', svg: 'priceTag', pos: 'tr', w: isMobile ? 35 : 55, h: isMobile ? 35 : 55, rotate: 15 }
            ],
            neonFlash: true
        },
        'new-year': {
            particleType: 'confetti', particleCount: isMobile ? 12 : 25,
            bokeh: [
                { color: 'rgba(255,215,0,.07)', size: 210, x: 40, y: 20, blur: 70 },
                { color: 'rgba(13,71,161,.05)', size: 170, x: 75, y: 50, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,215,0,.75)', shadowMin: '0 0 20px rgba(255,215,0,.3),0 0 40px rgba(13,71,161,.12),inset 0 0 12px rgba(255,215,0,.06)', shadowMax: '0 0 35px rgba(255,215,0,.55),0 0 65px rgba(13,71,161,.22),inset 0 0 20px rgba(255,215,0,.12)', nav: '0 0 12px rgba(255,215,0,.2)' },
            banner: { bg: 'linear-gradient(135deg,#0a0a2e,#0d1535)', accent: '#FFD700', shadow: '0 8px 32px rgba(0,0,0,.6),0 0 20px rgba(255,215,0,.12)', iconBg: 'rgba(255,215,0,.15)', title: 'HAPPY NEW YEAR', titleColor: '#FFD700', sub: 'New year, fresh look \u2013 Start the year right!', timer: '#FFD700' },
            topBorder: 'linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#0D47A1,#FFD700,#0D47A1,transparent)',
            decor: [
                { type: 'esvg', svg: 'fireworks', pos: 'tl', w: isMobile ? 50 : 80, h: isMobile ? 50 : 80 },
                { type: 'esvg', svg: 'champagne', pos: 'tr', w: isMobile ? 45 : 70, h: isMobile ? 45 : 70 }
            ],
            heroHat: { type: 'esvg', svg: 'topHat' }
        }
    };
    THEMES.blackfriday = THEMES['black-friday'];
    THEMES.newyear = THEMES['new-year'];

    /* ═══ CSS INJECTION ═══ */
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            '.gb-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1}',
            '.gb-bokeh{position:fixed;border-radius:50%;pointer-events:none;z-index:0;animation:gb-bfloat 30s ease-in-out infinite}',
            '@keyframes gb-bfloat{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(15px,-20px) scale(1.05)}50%{transform:translate(-10px,15px) scale(.95)}75%{transform:translate(20px,10px) scale(1.03)}}',
            /* Hero Overlay Banner */
            '.gb-banner{position:fixed;top:72px;left:0;right:0;z-index:10001;font-family:"Outfit",sans-serif;pointer-events:auto;opacity:0;transform:translateY(-20px);animation:gb-bin .6s cubic-bezier(.34,1.56,.64,1) .8s forwards}',
            '.gb-banner-inner{max-width:720px;margin:0 auto;padding:16px 48px 16px 20px;display:flex;align-items:center;gap:14px;border-radius:0 0 16px 16px;position:relative;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}',
            '.gb-banner-icon{flex-shrink:0;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center}',
            '.gb-banner-text{flex:1}',
            '.gb-banner-title{font-size:11px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase}',
            '.gb-banner-sub{font-size:12.5px;font-weight:400;margin-top:3px;color:rgba(255,255,255,.6)}',
            '.gb-banner-x{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.5);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;transition:background .2s}',
            '.gb-banner-x:hover{background:rgba(255,255,255,.18)}',
            '.gb-banner-bar{height:2px;background:rgba(255,255,255,.06);border-radius:0 0 16px 16px;overflow:hidden}',
            '.gb-banner-bar-fill{height:100%;width:100%;transform-origin:left;animation:gb-barfill 8s linear forwards}',
            '@keyframes gb-bin{to{opacity:1;transform:translateY(0)}}',
            '@keyframes gb-bout{to{opacity:0;transform:translateY(-20px)}}',
            '@keyframes gb-barfill{to{transform:scaleX(0)}}',
            /* Decorations */
            '.gb-decor{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 2s ease .6s forwards}',
            '.gb-decor img,.gb-decor svg{width:100%;height:100%;display:block;object-fit:contain}',
            '.gb-bottom{position:fixed;bottom:0;left:0;width:100%;pointer-events:none;z-index:1;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-bottom svg{width:100%;height:100%;display:block}',
            '.gb-hanging{position:fixed;top:70px;left:0;width:100%;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            '.gb-frost{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-frost-tl{top:0;left:0;width:220px;height:220px;background:radial-gradient(ellipse at 0% 0%,rgba(200,230,255,.1) 0%,transparent 70%)}',
            '.gb-frost-tr{top:0;right:0;width:220px;height:220px;background:radial-gradient(ellipse at 100% 0%,rgba(200,230,255,.1) 0%,transparent 70%)}',
            '.gb-fog{position:fixed;bottom:0;left:0;width:200%;height:35vh;pointer-events:none;z-index:1;opacity:0}',
            '.gb-fog-a{background:linear-gradient(to top,rgba(255,255,255,.07) 0%,transparent 100%);animation:gb-fin 3s ease 1s forwards,gb-fogd 28s linear infinite}',
            '.gb-fog-b{background:linear-gradient(to top,rgba(255,255,255,.05) 0%,transparent 100%);animation:gb-fin 3s ease 1.5s forwards,gb-fogd 42s linear infinite reverse}',
            '@keyframes gb-fogd{to{transform:translateX(-50%)}}',
            '.gb-vignette{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-fin 2.5s ease .5s forwards}',
            '.gb-sparkle{position:fixed;pointer-events:none;z-index:1;border-radius:50%;animation:gb-twinkle var(--sd) ease-in-out infinite}',
            '@keyframes gb-twinkle{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:var(--op);transform:scale(1)}}',
            '.gb-nflash{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-nf 4s ease-in-out infinite}',
            '@keyframes gb-nf{0%,100%{opacity:0}20%{opacity:.07}35%{opacity:0}55%{opacity:.05}70%{opacity:0}85%{opacity:.09}95%{opacity:0}}',
            '.gb-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5));animation:gb-hatdrop .8s cubic-bezier(.34,1.56,.64,1) .5s both}',
            '@keyframes gb-hatdrop{0%{transform:rotate(var(--hr)) translateY(-12px) scale(.8);opacity:0}100%{transform:rotate(var(--hr)) translateY(0) scale(1);opacity:1}}',
            '.gb-lights{position:fixed;top:70px;left:0;width:100%;height:75px;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            '.gb-bdr{position:fixed;top:0;left:0;width:100%;z-index:9998;pointer-events:none}',
            '@keyframes gb-shift{0%{background-position:0 0}100%{background-position:200% 0}}',
            '@keyframes gb-shimr{0%,100%{opacity:.5}50%{opacity:1}}',
            '@keyframes gb-nbar{0%,100%{box-shadow:0 0 6px var(--nc),0 0 14px var(--nc)}50%{box-shadow:0 0 3px var(--nc),0 0 6px var(--nc);opacity:.7}}',
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-fin 1s ease .8s forwards}',
            '@keyframes gb-fin{to{opacity:1}}',
            '@media(max-width:600px){.gb-banner-inner{padding:12px 42px 12px 14px;border-radius:0 0 12px 12px}.gb-lights,.gb-hanging{display:none}.gb-frost-tl,.gb-frost-tr{width:140px;height:140px}}',
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

    /* ═══ HERO OVERLAY BANNER ═══ */
    function createBanner(theme, themeId) {
        if (!theme.banner) return;
        try { if (sessionStorage.getItem('gb-ban9') === state.id) return; } catch (e) { }
        var b = theme.banner;
        var icon = BI[themeId] || BI[themeId.replace(/-/g, '')] || '';
        var el = document.createElement('div'); el.className = 'gb-banner';
        el.innerHTML = '<div class="gb-banner-inner" style="background:' + b.bg + ';box-shadow:' + b.shadow + ';border-left:3px solid ' + b.accent + ';border-right:3px solid ' + b.accent + '">' +
            '<div class="gb-banner-icon" style="background:' + b.iconBg + '">' + icon + '</div>' +
            '<div class="gb-banner-text"><div class="gb-banner-title" style="color:' + b.titleColor + '">' + b.title + '</div>' +
            '<div class="gb-banner-sub">' + b.sub + '</div></div>' +
            '<button class="gb-banner-x" aria-label="Close">&times;</button></div>' +
            '<div class="gb-banner-bar" style="max-width:720px;margin:0 auto"><div class="gb-banner-bar-fill" style="background:' + b.timer + '"></div></div>';
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
        try { sessionStorage.setItem('gb-ban9', state.id); } catch (e) { }
    }

    /* ═══ STRING LIGHTS ═══ */
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
            var co = colors[i % colors.length], by = wy + 4, id = 'bl' + i;
            defs += '<radialGradient id="' + id + '" cx=".35" cy=".25" r=".7"><stop offset="0%" stop-color="#fff" stop-opacity=".5"/><stop offset="50%" stop-color="' + co.fill + '"/><stop offset="100%" stop-color="' + co.fill + '" stop-opacity=".75"/></radialGradient>';
            bulbs += '<circle cx="' + xvb + '" cy="' + (by + 6) + '" r="12" fill="' + co.glow + '"><animate attributeName="opacity" values=".3;.6;.3" dur="' + (3 + (i % 5) * .5).toFixed(1) + 's" repeatCount="indefinite"/></circle>';
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
                svg += '<path d="M' + (x - 6) + ',' + (h - 13) + 'h12l1.5,' + 13 + 'h-15z"/>';
                svg += '<ellipse cx="' + x + '" cy="' + (h - 4) + '" rx="2.5" ry="3" fill="rgba(255,200,50,.2)" stroke="none"/>';
            }
            svg += '</g></svg>';
            el.innerHTML = svg;
        }
        document.body.appendChild(el); state.extraEls.push(el);
    }

    /* ═══ DECORATIONS (Real PNGs + SVGs) ═══ */
    function createDecorations(theme) {
        if (!theme.decor) return;
        theme.decor.forEach(function (cfg) {
            var el = document.createElement('div'); el.className = 'gb-decor';
            var w = isMobile && cfg.mw ? cfg.mw : cfg.w;
            var h = isMobile && cfg.mh ? cfg.mh : cfg.h;
            el.style.width = w + 'px'; el.style.height = h + 'px';

            // Position
            if (cfg.pos === 'tl') { el.style.top = (cfg.top || 5) + 'px'; el.style.left = '5px'; }
            else if (cfg.pos === 'tr') { el.style.top = (cfg.top || 5) + 'px'; el.style.right = '5px'; }
            else if (cfg.pos === 'tr-low') { el.style.top = (cfg.top || 5) + 'px'; el.style.right = (cfg.right || 5) + 'px'; }
            else if (cfg.pos === 'bl') { el.style.bottom = '10px'; el.style.left = '5px'; }
            else if (cfg.pos === 'br') { el.style.bottom = '10px'; el.style.right = '5px'; }

            if (cfg.rotate) el.style.transform = 'rotate(' + cfg.rotate + 'deg)';
            if (cfg.opacity) el.style.opacity = cfg.opacity;

            // Content: real image or SVG
            if (cfg.type === 'img') {
                el.innerHTML = '<img src="' + cfg.src + '" alt="" loading="lazy">';
            } else if (cfg.type === 'svg') {
                el.innerHTML = CSVG[cfg.svg] || '';
            } else if (cfg.type === 'esvg') {
                el.innerHTML = ESVG[cfg.svg] || '';
            }

            document.body.appendChild(el); state.decorEls.push(el);
        });
    }

    /* ═══ BOTTOM SILHOUETTE ═══ */
    function createBottom(type) {
        var svgStr = SILHOUETTE[type]; if (!svgStr) return;
        var el = document.createElement('div'); el.className = 'gb-bottom';
        el.style.height = type === 'graveyard' ? '55px' : '35px';
        el.innerHTML = svgStr;
        document.body.appendChild(el); state.decorEls.push(el);
    }

    /* ═══ HERO ACCESSORIES (hat on BOTH logos) ═══ */
    function addAccessory(cfg) {
        if (!cfg) return;
        var content;
        if (cfg.type === 'img') {
            content = '<img src="' + cfg.src + '" alt="" style="width:100%;height:100%;object-fit:contain">';
        } else if (cfg.type === 'svg') {
            content = CSVG[cfg.svg] || '';
        } else if (cfg.type === 'esvg') {
            content = ESVG[cfg.svg] || '';
        }
        if (!content) return;

        // Hero circle
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) {
            hero.style.overflow = 'visible';
            var h = document.createElement('div'); h.className = 'gb-hat';
            h.innerHTML = content;
            if (cfg.isGlasses) {
                h.style.cssText = 'width:120px;height:48px;top:35%;left:50%;margin-left:-60px'; h.style.setProperty('--hr', '0deg');
            } else if (cfg.isBunny) {
                h.style.cssText = 'width:100px;height:85px;top:-55px;left:50%;margin-left:-50px'; h.style.setProperty('--hr', '0deg');
            } else {
                // Default: top-right (santa hat, witch hat, top hat)
                h.style.cssText = 'width:85px;height:75px;top:-22px;right:15px;left:auto'; h.style.setProperty('--hr', '18deg');
            }
            hero.appendChild(h); state.hatEls.push(h);
        }

        // Nav logo(s)
        document.querySelectorAll('.nav-logo').forEach(function (logo) {
            logo.style.position = 'relative'; logo.style.overflow = 'visible';
            var nh = document.createElement('div'); nh.className = 'gb-hat';
            nh.innerHTML = content;
            if (cfg.isGlasses) {
                nh.style.cssText = 'width:42px;height:17px;top:7px;left:50%;margin-left:-21px'; nh.style.setProperty('--hr', '0deg');
            } else if (cfg.isBunny) {
                nh.style.cssText = 'width:36px;height:30px;top:-20px;left:50%;margin-left:-18px'; nh.style.setProperty('--hr', '0deg');
            } else {
                nh.style.cssText = 'width:30px;height:26px;top:-15px;right:-5px;left:auto'; nh.style.setProperty('--hr', '16deg');
            }
            logo.appendChild(nh); state.hatEls.push(nh);
        });
    }

    /* ═══ PULSING GLOW ═══ */
    function applyGlow(theme) {
        if (!theme.glow) return;
        var hero = document.querySelector('.showcase-neon-circle');
        if (hero) {
            state.savedBorder = hero.style.border;
            state.savedShadow = hero.style.boxShadow;
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
                state.savedNavGlow = img.style.boxShadow || '';
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
            createDecorations(theme);
            if (theme.bottom) createBottom(theme.bottom);
            if (theme.hanging) createHanging(theme.hanging);
            if (theme.fog) createFog();
            if (theme.frost) createFrost();
            if (theme.sparkleField) createSparkles();
            if (theme.neonFlash) createNeonFlash();
            if (theme.vignette) createVignette(theme.vignette);
            if (theme.lights) createLights();
            if (theme.heroHat) addAccessory(theme.heroHat);
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
        if (hero) hero.style.removeProperty('overflow');
        removeGlow();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };
})();
