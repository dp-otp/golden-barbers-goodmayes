/**
 * Golden Barbers – Premium Seasonal Theme Effects v10
 * Creative placements, hats on LOGO images, bottom slide-up banners,
 * deal features, proper cleanup on remove.
 */
(function () {
    'use strict';

    var state = {
        canvas: null, ctx: null, raf: null, particles: [],
        bokehEls: [], decorEls: [], extraEls: [],
        banner: null, bannerTimer: null, border: null, navLine: null,
        style: null, hatEls: [], dealEls: [], id: null,
        savedBorder: null, savedShadow: null, savedNavGlow: null,
        stickyBar: null, popup: null, popupTimer: null,
        themeStyleEls: [], countdownInterval: null
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
       IMAGE ASSETS (real PNGs in theme-assets/)
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

    /* ═══ Twemoji SVGs (inline) ═══ */
    var ESVG = {};
    ESVG.pumpkin = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#F4900C" d="M32.664 8.519C29.364 5.134 23.42 4.75 18 4.75S6.636 5.134 3.336 8.519C.582 11.344 0 15.751 0 19.791c0 5.263 1.982 11.311 6.357 14.244C9.364 36.051 13.95 35.871 18 35.871s8.636.18 11.643-1.836C34.018 31.101 36 25.054 36 19.791c0-4.04-.582-8.447-3.336-11.272z"/><path fill="#3F7123" d="M20.783 5.444c.069.42-.222.764-.647.764h-4.451c-.426 0-.717-.344-.647-.764l.745-4.472c.07-.421.476-.764.902-.764h2.451c.426 0 .832.344.901.764l.746 4.472z"/><path fill="#642116" d="M20.654 21.159l-1.598-2.596c-.291-.542-.673-.813-1.057-.817-.383.004-.766.275-1.057.817l-1.598 2.596c-.587 1.093.873 1.716 2.654 1.716s3.243-.624 2.656-1.716z"/></svg>';
    ESVG.spiderWeb = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g stroke="rgba(255,255,255,.18)" fill="none" stroke-linecap="round"><line x1="0" y1="0" x2="200" y2="0" stroke-width="1.2"/><line x1="0" y1="0" x2="0" y2="200" stroke-width="1.2"/><line x1="0" y1="0" x2="190" y2="190" stroke-width=".9"/><line x1="0" y1="0" x2="95" y2="200" stroke-width=".7"/><line x1="0" y1="0" x2="200" y2="95" stroke-width=".7"/><path d="M30 0Q30 30,0 30" stroke-width=".8"/><path d="M65 0Q65 65,0 65" stroke-width=".7"/><path d="M105 0Q105 105,0 105" stroke-width=".6"/><path d="M150 0Q150 150,0 150" stroke-width=".5"/><path d="M190 0Q190 190,0 190" stroke-width=".4"/></g><circle cx="3" cy="3" r="3" fill="rgba(255,255,255,.15)"/></svg>';
    ESVG.fireworks = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#269" d="M36 32c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V4c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v28z"/><path fill="#55ACEE" d="M18 2.249L21.751 6H27v5.249L30.751 15 27 18.751V24h-5.249L18 27.751 14.249 24H9v-5.249L5.249 15 9 11.249V6h5.249z"/><path fill="#FFD983" d="M15 15zm3-10.406l2.234 5.069 4.852-1.417-1.418 4.851 6.486 2.235-6.486 2.234 1.418 4.851L20.234 21 18 33.154 15.765 21l-4.85 1.417 1.417-4.851-6.487-2.234 6.487-2.235-1.417-4.851 4.85 1.417z"/><circle fill="#F5F8FA" cx="18" cy="15" r="3"/></svg>';
    ESVG.champagne = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#264612" d="M34.9 23.787l-5.067-5.067c-3.664-3.664-7.322-4.14-14.358-6.945l-3.149 3.149c3.231 6.61 3.236 10.739 6.9 14.403l5.068 5.068c.993.993 1.787 1.81 2.782.816l8.409-8.412c.996-.996.408-2.019-.585-3.012z"/><path fill="#FFE8B6" d="M16.205 12.164s1.739.644-.56 2.943c-2.122 2.122-2.917.651-2.917.651l-3.447-3.447 3.536-3.536 3.388 3.389z"/><path fill="#FFE8B6" d="M28.373 20.089c-.781-.78-2.048-.78-2.829 0l-4.949 4.95c-.781.78-.781 2.047 0 2.828l4.242 4.242c.781.781 2.048.781 2.829 0l4.949-4.949c.781-.781.781-2.048 0-2.828l-4.242-4.243z"/><circle fill="#CCD6DD" cx="7.189" cy="27.5" r="1.5"/><path fill="#CCD6DD" d="M9.609 13.234c.051-.237.08-.482.08-.734 0-1.933-1.567-3.5-3.5-3.5-1.764 0-3.208 1.308-3.45 3.005-.017 0-.033-.005-.05-.005-1.104 0-2 .896-2 2s.896 2 2 2c.033 0 .063-.008.095-.01-.058.16-.095.33-.095.51 0 .46.212.867.539 1.143-.332.357-.539.831-.539 1.357 0 1.104.896 2 2 2 0 .375.11.721.289 1.021-.727.103-1.289.723-1.289 1.479 0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5c0-.18-.037-.35-.095-.51.032.002.062.01.095.01 1.104 0 2-.896 2-2 0-.601-.27-1.133-.69-1.5.419-.367.69-.899.69-1.5 0-.378-.111-.728-.294-1.03.097.015.193.03.294.03 1.104 0 2-.896 2-2 0-.771-.441-1.432-1.08-1.766z"/></svg>';
    ESVG.topHat = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#31373D" d="M30.198 27.385L32 3.816c0-.135-.008-.263-.021-.373.003-.033.021-.075.021-.11C32 1.529 25.731.066 18 .066c-7.732 0-14 1.462-14 3.267 0 .035.017.068.022.102-.014.11-.022.23-.022.365l1.802 23.585C2.298 28.295 0 29.576 0 31c0 2.762 8.611 5 18 5s18-2.238 18-5c0-1.424-2.298-2.705-5.802-3.615z"/><path fill="#744EAA" d="M30.198 27.385l.446-5.829c-7.705 2.157-17.585 2.207-25.316-.377l.393 5.142c.069.304.113.65.113 1.076 0 1.75 1.289 2.828 2.771 3.396 4.458 1.708 13.958 1.646 18.807.149 1.467-.453 2.776-1.733 2.776-3.191 0-.119.015-.241.024-.361l-.014-.005z"/></svg>';
    ESVG.mapleLeaf = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#DD2C00" d="M31.831 14.151l-4.724-1.383 2.899-2.783c.322-.31.1-.854-.345-.846l-4.871.085 1.108-3.592c.127-.413-.387-.71-.684-.396l-5.392 5.703-1.349-3.754c-.108-.3-.52-.328-.666-.045L16.1 11.076l-2.642-4.754c-.173-.312-.632-.233-.699.12l-.886 4.696-4.218-2.972c-.298-.21-.686.102-.558.449l1.88 5.078-4.36-1.088c-.37-.092-.595.385-.321.681l3.768 4.069-4.51 1.24c-.367.101-.384.624-.024.751l4.341 1.531-2.464 3.209c-.229.299.046.728.407.635l4.463-1.149-1.1 5.31c-.068.327.285.568.542.37l5.063-3.906 1.014 5.085c.066.33.515.386.657.082l2.175-4.676 3.47 4.242c.21.256.611.107.621-.231l.143-4.703 5.146 2.174c.319.135.619-.214.427-.497l-3.183-4.716 5.077-.54c.383-.041.454-.556.101-.739l-4.891-2.533 3.357-3.63c.256-.277.042-.72-.346-.609z"/></svg>';
    ESVG.palmTree = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#C1694F" d="M21.978 20.424c-.054-.804-.137-1.582-.247-2.325-.133-.89-.299-1.728-.485-2.513-.171-.723-.356-1.397-.548-2.017-.288-.931-.584-1.738-.852-2.4-.527-1.299-.943-2.043-.943-2.043l-3.613.466s.417.87.868 2.575c.183.692.371 1.524.54 2.495.086.49.166 1.012.238 1.573.1.781.183 1.632.242 2.549.034.518.058 1.058.074 1.619.006.204.015.401.018.611.01.656-.036 1.323-.118 1.989-.074.6-.182 1.197-.311 1.789-.185.848-.413 1.681-.67 2.475-.208.643-.431 1.261-.655 1.84-.344.891-.69 1.692-.989 2.359-.502 1.119-.871 1.863-.871 2.018 0 .49.35 1.408 2.797 2.02 3.827.956 4.196-.621 4.196-.621s.243-.738.526-2.192c.14-.718.289-1.605.424-2.678.081-.642.156-1.348.222-2.116.068-.8.125-1.667.165-2.605.03-.71.047-1.47.055-2.259.002-.246.008-.484.008-.737 0-.64-.03-1.261-.071-1.872z"/><path fill="#3E721D" d="M32.61 4.305c-.044-.061-4.48-5.994-10.234-3.39-2.581 1.167-4.247 3.074-4.851 5.535-1.125-1.568-2.835-2.565-5.093-2.968C6.233 2.376 2.507 9.25 2.47 9.32c-.054.102-.031.229.056.305s.217.081.311.015c.028-.02 2.846-1.993 7.543-1.157 4.801.854 8.167 1.694 8.201 1.702.02.005.041.007.061.007.069 0 .136-.028.184-.08.032-.035 3.22-3.46 6.153-4.787 4.339-1.961 7.298-.659 7.326-.646.104.046.227.018.298-.07.072-.087.075-.213.007-.304z"/><path fill="#5C913B" d="M27.884 7.63c-4.405-2.328-7.849-1.193-9.995.22-2.575-.487-7.334-.459-11.364 4.707-4.983 6.387-.618 14.342-.573 14.422.067.119.193.191.327.191.015 0 .031-.001.046-.003.151-.019.276-.127.316-.274.015-.054 1.527-5.52 5.35-10.118 2.074-2.496 4.55-4.806 6.308-6.34 1.762.298 4.327.947 6.846 2.354 4.958 2.773 7.234 7.466 7.257 7.513.068.144.211.226.379.212.158-.018.289-.133.325-.287.02-.088 1.968-8.8-5.222-12.597z"/></svg>';
    ESVG.priceTag = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFD983" d="M32.017 20.181L17.345 5.746C16.687 5.087 15.823 5 14.96 5H4.883C3.029 5 2 6.029 2 7.883v10.082c0 .861.089 1.723.746 2.38L17.3 35.017c1.311 1.31 3.378 1.31 4.688 0l10.059-10.088c1.31-1.312 1.28-3.438-.03-4.748zm-23.596-8.76c-.585.585-1.533.585-2.118 0s-.586-1.533 0-2.118c.585-.586 1.533-.585 2.118 0 .585.586.586 1.533 0 2.118z"/><path fill="#D99E82" d="M9.952 7.772c-1.43-1.431-3.749-1.431-5.179 0-1.431 1.43-1.431 3.749 0 5.18 1.43 1.43 3.749 1.43 5.18 0 1.43-1.431 1.429-3.749-.001-5.18zm-1.53 3.65c-.585.585-1.534.585-2.119 0-.585-.585-.586-1.534 0-2.119.585-.587 1.534-.585 2.119 0 .585.585.586 1.533 0 2.119z"/></svg>';
    ESVG.mosque = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#F4900C" d="M23 4.326c0 4.368-9.837 6.652-9.837 13.206 0 2.184 1.085 4.468 2.177 4.468h15.291c1.093 0 2.192-2.284 2.192-4.468C32.823 10.977 23 8.694 23 4.326z"/><path fill="#FFD983" d="M35 33.815C35 35.022 34.711 36 32.815 36h-19.66C11.26 36 11 35.022 11 33.815V22.894c0-1.206.26-1.894 2.156-1.894h19.66c1.895 0 2.184.688 2.184 1.894v10.921z"/><path fill="#662113" d="M26 29c0-3-1.896-5-3-5s-3 2-3 5v7h6v-7zm-8 2.333c0-2-1.264-3.333-2-3.333s-2 1.333-2 3.333V36h4v-4.667zm14 0c0-2-1.264-3.333-2-3.333s-2 1.333-2 3.333V36h4v-4.667z"/><path fill="#FFD983" d="M9 34c0 1.104-.896 2-2 2H5c-1.104 0-2-.896-2-2V8c0-1.104.896-2 2-2h2c1.104 0 2 .896 2 2v26z"/><path fill="#F4900C" d="M5.995.326c0 1.837-2.832 2.918-2.832 5.675 0 .919.312 2 .627 2h4.402c.314 0 .631-1.081.631-2 0-2.757-2.828-3.838-2.828-5.675z"/></svg>';
    ESVG.gift = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FDD888" d="M33 31c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V14c0-2.2 1.8-4 4-4h22c2.2 0 4 1.8 4 4v17z"/><path fill="#FDD888" d="M36 11c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4s1.8-4 4-4h28c2.2 0 4 1.8 4 4z"/><path fill="#DA2F47" d="M19 3h-2c-1.657 0-3 1.343-3 3v29h8V6c0-1.656-1.343-3-3-3z"/><path fill="#DA2F47" d="M16 7c1.1 0 1.263-.516.361-1.147L9.639 1.147c-.902-.631-2.085-.366-2.631.589L4.992 5.264C4.446 6.219 4.9 7 6 7h10zm4 0c-1.1 0-1.263-.516-.361-1.147l6.723-4.706c.901-.631 2.085-.366 2.631.589l2.016 3.527C31.554 6.219 31.1 7 30 7H20z"/></svg>';

    /* ═══ Custom detailed SVGs ═══ */
    var CSVG = {};
    CSVG.mistletoe = '<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mberry" cx=".35" cy=".3" r=".65"><stop offset="0%" stop-color="#fff" stop-opacity=".6"/><stop offset="100%" stop-color="#f5f5f5"/></radialGradient><linearGradient id="mleaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a8c3f"/><stop offset="100%" stop-color="#2d5a27"/></linearGradient><linearGradient id="mbow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/></linearGradient></defs><g transform="translate(60,20)"><ellipse cx="-18" cy="10" rx="22" ry="8" fill="url(#mleaf)" transform="rotate(-35 -18 10)"/><path d="M-18 10L-18 2" stroke="#2d5a27" stroke-width=".8" opacity=".5"/><ellipse cx="18" cy="10" rx="22" ry="8" fill="url(#mleaf)" transform="rotate(35 18 10)"/><path d="M18 10L18 2" stroke="#2d5a27" stroke-width=".8" opacity=".5"/><ellipse cx="-10" cy="30" rx="20" ry="7" fill="url(#mleaf)" transform="rotate(-20 -10 30)"/><ellipse cx="10" cy="30" rx="20" ry="7" fill="url(#mleaf)" transform="rotate(20 10 30)"/><ellipse cx="0" cy="18" rx="18" ry="7" fill="url(#mleaf)" transform="rotate(-5 0 18)"/><circle cx="-5" cy="42" r="5.5" fill="url(#mberry)" stroke="#ddd" stroke-width=".3"/><circle cx="5" cy="44" r="5" fill="url(#mberry)" stroke="#ddd" stroke-width=".3"/><circle cx="0" cy="36" r="4.5" fill="url(#mberry)" stroke="#ddd" stroke-width=".3"/><circle cx="-3" cy="42" r="1.5" fill="white" opacity=".4"/><circle cx="3" cy="44" r="1.2" fill="white" opacity=".35"/><path d="M-15 52C-15 52,-8 60,0 56C8 60,15 52,15 52" fill="url(#mbow)" stroke="#8e0000" stroke-width=".5"/><path d="M-12 54C-16 58,-18 64,-14 68L-8 60Z" fill="url(#mbow)"/><path d="M12 54C16 58,18 64,14 68L8 60Z" fill="url(#mbow)"/><line x1="0" y1="0" x2="0" y2="-12" stroke="#5a3a1a" stroke-width="2" stroke-linecap="round"/></g></svg>';
    CSVG.holly = '<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hleaf1" x1="0" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#2e7d32"/><stop offset="100%" stop-color="#1b5e20"/></linearGradient><radialGradient id="hberry" cx=".35" cy=".3" r=".65"><stop offset="0%" stop-color="#ef5350"/><stop offset="40%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/></radialGradient></defs><path d="M10 55C5 45,15 30,25 35C30 25,45 20,55 30C65 20,80 22,85 35C95 28,108 38,100 52C110 60,105 78,90 75C95 85,85 92,72 85C62 95,45 92,42 80C30 88,15 80,22 68C10 72,2 62,10 55Z" fill="url(#hleaf1)" opacity=".9"/><path d="M52 30L55 55L58 75" stroke="#1b5e20" stroke-width="1.5" fill="none" opacity=".4"/><path d="M25 38L45 50L72 82" stroke="#1b5e20" stroke-width="1" fill="none" opacity=".3"/><path d="M85 38L65 52L45 78" stroke="#1b5e20" stroke-width="1" fill="none" opacity=".3"/><circle cx="50" cy="55" r="8" fill="url(#hberry)"/><circle cx="62" cy="50" r="7" fill="url(#hberry)"/><circle cx="55" cy="64" r="6.5" fill="url(#hberry)"/><circle cx="47" cy="53" r="2.5" fill="white" opacity=".3"/><circle cx="59" cy="48" r="2" fill="white" opacity=".25"/><circle cx="52" cy="62" r="2" fill="white" opacity=".25"/></svg>';
    CSVG.ornament = '<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="oball" cx=".35" cy=".3" r=".7"><stop offset="0%" stop-color="#ef5350"/><stop offset="40%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/></radialGradient><linearGradient id="ocap"><stop offset="0%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#f9a825"/></linearGradient></defs><circle cx="40" cy="62" r="38" fill="url(#oball)"/><ellipse cx="30" cy="50" rx="12" ry="18" fill="white" opacity=".12" transform="rotate(-20 30 50)"/><rect x="33" y="18" width="14" height="10" rx="2" fill="url(#ocap)"/><rect x="36" y="14" width="8" height="6" rx="3" fill="url(#ocap)"/><circle cx="40" cy="12" r="4" fill="none" stroke="#d4af37" stroke-width="2"/><path d="M25 62C25 62,40 48,55 62" stroke="rgba(255,255,255,.15)" stroke-width="1.5" fill="none"/><path d="M22 72C22 72,40 58,58 72" stroke="rgba(255,255,255,.1)" stroke-width="1" fill="none"/></svg>';
    CSVG.witchHat = '<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="what" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#4a148c"/><stop offset="100%" stop-color="#1a0530"/></linearGradient></defs><path d="M50 2C48 2,35 50,22 78h56C65 50,52 2,50 2Z" fill="url(#what)"/><path d="M50 2C52 15,44 45,35 70h30C56 45,53 15,50 2Z" fill="#6a1b9a" opacity=".25"/><ellipse cx="50" cy="80" rx="46" ry="10" fill="url(#what)"/><ellipse cx="50" cy="78" rx="42" ry="8" fill="#2a0845"/><rect x="30" y="68" width="40" height="8" rx="1" fill="#FF6F00" opacity=".85"/><rect x="42" y="66" width="16" height="12" rx="2" fill="#FFB300"/><path d="M50 2Q55 8,48 20Q58 18,50 2Z" fill="#6a1b9a" opacity=".4"/></svg>';

    /* ═══ Banner icon SVGs (22x22) ═══ */
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
    BI.autumn = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.71c.79-.47 1.76-.45 2.56.05l1.11 2.58 1.86-.68-1.31-3.07C13.62 16.3 16 13.05 17 8z" fill="#BF360C"/><path d="M20.49 9.71c-2.35 2.29-5.44 3.58-8.68 3.62L12 13.5l.19.19c-.05.05-.09.11-.14.17 1.14 1.05 2.01 2.39 2.49 3.91l.17-.04c2.64-.65 5.34-.74 8.02-.28-.15-2.63-.85-5.19-2.24-7.74z" fill="#FF6F00"/></svg>';
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
    function leaf(x, y, s, col, rot) {
        var c = state.ctx; c.save(); c.translate(x, y); c.rotate(rot);
        c.beginPath(); c.moveTo(0, -s); c.bezierCurveTo(s * .6, -s * .6, s * .8, s * .2, 0, s);
        c.bezierCurveTo(-s * .8, s * .2, -s * .6, -s * .6, 0, -s);
        c.fillStyle = col; c.shadowBlur = s * .3; c.shadowColor = col; c.fill();
        /* Leaf vein */
        c.beginPath(); c.moveTo(0, -s * .8); c.lineTo(0, s * .7);
        c.strokeStyle = 'rgba(0,0,0,.15)'; c.lineWidth = .5; c.stroke();
        c.restore();
    }

    /* ═══ BOTTOM SILHOUETTES ═══ */
    var SILHOUETTE = {};
    SILHOUETTE.graveyard = '<svg viewBox="0 0 800 55" preserveAspectRatio="none"><path d="M0 55V48h40V28c0-8 7-14 14-14s14 6 14 14v20h60V32c0-6 5-11 11-11s11 5 11 11v16h80V35c0-10 8-18 18-18s18 8 18 18v13h60V30c0-8 7-14 14-14s14 6 14 14v18h55V40h10V22c0-5 4-9 9-9s9 4 9 9v18h10v8h70V42c0-7 6-13 13-13s13 6 13 13v6h55V32c0-10 8-18 18-18s18 8 18 18v16h50V55z" fill="rgba(20,0,35,.5)"/></svg>';
    SILHOUETTE.waves = '<svg viewBox="0 0 800 40" preserveAspectRatio="none"><path d="M0 40V25c30-10 60-10 90 0s60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 55-10 80 0V40z" fill="rgba(2,136,209,.12)"/><path d="M0 40V32c25-7 50-7 75 0s50 7 75 0 50-7 75 0 50 7 75 0 50-7 75 0 50 7 75 0 50-7 75 0 50 7 75 0 50-7 80 0V40z" fill="rgba(2,136,209,.07)"/></svg>';
    SILHOUETTE.grass = '<svg viewBox="0 0 800 30" preserveAspectRatio="none"><path d="M0 30V22l5-8 5 8 8-12 6 12 4-6 5 6 7-10 6 10 5-7 4 7 8-14 5 14 6-9 5 9 4-5 5 5 7-11 6 11 5-8 4 8 8-13 5 13 6-7 5 7 4-10 5 10 7-12 6 12 5-6 4 6 8-9 5 9 6-11 5 11 4-8 5 8 7-10 6 10 5-7 4 7 8-12 5 12 6-8 5 8 4-6 5 6 7-9 6 9 5-10 5 10 7-12 6 12 5-6 4 6 8-14 5 14 6-9 5 9 4-5 5 5 7-11 6 11 5-8 4 8 8-13 5 13 6-7 5 7V30z" fill="rgba(129,199,132,.15)"/></svg>';

    /* ═══════════════════════════════════════════
       THEME CONFIGS
       Creative placements: nav-dangle-N%, side-right-N%, side-left-N%
    ═══════════════════════════════════════════ */
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
                { type: 'svg', svg: 'holly', pos: 'tl', w: isMobile ? 80 : 130, h: isMobile ? 65 : 110, top: 0 },
                { type: 'svg', svg: 'ornament', pos: 'nav-dangle-20', w: isMobile ? 28 : 40, h: isMobile ? 38 : 55 },
                { type: 'svg', svg: 'mistletoe', pos: 'nav-dangle-50', w: isMobile ? 38 : 55, h: isMobile ? 45 : 65 },
                { type: 'img', src: IMG.candyCane, pos: 'nav-dangle-80', w: isMobile ? 25 : 35, h: isMobile ? 35 : 50 },
                { type: 'svg', svg: 'ornament', pos: 'side-right-45', w: isMobile ? 25 : 40, h: isMobile ? 34 : 55, opacity: .5 }
            ],
            heroHat: { type: 'img', src: IMG.santaHat }, lights: true,
            deal: { text: 'Festive Deals!', style: 'ribbon', color: '#C62828', accent: '#FFD700' },
            frontendAccent: '#FFD700', frontendAccentRgba: 'rgba(255,215,0,',
            stickyBar: { text: 'Festive Season Special \u2013 Book your Christmas cut today!', bg: '#C62828', bgEnd: '#8E0000', color: '#fff', icon: '\uD83C\uDF84' },
            popup: { title: 'FESTIVE DEALS', sub: 'Premium grooming for the holiday season', accent: '#C62828', accent2: '#1B5E20', overline: 'Merry Christmas', code: 'XMAS25', countdownHours: 48, btnColor: '#fff' }
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
                { type: 'img', src: IMG.heart, pos: 'nav-dangle-30', w: isMobile ? 28 : 40, h: isMobile ? 28 : 40 },
                { type: 'img', src: IMG.rose, pos: 'side-right-50', w: isMobile ? 30 : 45, h: isMobile ? 70 : 100 },
                { type: 'img', src: IMG.heart, pos: 'nav-dangle-70', w: isMobile ? 20 : 30, h: isMobile ? 20 : 30, opacity: .6 }
            ],
            deal: { text: 'Couples Special!', style: 'ribbon', color: '#AD1457', accent: '#F48FB1' },
            frontendAccent: '#F48FB1', frontendAccentRgba: 'rgba(244,143,177,',
            stickyBar: { text: "Valentine's Special \u2013 Look sharp for your someone special!", bg: '#AD1457', bgEnd: '#880E4F', color: '#fff', icon: '\u2764\uFE0F' },
            popup: { title: "VALENTINE'S DEAL", sub: 'Couples grooming package available', accent: '#E91E63', overline: "Valentine's Day", code: 'LOVE15', countdownHours: 24, btnColor: '#fff' }
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
                { type: 'img', src: IMG.snowflake, pos: 'nav-dangle-25', w: isMobile ? 30 : 45, h: isMobile ? 30 : 45, opacity: .4 },
                { type: 'img', src: IMG.snowflake, pos: 'side-right-30', w: isMobile ? 22 : 35, h: isMobile ? 22 : 35, opacity: .25, rotate: 45 },
                { type: 'img', src: IMG.snowflake, pos: 'nav-dangle-75', w: isMobile ? 25 : 35, h: isMobile ? 25 : 35, opacity: .35 }
            ],
            frost: true, hanging: 'icicles',
            frontendAccent: '#4FC3F7', frontendAccentRgba: 'rgba(79,195,247,',
            stickyBar: { text: 'Winter Warmth \u2013 Free hot towel with every cut this season!', bg: '#01579B', bgEnd: '#0277BD', color: '#E1F5FE', icon: '\u2744\uFE0F' }
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
                { type: 'esvg', svg: 'spiderWeb', pos: 'tl', w: isMobile ? 120 : 200, h: isMobile ? 120 : 200, top: 0 },
                { type: 'img', src: IMG.bat, pos: 'nav-dangle-65', w: isMobile ? 28 : 40, h: isMobile ? 28 : 40 },
                { type: 'esvg', svg: 'pumpkin', pos: 'nav-dangle-30', w: isMobile ? 30 : 45, h: isMobile ? 30 : 45 }
            ],
            bottom: 'graveyard', heroHat: { type: 'svg', svg: 'witchHat' }, fog: true,
            vignette: 'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.35) 100%)',
            deal: { text: 'Spooky Savings!', style: 'ribbon', color: '#4A148C', accent: '#FF6F00' },
            frontendAccent: '#FF6F00', frontendAccentRgba: 'rgba(255,111,0,',
            stickyBar: { text: 'Spooky Season \u2013 Flash deals all week!', bg: '#4A148C', bgEnd: '#1A0530', color: '#FFE0B2', icon: '\uD83C\uDF83' },
            popup: { title: 'SPOOKY FLASH DEAL', sub: 'Get a killer look this Halloween', accent: '#FF6F00', accent2: '#4A148C', overline: 'Halloween Special', countdownHours: 6, btnColor: '#000' }
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
                { type: 'img', src: IMG.easterEgg, pos: 'nav-dangle-40', w: isMobile ? 55 : 90, h: isMobile ? 30 : 48 },
                { type: 'img', src: IMG.bunny, pos: 'side-right-55', w: isMobile ? 35 : 50, h: isMobile ? 35 : 50 }
            ],
            bottom: 'grass', heroHat: { type: 'img', src: IMG.bunny, isBunny: true },
            deal: { text: 'Spring Deals!', style: 'ribbon', color: '#2E7D32', accent: '#C8E6C9' },
            frontendAccent: '#81C784', frontendAccentRgba: 'rgba(129,199,132,',
            stickyBar: { text: 'Spring into style \u2013 Fresh cuts for the new season!', bg: '#2E7D32', bgEnd: '#1B5E20', color: '#C8E6C9', icon: '\uD83D\uDC23' }
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
                { type: 'esvg', svg: 'palmTree', pos: 'side-right-35', w: isMobile ? 50 : 80, h: isMobile ? 80 : 130 }
            ],
            bottom: 'waves', heroHat: { type: 'img', src: IMG.sunglasses, isGlasses: true },
            deal: { text: 'Summer Sale!', style: 'ribbon', color: '#E65100', accent: '#FFF3E0' },
            frontendAccent: '#FF8F00', frontendAccentRgba: 'rgba(255,143,0,',
            stickyBar: { text: 'Summer Vibes \u2013 Stay fresh all season long!', bg: '#E65100', bgEnd: '#FF6D00', color: '#FFF3E0', icon: '\u2600\uFE0F' }
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
                { type: 'img', src: IMG.crescentMoon, pos: 'nav-dangle-30', w: isMobile ? 32 : 45, h: isMobile ? 32 : 45, opacity: .7 },
                { type: 'img', src: IMG.lantern, pos: 'nav-dangle-70', w: isMobile ? 28 : 40, h: isMobile ? 28 : 40 }
            ],
            hanging: 'lanterns', sparkleField: true,
            frontendAccent: '#FDD835', frontendAccentRgba: 'rgba(253,216,53,',
            stickyBar: { text: 'Eid Mubarak \u2013 Celebrate with a fresh new look!', bg: '#1B5E20', bgEnd: '#2E7D32', color: '#FFF9C4', icon: '\u2728' },
            popup: { title: 'EID SPECIAL', sub: 'Premium grooming for the celebration', accent: '#FDD835', accent2: '#2E7D32', overline: 'Eid Mubarak', code: 'EID20', countdownHours: 72, btnColor: '#000' }
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
                { type: 'img', src: IMG.crescentMoon, pos: 'nav-dangle-25', w: isMobile ? 28 : 40, h: isMobile ? 28 : 40, opacity: .6 },
                { type: 'img', src: IMG.lantern, pos: 'nav-dangle-50', w: isMobile ? 26 : 38, h: isMobile ? 26 : 38 },
                { type: 'img', src: IMG.lantern, pos: 'nav-dangle-75', w: isMobile ? 26 : 38, h: isMobile ? 26 : 38 }
            ],
            hanging: 'lanterns', sparkleField: true,
            frontendAccent: '#B8860B', frontendAccentRgba: 'rgba(184,134,11,',
            stickyBar: { text: 'Ramadan Kareem \u2013 Evening appointments available', bg: '#1A237E', bgEnd: '#0D1450', color: '#E8EAF6', icon: '\u262A\uFE0F' }
        },
        autumn: {
            particleType: 'leaves', particleCount: isMobile ? 10 : 20,
            bokeh: [
                { color: 'rgba(221,44,0,.06)', size: 190, x: 20, y: 25, blur: 65 },
                { color: 'rgba(255,143,0,.05)', size: 160, x: 75, y: 40, blur: 55 },
                { color: 'rgba(141,110,99,.04)', size: 140, x: 50, y: 70, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(221,44,0,.55)', shadowMin: '0 0 20px rgba(221,44,0,.25),0 0 40px rgba(255,143,0,.12),inset 0 0 12px rgba(221,44,0,.05)', shadowMax: '0 0 35px rgba(221,44,0,.45),0 0 65px rgba(255,143,0,.2),inset 0 0 20px rgba(221,44,0,.1)', nav: '0 0 10px rgba(221,44,0,.15)' },
            banner: { bg: 'linear-gradient(135deg,#1a0f05,#120800)', accent: '#DD2C00', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(221,44,0,.15)', title: 'AUTUMN VIBES', titleColor: '#FFAB91', sub: 'Fresh look for the new season!', timer: '#DD2C00' },
            topBorder: 'linear-gradient(90deg,#DD2C00,#FF6F00,#BF360C,#FFB300,#DD2C00)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#DD2C00,#FFB300,#DD2C00,transparent)',
            decor: [
                { type: 'esvg', svg: 'mapleLeaf', pos: 'nav-dangle-25', w: isMobile ? 28 : 42, h: isMobile ? 28 : 42 },
                { type: 'esvg', svg: 'mapleLeaf', pos: 'nav-dangle-75', w: isMobile ? 22 : 32, h: isMobile ? 22 : 32, opacity: .6, rotate: -20 },
                { type: 'esvg', svg: 'mapleLeaf', pos: 'side-right-40', w: isMobile ? 25 : 38, h: isMobile ? 25 : 38, opacity: .35, rotate: 15 }
            ],
            deal: { text: 'Autumn Sale!', style: 'ribbon', color: '#BF360C', accent: '#FFAB91' },
            frontendAccent: '#FF6F00', frontendAccentRgba: 'rgba(255,111,0,',
            stickyBar: { text: 'Autumn Sale \u2013 Warm up with a fresh new style!', bg: '#BF360C', bgEnd: '#DD2C00', color: '#FFAB91', icon: '\uD83C\uDF42' },
            popup: { title: 'AUTUMN SPECIAL', sub: 'New season, new look', accent: '#DD2C00', accent2: '#FF6F00', overline: 'Limited Time', code: 'AUTUMN20', countdownHours: 48, btnColor: '#fff' }
        },
        'black-friday': {
            particleType: 'tags', particleCount: isMobile ? 6 : 12,
            bokeh: [
                { color: 'rgba(255,23,68,.06)', size: 200, x: 30, y: 25, blur: 70 },
                { color: 'rgba(255,214,0,.05)', size: 170, x: 70, y: 45, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,23,68,.65)', shadowMin: '0 0 20px rgba(255,23,68,.3),0 0 40px rgba(255,214,0,.1),inset 0 0 12px rgba(255,23,68,.06)', shadowMax: '0 0 35px rgba(255,23,68,.55),0 0 65px rgba(255,214,0,.18),inset 0 0 20px rgba(255,23,68,.12)', nav: '0 0 10px rgba(255,23,68,.18)' },
            banner: { bg: '#000', accent: '#FF1744', shadow: '0 8px 32px rgba(0,0,0,.8),0 0 30px rgba(255,23,68,.15)', iconBg: 'rgba(255,23,68,.18)', title: 'BLACK FRIDAY', titleColor: '#fff', sub: 'Biggest deals of the year!', timer: '#FF1744', isBF: true },
            topBorder: '#FF1744', topBorderNeon: '#FF1744',
            navLine: 'linear-gradient(90deg,#FF1744,#FFD600,#FF1744,#FFD600,#FF1744)',
            decor: [
                { type: 'esvg', svg: 'priceTag', pos: 'nav-dangle-25', w: isMobile ? 28 : 40, h: isMobile ? 28 : 40 },
                { type: 'esvg', svg: 'priceTag', pos: 'nav-dangle-75', w: isMobile ? 25 : 35, h: isMobile ? 25 : 35, rotate: -10 }
            ],
            neonFlash: true,
            deal: { style: 'brush' },
            frontendAccent: '#FF1744', frontendAccentRgba: 'rgba(255,23,68,',
            stickyBar: { text: 'BLACK FRIDAY \u2013 Biggest deals of the year! Up to 30% OFF', bg: '#000', bgEnd: '#111', color: '#FFD600', icon: '\uD83D\uDCB0', gradient: 'linear-gradient(135deg,#000,#1a0008)' },
            popup: { title: 'BLACK FRIDAY MEGA SALE', sub: 'Our biggest deals of the entire year', accent: '#FF1744', accent2: '#FFD600', overline: 'Limited Time Only', code: 'BFRIDAY30', countdownHours: 3, btnColor: '#000', showCountdown: true }
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
                { type: 'esvg', svg: 'fireworks', pos: 'nav-dangle-20', w: isMobile ? 38 : 55, h: isMobile ? 38 : 55 },
                { type: 'esvg', svg: 'champagne', pos: 'nav-dangle-80', w: isMobile ? 35 : 50, h: isMobile ? 35 : 50 },
                { type: 'esvg', svg: 'fireworks', pos: 'side-left-35', w: isMobile ? 35 : 50, h: isMobile ? 35 : 50, opacity: .5 }
            ],
            heroHat: { type: 'esvg', svg: 'topHat' },
            deal: { text: 'New Year Deal!', style: 'ribbon', color: '#0D47A1', accent: '#FFD700' },
            frontendAccent: '#FFD700', frontendAccentRgba: 'rgba(255,215,0,',
            stickyBar: { text: 'Happy New Year \u2013 New year, fresh look! Book now', bg: '#0D47A1', bgEnd: '#1565C0', color: '#fff', icon: '\uD83C\uDF89' },
            popup: { title: 'NEW YEAR SPECIAL', sub: 'Start the year looking your best', accent: '#FFD700', accent2: '#0D47A1', overline: 'Happy New Year', code: 'NEWYEAR15', countdownHours: 168, btnColor: '#000' }
        }
    };
    THEMES.blackfriday = THEMES['black-friday'];
    THEMES.newyear = THEMES['new-year'];
    THEMES.flashsale = THEMES['flash-sale'] = {
        particleType: 'confetti', particleCount: isMobile ? 10 : 20,
        bokeh: [
            { color: 'rgba(255,23,68,.07)', size: 200, x: 25, y: 20, blur: 70 },
            { color: 'rgba(255,215,0,.05)', size: 170, x: 70, y: 45, blur: 55 }
        ],
        glow: { border: '2.5px solid rgba(255,23,68,.7)', shadowMin: '0 0 20px rgba(255,23,68,.35),0 0 40px rgba(255,215,0,.1),inset 0 0 12px rgba(255,23,68,.06)', shadowMax: '0 0 35px rgba(255,23,68,.6),0 0 65px rgba(255,215,0,.2),inset 0 0 20px rgba(255,23,68,.12)', nav: '0 0 12px rgba(255,23,68,.2)' },
        banner: { bg: 'linear-gradient(135deg,#1a0008,#0a0000)', accent: '#FF1744', shadow: '0 8px 32px rgba(0,0,0,.7),0 0 20px rgba(255,23,68,.15)', iconBg: 'rgba(255,23,68,.2)', title: 'FLASH SALE', titleColor: '#FF1744', sub: 'Limited time only \u2013 Don\'t miss out!', timer: '#FF1744' },
        topBorder: '#FF1744', topBorderNeon: '#FF1744',
        navLine: 'linear-gradient(90deg,#FF1744,#FFD600,#FF1744,#FFD600,#FF1744)',
        decor: [
            { type: 'esvg', svg: 'gift', pos: 'nav-dangle-30', w: isMobile ? 28 : 42, h: isMobile ? 28 : 42 },
            { type: 'esvg', svg: 'priceTag', pos: 'nav-dangle-70', w: isMobile ? 25 : 38, h: isMobile ? 25 : 38 }
        ],
        neonFlash: true,
        deal: { text: 'FLASH DEAL!', style: 'brush', color: '#FF1744', accent: '#FFD600' },
        frontendAccent: '#FF1744', frontendAccentRgba: 'rgba(255,23,68,',
        stickyBar: { text: 'FLASH SALE \u2013 Up to 50% OFF for a limited time only!', bg: '#000', bgEnd: '#1a0008', color: '#FF1744', icon: '\u26A1', gradient: 'linear-gradient(135deg,#1a0008,#000)' },
        popup: { title: 'FLASH SALE', sub: 'Save up to 50% \u2013 for a limited time only!', accent: '#FF1744', accent2: '#FFD600', overline: '% Flash Sale %', code: 'FLASH50', countdownHours: 3, btnColor: '#fff', showCountdown: true }
    };

    /* ═══ CSS INJECTION ═══ */
    function injectCSS() {
        if (state.style) return;
        state.style = document.createElement('style');
        state.style.id = 'gb-theme-fx';
        state.style.textContent = [
            '.gb-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1}',
            '.gb-bokeh{position:fixed;border-radius:50%;pointer-events:none;z-index:0;animation:gb-bfloat 30s ease-in-out infinite}',
            '@keyframes gb-bfloat{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(15px,-20px) scale(1.05)}50%{transform:translate(-10px,15px) scale(.95)}75%{transform:translate(20px,10px) scale(1.03)}}',
            /* Bottom slide-up banner – glass morphism upgrade */
            '.gb-banner{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:10001;font-family:"Inter","Outfit",sans-serif;pointer-events:auto;max-width:520px;width:calc(100% - 40px);opacity:0;animation:gb-slideup .6s cubic-bezier(.34,1.56,.64,1) 1.5s forwards;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}',
            '.gb-banner-inner{padding:18px 48px 18px 20px;display:flex;align-items:center;gap:14px;position:relative;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
            '@keyframes gb-slideup{from{opacity:0;transform:translateX(-50%) translateY(30px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-slidedown{to{opacity:0;transform:translateX(-50%) translateY(30px)}}',
            '@keyframes gb-barfill{to{transform:scaleX(0)}}',
            /* Decorations */
            '.gb-decor{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 2s ease .6s forwards}',
            '.gb-decor img,.gb-decor svg{width:100%;height:100%;display:block;object-fit:contain}',
            /* Nav dangle - items hanging from nav bar */
            '.gb-dangle{position:fixed;top:70px;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            '.gb-dangle-line{width:1px;margin:0 auto}',
            '.gb-dangle-item{transform-origin:top center;animation:gb-swing 4s ease-in-out infinite}',
            '.gb-dangle-item img,.gb-dangle-item svg{width:100%;height:100%;display:block;object-fit:contain}',
            '@keyframes gb-swing{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}',
            /* Deal feature */
            '.gb-deal{position:fixed;pointer-events:none;z-index:999;opacity:0;animation:gb-dealpop .8s cubic-bezier(.34,1.56,.64,1) 2s forwards}',
            '@keyframes gb-dealpop{to{opacity:1}}',
            /* Bottom silhouette */
            '.gb-bottom{position:fixed;bottom:0;left:0;width:100%;pointer-events:none;z-index:1;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-bottom svg{width:100%;height:100%;display:block}',
            /* Hanging (icicles/lanterns) */
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
            /* Hat on hero (sibling in showcase) */
            '.gb-hero-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5));animation:gb-hatdrop .8s cubic-bezier(.34,1.56,.64,1) .5s both}',
            '.gb-hero-hat img,.gb-hero-hat svg{width:100%;height:100%;display:block;object-fit:contain}',
            /* Hat on nav logo */
            '.gb-nav-hat{position:absolute;pointer-events:none;z-index:10;filter:drop-shadow(0 1px 4px rgba(0,0,0,.4));animation:gb-hatdrop .8s cubic-bezier(.34,1.56,.64,1) .5s both}',
            '.gb-nav-hat img,.gb-nav-hat svg{width:100%;height:100%;display:block;object-fit:contain}',
            '@keyframes gb-hatdrop{0%{opacity:0;transform:translateY(-12px) scale(.8)}100%{opacity:1;transform:translateY(0) scale(1)}}',
            /* String lights */
            '.gb-lights{position:fixed;top:70px;left:0;width:100%;height:75px;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            /* Border & nav line */
            '.gb-bdr{position:fixed;top:0;left:0;width:100%;z-index:9998;pointer-events:none}',
            '@keyframes gb-shift{0%{background-position:0 0}100%{background-position:200% 0}}',
            '@keyframes gb-shimr{0%,100%{opacity:.5}50%{opacity:1}}',
            '@keyframes gb-nbar{0%,100%{box-shadow:0 0 6px var(--nc),0 0 14px var(--nc)}50%{box-shadow:0 0 3px var(--nc),0 0 6px var(--nc);opacity:.7}}',
            '@keyframes gb-fin{to{opacity:1}}',
            /* Nav line shimmer highlight sweep */
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-fin 1s ease .8s forwards;overflow:hidden}',
            '.gb-nav-line::after{content:"";position:absolute;top:0;left:-60%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);animation:gb-shsweep 4s ease-in-out 2s infinite}',
            '@keyframes gb-shsweep{0%{left:-60%}40%{left:100%}100%{left:100%}}',
            /* Sticky notification bar */
            '.gb-sticky-bar{position:fixed;top:0;left:0;width:100%;z-index:10002;font-family:"Inter",sans-serif;pointer-events:auto;transform:translateY(-100%);animation:gb-stickyin .5s cubic-bezier(.34,1.56,.64,1) .5s forwards}',
            '.gb-sticky-bar-inner{display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 48px 10px 20px;font-size:13px;font-weight:600;letter-spacing:.5px;text-align:center;position:relative}',
            '.gb-sticky-bar-icon{flex-shrink:0;display:flex;align-items:center;font-size:16px}',
            '.gb-sticky-bar-text{flex:1;text-align:center}',
            '.gb-sticky-bar-close{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.6);width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .2s}',
            '.gb-sticky-bar-close:hover{background:rgba(255,255,255,.2);color:#fff}',
            '@keyframes gb-stickyin{to{transform:translateY(0)}}',
            '@keyframes gb-stickyout{to{transform:translateY(-100%)}}',
            /* Flash sale popup modal */
            '.gb-popup-overlay{position:fixed;inset:0;z-index:10003;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;animation:gb-popfade .4s ease 3.5s forwards;pointer-events:auto}',
            '.gb-popup-modal{max-width:440px;width:calc(100% - 40px);border-radius:20px;overflow:hidden;transform:scale(.9) translateY(20px);opacity:0;animation:gb-popscale .5s cubic-bezier(.34,1.56,.64,1) 3.5s forwards;position:relative}',
            '.gb-popup-header{padding:28px 24px 20px;text-align:center;position:relative;overflow:hidden}',
            '.gb-popup-body{padding:20px 24px 28px;text-align:center}',
            '.gb-popup-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.7);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;z-index:2;transition:all .2s}',
            '.gb-popup-close:hover{background:rgba(0,0,0,.5);color:#fff}',
            '@keyframes gb-popfade{to{opacity:1}}',
            '@keyframes gb-popscale{to{opacity:1;transform:scale(1) translateY(0)}}',
            '@keyframes gb-popout{to{opacity:0;transform:scale(.9) translateY(20px)}}',
            /* Countdown timer */
            '.gb-countdown{display:flex;gap:8px;justify-content:center;margin:16px 0}',
            '.gb-countdown-unit{display:flex;flex-direction:column;align-items:center;min-width:52px;padding:10px 6px;border-radius:10px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.08)}',
            '.gb-countdown-num{font-size:24px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}',
            '.gb-countdown-label{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;opacity:.6;margin-top:4px}',
            /* Section themed dividers */
            '.gb-section-divider{height:1px;max-width:600px;margin:0 auto;pointer-events:none;opacity:0;animation:gb-fin 2s ease 1s forwards}',
            /* Themed trust numbers */
            '.gb-themed-num{transition:color 1s ease,text-shadow 1s ease}',
            /* Themed CTA buttons */
            '.gb-themed-btn{transition:all .3s cubic-bezier(.34,1.56,.64,1)!important}',
            '.gb-themed-btn:hover{transform:translateY(-3px)!important}',
            /* Responsive */
            '@media(max-width:600px){.gb-banner{bottom:12px;width:calc(100% - 24px)}.gb-banner-inner{padding:14px 42px 14px 14px}.gb-lights,.gb-hanging{display:none}.gb-frost-tl,.gb-frost-tr{width:140px;height:140px}.gb-dangle{top:60px}.gb-sticky-bar-inner{font-size:11px;padding:8px 40px 8px 14px}.gb-popup-modal{max-width:360px}.gb-countdown-unit{min-width:44px;padding:8px 4px}.gb-countdown-num{font-size:20px}}',
            '@media(prefers-reduced-motion:reduce){.gb-canvas,.gb-bokeh,.gb-fog,.gb-sparkle,.gb-nflash,.gb-dangle-item,.gb-nav-line::after{animation:none!important}}'
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
        else if (type === 'leaves') colors = ['#DD2C00', '#FF6F00', '#BF360C', '#E65100', '#FFB300', '#8D6E63'];
        for (var i = 0; i < count; i++) {
            var layer = i < count * .4 ? 0 : i < count * .75 ? 1 : 2;
            var sm = layer === 0 ? .5 : layer === 1 ? 1 : 1.8;
            var spm = layer === 0 ? .3 : layer === 1 ? .6 : 1;
            var om = layer === 0 ? .35 : layer === 1 ? .6 : 1;
            var bs = type === 'snow' ? rand(2, 6) : type === 'hearts' ? rand(8, 18) : type === 'embers' ? rand(1, 3.5) : type === 'petals' ? rand(3, 7) : type === 'stars' ? rand(3, 8) : type === 'tags' ? rand(8, 16) : type === 'confetti' ? rand(3, 8) : type === 'leaves' ? rand(5, 12) : rand(2, 5);
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
            else if (p.type === 'leaves') { leaf(p.x, p.y, p.size, p.color, p.rotation); }
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

    /* ═══ BANNER – BOTTOM SLIDE-UP ═══ */
    function createBanner(theme, themeId) {
        if (!theme.banner) return;
        try { if (localStorage.getItem('gb-ban-dismissed') === state.id) return; } catch (e) { }
        var b = theme.banner;
        var icon = BI[themeId] || BI[themeId.replace(/-/g, '')] || '';
        var el = document.createElement('div'); el.className = 'gb-banner';

        var isBF = b.isBF || themeId === 'black-friday' || themeId === 'blackfriday';
        var innerStyle, html;

        if (isBF) {
            /* Black Friday: brush paint stroke style */
            innerStyle = 'background:#000;box-shadow:0 8px 32px rgba(0,0,0,.8),0 0 30px rgba(255,23,68,.15);border-radius:4px;border:none;position:relative;overflow:hidden';
            html = '<div class="gb-banner-inner" style="' + innerStyle + '">';
            html += '<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.2" viewBox="0 0 500 80" preserveAspectRatio="none"><path d="M0 40C50 10,100 70,200 35C300 0,350 60,500 40V80H0Z" fill="#FF1744"/><path d="M0 50C80 30,150 65,250 40C350 15,420 55,500 45V80H0Z" fill="#FF1744" opacity=".5"/></svg>';
            html += '<div style="flex-shrink:0;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(255,23,68,.25);position:relative">' + icon + '</div>';
            html += '<div style="flex:1;position:relative">';
            html += '<div style="font-size:13px;font-weight:900;letter-spacing:4px;color:#fff">BLACK FRIDAY</div>';
            html += '<div style="font-size:18px;font-weight:900;color:#FF1744;letter-spacing:2px;margin-top:2px">MEGA SALE</div>';
            html += '<div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:2px">Biggest deals of the year!</div>';
            html += '</div>';
        } else {
            /* Standard themed banner – premium glass */
            innerStyle = 'background:' + b.bg + ';box-shadow:' + b.shadow + ',inset 0 1px 0 rgba(255,255,255,.06);border-radius:16px;border:1px solid ' + b.accent + '25';
            html = '<div class="gb-banner-inner" style="' + innerStyle + '">';
            html += '<div style="flex-shrink:0;width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:' + b.iconBg + ';border:1px solid ' + b.accent + '15;box-shadow:0 0 20px ' + b.accent + '15">' + icon + '</div>';
            html += '<div style="flex:1">';
            html += '<div style="font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:2px">Limited Time</div>';
            html += '<div style="font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:' + b.titleColor + '">' + b.title + '</div>';
            html += '<div style="font-size:12px;font-weight:400;margin-top:3px;color:rgba(255,255,255,.55);line-height:1.3">' + b.sub + '</div>';
            html += '</div>';
        }

        html += '<button onclick="this.closest(\'.gb-banner\').dispatchEvent(new Event(\'dismiss\'))" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.5);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center">&times;</button>';
        html += '</div>';
        html += '<div style="height:2px;background:rgba(255,255,255,.06);border-radius:0 0 16px 16px;overflow:hidden;margin-top:-1px"><div style="height:100%;width:100%;background:' + (b.timer || b.accent) + ';transform-origin:left;animation:gb-barfill 10s linear forwards"></div></div>';

        el.innerHTML = html;
        document.body.appendChild(el);
        state.banner = el;
        el.addEventListener('dismiss', dismissBanner);
        state.bannerTimer = setTimeout(function () { if (state.banner) dismissBanner(); }, 10000);
    }
    function dismissBanner() {
        if (!state.banner) return;
        if (state.bannerTimer) { clearTimeout(state.bannerTimer); state.bannerTimer = null; }
        state.banner.style.animation = 'gb-slidedown .4s ease forwards';
        var r = state.banner;
        setTimeout(function () { if (r && r.parentNode) r.remove(); }, 400);
        state.banner = null;
        try { localStorage.setItem('gb-ban-dismissed', state.id); } catch (e) { }
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

    /* ═══ DECORATIONS – CREATIVE PLACEMENT ═══ */
    function getDecorContent(cfg) {
        if (cfg.type === 'img') return '<img src="' + cfg.src + '" alt="" loading="lazy">';
        if (cfg.type === 'svg') return CSVG[cfg.svg] || '';
        if (cfg.type === 'esvg') return ESVG[cfg.svg] || '';
        return '';
    }

    function createDecorations(theme) {
        if (!theme.decor) return;
        theme.decor.forEach(function (cfg) {
            var content = getDecorContent(cfg);
            if (!content) return;
            var w = isMobile && cfg.mw ? cfg.mw : cfg.w;
            var h = isMobile && cfg.mh ? cfg.mh : cfg.h;
            var pos = cfg.pos || 'tl';

            /* NAV DANGLE: items hanging from nav bar on a string */
            if (pos.indexOf('nav-dangle-') === 0) {
                var pct = parseInt(pos.split('-')[2]) || 50;
                var el = document.createElement('div'); el.className = 'gb-dangle';
                el.style.left = pct + '%'; el.style.transform = 'translateX(-50%)';
                var lineH = isMobile ? 18 : 30;
                el.innerHTML = '<div class="gb-dangle-line" style="height:' + lineH + 'px;background:rgba(255,255,255,.12)"></div>' +
                    '<div class="gb-dangle-item" style="width:' + w + 'px;height:' + h + 'px">' + content + '</div>';
                if (cfg.opacity) el.style.opacity = cfg.opacity;
                document.body.appendChild(el); state.decorEls.push(el);
                return;
            }

            /* SIDE FLOAT: along viewport edges */
            if (pos.indexOf('side-') === 0) {
                var parts = pos.split('-');
                var side = parts[1]; // 'left' or 'right'
                var yPct = parseInt(parts[2]) || 50;
                var el2 = document.createElement('div'); el2.className = 'gb-decor';
                el2.style.width = w + 'px'; el2.style.height = h + 'px';
                el2.style.top = yPct + '%';
                if (side === 'right') el2.style.right = '10px'; else el2.style.left = '10px';
                if (cfg.opacity) el2.style.opacity = cfg.opacity;
                if (cfg.rotate) el2.style.transform = 'rotate(' + cfg.rotate + 'deg)';
                el2.innerHTML = content;
                document.body.appendChild(el2); state.decorEls.push(el2);
                return;
            }

            /* STANDARD CORNER positions */
            var el3 = document.createElement('div'); el3.className = 'gb-decor';
            el3.style.width = w + 'px'; el3.style.height = h + 'px';
            var topVal = cfg.top !== undefined ? cfg.top : 80;
            if (pos === 'tl') { el3.style.top = topVal + 'px'; el3.style.left = '5px'; }
            else if (pos === 'tr') { el3.style.top = topVal + 'px'; el3.style.right = '5px'; }
            else if (pos === 'bl') { el3.style.bottom = '10px'; el3.style.left = '5px'; }
            else if (pos === 'br') { el3.style.bottom = '10px'; el3.style.right = '5px'; }
            if (cfg.rotate) el3.style.transform = 'rotate(' + cfg.rotate + 'deg)';
            if (cfg.opacity) el3.style.opacity = cfg.opacity;
            el3.innerHTML = content;
            document.body.appendChild(el3); state.decorEls.push(el3);
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

    /* ═══ HERO ACCESSORIES – HAT ON LOGO IMAGES ONLY ═══ */
    function addAccessory(cfg) {
        if (!cfg) return;
        var content;
        if (cfg.type === 'img') content = '<img src="' + cfg.src + '" alt="" style="width:100%;height:100%;object-fit:contain">';
        else if (cfg.type === 'svg') content = CSVG[cfg.svg] || '';
        else if (cfg.type === 'esvg') content = ESVG[cfg.svg] || '';
        if (!content) return;

        /* HERO CIRCLE HAT – appended to circle's parent as sibling, NOT touching circle overflow */
        var circle = document.querySelector('.showcase-neon-circle');
        if (circle) {
            var parent = circle.offsetParent || circle.parentElement;
            var cTop = circle.offsetTop;
            var cLeft = circle.offsetLeft;
            var cW = circle.offsetWidth || 320;

            var h = document.createElement('div'); h.className = 'gb-hero-hat';
            h.innerHTML = content;

            if (cfg.isGlasses) {
                var gW = cW * 0.38, gH = gW * 0.4;
                h.style.cssText = 'width:' + gW + 'px;height:' + gH + 'px;top:' + (cTop + cW * 0.33) + 'px;left:' + (cLeft + (cW - gW) / 2) + 'px';
            } else if (cfg.isBunny) {
                var bW = cW * 0.32, bH = bW * 0.85;
                h.style.cssText = 'width:' + bW + 'px;height:' + bH + 'px;top:' + (cTop - bH * 0.65) + 'px;left:' + (cLeft + (cW - bW) / 2) + 'px';
            } else {
                /* Default: hat sits on top-right of circle (santa hat, witch hat, top hat) */
                var hatW = cW * 0.27, hatH = hatW * 0.88;
                h.style.cssText = 'width:' + hatW + 'px;height:' + hatH + 'px;top:' + (cTop - hatH * 0.28) + 'px;left:' + (cLeft + cW * 0.58) + 'px;transform:rotate(18deg)';
            }
            parent.appendChild(h); state.hatEls.push(h);
        }

        /* NAV LOGO HAT – positioned over the IMG only, not the text */
        document.querySelectorAll('.nav-logo').forEach(function (logo) {
            var img = logo.querySelector('img');
            if (!img) return;
            logo.style.position = 'relative';
            logo.style.overflow = 'visible';
            var imgW = img.offsetWidth || 45;
            var nh = document.createElement('div'); nh.className = 'gb-nav-hat';
            nh.innerHTML = content;

            if (cfg.isGlasses) {
                nh.style.cssText = 'width:' + (imgW * 0.9) + 'px;height:' + (imgW * 0.35) + 'px;top:' + (imgW * 0.15) + 'px;left:0';
            } else if (cfg.isBunny) {
                nh.style.cssText = 'width:' + (imgW * 0.7) + 'px;height:' + (imgW * 0.6) + 'px;top:' + (-imgW * 0.4) + 'px;left:' + (imgW * 0.15) + 'px';
            } else {
                /* Hat on top-right of the logo IMG */
                nh.style.cssText = 'width:' + (imgW * 0.6) + 'px;height:' + (imgW * 0.52) + 'px;top:' + (-imgW * 0.32) + 'px;left:' + (imgW * 0.45) + 'px;transform:rotate(16deg)';
            }
            logo.appendChild(nh); state.hatEls.push(nh);
        });
    }

    /* ═══ DEAL FEATURES – Creative discount elements ═══ */
    function createDealFeature(theme, themeId) {
        if (!theme.deal) return;
        var d = theme.deal;
        var el = document.createElement('div'); el.className = 'gb-deal';

        if (d.style === 'brush') {
            /* Black Friday: Brush paint stroke SALE badge */
            var bw = isMobile ? 110 : 160;
            el.style.cssText = 'right:' + (isMobile ? 8 : 20) + 'px;top:' + (isMobile ? 'auto' : '45%') + ';' + (isMobile ? 'bottom:80px' : 'transform:translateY(-50%) rotate(-5deg)');
            el.innerHTML = '<div style="position:relative;width:' + bw + 'px;text-align:center">' +
                '<svg viewBox="0 0 200 90" style="position:absolute;inset:0;width:100%;height:100%"><path d="M10 45C30 15,70 5,100 20C130 35,170 10,190 45C170 80,130 70,100 75C70 80,30 70,10 45Z" fill="#FF1744" opacity=".9"/><path d="M15 48C35 22,75 12,100 25C125 38,165 18,185 48C165 75,125 68,100 72C75 76,35 68,15 48Z" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/></svg>' +
                '<div style="position:relative;padding:' + (isMobile ? '15px 8px' : '20px 12px') + ';font-family:Outfit,sans-serif">' +
                '<div style="font-size:' + (isMobile ? 10 : 14) + 'px;font-weight:900;color:#fff;letter-spacing:3px">SALE</div>' +
                '<div style="font-size:' + (isMobile ? 15 : 22) + 'px;font-weight:900;color:#FFD600;letter-spacing:1px;margin-top:2px">UP TO 50%</div>' +
                '</div></div>';
        } else if (d.style === 'ribbon') {
            /* Ribbon/tag style for most themes */
            var rw = isMobile ? 85 : 120;
            el.style.cssText = 'right:' + (isMobile ? 5 : 15) + 'px;top:' + (isMobile ? 'auto' : '42%') + ';' + (isMobile ? 'bottom:80px' : 'transform:translateY(-50%) rotate(3deg)');
            el.innerHTML = '<div style="width:' + rw + 'px;padding:' + (isMobile ? '10px 6px' : '14px 10px') + ';background:' + d.color + ';border-radius:4px 4px 0 0;text-align:center;font-family:Outfit,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.4);position:relative">' +
                '<div style="font-size:' + (isMobile ? 9 : 11) + 'px;font-weight:800;color:' + d.accent + ';letter-spacing:1.5px">' + d.text + '</div>' +
                '<div style="position:absolute;bottom:-10px;left:0;width:0;height:0;border-left:' + (rw / 2) + 'px solid ' + d.color + ';border-right:' + (rw / 2) + 'px solid ' + d.color + ';border-bottom:10px solid transparent"></div>' +
                '</div>';
        }
        if (el.innerHTML) {
            document.body.appendChild(el); state.dealEls.push(el);
        }
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

    /* ═══ STICKY NOTIFICATION BAR ═══ */
    function createStickyBar(theme, themeId, data) {
        if (!theme.stickyBar) return;
        /* Check session storage - only show once per session per theme */
        try { if (sessionStorage.getItem('gb-sticky-' + themeId)) return; } catch (e) { }
        var sb = theme.stickyBar;
        var customText = (data && data.stickyText) ? data.stickyText : sb.text;
        var el = document.createElement('div'); el.className = 'gb-sticky-bar';
        var bg = sb.gradient || ('linear-gradient(135deg,' + sb.bg + ',' + (sb.bgEnd || sb.bg) + ')');
        el.innerHTML = '<div class="gb-sticky-bar-inner" style="background:' + bg + ';color:' + sb.color + '">' +
            '<span class="gb-sticky-bar-icon">' + (sb.icon || '') + '</span>' +
            '<span class="gb-sticky-bar-text">' + customText + '</span>' +
            '<button class="gb-sticky-bar-close" onclick="this.closest(\'.gb-sticky-bar\').dispatchEvent(new Event(\'dismiss\'))">&times;</button>' +
            '</div>';
        document.body.appendChild(el);
        state.stickyBar = el;
        el.addEventListener('dismiss', function () {
            el.style.animation = 'gb-stickyout .3s ease forwards';
            setTimeout(function () { if (el.parentNode) el.remove(); }, 300);
            state.stickyBar = null;
            try { sessionStorage.setItem('gb-sticky-' + themeId, '1'); } catch (e) { }
        });
        /* Push body down to accommodate bar */
        document.body.style.paddingTop = '40px';
        document.body.style.transition = 'padding-top .5s ease';
    }

    /* ═══ FLASH SALE POPUP MODAL ═══ */
    function createFlashPopup(theme, themeId, data) {
        if (!theme.popup) return;
        /* Check session storage */
        try { if (sessionStorage.getItem('gb-popup-' + themeId)) return; } catch (e) { }
        var p = theme.popup;
        var customTitle = (data && data.popupTitle) ? data.popupTitle : p.title;
        var customSub = (data && data.popupSub) ? data.popupSub : p.sub;

        var overlay = document.createElement('div'); overlay.className = 'gb-popup-overlay';
        var headerBg = p.headerBg || ('linear-gradient(135deg,' + p.accent + '30,' + (p.accent2 || p.accent) + '15)');
        var modalBg = p.modalBg || 'rgba(15,15,15,.95)';

        var html = '<div class="gb-popup-modal" style="background:' + modalBg + ';border:1px solid ' + p.accent + '20;box-shadow:0 25px 80px rgba(0,0,0,.6),0 0 40px ' + p.accent + '10">';
        html += '<button class="gb-popup-close" onclick="this.closest(\'.gb-popup-overlay\').dispatchEvent(new Event(\'dismiss\'))">&times;</button>';
        /* Header */
        html += '<div class="gb-popup-header" style="background:' + headerBg + '">';
        html += '<div style="font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:' + p.accent + ';opacity:.8;margin-bottom:8px">' + (p.overline || 'Special Offer') + '</div>';
        html += '<div style="font-size:26px;font-weight:900;letter-spacing:1px;color:#fff;line-height:1.1">' + customTitle + '</div>';
        if (customSub) html += '<div style="font-size:13px;color:rgba(255,255,255,.5);margin-top:8px">' + customSub + '</div>';
        html += '</div>';
        /* Body with countdown */
        html += '<div class="gb-popup-body">';
        if (p.showCountdown !== false) {
            html += '<div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">Offer ends in</div>';
            html += '<div class="gb-countdown" id="gb-popup-countdown">';
            html += '<div class="gb-countdown-unit" style="border-color:' + p.accent + '20"><span class="gb-countdown-num" style="color:' + p.accent + '" data-unit="hours">00</span><span class="gb-countdown-label">Hours</span></div>';
            html += '<div class="gb-countdown-unit" style="border-color:' + p.accent + '20"><span class="gb-countdown-num" style="color:' + p.accent + '" data-unit="mins">00</span><span class="gb-countdown-label">Minutes</span></div>';
            html += '<div class="gb-countdown-unit" style="border-color:' + p.accent + '20"><span class="gb-countdown-num" style="color:' + p.accent + '" data-unit="secs">00</span><span class="gb-countdown-label">Seconds</span></div>';
            html += '</div>';
        }
        if (p.code) {
            html += '<div style="margin-top:16px;padding:10px 16px;background:rgba(255,255,255,.05);border:1px dashed ' + p.accent + '40;border-radius:8px;display:inline-block">';
            html += '<span style="font-size:11px;color:rgba(255,255,255,.4)">Use code: </span><span style="font-size:15px;font-weight:800;color:' + p.accent + ';letter-spacing:2px">' + p.code + '</span>';
            html += '</div>';
        }
        html += '<button onclick="this.closest(\'.gb-popup-overlay\').dispatchEvent(new Event(\'dismiss\'))" style="display:block;width:100%;margin-top:18px;padding:14px;background:' + p.accent + ';color:' + (p.btnColor || '#000') + ';border:none;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s">Book Now</button>';
        html += '</div></div>';

        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        state.popup = overlay;

        overlay.addEventListener('dismiss', function () {
            var modal = overlay.querySelector('.gb-popup-modal');
            if (modal) modal.style.animation = 'gb-popout .3s ease forwards';
            overlay.style.animation = 'gb-popfade .3s ease reverse forwards';
            setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 300);
            state.popup = null;
            if (state.countdownInterval) { clearInterval(state.countdownInterval); state.countdownInterval = null; }
            try { sessionStorage.setItem('gb-popup-' + themeId, '1'); } catch (e) { }
        });

        /* Start countdown */
        if (p.showCountdown !== false) {
            var endTime = data && data.popupEndTime ? new Date(data.popupEndTime).getTime() : Date.now() + (p.countdownHours || 4) * 3600000;
            function updateCountdown() {
                var now = Date.now(), diff = Math.max(0, endTime - now);
                var h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
                var cd = document.getElementById('gb-popup-countdown');
                if (!cd) return;
                var nums = cd.querySelectorAll('.gb-countdown-num');
                if (nums[0]) nums[0].textContent = h < 10 ? '0' + h : h;
                if (nums[1]) nums[1].textContent = m < 10 ? '0' + m : m;
                if (nums[2]) nums[2].textContent = s < 10 ? '0' + s : s;
                if (diff <= 0 && state.countdownInterval) { clearInterval(state.countdownInterval); state.countdownInterval = null; }
            }
            updateCountdown();
            state.countdownInterval = setInterval(updateCountdown, 1000);
        }
    }

    /* ═══ FRONTEND THEMING – Section dividers, trust blocks, CTAs ═══ */
    function themeFrontend(theme, themeId) {
        var accent = theme.frontendAccent || (theme.banner && theme.banner.titleColor) || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';

        /* Themed section dividers */
        document.querySelectorAll('.section').forEach(function (sec, i) {
            if (i === 0) return;
            var existing = sec.previousElementSibling;
            if (existing && existing.classList.contains('gb-section-divider')) return;
            var div = document.createElement('div');
            div.className = 'gb-section-divider';
            div.style.background = 'linear-gradient(90deg,transparent,' + accentRgba + '.15),' + accentRgba + '.3),' + accentRgba + '.15),transparent)';
            sec.parentNode.insertBefore(div, sec);
            state.themeStyleEls.push(div);
        });

        /* Theme trust block numbers */
        document.querySelectorAll('.trust-number, .stat-number, .metric-value').forEach(function (el) {
            el.classList.add('gb-themed-num');
            el.dataset.gbOrigColor = el.style.color || '';
            el.style.color = accent;
            el.style.textShadow = '0 0 20px ' + accentRgba + '.3)';
            state.themeStyleEls.push(el);
        });

        /* Theme primary CTA buttons */
        document.querySelectorAll('.cta-primary, .btn-primary, .hero-cta .btn:first-child').forEach(function (el) {
            el.classList.add('gb-themed-btn');
            el.dataset.gbOrigBg = el.style.background || '';
            el.dataset.gbOrigShadow = el.style.boxShadow || '';
            el.style.background = accent;
            el.style.boxShadow = '0 4px 20px ' + accentRgba + '.3)';
            state.themeStyleEls.push(el);
        });
    }
    function unthemeFrontend() {
        state.themeStyleEls.forEach(function (el) {
            if (el.classList.contains('gb-section-divider')) {
                if (el.parentNode) el.remove();
            } else if (el.classList.contains('gb-themed-num')) {
                el.style.color = el.dataset.gbOrigColor || '';
                el.style.textShadow = '';
                el.classList.remove('gb-themed-num');
            } else if (el.classList.contains('gb-themed-btn')) {
                el.style.background = el.dataset.gbOrigBg || '';
                el.style.boxShadow = el.dataset.gbOrigShadow || '';
                el.classList.remove('gb-themed-btn');
            }
        });
        state.themeStyleEls = [];
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

        /* ALL PAGES: glow, border, nav line, sticky bar */
        applyGlow(theme);
        createBorder(theme);
        createNavLine(theme);
        createStickyBar(theme, themeKey, data);

        /* MAIN PAGES ONLY: full effects */
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
            if (theme.deal) createDealFeature(theme, themeKey);
            themeFrontend(theme, themeKey);
            createBanner(theme, themeKey);
            /* Popup shows after banner (delayed) */
            if (data.showPopup !== false) createFlashPopup(theme, themeKey, data);
        }
    }

    function remove() {
        if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; }
        if (state.canvas) { state.canvas.remove(); state.canvas = null; state.ctx = null; }
        state.particles = [];
        state.bokehEls.forEach(function (e) { e.remove(); }); state.bokehEls = [];
        state.decorEls.forEach(function (e) { e.remove(); }); state.decorEls = [];
        state.extraEls.forEach(function (e) { e.remove(); }); state.extraEls = [];
        if (state.bannerTimer) { clearTimeout(state.bannerTimer); state.bannerTimer = null; }
        if (state.banner) { state.banner.remove(); state.banner = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        if (state.navLine) { state.navLine.remove(); state.navLine = null; }
        state.hatEls.forEach(function (e) { if (e.parentNode) e.remove(); }); state.hatEls = [];
        state.dealEls.forEach(function (e) { if (e.parentNode) e.remove(); }); state.dealEls = [];
        /* Sticky bar cleanup */
        if (state.stickyBar) { state.stickyBar.remove(); state.stickyBar = null; }
        document.body.style.paddingTop = ''; document.body.style.transition = '';
        /* Popup cleanup */
        if (state.popup) { state.popup.remove(); state.popup = null; }
        if (state.popupTimer) { clearTimeout(state.popupTimer); state.popupTimer = null; }
        if (state.countdownInterval) { clearInterval(state.countdownInterval); state.countdownInterval = null; }
        /* Frontend theming cleanup */
        unthemeFrontend();
        document.querySelectorAll('.nav-logo').forEach(function (l) { l.style.removeProperty('position'); l.style.removeProperty('overflow'); });
        removeGlow();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };
})();
