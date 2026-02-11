/**
 * Golden Barbers – Premium Seasonal Theme Effects v19
 * Hero seasonal takeovers, atmospheric page film, premium promo banners,
 * nav transformation, enhanced particles with glow, section accent theming.
 */
(function () {
    'use strict';

    var state = {
        canvas: null, ctx: null, raf: null, particles: [],
        bokehEls: [], decorEls: [], extraEls: [],
        border: null, navLine: null,
        style: null, hatEls: [], id: null,
        savedBorder: null, savedShadow: null, savedNavGlow: null,
        popup: null, popupTimer: null,
        themeStyleEls: [], countdownInterval: null,
        heroTakeover: null, heroTimeout: null, heroScrollHandler: null,
        promoBanner: null, promoBannerTimer: null,
        atmosphere: null, navThemeEls: [], savedNavBg: null,
        savedCSSVars: null, themeCSS: null
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
        bunny: 'theme-assets/bunny.png',
        holly: 'theme-assets/holly.png',
        mistletoe: 'theme-assets/mistletoe.png',
        ornament: 'theme-assets/ornament.png',
        witchHat: 'theme-assets/witch-hat.png'
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

    /* ═══ PREMIUM CONNOTATION SVG ICONS ═══ */
    var CSVG = {
        /* ── Christmas connotations: baubles, holly, candy canes, gifts, bells, stars ── */
        bauble: '<svg viewBox="0 0 48 48"><rect x="21" y="3" width="6" height="5" rx="1.5" fill="#C9B037"/><path d="M24 3c-3-4-7-1-4 2" stroke="#A08020" fill="none" stroke-width="1.5"/><circle cx="24" cy="28" r="16" fill="#C62828" opacity=".9"/><ellipse cx="19" cy="22" rx="4" ry="7" fill="rgba(255,255,255,.15)" transform="rotate(-15 19 22)"/></svg>',
        holly: '<svg viewBox="0 0 48 48"><path d="M10 28c0-14 14-14 14-2s-14 16-14 2z" fill="#1B5E20"/><path d="M24 26c0-14 14-14 14-2s-14 16-14 2z" fill="#2E7D32"/><circle cx="22" cy="26" r="3.5" fill="#C62828"/><circle cx="27" cy="22" r="3" fill="#D32F2F"/><circle cx="27" cy="30" r="2.5" fill="#B71C1C"/></svg>',
        candyCane: '<svg viewBox="0 0 48 48"><path d="M20 46V18c0-8 8-14 14-8" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M20 46V18c0-8 8-14 14-8" stroke="#C62828" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="5 5"/></svg>',
        christmasStar: '<svg viewBox="0 0 48 48"><path d="M24 2l5.5 13h14l-11.2 8.5 4.3 13.5L24 28.5 11.4 37l4.3-13.5L4.5 15h14z" fill="#FFD700"/><path d="M24 8l3 7h7.5l-6 4.6 2.3 7.2L24 22l-6.8 4.8 2.3-7.2-6-4.6H21z" fill="rgba(255,255,255,.25)"/></svg>',
        giftBox: '<svg viewBox="0 0 48 48"><rect x="8" y="20" width="32" height="22" rx="3" fill="#C62828"/><rect x="6" y="14" width="36" height="10" rx="3" fill="#E53935"/><rect x="21" y="14" width="6" height="28" fill="#FFD700" opacity=".9"/><path d="M24 14c-6-8-14-4-8 0" stroke="#FFD700" fill="none" stroke-width="2.5" stroke-linecap="round"/><path d="M24 14c6-8 14-4 8 0" stroke="#FFD700" fill="none" stroke-width="2.5" stroke-linecap="round"/></svg>',
        bell: '<svg viewBox="0 0 48 48"><path d="M24 6a14 18 0 00-14 18v4h28v-4A14 18 0 0024 6z" fill="#FFD700"/><rect x="10" y="28" width="28" height="4" rx="2" fill="#C9A000"/><circle cx="24" cy="36" r="4" fill="#B8860B"/><rect x="22" y="2" width="4" height="6" rx="2" fill="#C9A000"/></svg>',
        wreath: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="none" stroke="#1B5E20" stroke-width="8"/><circle cx="14" cy="14" r="3" fill="#C62828"/><circle cx="34" cy="14" r="2.5" fill="#C62828"/><circle cx="12" cy="28" r="2" fill="#C62828"/><circle cx="36" cy="28" r="2.5" fill="#D32F2F"/><circle cx="24" cy="40" r="3" fill="#C62828"/><path d="M20 42l4 4 4-4" stroke="#C62828" fill="none" stroke-width="2.5"/></svg>',

        /* ── Valentine connotations: roses, hearts, cupid arrows, rings ── */
        roseBud: '<svg viewBox="0 0 48 48"><path d="M24 8c-2 4-8 6-8 14s6 12 8 14c2-2 8-6 8-14s-6-10-8-14z" fill="#E91E63"/><path d="M20 18c2-4 4-4 4-4s2 0 4 4" fill="#AD1457"/><path d="M24 36v10" stroke="#2E7D32" stroke-width="2.5"/><path d="M24 40c-4-2-6-6-4-8" stroke="#2E7D32" fill="none" stroke-width="1.5"/><path d="M18 14c3-3 6-2 6 0s-3 4-6 2z" fill="#F48FB1" opacity=".5"/></svg>',
        heartDuo: '<svg viewBox="0 0 48 48"><path d="M24 16c4-6 12-6 14 0s0 12-14 22C10 28 8 22 10 16s10-6 14 0z" fill="#E91E63"/><ellipse cx="20" cy="18" rx="3" ry="4" fill="rgba(255,255,255,.2)"/></svg>',
        cupidArrow: '<svg viewBox="0 0 48 48"><line x1="4" y1="44" x2="40" y2="8" stroke="#B8860B" stroke-width="2"/><path d="M40 8l-8 2 6-10z" fill="#E91E63"/><path d="M6 42l-2-6h6z" fill="#B8860B"/><path d="M20 26c3-4 8-4 10 0s0 8-10 14c-6-4-8-8-6-12" fill="#F48FB1" opacity=".6"/></svg>',
        loveRing: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="30" rx="12" ry="10" fill="none" stroke="#B8860B" stroke-width="3"/><path d="M20 22l4-10 4 10" fill="#E91E63" stroke="#AD1457" stroke-width="1"/><circle cx="24" cy="14" r="3" fill="#E91E63"/></svg>',

        /* ── Winter connotations: crystals, pines, icicles, mittens ── */
        snowCrystal: '<svg viewBox="0 0 48 48" fill="none" stroke="#B3E5FC" stroke-width="2" stroke-linecap="round"><line x1="24" y1="4" x2="24" y2="44"/><line x1="4" y1="24" x2="44" y2="24"/><line x1="10" y1="10" x2="38" y2="38"/><line x1="38" y1="10" x2="10" y2="38"/><line x1="24" y1="10" x2="20" y2="6"/><line x1="24" y1="10" x2="28" y2="6"/><line x1="24" y1="38" x2="20" y2="42"/><line x1="24" y1="38" x2="28" y2="42"/><line x1="10" y1="24" x2="6" y2="20"/><line x1="10" y1="24" x2="6" y2="28"/><line x1="38" y1="24" x2="42" y2="20"/><line x1="38" y1="24" x2="42" y2="28"/><circle cx="24" cy="24" r="3" fill="#B3E5FC" stroke="none"/></svg>',
        pineSnow: '<svg viewBox="0 0 48 48"><path d="M24 4l-14 20h6l-8 12h6l-6 8h32l-6-8h6l-8-12h6z" fill="#1B5E20"/><rect x="21" y="44" width="6" height="4" fill="#5D4037"/><circle cx="18" cy="22" r="2" fill="#fff" opacity=".7"/><circle cx="28" cy="30" r="2.5" fill="#fff" opacity=".6"/><circle cx="22" cy="36" r="2" fill="#fff" opacity=".5"/></svg>',
        iceCluster: '<svg viewBox="0 0 48 48" fill="none" stroke="rgba(200,230,255,.6)" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="2" x2="10" y2="28"/><line x1="10" y1="8" x2="6" y2="4"/><line x1="10" y1="8" x2="14" y2="4"/><line x1="24" y1="2" x2="24" y2="36"/><line x1="24" y1="12" x2="18" y2="6"/><line x1="24" y1="12" x2="30" y2="6"/><line x1="24" y1="24" x2="18" y2="18"/><line x1="24" y1="24" x2="30" y2="18"/><line x1="38" y1="2" x2="38" y2="24"/><line x1="38" y1="8" x2="34" y2="4"/><line x1="38" y1="8" x2="42" y2="4"/></svg>',

        /* ── Halloween connotations: pumpkins, ghosts, skulls, spiders, bats ── */
        pumpkinFace: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="28" rx="18" ry="16" fill="#FF6F00"/><path d="M22 10c0-6 4-6 4 0" stroke="#2E7D32" fill="none" stroke-width="3" stroke-linecap="round"/><path d="M14 24l4 4-4 4" stroke="#1a0800" stroke-width="2" fill="none"/><path d="M34 24l-4 4 4 4" stroke="#1a0800" stroke-width="2" fill="none"/><path d="M18 36c3 3 9 3 12 0" stroke="#1a0800" stroke-width="2" fill="none"/></svg>',
        ghosty: '<svg viewBox="0 0 48 48"><path d="M12 44v-20a12 12 0 0124 0v20l-4-4-4 4-4-4-4 4-4-4z" fill="rgba(255,255,255,.85)"/><circle cx="20" cy="24" r="3" fill="#333"/><circle cx="32" cy="24" r="3" fill="#333"/><ellipse cx="26" cy="32" rx="3" ry="2" fill="#333"/><circle cx="19" cy="23" r="1" fill="#fff"/><circle cx="31" cy="23" r="1" fill="#fff"/></svg>',
        skullIcon: '<svg viewBox="0 0 48 48"><path d="M10 22c0-10 6-16 14-16s14 6 14 16c0 6-2 10-4 12h-20c-2-2-4-6-4-12z" fill="rgba(255,255,255,.9)"/><circle cx="18" cy="22" r="4" fill="#333"/><circle cx="30" cy="22" r="4" fill="#333"/><path d="M20 32v4M24 32v5M28 32v4" stroke="#333" stroke-width="2"/><path d="M20 30h8" stroke="#333" stroke-width="1.5"/></svg>',
        cauldron: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="18" rx="16" ry="4" fill="#333"/><path d="M8 18c0 14 6 22 16 22s16-8 16-22" fill="#2D2D2D"/><circle cx="16" cy="12" r="3" fill="#4CAF50" opacity=".6"/><circle cx="28" cy="10" r="4" fill="#4CAF50" opacity=".4"/><circle cx="22" cy="6" r="2" fill="#4CAF50" opacity=".3"/><path d="M6 24c-4-2-4-8 0-8M42 24c4-2 4-8 0-8" stroke="#555" stroke-width="2" fill="none"/></svg>',

        /* ── Easter connotations: eggs, bunnies, flowers, butterflies ── */
        eggPainted: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="26" rx="14" ry="18" fill="#E8F5E9"/><path d="M10 22h28" stroke="#F48FB1" stroke-width="3"/><path d="M12 30h24" stroke="#FFF59D" stroke-width="2.5"/><path d="M14 18h20" stroke="#90CAF9" stroke-width="2"/><ellipse cx="20" cy="16" rx="2" ry="2" fill="#CE93D8"/><ellipse cx="28" cy="16" rx="2" ry="2" fill="#CE93D8"/></svg>',
        tulip: '<svg viewBox="0 0 48 48"><path d="M24 16c-4-8-12-6-10 2s8 10 10 10z" fill="#E91E63"/><path d="M24 16c4-8 12-6 10 2s-8 10-10 10z" fill="#EC407A"/><path d="M24 28v16" stroke="#2E7D32" stroke-width="3"/><path d="M24 34c-6 0-8-4-6-8" stroke="#2E7D32" fill="none" stroke-width="2"/><path d="M24 38c6 0 8-4 6-8" stroke="#2E7D32" fill="none" stroke-width="2"/></svg>',
        butterfly: '<svg viewBox="0 0 48 48"><ellipse cx="16" cy="18" rx="10" ry="8" fill="#CE93D8" opacity=".7"/><ellipse cx="32" cy="18" rx="10" ry="8" fill="#F48FB1" opacity=".7"/><ellipse cx="16" cy="30" rx="7" ry="6" fill="#90CAF9" opacity=".6"/><ellipse cx="32" cy="30" rx="7" ry="6" fill="#81C784" opacity=".6"/><rect x="23" y="12" width="2" height="24" rx="1" fill="#5D4037"/><path d="M24 12c-3-4-6-4-8-2M24 12c3-4 6-4 8-2" stroke="#5D4037" fill="none" stroke-width="1.5"/></svg>',

        /* ── Summer connotations: sun, palms, cocktails, waves ── */
        sunRays: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#FFB300"/><g stroke="#FFB300" stroke-width="2.5" stroke-linecap="round"><line x1="24" y1="4" x2="24" y2="10"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="4" y1="24" x2="10" y2="24"/><line x1="38" y1="24" x2="44" y2="24"/><line x1="9.9" y1="9.9" x2="14" y2="14"/><line x1="34" y1="34" x2="38.1" y2="38.1"/><line x1="38.1" y1="9.9" x2="34" y2="14"/><line x1="14" y1="34" x2="9.9" y2="38.1"/></g></svg>',
        palmIsland: '<svg viewBox="0 0 48 48"><path d="M26 20v24" stroke="#8D6E63" stroke-width="3"/><path d="M26 20c-12-2-16 4-16 8" stroke="#2E7D32" fill="none" stroke-width="2.5" stroke-linecap="round"/><path d="M26 20c12-2 16 4 16 8" stroke="#1B5E20" fill="none" stroke-width="2.5" stroke-linecap="round"/><path d="M26 18c-8-8-4-14 0-14" stroke="#2E7D32" fill="none" stroke-width="2.5" stroke-linecap="round"/><path d="M26 18c8-8 4-14 0-14" stroke="#1B5E20" fill="none" stroke-width="2.5" stroke-linecap="round"/></svg>',
        cocktail: '<svg viewBox="0 0 48 48"><path d="M10 10h28l-12 16v10h8v4H14v-4h8V26z" fill="none" stroke="#0288D1" stroke-width="2"/><path d="M12 12l12 16 12-16z" fill="rgba(2,136,209,.2)"/><circle cx="30" cy="14" r="2" fill="#FF8F00"/><circle cx="20" cy="16" r="1.5" fill="#E91E63"/><path d="M34 10l4-6" stroke="#2E7D32" stroke-width="1.5"/></svg>',

        /* ── Eid / Ramadan connotations: crescent, stars, lanterns, mosque ── */
        crescentStar: '<svg viewBox="0 0 48 48"><path d="M20 8a16 16 0 100 32 12 12 0 010-32z" fill="#FDD835"/><path d="M36 12l2 5h5l-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3h5z" fill="#FDD835"/></svg>',
        lanternGold: '<svg viewBox="0 0 48 48"><line x1="24" y1="2" x2="24" y2="10" stroke="#B8860B" stroke-width="1.5"/><rect x="20" y="10" width="8" height="4" rx="1" fill="#8D6E63"/><path d="M16 14h16c2 0 3 2 3 4v16c0 2-1 4-3 4H16c-2 0-3-2-3-4V18c0-2 1-4 3-4z" fill="rgba(255,200,50,.08)" stroke="#B8860B" stroke-width="1.5"/><ellipse cx="24" cy="28" rx="3" ry="5" fill="rgba(255,200,50,.3)"/></svg>',
        mosqueIcon: '<svg viewBox="0 0 48 48"><path d="M24 6c0 6-10 10-10 18v12h20V24c0-8-10-12-10-18z" fill="none" stroke="#B8860B" stroke-width="1.5"/><rect x="14" y="36" width="20" height="8" fill="rgba(184,134,11,.15)" stroke="#B8860B" stroke-width="1"/><circle cx="24" cy="6" r="2" fill="#FDD835"/><rect x="4" y="16" width="4" height="28" rx="1" fill="rgba(184,134,11,.2)" stroke="#B8860B" stroke-width="1"/><rect x="40" y="16" width="4" height="28" rx="1" fill="rgba(184,134,11,.2)" stroke="#B8860B" stroke-width="1"/></svg>',

        /* ── Autumn connotations: leaves, acorns, mushrooms ── */
        oakLeaf: '<svg viewBox="0 0 48 48"><path d="M24 4c-2 4-8 6-12 14-2 4 0 8 4 10 2 1 2 4 0 6s0 6 4 6c2 0 4-2 4-4v0c0 2 2 4 4 4 4 0 6-2 4-6s-2-5 0-6c4-2 6-6 4-10C28 10 26 8 24 4z" fill="#DD2C00"/><path d="M24 8v34" stroke="rgba(0,0,0,.15)" stroke-width="1"/></svg>',
        acornNut: '<svg viewBox="0 0 48 48"><path d="M14 20h20c0-6-4-10-10-10s-10 4-10 10z" fill="#8D6E63"/><path d="M14 20h20v2c0 10-4 18-10 18s-10-8-10-18v-2z" fill="#BF360C"/><rect x="22" y="8" width="4" height="4" rx="2" fill="#5D4037"/></svg>',
        mushroom: '<svg viewBox="0 0 48 48"><path d="M6 26c0-12 8-20 18-20s18 8 18 20z" fill="#D32F2F"/><circle cx="16" cy="16" r="3" fill="rgba(255,255,255,.7)"/><circle cx="28" cy="12" r="2.5" fill="rgba(255,255,255,.6)"/><circle cx="20" cy="22" r="2" fill="rgba(255,255,255,.5)"/><circle cx="32" cy="20" r="2.5" fill="rgba(255,255,255,.6)"/><rect x="18" y="26" width="12" height="14" rx="2" fill="#FFF8E1"/></svg>',

        /* ── Black Friday / Sales connotations: price tags, bags, percentages ── */
        priceStar: '<svg viewBox="0 0 48 48"><path d="M24 4l4 8 8-2-2 8 8 4-8 4 2 8-8-2-4 8-4-8-8 2 2-8-8-4 8-4-2-8 8 2z" fill="#FF1744"/><text x="24" y="29" text-anchor="middle" fill="#fff" font-size="16" font-weight="900" font-family="sans-serif">%</text></svg>',
        shoppingBag: '<svg viewBox="0 0 48 48"><rect x="10" y="16" width="28" height="26" rx="3" fill="#212121"/><path d="M18 16v-4a6 6 0 0112 0v4" stroke="#FF1744" stroke-width="2.5" fill="none"/><rect x="10" y="16" width="28" height="8" fill="#FF1744" opacity=".15"/><text x="24" y="36" text-anchor="middle" fill="#FFD600" font-size="10" font-weight="900" font-family="sans-serif">SALE</text></svg>',
        discountTag: '<svg viewBox="0 0 48 48"><path d="M6 6h18l18 18-18 18L6 24z" fill="#FFD600"/><circle cx="16" cy="16" r="4" fill="#FF1744"/><line x1="20" y1="32" x2="32" y2="20" stroke="#FF1744" stroke-width="2.5"/><circle cx="24" cy="22" r="2.5" fill="none" stroke="#FF1744" stroke-width="2"/><circle cx="30" cy="28" r="2.5" fill="none" stroke="#FF1744" stroke-width="2"/></svg>',

        /* ── New Year connotations: champagne, fireworks, clocks, party ── */
        champagneGlass: '<svg viewBox="0 0 48 48"><path d="M18 4h12l-2 18h-8z" fill="rgba(255,215,0,.2)" stroke="#FFD700" stroke-width="1.5"/><line x1="22" y1="22" x2="22" y2="34" stroke="#FFD700" stroke-width="2"/><line x1="18" y1="34" x2="30" y2="34" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="12" r="1" fill="#FFD700" opacity=".5"/><circle cx="26" cy="8" r="1.5" fill="#FFD700" opacity=".4"/></svg>',
        fireworkBurst: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="3" fill="#FFD700"/><g stroke-width="2" stroke-linecap="round"><line x1="24" y1="6" x2="24" y2="14" stroke="#E91E63"/><line x1="24" y1="34" x2="24" y2="42" stroke="#4CAF50"/><line x1="6" y1="24" x2="14" y2="24" stroke="#0D47A1"/><line x1="34" y1="24" x2="42" y2="24" stroke="#FF8F00"/><line x1="11" y1="11" x2="17" y2="17" stroke="#FFD700"/><line x1="31" y1="31" x2="37" y2="37" stroke="#E91E63"/><line x1="37" y1="11" x2="31" y2="17" stroke="#4CAF50"/><line x1="11" y1="37" x2="17" y2="31" stroke="#0D47A1"/></g><circle cx="24" cy="6" r="2" fill="#E91E63"/><circle cx="42" cy="24" r="2" fill="#FF8F00"/></svg>',
        partyPopper: '<svg viewBox="0 0 48 48"><path d="M8 44L20 20l8 8z" fill="#FFD700"/><path d="M28 28l4-2M30 24l6 2M26 20l2-6M32 22l4-4" stroke="#E91E63" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="10" r="2" fill="#0D47A1"/><circle cx="38" cy="18" r="1.5" fill="#4CAF50"/><circle cx="32" cy="14" r="1.5" fill="#FF8F00"/></svg>',

        /* ── Flash Sale connotations: lightning, alarm, megaphone ── */
        lightningBolt: '<svg viewBox="0 0 48 48"><path d="M28 2L12 26h10L18 46l18-26H26z" fill="#FF1744"/><path d="M26 6l-10 16h6l-3 14 12-18h-6z" fill="rgba(255,255,255,.2)"/></svg>',
        megaphone: '<svg viewBox="0 0 48 48"><path d="M36 8L14 16v12l22 8z" fill="#FFD600" opacity=".9"/><rect x="8" y="16" width="8" height="12" rx="2" fill="#FF1744"/><path d="M36 8v28" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="22" r="4" fill="#FFD600" opacity=".3"/></svg>',
        alarmClock: '<svg viewBox="0 0 48 48"><circle cx="24" cy="28" r="16" fill="none" stroke="#FF1744" stroke-width="2.5"/><line x1="24" y1="18" x2="24" y2="28" stroke="#FF1744" stroke-width="2.5" stroke-linecap="round"/><line x1="24" y1="28" x2="32" y2="28" stroke="#FF1744" stroke-width="2" stroke-linecap="round"/><path d="M10 14l-6-6M38 14l6-6" stroke="#FFD600" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="28" r="2" fill="#FFD600"/></svg>'
    };

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
            particleType: 'snow', particleCount: isMobile ? 8 : 18,
            bokeh: [
                { color: 'rgba(200,60,60,.015)', size: 180, x: 15, y: 20, blur: 60 },
                { color: 'rgba(46,125,50,.012)', size: 150, x: 75, y: 35, blur: 55 },
                { color: 'rgba(212,175,55,.015)', size: 190, x: 50, y: 65, blur: 70 }
            ],
            glow: { border: '2.5px solid rgba(200,60,60,.6)', shadowMin: '0 0 20px rgba(200,60,60,.3),0 0 40px rgba(46,125,50,.15),inset 0 0 12px rgba(200,60,60,.06)', shadowMax: '0 0 35px rgba(200,60,60,.5),0 0 65px rgba(46,125,50,.25),inset 0 0 20px rgba(200,60,60,.12)', nav: '0 0 10px rgba(200,60,60,.15),0 0 20px rgba(46,125,50,.08)' },
            banner: { bg: 'linear-gradient(135deg,#0d1f12 0%,#1a0808 50%,#0d1f12 100%)', accent: '#C62828', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(198,40,40,.15)', title: 'MERRY CHRISTMAS', titleColor: '#FFD700', sub: 'Wishing you joy & style this festive season!', timer: '#C62828' },
            topBorder: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 8px,transparent 8px,transparent 14px,#1B5E20 14px,#1B5E20 22px,transparent 22px,transparent 28px)',
            navLine: 'linear-gradient(90deg,transparent,#C62828,#d4af37,#1B5E20,transparent)',
            decor: [],
            heroHat: { type: 'img', src: IMG.santaHat }, lights: true,
            deal: { text: 'Festive Deals!', style: 'ribbon', color: '#C62828', accent: '#FFD700' },
            frontendAccent: '#C62828', frontendAccentRgba: 'rgba(198,40,40,',
            stickyBar: { text: 'Festive Season Special \u2013 Book your Christmas cut today!', bg: '#C62828', bgEnd: '#8E0000', color: '#fff', icon: '\uD83C\uDF84' },
            popup: { title: 'FESTIVE DEALS', sub: 'Premium grooming for the holiday season', accent: '#C62828', accent2: '#1B5E20', overline: 'Merry Christmas', code: 'XMAS25', countdownHours: 48, btnColor: '#fff' },
            heroTitle: 'MERRY CHRISTMAS', heroSub: 'Wishing you joy & style this festive season', heroGradient: 'linear-gradient(135deg, rgba(139,0,0,.82) 0%, rgba(10,60,10,.7) 50%, rgba(139,0,0,.82) 100%)', atmosphere: ['rgba(200,60,60,.08)', 'rgba(46,125,50,.06)'], navAccent: '#C62828',
            dividerText: 'Festive Specials', heroBadge: { text: 'Christmas Season', icon: '\uD83C\uDF84' }
        },
        valentines: {
            particleType: 'hearts', particleCount: isMobile ? 6 : 14,
            bokeh: [
                { color: 'rgba(233,30,99,.015)', size: 190, x: 25, y: 25, blur: 65 },
                { color: 'rgba(244,143,177,.012)', size: 150, x: 70, y: 45, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(233,30,99,.55)', shadowMin: '0 0 20px rgba(233,30,99,.25),0 0 40px rgba(233,30,99,.1),inset 0 0 12px rgba(233,30,99,.05)', shadowMax: '0 0 35px rgba(233,30,99,.45),0 0 65px rgba(233,30,99,.2),inset 0 0 20px rgba(233,30,99,.1)', nav: '0 0 10px rgba(233,30,99,.15)' },
            banner: { bg: 'linear-gradient(135deg,#2a0815,#1f0d18)', accent: '#E91E63', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(233,30,99,.15)', title: "HAPPY VALENTINE'S", titleColor: '#F48FB1', sub: 'Look sharp for your special someone!', timer: '#E91E63' },
            topBorder: 'linear-gradient(90deg,#E91E63,#F48FB1,#E91E63,#F48FB1,#E91E63)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#F48FB1,#E91E63,#F48FB1,transparent)',
            decor: [],
            deal: { text: 'Couples Special!', style: 'ribbon', color: '#AD1457', accent: '#F48FB1' },
            frontendAccent: '#E91E63', frontendAccentRgba: 'rgba(233,30,99,',
            stickyBar: { text: "Valentine's Special \u2013 Look sharp for your someone special!", bg: '#AD1457', bgEnd: '#880E4F', color: '#fff', icon: '\u2764\uFE0F' },
            popup: { title: "VALENTINE'S DEAL", sub: 'Couples grooming package available', accent: '#E91E63', overline: "Valentine's Day", code: 'LOVE15', countdownHours: 24, btnColor: '#fff' },
            heroTitle: "VALENTINE'S DAY", heroSub: 'Look sharp for your special someone', heroGradient: 'linear-gradient(135deg, rgba(173,20,87,.8) 0%, rgba(233,30,99,.6) 100%)', atmosphere: ['rgba(233,30,99,.08)', 'rgba(244,143,177,.06)'], navAccent: '#E91E63',
            dividerText: "Valentine's Specials", heroBadge: { text: "Valentine's Day", icon: '\u2764\uFE0F' }
        },
        winter: {
            particleType: 'snow', particleCount: isMobile ? 10 : 22,
            bokeh: [
                { color: 'rgba(100,180,246,.015)', size: 180, x: 20, y: 20, blur: 60 },
                { color: 'rgba(79,195,247,.012)', size: 160, x: 70, y: 40, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(100,180,246,.6)', shadowMin: '0 0 20px rgba(100,180,246,.3),0 0 40px rgba(79,195,247,.15),inset 0 0 12px rgba(100,180,246,.06)', shadowMax: '0 0 35px rgba(100,180,246,.5),0 0 65px rgba(79,195,247,.25),inset 0 0 20px rgba(100,180,246,.12)', nav: '0 0 10px rgba(100,180,246,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0a1628,#0d2137)', accent: '#64B5F6', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(100,181,246,.15)', title: 'WINTER WARMTH', titleColor: '#E1F5FE', sub: 'Warm up with a fresh new look', timer: '#64B5F6' },
            topBorder: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,.5),rgba(225,245,254,.8),rgba(79,195,247,.5),rgba(79,195,247,0))', topBorderShimmer: true,
            navLine: 'linear-gradient(90deg,transparent,rgba(79,195,247,.4),rgba(225,245,254,.7),rgba(79,195,247,.4),transparent)',
            decor: [],
            frost: true, hanging: 'icicles',
            frontendAccent: '#4FC3F7', frontendAccentRgba: 'rgba(79,195,247,',
            stickyBar: { text: 'Winter Warmth \u2013 Free hot towel with every cut this season!', bg: '#01579B', bgEnd: '#0277BD', color: '#E1F5FE', icon: '\u2744\uFE0F' },
            heroTitle: 'WINTER WARMTH', heroSub: 'Warm up with a fresh new look', heroGradient: 'linear-gradient(135deg, rgba(10,30,60,.85) 0%, rgba(100,180,246,.5) 100%)', atmosphere: ['rgba(100,180,246,.08)', 'rgba(79,195,247,.06)'], navAccent: '#64B5F6',
            dividerText: 'Winter Warmth', heroBadge: { text: 'Winter Season', icon: '\u2744\uFE0F' }
        },
        halloween: {
            particleType: 'embers', particleCount: isMobile ? 8 : 18,
            bokeh: [
                { color: 'rgba(255,111,0,.015)', size: 180, x: 20, y: 25, blur: 60 },
                { color: 'rgba(106,27,154,.012)', size: 160, x: 75, y: 40, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,111,0,.65)', shadowMin: '0 0 20px rgba(255,111,0,.3),0 0 40px rgba(106,27,154,.18),inset 0 0 12px rgba(255,111,0,.06)', shadowMax: '0 0 35px rgba(255,111,0,.5),0 0 65px rgba(106,27,154,.3),inset 0 0 20px rgba(255,111,0,.12)', nav: '0 0 10px rgba(255,111,0,.18)' },
            banner: { bg: 'linear-gradient(135deg,#1a0a2e,#2e1500)', accent: '#FF6F00', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(255,111,0,.15)', title: 'HAPPY HALLOWEEN', titleColor: '#FFE0B2', sub: 'Get a killer look this spooky season', timer: '#FF6F00' },
            topBorder: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)', topBorderGlow: 'rgba(255,111,0,.3)',
            navLine: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C,#FF6F00,#4A148C)',
            decor: [],
            bottom: 'graveyard', heroHat: { type: 'img', src: IMG.witchHat }, fog: true,
            vignette: 'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.35) 100%)',
            deal: { text: 'Spooky Savings!', style: 'ribbon', color: '#4A148C', accent: '#FF6F00' },
            frontendAccent: '#FF6F00', frontendAccentRgba: 'rgba(255,111,0,',
            stickyBar: { text: 'Spooky Season \u2013 Flash deals all week!', bg: '#4A148C', bgEnd: '#1A0530', color: '#FFE0B2', icon: '\uD83C\uDF83' },
            popup: { title: 'SPOOKY FLASH DEAL', sub: 'Get a killer look this Halloween', accent: '#FF6F00', accent2: '#4A148C', overline: 'Halloween Special', countdownHours: 6, btnColor: '#000' },
            heroTitle: 'HAPPY HALLOWEEN', heroSub: 'Get a killer look this spooky season', heroGradient: 'linear-gradient(135deg, rgba(26,5,48,.88) 0%, rgba(255,111,0,.45) 100%)', atmosphere: ['rgba(106,27,154,.08)', 'rgba(255,111,0,.06)'], navAccent: '#FF6F00',
            dividerText: 'Spooky Specials', heroBadge: { text: 'Spooky Season', icon: '\uD83C\uDF83' }
        },
        easter: {
            particleType: 'petals', particleCount: isMobile ? 6 : 14,
            bokeh: [
                { color: 'rgba(129,199,132,.015)', size: 170, x: 20, y: 30, blur: 55 },
                { color: 'rgba(244,143,177,.012)', size: 150, x: 75, y: 35, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(129,199,132,.55)', shadowMin: '0 0 20px rgba(129,199,132,.25),0 0 40px rgba(244,143,177,.12),inset 0 0 12px rgba(129,199,132,.05)', shadowMax: '0 0 35px rgba(129,199,132,.45),0 0 65px rgba(244,143,177,.2),inset 0 0 20px rgba(129,199,132,.1)', nav: '0 0 10px rgba(129,199,132,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0f1f0f,#1a0f1a)', accent: '#81C784', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(129,199,132,.15)', title: 'HAPPY EASTER', titleColor: '#C8E6C9', sub: 'Spring into a fresh new look!', timer: '#81C784' },
            topBorder: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px)',
            navLine: 'linear-gradient(90deg,#F48FB1,#81C784,#FFF59D,#81C784,#F48FB1)',
            decor: [],
            bottom: 'grass', heroHat: { type: 'img', src: IMG.bunny, isBunny: true },
            deal: { text: 'Spring Deals!', style: 'ribbon', color: '#2E7D32', accent: '#C8E6C9' },
            frontendAccent: '#81C784', frontendAccentRgba: 'rgba(129,199,132,',
            stickyBar: { text: 'Spring into style \u2013 Fresh cuts for the new season!', bg: '#2E7D32', bgEnd: '#1B5E20', color: '#C8E6C9', icon: '\uD83D\uDC23' },
            heroTitle: 'HAPPY EASTER', heroSub: 'Spring into a fresh new look', heroGradient: 'linear-gradient(135deg, rgba(46,125,50,.7) 0%, rgba(244,143,177,.5) 100%)', atmosphere: ['rgba(129,199,132,.08)', 'rgba(244,143,177,.06)'], navAccent: '#81C784',
            dividerText: 'Spring Specials', heroBadge: { text: 'Easter Season', icon: '\uD83D\uDC23' }
        },
        summer: {
            particleType: 'sparkle', particleCount: isMobile ? 6 : 14,
            bokeh: [
                { color: 'rgba(255,200,100,.015)', size: 200, x: 80, y: 10, blur: 75 },
                { color: 'rgba(2,136,209,.012)', size: 160, x: 20, y: 60, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,143,0,.55)', shadowMin: '0 0 20px rgba(255,143,0,.25),0 0 40px rgba(2,136,209,.12),inset 0 0 12px rgba(255,143,0,.05)', shadowMax: '0 0 35px rgba(255,143,0,.45),0 0 65px rgba(2,136,209,.2),inset 0 0 20px rgba(255,143,0,.1)', nav: '0 0 10px rgba(255,143,0,.15)' },
            banner: { bg: 'linear-gradient(135deg,#1f1200,#001520)', accent: '#FF8F00', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(255,143,0,.15)', title: 'SUMMER VIBES', titleColor: '#FFF3E0', sub: 'Stay fresh all summer long!', timer: '#FF8F00' },
            topBorder: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1,#FF8F00)',
            decor: [],
            bottom: 'waves', heroHat: { type: 'img', src: IMG.sunglasses, isGlasses: true },
            deal: { text: 'Summer Sale!', style: 'ribbon', color: '#E65100', accent: '#FFF3E0' },
            frontendAccent: '#FF8F00', frontendAccentRgba: 'rgba(255,143,0,',
            stickyBar: { text: 'Summer Vibes \u2013 Stay fresh all season long!', bg: '#E65100', bgEnd: '#FF6D00', color: '#FFF3E0', icon: '\u2600\uFE0F' },
            heroTitle: 'SUMMER VIBES', heroSub: 'Stay fresh all summer long', heroGradient: 'linear-gradient(135deg, rgba(230,81,0,.7) 0%, rgba(2,136,209,.5) 100%)', atmosphere: ['rgba(255,143,0,.08)', 'rgba(2,136,209,.06)'], navAccent: '#FF8F00',
            dividerText: 'Summer Specials', heroBadge: { text: 'Summer Vibes', icon: '\u2600\uFE0F' }
        },
        eid: {
            particleType: 'stars', particleCount: isMobile ? 6 : 14,
            bokeh: [
                { color: 'rgba(253,216,53,.015)', size: 190, x: 30, y: 20, blur: 65 },
                { color: 'rgba(46,125,50,.012)', size: 150, x: 70, y: 50, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(253,216,53,.7)', shadowMin: '0 0 20px rgba(253,216,53,.3),0 0 40px rgba(46,125,50,.12),inset 0 0 12px rgba(253,216,53,.06)', shadowMax: '0 0 35px rgba(253,216,53,.5),0 0 65px rgba(46,125,50,.2),inset 0 0 20px rgba(253,216,53,.12)', nav: '0 0 10px rgba(253,216,53,.18)' },
            banner: { bg: 'linear-gradient(135deg,#0f1f0a,#1a1a05)', accent: '#FDD835', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(253,216,53,.15)', title: 'EID MUBARAK', titleColor: '#FFF9C4', sub: 'Celebrate in style with a fresh look!', timer: '#FDD835' },
            topBorder: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)',
            navLine: 'linear-gradient(90deg,transparent,#2E7D32,#FDD835,#2E7D32,transparent)',
            decor: [],
            hanging: 'lanterns', sparkleField: true,
            frontendAccent: '#FDD835', frontendAccentRgba: 'rgba(253,216,53,',
            stickyBar: { text: 'Eid Mubarak \u2013 Celebrate with a fresh new look!', bg: '#1B5E20', bgEnd: '#2E7D32', color: '#FFF9C4', icon: '\u2728' },
            popup: { title: 'EID SPECIAL', sub: 'Premium grooming for the celebration', accent: '#FDD835', accent2: '#2E7D32', overline: 'Eid Mubarak', code: 'EID20', countdownHours: 72, btnColor: '#000' },
            heroTitle: 'EID MUBARAK', heroSub: 'Celebrate in style with a fresh look', heroGradient: 'linear-gradient(135deg, rgba(30,60,20,.85) 0%, rgba(253,216,53,.4) 100%)', atmosphere: ['rgba(253,216,53,.08)', 'rgba(46,125,50,.06)'], navAccent: '#FDD835',
            dividerText: 'Eid Specials', heroBadge: { text: 'Eid Mubarak', icon: '\u2728' }
        },
        ramadan: {
            particleType: 'stars', particleCount: isMobile ? 6 : 14,
            bokeh: [
                { color: 'rgba(184,134,11,.015)', size: 190, x: 25, y: 20, blur: 65 },
                { color: 'rgba(26,35,126,.012)', size: 170, x: 70, y: 45, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(184,134,11,.7)', shadowMin: '0 0 20px rgba(184,134,11,.3),0 0 40px rgba(26,35,126,.15),inset 0 0 12px rgba(184,134,11,.06)', shadowMax: '0 0 35px rgba(184,134,11,.5),0 0 65px rgba(26,35,126,.25),inset 0 0 20px rgba(184,134,11,.12)', nav: '0 0 10px rgba(184,134,11,.15)' },
            banner: { bg: 'linear-gradient(135deg,#0a0a2e,#1a1025)', accent: '#B8860B', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(184,134,11,.15)', title: 'RAMADAN KAREEM', titleColor: '#E8EAF6', sub: 'Wishing you a blessed & beautiful month', timer: '#B8860B' },
            topBorder: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,.5),#B8860B,rgba(184,134,11,0))', topBorderShimmer: true,
            navLine: 'linear-gradient(90deg,transparent,#1A237E,#B8860B,#1A237E,transparent)',
            decor: [],
            hanging: 'lanterns', sparkleField: true,
            frontendAccent: '#B8860B', frontendAccentRgba: 'rgba(184,134,11,',
            stickyBar: { text: 'Ramadan Kareem \u2013 Evening appointments available', bg: '#1A237E', bgEnd: '#0D1450', color: '#E8EAF6', icon: '\u262A\uFE0F' },
            heroTitle: 'RAMADAN KAREEM', heroSub: 'Wishing you a blessed & beautiful month', heroGradient: 'linear-gradient(135deg, rgba(10,10,46,.88) 0%, rgba(184,134,11,.4) 100%)', atmosphere: ['rgba(184,134,11,.08)', 'rgba(26,35,126,.06)'], navAccent: '#B8860B',
            dividerText: 'Ramadan Specials', heroBadge: { text: 'Ramadan Kareem', icon: '\u262A\uFE0F' }
        },
        autumn: {
            particleType: 'leaves', particleCount: isMobile ? 8 : 18,
            bokeh: [
                { color: 'rgba(221,44,0,.015)', size: 190, x: 20, y: 25, blur: 65 },
                { color: 'rgba(255,143,0,.012)', size: 160, x: 75, y: 40, blur: 55 },
                { color: 'rgba(141,110,99,.01)', size: 140, x: 50, y: 70, blur: 50 }
            ],
            glow: { border: '2.5px solid rgba(221,44,0,.55)', shadowMin: '0 0 20px rgba(221,44,0,.25),0 0 40px rgba(255,143,0,.12),inset 0 0 12px rgba(221,44,0,.05)', shadowMax: '0 0 35px rgba(221,44,0,.45),0 0 65px rgba(255,143,0,.2),inset 0 0 20px rgba(221,44,0,.1)', nav: '0 0 10px rgba(221,44,0,.15)' },
            banner: { bg: 'linear-gradient(135deg,#1a0f05,#120800)', accent: '#DD2C00', shadow: '0 8px 32px rgba(0,0,0,.6)', iconBg: 'rgba(221,44,0,.15)', title: 'AUTUMN VIBES', titleColor: '#FFAB91', sub: 'Fresh look for the new season!', timer: '#DD2C00' },
            topBorder: 'linear-gradient(90deg,#DD2C00,#FF6F00,#BF360C,#FFB300,#DD2C00)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#DD2C00,#FFB300,#DD2C00,transparent)',
            decor: [],
            deal: { text: 'Autumn Sale!', style: 'ribbon', color: '#BF360C', accent: '#FFAB91' },
            frontendAccent: '#FF6F00', frontendAccentRgba: 'rgba(255,111,0,',
            stickyBar: { text: 'Autumn Sale \u2013 Warm up with a fresh new style!', bg: '#BF360C', bgEnd: '#DD2C00', color: '#FFAB91', icon: '\uD83C\uDF42' },
            popup: { title: 'AUTUMN SPECIAL', sub: 'New season, new look', accent: '#DD2C00', accent2: '#FF6F00', overline: 'Limited Time', code: 'AUTUMN20', countdownHours: 48, btnColor: '#fff' },
            heroTitle: 'AUTUMN VIBES', heroSub: 'Fresh look for the new season', heroGradient: 'linear-gradient(135deg, rgba(191,54,12,.75) 0%, rgba(255,143,0,.5) 100%)', atmosphere: ['rgba(221,44,0,.08)', 'rgba(255,143,0,.06)'], navAccent: '#DD2C00',
            dividerText: 'Autumn Specials', heroBadge: { text: 'Autumn Vibes', icon: '\uD83C\uDF42' }
        },
        'black-friday': {
            particleType: 'tags', particleCount: isMobile ? 6 : 14,
            bokeh: [
                { color: 'rgba(255,23,68,.015)', size: 200, x: 30, y: 25, blur: 70 },
                { color: 'rgba(255,214,0,.012)', size: 170, x: 70, y: 45, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,23,68,.65)', shadowMin: '0 0 20px rgba(255,23,68,.3),0 0 40px rgba(255,214,0,.1),inset 0 0 12px rgba(255,23,68,.06)', shadowMax: '0 0 35px rgba(255,23,68,.55),0 0 65px rgba(255,214,0,.18),inset 0 0 20px rgba(255,23,68,.12)', nav: '0 0 10px rgba(255,23,68,.18)' },
            banner: { bg: '#000', accent: '#FF1744', shadow: '0 8px 32px rgba(0,0,0,.8),0 0 30px rgba(255,23,68,.15)', iconBg: 'rgba(255,23,68,.18)', title: 'BLACK FRIDAY', titleColor: '#fff', sub: 'Biggest deals of the year!', timer: '#FF1744', isBF: true },
            topBorder: '#FF1744', topBorderNeon: '#FF1744',
            navLine: 'linear-gradient(90deg,#FF1744,#FFD600,#FF1744,#FFD600,#FF1744)',
            decor: [],
            neonFlash: true,
            deal: { style: 'brush' },
            frontendAccent: '#FF1744', frontendAccentRgba: 'rgba(255,23,68,',
            stickyBar: { text: 'BLACK FRIDAY \u2013 Biggest deals of the year! Up to 30% OFF', bg: '#000', bgEnd: '#111', color: '#FFD600', icon: '\uD83D\uDCB0', gradient: 'linear-gradient(135deg,#000,#1a0008)' },
            popup: { title: 'BLACK FRIDAY MEGA SALE', sub: 'Our biggest deals of the entire year', accent: '#FF1744', accent2: '#FFD600', overline: 'Limited Time Only', code: 'BFRIDAY30', countdownHours: 3, btnColor: '#000', showCountdown: true },
            heroTitle: 'BLACK FRIDAY', heroSub: 'Biggest deals of the year!', heroGradient: 'linear-gradient(135deg, rgba(0,0,0,.95) 0%, rgba(255,23,68,.3) 100%)', atmosphere: ['rgba(255,23,68,.08)', 'rgba(255,214,0,.05)'], navAccent: '#FF1744',
            dividerText: 'Black Friday Deals', heroBadge: { text: 'Black Friday', icon: '\uD83D\uDCB0' }
        },
        'new-year': {
            particleType: 'confetti', particleCount: isMobile ? 8 : 18,
            bokeh: [
                { color: 'rgba(255,215,0,.015)', size: 210, x: 40, y: 20, blur: 70 },
                { color: 'rgba(13,71,161,.012)', size: 170, x: 75, y: 50, blur: 55 }
            ],
            glow: { border: '2.5px solid rgba(255,215,0,.75)', shadowMin: '0 0 20px rgba(255,215,0,.3),0 0 40px rgba(13,71,161,.12),inset 0 0 12px rgba(255,215,0,.06)', shadowMax: '0 0 35px rgba(255,215,0,.55),0 0 65px rgba(13,71,161,.22),inset 0 0 20px rgba(255,215,0,.12)', nav: '0 0 12px rgba(255,215,0,.2)' },
            banner: { bg: 'linear-gradient(135deg,#0a0a2e,#0d1535)', accent: '#FFD700', shadow: '0 8px 32px rgba(0,0,0,.6),0 0 20px rgba(255,215,0,.12)', iconBg: 'rgba(255,215,0,.15)', title: 'HAPPY NEW YEAR', titleColor: '#FFD700', sub: 'New year, fresh look \u2013 Start the year right!', timer: '#FFD700' },
            topBorder: 'linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent)', topBorderAnim: true,
            navLine: 'linear-gradient(90deg,transparent,#0D47A1,#FFD700,#0D47A1,transparent)',
            decor: [],
            heroHat: { type: 'esvg', svg: 'topHat' },
            deal: { text: 'New Year Deal!', style: 'ribbon', color: '#0D47A1', accent: '#FFD700' },
            frontendAccent: '#0D47A1', frontendAccentRgba: 'rgba(13,71,161,',
            stickyBar: { text: 'Happy New Year \u2013 New year, fresh look! Book now', bg: '#0D47A1', bgEnd: '#1565C0', color: '#fff', icon: '\uD83C\uDF89' },
            popup: { title: 'NEW YEAR SPECIAL', sub: 'Start the year looking your best', accent: '#FFD700', accent2: '#0D47A1', overline: 'Happy New Year', code: 'NEWYEAR15', countdownHours: 168, btnColor: '#000' },
            heroTitle: 'HAPPY NEW YEAR', heroSub: 'New year, fresh look – Start the year right!', heroGradient: 'linear-gradient(135deg, rgba(10,10,46,.88) 0%, rgba(255,215,0,.3) 100%)', atmosphere: ['rgba(255,215,0,.08)', 'rgba(13,71,161,.06)'], navAccent: '#FFD700',
            dividerText: 'New Year Specials', heroBadge: { text: 'Happy New Year', icon: '\uD83C\uDF89' }
        }
    };
    THEMES.blackfriday = THEMES['black-friday'];
    THEMES.newyear = THEMES['new-year'];
    THEMES.flashsale = THEMES['flash-sale'] = {
        particleType: 'confetti', particleCount: isMobile ? 8 : 16,
        bokeh: [
            { color: 'rgba(255,23,68,.015)', size: 200, x: 25, y: 20, blur: 70 },
            { color: 'rgba(255,215,0,.012)', size: 170, x: 70, y: 45, blur: 55 }
        ],
        glow: { border: '2.5px solid rgba(255,23,68,.7)', shadowMin: '0 0 20px rgba(255,23,68,.35),0 0 40px rgba(255,215,0,.1),inset 0 0 12px rgba(255,23,68,.06)', shadowMax: '0 0 35px rgba(255,23,68,.6),0 0 65px rgba(255,215,0,.2),inset 0 0 20px rgba(255,23,68,.12)', nav: '0 0 12px rgba(255,23,68,.2)' },
        banner: { bg: 'linear-gradient(135deg,#1a0008,#0a0000)', accent: '#FF1744', shadow: '0 8px 32px rgba(0,0,0,.7),0 0 20px rgba(255,23,68,.15)', iconBg: 'rgba(255,23,68,.2)', title: 'FLASH SALE', titleColor: '#FF1744', sub: 'Limited time only \u2013 Don\'t miss out!', timer: '#FF1744' },
        topBorder: '#FF1744', topBorderNeon: '#FF1744',
        navLine: 'linear-gradient(90deg,#FF1744,#FFD600,#FF1744,#FFD600,#FF1744)',
        decor: [],
        neonFlash: true,
        deal: { text: 'FLASH DEAL!', style: 'brush', color: '#FF1744', accent: '#FFD600' },
        frontendAccent: '#FF1744', frontendAccentRgba: 'rgba(255,23,68,',
        stickyBar: { text: 'FLASH SALE \u2013 Up to 50% OFF for a limited time only!', bg: '#000', bgEnd: '#1a0008', color: '#FF1744', icon: '\u26A1', gradient: 'linear-gradient(135deg,#1a0008,#000)' },
        popup: { title: 'FLASH SALE', sub: 'Save up to 50% \u2013 for a limited time only!', accent: '#FF1744', accent2: '#FFD600', overline: '% Flash Sale %', code: 'FLASH50', countdownHours: 3, btnColor: '#fff', showCountdown: true },
        heroTitle: '⚡ FLASH SALE', heroSub: 'Limited time only – Don\'t miss out!', heroGradient: 'linear-gradient(135deg, rgba(26,0,8,.92) 0%, rgba(255,23,68,.4) 100%)', atmosphere: ['rgba(255,23,68,.08)', 'rgba(255,214,0,.05)'], navAccent: '#FF1744',
        dividerText: 'Flash Sale', heroBadge: { text: 'Flash Sale', icon: '\u26A1' }
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
            /* Premium promo banner – full-width bottom bar */
            '.gb-promo-banner{position:fixed;bottom:0;left:0;width:100%;z-index:10001;font-family:"Inter","Outfit",sans-serif;pointer-events:auto;transform:translateY(100%);animation:gb-promo-in .6s cubic-bezier(.34,1.56,.64,1) 2s forwards}',
            '.gb-promo-inner{display:flex;align-items:center;gap:16px;padding:16px 56px 16px 24px;min-height:64px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);position:relative;border-top:1px solid rgba(255,255,255,.08)}',
            '.gb-promo-icon{flex-shrink:0;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center}',
            '.gb-promo-close{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.5);width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}',
            '.gb-promo-close:hover{background:rgba(255,255,255,.15);color:#fff}',
            '.gb-promo-progress{position:absolute;bottom:0;left:0;width:100%;height:3px;background:rgba(255,255,255,.06);overflow:hidden}',
            '.gb-promo-progress-bar{height:100%;transform-origin:left;animation:gb-barfill 12s linear forwards}',
            '@keyframes gb-promo-in{from{transform:translateY(100%)}to{transform:translateY(0)}}',
            '@keyframes gb-promo-out{to{transform:translateY(100%)}}',
            '@keyframes gb-barfill{to{transform:scaleX(0)}}',
            '@keyframes gb-badge-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:.9}}',
            /* Decorations */
            '.gb-decor{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fin 2s ease .6s forwards}',
            '.gb-decor img,.gb-decor svg{width:100%;height:100%;display:block;object-fit:contain}',
            /* Nav dangle - items hanging from nav bar */
            '.gb-dangle{position:fixed;top:70px;pointer-events:none;z-index:998;opacity:0;animation:gb-fin 1.5s ease .5s forwards}',
            '.gb-dangle-line{width:1px;margin:0 auto}',
            '.gb-dangle-item{transform-origin:top center;animation:gb-swing 4s ease-in-out infinite}',
            '.gb-dangle-item img,.gb-dangle-item svg{width:100%;height:100%;display:block;object-fit:contain}',
            '@keyframes gb-swing{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}',
            /* Hero seasonal takeover overlay */
            '.gb-hero-takeover{position:absolute;inset:0;z-index:15;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;opacity:0;animation:gb-takeover-in 1.2s cubic-bezier(.16,1,.3,1) forwards;overflow:hidden}',
            '.gb-hero-takeover-bg{position:absolute;inset:0;animation:gb-takeover-pulse 4s ease-in-out infinite}',
            '.gb-hero-takeover-title{font-family:"Outfit",sans-serif;font-size:clamp(36px,8vw,80px);font-weight:900;letter-spacing:6px;text-transform:uppercase;text-align:center;position:relative;z-index:2;line-height:1.1;padding:0 20px;background:linear-gradient(90deg,var(--ht-c1) 0%,var(--ht-c2) 40%,#fff 50%,var(--ht-c2) 60%,var(--ht-c1) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gb-shimmer-text 3s linear infinite;filter:drop-shadow(0 0 30px var(--ht-glow))}',
            '.gb-hero-takeover-sub{font-family:"Inter",sans-serif;font-size:clamp(12px,2.5vw,20px);font-weight:400;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.7);text-align:center;margin-top:12px;position:relative;z-index:2}',
            '.gb-hero-takeover-ring{position:absolute;border-radius:50%;border:2px solid;opacity:.4;animation:gb-ring-pulse 3s ease-in-out infinite;pointer-events:none}',
            '@keyframes gb-takeover-in{0%{opacity:0;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}',
            '@keyframes gb-takeover-out{0%{opacity:1}100%{opacity:0;transform:scale(.95)}}',
            '@keyframes gb-takeover-pulse{0%,100%{opacity:.82}50%{opacity:.92}}',
            '@keyframes gb-shimmer-text{0%{background-position:-200% center}100%{background-position:200% center}}',
            '@keyframes gb-ring-pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.05);opacity:.5}}',
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
            '@keyframes gb-hero-ov{to{opacity:.15}}',
            '@keyframes gb-section-ov{to{opacity:.18}}',
            /* Glassmorphism seasonal panel */
            '.gb-glass-banner{position:relative;z-index:10;pointer-events:auto;opacity:0;animation:gb-glass-in 1s cubic-bezier(.34,1.56,.64,1) 1.5s forwards}',
            '.gb-glass-panel{position:relative;background:rgba(15,15,15,.55);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden}',
            '.gb-glass-panel-accent{position:absolute;top:0;left:0;width:100%;height:3px}',
            '.gb-glass-panel-content{padding:16px 20px;position:relative}',
            '.gb-glass-panel-dismiss{position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3);color:rgba(255,255,255,.5);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}',
            '.gb-glass-panel-dismiss:hover{background:rgba(255,255,255,.1);color:#fff}',
            '@keyframes gb-glass-in{0%{opacity:0;transform:translateY(10px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}',
            '@keyframes gb-glass-out{to{opacity:0;transform:translateY(10px) scale(.95)}}',
            /* Nav line shimmer highlight sweep */
            '.gb-nav-line{position:absolute;bottom:-1px;left:0;width:100%;height:2px;border-radius:2px;pointer-events:none;opacity:0;animation:gb-fin 1s ease .8s forwards;overflow:hidden}',
            '.gb-nav-line::after{content:"";position:absolute;top:0;left:-60%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);animation:gb-shsweep 4s ease-in-out 2s infinite}',
            '@keyframes gb-shsweep{0%{left:-60%}40%{left:100%}100%{left:100%}}',
            /* Atmospheric page film overlay */
            '.gb-atmosphere{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-fin 3s ease 1s forwards}',
            '.gb-atmo-layer{position:absolute;inset:-10%;border-radius:50%;animation:gb-atmo-drift var(--ad) ease-in-out infinite}',
            '@keyframes gb-atmo-drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(3%,-2%) scale(1.03)}66%{transform:translate(-2%,3%) scale(.97)}}',
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
            /* Nav corner decorations */
            '.gb-nav-decor{position:absolute;pointer-events:none;z-index:10;opacity:0;animation:gb-fin 1.2s ease .3s forwards;filter:drop-shadow(0 2px 6px rgba(0,0,0,.3))}',
            '.gb-nav-decor img,.gb-nav-decor svg{width:100%;height:100%;display:block;object-fit:contain}',
            /* Hero seasonal badge */
            '.gb-hero-season{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-family:"Inter","Outfit",sans-serif;font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.35);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;animation:gb-fin 1.5s ease 1s forwards;margin-top:10px}',
            /* Seasonal section dividers */
            '.gb-seasonal-divider{display:flex;align-items:center;gap:14px;justify-content:center;padding:24px 20px;pointer-events:none;opacity:0;animation:gb-fin 2s ease 1.2s forwards}',
            '.gb-seasonal-divider-line{flex:1;max-width:100px;height:1px}',
            '.gb-seasonal-divider-text{font-family:"Outfit",sans-serif;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;white-space:nowrap}',
            /* Service card seasonal badge */
            '.gb-card-badge{position:absolute;top:-1px;right:16px;padding:3px 10px;border-radius:0 0 6px 6px;font-family:"Inter",sans-serif;font-size:8px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;z-index:2;pointer-events:none;opacity:0;animation:gb-fin 1.5s ease 1.5s forwards}',
            /* Section themed dividers (legacy) */
            '.gb-section-divider{height:1px;max-width:600px;margin:0 auto;pointer-events:none;opacity:0;animation:gb-fin 2s ease 1s forwards}',
            /* Themed trust numbers */
            '.gb-themed-num{transition:color 1s ease,text-shadow 1s ease}',
            /* Themed CTA buttons */
            '.gb-themed-btn{transition:all .3s cubic-bezier(.34,1.56,.64,1)!important}',
            '.gb-themed-btn:hover{transform:translateY(-3px)!important}',
            /* Hero featured photo – glassmorphism framed gallery image */
            '.gb-hero-photo{position:absolute;z-index:6;bottom:8%;right:5%;width:clamp(140px,22vw,260px);height:clamp(180px,28vw,340px);border-radius:16px;overflow:hidden;border:2px solid rgba(255,255,255,.1);opacity:0;animation:gb-glass-in 1.2s cubic-bezier(.34,1.56,.64,1) .8s forwards}',
            '.gb-hero-photo-overlay{position:absolute;bottom:0;left:0;width:100%;padding:10px 12px;display:flex;align-items:center;gap:8px;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 100%);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}',
            '@media(max-width:768px){.gb-hero-photo{bottom:5%;right:3%;width:120px;height:160px;border-radius:12px}.gb-hero-photo-overlay{padding:6px 8px;gap:6px}}',
            /* Premium decorations – connotation icons with glow & float */
            '.gb-pdecor{pointer-events:none;z-index:3;opacity:0;animation:gb-fin 1.8s ease var(--pdecor-delay,.8s) forwards,gb-pdecor-float var(--fd,10s) ease-in-out 2s infinite;transform:rotate(var(--pdecor-rot,0deg))}',
            '.gb-pdecor svg{width:100%;height:100%;display:block}',
            '.gb-pdecor-hero{position:absolute}',
            '.gb-pdecor-side{position:fixed;transform:rotate(var(--pdecor-rot,0deg))}',
            '@keyframes gb-pdecor-float{0%,100%{transform:rotate(var(--pdecor-rot,0deg)) translateY(0)}50%{transform:rotate(var(--pdecor-rot,0deg)) translateY(-12px)}}',
            /* Responsive */
            '@media(max-width:600px){.gb-promo-inner{padding:12px 48px 12px 16px;min-height:52px;gap:12px}.gb-promo-icon{width:36px;height:36px;border-radius:10px}.gb-lights,.gb-hanging{display:none}.gb-frost-tl,.gb-frost-tr{width:140px;height:140px}.gb-dangle{top:60px}.gb-popup-modal{max-width:360px}.gb-countdown-unit{min-width:44px;padding:8px 4px}.gb-countdown-num{font-size:20px}.gb-hero-takeover-title{letter-spacing:3px}.gb-hero-takeover-sub{letter-spacing:1.5px}.gb-pdecor-side{display:none}.gb-pdecor-hero{opacity:.3 !important}}',
            '@media(prefers-reduced-motion:reduce){.gb-canvas,.gb-bokeh,.gb-fog,.gb-sparkle,.gb-nflash,.gb-dangle-item,.gb-nav-line::after,.gb-hero-takeover,.gb-hero-takeover-bg,.gb-hero-takeover-title,.gb-atmo-layer,.gb-promo-banner{animation:none!important}}'
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
            var bs = type === 'snow' ? rand(3.5, 10) : type === 'hearts' ? rand(14, 30) : type === 'embers' ? rand(2, 6) : type === 'petals' ? rand(5, 12) : type === 'stars' ? rand(5, 14) : type === 'tags' ? rand(14, 28) : type === 'confetti' ? rand(5, 12) : type === 'leaves' ? rand(8, 20) : rand(3.5, 9);
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
            p.rotation += p.rotSpeed; c.globalAlpha = p.opacity; c.shadowBlur = p.size * 2.5; c.shadowColor = p.color || 'rgba(255,255,255,.5)';
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

    /* ═══ BOKEH – disabled (looked cheap) ═══ */
    function createBokeh() { }

    /* ═══ PROMO BANNER – CUSTOM THEMED BOTTOM BAR ═══ */
    /* Each theme gets a completely unique visual design */
    var BANNER_CUSTOM = {
        'black-friday': {
            bg: '#000',
            pattern: 'linear-gradient(135deg,transparent 25%,rgba(255,214,0,.06) 25%,rgba(255,214,0,.06) 35%,transparent 35%,transparent 65%,rgba(255,214,0,.04) 65%,rgba(255,214,0,.04) 75%,transparent 75%)',
            borderTop: '3px solid #FF1744',
            glow: '0 -4px 40px rgba(255,23,68,.25),0 -2px 80px rgba(255,214,0,.08)',
            badge: { text: 'UP TO 30% OFF', bg: '#FF1744', color: '#fff', shadow: '0 4px 20px rgba(255,23,68,.5)' },
            titleStyle: 'font-size:' + (isMobile ? '16px' : '24px') + ';font-weight:900;letter-spacing:6px;color:#fff;text-shadow:0 0 40px rgba(255,23,68,.5),0 2px 4px rgba(0,0,0,.8)',
            subStyle: 'color:rgba(255,214,0,.8)',
            brushStroke: true
        },
        christmas: {
            bg: 'linear-gradient(135deg,#0d1f12 0%,#1a0808 40%,#0d1f12 100%)',
            pattern: 'radial-gradient(circle at 15% 50%,rgba(198,40,40,.15) 0%,transparent 40%),radial-gradient(circle at 85% 50%,rgba(27,94,32,.12) 0%,transparent 40%),radial-gradient(circle at 50% 20%,rgba(255,215,0,.08) 0%,transparent 50%)',
            borderTop: '2px solid transparent',
            borderImage: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 10px,transparent 10px,transparent 16px,#1B5E20 16px,#1B5E20 26px,transparent 26px,transparent 32px,#FFD700 32px,#FFD700 36px,transparent 36px,transparent 42px) 1',
            glow: '0 -4px 30px rgba(198,40,40,.15),0 -2px 60px rgba(27,94,32,.08)',
            hangingBaubles: true,
            titleStyle: 'font-size:' + (isMobile ? '13px' : '16px') + ';font-weight:800;letter-spacing:3px;color:#FFD700;text-shadow:0 0 20px rgba(255,215,0,.4)',
            subStyle: 'color:rgba(200,230,201,.6)'
        },
        valentines: {
            bg: 'linear-gradient(135deg,#2a0815 0%,#3d0520 50%,#2a0815 100%)',
            pattern: 'radial-gradient(circle at 20% 30%,rgba(233,30,99,.12) 0%,transparent 35%),radial-gradient(circle at 80% 70%,rgba(244,143,177,.1) 0%,transparent 35%)',
            borderTop: '2px solid',
            borderImage: 'linear-gradient(90deg,transparent,#E91E63,#F48FB1,#E91E63,transparent) 1',
            glow: '0 -4px 30px rgba(233,30,99,.2),0 -2px 60px rgba(244,143,177,.1)',
            floatingHearts: true,
            titleStyle: 'font-size:' + (isMobile ? '13px' : '16px') + ';font-weight:800;letter-spacing:3px;color:#F48FB1;text-shadow:0 0 25px rgba(233,30,99,.5)',
            subStyle: 'color:rgba(244,143,177,.6);font-style:italic'
        },
        winter: {
            bg: 'linear-gradient(135deg,#0a1628 0%,#0d2137 50%,#0a1628 100%)',
            pattern: 'radial-gradient(circle at 10% 20%,rgba(79,195,247,.08) 0%,transparent 30%),radial-gradient(circle at 90% 80%,rgba(179,229,252,.06) 0%,transparent 30%),radial-gradient(circle at 50% 50%,rgba(225,245,254,.04) 0%,transparent 50%)',
            borderTop: '2px solid',
            borderImage: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,.5),rgba(225,245,254,.8),rgba(79,195,247,.5),rgba(79,195,247,0)) 1',
            glow: '0 -4px 30px rgba(79,195,247,.15),0 -2px 60px rgba(225,245,254,.06)',
            frostEdge: true,
            titleStyle: 'font-size:' + (isMobile ? '13px' : '16px') + ';font-weight:700;letter-spacing:3px;color:#E1F5FE;text-shadow:0 0 20px rgba(79,195,247,.4)',
            subStyle: 'color:rgba(179,229,252,.5)'
        },
        halloween: {
            bg: 'linear-gradient(135deg,#1a0a2e 0%,#2e1500 50%,#1a0a2e 100%)',
            pattern: 'radial-gradient(circle at 10% 50%,rgba(106,27,154,.2) 0%,transparent 35%),radial-gradient(circle at 90% 50%,rgba(255,111,0,.15) 0%,transparent 35%)',
            borderTop: '3px solid',
            borderImage: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C,#FF6F00,#4A148C) 1',
            glow: '0 -4px 40px rgba(255,111,0,.2),0 -2px 80px rgba(106,27,154,.12)',
            spiderweb: true,
            titleStyle: 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:900;letter-spacing:4px;color:#FFE0B2;text-shadow:0 0 30px rgba(255,111,0,.6),0 0 60px rgba(106,27,154,.3)',
            subStyle: 'color:rgba(255,224,178,.5)'
        },
        easter: {
            bg: 'linear-gradient(135deg,#0f1f0f 0%,#1a0f1a 50%,#0f1f0f 100%)',
            pattern: 'radial-gradient(circle at 20% 40%,rgba(129,199,132,.1) 0%,transparent 35%),radial-gradient(circle at 70% 60%,rgba(244,143,177,.08) 0%,transparent 35%),radial-gradient(circle at 45% 20%,rgba(255,245,157,.06) 0%,transparent 40%)',
            borderTop: '3px solid transparent',
            borderImage: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px) 1',
            glow: '0 -4px 30px rgba(129,199,132,.15),0 -2px 50px rgba(244,143,177,.08)',
            eggDeco: true,
            titleStyle: 'font-size:' + (isMobile ? '13px' : '16px') + ';font-weight:800;letter-spacing:3px;color:#C8E6C9;text-shadow:0 0 20px rgba(129,199,132,.4)',
            subStyle: 'color:rgba(200,230,201,.5)'
        },
        summer: {
            bg: 'linear-gradient(135deg,#1f1200 0%,#001520 100%)',
            pattern: 'linear-gradient(180deg,rgba(255,143,0,.08) 0%,transparent 40%,transparent 60%,rgba(2,136,209,.06) 100%)',
            borderTop: '3px solid transparent',
            borderImage: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1) 1',
            glow: '0 -4px 30px rgba(255,143,0,.15),0 -2px 60px rgba(2,136,209,.08)',
            sunRay: true,
            titleStyle: 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:900;letter-spacing:4px;color:#FFF3E0;text-shadow:0 0 25px rgba(255,143,0,.5)',
            subStyle: 'color:rgba(255,243,224,.5)'
        },
        eid: {
            bg: 'linear-gradient(135deg,#0f1f0a 0%,#1a1a05 50%,#0f1f0a 100%)',
            pattern: 'radial-gradient(circle at 50% 50%,rgba(253,216,53,.06) 0%,transparent 50%),radial-gradient(circle at 15% 50%,rgba(46,125,50,.08) 0%,transparent 35%),radial-gradient(circle at 85% 50%,rgba(46,125,50,.08) 0%,transparent 35%)',
            borderTop: '2px solid',
            borderImage: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px,transparent 12px,transparent 20px,#2E7D32 20px,#2E7D32 24px,transparent 24px,transparent 32px) 1',
            glow: '0 -4px 30px rgba(253,216,53,.15),0 -2px 60px rgba(46,125,50,.08)',
            crescentDeco: true,
            titleStyle: 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:800;letter-spacing:4px;color:#FFF9C4;text-shadow:0 0 25px rgba(253,216,53,.5)',
            subStyle: 'color:rgba(255,249,196,.5)'
        },
        ramadan: {
            bg: 'linear-gradient(135deg,#0a0a2e 0%,#1a1025 50%,#0a0a2e 100%)',
            pattern: 'radial-gradient(circle at 50% 0%,rgba(184,134,11,.1) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(26,35,126,.08) 0%,transparent 40%),radial-gradient(circle at 80% 80%,rgba(26,35,126,.08) 0%,transparent 40%)',
            borderTop: '2px solid',
            borderImage: 'linear-gradient(90deg,rgba(184,134,11,0),#B8860B,rgba(184,134,11,.5),#B8860B,rgba(184,134,11,0)) 1',
            glow: '0 -4px 30px rgba(184,134,11,.15),0 -2px 60px rgba(26,35,126,.08)',
            lanternDeco: true,
            titleStyle: 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:800;letter-spacing:4px;color:#E8EAF6;text-shadow:0 0 25px rgba(184,134,11,.4)',
            subStyle: 'color:rgba(232,234,246,.45)'
        },
        autumn: {
            bg: 'linear-gradient(135deg,#1a0f05 0%,#120800 100%)',
            pattern: 'radial-gradient(ellipse at 30% 50%,rgba(221,44,0,.1) 0%,transparent 45%),radial-gradient(ellipse at 70% 50%,rgba(255,179,0,.08) 0%,transparent 45%)',
            borderTop: '3px solid transparent',
            borderImage: 'linear-gradient(90deg,#DD2C00,#FF6F00,#BF360C,#FFB300,#DD2C00) 1',
            glow: '0 -4px 30px rgba(221,44,0,.15),0 -2px 60px rgba(255,143,0,.08)',
            leafDeco: true,
            titleStyle: 'font-size:' + (isMobile ? '13px' : '16px') + ';font-weight:800;letter-spacing:3px;color:#FFAB91;text-shadow:0 0 20px rgba(221,44,0,.4)',
            subStyle: 'color:rgba(255,171,145,.5)'
        },
        'new-year': {
            bg: 'linear-gradient(135deg,#0a0a2e 0%,#0d1535 50%,#0a0a2e 100%)',
            pattern: 'radial-gradient(circle at 30% 30%,rgba(255,215,0,.1) 0%,transparent 40%),radial-gradient(circle at 70% 70%,rgba(13,71,161,.08) 0%,transparent 40%),radial-gradient(circle at 50% 0%,rgba(255,215,0,.06) 0%,transparent 50%)',
            borderTop: '2px solid',
            borderImage: 'linear-gradient(90deg,transparent,#FFD700,#fff,#FFD700,transparent) 1',
            glow: '0 -4px 30px rgba(255,215,0,.2),0 -2px 60px rgba(13,71,161,.1)',
            fireworkDeco: true,
            badge: { text: 'NEW YEAR 2026', bg: 'linear-gradient(135deg,#FFD700,#FFA000)', color: '#000', shadow: '0 4px 20px rgba(255,215,0,.4)' },
            titleStyle: 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:900;letter-spacing:5px;color:#FFD700;text-shadow:0 0 30px rgba(255,215,0,.5),0 0 60px rgba(255,215,0,.2)',
            subStyle: 'color:rgba(255,255,255,.5)'
        },
        'flash-sale': {
            bg: 'linear-gradient(135deg,#1a0008 0%,#0a0000 100%)',
            pattern: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,23,68,.03) 40px,rgba(255,23,68,.03) 42px)',
            borderTop: '3px solid #FF1744',
            glow: '0 -4px 40px rgba(255,23,68,.3),0 -2px 80px rgba(255,214,0,.08)',
            badge: { text: 'UP TO 50% OFF', bg: '#FF1744', color: '#fff', shadow: '0 4px 20px rgba(255,23,68,.5)', pulse: true },
            titleStyle: 'font-size:' + (isMobile ? '16px' : '22px') + ';font-weight:900;letter-spacing:5px;color:#FF1744;text-shadow:0 0 30px rgba(255,23,68,.6),0 0 60px rgba(255,23,68,.2)',
            subStyle: 'color:rgba(255,214,0,.6)'
        }
    };
    BANNER_CUSTOM.blackfriday = BANNER_CUSTOM['black-friday'];
    BANNER_CUSTOM.newyear = BANNER_CUSTOM['new-year'];
    BANNER_CUSTOM.flashsale = BANNER_CUSTOM['flash-sale'];

    function getBannerDecoHtml(themeId, b) {
        var tid = themeId.replace(/-/g, '');
        var h = '';
        if (tid === 'blackfriday') {
            /* Black Friday: bold brush stroke + lightning bolts */
            if (!isMobile) {
                h += '<div style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none">';
                h += '<div style="position:absolute;left:-5%;top:-50%;width:30%;height:200%;background:linear-gradient(180deg,transparent,rgba(255,214,0,.08),rgba(255,214,0,.12),rgba(255,214,0,.08),transparent);transform:rotate(25deg)"></div>';
                h += '<div style="position:absolute;right:15%;top:-50%;width:20%;height:200%;background:linear-gradient(180deg,transparent,rgba(255,214,0,.05),rgba(255,214,0,.08),rgba(255,214,0,.05),transparent);transform:rotate(25deg)"></div>';
                h += '</div>';
            }
            h += '<svg style="position:absolute;left:' + (isMobile ? '8px' : '16px') + ';top:50%;transform:translateY(-50%);width:' + (isMobile ? '28px' : '44px') + ';height:' + (isMobile ? '28px' : '44px') + ';opacity:.6;filter:drop-shadow(0 0 10px rgba(255,214,0,.5))" viewBox="0 0 24 24"><path fill="#FFD600" d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>';
        } else if (tid === 'christmas') {
            /* Christmas: hanging ornaments + star */
            if (!isMobile) {
                var cols = ['#C62828','#1B5E20','#FFD700','#C62828','#1B5E20'];
                var xpos = [12, 28, 50, 72, 88];
                for (var ci = 0; ci < 5; ci++) {
                    var sz = 6 + (ci % 2) * 3;
                    h += '<div style="position:absolute;top:-1px;left:' + xpos[ci] + '%;pointer-events:none">';
                    h += '<div style="width:1px;height:' + (10 + ci * 3) + 'px;background:rgba(255,215,0,.3);margin:0 auto"></div>';
                    h += '<div style="width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:' + cols[ci] + ';box-shadow:0 0 8px ' + cols[ci] + '80,inset 0 -2px 4px rgba(0,0,0,.3);margin:-1px auto 0"></div>';
                    h += '</div>';
                }
            }
        } else if (tid === 'valentines') {
            /* Valentine's: floating hearts */
            if (!isMobile) {
                var hx = [8, 25, 55, 78, 92];
                var hy = [20, 60, 15, 70, 35];
                for (var vi = 0; vi < 5; vi++) {
                    h += '<div style="position:absolute;left:' + hx[vi] + '%;top:' + hy[vi] + '%;pointer-events:none;opacity:.15;animation:gb-pdecor-float ' + (6 + vi * 2) + 's ease-in-out infinite">';
                    h += '<svg width="' + (12 + vi * 2) + '" height="' + (12 + vi * 2) + '" viewBox="0 0 24 24"><path fill="' + (vi % 2 ? '#F48FB1' : '#E91E63') + '" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
                    h += '</div>';
                }
            }
        } else if (tid === 'halloween') {
            /* Halloween: spiderweb corner + bats */
            if (!isMobile) {
                h += '<div style="position:absolute;right:50px;top:0;width:50px;height:50px;pointer-events:none;opacity:.12">';
                h += '<svg viewBox="0 0 50 50"><path stroke="rgba(255,255,255,.5)" fill="none" stroke-width=".5" d="M0,0 Q25,25 50,0 M0,0 Q25,30 0,50 M0,0 L50,50 M0,0 L25,50 M0,0 L50,25"/></svg>';
                h += '</div>';
                h += '<svg style="position:absolute;left:15%;top:15%;width:20px;opacity:.2;animation:gb-pdecor-float 5s ease-in-out infinite" viewBox="0 0 24 24"><path fill="#FF6F00" d="M3,12 C3,8 5,4 12,2 C19,4 21,8 21,12 C21,12 18,10 15,12 C15,12 13,10 12,12 C11,10 9,12 9,12 C6,10 3,12 3,12Z"/></svg>';
                h += '<svg style="position:absolute;right:20%;top:25%;width:16px;opacity:.15;animation:gb-pdecor-float 7s ease-in-out infinite" viewBox="0 0 24 24"><path fill="#6A1B9A" d="M3,12 C3,8 5,4 12,2 C19,4 21,8 21,12 C21,12 18,10 15,12 C15,12 13,10 12,12 C11,10 9,12 9,12 C6,10 3,12 3,12Z"/></svg>';
            }
        } else if (tid === 'winter') {
            /* Winter: crystalline snowflakes */
            if (!isMobile) {
                var sx = [8, 30, 60, 85];
                for (var si = 0; si < 4; si++) {
                    h += '<svg style="position:absolute;left:' + sx[si] + '%;top:' + (15 + si * 15) + '%;width:' + (14 + si * 3) + 'px;opacity:.12;animation:gb-pdecor-float ' + (7 + si * 2) + 's ease-in-out infinite;filter:drop-shadow(0 0 4px rgba(79,195,247,.4))" viewBox="0 0 24 24"><path fill="#B3E5FC" d="M12,2 L12,22 M2,12 L22,12 M5,5 L19,19 M19,5 L5,19" stroke="#B3E5FC" stroke-width="1" fill="none"/><circle cx="12" cy="12" r="2" fill="#E1F5FE"/></svg>';
                }
            }
        } else if (tid === 'eid' || tid === 'ramadan') {
            /* Eid/Ramadan: crescent + hanging lanterns */
            if (!isMobile) {
                h += '<svg style="position:absolute;left:10%;top:10%;width:32px;opacity:.18;filter:drop-shadow(0 0 8px ' + (tid === 'eid' ? '#FDD835' : '#B8860B') + ')" viewBox="0 0 24 24"><path fill="' + (tid === 'eid' ? '#FDD835' : '#B8860B') + '" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A8,8 0 0,1 12,2Z"/><circle cx="18" cy="6" r="2" fill="' + (tid === 'eid' ? '#FDD835' : '#B8860B') + '"/></svg>';
                var lx = [30, 55, 75];
                for (var li = 0; li < 3; li++) {
                    h += '<div style="position:absolute;top:-1px;left:' + lx[li] + '%;pointer-events:none">';
                    h += '<div style="width:1px;height:' + (8 + li * 4) + 'px;background:rgba(255,215,0,.2);margin:0 auto"></div>';
                    h += '<div style="width:8px;height:12px;border-radius:3px 3px 50% 50%;background:linear-gradient(180deg,' + (tid === 'eid' ? '#FDD835' : '#B8860B') + ',' + (tid === 'eid' ? '#F9A825' : '#8B6914') + ');box-shadow:0 0 6px ' + (tid === 'eid' ? 'rgba(253,216,53,.4)' : 'rgba(184,134,11,.4)') + ';margin:0 auto"></div>';
                    h += '</div>';
                }
            }
        } else if (tid === 'easter') {
            /* Easter: decorated eggs */
            if (!isMobile) {
                var ec = ['#F48FB1','#81C784','#FFF59D','#90CAF9'];
                var ex = [10, 35, 65, 88];
                for (var ei = 0; ei < 4; ei++) {
                    h += '<div style="position:absolute;left:' + ex[ei] + '%;top:' + (20 + ei * 12) + '%;width:10px;height:13px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:' + ec[ei] + ';opacity:.15;transform:rotate(' + (-15 + ei * 10) + 'deg);box-shadow:inset 0 2px 4px rgba(255,255,255,.3)"></div>';
                }
            }
        } else if (tid === 'summer') {
            /* Summer: sun rays + wave */
            if (!isMobile) {
                h += '<div style="position:absolute;left:5%;top:5%;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,rgba(255,143,0,.2),transparent 70%);box-shadow:0 0 20px rgba(255,143,0,.15);pointer-events:none"></div>';
                h += '<div style="position:absolute;bottom:0;left:0;width:100%;height:8px;background:linear-gradient(90deg,transparent,rgba(2,136,209,.12),rgba(2,136,209,.08),rgba(2,136,209,.12),transparent);pointer-events:none"></div>';
            }
        } else if (tid === 'autumn') {
            /* Autumn: falling leaves */
            if (!isMobile) {
                var lc = ['#DD2C00','#FF6F00','#FFB300','#BF360C'];
                var lxp = [12, 38, 62, 85];
                for (var ai = 0; ai < 4; ai++) {
                    h += '<div style="position:absolute;left:' + lxp[ai] + '%;top:' + (15 + ai * 15) + '%;width:12px;height:12px;pointer-events:none;opacity:.15;transform:rotate(' + (ai * 45 - 30) + 'deg);animation:gb-pdecor-float ' + (6 + ai * 2) + 's ease-in-out infinite">';
                    h += '<svg viewBox="0 0 24 24"><path fill="' + lc[ai] + '" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>';
                    h += '</div>';
                }
            }
        } else if (tid === 'newyear') {
            /* New Year: firework bursts */
            if (!isMobile) {
                var fw = [{ x: 15, c: '#FFD700' }, { x: 50, c: '#fff' }, { x: 82, c: '#FFD700' }];
                for (var fi = 0; fi < 3; fi++) {
                    h += '<div style="position:absolute;left:' + fw[fi].x + '%;top:20%;width:24px;height:24px;pointer-events:none;opacity:.12">';
                    h += '<div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,' + fw[fi].c + ' 0%,transparent 70%)"></div>';
                    for (var ri = 0; ri < 6; ri++) {
                        h += '<div style="position:absolute;left:50%;top:50%;width:1px;height:10px;background:' + fw[fi].c + ';transform-origin:bottom center;transform:rotate(' + (ri * 60) + 'deg) translateY(-6px)"></div>';
                    }
                    h += '</div>';
                }
            }
        }
        return h;
    }

    function createPromoBanner(theme, themeId) {
        if (!theme.banner) return;
        try { if (localStorage.getItem('gb-promo-dismissed') === state.id) return; } catch (e) { }
        var b = theme.banner;
        var icon = BI[themeId] || BI[themeId.replace(/-/g, '')] || '';
        var custom = BANNER_CUSTOM[themeId] || BANNER_CUSTOM[themeId.replace(/-/g, '')] || {};
        var el = document.createElement('div'); el.className = 'gb-promo-banner';

        var bgStyle = (custom.bg || b.bg);
        var boxShadow = (custom.glow || b.shadow);
        var borderTop = custom.borderTop || ('2px solid ' + b.accent);

        var html = '<div class="gb-promo-inner" style="background:' + bgStyle + ';box-shadow:' + boxShadow + ';border-top:' + borderTop + (custom.borderImage ? ';border-image:' + custom.borderImage : '') + '">';

        /* Pattern overlay */
        if (custom.pattern) {
            html += '<div style="position:absolute;inset:0;background:' + custom.pattern + ';pointer-events:none"></div>';
        }

        /* Theme-specific decorations */
        html += getBannerDecoHtml(themeId, b);

        /* Icon */
        html += '<div class="gb-promo-icon" style="background:' + b.iconBg + ';border:1px solid ' + b.accent + '20;box-shadow:0 0 20px ' + b.accent + '15;position:relative;z-index:2">' + icon + '</div>';

        /* Text content */
        html += '<div style="flex:1;position:relative;z-index:2">';
        html += '<div style="' + (custom.titleStyle || 'font-size:' + (isMobile ? '12px' : '14px') + ';font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:' + b.titleColor + ';text-shadow:0 0 20px ' + b.accent + '40') + '">' + b.title + '</div>';
        html += '<div style="font-size:' + (isMobile ? '10px' : '12px') + ';font-weight:400;margin-top:3px;line-height:1.3;' + (custom.subStyle || 'color:rgba(255,255,255,.55)') + '">' + b.sub + '</div>';
        html += '</div>';

        /* Custom badge (Black Friday, Flash Sale, New Year) */
        if (custom.badge && !isMobile) {
            var bdg = custom.badge;
            html += '<div style="flex-shrink:0;padding:6px 16px;background:' + bdg.bg + ';color:' + bdg.color + ';font-size:10px;font-weight:900;letter-spacing:2px;border-radius:6px;box-shadow:' + bdg.shadow + ';position:relative;z-index:2' + (bdg.pulse ? ';animation:gb-badge-pulse 2s ease-in-out infinite' : '') + '">' + bdg.text + '</div>';
        }
        /* Or discount code badge */
        else if (theme.popup && theme.popup.code && !isMobile) {
            html += '<div style="flex-shrink:0;padding:5px 12px;background:' + b.accent + '18;border:1px solid ' + b.accent + '30;border-radius:8px;text-align:center;position:relative;z-index:2">';
            html += '<div style="font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1px">CODE</div>';
            html += '<div style="font-size:13px;font-weight:800;color:' + b.accent + ';letter-spacing:2px">' + theme.popup.code + '</div>';
            html += '</div>';
        }

        html += '<button class="gb-promo-close" onclick="this.closest(\'.gb-promo-banner\').dispatchEvent(new Event(\'dismiss\'))">&times;</button>';
        html += '<div class="gb-promo-progress"><div class="gb-promo-progress-bar" style="background:' + (b.timer || b.accent) + '"></div></div>';
        html += '</div>';

        el.innerHTML = html;
        document.body.appendChild(el);
        state.promoBanner = el;
        el.addEventListener('dismiss', dismissPromoBanner);
        state.promoBannerTimer = setTimeout(function () { if (state.promoBanner) dismissPromoBanner(); }, 12000);
    }
    function dismissPromoBanner() {
        if (!state.promoBanner) return;
        if (state.promoBannerTimer) { clearTimeout(state.promoBannerTimer); state.promoBannerTimer = null; }
        state.promoBanner.style.animation = 'gb-promo-out .4s ease forwards';
        var ref = state.promoBanner;
        setTimeout(function () { if (ref && ref.parentNode) ref.remove(); }, 400);
        state.promoBanner = null;
        try { localStorage.setItem('gb-promo-dismissed', state.id); } catch (e) { }
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

            /* NAV CORNER: decorations positioned inside nav bar edges */
            if (pos === 'nav-tl' || pos === 'nav-tr') {
                var navInner = document.querySelector('.nav-inner') || document.querySelector('.nav');
                if (!navInner) return;
                navInner.style.position = 'relative';
                var elN = document.createElement('div'); elN.className = 'gb-nav-decor';
                elN.style.width = w + 'px'; elN.style.height = h + 'px';
                elN.style.top = '50%'; elN.style.transform = 'translateY(-50%)';
                if (pos === 'nav-tl') elN.style.left = (isMobile ? '50px' : '190px');
                else elN.style.right = (isMobile ? '55px' : '130px');
                if (cfg.opacity) elN.style.opacity = cfg.opacity;
                if (cfg.rotate) elN.style.transform = 'translateY(-50%) rotate(' + cfg.rotate + 'deg)';
                elN.innerHTML = content;
                navInner.appendChild(elN); state.decorEls.push(elN);
                return;
            }

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

    /* ═══════════════════════════════════════════
       PREMIUM DECORATIONS – CONNOTATION-BASED ICONS
       Creative placement with glow, float, glassmorphism
    ═══════════════════════════════════════════ */
    var THEME_DECOR_CONFIG = {
        christmas: [
            { svg: 'bauble', pos: 'hero-tl', size: 90, opacity: .45, glow: '#C62828', rotate: -15 },
            { svg: 'holly', pos: 'hero-tr', size: 75, opacity: .5, glow: '#1B5E20', rotate: 10 },
            { svg: 'christmasStar', pos: 'hero-bl', size: 55, opacity: .35, glow: '#FFD700' },
            { svg: 'giftBox', pos: 'side-right-30', size: 50, opacity: .25, rotate: 5 },
            { svg: 'bell', pos: 'side-left-55', size: 42, opacity: .2, rotate: -10 },
            { svg: 'candyCane', pos: 'side-right-70', size: 48, opacity: .25, rotate: 15 },
            { svg: 'wreath', pos: 'side-left-85', size: 44, opacity: .2 }
        ],
        valentines: [
            { svg: 'heartDuo', pos: 'hero-tl', size: 95, opacity: .4, glow: '#E91E63' },
            { svg: 'roseBud', pos: 'hero-tr', size: 80, opacity: .45, glow: '#AD1457', rotate: 10 },
            { svg: 'cupidArrow', pos: 'hero-bl', size: 60, opacity: .3, rotate: -20 },
            { svg: 'loveRing', pos: 'side-right-35', size: 45, opacity: .25 },
            { svg: 'heartDuo', pos: 'side-left-50', size: 40, opacity: .2 },
            { svg: 'roseBud', pos: 'side-right-75', size: 42, opacity: .2, rotate: -15 }
        ],
        winter: [
            { svg: 'snowCrystal', pos: 'hero-tl', size: 100, opacity: .4, glow: '#4FC3F7' },
            { svg: 'pineSnow', pos: 'hero-tr', size: 80, opacity: .45, glow: '#1B5E20' },
            { svg: 'iceCluster', pos: 'hero-bl', size: 60, opacity: .3 },
            { svg: 'snowCrystal', pos: 'side-right-40', size: 50, opacity: .2, rotate: 30 },
            { svg: 'pineSnow', pos: 'side-left-60', size: 42, opacity: .2 },
            { svg: 'snowCrystal', pos: 'side-right-80', size: 35, opacity: .15, rotate: -45 }
        ],
        halloween: [
            { svg: 'pumpkinFace', pos: 'hero-tl', size: 90, opacity: .5, glow: '#FF6F00' },
            { svg: 'ghosty', pos: 'hero-tr', size: 80, opacity: .45, glow: 'rgba(255,255,255,.3)' },
            { svg: 'skullIcon', pos: 'hero-bl', size: 55, opacity: .3 },
            { svg: 'cauldron', pos: 'side-right-35', size: 50, opacity: .25 },
            { svg: 'ghosty', pos: 'side-left-55', size: 40, opacity: .2 },
            { svg: 'pumpkinFace', pos: 'side-right-75', size: 45, opacity: .2, rotate: 10 }
        ],
        easter: [
            { svg: 'eggPainted', pos: 'hero-tl', size: 85, opacity: .45, glow: '#81C784' },
            { svg: 'butterfly', pos: 'hero-tr', size: 75, opacity: .4, glow: '#CE93D8' },
            { svg: 'tulip', pos: 'hero-bl', size: 55, opacity: .35 },
            { svg: 'eggPainted', pos: 'side-right-35', size: 45, opacity: .25, rotate: 15 },
            { svg: 'tulip', pos: 'side-left-55', size: 40, opacity: .2 },
            { svg: 'butterfly', pos: 'side-right-80', size: 38, opacity: .2 }
        ],
        summer: [
            { svg: 'sunRays', pos: 'hero-tl', size: 100, opacity: .4, glow: '#FFB300' },
            { svg: 'palmIsland', pos: 'hero-tr', size: 85, opacity: .45, glow: '#2E7D32' },
            { svg: 'cocktail', pos: 'hero-bl', size: 55, opacity: .35 },
            { svg: 'sunRays', pos: 'side-right-35', size: 45, opacity: .2, rotate: 15 },
            { svg: 'cocktail', pos: 'side-left-60', size: 38, opacity: .2, rotate: -10 },
            { svg: 'palmIsland', pos: 'side-right-80', size: 42, opacity: .2 }
        ],
        eid: [
            { svg: 'crescentStar', pos: 'hero-tl', size: 90, opacity: .45, glow: '#FDD835' },
            { svg: 'lanternGold', pos: 'hero-tr', size: 80, opacity: .5, glow: '#B8860B' },
            { svg: 'mosqueIcon', pos: 'hero-bl', size: 55, opacity: .3 },
            { svg: 'lanternGold', pos: 'side-right-35', size: 48, opacity: .25 },
            { svg: 'crescentStar', pos: 'side-left-55', size: 40, opacity: .2 },
            { svg: 'lanternGold', pos: 'side-right-80', size: 38, opacity: .2 }
        ],
        ramadan: [
            { svg: 'lanternGold', pos: 'hero-tl', size: 90, opacity: .5, glow: '#B8860B' },
            { svg: 'crescentStar', pos: 'hero-tr', size: 85, opacity: .45, glow: '#FDD835' },
            { svg: 'mosqueIcon', pos: 'hero-bl', size: 55, opacity: .3 },
            { svg: 'lanternGold', pos: 'side-right-40', size: 45, opacity: .25 },
            { svg: 'crescentStar', pos: 'side-left-60', size: 40, opacity: .2 },
            { svg: 'mosqueIcon', pos: 'side-right-80', size: 42, opacity: .2 }
        ],
        autumn: [
            { svg: 'oakLeaf', pos: 'hero-tl', size: 90, opacity: .45, glow: '#DD2C00', rotate: -20 },
            { svg: 'mushroom', pos: 'hero-tr', size: 75, opacity: .4, glow: '#BF360C' },
            { svg: 'acornNut', pos: 'hero-bl', size: 55, opacity: .35 },
            { svg: 'oakLeaf', pos: 'side-right-35', size: 48, opacity: .25, rotate: 30 },
            { svg: 'acornNut', pos: 'side-left-55', size: 38, opacity: .2 },
            { svg: 'oakLeaf', pos: 'side-right-75', size: 40, opacity: .2, rotate: -45 },
            { svg: 'mushroom', pos: 'side-left-85', size: 36, opacity: .18 }
        ],
        'black-friday': [
            { svg: 'priceStar', pos: 'hero-tl', size: 95, opacity: .5, glow: '#FF1744' },
            { svg: 'shoppingBag', pos: 'hero-tr', size: 80, opacity: .45, glow: '#FFD600' },
            { svg: 'discountTag', pos: 'hero-bl', size: 55, opacity: .35 },
            { svg: 'priceStar', pos: 'side-right-30', size: 50, opacity: .25 },
            { svg: 'shoppingBag', pos: 'side-left-50', size: 42, opacity: .2 },
            { svg: 'discountTag', pos: 'side-right-70', size: 40, opacity: .2, rotate: 10 }
        ],
        'new-year': [
            { svg: 'fireworkBurst', pos: 'hero-tl', size: 95, opacity: .45, glow: '#FFD700' },
            { svg: 'champagneGlass', pos: 'hero-tr', size: 80, opacity: .5, glow: '#FFD700' },
            { svg: 'partyPopper', pos: 'hero-bl', size: 60, opacity: .35 },
            { svg: 'fireworkBurst', pos: 'side-right-35', size: 50, opacity: .25, rotate: 15 },
            { svg: 'champagneGlass', pos: 'side-left-55', size: 40, opacity: .2 },
            { svg: 'partyPopper', pos: 'side-right-80', size: 42, opacity: .2 }
        ],
        'flash-sale': [
            { svg: 'lightningBolt', pos: 'hero-tl', size: 95, opacity: .5, glow: '#FF1744' },
            { svg: 'megaphone', pos: 'hero-tr', size: 80, opacity: .45, glow: '#FFD600' },
            { svg: 'alarmClock', pos: 'hero-bl', size: 55, opacity: .35 },
            { svg: 'lightningBolt', pos: 'side-right-30', size: 50, opacity: .3, rotate: 10 },
            { svg: 'priceStar', pos: 'side-left-50', size: 42, opacity: .25 },
            { svg: 'lightningBolt', pos: 'side-right-75', size: 38, opacity: .2, rotate: -10 }
        ]
    };
    THEME_DECOR_CONFIG.blackfriday = THEME_DECOR_CONFIG['black-friday'];
    THEME_DECOR_CONFIG.newyear = THEME_DECOR_CONFIG['new-year'];
    THEME_DECOR_CONFIG.flashsale = THEME_DECOR_CONFIG['flash-sale'];

    function createPremiumDecor(theme, themeKey) {
        var config = THEME_DECOR_CONFIG[themeKey] || THEME_DECOR_CONFIG[themeKey.replace(/-/g, '')] || [];
        if (!config.length) return;
        var hero = document.querySelector('.hero');
        var heroHasPos = hero && window.getComputedStyle(hero).position !== 'static';
        if (hero && !heroHasPos) hero.style.position = 'relative';

        config.forEach(function (item, idx) {
            var svgContent = CSVG[item.svg];
            if (!svgContent) return;
            if (isMobile && item.size > 60) return; /* Skip large hero decorations on mobile */

            var el = document.createElement('div');
            el.className = 'gb-pdecor';
            el.innerHTML = svgContent;

            var sz = isMobile ? Math.round(item.size * 0.6) : item.size;
            el.style.width = sz + 'px';
            el.style.height = sz + 'px';

            /* Glow halo */
            if (item.glow) {
                el.style.filter = 'drop-shadow(0 0 ' + Math.round(sz * 0.2) + 'px ' + item.glow + ')';
            }
            if (item.rotate) {
                el.style.setProperty('--pdecor-rot', item.rotate + 'deg');
            }

            /* Float animation delay for variety */
            el.style.animationDelay = (0.5 + idx * 0.3) + 's,' + (1 + idx * 0.4) + 's';
            el.style.setProperty('--fd', (8 + (idx % 3) * 3) + 's');

            var pos = item.pos;

            /* HERO CORNER positions – inside the hero section */
            if (pos.indexOf('hero-') === 0) {
                if (!hero) return;
                el.classList.add('gb-pdecor-hero');
                if (pos === 'hero-tl') { el.style.top = '15%'; el.style.left = '3%'; }
                else if (pos === 'hero-tr') { el.style.top = '12%'; el.style.right = '3%'; }
                else if (pos === 'hero-bl') { el.style.bottom = '18%'; el.style.left = '4%'; }
                else if (pos === 'hero-br') { el.style.bottom = '15%'; el.style.right = '4%'; }
                hero.appendChild(el);
            }
            /* SIDE positions – fixed to viewport edges */
            else if (pos.indexOf('side-') === 0) {
                var parts = pos.split('-');
                var side = parts[1];
                var yPct = parseInt(parts[2]) || 50;
                el.classList.add('gb-pdecor-side');
                el.style.top = yPct + '%';
                if (side === 'right') el.style.right = '12px';
                else el.style.left = '12px';
                document.body.appendChild(el);
            }

            state.decorEls.push(el);
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
                h.style.cssText = 'width:' + hatW + 'px;height:' + hatH + 'px;top:' + (cTop - hatH * 0.28) + 'px;left:' + (cLeft + cW * 0.62) + 'px;transform:rotate(-22deg)';
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
                nh.style.cssText = 'width:' + (imgW * 0.6) + 'px;height:' + (imgW * 0.52) + 'px;top:' + (-imgW * 0.32) + 'px;left:' + (imgW * 0.45) + 'px;transform:rotate(-20deg)';
            }
            logo.appendChild(nh); state.hatEls.push(nh);
        });
    }

    /* ═══ HERO FEATURED PHOTO – gallery image with glassmorphism frame ═══ */
    function createHeroPhoto(theme) {
        var hero = document.querySelector('.hero');
        if (!hero) return;
        var heroPos = window.getComputedStyle(hero).position;
        if (heroPos === 'static') hero.style.position = 'relative';
        var accent = theme.frontendAccent || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';

        /* Pick a gallery photo – use the hero showcase images */
        var photos = ['download (7).jpg', 'download (9).jpg', 'download (10).jpg', 'download (16).jpg'];
        var photo = photos[Math.floor(Math.random() * photos.length)];

        var el = document.createElement('div');
        el.className = 'gb-hero-photo';
        el.style.cssText = 'border-color:' + accentRgba + '0.3);box-shadow:0 0 40px ' + accentRgba + '0.2),0 20px 60px rgba(0,0,0,.5)';

        var html = '<img src="' + photo + '" alt="Golden Barbers" style="width:100%;height:100%;object-fit:cover;border-radius:inherit"/>';
        /* Glass overlay with logo */
        html += '<div class="gb-hero-photo-overlay">';
        html += '<img src="../logo.png" alt="" style="width:' + (isMobile ? '28px' : '36px') + ';height:' + (isMobile ? '28px' : '36px') + ';border-radius:50%;border:2px solid ' + accentRgba + '0.4);object-fit:contain;background:rgba(0,0,0,.7)"/>';
        html += '<span style="font-size:' + (isMobile ? '9px' : '11px') + ';font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.8)">Golden Barbers</span>';
        html += '</div>';
        /* Themed accent bar at bottom */
        html += '<div style="position:absolute;bottom:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,' + accent + ',' + accentRgba + '0.3),transparent);border-radius:0 0 16px 16px"></div>';

        el.innerHTML = html;
        hero.appendChild(el);
        state.extraEls.push(el);
    }

    /* ═══ HERO DESIGN ELEMENTS – themed decorative compositions per theme ═══ */
    var HERO_DESIGN = {
        christmas: {
            icons: ['bauble', 'christmasStar', 'holly', 'bell', 'giftBox', 'candyCane'], accent: '#C62828', accent2: '#1B5E20',
            overlayPattern: 'radial-gradient(circle at 20% 15%,rgba(198,40,40,.2) 0%,transparent 35%),radial-gradient(circle at 80% 20%,rgba(27,94,32,.18) 0%,transparent 35%),radial-gradient(circle at 50% 85%,rgba(255,215,0,.12) 0%,transparent 40%)',
            cornerDeco: true, cornerType: 'holly',
            titleGlow: '0 0 40px rgba(255,215,0,.5),0 0 80px rgba(198,40,40,.3)',
            frameStyle: 'border:2px solid rgba(198,40,40,.2);box-shadow:inset 0 0 60px rgba(198,40,40,.08),inset 0 0 30px rgba(27,94,32,.06)'
        },
        valentines: {
            icons: ['heartDuo', 'roseBud', 'cupidArrow', 'loveRing', 'heartDuo', 'roseBud'], accent: '#E91E63', accent2: '#F48FB1',
            overlayPattern: 'radial-gradient(circle at 30% 30%,rgba(233,30,99,.18) 0%,transparent 40%),radial-gradient(circle at 70% 70%,rgba(244,143,177,.15) 0%,transparent 40%)',
            heartRain: true,
            titleGlow: '0 0 40px rgba(233,30,99,.5),0 0 80px rgba(244,143,177,.3)',
            frameStyle: 'border:2px solid rgba(233,30,99,.15);box-shadow:inset 0 0 60px rgba(233,30,99,.08)'
        },
        winter: {
            icons: ['snowCrystal', 'pineSnow', 'iceCluster', 'snowCrystal', 'pineSnow', 'snowCrystal'], accent: '#4FC3F7', accent2: '#B3E5FC',
            overlayPattern: 'radial-gradient(circle at 50% 0%,rgba(225,245,254,.12) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(79,195,247,.1) 0%,transparent 35%),radial-gradient(circle at 80% 80%,rgba(79,195,247,.1) 0%,transparent 35%)',
            frostFrame: true,
            titleGlow: '0 0 40px rgba(79,195,247,.5),0 0 80px rgba(225,245,254,.2)',
            frameStyle: 'border:2px solid rgba(79,195,247,.15);box-shadow:inset 0 0 60px rgba(79,195,247,.06),inset 0 0 120px rgba(225,245,254,.04)'
        },
        halloween: {
            icons: ['pumpkinFace', 'ghosty', 'skullIcon', 'cauldron', 'pumpkinFace', 'ghosty'], accent: '#FF6F00', accent2: '#6A1B9A',
            overlayPattern: 'radial-gradient(circle at 50% 100%,rgba(255,111,0,.15) 0%,transparent 45%),radial-gradient(circle at 20% 20%,rgba(106,27,154,.15) 0%,transparent 40%),radial-gradient(circle at 80% 20%,rgba(106,27,154,.12) 0%,transparent 40%)',
            spookyVignette: true,
            titleGlow: '0 0 40px rgba(255,111,0,.6),0 0 80px rgba(106,27,154,.3)',
            frameStyle: 'border:2px solid rgba(255,111,0,.15);box-shadow:inset 0 0 80px rgba(106,27,154,.1),inset 0 0 40px rgba(255,111,0,.06)'
        },
        easter: {
            icons: ['eggPainted', 'tulip', 'butterfly', 'eggPainted', 'tulip', 'butterfly'], accent: '#81C784', accent2: '#F48FB1',
            overlayPattern: 'radial-gradient(circle at 25% 25%,rgba(129,199,132,.12) 0%,transparent 35%),radial-gradient(circle at 75% 35%,rgba(244,143,177,.1) 0%,transparent 35%),radial-gradient(circle at 50% 80%,rgba(255,245,157,.08) 0%,transparent 40%)',
            eggBorder: true,
            titleGlow: '0 0 30px rgba(129,199,132,.4),0 0 60px rgba(244,143,177,.2)',
            frameStyle: 'border:2px solid rgba(129,199,132,.12);box-shadow:inset 0 0 50px rgba(129,199,132,.06)'
        },
        summer: {
            icons: ['sunRays', 'palmIsland', 'cocktail', 'sunRays', 'palmIsland', 'cocktail'], accent: '#FF8F00', accent2: '#0288D1',
            overlayPattern: 'radial-gradient(circle at 80% 10%,rgba(255,200,50,.15) 0%,transparent 40%),linear-gradient(180deg,rgba(255,143,0,.08) 0%,transparent 40%,transparent 70%,rgba(2,136,209,.08) 100%)',
            sunburstDeco: true,
            titleGlow: '0 0 40px rgba(255,143,0,.5),0 0 80px rgba(2,136,209,.2)',
            frameStyle: 'border:2px solid rgba(255,143,0,.12);box-shadow:inset 0 0 60px rgba(255,143,0,.06)'
        },
        eid: {
            icons: ['crescentStar', 'lanternGold', 'mosqueIcon', 'crescentStar', 'lanternGold', 'crescentStar'], accent: '#FDD835', accent2: '#2E7D32',
            overlayPattern: 'radial-gradient(circle at 50% 20%,rgba(253,216,53,.12) 0%,transparent 45%),radial-gradient(circle at 20% 70%,rgba(46,125,50,.1) 0%,transparent 35%),radial-gradient(circle at 80% 70%,rgba(46,125,50,.1) 0%,transparent 35%)',
            geometricBorder: true, geoColor: '#FDD835',
            titleGlow: '0 0 40px rgba(253,216,53,.5),0 0 80px rgba(46,125,50,.2)',
            frameStyle: 'border:2px solid rgba(253,216,53,.12);box-shadow:inset 0 0 60px rgba(253,216,53,.06)'
        },
        ramadan: {
            icons: ['lanternGold', 'crescentStar', 'mosqueIcon', 'lanternGold', 'crescentStar', 'lanternGold'], accent: '#B8860B', accent2: '#1A237E',
            overlayPattern: 'radial-gradient(circle at 50% 10%,rgba(184,134,11,.15) 0%,transparent 40%),radial-gradient(circle at 30% 80%,rgba(26,35,126,.1) 0%,transparent 35%),radial-gradient(circle at 70% 80%,rgba(26,35,126,.1) 0%,transparent 35%)',
            geometricBorder: true, geoColor: '#B8860B',
            titleGlow: '0 0 40px rgba(184,134,11,.5),0 0 80px rgba(26,35,126,.2)',
            frameStyle: 'border:2px solid rgba(184,134,11,.12);box-shadow:inset 0 0 60px rgba(184,134,11,.06)'
        },
        autumn: {
            icons: ['oakLeaf', 'mushroom', 'acornNut', 'oakLeaf', 'mushroom', 'oakLeaf'], accent: '#DD2C00', accent2: '#FF6F00',
            overlayPattern: 'radial-gradient(ellipse at 30% 40%,rgba(221,44,0,.12) 0%,transparent 40%),radial-gradient(ellipse at 70% 60%,rgba(255,179,0,.1) 0%,transparent 40%)',
            leafScatter: true,
            titleGlow: '0 0 30px rgba(221,44,0,.4),0 0 60px rgba(255,143,0,.2)',
            frameStyle: 'border:2px solid rgba(221,44,0,.12);box-shadow:inset 0 0 50px rgba(221,44,0,.06)'
        },
        'black-friday': {
            icons: ['priceStar', 'shoppingBag', 'discountTag', 'lightningBolt', 'priceStar', 'shoppingBag'], accent: '#FF1744', accent2: '#FFD600',
            overlayPattern: 'linear-gradient(135deg,transparent 20%,rgba(255,214,0,.06) 20%,rgba(255,214,0,.06) 30%,transparent 30%,transparent 50%,rgba(255,23,68,.04) 50%,rgba(255,23,68,.04) 55%,transparent 55%,transparent 70%,rgba(255,214,0,.04) 70%,rgba(255,214,0,.04) 80%,transparent 80%)',
            diagonalStripes: true,
            titleGlow: '0 0 50px rgba(255,23,68,.6),0 0 100px rgba(255,214,0,.2)',
            frameStyle: 'border:2px solid rgba(255,23,68,.2);box-shadow:inset 0 0 80px rgba(255,23,68,.08),inset 0 0 40px rgba(255,214,0,.04)',
            saleBadge: { text: 'SALE', bg: '#FF1744', glow: 'rgba(255,23,68,.6)' }
        },
        'new-year': {
            icons: ['fireworkBurst', 'champagneGlass', 'partyPopper', 'fireworkBurst', 'champagneGlass', 'partyPopper'], accent: '#FFD700', accent2: '#0D47A1',
            overlayPattern: 'radial-gradient(circle at 30% 20%,rgba(255,215,0,.12) 0%,transparent 35%),radial-gradient(circle at 70% 20%,rgba(255,215,0,.1) 0%,transparent 35%),radial-gradient(circle at 50% 80%,rgba(13,71,161,.1) 0%,transparent 40%)',
            sparkleField: true,
            titleGlow: '0 0 50px rgba(255,215,0,.6),0 0 100px rgba(255,215,0,.2)',
            frameStyle: 'border:2px solid rgba(255,215,0,.15);box-shadow:inset 0 0 60px rgba(255,215,0,.06),inset 0 0 120px rgba(13,71,161,.04)',
            yearBadge: true
        },
        'flash-sale': {
            icons: ['lightningBolt', 'megaphone', 'alarmClock', 'priceStar', 'lightningBolt', 'megaphone'], accent: '#FF1744', accent2: '#FFD600',
            overlayPattern: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,23,68,.03) 40px,rgba(255,23,68,.03) 42px)',
            titleGlow: '0 0 50px rgba(255,23,68,.6),0 0 100px rgba(255,23,68,.2)',
            frameStyle: 'border:2px solid rgba(255,23,68,.2);box-shadow:inset 0 0 80px rgba(255,23,68,.08)',
            saleBadge: { text: '50% OFF', bg: '#FF1744', glow: 'rgba(255,23,68,.6)' }
        }
    };
    HERO_DESIGN.blackfriday = HERO_DESIGN['black-friday'];
    HERO_DESIGN.newyear = HERO_DESIGN['new-year'];
    HERO_DESIGN.flashsale = HERO_DESIGN['flash-sale'];

    /* ═══ HERO SEASONAL TAKEOVER – Custom visual compositions per theme ═══ */
    function getHeroExtraDecoHtml(design, themeKey, accent) {
        var h = '', tid = (themeKey || '').replace(/-/g, '');
        if (!design) return h;

        /* Custom pattern overlay */
        if (design.overlayPattern) {
            h += '<div style="position:absolute;inset:0;background:' + design.overlayPattern + ';border-radius:inherit;pointer-events:none;z-index:1"></div>';
        }

        /* Custom decorative frame */
        if (design.frameStyle) {
            h += '<div style="position:absolute;inset:10px;border-radius:18px;pointer-events:none;z-index:1;' + design.frameStyle + '"></div>';
        }

        /* Theme-specific decorative elements */
        if (tid === 'blackfriday' || tid === 'flashsale') {
            /* Diagonal gold stripes */
            h += '<div style="position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none;z-index:1">';
            h += '<div style="position:absolute;left:-20%;top:-80%;width:40%;height:250%;background:linear-gradient(180deg,transparent,rgba(255,214,0,.06),rgba(255,214,0,.1),rgba(255,214,0,.06),transparent);transform:rotate(30deg)"></div>';
            h += '<div style="position:absolute;right:-10%;top:-80%;width:25%;height:250%;background:linear-gradient(180deg,transparent,rgba(255,23,68,.05),rgba(255,23,68,.08),rgba(255,23,68,.05),transparent);transform:rotate(30deg)"></div>';
            h += '</div>';
            if (design.saleBadge) {
                var sb = design.saleBadge;
                h += '<div style="position:absolute;top:' + (isMobile ? '12px' : '16px') + ';right:' + (isMobile ? '12px' : '20px') + ';background:' + sb.bg + ';color:#fff;font-size:' + (isMobile ? '11px' : '14px') + ';font-weight:900;padding:' + (isMobile ? '4px 10px' : '6px 16px') + ';border-radius:6px;letter-spacing:3px;box-shadow:0 0 25px ' + sb.glow + ';z-index:3;animation:gb-badge-pulse 2s ease-in-out infinite">' + sb.text + '</div>';
            }
        } else if (tid === 'christmas') {
            /* Hanging garland at top + corner holly */
            h += '<div style="position:absolute;top:0;left:0;width:100%;height:4px;background:repeating-linear-gradient(90deg,#C62828 0,#C62828 10px,#1B5E20 10px,#1B5E20 20px,#FFD700 20px,#FFD700 24px,transparent 24px,transparent 30px);border-radius:20px 20px 0 0;pointer-events:none;z-index:3"></div>';
            if (!isMobile) {
                /* Gold stars scattered */
                var starPos = [{x:8,y:12},{x:92,y:15},{x:15,y:85},{x:88,y:82}];
                for (var si = 0; si < starPos.length; si++) {
                    h += '<div style="position:absolute;left:' + starPos[si].x + '%;top:' + starPos[si].y + '%;width:8px;height:8px;pointer-events:none;z-index:1;opacity:.25;animation:gb-pdecor-float ' + (5 + si * 2) + 's ease-in-out infinite"><svg viewBox="0 0 24 24"><path fill="#FFD700" d="M12,1L15.09,8.26L23,9.27L17.5,14.14L18.18,22.02L12,18.77L5.82,22.02L6.5,14.14L1,9.27L8.91,8.26L12,1Z"/></svg></div>';
                }
            }
        } else if (tid === 'valentines') {
            /* Floating mini hearts */
            if (!isMobile) {
                var hp = [{x:6,y:18,s:14},{x:92,y:22,s:10},{x:10,y:78,s:12},{x:88,y:75,s:16},{x:50,y:90,s:10}];
                for (var hi = 0; hi < hp.length; hi++) {
                    h += '<div style="position:absolute;left:' + hp[hi].x + '%;top:' + hp[hi].y + '%;width:' + hp[hi].s + 'px;height:' + hp[hi].s + 'px;pointer-events:none;z-index:1;opacity:.2;animation:gb-pdecor-float ' + (5 + hi * 1.5) + 's ease-in-out infinite"><svg viewBox="0 0 24 24"><path fill="' + (hi % 2 ? '#F48FB1' : '#E91E63') + '" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>';
                }
            }
        } else if (tid === 'halloween') {
            /* Dark vignette + moon glow */
            h += '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,.4) 100%);border-radius:inherit;pointer-events:none;z-index:1"></div>';
            if (!isMobile) {
                h += '<div style="position:absolute;top:10%;right:12%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 40%,rgba(255,224,178,.15),transparent 70%);box-shadow:0 0 30px rgba(255,224,178,.1);pointer-events:none;z-index:1"></div>';
            }
        } else if (tid === 'winter') {
            /* Frost edges + ice glow */
            h += '<div style="position:absolute;top:0;left:0;width:100%;height:6px;background:linear-gradient(90deg,transparent,rgba(225,245,254,.15),rgba(179,229,252,.2),rgba(225,245,254,.15),transparent);border-radius:20px 20px 0 0;pointer-events:none;z-index:3"></div>';
            h += '<div style="position:absolute;bottom:0;left:0;width:100%;height:6px;background:linear-gradient(90deg,transparent,rgba(225,245,254,.1),rgba(179,229,252,.15),rgba(225,245,254,.1),transparent);border-radius:0 0 20px 20px;pointer-events:none;z-index:3"></div>';
        } else if (tid === 'eid' || tid === 'ramadan') {
            /* Geometric star pattern border + crescent accent */
            var gc = design.geoColor || accent;
            h += '<div style="position:absolute;inset:8px;border:1px solid ' + gc + '12;border-radius:18px;pointer-events:none;z-index:1"></div>';
            h += '<div style="position:absolute;inset:12px;border:1px solid ' + gc + '08;border-radius:16px;pointer-events:none;z-index:1"></div>';
            if (!isMobile) {
                /* Corner geometric accents */
                var cornerSz = 20;
                h += '<div style="position:absolute;top:6px;left:6px;width:' + cornerSz + 'px;height:' + cornerSz + 'px;border-top:2px solid ' + gc + '25;border-left:2px solid ' + gc + '25;border-radius:8px 0 0 0;pointer-events:none;z-index:2"></div>';
                h += '<div style="position:absolute;top:6px;right:6px;width:' + cornerSz + 'px;height:' + cornerSz + 'px;border-top:2px solid ' + gc + '25;border-right:2px solid ' + gc + '25;border-radius:0 8px 0 0;pointer-events:none;z-index:2"></div>';
                h += '<div style="position:absolute;bottom:6px;left:6px;width:' + cornerSz + 'px;height:' + cornerSz + 'px;border-bottom:2px solid ' + gc + '25;border-left:2px solid ' + gc + '25;border-radius:0 0 0 8px;pointer-events:none;z-index:2"></div>';
                h += '<div style="position:absolute;bottom:6px;right:6px;width:' + cornerSz + 'px;height:' + cornerSz + 'px;border-bottom:2px solid ' + gc + '25;border-right:2px solid ' + gc + '25;border-radius:0 0 8px 0;pointer-events:none;z-index:2"></div>';
            }
        } else if (tid === 'summer') {
            /* Sun ray burst at top corner */
            if (!isMobile) {
                h += '<div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,50,.12),transparent 70%);pointer-events:none;z-index:1"></div>';
                h += '<div style="position:absolute;bottom:0;left:0;width:100%;height:10px;background:linear-gradient(90deg,transparent,rgba(2,136,209,.08),rgba(2,136,209,.12),rgba(2,136,209,.08),transparent);border-radius:0 0 20px 20px;pointer-events:none;z-index:3"></div>';
            }
        } else if (tid === 'easter') {
            /* Colorful top bar */
            h += '<div style="position:absolute;top:0;left:0;width:100%;height:4px;background:repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px);border-radius:20px 20px 0 0;pointer-events:none;z-index:3"></div>';
        } else if (tid === 'autumn') {
            /* Warm glow bottom */
            h += '<div style="position:absolute;bottom:0;left:0;width:100%;height:30%;background:linear-gradient(0deg,rgba(191,54,12,.08),transparent);border-radius:0 0 20px 20px;pointer-events:none;z-index:1"></div>';
        } else if (tid === 'newyear') {
            /* Sparkle dots + year badge */
            if (!isMobile) {
                var sp = [{x:10,y:15},{x:25,y:80},{x:75,y:10},{x:90,y:75},{x:50,y:92},{x:8,y:50},{x:92,y:45}];
                for (var spi = 0; spi < sp.length; spi++) {
                    h += '<div style="position:absolute;left:' + sp[spi].x + '%;top:' + sp[spi].y + '%;width:3px;height:3px;border-radius:50%;background:#FFD700;box-shadow:0 0 6px #FFD700;opacity:.3;pointer-events:none;z-index:1;animation:gb-pdecor-float ' + (4 + spi) + 's ease-in-out infinite"></div>';
                }
            }
            if (design.yearBadge) {
                h += '<div style="position:absolute;top:' + (isMobile ? '10px' : '14px') + ';right:' + (isMobile ? '10px' : '18px') + ';font-size:' + (isMobile ? '14px' : '20px') + ';font-weight:900;color:rgba(255,215,0,.25);letter-spacing:4px;pointer-events:none;z-index:2;font-family:Inter,sans-serif">2026</div>';
            }
        }
        return h;
    }

    function createHeroTakeover(theme, themeKey) {
        if (!theme.heroTitle) return;
        var hero = document.querySelector('.hero') || document.querySelector('section.hero');
        if (!hero) return;
        var heroPos = window.getComputedStyle(hero).position;
        if (heroPos === 'static') hero.style.position = 'relative';

        var accent = theme.navAccent || theme.frontendAccent || '#FFD700';
        var titleColor = (theme.banner && theme.banner.titleColor) || '#fff';
        var el = document.createElement('div'); el.className = 'gb-hero-takeover';
        el.style.setProperty('--ht-c1', titleColor);
        el.style.setProperty('--ht-c2', accent);
        el.style.setProperty('--ht-glow', accent);

        var html = '<div class="gb-hero-takeover-bg" style="background:' + theme.heroGradient + '"></div>';

        var design = themeKey ? (HERO_DESIGN[themeKey] || HERO_DESIGN[themeKey.replace(/-/g, '')] || null) : null;

        /* ── Custom theme-specific visual composition ── */
        html += getHeroExtraDecoHtml(design, themeKey, accent);

        /* ── THEMED DESIGN FRAME: decorative icons around the overlay ── */
        if (design && design.icons) {
            var positions = [
                { x: '12%', y: '8%', sz: isMobile ? 36 : 55, rot: -15 },
                { x: '50%', y: '5%', sz: isMobile ? 28 : 42, rot: 0 },
                { x: '85%', y: '9%', sz: isMobile ? 34 : 52, rot: 12 },
                { x: '4%', y: '50%', sz: isMobile ? 30 : 48, rot: -20 },
                { x: '93%', y: '48%', sz: isMobile ? 30 : 48, rot: 15 },
                { x: '50%', y: '88%', sz: isMobile ? 26 : 40, rot: 0 }
            ];
            for (var di = 0; di < Math.min(design.icons.length, positions.length); di++) {
                var svgStr = CSVG[design.icons[di]];
                if (!svgStr) continue;
                var p = positions[di];
                html += '<div style="position:absolute;left:' + p.x + ';top:' + p.y + ';width:' + p.sz + 'px;height:' + p.sz + 'px;transform:translate(-50%,-50%) rotate(' + p.rot + 'deg);opacity:.3;filter:drop-shadow(0 0 12px ' + (design.accent || accent) + ');z-index:1;pointer-events:none;animation:gb-pdecor-float ' + (8 + di * 2) + 's ease-in-out infinite">' + svgStr + '</div>';
            }
        }

        /* Logo above title */
        html += '<img src="../logo.png" alt="Golden Barbers" style="width:' + (isMobile ? '48px' : '60px') + ';height:' + (isMobile ? '48px' : '60px') + ';border-radius:50%;border:2px solid ' + accent + '40;object-fit:contain;background:rgba(0,0,0,.5);margin-bottom:12px;position:relative;z-index:2;opacity:.85;box-shadow:0 0 25px ' + accent + '30"/>';
        /* Title with custom glow per theme */
        var titleGlow = (design && design.titleGlow) ? ';text-shadow:' + design.titleGlow : '';
        html += '<div class="gb-hero-takeover-title" style="position:relative;z-index:2' + titleGlow + '">' + theme.heroTitle + '</div>';
        if (theme.heroSub) html += '<div class="gb-hero-takeover-sub" style="position:relative;z-index:2">' + theme.heroSub + '</div>';
        el.innerHTML = html;
        hero.appendChild(el);
        state.heroTakeover = el;

        /* Glow ring around showcase circle */
        var circle = document.querySelector('.showcase-neon-circle');
        if (circle) {
            var ring = document.createElement('div'); ring.className = 'gb-hero-takeover-ring';
            var cW = circle.offsetWidth || 320, ringSize = cW + 40;
            ring.style.cssText = 'width:' + ringSize + 'px;height:' + ringSize + 'px;top:50%;left:50%;transform:translate(-50%,-50%);border-color:' + accent + ';box-shadow:0 0 30px ' + accent + '40,inset 0 0 30px ' + accent + '20';
            circle.style.position = 'relative';
            circle.appendChild(ring);
            state.extraEls.push(ring);
        }

        /* Auto-dismiss after 6s */
        state.heroTimeout = setTimeout(function () {
            if (!state.heroTakeover) return;
            state.heroTakeover.style.animation = 'gb-takeover-out .8s ease forwards';
            var ref = state.heroTakeover;
            setTimeout(function () { if (ref && ref.parentNode) ref.remove(); }, 800);
            state.heroTakeover = null;
        }, 6000);

        /* Dismiss on scroll */
        state.heroScrollHandler = function () {
            if (window.scrollY > 100 && state.heroTakeover) {
                if (state.heroTimeout) { clearTimeout(state.heroTimeout); state.heroTimeout = null; }
                state.heroTakeover.style.animation = 'gb-takeover-out .5s ease forwards';
                var ref = state.heroTakeover;
                setTimeout(function () { if (ref && ref.parentNode) ref.remove(); }, 500);
                state.heroTakeover = null;
                window.removeEventListener('scroll', state.heroScrollHandler);
                state.heroScrollHandler = null;
            }
        };
        window.addEventListener('scroll', state.heroScrollHandler);
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

    /* ═══ ATMOSPHERIC PAGE FILM ═══ */
    function createAtmosphere(theme) {
        if (!theme.atmosphere || !theme.atmosphere.length) return;
        var el = document.createElement('div'); el.className = 'gb-atmosphere';
        /* Boost alpha for visible colour wash */
        var colors = theme.atmosphere.map(function(c) {
            var idx = c.lastIndexOf(',');
            if (idx < 0) return c;
            var alpha = parseFloat(c.substring(idx + 1));
            return c.substring(0, idx + 1) + Math.min(alpha * 2.5, 0.22).toFixed(2) + ')';
        });
        /* Full-screen smooth gradient wash - no visible circles */
        el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0;animation:gb-fin 3s ease 1s forwards;background:linear-gradient(135deg,' + colors[0] + ' 0%,transparent 40%,' + (colors[1] || colors[0]) + ' 60%,transparent 100%)';
        document.body.appendChild(el);
        state.atmosphere = el;
    }

    /* ═══ NAVIGATION TRANSFORMATION ═══ */
    function themeNavigation(theme) {
        var nav = document.querySelector('.nav') || document.querySelector('nav');
        if (!nav) return;
        var accent = theme.navAccent || theme.frontendAccent || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';
        state.savedNavBg = nav.style.background || '';
        nav.style.transition = 'all .8s ease';
        nav.style.borderColor = accentRgba + '0.25)';
        nav.style.boxShadow = '0 0 30px ' + accentRgba + '.15),0 8px 40px rgba(0,0,0,.4)';
        nav.style.background = 'linear-gradient(135deg, rgba(5,5,5,.92),' + accentRgba + '0.06),rgba(5,5,5,.92))';
        state.navThemeEls.push(nav);

        /* Theme the CTA button */
        var ctaLink = nav.querySelector('.nav-cta a') || nav.querySelector('.nav-cta');
        if (ctaLink) {
            ctaLink.dataset.gbOrigBg = ctaLink.style.background || '';
            ctaLink.dataset.gbOrigShadow = ctaLink.style.boxShadow || '';
            ctaLink.style.transition = 'all .5s ease';
            ctaLink.style.background = accent;
            ctaLink.style.boxShadow = '0 0 20px ' + accentRgba + '.3)';
            state.navThemeEls.push(ctaLink);
        }
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

    /* ═══ GLASSMORPHISM SEASONAL PANEL – inline card after hero section ═══ */
    function createGlassPanel(theme, themeKey) {
        if (!theme.banner) return;
        var accent = theme.frontendAccent || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';
        var b = theme.banner;
        var icon = BI[themeKey] || BI[themeKey.replace(/-/g, '')] || '';

        /* Insert as inline banner between hero and next section */
        var hero = document.querySelector('.hero');
        var insertTarget = hero ? hero.nextElementSibling : null;

        var wrapper = document.createElement('div');
        wrapper.className = 'gb-glass-banner';
        wrapper.style.cssText = 'max-width:680px;margin:0 auto;padding:' + (isMobile ? '12px 16px' : '20px 28px');

        var el = document.createElement('div');
        el.className = 'gb-glass-panel';

        var html = '<div class="gb-glass-panel-accent" style="background:linear-gradient(90deg,' + accent + ',' + accentRgba + '0.3),transparent)"></div>';
        html += '<button class="gb-glass-panel-dismiss" onclick="this.closest(\'.gb-glass-banner\').style.animation=\'gb-glass-out .3s ease forwards\';setTimeout(function(){var p=document.querySelector(\'.gb-glass-banner\');if(p)p.remove()},300)">&times;</button>';
        html += '<div class="gb-glass-panel-content">';
        /* Logo + Title row */
        html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">';
        html += '<img src="../logo.png" alt="Golden Barbers" style="width:36px;height:36px;border-radius:50%;border:2px solid ' + accentRgba + '0.3);object-fit:contain;background:#000;flex-shrink:0"/>';
        html += '<div>';
        html += '<div style="font-size:' + (isMobile ? '12px' : '15px') + ';font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:' + (b.titleColor || '#fff') + ';text-shadow:0 0 20px ' + accentRgba + '0.4)">' + b.title + '</div>';
        html += '<div style="font-size:' + (isMobile ? '10px' : '12px') + ';color:rgba(255,255,255,.45);margin-top:2px">' + b.sub + '</div>';
        html += '</div>';
        html += '<div style="margin-left:auto;flex-shrink:0;width:36px;height:36px;border-radius:10px;background:' + accentRgba + '0.1);border:1px solid ' + accentRgba + '0.15);display:flex;align-items:center;justify-content:center">' + icon + '</div>';
        html += '</div>';
        if (theme.popup && theme.popup.code) {
            html += '<div style="display:flex;align-items:center;gap:12px;padding:8px 14px;background:rgba(0,0,0,.25);border:1px solid ' + accentRgba + '0.15);border-radius:10px;margin-top:4px">';
            html += '<span style="font-size:10px;color:rgba(255,255,255,.35);letter-spacing:1px">USE CODE</span>';
            html += '<span style="font-size:14px;font-weight:800;color:' + accent + ';letter-spacing:3px">' + theme.popup.code + '</span>';
            html += '<a href="services.html" style="margin-left:auto;padding:6px 16px;background:' + accent + ';color:#000;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;letter-spacing:1px">BOOK NOW</a>';
            html += '</div>';
        }
        html += '</div>';

        el.innerHTML = html;
        wrapper.appendChild(el);

        if (insertTarget && insertTarget.parentNode) {
            insertTarget.parentNode.insertBefore(wrapper, insertTarget);
        } else {
            document.body.appendChild(wrapper);
        }
        state.extraEls.push(wrapper);
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

        /* Theme section tags */
        document.querySelectorAll('.section-tag').forEach(function (el) {
            el.dataset.gbOrigColor = el.style.color || '';
            el.style.color = accent;
            el.style.borderColor = accentRgba + '.3)';
            el.style.transition = 'color .8s ease, border-color .8s ease';
            state.themeStyleEls.push(el);
        });

        /* Theme gold accent text */
        document.querySelectorAll('.section-title .gold, .hero-title .gold, .gold').forEach(function (el) {
            el.dataset.gbOrigColor = el.style.color || '';
            el.style.color = accent;
            el.style.textShadow = '0 0 15px ' + accentRgba + '.25)';
            el.style.transition = 'color .8s ease, text-shadow .8s ease';
            state.themeStyleEls.push(el);
        });

        /* Theme service card borders */
        document.querySelectorAll('.service-card, .barber-card').forEach(function (el) {
            el.dataset.gbOrigBorder = el.style.borderColor || '';
            el.style.borderColor = accentRgba + '.15)';
            el.style.boxShadow = '0 0 15px ' + accentRgba + '.06)';
            el.style.transition = 'border-color .8s ease, box-shadow .8s ease';
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
            } else {
                /* Generic cleanup for section-tag, gold, card themed elements */
                if (el.dataset.gbOrigColor !== undefined) { el.style.color = el.dataset.gbOrigColor; el.style.textShadow = ''; el.style.transition = ''; delete el.dataset.gbOrigColor; }
                if (el.dataset.gbOrigBorder !== undefined) { el.style.borderColor = el.dataset.gbOrigBorder; el.style.boxShadow = ''; el.style.transition = ''; delete el.dataset.gbOrigBorder; }
            }
        });
        state.themeStyleEls = [];
    }

    /* ═══ HERO SEASONAL BADGE ═══ */
    function createHeroBadge(theme) {
        if (!theme.heroBadge) return;
        var sub = document.querySelector('.hero-subtitle');
        if (!sub) return;
        var accent = theme.frontendAccent || '#d4af37';
        var badge = document.createElement('div');
        badge.className = 'gb-hero-season';
        badge.style.color = accent;
        badge.style.borderColor = accent + '25';
        badge.innerHTML = '<span>' + theme.heroBadge.icon + '</span><span>' + theme.heroBadge.text + '</span>';
        sub.parentNode.insertBefore(badge, sub.nextSibling);
        state.extraEls.push(badge);
    }

    /* ═══ SEASONAL SECTION DIVIDERS ═══ */
    function createSeasonalDividers(theme) {
        if (!theme.dividerText) return;
        var accent = theme.frontendAccent || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';
        var sections = document.querySelectorAll('section.services, section.stats, section.testimonials, section.cta');
        sections.forEach(function (sec) {
            var existing = sec.previousElementSibling;
            if (existing && existing.classList.contains('gb-seasonal-divider')) return;
            var div = document.createElement('div');
            div.className = 'gb-seasonal-divider';
            div.innerHTML = '<div class="gb-seasonal-divider-line" style="background:linear-gradient(90deg,transparent,' + accentRgba + '.2))"></div>' +
                '<span class="gb-seasonal-divider-text" style="color:' + accentRgba + '.4)">' + theme.dividerText + '</span>' +
                '<div class="gb-seasonal-divider-line" style="background:linear-gradient(90deg,' + accentRgba + '.2),transparent)"></div>';
            sec.parentNode.insertBefore(div, sec);
            state.extraEls.push(div);
        });
    }

    /* ═══ SERVICE CARD SEASONAL BADGES ═══ */
    function themeServiceCards(theme) {
        if (!theme.heroBadge) return;
        var isServicesPage = window.location.pathname.toLowerCase().indexOf('services') !== -1;
        if (!isServicesPage) return;
        var accent = theme.frontendAccent || '#d4af37';
        var cards = document.querySelectorAll('.service-card');
        cards.forEach(function (card, i) {
            if (i > 5) return; /* Only badge first 6 cards */
            var pos = window.getComputedStyle(card).position;
            if (pos === 'static') card.style.position = 'relative';
            var badge = document.createElement('div');
            badge.className = 'gb-card-badge';
            badge.style.background = accent;
            badge.style.color = '#fff';
            badge.textContent = theme.heroBadge.icon + ' ' + theme.dividerText;
            card.appendChild(badge);
            state.extraEls.push(badge);
        });
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

    /* ═══ CSS VARIABLE OVERRIDE – transforms entire page colour scheme ═══ */
    function overrideCSSVars(theme) {
        var accent = theme.frontendAccent || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';
        var root = document.documentElement;

        /* Save original values */
        var vars = ['--gold', '--gold-dark', '--gold-light', '--gold-glow', '--gold-neon'];
        state.savedCSSVars = {};
        vars.forEach(function (v) {
            state.savedCSSVars[v] = getComputedStyle(root).getPropertyValue(v).trim();
        });

        /* Override with theme accent */
        root.style.setProperty('--gold', accent);
        root.style.setProperty('--gold-dark', accent);
        root.style.setProperty('--gold-light', accent);
        root.style.setProperty('--gold-glow', accentRgba + '0.5)');
        root.style.setProperty('--gold-neon', accent);

        /* Theme body attribute for additional CSS hooks */
        document.body.setAttribute('data-gb-theme', 'active');
    }

    function restoreCSSVars() {
        if (!state.savedCSSVars) return;
        var root = document.documentElement;
        Object.keys(state.savedCSSVars).forEach(function (v) {
            if (state.savedCSSVars[v]) root.style.setProperty(v, state.savedCSSVars[v]);
            else root.style.removeProperty(v);
        });
        state.savedCSSVars = null;
        document.body.removeAttribute('data-gb-theme');
    }

    /* ═══ THEME-SPECIFIC CSS – additional transformations beyond variable override ═══ */
    function injectThemeCSS(theme) {
        if (state.themeCSS) return;
        var accent = theme.frontendAccent || '#d4af37';
        var accentRgba = theme.frontendAccentRgba || 'rgba(212,175,55,';

        state.themeCSS = document.createElement('style');
        state.themeCSS.id = 'gb-theme-page';
        state.themeCSS.textContent = [
            /* ═══ HERO SECTION – dramatic gradient overlay (biggest visual impact) ═══ */
            '[data-gb-theme] .hero{position:relative}',
            '[data-gb-theme] .hero::after{content:"";position:absolute;inset:0;background:' + (theme.heroGradient || 'none') + ';pointer-events:none;z-index:2;opacity:0;animation:gb-hero-ov 2s ease .3s forwards}',
            '[data-gb-theme] .hero-content{position:relative;z-index:5}',
            '[data-gb-theme] .hero-showcase{position:relative;z-index:4}',
            '[data-gb-theme] .showcase-neon-circle{box-shadow:0 0 50px ' + accentRgba + '0.35),0 0 100px ' + accentRgba + '0.15),inset 0 0 40px ' + accentRgba + '0.1) !important;transition:box-shadow 2s ease}',
            '[data-gb-theme] .hero-badge{border-color:' + accentRgba + '0.4) !important;background:' + accentRgba + '0.08) !important}',
            '[data-gb-theme] .hero-badge-dot{background:' + accent + ' !important;box-shadow:0 0 12px ' + accent + ' !important}',

            /* ═══ MARQUEE – visible themed tint ═══ */
            '[data-gb-theme] .marquee-section{position:relative;overflow:hidden}',
            '[data-gb-theme] .marquee-section::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,' + accentRgba + '0.15),transparent 50%,' + accentRgba + '0.10));pointer-events:none;z-index:0}',
            '[data-gb-theme] .marquee-item{color:' + accent + ' !important;text-shadow:0 0 30px ' + accentRgba + '0.4)}',

            /* ═══ STATS – visible background gradient + bold numbers ═══ */
            '[data-gb-theme] .stats{position:relative;overflow:hidden}',
            '[data-gb-theme] .stats::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,' + accentRgba + '0.10),transparent 40%,' + accentRgba + '0.06));pointer-events:none}',
            '[data-gb-theme] .stat-number{color:' + accent + ' !important;text-shadow:0 0 25px ' + accentRgba + '0.5) !important}',
            '[data-gb-theme] .stat-label{color:' + accentRgba + '0.7) !important}',

            /* ═══ TESTIMONIALS – themed cards with visible accent ═══ */
            '[data-gb-theme] .testimonials{position:relative;overflow:hidden}',
            '[data-gb-theme] .testimonials::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,' + accentRgba + '0.08),transparent 65%);pointer-events:none}',
            '[data-gb-theme] .testimonial-quote{color:' + accentRgba + '0.35) !important}',
            '[data-gb-theme] .testimonial-stars{color:' + accent + ' !important}',
            '[data-gb-theme] .testimonial-card{border-color:' + accentRgba + '0.2) !important;box-shadow:0 0 25px ' + accentRgba + '0.08) !important;transition:border-color .8s,box-shadow .8s}',
            '[data-gb-theme] .testimonial-card:hover{border-color:' + accentRgba + '0.4) !important;box-shadow:0 0 35px ' + accentRgba + '0.15) !important}',

            /* ═══ CTA – strong radial glow ═══ */
            '[data-gb-theme] .cta{position:relative;overflow:hidden}',
            '[data-gb-theme] .cta::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,' + accentRgba + '0.18),transparent 65%);pointer-events:none}',

            /* ═══ SERVICES – section background + enhanced cards ═══ */
            '[data-gb-theme] .services{position:relative;overflow:hidden}',
            '[data-gb-theme] .services::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent,' + accentRgba + '0.06),' + accentRgba + '0.10));pointer-events:none;z-index:0;opacity:0;animation:gb-section-ov 2s ease 1s forwards}',

            /* ═══ SERVICE CARDS – visible border glow + hover transformation ═══ */
            '[data-gb-theme] .service-card{border-color:' + accentRgba + '0.15) !important;transition:border-color .3s,box-shadow .3s,transform .3s}',
            '[data-gb-theme] .service-card:hover{border-color:' + accentRgba + '0.45) !important;box-shadow:0 0 30px ' + accentRgba + '0.12),0 8px 40px rgba(0,0,0,.3) !important;transform:translateY(-4px)}',
            '[data-gb-theme] .service-card-image::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,' + accentRgba + '0.15));pointer-events:none}',

            /* Services page category buttons */
            '[data-gb-theme] .category-btn.active{background:' + accent + ' !important;color:#fff !important;box-shadow:0 0 20px ' + accentRgba + '0.4) !important}',
            '[data-gb-theme] .category-btn{border-color:' + accentRgba + '0.25) !important;transition:all .3s}',
            '[data-gb-theme] .category-btn:hover{border-color:' + accent + ' !important;color:' + accent + ' !important}',

            /* Services page badges */
            '[data-gb-theme] .service-badge{background:' + accent + ' !important;box-shadow:0 0 12px ' + accentRgba + '0.3) !important}',

            /* ═══ BUTTONS – bold themed with glow ═══ */
            '[data-gb-theme] .btn-primary{background:' + accent + ' !important;box-shadow:0 4px 25px ' + accentRgba + '0.4) !important}',
            '[data-gb-theme] .btn-primary:hover{box-shadow:0 6px 35px ' + accentRgba + '0.6) !important;transform:translateY(-2px)}',
            '[data-gb-theme] .btn-outline{border-color:' + accent + ' !important;color:' + accent + ' !important}',
            '[data-gb-theme] .btn-outline:hover{background:' + accent + ' !important;color:#fff !important;box-shadow:0 0 20px ' + accentRgba + '0.3) !important}',
            '[data-gb-theme] .service-cta{background:' + accent + ' !important;box-shadow:0 2px 15px ' + accentRgba + '0.3) !important}',

            /* ═══ NAV – themed glass with accent glow ═══ */
            '[data-gb-theme] .nav{border-bottom:1px solid ' + accentRgba + '0.2) !important;box-shadow:0 0 25px ' + accentRgba + '0.1),0 8px 32px rgba(0,0,0,.4) !important}',
            '[data-gb-theme] .nav-cta a,[data-gb-theme] .nav-cta{background:' + accent + ' !important;box-shadow:0 0 20px ' + accentRgba + '0.4) !important}',

            /* ═══ SECTION HEADERS – bold accent ═══ */
            '[data-gb-theme] .section-tag{color:' + accent + ' !important;border-color:' + accentRgba + '0.3) !important}',
            '[data-gb-theme] .section-tag span{color:' + accent + ' !important}',
            '[data-gb-theme] .section-tag-line{background:' + accent + ' !important;box-shadow:0 0 8px ' + accentRgba + '0.4) !important}',
            '[data-gb-theme] .section-title .gold{text-shadow:0 0 20px ' + accentRgba + '0.4) !important}',

            /* ═══ NEON ICONS – themed glow ═══ */
            '[data-gb-theme] .neon-icon{color:' + accent + ' !important;filter:drop-shadow(0 0 12px ' + accentRgba + '0.5))}',

            /* ═══ FOOTER – accent links ═══ */
            '[data-gb-theme] .footer{border-top:1px solid ' + accentRgba + '0.15) !important}',
            '[data-gb-theme] .footer a:hover{color:' + accent + ' !important}',

            /* ═══ GLOBAL transitions ═══ */
            '[data-gb-theme] .gold{transition:color .8s !important}',
            '[data-gb-theme] .section-tag{transition:color .8s,border-color .8s !important}'
        ].join('\n');
        document.head.appendChild(state.themeCSS);
    }

    function removeThemeCSS() {
        if (state.themeCSS) { state.themeCSS.remove(); state.themeCSS = null; }
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

        /* GLOBAL: Override CSS custom properties – transforms entire page colour scheme */
        overrideCSSVars(theme);
        injectThemeCSS(theme);

        /* ALL PAGES: glow, border, nav line, nav theme, atmosphere */
        applyGlow(theme);
        createBorder(theme);
        createNavLine(theme);
        themeNavigation(theme);
        createAtmosphere(theme);

        /* MAIN PAGES ONLY: full effects */
        if (isMainPage) {
            createBokeh(theme);
            initCanvas(); spawnParticles(theme); animateParticles();
            createDecorations(theme);
            createPremiumDecor(theme, themeKey);
            if (theme.bottom) createBottom(theme.bottom);
            if (theme.hanging) createHanging(theme.hanging);
            if (theme.fog) createFog();
            if (theme.frost) createFrost();
            if (theme.sparkleField) createSparkles();
            if (theme.neonFlash) createNeonFlash();
            if (theme.vignette) createVignette(theme.vignette);
            if (theme.lights) createLights();
            if (theme.heroHat) addAccessory(theme.heroHat);
            createHeroTakeover(theme, themeKey);
            createHeroPhoto(theme);
            themeFrontend(theme, themeKey);
            createGlassPanel(theme, themeKey);
            createPromoBanner(theme, themeKey);
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
        state.extraEls.forEach(function (e) { if (e.parentNode) e.remove(); }); state.extraEls = [];
        if (state.border) { state.border.remove(); state.border = null; }
        if (state.navLine) { state.navLine.remove(); state.navLine = null; }
        state.hatEls.forEach(function (e) { if (e.parentNode) e.remove(); }); state.hatEls = [];
        /* Hero takeover cleanup */
        if (state.heroTimeout) { clearTimeout(state.heroTimeout); state.heroTimeout = null; }
        if (state.heroScrollHandler) { window.removeEventListener('scroll', state.heroScrollHandler); state.heroScrollHandler = null; }
        if (state.heroTakeover) { state.heroTakeover.remove(); state.heroTakeover = null; }
        /* Promo banner cleanup */
        if (state.promoBannerTimer) { clearTimeout(state.promoBannerTimer); state.promoBannerTimer = null; }
        if (state.promoBanner) { state.promoBanner.remove(); state.promoBanner = null; }
        /* Atmosphere cleanup */
        if (state.atmosphere) { state.atmosphere.remove(); state.atmosphere = null; }
        /* Nav theme cleanup */
        state.navThemeEls.forEach(function (el) {
            el.style.transition = ''; el.style.borderColor = ''; el.style.boxShadow = '';
            if (el.dataset.gbOrigBg !== undefined) { el.style.background = el.dataset.gbOrigBg; delete el.dataset.gbOrigBg; }
            if (el.dataset.gbOrigShadow !== undefined) { el.style.boxShadow = el.dataset.gbOrigShadow; delete el.dataset.gbOrigShadow; }
        });
        state.navThemeEls = [];
        if (state.savedNavBg !== null) {
            var nav = document.querySelector('.nav') || document.querySelector('nav');
            if (nav) nav.style.background = state.savedNavBg;
            state.savedNavBg = null;
        }
        /* Popup cleanup */
        if (state.popup) { state.popup.remove(); state.popup = null; }
        if (state.popupTimer) { clearTimeout(state.popupTimer); state.popupTimer = null; }
        if (state.countdownInterval) { clearInterval(state.countdownInterval); state.countdownInterval = null; }
        /* Frontend theming cleanup */
        unthemeFrontend();
        document.querySelectorAll('.nav-logo').forEach(function (l) { l.style.removeProperty('position'); l.style.removeProperty('overflow'); });
        /* Nav overflow cleanup from nav-corner decorations */
        var nav = document.querySelector('.nav');
        if (nav) nav.style.removeProperty('overflow');
        /* Service card position cleanup */
        document.querySelectorAll('.service-card').forEach(function (c) { c.style.removeProperty('position'); });
        /* CSS variable and themed CSS cleanup */
        restoreCSSVars();
        removeThemeCSS();
        removeGlow();
        state.id = null;
    }

    window.GBThemeEffects = { apply: apply, remove: remove };
})();




