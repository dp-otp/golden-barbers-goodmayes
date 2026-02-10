/**
 * Golden Barbers - Premium Seasonal Theme Effects v6
 * ═══════════════════════════════════════════════════
 * REALISTIC SVG illustrations, celebration banners,
 * premium creative elements. Brand gold STAYS -
 * seasonal color through decorations only.
 *
 * Usage: GBThemeEffects.apply(firebaseThemeData)
 *        GBThemeEffects.remove()
 */
(function() {
    'use strict';

    var state = {
        container: null,
        toast: null,
        border: null,
        style: null,
        navLine: null,
        corners: [],
        creative: null,
        creativeExtra: [],
        atmosphere: null,
        logoDeco: [],
        banner: null,
        savedNeon: null,
        savedNavGlow: null,
        id: null
    };
    var isMobile = window.innerWidth < 768;

    /* ═══════════════════════════════════════════
       SVG LIBRARY - Realistic Illustrations
       Each is a detailed, hand-crafted SVG
    ═══════════════════════════════════════════ */

    /* ── Snowflake Variants (crystal arm patterns) ── */
    function snowflakeSVG(variant) {
        var paths = '';
        if (variant === 0) {
            // 6-arm crystal with dendrites
            paths = '<line x1="50" y1="5" x2="50" y2="95" stroke="FG" stroke-width="2" stroke-linecap="round"/>' +
                '<line x1="11" y1="27.5" x2="89" y2="72.5" stroke="FG" stroke-width="2" stroke-linecap="round"/>' +
                '<line x1="11" y1="72.5" x2="89" y2="27.5" stroke="FG" stroke-width="2" stroke-linecap="round"/>' +
                '<line x1="50" y1="18" x2="38" y2="10" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="50" y1="18" x2="62" y2="10" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="50" y1="82" x2="38" y2="90" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="50" y1="82" x2="62" y2="90" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="24" y1="35" x2="14" y2="28" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="24" y1="35" x2="18" y2="44" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="76" y1="65" x2="86" y2="72" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="76" y1="65" x2="82" y2="56" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="24" y1="65" x2="14" y2="72" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="24" y1="65" x2="18" y2="56" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="76" y1="35" x2="86" y2="28" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<line x1="76" y1="35" x2="82" y2="44" stroke="FG" stroke-width="1.5" stroke-linecap="round"/>' +
                '<circle cx="50" cy="50" r="4" fill="FG" opacity="0.6"/>';
        } else if (variant === 1) {
            // Plate snowflake with hexagonal center
            paths = '<polygon points="50,8 54,20 50,16 46,20" fill="FG" opacity="0.7"/>' +
                '<polygon points="50,92 54,80 50,84 46,80" fill="FG" opacity="0.7"/>' +
                '<polygon points="86,29 76,35 78,30 72,28" fill="FG" opacity="0.7"/>' +
                '<polygon points="14,71 24,65 22,70 28,72" fill="FG" opacity="0.7"/>' +
                '<polygon points="86,71 76,65 78,70 72,72" fill="FG" opacity="0.7"/>' +
                '<polygon points="14,29 24,35 22,30 28,28" fill="FG" opacity="0.7"/>' +
                '<line x1="50" y1="5" x2="50" y2="95" stroke="FG" stroke-width="1.8" stroke-linecap="round"/>' +
                '<line x1="11" y1="27.5" x2="89" y2="72.5" stroke="FG" stroke-width="1.8" stroke-linecap="round"/>' +
                '<line x1="11" y1="72.5" x2="89" y2="27.5" stroke="FG" stroke-width="1.8" stroke-linecap="round"/>' +
                '<circle cx="50" cy="50" r="8" fill="none" stroke="FG" stroke-width="1.5"/>' +
                '<circle cx="50" cy="50" r="3" fill="FG" opacity="0.5"/>';
        } else {
            // Fernlike dendrite
            paths = '<line x1="50" y1="5" x2="50" y2="95" stroke="FG" stroke-width="2" stroke-linecap="round"/>' +
                '<line x1="11" y1="27.5" x2="89" y2="72.5" stroke="FG" stroke-width="2" stroke-linecap="round"/>' +
                '<line x1="11" y1="72.5" x2="89" y2="27.5" stroke="FG" stroke-width="2" stroke-linecap="round"/>' +
                '<line x1="50" y1="24" x2="40" y2="14" stroke="FG" stroke-width="1.2" stroke-linecap="round"/>' +
                '<line x1="50" y1="24" x2="60" y2="14" stroke="FG" stroke-width="1.2" stroke-linecap="round"/>' +
                '<line x1="50" y1="36" x2="42" y2="28" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="50" y1="36" x2="58" y2="28" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="50" y1="64" x2="42" y2="72" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="50" y1="64" x2="58" y2="72" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="50" y1="76" x2="40" y2="86" stroke="FG" stroke-width="1.2" stroke-linecap="round"/>' +
                '<line x1="50" y1="76" x2="60" y2="86" stroke="FG" stroke-width="1.2" stroke-linecap="round"/>' +
                '<line x1="30" y1="38" x2="20" y2="32" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="30" y1="38" x2="22" y2="46" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="70" y1="62" x2="80" y2="68" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<line x1="70" y1="62" x2="78" y2="54" stroke="FG" stroke-width="1" stroke-linecap="round"/>' +
                '<circle cx="50" cy="50" r="3" fill="FG" opacity="0.5"/>';
        }
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + paths + '</svg>';
    }

    /* ── Heart SVG with glossy highlight ── */
    var HEART_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="gbHS" cx="0.35" cy="0.3" r="0.65">' +
            '<stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>' +
            '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>' +
        '</radialGradient></defs>' +
        '<path d="M50 88 C25 65, 2 45, 2 28 C2 12, 15 2, 28 2 C37 2, 45 8, 50 18 C55 8, 63 2, 72 2 C85 2, 98 12, 98 28 C98 45, 75 65, 50 88Z" fill="FG"/>' +
        '<path d="M50 88 C25 65, 2 45, 2 28 C2 12, 15 2, 28 2 C37 2, 45 8, 50 18 C55 8, 63 2, 72 2 C85 2, 98 12, 98 28 C98 45, 75 65, 50 88Z" fill="url(#gbHS)"/>' +
        '<ellipse cx="30" cy="28" rx="14" ry="10" fill="rgba(255,255,255,0.2)" transform="rotate(-25 30 28)"/>' +
    '</svg>';

    /* ── Bat SVG (detailed wing silhouette) ── */
    var BAT_SVG = '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M60 30 C58 24, 50 10, 38 8 C30 6, 18 14, 8 6 C4 2, 2 0, 0 2 C2 10, 8 18, 14 22 C8 20, 4 22, 2 28 C6 26, 12 26, 18 28 C12 28, 8 32, 4 36 C10 34, 16 32, 22 32 C28 34, 40 40, 50 44 L60 48 L70 44 C80 40, 92 34, 98 32 C104 32, 110 34, 116 36 C112 32, 108 28, 102 28 C108 26, 114 26, 118 28 C116 22, 112 20, 106 22 C112 18, 118 10, 120 2 C118 0, 116 2, 112 6 C102 14, 90 6, 82 8 C70 10, 62 24, 60 30Z" fill="FG"/>' +
        '<circle cx="52" cy="26" r="2.5" fill="GLOW" opacity="0.8"/>' +
        '<circle cx="68" cy="26" r="2.5" fill="GLOW" opacity="0.8"/>' +
    '</svg>';

    /* ── Pumpkin SVG (jack-o-lantern with face) ── */
    var PUMPKIN_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
            '<radialGradient id="gbPK" cx="0.45" cy="0.5" r="0.55">' +
                '<stop offset="0%" stop-color="#FF8F00"/>' +
                '<stop offset="80%" stop-color="#E65100"/>' +
                '<stop offset="100%" stop-color="#BF360C"/>' +
            '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="50" cy="58" rx="38" ry="34" fill="url(#gbPK)"/>' +
        '<ellipse cx="36" cy="58" rx="16" ry="33" fill="rgba(255,160,0,0.3)"/>' +
        '<ellipse cx="64" cy="58" rx="16" ry="33" fill="rgba(191,54,12,0.2)"/>' +
        '<path d="M44 18 C46 8, 54 8, 56 18 L54 22 C52 16, 48 16, 46 22Z" fill="#2E7D32"/>' +
        '<path d="M50 22 C52 12, 60 6, 66 10" stroke="#1B5E20" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<polygon points="36,48 40,58 32,58" fill="#1A1A00"/>' +
        '<polygon points="64,48 68,58 60,58" fill="#1A1A00"/>' +
        '<path d="M36 68 C38 72, 42 76, 46 74 C48 72, 52 72, 54 74 C58 76, 62 72, 64 68" stroke="#1A1A00" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<circle cx="36" cy="54" r="1" fill="#FFE082" opacity="0.8"/>' +
        '<circle cx="64" cy="54" r="1" fill="#FFE082" opacity="0.8"/>' +
    '</svg>';

    /* ── Star SVG (5-point with inner glow) ── */
    function starSVG(fillColor) {
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><radialGradient id="gbSG" cx="0.5" cy="0.5" r="0.5">' +
                '<stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>' +
                '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>' +
            '</radialGradient></defs>' +
            '<polygon points="50,5 61,38 97,38 68,60 79,93 50,72 21,93 32,60 3,38 39,38" fill="' + fillColor + '"/>' +
            '<polygon points="50,5 61,38 97,38 68,60 79,93 50,72 21,93 32,60 3,38 39,38" fill="url(#gbSG)"/>' +
            '<polygon points="50,22 56,42 76,42 60,54 66,74 50,62 34,74 40,54 24,42 44,42" fill="rgba(255,255,255,0.12)"/>' +
        '</svg>';
    }

    /* ── Easter Egg SVG ── */
    function easterEggSVG(color1, color2) {
        return '<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><linearGradient id="gbEG" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0%" stop-color="' + color1 + '"/>' +
                '<stop offset="100%" stop-color="' + color2 + '"/>' +
            '</linearGradient></defs>' +
            '<ellipse cx="30" cy="44" rx="24" ry="32" fill="url(#gbEG)"/>' +
            '<path d="M8 36 Q20 30, 30 36 Q40 42, 52 36" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" fill="none"/>' +
            '<path d="M10 48 Q20 54, 30 48 Q40 42, 50 48" stroke="rgba(255,255,255,0.25)" stroke-width="2" fill="none"/>' +
            '<circle cx="20" cy="28" r="3" fill="rgba(255,255,255,0.2)"/>' +
            '<circle cx="38" cy="52" r="2.5" fill="rgba(255,255,255,0.15)"/>' +
            '<circle cx="24" cy="56" r="2" fill="rgba(255,255,255,0.18)"/>' +
            '<ellipse cx="20" cy="30" rx="6" ry="4" fill="rgba(255,255,255,0.1)" transform="rotate(-20 20 30)"/>' +
        '</svg>';
    }

    /* ── Crescent Moon SVG (Ramadan/Eid) ── */
    var CRESCENT_SVG = '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="gbCR" cx="0.3" cy="0.3" r="0.7">' +
            '<stop offset="0%" stop-color="#FFF9C4"/>' +
            '<stop offset="50%" stop-color="#FDD835"/>' +
            '<stop offset="100%" stop-color="#F9A825"/>' +
        '</radialGradient></defs>' +
        '<circle cx="40" cy="40" r="30" fill="url(#gbCR)"/>' +
        '<circle cx="52" cy="32" r="24" fill="BGFILL"/>' +
        '<ellipse cx="30" cy="30" rx="8" ry="5" fill="rgba(255,255,255,0.15)" transform="rotate(-30 30 30)"/>' +
    '</svg>';

    /* ── Lantern SVG (Ramadan) ── */
    var LANTERN_SVG = '<svg viewBox="0 0 50 90" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="gbLN" x1="0.5" y1="0" x2="0.5" y2="1">' +
            '<stop offset="0%" stop-color="#FDD835"/>' +
            '<stop offset="50%" stop-color="#F9A825"/>' +
            '<stop offset="100%" stop-color="#F57F17"/>' +
        '</linearGradient></defs>' +
        '<rect x="18" y="5" width="14" height="6" rx="2" fill="#B8860B"/>' +
        '<line x1="25" y1="0" x2="25" y2="5" stroke="#8D6E63" stroke-width="1.5"/>' +
        '<path d="M14 11 Q14 35, 8 50 Q6 56, 14 60 L36 60 Q44 56, 42 50 Q36 35, 36 11Z" fill="url(#gbLN)" opacity="0.85"/>' +
        '<path d="M14 11 Q14 35, 8 50 Q6 56, 14 60 L36 60 Q44 56, 42 50 Q36 35, 36 11Z" fill="none" stroke="#B8860B" stroke-width="1"/>' +
        '<line x1="25" y1="14" x2="25" y2="58" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>' +
        '<line x1="12" y1="36" x2="38" y2="36" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>' +
        '<ellipse cx="25" cy="40" rx="6" ry="8" fill="rgba(255,255,255,0.1)"/>' +
        '<rect x="12" y="60" width="26" height="4" rx="1" fill="#B8860B"/>' +
        '<path d="M20 64 L18 72 Q25 78, 32 72 L30 64" fill="#B8860B" opacity="0.6"/>' +
    '</svg>';

    /* ── Christmas Ornament Ball ── */
    function ornamentSVG(color1, color2) {
        return '<svg viewBox="0 0 60 75" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><radialGradient id="gbOB" cx="0.35" cy="0.3" r="0.65">' +
                '<stop offset="0%" stop-color="' + color1 + '"/>' +
                '<stop offset="100%" stop-color="' + color2 + '"/>' +
            '</radialGradient></defs>' +
            '<rect x="26" y="2" width="8" height="8" rx="2" fill="#B8860B"/>' +
            '<line x1="30" y1="0" x2="30" y2="2" stroke="#8D6E63" stroke-width="1.5"/>' +
            '<circle cx="30" cy="40" r="26" fill="url(#gbOB)"/>' +
            '<ellipse cx="22" cy="30" rx="8" ry="6" fill="rgba(255,255,255,0.2)" transform="rotate(-30 22 30)"/>' +
            '<circle cx="20" cy="28" r="3" fill="rgba(255,255,255,0.25)"/>' +
            '<path d="M8 44 Q30 38, 52 44" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none"/>' +
        '</svg>';
    }

    /* ── Sun SVG (Summer) ── */
    var SUN_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="gbSN" cx="0.5" cy="0.5" r="0.5">' +
            '<stop offset="0%" stop-color="#FFF9C4"/>' +
            '<stop offset="40%" stop-color="#FFD54F"/>' +
            '<stop offset="100%" stop-color="#FF8F00"/>' +
        '</radialGradient></defs>' +
        '<circle cx="50" cy="50" r="20" fill="url(#gbSN)"/>' +
        '<g stroke="#FFB300" stroke-width="2.5" stroke-linecap="round">' +
            '<line x1="50" y1="8" x2="50" y2="22"/>' +
            '<line x1="50" y1="78" x2="50" y2="92"/>' +
            '<line x1="8" y1="50" x2="22" y2="50"/>' +
            '<line x1="78" y1="50" x2="92" y2="50"/>' +
            '<line x1="20" y1="20" x2="30" y2="30"/>' +
            '<line x1="70" y1="70" x2="80" y2="80"/>' +
            '<line x1="80" y1="20" x2="70" y2="30"/>' +
            '<line x1="20" y1="80" x2="30" y2="70"/>' +
        '</g>' +
        '<circle cx="42" cy="44" r="5" fill="rgba(255,255,255,0.2)"/>' +
    '</svg>';

    /* ── Flower Petal SVG (Easter/Spring) ── */
    var FLOWER_SVG = '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
        '<ellipse cx="30" cy="14" rx="8" ry="12" fill="FG" opacity="0.8"/>' +
        '<ellipse cx="30" cy="46" rx="8" ry="12" fill="FG" opacity="0.7"/>' +
        '<ellipse cx="14" cy="30" rx="12" ry="8" fill="FG" opacity="0.75"/>' +
        '<ellipse cx="46" cy="30" rx="12" ry="8" fill="FG" opacity="0.75"/>' +
        '<ellipse cx="18" cy="18" rx="8" ry="11" fill="FG" opacity="0.65" transform="rotate(-45 18 18)"/>' +
        '<ellipse cx="42" cy="42" rx="8" ry="11" fill="FG" opacity="0.65" transform="rotate(-45 42 42)"/>' +
        '<ellipse cx="42" cy="18" rx="8" ry="11" fill="FG" opacity="0.65" transform="rotate(45 42 18)"/>' +
        '<ellipse cx="18" cy="42" rx="8" ry="11" fill="FG" opacity="0.65" transform="rotate(45 18 42)"/>' +
        '<circle cx="30" cy="30" r="6" fill="#FFF59D"/>' +
        '<circle cx="28" cy="28" r="2" fill="rgba(255,255,255,0.3)"/>' +
    '</svg>';

    /* ── Santa Hat SVG ── */
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
        '<circle cx="62" cy="8" r="10" fill="url(#gbPM)"/>' +
        '<circle cx="59" cy="5" r="3.5" fill="#fff" opacity="0.7"/>' +
    '</svg>';

    /* ── Holly Corner SVG ── */
    var HOLLY_SVG = '<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M10 5 Q50 10, 80 40 Q100 60, 115 95 Q125 115, 130 145" stroke="#2d5a27" stroke-width="2.5" fill="none" opacity="0.6"/>' +
        '<path d="M5 12 Q15 2, 30 5 Q40 -2, 50 8 Q58 2, 55 16 Q44 24, 34 18 Q24 26, 18 16 Q8 20, 5 12Z" fill="#1a472a" opacity="0.9"/>' +
        '<path d="M30 28 Q42 18, 56 25 Q66 16, 72 28 Q78 22, 74 36 Q64 44, 54 38 Q44 46, 38 36 Q28 40, 30 28Z" fill="#1a472a" opacity="0.85"/>' +
        '<path d="M62 52 Q74 42, 88 50 Q96 42, 100 54 Q106 48, 102 62 Q92 70, 82 64 Q72 72, 66 62 Q56 66, 62 52Z" fill="#2d5a27" opacity="0.75"/>' +
        '<path d="M88 80 Q98 72, 110 78 Q116 70, 120 82 Q126 76, 122 90 Q114 96, 106 90 Q98 96, 92 88 Q82 92, 88 80Z" fill="#2d5a27" opacity="0.65"/>' +
        '<circle cx="38" cy="14" r="5.5" fill="#C62828"/><circle cx="32" cy="10" r="4.5" fill="#D32F2F"/><circle cx="36" cy="20" r="5" fill="#B71C1C"/>' +
        '<circle cx="36" cy="12" r="1.8" fill="#E57373" opacity="0.5"/>' +
        '<circle cx="60" cy="36" r="4.5" fill="#C62828"/><circle cx="55" cy="32" r="4" fill="#D32F2F"/>' +
        '<circle cx="58" cy="28" r="1.5" fill="#E57373" opacity="0.5"/>' +
        '<circle cx="88" cy="62" r="4" fill="#C62828"/><circle cx="84" cy="58" r="3.5" fill="#D32F2F"/>' +
    '</svg>';

    /* ── Cobweb SVG (Halloween) ── */
    var COBWEB_SVG = '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0 0 L200 0" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>' +
        '<path d="M0 0 L0 200" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>' +
        '<path d="M0 0 L190 190" stroke="rgba(255,255,255,0.14)" stroke-width="0.8"/>' +
        '<path d="M0 0 L95 200" stroke="rgba(255,255,255,0.12)" stroke-width="0.6"/>' +
        '<path d="M0 0 L200 95" stroke="rgba(255,255,255,0.12)" stroke-width="0.6"/>' +
        '<path d="M0 0 L40 200" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>' +
        '<path d="M0 0 L200 40" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>' +
        '<path d="M25 0 Q25 25, 0 25" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" fill="none"/>' +
        '<path d="M55 0 Q55 55, 0 55" stroke="rgba(255,255,255,0.13)" stroke-width="0.6" fill="none"/>' +
        '<path d="M90 0 Q90 90, 0 90" stroke="rgba(255,255,255,0.1)" stroke-width="0.6" fill="none"/>' +
        '<path d="M130 0 Q130 130, 0 130" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" fill="none"/>' +
        '<path d="M175 0 Q175 175, 0 175" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" fill="none"/>' +
        '<circle cx="90" cy="90" r="1.5" fill="rgba(255,255,255,0.2)"/>' +
    '</svg>';

    /* ── Gift Tag / Sale Tag SVG (Black Friday) ── */
    var SALE_TAG_SVG = '<svg viewBox="0 0 50 65" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M5 5 L45 5 L45 50 L25 62 L5 50Z" fill="FG" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>' +
        '<circle cx="25" cy="16" r="5" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>' +
        '<line x1="12" y1="30" x2="38" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>' +
        '<line x1="15" y1="38" x2="35" y2="38" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>' +
        '<line x1="18" y1="46" x2="32" y2="46" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>' +
    '</svg>';

    /* ── Firework Burst SVG (New Year) ── */
    var FIREWORK_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="50" cy="50" r="4" fill="FG" opacity="0.9"/>' +
        '<g stroke="FG" stroke-width="1.5" stroke-linecap="round" opacity="0.7">' +
            '<line x1="50" y1="50" x2="50" y2="15"/>' +
            '<line x1="50" y1="50" x2="50" y2="85"/>' +
            '<line x1="50" y1="50" x2="15" y2="50"/>' +
            '<line x1="50" y1="50" x2="85" y2="50"/>' +
            '<line x1="50" y1="50" x2="25" y2="25"/>' +
            '<line x1="50" y1="50" x2="75" y2="75"/>' +
            '<line x1="50" y1="50" x2="75" y2="25"/>' +
            '<line x1="50" y1="50" x2="25" y2="75"/>' +
        '</g>' +
        '<g fill="FG" opacity="0.6">' +
            '<circle cx="50" cy="12" r="2.5"/><circle cx="50" cy="88" r="2.5"/>' +
            '<circle cx="12" cy="50" r="2.5"/><circle cx="88" cy="50" r="2.5"/>' +
            '<circle cx="23" cy="23" r="2"/><circle cx="77" cy="77" r="2"/>' +
            '<circle cx="77" cy="23" r="2"/><circle cx="23" cy="77" r="2"/>' +
        '</g>' +
    '</svg>';

    /* ── Wave SVG (Summer) ── */
    var WAVE_SVG = '<svg viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0 15 Q10 5, 20 15 Q30 25, 40 15 Q50 5, 60 15 Q70 25, 80 15" stroke="FG" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="M0 22 Q10 14, 20 22 Q30 30, 40 22 Q50 14, 60 22 Q70 30, 80 22" stroke="FG" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.35"/>' +
    '</svg>';

    /* ═══════════════════════════════════════════
       THEME DEFINITIONS
       Brand gold NEVER overridden.
    ═══════════════════════════════════════════ */
    var THEMES = {

        christmas: {
            neon: {
                border: '3px solid rgba(200, 60, 60, 0.8)',
                shadow: '0 0 25px rgba(200,60,60,0.45), 0 0 50px rgba(46,125,50,0.3), 0 0 80px rgba(200,60,60,0.15), inset 0 0 15px rgba(200,60,60,0.12)'
            },
            navGlow: '0 0 10px rgba(200,60,60,0.25), 0 0 20px rgba(46,125,50,0.12)',
            particles: [
                { svg: 'snowflake', count: isMobile ? 8 : 18, size: [16, 32], opacity: [0.25, 0.6], spin: true },
                { svg: 'ornament', colors: ['#C62828','#B71C1C'], count: isMobile ? 2 : 5, size: [14, 22], opacity: [0.2, 0.45] },
                { svg: 'ornament', colors: ['#1B5E20','#0D3B13'], count: isMobile ? 2 : 4, size: [12, 20], opacity: [0.18, 0.4] },
                { svg: 'ornament', colors: ['#d4af37','#a88a2d'], count: isMobile ? 1 : 3, size: [12, 18], opacity: [0.2, 0.42] }
            ],
            anim: 'fall', speed: [12, 26], drift: [4, 10],
            creative: ['stringLights', 'bottomGarland', 'heroWraith'],
            corner: 'holly',
            heroRing: 'wreath',
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(30,60,100,0.05) 0%, transparent 55%)',
            banner: { text: 'MERRY CHRISTMAS', sub: 'Wishing you joy & style this festive season!', icon: '&#9733;', bg: 'linear-gradient(135deg, #B71C1C, #1B5E20)', color: '#fff' },
            toast: { title: 'MERRY CHRISTMAS', sub: 'Wishing you a festive season full of style!', bg: 'linear-gradient(135deg, #1B5E20, #C62828)', color: '#fff' },
            border: { bg: 'repeating-linear-gradient(90deg,#C62828 0,#C62828 8px,transparent 8px,transparent 14px,#1B5E20 14px,#1B5E20 22px,transparent 22px,transparent 28px)', height: 3 },
            navLine: 'linear-gradient(90deg, transparent, #C62828, #d4af37, #1B5E20, transparent)',
            hat: true
        },

        valentines: {
            neon: {
                border: '3px solid rgba(233, 30, 99, 0.75)',
                shadow: '0 0 25px rgba(233,30,99,0.4), 0 0 50px rgba(233,30,99,0.2), inset 0 0 15px rgba(233,30,99,0.1)'
            },
            navGlow: '0 0 10px rgba(233,30,99,0.2), 0 0 20px rgba(200,100,120,0.1)',
            particles: [
                { svg: 'heart', color: '#E91E63', count: isMobile ? 5 : 12, size: [14, 26], opacity: [0.2, 0.5], spin: false },
                { svg: 'heart', color: '#F48FB1', count: isMobile ? 3 : 8, size: [10, 18], opacity: [0.15, 0.4], spin: false },
                { svg: 'heart', color: '#FCE4EC', count: isMobile ? 2 : 5, size: [8, 14], opacity: [0.12, 0.3], spin: false }
            ],
            anim: 'rise', speed: [14, 28], drift: [4, 8],
            creative: ['rosePetals', 'hangingHearts'],
            heroRing: 'heartRing',
            atmosphere: 'radial-gradient(ellipse at 30% 50%, rgba(233,30,99,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(200,100,120,0.04) 0%, transparent 50%)',
            banner: { text: "HAPPY VALENTINE'S", sub: 'Look sharp for your special someone!', icon: '&#9829;', bg: 'linear-gradient(135deg, #880E4F, #E91E63)', color: '#fff' },
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
            particles: [
                { svg: 'snowflake', count: isMobile ? 10 : 22, size: [18, 36], opacity: [0.3, 0.65], spin: true }
            ],
            anim: 'fall', speed: [14, 30], drift: [4, 10],
            creative: ['frost', 'icicles'],
            heroRing: 'frostRing',
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(79,195,247,0.05) 0%, transparent 55%)',
            banner: { text: 'WINTER WARMTH', sub: 'Warm up with a fresh new look!', icon: '&#10052;', bg: 'linear-gradient(135deg, #01579B, #0288D1)', color: '#E1F5FE' },
            toast: { title: 'WINTER WARMTH', sub: 'Warm up with a fresh cut this winter', bg: 'linear-gradient(135deg, #01579B, #0288D1)', color: '#E1F5FE' },
            border: { bg: 'linear-gradient(90deg,rgba(79,195,247,0),rgba(79,195,247,0.5),rgba(225,245,254,0.8),rgba(79,195,247,0.5),rgba(79,195,247,0))', height: 3, shimmer: true },
            navLine: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.4), rgba(225,245,254,0.7), rgba(79,195,247,0.4), transparent)'
        },

        halloween: {
            neon: {
                border: '3px solid rgba(255, 111, 0, 0.8)',
                shadow: '0 0 25px rgba(255,111,0,0.45), 0 0 50px rgba(106,27,154,0.3), inset 0 0 15px rgba(255,111,0,0.12)'
            },
            navGlow: '0 0 10px rgba(255,111,0,0.25), 0 0 20px rgba(106,27,154,0.12)',
            particles: [
                { svg: 'bat', color: '#1a1a2e', glow: '#FF6F00', count: isMobile ? 3 : 7, size: [22, 40], opacity: [0.3, 0.6], spin: false },
                { svg: 'pumpkin', count: isMobile ? 2 : 5, size: [18, 30], opacity: [0.25, 0.5] }
            ],
            anim: 'sway', speed: [10, 22], drift: [5, 12],
            creative: ['fog', 'bottomGraveyard'],
            corner: 'cobweb',
            heroRing: 'spookyRing',
            atmosphere: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
            banner: { text: 'HAPPY HALLOWEEN', sub: 'Get a killer look this spooky season!', icon: '&#127875;', bg: 'linear-gradient(135deg, #4A148C, #E65100)', color: '#FFE0B2' },
            toast: { title: 'SPOOKY SEASON', sub: 'Get a killer look this Halloween!', bg: 'linear-gradient(135deg, #4A148C, #E65100)', color: '#FFE0B2' },
            border: { bg: 'linear-gradient(90deg,#4A148C,#FF6F00,#4A148C)', height: 3, glow: 'rgba(255,111,0,0.4)' },
            navLine: 'linear-gradient(90deg, #4A148C, #FF6F00, #4A148C, #FF6F00, #4A148C)'
        },

        easter: {
            neon: {
                border: '3px solid rgba(129, 199, 132, 0.75)',
                shadow: '0 0 25px rgba(129,199,132,0.35), 0 0 50px rgba(244,143,177,0.25), inset 0 0 15px rgba(129,199,132,0.1)'
            },
            navGlow: '0 0 10px rgba(129,199,132,0.2), 0 0 20px rgba(244,143,177,0.1)',
            particles: [
                { svg: 'egg', colors: ['#F48FB1','#E91E63'], count: isMobile ? 3 : 6, size: [14, 22], opacity: [0.25, 0.5] },
                { svg: 'egg', colors: ['#81C784','#4CAF50'], count: isMobile ? 2 : 5, size: [12, 20], opacity: [0.2, 0.45] },
                { svg: 'egg', colors: ['#90CAF9','#42A5F5'], count: isMobile ? 2 : 4, size: [12, 18], opacity: [0.2, 0.4] },
                { svg: 'flower', color: '#F48FB1', count: isMobile ? 2 : 5, size: [14, 22], opacity: [0.18, 0.4], spin: true }
            ],
            anim: 'fall', speed: [16, 32], drift: [4, 8],
            creative: ['butterflies', 'bottomFlowers'],
            heroRing: 'springRing',
            atmosphere: 'radial-gradient(ellipse at 25% 40%, rgba(129,199,132,0.04) 0%, transparent 45%), radial-gradient(ellipse at 75% 60%, rgba(244,143,177,0.04) 0%, transparent 45%)',
            banner: { text: 'HAPPY EASTER', sub: 'Spring into a fresh new look!', icon: '&#127807;', bg: 'linear-gradient(135deg, #66BB6A, #81C784)', color: '#fff' },
            toast: { title: 'HAPPY EASTER', sub: 'Spring into a fresh new look!', bg: 'linear-gradient(135deg, #66BB6A, #81C784)', color: '#fff' },
            border: { bg: 'repeating-linear-gradient(90deg,#F48FB1 0,#F48FB1 12px,#81C784 12px,#81C784 24px,#FFF59D 24px,#FFF59D 36px,#90CAF9 36px,#90CAF9 48px)', height: 3 },
            navLine: 'linear-gradient(90deg, #F48FB1, #81C784, #FFF59D, #81C784, #F48FB1)'
        },

        summer: {
            neon: {
                border: '3px solid rgba(255, 143, 0, 0.75)',
                shadow: '0 0 25px rgba(255,143,0,0.35), 0 0 50px rgba(2,136,209,0.25), inset 0 0 15px rgba(255,143,0,0.1)'
            },
            navGlow: '0 0 10px rgba(255,143,0,0.2), 0 0 20px rgba(2,136,209,0.1)',
            particles: [
                { svg: 'sun', count: isMobile ? 2 : 4, size: [18, 30], opacity: [0.15, 0.35], spin: true },
                { svg: 'wave', color: '#0288D1', count: isMobile ? 3 : 6, size: [30, 50], opacity: [0.12, 0.28] }
            ],
            anim: 'float', speed: [8, 16], drift: [3, 6],
            creative: ['sunFlare', 'heatShimmer', 'bottomWaves'],
            heroRing: 'sunRing',
            atmosphere: 'radial-gradient(ellipse at 85% 10%, rgba(255,200,100,0.07) 0%, transparent 50%)',
            banner: { text: 'SUMMER VIBES', sub: 'Stay fresh all summer long!', icon: '&#9728;', bg: 'linear-gradient(135deg, #E65100, #FF8F00)', color: '#fff' },
            toast: { title: 'SUMMER VIBES', sub: 'Stay fresh all summer long!', bg: 'linear-gradient(135deg, #E65100, #FF8F00)', color: '#fff' },
            border: { bg: 'linear-gradient(90deg,#FF8F00,#0288D1,#FF8F00,#0288D1)', height: 3, animated: true },
            navLine: 'linear-gradient(90deg, #FF8F00, #0288D1, #FF8F00, #0288D1, #FF8F00)'
        },

        eid: {
            neon: {
                border: '3px solid rgba(253, 216, 53, 0.85)',
                shadow: '0 0 25px rgba(253,216,53,0.45), 0 0 50px rgba(46,125,50,0.25), inset 0 0 15px rgba(253,216,53,0.12)'
            },
            navGlow: '0 0 10px rgba(253,216,53,0.25), 0 0 20px rgba(46,125,50,0.1)',
            particles: [
                { svg: 'star', color: '#FDD835', count: isMobile ? 4 : 10, size: [12, 22], opacity: [0.22, 0.5], spin: true },
                { svg: 'crescent', bgFill: '#0a0a14', count: isMobile ? 2 : 4, size: [16, 26], opacity: [0.2, 0.42] }
            ],
            anim: 'float', speed: [8, 16], drift: [3, 6],
            creative: ['sparkleField'],
            heroRing: 'goldRing',
            atmosphere: 'radial-gradient(ellipse at 50% 30%, rgba(253,216,53,0.03) 0%, transparent 50%)',
            banner: { text: 'EID MUBARAK', sub: 'Celebrate in style with a fresh look!', icon: '&#9734;', bg: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#FFF9C4' },
            toast: { title: 'EID MUBARAK', sub: 'Celebrate in style with a fresh look!', bg: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#FFF9C4' },
            border: { bg: 'repeating-linear-gradient(90deg,transparent 0,transparent 8px,#FDD835 8px,#FDD835 12px)', height: 3 },
            navLine: 'linear-gradient(90deg, transparent, #2E7D32, #FDD835, #2E7D32, transparent)'
        },

        ramadan: {
            neon: {
                border: '3px solid rgba(184, 134, 11, 0.85)',
                shadow: '0 0 25px rgba(184,134,11,0.4), 0 0 50px rgba(26,35,126,0.3), inset 0 0 15px rgba(184,134,11,0.1)'
            },
            navGlow: '0 0 10px rgba(184,134,11,0.2), 0 0 20px rgba(26,35,126,0.1)',
            particles: [
                { svg: 'crescent', bgFill: '#0d1033', count: isMobile ? 2 : 5, size: [16, 28], opacity: [0.2, 0.42] },
                { svg: 'lantern', count: isMobile ? 3 : 7, size: [14, 24], opacity: [0.22, 0.48] },
                { svg: 'star', color: '#B8860B', count: isMobile ? 3 : 6, size: [8, 16], opacity: [0.15, 0.35], spin: true }
            ],
            anim: 'float', speed: [10, 20], drift: [3, 6],
            creative: ['sparkleField', 'hangingLanterns'],
            heroRing: 'goldRing',
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(26,35,126,0.05) 0%, transparent 55%)',
            banner: { text: 'RAMADAN KAREEM', sub: 'Wishing you a blessed & beautiful month', icon: '&#9774;', bg: 'linear-gradient(135deg, #1A237E, #283593)', color: '#E8EAF6' },
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
                { svg: 'tag', color: '#FF1744', count: isMobile ? 3 : 7, size: [14, 24], opacity: [0.22, 0.48] },
                { svg: 'tag', color: '#FFD600', count: isMobile ? 2 : 5, size: [12, 20], opacity: [0.18, 0.4] }
            ],
            anim: 'fall', speed: [5, 12], drift: [2, 5],
            creative: ['neonFlash'],
            heroRing: 'fireRing',
            atmosphere: 'radial-gradient(ellipse at 50% 50%, rgba(255,23,68,0.03) 0%, transparent 55%)',
            banner: { text: 'BLACK FRIDAY DEALS', sub: 'Biggest deals of the year - Don\'t miss out!', icon: '&#128293;', bg: 'linear-gradient(135deg, #000, #212121)', color: '#FFD600' },
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
                { svg: 'firework', color: '#FFD700', count: isMobile ? 3 : 7, size: [20, 36], opacity: [0.2, 0.45], spin: true },
                { svg: 'firework', color: '#C0C0C0', count: isMobile ? 2 : 4, size: [16, 28], opacity: [0.15, 0.35], spin: true },
                { svg: 'star', color: '#FFD700', count: isMobile ? 3 : 6, size: [10, 18], opacity: [0.2, 0.45], spin: true }
            ],
            anim: 'fall', speed: [10, 20], drift: [4, 8],
            creative: ['confetti'],
            heroRing: 'champagneRing',
            atmosphere: 'radial-gradient(ellipse at 50% 0%, rgba(13,71,161,0.05) 0%, transparent 55%)',
            banner: { text: 'HAPPY NEW YEAR', sub: 'New year, fresh look - Start the year right!', icon: '&#127878;', bg: 'linear-gradient(135deg, #0D47A1, #1565C0)', color: '#FFD700' },
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
    function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
    function getTheme(id) {
        if (!id) return null;
        var k = id.toLowerCase().replace(/[\s_']/g, '-');
        return THEMES[k] || THEMES[k.replace(/-/g, '')] || null;
    }

    /* Build SVG element from template string, replacing color placeholders */
    function buildSVG(template, color, glow, bgFill) {
        var s = template;
        if (color) s = s.replace(/FG/g, color);
        if (glow) s = s.replace(/GLOW/g, glow);
        if (bgFill) s = s.replace(/BGFILL/g, bgFill);
        return s;
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

            /* Particle wrapper */
            '.gb-pw{position:absolute;pointer-events:none;will-change:transform}',
            '.gb-p{pointer-events:none;will-change:transform}',
            '.gb-p svg{width:100%;height:100%;display:block}',

            /* ── FALL ── */
            '@keyframes gb-fall{0%{transform:translateY(-8vh);opacity:0}5%{opacity:var(--op)}92%{opacity:var(--op)}100%{transform:translateY(108vh);opacity:0}}',

            /* ── DRIFT ── */
            '@keyframes gb-drift{0%,100%{transform:translateX(0)}25%{transform:translateX(calc(var(--dx) * 0.6))}50%{transform:translateX(calc(var(--dx) * -0.4))}75%{transform:translateX(var(--dx))}}',

            /* ── RISE ── */
            '@keyframes gb-rise{0%{transform:translateY(108vh);opacity:0}8%{opacity:var(--op)}90%{opacity:var(--op)}100%{transform:translateY(-8vh);opacity:0}}',

            /* ── FLOAT ── */
            '@keyframes gb-vfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-25px)}}',

            /* ── SWAY ── */
            '@keyframes gb-vsway{0%,100%{transform:translateY(0) scaleX(1)}25%{transform:translateY(-20px) scaleX(1.02)}50%{transform:translateY(10px) scaleX(0.98)}75%{transform:translateY(-15px) scaleX(1.01)}}',

            /* ── SPIN ── */
            '@keyframes gb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
            '@keyframes gb-spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',

            /* ── STRING LIGHTS ── */
            '.gb-lights{position:fixed;top:78px;left:0;width:100%;height:60px;pointer-events:none;z-index:998;opacity:0;animation:gb-fadein 1.5s ease 0.5s forwards}',
            '.gb-lights-wire{position:absolute;top:0;left:0;width:100%;height:100%}',
            '.gb-bulb{position:absolute;width:12px;height:16px;border-radius:50% 50% 50% 50% / 55% 55% 45% 45%;transform:translateX(-50%);animation:gb-glow 2.5s ease-in-out infinite}',
            '.gb-bulb::after{content:"";position:absolute;top:2px;left:3px;width:4px;height:5px;background:rgba(255,255,255,0.25);border-radius:50%;pointer-events:none}',
            '.gb-bulb-cap{position:absolute;width:8px;height:5px;background:#666;border-radius:2px 2px 0 0;transform:translateX(-50%)}',
            '@keyframes gb-glow{0%,100%{box-shadow:0 3px 8px var(--gc),0 0 14px var(--gc);opacity:0.8}50%{box-shadow:0 3px 16px var(--gc),0 0 24px var(--gc);opacity:1}}',

            /* ── CORNER ORNAMENTS ── */
            '.gb-corner{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fadein 2s ease 0.8s forwards}',
            '.gb-corner svg{width:100%;height:100%}',

            /* ── FOG (Halloween) ── */
            '.gb-fog{position:fixed;bottom:0;left:0;width:200%;height:35vh;pointer-events:none;z-index:1;opacity:0}',
            '.gb-fog-1{background:linear-gradient(to top,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.025) 40%,transparent 100%);animation:gb-fadein 3s ease 1s forwards, gb-fogdrift 28s linear infinite}',
            '.gb-fog-2{background:linear-gradient(to top,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.018) 50%,transparent 100%);animation:gb-fadein 3s ease 1.5s forwards, gb-fogdrift 40s linear infinite reverse}',
            '@keyframes gb-fogdrift{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',

            /* ── SUN FLARE ── */
            '.gb-sunflare{position:fixed;top:0;right:0;width:55vw;height:55vh;pointer-events:none;z-index:0;background:radial-gradient(ellipse at 90% 10%,rgba(255,200,100,0.1) 0%,transparent 60%);opacity:0;animation:gb-fadein 2s ease 0.5s forwards,gb-sunpulse 8s ease-in-out infinite}',
            '@keyframes gb-sunpulse{0%,100%{opacity:0.7}50%{opacity:1}}',

            /* ── HEAT SHIMMER (Summer) ── */
            '.gb-heatshimmer{position:fixed;bottom:0;left:0;width:100%;height:20vh;pointer-events:none;z-index:0;background:linear-gradient(to top,rgba(255,200,100,0.04) 0%,transparent 100%);opacity:0;animation:gb-fadein 2s ease 1s forwards,gb-heatwave 4s ease-in-out infinite}',
            '@keyframes gb-heatwave{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.02)}}',

            /* ── FROST (Winter) ── */
            '.gb-frost{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fadein 3s ease 1s forwards}',
            '.gb-frost-tl{top:0;left:0;width:200px;height:200px;background:radial-gradient(ellipse at 0% 0%,rgba(200,230,255,0.08) 0%,transparent 70%)}',
            '.gb-frost-tr{top:0;right:0;width:200px;height:200px;background:radial-gradient(ellipse at 100% 0%,rgba(200,230,255,0.08) 0%,transparent 70%)}',
            '.gb-frost-bl{bottom:0;left:0;width:180px;height:180px;background:radial-gradient(ellipse at 0% 100%,rgba(200,230,255,0.06) 0%,transparent 70%)}',
            '.gb-frost-br{bottom:0;right:0;width:180px;height:180px;background:radial-gradient(ellipse at 100% 100%,rgba(200,230,255,0.06) 0%,transparent 70%)}',

            /* ── ROSE PETALS (Valentine) ── */
            '.gb-rosepetal{position:absolute;pointer-events:none;border-radius:50% 0 50% 0;animation:gb-petalfall var(--pd) linear infinite}',
            '@keyframes gb-petalfall{0%{transform:translateY(-5vh) rotate(0deg);opacity:0}5%{opacity:var(--op)}90%{opacity:var(--op)}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}',

            /* ── BUTTERFLIES (Easter) ── */
            '.gb-butterfly{position:absolute;pointer-events:none;animation:gb-bfly var(--bd) ease-in-out infinite}',
            '.gb-butterfly-wing{display:inline-block;border-radius:50% 50% 10% 50%;animation:gb-wingflap 0.4s ease-in-out infinite alternate}',
            '.gb-butterfly-wing.right{transform:scaleX(-1)}',
            '@keyframes gb-bfly{0%,100%{transform:translate(0,0)}25%{transform:translate(30px,-20px)}50%{transform:translate(-15px,-35px)}75%{transform:translate(20px,-10px)}}',
            '@keyframes gb-wingflap{0%{transform:scaleY(1) skewX(0deg)}100%{transform:scaleY(0.6) skewX(10deg)}}',

            /* ── SPARKLE FIELD (Eid/Ramadan) ── */
            '.gb-sparkle{position:fixed;pointer-events:none;z-index:1;border-radius:50%;animation:gb-twinkle var(--sd) ease-in-out infinite}',
            '@keyframes gb-twinkle{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:var(--op);transform:scale(1)}}',

            /* ── NEON FLASH (Black Friday) ── */
            '.gb-neonflash{position:fixed;pointer-events:none;z-index:0;opacity:0;animation:gb-nflash 3s ease-in-out infinite}',
            '@keyframes gb-nflash{0%,100%{opacity:0}15%{opacity:0.06}30%{opacity:0}45%{opacity:0.04}60%{opacity:0}80%{opacity:0.08}90%{opacity:0}}',

            /* ── BOTTOM SCENE (positioned decorations at viewport bottom) ── */
            '.gb-bottom{position:fixed;bottom:0;left:0;width:100%;pointer-events:none;z-index:2;opacity:0;animation:gb-fadein 2s ease 1s forwards}',
            '.gb-bottom svg{width:100%;height:100%;display:block}',

            /* ── SIDE ACCENTS (hanging decorations from sides) ── */
            '.gb-side{position:fixed;top:0;pointer-events:none;z-index:2;opacity:0;animation:gb-fadein 2.5s ease 1.2s forwards}',
            '.gb-side svg{width:100%;height:100%}',
            '.gb-side-left{left:0}',
            '.gb-side-right{right:0}',

            /* ── HERO RING (decorative ring around hero circle) ── */
            '.gb-hero-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:4;border-radius:50%;opacity:0;animation:gb-fadein 2s ease 0.5s forwards}',
            '.gb-hero-ring-pulse{animation:gb-fadein 2s ease 0.5s forwards, gb-ringpulse 4s ease-in-out 2.5s infinite}',
            '@keyframes gb-ringpulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.7}50%{transform:translate(-50%,-50%) scale(1.03);opacity:1}}',

            /* ── POSITIONED ELEMENT (specific spot on screen) ── */
            '.gb-placed{position:fixed;pointer-events:none;z-index:2;opacity:0;animation:gb-fadein 2s ease 1.5s forwards}',
            '.gb-placed svg{width:100%;height:100%}',

            /* ── CONFETTI ── */
            '.gb-confetti-wrap{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;overflow:hidden}',
            '.gb-conf{position:absolute;top:-10px;pointer-events:none;animation:gb-conffall var(--cd) ease-out forwards}',
            '@keyframes gb-conffall{0%{transform:translateY(0) rotate(0deg);opacity:1}80%{opacity:0.8}100%{transform:translateY(100vh) rotate(var(--cr));opacity:0}}',

            /* ── CELEBRATION BANNER ── */
            '.gb-banner{position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-20px);z-index:999;' +
                'font-family:"Outfit",sans-serif;pointer-events:none;text-align:center;' +
                'border-radius:20px;overflow:hidden;padding:16px 32px;min-width:280px;max-width:420px;' +
                'box-shadow:0 8px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.1);' +
                'opacity:0;animation:gb-bannerin 1s cubic-bezier(.34,1.56,.64,1) 1.5s forwards}',
            '.gb-banner-icon{font-size:28px;margin-bottom:4px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))}',
            '.gb-banner-text{font-size:14px;font-weight:800;letter-spacing:3px;text-transform:uppercase;line-height:1.3;text-shadow:0 1px 3px rgba(0,0,0,0.3)}',
            '.gb-banner-sub{font-size:12px;font-weight:500;opacity:.85;line-height:1.4;margin-top:4px}',
            '.gb-banner-shine{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);animation:gb-bannershine 4s ease-in-out 2.5s infinite}',
            '@keyframes gb-bannerin{to{opacity:1;transform:translateX(-50%) translateY(0)}}',
            '@keyframes gb-bannerout{to{opacity:0;transform:translateX(-50%) translateY(-30px)}}',
            '@keyframes gb-bannershine{0%{left:-100%}50%{left:100%}100%{left:100%}}',

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
                '.gb-banner{max-width:calc(100% - 40px);padding:12px 20px;top:70px}' +
                '.gb-banner-text{font-size:12px;letter-spacing:2px}' +
                '.gb-banner-sub{font-size:11px}' +
            '}',

            /* Reduced motion */
            '@media(prefers-reduced-motion:reduce){' +
                '.gb-pw,.gb-p,.gb-bulb,.gb-fog,.gb-fog-1,.gb-fog-2,.gb-sunflare,.gb-conf,.gb-sparkle,.gb-rosepetal,.gb-butterfly,.gb-heatshimmer{animation:none!important}' +
            '}'
        ].join('\n');
        document.head.appendChild(state.style);
    }

    /* ═══════════════════════════════════════════
       SVG PARTICLE SYSTEM
       Creates realistic SVG illustration particles
    ═══════════════════════════════════════════ */
    function createParticles(theme) {
        if (!theme.particles || !theme.particles.length) return;
        if (state.container) state.container.remove();
        state.container = document.createElement('div');
        state.container.className = 'gb-fx';

        theme.particles.forEach(function(p) {
            for (var i = 0; i < p.count; i++) {
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
                el.style.width = size + 'px';
                el.style.height = (p.svg === 'bat' ? size * 0.5 : p.svg === 'wave' ? size * 0.375 : p.svg === 'egg' ? size * 1.33 : p.svg === 'lantern' ? size * 1.8 : size) + 'px';
                el.style.setProperty('--dx', drift + 'px');

                // Build the correct SVG
                var svgHTML = '';
                if (p.svg === 'snowflake') {
                    svgHTML = buildSVG(snowflakeSVG(randInt(0, 2)), 'rgba(255,255,255,0.9)');
                } else if (p.svg === 'heart') {
                    svgHTML = buildSVG(HEART_SVG, p.color || '#E91E63');
                } else if (p.svg === 'bat') {
                    svgHTML = buildSVG(BAT_SVG, p.color || '#1a1a2e', p.glow || '#FF6F00');
                } else if (p.svg === 'pumpkin') {
                    svgHTML = PUMPKIN_SVG;
                } else if (p.svg === 'star') {
                    svgHTML = starSVG(p.color || '#FDD835');
                } else if (p.svg === 'egg') {
                    svgHTML = easterEggSVG(p.colors ? p.colors[0] : '#F48FB1', p.colors ? p.colors[1] : '#E91E63');
                } else if (p.svg === 'flower') {
                    svgHTML = buildSVG(FLOWER_SVG, p.color || '#F48FB1');
                } else if (p.svg === 'crescent') {
                    svgHTML = buildSVG(CRESCENT_SVG, null, null, p.bgFill || '#0a0a14');
                } else if (p.svg === 'lantern') {
                    svgHTML = LANTERN_SVG;
                } else if (p.svg === 'ornament') {
                    svgHTML = ornamentSVG(p.colors ? p.colors[0] : '#C62828', p.colors ? p.colors[1] : '#B71C1C');
                } else if (p.svg === 'tag') {
                    svgHTML = buildSVG(SALE_TAG_SVG, p.color || '#FF1744');
                } else if (p.svg === 'firework') {
                    svgHTML = buildSVG(FIREWORK_SVG, p.color || '#FFD700');
                } else if (p.svg === 'sun') {
                    svgHTML = SUN_SVG;
                } else if (p.svg === 'wave') {
                    svgHTML = buildSVG(WAVE_SVG, p.color || '#0288D1');
                }

                el.innerHTML = svgHTML;

                // Animation based on theme anim type
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

                // Add spin for snowflakes, stars, fireworks, etc.
                if (p.spin) {
                    var spinDur = rand(8, 20);
                    var innerSVG = el.querySelector('svg');
                    if (innerSVG) {
                        innerSVG.style.animation = 'gb-spinSlow ' + spinDur.toFixed(1) + 's linear infinite';
                        if (Math.random() > 0.5) innerSVG.style.animationDirection = 'reverse';
                    }
                }

                wrapper.appendChild(el);
                state.container.appendChild(wrapper);
            }
        });

        document.body.appendChild(state.container);
    }

    /* ═══════════════════════════════════════════
       STRING LIGHTS - Premium Christmas
       Bigger bulbs, brighter glow, cap detail
    ═══════════════════════════════════════════ */
    function createStringLights() {
        if (isMobile) return;
        var el = document.createElement('div');
        el.className = 'gb-lights';

        var numBulbs = 16;
        var marginPct = 6;
        var colors = [
            { bg: 'rgba(255,245,224,0.92)', glow: 'rgba(255,245,224,0.55)' },
            { bg: 'rgba(220,60,60,0.92)', glow: 'rgba(220,60,60,0.45)' },
            { bg: 'rgba(212,175,55,0.92)', glow: 'rgba(212,175,55,0.5)' },
            { bg: 'rgba(80,170,80,0.92)', glow: 'rgba(80,170,80,0.45)' },
            { bg: 'rgba(80,140,220,0.9)', glow: 'rgba(80,140,220,0.4)' }
        ];

        var points = [];
        for (var i = 0; i < numBulbs; i++) {
            var pct = marginPct + (i / (numBulbs - 1)) * (100 - 2 * marginPct);
            var droop = Math.sin((i / (numBulbs - 1)) * Math.PI) * 20;
            points.push((pct * 10) + ',' + (5 + droop));
        }
        var wireSvg = '<svg class="gb-lights-wire" viewBox="0 0 1000 60" preserveAspectRatio="none">' +
            '<polyline points="' + points.join(' ') + '" stroke="rgba(80,80,80,0.4)" stroke-width="1.5" fill="none"/>' +
        '</svg>';
        el.innerHTML = wireSvg;

        for (var i = 0; i < numBulbs; i++) {
            var pct = marginPct + (i / (numBulbs - 1)) * (100 - 2 * marginPct);
            var droop = Math.sin((i / (numBulbs - 1)) * Math.PI) * 20;
            var c = colors[i % colors.length];
            var yPos = 9 + droop * 0.33;

            var cap = document.createElement('div');
            cap.className = 'gb-bulb-cap';
            cap.style.left = pct + '%';
            cap.style.top = yPos + '%';
            el.appendChild(cap);

            var bulb = document.createElement('div');
            bulb.className = 'gb-bulb';
            bulb.style.left = pct + '%';
            bulb.style.top = (yPos + 5) + '%';
            bulb.style.background = c.bg;
            bulb.style.setProperty('--gc', c.glow);
            bulb.style.animationDelay = (i * 0.22) + 's';
            el.appendChild(bulb);
        }

        document.body.appendChild(el);
        state.creativeExtra.push(el);
    }

    /* ═══════════════════════════════════════════
       FOG - Halloween atmospheric effect
    ═══════════════════════════════════════════ */
    function createFog() {
        var f1 = document.createElement('div');
        f1.className = 'gb-fog gb-fog-1';
        document.body.appendChild(f1);
        state.creativeExtra.push(f1);

        var f2 = document.createElement('div');
        f2.className = 'gb-fog gb-fog-2';
        document.body.appendChild(f2);
        state.creativeExtra.push(f2);
    }

    /* ═══════════════════════════════════════════
       SUN FLARE - Summer warm glow
    ═══════════════════════════════════════════ */
    function createSunFlare() {
        var el = document.createElement('div');
        el.className = 'gb-sunflare';
        document.body.appendChild(el);
        state.creativeExtra.push(el);
    }

    /* ═══════════════════════════════════════════
       HEAT SHIMMER - Summer ground heat effect
    ═══════════════════════════════════════════ */
    function createHeatShimmer() {
        var el = document.createElement('div');
        el.className = 'gb-heatshimmer';
        document.body.appendChild(el);
        state.creativeExtra.push(el);
    }

    /* ═══════════════════════════════════════════
       FROST - Winter corner frost effect
    ═══════════════════════════════════════════ */
    function createFrost() {
        ['tl','tr','bl','br'].forEach(function(pos) {
            var el = document.createElement('div');
            el.className = 'gb-frost gb-frost-' + pos;
            document.body.appendChild(el);
            state.creativeExtra.push(el);
        });
    }

    /* ═══════════════════════════════════════════
       ROSE PETALS - Valentine's floating petals
    ═══════════════════════════════════════════ */
    function createRosePetals() {
        var count = isMobile ? 6 : 14;
        var colors = ['#E91E63', '#F06292', '#EC407A', '#AD1457'];
        for (var i = 0; i < count; i++) {
            var petal = document.createElement('div');
            petal.className = 'gb-rosepetal';
            var size = rand(6, 14);
            var dur = rand(10, 22);
            var delay = rand(0, dur);
            var opacity = rand(0.15, 0.35);
            petal.style.width = size + 'px';
            petal.style.height = size * 1.4 + 'px';
            petal.style.left = rand(2, 98) + '%';
            petal.style.background = colors[randInt(0, colors.length - 1)];
            petal.style.setProperty('--pd', dur.toFixed(1) + 's');
            petal.style.setProperty('--op', opacity.toFixed(2));
            petal.style.animationDelay = delay.toFixed(1) + 's';
            // Attach to body within a fixed container
            var wrap = document.createElement('div');
            wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden';
            wrap.appendChild(petal);
            document.body.appendChild(wrap);
            state.creativeExtra.push(wrap);
        }
    }

    /* ═══════════════════════════════════════════
       BUTTERFLIES - Easter spring effect
    ═══════════════════════════════════════════ */
    function createButterflies() {
        if (isMobile) return;
        var count = 4;
        var colors = ['#F48FB1', '#81C784', '#90CAF9', '#CE93D8'];
        for (var i = 0; i < count; i++) {
            var bfly = document.createElement('div');
            bfly.className = 'gb-butterfly';
            bfly.style.position = 'fixed';
            bfly.style.left = rand(10, 85) + '%';
            bfly.style.top = rand(15, 70) + '%';
            bfly.style.pointerEvents = 'none';
            bfly.style.zIndex = '2';
            bfly.style.opacity = rand(0.2, 0.4).toFixed(2);
            bfly.style.setProperty('--bd', rand(8, 16).toFixed(1) + 's');
            bfly.style.animationDelay = rand(0, 5).toFixed(1) + 's';
            var wingSize = rand(6, 10);
            var c = colors[i % colors.length];
            bfly.innerHTML = '<span class="gb-butterfly-wing" style="width:' + wingSize + 'px;height:' + (wingSize * 1.3) + 'px;background:' + c + '"></span>' +
                '<span class="gb-butterfly-wing right" style="width:' + wingSize + 'px;height:' + (wingSize * 1.3) + 'px;background:' + c + '"></span>';
            document.body.appendChild(bfly);
            state.creativeExtra.push(bfly);
        }
    }

    /* ═══════════════════════════════════════════
       SPARKLE FIELD - Eid/Ramadan twinkling stars
    ═══════════════════════════════════════════ */
    function createSparkleField() {
        var count = isMobile ? 15 : 35;
        for (var i = 0; i < count; i++) {
            var spark = document.createElement('div');
            spark.className = 'gb-sparkle';
            var size = rand(2, 5);
            spark.style.width = size + 'px';
            spark.style.height = size + 'px';
            spark.style.left = rand(2, 98) + '%';
            spark.style.top = rand(2, 95) + '%';
            spark.style.background = Math.random() > 0.5 ? '#FDD835' : '#FFF9C4';
            spark.style.setProperty('--sd', rand(2, 5).toFixed(1) + 's');
            spark.style.setProperty('--op', rand(0.2, 0.55).toFixed(2));
            spark.style.animationDelay = rand(0, 4).toFixed(1) + 's';
            document.body.appendChild(spark);
            state.creativeExtra.push(spark);
        }
    }

    /* ═══════════════════════════════════════════
       NEON FLASH - Black Friday dramatic effect
    ═══════════════════════════════════════════ */
    function createNeonFlash() {
        var el = document.createElement('div');
        el.className = 'gb-neonflash';
        el.style.inset = '0';
        el.style.background = 'radial-gradient(ellipse at 50% 50%, rgba(255,23,68,0.15) 0%, transparent 70%)';
        document.body.appendChild(el);
        state.creativeExtra.push(el);
    }

    /* ═══════════════════════════════════════════
       BOTTOM SCENE - Positioned decorations at
       the bottom edge of the viewport
    ═══════════════════════════════════════════ */
    function createBottomScene(type) {
        var el = document.createElement('div');
        el.className = 'gb-bottom';
        var h, svg;

        if (type === 'garland') {
            /* Christmas garland with bows and berries along bottom */
            h = isMobile ? 35 : 50;
            svg = '<svg viewBox="0 0 1200 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M0 20 Q60 45,120 20 Q180 -5,240 20 Q300 45,360 20 Q420 -5,480 20 Q540 45,600 20 Q660 -5,720 20 Q780 45,840 20 Q900 -5,960 20 Q1020 45,1080 20 Q1140 -5,1200 20" stroke="#1B5E20" stroke-width="4" fill="none" opacity="0.5"/>' +
                '<path d="M0 22 Q60 47,120 22 Q180 -3,240 22 Q300 47,360 22 Q420 -3,480 22 Q540 47,600 22 Q660 -3,720 22 Q780 47,840 22 Q900 -3,960 22 Q1020 47,1080 22 Q1140 -3,1200 22" stroke="#2E7D32" stroke-width="2" fill="none" opacity="0.35"/>' +
                '<g fill="#C62828" opacity="0.6"><circle cx="120" cy="20" r="4"/><circle cx="360" cy="20" r="4"/><circle cx="600" cy="20" r="4"/><circle cx="840" cy="20" r="4"/><circle cx="1080" cy="20" r="4"/></g>' +
                '<g fill="#d4af37" opacity="0.45"><circle cx="240" cy="20" r="3.5"/><circle cx="480" cy="20" r="3.5"/><circle cx="720" cy="20" r="3.5"/><circle cx="960" cy="20" r="3.5"/></g>' +
            '</svg>';
        } else if (type === 'graveyard') {
            /* Halloween graveyard silhouette */
            h = isMobile ? 50 : 70;
            svg = '<svg viewBox="0 0 1200 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
                '<rect x="0" y="55" width="1200" height="15" fill="rgba(20,10,30,0.4)"/>' +
                '<path d="M80 55 L80 30 Q80 18,92 18 L100 18 Q112 18,112 30 L112 55Z" fill="rgba(60,40,70,0.4)"/>' +
                '<rect x="90" y="24" width="4" height="18" fill="rgba(80,60,90,0.3)"/><rect x="84" y="32" width="16" height="3" fill="rgba(80,60,90,0.3)"/>' +
                '<path d="M300 55 L300 35 Q300 22,316 22 L316 22 Q332 22,332 35 L332 55Z" fill="rgba(55,35,65,0.35)"/>' +
                '<path d="M550 55 L550 25 L560 20 L570 25 L570 55Z" fill="rgba(50,30,60,0.35)"/>' +
                '<path d="M800 55 L800 32 Q800 20,815 20 L815 20 Q830 20,830 32 L830 55Z" fill="rgba(60,40,70,0.35)"/>' +
                '<path d="M1050 55 L1050 28 Q1050 15,1065 15 L1065 15 Q1080 15,1080 28 L1080 55Z" fill="rgba(55,35,65,0.3)"/>' +
                '<path d="M180 55 L180 42 Q200 38,220 42 L220 55Z" fill="rgba(30,15,40,0.25)"/>' +
                '<path d="M650 55 L650 44 Q665 40,680 44 L680 55Z" fill="rgba(30,15,40,0.2)"/>' +
            '</svg>';
        } else if (type === 'waves') {
            /* Summer ocean waves at bottom */
            h = isMobile ? 40 : 55;
            svg = '<svg viewBox="0 0 1200 55" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M0 30 Q50 15,100 30 Q150 45,200 30 Q250 15,300 30 Q350 45,400 30 Q450 15,500 30 Q550 45,600 30 Q650 15,700 30 Q750 45,800 30 Q850 15,900 30 Q950 45,1000 30 Q1050 15,1100 30 Q1150 45,1200 30 L1200 55 L0 55Z" fill="rgba(2,136,209,0.08)"/>' +
                '<path d="M0 35 Q50 22,100 35 Q150 48,200 35 Q250 22,300 35 Q350 48,400 35 Q450 22,500 35 Q550 48,600 35 Q650 22,700 35 Q750 48,800 35 Q850 22,900 35 Q950 48,1000 35 Q1050 22,1100 35 Q1150 48,1200 35 L1200 55 L0 55Z" fill="rgba(2,136,209,0.05)"/>' +
            '</svg>';
        } else if (type === 'flowers') {
            /* Easter/Spring flower border at bottom */
            h = isMobile ? 30 : 40;
            svg = '<svg viewBox="0 0 1200 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
                '<rect x="0" y="32" width="1200" height="8" fill="rgba(129,199,132,0.1)"/>' +
                '<g opacity="0.35">' +
                    '<line x1="100" y1="32" x2="100" y2="12" stroke="#66BB6A" stroke-width="2"/><circle cx="100" cy="10" r="5" fill="#F48FB1"/><circle cx="100" cy="10" r="2" fill="#FFF59D"/>' +
                    '<line x1="250" y1="32" x2="250" y2="16" stroke="#66BB6A" stroke-width="2"/><circle cx="250" cy="14" r="4" fill="#90CAF9"/><circle cx="250" cy="14" r="1.5" fill="#FFF59D"/>' +
                    '<line x1="400" y1="32" x2="400" y2="10" stroke="#66BB6A" stroke-width="2"/><circle cx="400" cy="8" r="5" fill="#CE93D8"/><circle cx="400" cy="8" r="2" fill="#FFF59D"/>' +
                    '<line x1="550" y1="32" x2="550" y2="14" stroke="#66BB6A" stroke-width="2"/><circle cx="550" cy="12" r="4.5" fill="#F48FB1"/><circle cx="550" cy="12" r="1.8" fill="#FFF59D"/>' +
                    '<line x1="700" y1="32" x2="700" y2="8" stroke="#66BB6A" stroke-width="2"/><circle cx="700" cy="6" r="5" fill="#81C784"/><circle cx="700" cy="6" r="2" fill="#FFF59D"/>' +
                    '<line x1="850" y1="32" x2="850" y2="15" stroke="#66BB6A" stroke-width="2"/><circle cx="850" cy="13" r="4" fill="#90CAF9"/><circle cx="850" cy="13" r="1.5" fill="#FFF59D"/>' +
                    '<line x1="1000" y1="32" x2="1000" y2="11" stroke="#66BB6A" stroke-width="2"/><circle cx="1000" cy="9" r="5" fill="#F48FB1"/><circle cx="1000" cy="9" r="2" fill="#FFF59D"/>' +
                    '<line x1="1150" y1="32" x2="1150" y2="16" stroke="#66BB6A" stroke-width="2"/><circle cx="1150" cy="14" r="4" fill="#CE93D8"/><circle cx="1150" cy="14" r="1.5" fill="#FFF59D"/>' +
                '</g>' +
            '</svg>';
        } else {
            return;
        }

        el.style.height = h + 'px';
        el.innerHTML = svg;
        document.body.appendChild(el);
        state.creativeExtra.push(el);
    }

    /* ═══════════════════════════════════════════
       SIDE ACCENTS - Hanging decorations from
       the left/right edges of the viewport
    ═══════════════════════════════════════════ */
    function createSideAccents(type) {
        if (isMobile) return;

        if (type === 'icicles') {
            /* Winter icicles hanging from top-left and top-right */
            var icicleLeft = '<svg viewBox="0 0 30 180" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M5 0 L5 60 L2 90 L5 60" stroke="rgba(200,230,255,0.15)" stroke-width="2" fill="rgba(200,230,255,0.06)"/>' +
                '<path d="M15 0 L15 80 L12 120 L15 80" stroke="rgba(200,230,255,0.12)" stroke-width="1.5" fill="rgba(200,230,255,0.04)"/>' +
                '<path d="M25 0 L25 50 L22 75 L25 50" stroke="rgba(200,230,255,0.1)" stroke-width="1.5" fill="rgba(200,230,255,0.03)"/>' +
            '</svg>';
            ['left','right'].forEach(function(side) {
                var el = document.createElement('div');
                el.className = 'gb-side gb-side-' + side;
                el.style.width = '30px';
                el.style.height = '180px';
                el.innerHTML = icicleLeft;
                if (side === 'right') el.style.transform = 'scaleX(-1)';
                document.body.appendChild(el);
                state.creativeExtra.push(el);
            });
        } else if (type === 'hangingHearts') {
            /* Valentine's hearts hanging from top at specific positions */
            var positions = [{x:'8%',h:80},{x:'92%',h:100},{x:'5%',h:60},{x:'95%',h:70}];
            positions.forEach(function(pos) {
                var el = document.createElement('div');
                el.className = 'gb-placed';
                el.style.top = '0';
                el.style.left = pos.x;
                el.style.width = '2px';
                el.style.height = pos.h + 'px';
                el.style.background = 'linear-gradient(to bottom, rgba(233,30,99,0.15), rgba(233,30,99,0.05))';
                var heart = document.createElement('div');
                heart.style.cssText = 'position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);width:16px;height:16px';
                heart.innerHTML = buildSVG(HEART_SVG, '#E91E63');
                heart.querySelector('svg').style.cssText = 'width:100%;height:100%;opacity:0.35';
                el.appendChild(heart);
                document.body.appendChild(el);
                state.creativeExtra.push(el);
            });
        } else if (type === 'hangingLanterns') {
            /* Ramadan lanterns at specific positions along top edges */
            var positions = [{x:'6%',h:90},{x:'94%',h:75},{x:'3%',h:60},{x:'97%',h:85}];
            positions.forEach(function(pos) {
                var el = document.createElement('div');
                el.className = 'gb-placed';
                el.style.top = '0';
                el.style.left = pos.x;
                el.style.width = '1px';
                el.style.height = pos.h + 'px';
                el.style.background = 'rgba(184,134,11,0.12)';
                var lantern = document.createElement('div');
                lantern.style.cssText = 'position:absolute;bottom:-30px;left:50%;transform:translateX(-50%);width:18px;height:32px';
                lantern.innerHTML = LANTERN_SVG;
                lantern.querySelector('svg').style.cssText = 'width:100%;height:100%;opacity:0.4';
                el.appendChild(lantern);
                document.body.appendChild(el);
                state.creativeExtra.push(el);
            });
        }
    }

    /* ═══════════════════════════════════════════
       HERO RING - Decorative ring around the
       hero circle logo (.showcase-neon-circle)
    ═══════════════════════════════════════════ */
    function createHeroRing(type) {
        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (!heroCircle) return;
        heroCircle.style.overflow = 'visible';

        var ring = document.createElement('div');
        ring.className = 'gb-hero-ring gb-hero-ring-pulse';
        ring.style.width = '348px';
        ring.style.height = '348px';

        if (type === 'wreath') {
            ring.style.border = '3px solid rgba(46,125,50,0.2)';
            ring.style.boxShadow = '0 0 15px rgba(46,125,50,0.1), inset 0 0 15px rgba(46,125,50,0.05)';
        } else if (type === 'heartRing') {
            ring.style.border = '2px solid rgba(233,30,99,0.15)';
            ring.style.boxShadow = '0 0 20px rgba(233,30,99,0.08), inset 0 0 20px rgba(233,30,99,0.04)';
        } else if (type === 'frostRing') {
            ring.style.border = '2px solid rgba(100,180,246,0.15)';
            ring.style.boxShadow = '0 0 20px rgba(100,180,246,0.1), inset 0 0 20px rgba(100,180,246,0.05)';
        } else if (type === 'spookyRing') {
            ring.style.border = '2px solid rgba(255,111,0,0.15)';
            ring.style.boxShadow = '0 0 25px rgba(106,27,154,0.12), 0 0 15px rgba(255,111,0,0.08)';
        } else if (type === 'goldRing') {
            ring.style.border = '2px solid rgba(253,216,53,0.15)';
            ring.style.boxShadow = '0 0 20px rgba(253,216,53,0.1), inset 0 0 15px rgba(253,216,53,0.05)';
        } else if (type === 'fireRing') {
            ring.style.border = '2px solid rgba(255,23,68,0.15)';
            ring.style.boxShadow = '0 0 20px rgba(255,23,68,0.08), 0 0 10px rgba(255,214,0,0.06)';
        } else if (type === 'champagneRing') {
            ring.style.border = '2px solid rgba(255,215,0,0.2)';
            ring.style.boxShadow = '0 0 25px rgba(255,215,0,0.1), inset 0 0 15px rgba(255,215,0,0.06)';
        } else if (type === 'sunRing') {
            ring.style.border = '2px solid rgba(255,143,0,0.12)';
            ring.style.boxShadow = '0 0 20px rgba(255,143,0,0.08)';
        } else if (type === 'springRing') {
            ring.style.border = '2px solid rgba(129,199,132,0.15)';
            ring.style.boxShadow = '0 0 15px rgba(129,199,132,0.08), 0 0 10px rgba(244,143,177,0.06)';
        } else {
            return;
        }

        heroCircle.appendChild(ring);
        state.logoDeco.push(ring);
    }

    /* ═══════════════════════════════════════════
       CONFETTI - New Year one-shot burst
    ═══════════════════════════════════════════ */
    function createConfetti() {
        var wrap = document.createElement('div');
        wrap.className = 'gb-confetti-wrap';
        var count = isMobile ? 40 : 80;
        var colors = ['#FFD700', '#C0C0C0', '#f5e6cc', '#0D47A1', '#E91E63', '#fff', '#FF6F00', '#4CAF50'];

        for (var i = 0; i < count; i++) {
            var piece = document.createElement('div');
            piece.className = 'gb-conf';
            var color = colors[Math.floor(Math.random() * colors.length)];
            var left = rand(3, 97);
            var dur = rand(2.5, 5.5);
            var rot = rand(360, 1440);
            var delay = rand(0, 1);
            var shape = Math.random();

            piece.style.left = left + '%';
            piece.style.setProperty('--cd', dur.toFixed(1) + 's');
            piece.style.setProperty('--cr', rot.toFixed(0) + 'deg');
            piece.style.animationDelay = delay.toFixed(2) + 's';
            piece.style.background = color;

            if (shape < 0.25) {
                piece.style.width = rand(5, 9) + 'px';
                piece.style.height = piece.style.width;
                piece.style.borderRadius = '50%';
            } else if (shape < 0.5) {
                piece.style.width = rand(2, 4) + 'px';
                piece.style.height = rand(14, 22) + 'px';
                piece.style.borderRadius = '2px';
            } else if (shape < 0.75) {
                var s = rand(6, 10);
                piece.style.width = s + 'px';
                piece.style.height = s + 'px';
                piece.style.transform = 'rotate(45deg)';
            } else {
                piece.style.width = rand(7, 11) + 'px';
                piece.style.height = rand(4, 7) + 'px';
                piece.style.borderRadius = '1px';
            }

            wrap.appendChild(piece);
        }

        document.body.appendChild(wrap);
        state.creativeExtra.push(wrap);

        setTimeout(function() {
            if (wrap.parentNode) wrap.remove();
            var idx = state.creativeExtra.indexOf(wrap);
            if (idx > -1) state.creativeExtra.splice(idx, 1);
        }, 7000);
    }

    /* ═══════════════════════════════════════════
       CORNER ORNAMENTS
    ═══════════════════════════════════════════ */
    function createCorners(type) {
        var svg, size, pos;

        if (type === 'holly') {
            svg = HOLLY_SVG;
            size = isMobile ? 100 : 160;
            pos = { top: '0', left: '0' };
        } else if (type === 'cobweb') {
            svg = COBWEB_SVG;
            size = isMobile ? 120 : 200;
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

        // Mirror for right corner (cobweb only)
        if (type === 'cobweb') {
            var el2 = document.createElement('div');
            el2.className = 'gb-corner';
            el2.style.width = (size * 0.7) + 'px';
            el2.style.height = (size * 0.7) + 'px';
            el2.style.top = '0';
            el2.style.right = '0';
            el2.style.transform = 'scaleX(-1)';
            el2.innerHTML = svg;
            document.body.appendChild(el2);
            state.corners.push(el2);
        }
    }

    /* ═══════════════════════════════════════════
       LOGO NEON CIRCLE GLOW
    ═══════════════════════════════════════════ */
    function applyLogoGlow(theme) {
        if (!theme.neon) return;

        var heroCircle = document.querySelector('.showcase-neon-circle');
        if (heroCircle) {
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
       SANTA HAT
    ═══════════════════════════════════════════ */
    function addSantaHats() {
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
       CELEBRATION BANNER
       Premium themed announcement at top
    ═══════════════════════════════════════════ */
    function createBanner(theme) {
        if (state.banner) { state.banner.remove(); state.banner = null; }
        if (!theme.banner) return;
        try { if (sessionStorage.getItem('gb-banner-off') === state.id) return; } catch(e) {}

        var b = theme.banner;
        state.banner = document.createElement('div');
        state.banner.className = 'gb-banner';
        state.banner.style.background = b.bg;
        state.banner.style.color = b.color;

        state.banner.innerHTML =
            '<div class="gb-banner-icon">' + (b.icon || '') + '</div>' +
            '<div class="gb-banner-text">' + b.text + '</div>' +
            '<div class="gb-banner-sub">' + b.sub + '</div>' +
            '<div class="gb-banner-shine"></div>';

        document.body.appendChild(state.banner);

        // Auto-hide after 12 seconds
        setTimeout(function() {
            if (state.banner) {
                state.banner.style.animation = 'gb-bannerout 0.6s ease forwards';
                var ref = state.banner;
                setTimeout(function() { if (ref && ref.parentNode) ref.remove(); }, 600);
                state.banner = null;
                try { sessionStorage.setItem('gb-banner-off', state.id); } catch(e) {}
            }
        }, 12000);
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
        var list = Array.isArray(theme.creative) ? theme.creative : [theme.creative];
        list.forEach(function(c) {
            if (c === 'stringLights') createStringLights();
            else if (c === 'fog') createFog();
            else if (c === 'sunFlare') createSunFlare();
            else if (c === 'heatShimmer') createHeatShimmer();
            else if (c === 'confetti') createConfetti();
            else if (c === 'frost') createFrost();
            else if (c === 'rosePetals') createRosePetals();
            else if (c === 'butterflies') createButterflies();
            else if (c === 'sparkleField') createSparkleField();
            else if (c === 'neonFlash') createNeonFlash();
            else if (c === 'bottomGarland') createBottomScene('garland');
            else if (c === 'bottomGraveyard') createBottomScene('graveyard');
            else if (c === 'bottomWaves') createBottomScene('waves');
            else if (c === 'bottomFlowers') createBottomScene('flowers');
            else if (c === 'icicles') createSideAccents('icicles');
            else if (c === 'hangingHearts') createSideAccents('hangingHearts');
            else if (c === 'hangingLanterns') createSideAccents('hangingLanterns');
        });
    }

    function removeCreative() {
        state.creativeExtra.forEach(function(el) {
            if (el && el.parentNode) el.remove();
        });
        state.creativeExtra = [];
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

        /* 1. Logo glow */
        applyLogoGlow(theme);

        /* 2. SVG Particles */
        createParticles(theme);

        /* 3. Creative elements */
        createCreative(theme);

        /* 4. Corner ornaments */
        if (theme.corner) createCorners(theme.corner);

        /* 5. Atmosphere overlay */
        createAtmosphere(theme);

        /* 6. Hero ring decoration */
        if (theme.heroRing) createHeroRing(theme.heroRing);

        /* 7. Santa hat */
        if (theme.hat) addSantaHats();

        /* 7. Celebration banner */
        createBanner(theme);

        /* 8. Toast notification */
        createToast(theme);

        /* 9. Top border accent */
        createBorder(theme);

        /* 10. Nav accent line */
        createNavLine(theme);
    }

    function remove() {
        if (state.container) { state.container.remove(); state.container = null; }
        if (state.toast) { state.toast.remove(); state.toast = null; }
        if (state.border) { state.border.remove(); state.border = null; }
        if (state.banner) { state.banner.remove(); state.banner = null; }
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
