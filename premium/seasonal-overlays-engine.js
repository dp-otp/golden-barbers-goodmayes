/**
 * Golden Barbers – Seasonal Overlay Engine v2.0
 *
 * Campaign Composition System - Professional overlay placement
 * NO floating icons, NO tiny decorations, NO amateur look
 *
 * Architecture:
 * - LOGO: max 1 accent
 * - NAV-HANGERS: 2-3 elements hanging from nav bottom
 * - HERO-FG: Composed overlay set (foreground, dedicated space)
 * - SECONDARY: ONE of: MID (titles/cards) OR FOOTER trim
 */
(function() {
    'use strict';

    /* ═══════════════════════════════════════════
       STATE & CONFIG
    ═══════════════════════════════════════════ */
    var state = {
        elements: [],        // Tracked elements for cleanup
        styleEl: null,       // Injected <style> tag
        currentTheme: null
    };

    var isMobile = window.innerWidth < 768;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.addEventListener('resize', function() {
        isMobile = window.innerWidth < 768;
    });

    // Paths (relative to premium/ folder)
    var PROCESSED_PATH = '../processed-overlays/';
    var THEME_ASSETS_PATH = 'theme-assets/';

    /* ═══════════════════════════════════════════
       UTILITY FUNCTIONS
    ═══════════════════════════════════════════ */
    function trackEl(el) {
        state.elements.push(el);
        return el;
    }

    function createContainer(className) {
        var el = document.createElement('div');
        el.className = 'gb-con ' + (className || '');
        el.style.cssText = 'position:absolute;pointer-events:none;z-index:1;';
        return trackEl(el);
    }

    function createImage(src, size, className) {
        var wrapper = createContainer(className || '');
        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.draggable = false;
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;pointer-events:none;';
        wrapper.appendChild(img);
        wrapper.style.width = size + 'px';
        wrapper.style.height = size + 'px';
        return wrapper;
    }

    function hexToRgba(hex, alpha) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        var r = parseInt(hex.substr(0,2), 16);
        var g = parseInt(hex.substr(2,2), 16);
        var b = parseInt(hex.substr(4,2), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    /* ═══════════════════════════════════════════
       SVG STRUCTURAL ELEMENTS
    ═══════════════════════════════════════════ */
    var SVG_ELEMENTS = {
        // Hanging rod for nav decorations
        hangingRod: function(width, color) {
            return '<svg width="' + width + '" height="20" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                '<linearGradient id="rodGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                '<stop offset="0%" style="stop-color:' + color + ';stop-opacity:0.9"/>' +
                '<stop offset="50%" style="stop-color:#C9A24A;stop-opacity:1"/>' +
                '<stop offset="100%" style="stop-color:#8B7355;stop-opacity:0.8"/>' +
                '</linearGradient>' +
                '</defs>' +
                '<rect x="0" y="8" width="' + width + '" height="4" fill="url(#rodGrad)" rx="2"/>' +
                '</svg>';
        },

        // Thread/string for hanging elements
        hangingThread: function(length, color) {
            return '<svg width="2" height="' + length + '" xmlns="http://www.w3.org/2000/svg">' +
                '<line x1="1" y1="0" x2="1" y2="' + length + '" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
                '</svg>';
        },

        // Decorative plaque/badge for cards
        cardBadge: function(size, color) {
            return '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                '<linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" style="stop-color:' + color + ';stop-opacity:0.3"/>' +
                '<stop offset="100%" style="stop-color:#C9A24A;stop-opacity:0.2"/>' +
                '</linearGradient>' +
                '</defs>' +
                '<circle cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + (size/2-2) + '" fill="url(#badgeGrad)" stroke="' + color + '" stroke-width="2" opacity="0.7"/>' +
                '</svg>';
        },

        // Footer trim/border
        footerTrim: function(width, color) {
            return '<svg width="' + width + '" height="8" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                '<linearGradient id="trimGrad" x1="0%" y1="0%" x2="100%" y2="0%">' +
                '<stop offset="0%" style="stop-color:' + color + ';stop-opacity:0"/>' +
                '<stop offset="50%" style="stop-color:' + color + ';stop-opacity:0.6"/>' +
                '<stop offset="100%" style="stop-color:' + color + ';stop-opacity:0"/>' +
                '</linearGradient>' +
                '</defs>' +
                '<rect x="0" y="0" width="' + width + '" height="8" fill="url(#trimGrad)"/>' +
                '</svg>';
        },

        // Corner frame
        cornerFrame: function(size, color) {
            return '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M 0 ' + (size*0.2) + ' L 0 0 L ' + (size*0.2) + ' 0" stroke="' + color + '" stroke-width="3" fill="none" opacity="0.7"/>' +
                '<path d="M ' + (size*0.05) + ' ' + (size*0.25) + ' L ' + (size*0.05) + ' ' + (size*0.05) + ' L ' + (size*0.25) + ' ' + (size*0.05) + '" stroke="#C9A24A" stroke-width="2" fill="none" opacity="0.9"/>' +
                '</svg>';
        }
    };

    /* ═══════════════════════════════════════════
       PLACEMENT FUNCTIONS
    ═══════════════════════════════════════════ */

    // LOGO ACCENT (place on logo IMAGE, not the entire nav-logo)
    function placeLogo(logoConfig, accent, addGlow) {
        var logo = document.querySelector('.nav-logo');
        if (!logo) return;

        // Target the actual logo IMAGE, not the text
        var logoImg = logo.querySelector('img');
        if (!logoImg) return;

        // Support object config or plain string
        var cfg = typeof logoConfig === 'string' ? { src: logoConfig } : logoConfig;
        var imageSrc = cfg.src;

        var size = isMobile ? (cfg.sizeM || 24) : (cfg.size || 32);
        var hat = createImage(imageSrc, size, 'gb-logo-accent');

        // Positioning: use config overrides or default santa-hat style
        if (cfg.center) {
            // Centered on top (e.g. bunny ears)
            hat.style.cssText += 'top:' + (cfg.top || '-20px') + ';left:50%;transform:translateX(-50%);z-index:2;';
        } else {
            // Default: top-right, rotated (e.g. santa hat)
            hat.style.cssText += 'top:-18px;right:-12px;transform:scaleX(-1) rotate(15deg);z-index:2;';
        }

        // Add glow effect if requested (should be false for Christmas)
        if (addGlow) {
            hat.style.cssText += 'filter:drop-shadow(0 0 8px #ff0000) drop-shadow(0 0 12px #00ff00) drop-shadow(0 0 16px #ffd700);';
        }

        // Make logo image container relative
        logoImg.parentElement.style.position = 'relative';
        logoImg.style.position = 'relative';

        // Create wrapper for logo image to contain the hat
        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative;display:inline-block;';
        logoImg.parentNode.insertBefore(wrapper, logoImg);
        wrapper.appendChild(logoImg);
        wrapper.appendChild(hat);
    }

    // NAV HANGERS
    function placeNavHangers(images, accent) {
        var nav = document.querySelector('.nav') || document.querySelector('nav');
        if (!nav) return;

        var navRect = nav.getBoundingClientRect();
        var numHangers = images.length;
        var spacing = navRect.width / (numHangers + 1);

        // Create hanging rod
        var rod = createContainer('gb-nav-rod');
        rod.style.cssText += 'bottom:0;left:0;right:0;height:20px;';
        rod.innerHTML = SVG_ELEMENTS.hangingRod(navRect.width, accent);
        nav.style.position = 'relative';
        nav.appendChild(rod);

        // Place hangers
        for (var i = 0; i < numHangers; i++) {
            var x = spacing * (i + 1);
            var threadLen = isMobile ? 30 : 50;
            var hangerSize = isMobile ? 60 : 90;

            // Thread
            var thread = createContainer('gb-nav-thread');
            thread.style.cssText += 'bottom:-' + threadLen + 'px;left:' + x + 'px;width:2px;height:' + threadLen + 'px;';
            thread.innerHTML = SVG_ELEMENTS.hangingThread(threadLen, hexToRgba(accent, 0.6));
            nav.appendChild(thread);

            // Hanging element
            var hanger = createImage(images[i], hangerSize, 'gb-nav-hanger');
            hanger.style.cssText += 'bottom:-' + (threadLen + hangerSize/2) + 'px;left:' + (x - hangerSize/2) + 'px;';
            hanger.style.opacity = '0.85';

            // Subtle swing animation if motion allowed
            if (!reducedMotion) {
                hanger.style.animation = 'gb-swing-' + i + ' ' + (3 + i*0.5) + 's ease-in-out infinite';
            }

            nav.appendChild(hanger);
        }
    }

    // HERO FOREGROUND COMPOSITION
    function placeHeroComposition(config, accent) {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        var heroRect = hero.getBoundingClientRect();
        var container = createContainer('gb-hero-composition');
        container.style.cssText += 'top:0;left:0;width:100%;height:100%;z-index:5;';

        hero.style.position = 'relative';

        // Place main overlay(s) based on config
        config.overlays.forEach(function(overlay, idx) {
            // Skip if size is 0 (mobile hidden)
            var size = isMobile ? overlay.sizeMobile || 200 : overlay.size || 300;
            if (size === 0) return;

            var el;

            // Create SVG or Image element
            if (overlay.type === 'svg' && window.ChristmasSVGs && window.ChristmasSVGs[overlay.svg]) {
                el = createContainer('gb-hero-overlay-svg');
                el.innerHTML = window.ChristmasSVGs[overlay.svg](size);
                // Let SVG determine its own aspect ratio
                var svgEl = el.querySelector('svg');
                if (svgEl) {
                    el.style.width = svgEl.getAttribute('width') + 'px';
                    el.style.height = svgEl.getAttribute('height') + 'px';
                } else {
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                }
            } else {
                el = createImage(overlay.src, size, 'gb-hero-overlay');
            }

            // Position based on placement type
            var pos = overlay.position || 'top-right';
            var heroTitle = document.querySelector('.hero-title');
            var titleRect = heroTitle ? heroTitle.getBoundingClientRect() : null;

            switch(pos) {
                case 'top-right':
                    el.style.top = (overlay.offsetY || 0) + 'px';
                    el.style.right = (overlay.offsetX || 0) + 'px';
                    break;
                case 'bottom-right':
                    el.style.bottom = (overlay.offsetY || 0) + 'px';
                    el.style.right = (overlay.offsetX || 0) + 'px';
                    break;
                case 'bottom-left':
                    el.style.bottom = (overlay.offsetY || 0) + 'px';
                    el.style.left = (overlay.offsetX || 0) + 'px';
                    break;
                case 'top-left':
                    el.style.top = (overlay.offsetY || 0) + 'px';
                    el.style.left = (overlay.offsetX || 0) + 'px';
                    break;
                case 'bottom-center':
                    el.style.bottom = (overlay.offsetY || 0) + 'px';
                    el.style.left = '50%';
                    el.style.transform = 'translateX(-50%)';
                    break;
                case 'center-right':
                    el.style.top = '50%';
                    el.style.right = (overlay.offsetX || 0) + 'px';
                    el.style.transform = 'translateY(-50%)';
                    break;
                case 'title-left':
                    if (titleRect) {
                        el.style.top = (titleRect.top - heroRect.top - size * 0.3) + 'px';
                        el.style.left = '-' + (size * 0.4) + 'px';
                        el.style.zIndex = '-1';
                    }
                    break;
            }

            if (overlay.rotate) {
                el.style.transform = (el.style.transform || '') + ' rotate(' + overlay.rotate + 'deg)';
            }

            if (overlay.opacity) {
                el.style.opacity = overlay.opacity;
            }

            if (overlay.style) {
                el.style.cssText += overlay.style;
            }

            if (overlay.filter && el.querySelector('img')) {
                el.querySelector('img').style.filter = overlay.filter;
            }

            if (overlay.blendMode && el.querySelector('img')) {
                el.querySelector('img').style.mixBlendMode = overlay.blendMode;
            }

            // Apply clip-path to both container and IMG for circular logo
            if (overlay.style && overlay.style.indexOf('clip-path') !== -1) {
                el.style.clipPath = 'circle(50%)';
                el.style.webkitClipPath = 'circle(50%)';
                el.style.borderRadius = '50%';
                el.style.overflow = 'hidden';
                var img = el.querySelector('img');
                if (img) {
                    img.style.clipPath = 'circle(50%)';
                    img.style.webkitClipPath = 'circle(50%)';
                    img.style.borderRadius = '50%';
                }
            }

            container.appendChild(el);
        });

        hero.appendChild(container);
    }

    // MID - CARD BADGES (supports single object or array of badge configs)
    // Per-badge options: size, sizeMobile, offsetX, offsetY (positive = inward from corner)
    function placeCardBadges(config, accent) {
        var cards = document.querySelectorAll('.service-card');
        if (!cards.length) return;

        // Normalize: single object → array
        var badges = Array.isArray(config) ? config : [config];

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.style.position = 'relative';

            for (var j = 0; j < badges.length; j++) {
                var b = badges[j];
                var size = isMobile ? (b.sizeMobile || 30) : (b.size || 45);
                var ox = b.offsetX || 0;
                var oy = b.offsetY || 0;
                var badge = createImage(b.image, size, 'gb-card-badge');

                switch(b.position || 'bottom-right') {
                    case 'top-right':
                        badge.style.top = (-10 + oy) + 'px';
                        badge.style.right = (-10 + ox) + 'px';
                        break;
                    case 'top-left':
                        badge.style.top = (-10 + oy) + 'px';
                        badge.style.left = (-10 + ox) + 'px';
                        break;
                    case 'bottom-left':
                        badge.style.bottom = (-10 + oy) + 'px';
                        badge.style.left = (-10 + ox) + 'px';
                        break;
                    case 'bottom-right':
                        badge.style.bottom = (-10 + oy) + 'px';
                        badge.style.right = (-10 + ox) + 'px';
                        break;
                }

                badge.style.opacity = '0.7';
                card.appendChild(badge);
            }
        }
    }

    // FOOTER TRIM
    function placeFooterTrim(imageSrc, accent) {
        var footer = document.querySelector('.footer');
        if (!footer) return;

        footer.style.position = 'relative';

        var trim = createContainer('gb-footer-trim');
        trim.style.cssText += 'top:0;left:0;right:0;height:100px;opacity:0.4;';

        var img = document.createElement('img');
        img.src = imageSrc;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;';
        trim.appendChild(img);

        footer.insertBefore(trim, footer.firstChild);
    }

    // PRESENTS PLACEMENT (Gift Boxes) - Natural positioning
    function placePresents(presentsConfig) {
        if (!window.ChristmasSVGs) return;

        presentsConfig.forEach(function(config) {
            var size = isMobile ? config.sizeMobile || 70 : config.size || 100;
            var el = createContainer('gb-presents');
            el.innerHTML = ChristmasSVGs.giftBoxes(size);
            el.style.width = size * 1.3 + 'px';
            el.style.height = size + 'px';
            el.style.opacity = '0.9';

            var target, targetRect;

            switch(config.position) {
                case 'cards-bottom-left':
                    // Place naturally at bottom-left of service cards section
                    var cardsSection = document.querySelector('.services') || document.querySelector('.section');
                    if (cardsSection) {
                        cardsSection.style.position = 'relative';
                        el.style.bottom = '0px';
                        el.style.left = '0px';
                        el.style.transform = 'translateY(20%)';
                        cardsSection.appendChild(el);
                    }
                    break;

                case 'cta-bottom-right':
                    // Place naturally sitting beside CTA buttons
                    var ctaButtons = document.querySelector('.hero-buttons') || document.querySelector('.hero-cta');
                    if (ctaButtons) {
                        ctaButtons.style.position = 'relative';
                        el.style.bottom = '0px';
                        el.style.right = '-60px';
                        el.style.transform = 'translateY(30%)';
                        ctaButtons.appendChild(el);
                    }
                    break;

                case 'cta-section-left':
                    // Place on the left side of the "Ready for Your Best Look" CTA section
                    var ctaSection = document.querySelector('.cta');
                    if (ctaSection) {
                        ctaSection.style.position = 'relative';
                        ctaSection.style.overflow = 'hidden';
                        el.style.bottom = '10px';
                        el.style.left = '15px';
                        el.style.opacity = '0.85';
                        ctaSection.appendChild(el);
                    }
                    break;

                case 'cta-section-right':
                    // Place on the right side of the "Ready for Your Best Look" CTA section
                    var ctaSectionR = document.querySelector('.cta');
                    if (ctaSectionR) {
                        ctaSectionR.style.position = 'relative';
                        ctaSectionR.style.overflow = 'hidden';
                        el.style.bottom = '10px';
                        el.style.right = '15px';
                        el.style.opacity = '0.85';
                        ctaSectionR.appendChild(el);
                    }
                    break;
            }
        });
    }

    /* ═══════════════════════════════════════════
       THEME CONFIGURATIONS
    ═══════════════════════════════════════════ */
    var THEMES = {
        christmas: {
            logo: THEME_ASSETS_PATH + 'santa-hat.png',
            logoGlow: false,
            navHangers: [
                PROCESSED_PATH + 'christmas_ornament.png',
                PROCESSED_PATH + 'christmas_ornament.png',
                PROCESSED_PATH + 'christmas_ornament.png'
            ],
            tree: true,
            presents: [
                { position: 'cta-section-left', size: 150, sizeMobile: 80 },
                { position: 'cta-section-right', size: 150, sizeMobile: 80 }
            ],
            snow: true,
            cards: [
                { image: THEME_ASSETS_PATH + 'tw-gift.png', position: 'bottom-right', size: 48, sizeMobile: 30, offsetX: 0, offsetY: 0 },
                { image: THEME_ASSETS_PATH + 'tw-gift.png', position: 'bottom-right', size: 38, sizeMobile: 24, offsetX: 35, offsetY: 5 },
                { image: THEME_ASSETS_PATH + 'tw-gift.png', position: 'bottom-right', size: 30, sizeMobile: 18, offsetX: 10, offsetY: 30 }
            ]
        },

        valentines: {
            navHangers: [
                PROCESSED_PATH + 'valentines_hearts.png',
                THEME_ASSETS_PATH + 'heart.png',
                PROCESSED_PATH + 'valentines_hearts.png'
            ],
            hero: {
                overlays: [
                    { src: PROCESSED_PATH + 'floral_corner.png', size: 300, sizeMobile: 140, position: 'top-left', opacity: 0.8 },
                    { src: PROCESSED_PATH + 'floral_corner.png', size: 300, sizeMobile: 140, position: 'top-right', opacity: 0.8, style: 'transform:scaleX(-1);' },
                    { src: PROCESSED_PATH + 'cupid.png', size: 280, sizeMobile: 120, position: 'bottom-left', offsetX: 50, filter: 'hue-rotate(290deg) saturate(3)', opacity: 0.75 }
                ]
            },
            cards: [
                { image: THEME_ASSETS_PATH + 'heart.png', position: 'bottom-left' },
                { image: THEME_ASSETS_PATH + 'heart.png', position: 'bottom-right' }
            ]
        },

        halloween: {
            logo: THEME_ASSETS_PATH + 'witch-hat.png',
            navHangers: [
                PROCESSED_PATH + 'pumpkin.png',
                PROCESSED_PATH + 'pumpkin.png',
                PROCESSED_PATH + 'pumpkin.png'
            ],
            hero: {
                overlays: [
                    // Cobweb SVG - clean transparent corner web
                    { src: THEME_ASSETS_PATH + 'halloween-cobweb.svg', size: 700, sizeMobile: 260, position: 'top-left', offsetX: -40, offsetY: -40, opacity: 0.6 },
                    // Bats - massive, fill most of remaining hero space
                    { src: PROCESSED_PATH + 'bats.png', size: 600, sizeMobile: 220, position: 'top-right', offsetX: -20, offsetY: 20, opacity: 0.85 },
                    // Ghost kept smaller, behind bats
                    { src: PROCESSED_PATH + 'ghost.png', size: 250, sizeMobile: 150, position: 'bottom-right', offsetX: 10, offsetY: 10, opacity: 0.7 }
                ]
            },
            cards: { image: PROCESSED_PATH + 'pumpkin.png', position: 'bottom-left' }
        },

        easter: {
            logo: { src: THEME_ASSETS_PATH + 'easter-bunny-ears.svg', size: 70, sizeM: 50, center: true, top: '-32px' },
            navHangers: [
                THEME_ASSETS_PATH + 'easter-egg.png',
                THEME_ASSETS_PATH + 'bunny.png',
                THEME_ASSETS_PATH + 'easter-egg.png'
            ],
            hero: {
                overlays: [
                    { src: PROCESSED_PATH + 'easter_basket.png', size: 350, sizeMobile: 140, position: 'bottom-left', offsetY: -25, opacity: 0.85 },
                    { src: THEME_ASSETS_PATH + 'easter-egg.png', size: 500, sizeMobile: 150, position: 'bottom-right', offsetY: -30, offsetX: 0, opacity: 0.9 },
                    { src: PROCESSED_PATH + 'floral_corner.png', size: 200, sizeMobile: 120, position: 'top-left', opacity: 0.7 }
                ]
            },
            cards: [
                { image: THEME_ASSETS_PATH + 'easter-egg.png', position: 'bottom-left' },
                { image: THEME_ASSETS_PATH + 'easter-egg.png', position: 'bottom-right' }
            ]
        },

        summer: {
            navHangers: [
                THEME_ASSETS_PATH + 'surfboard-tropical.svg',
                THEME_ASSETS_PATH + 'sunglasses.png',
                THEME_ASSETS_PATH + 'surfboard-ocean.svg'
            ],
            hero: {
                overlays: [
                    { src: THEME_ASSETS_PATH + 'surfboard-tropical.svg', size: 500, sizeMobile: 200, position: 'bottom-center', offsetY: -30, opacity: 0.85, rotate: 90 }
                ]
            }
        },

        autumn: {
            navHangers: [
                THEME_ASSETS_PATH + 'autumn-leaf.svg',
                THEME_ASSETS_PATH + 'autumn-acorn.svg',
                THEME_ASSETS_PATH + 'autumn-mushroom.svg'
            ],
            hero: {
                overlays: [
                    { src: PROCESSED_PATH + 'autumn_leaves.png', size: 350, sizeMobile: 160, position: 'top-right', opacity: 0.85 },
                    { src: PROCESSED_PATH + 'autumn_leaves.png', size: 350, sizeMobile: 160, position: 'top-left', offsetY: 250, opacity: 0.9, style: 'transform:scaleX(-1);' }
                ]
            },
            footer: PROCESSED_PATH + 'autumn_leaves.png'
        },

        winter: {
            navHangers: [
                THEME_ASSETS_PATH + 'snowflake2.png',
                THEME_ASSETS_PATH + 'snowflake2.png',
                THEME_ASSETS_PATH + 'snowflake2.png'
            ],
            snow: true
        },

        ramadan: {
            navHangers: [
                THEME_ASSETS_PATH + 'ramadan-lantern.svg',
                THEME_ASSETS_PATH + 'ramadan-crescent.svg',
                THEME_ASSETS_PATH + 'ramadan-lantern.svg'
            ],
            // Islamic corners show on ALL pages
            allPagesOverlays: [
                { src: PROCESSED_PATH + 'islamic_corner.png', size: 280, sizeMobile: 160, position: 'top-left', opacity: 0.75, style: 'transform:scaleX(-1);' }
            ],
            cards: { image: THEME_ASSETS_PATH + 'ramadan-crescent.svg', position: 'top-right' }
        },

        eid: {
            navHangers: [
                THEME_ASSETS_PATH + 'eid-lantern.svg',
                THEME_ASSETS_PATH + 'eid-star.svg',
                THEME_ASSETS_PATH + 'eid-lantern.svg'
            ],
            // Islamic corners show on ALL pages
            allPagesOverlays: [
                { src: PROCESSED_PATH + 'islamic_corner.png', size: 300, sizeMobile: 180, position: 'top-right', opacity: 0.8 }
            ],
            hero: {
                overlays: [
                    { src: THEME_ASSETS_PATH + 'eid-mosque.svg', size: 900, sizeMobile: 340, position: 'bottom-center', offsetY: 0, opacity: 0.85, style: 'width:90%;max-width:900px;height:auto;aspect-ratio:240/157;' }
                ]
            },
            cards: { image: THEME_ASSETS_PATH + 'eid-star.svg', position: 'top-right' }
        },

        blackfriday: {
            navHangers: [
                THEME_ASSETS_PATH + 'bf-tag.svg',
                THEME_ASSETS_PATH + 'bf-bag.svg',
                THEME_ASSETS_PATH + 'bf-percent.svg'
            ],
            hero: {
                overlays: [
                    { src: PROCESSED_PATH + 'blackfriday_sale.png', size: 240, sizeMobile: 110, position: 'top-left', offsetX: -20, offsetY: -15, opacity: 0.85 }
                ]
            },
            footer: PROCESSED_PATH + 'blackfriday_sale.png',
            cards: { image: THEME_ASSETS_PATH + 'bf-tag.svg', position: 'bottom-left' }
        },

        newyear: {
            navHangers: [
                THEME_ASSETS_PATH + 'newyear-firework.svg',
                THEME_ASSETS_PATH + 'newyear-clock.svg',
                THEME_ASSETS_PATH + 'newyear-glass.svg'
            ],
            hero: {
                overlays: [
                    { src: THEME_ASSETS_PATH + 'newyear-firework.svg', size: 300, sizeMobile: 180, position: 'top-right', opacity: 0.8 }
                ]
            }
        }
    };

    /* ═══════════════════════════════════════════
       PUBLIC API
    ═══════════════════════════════════════════ */
    function cleanup() {
        // Remove all tracked elements
        state.elements.forEach(function(el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        state.elements = [];

        // Remove injected styles
        if (state.styleEl && state.styleEl.parentNode) {
            state.styleEl.parentNode.removeChild(state.styleEl);
            state.styleEl = null;
        }

        state.currentTheme = null;
        heroBannerEl = null;
    }

    function apply(themeId, accent) {
        cleanup();

        var theme = THEMES[themeId];
        if (!theme) return;

        state.currentTheme = themeId;

        // Inject animations CSS
        injectCSS(themeId, accent);

        // ALL PAGES (except adam): nav hangers + floor effects
        var isAdam = window.location.pathname.indexOf('adam') !== -1;

        if (theme.navHangers) {
            placeNavHangers(theme.navHangers, accent);
        }

        if (theme.snow && !isAdam) {
            placeSnowGround();
        }

        if (theme.tree && !isAdam) {
            placeChristmasTree();
        }

        // ALL PAGES: overlays marked for all pages (e.g. Islamic corners)
        if (theme.allPagesOverlays && theme.allPagesOverlays.length > 0) {
            var hero = document.querySelector('.hero');
            if (hero) {
                hero.style.position = 'relative';
                var apContainer = createContainer('gb-allpages-overlays');
                apContainer.style.cssText += 'top:0;left:0;width:100%;height:100%;z-index:5;';
                theme.allPagesOverlays.forEach(function(overlay) {
                    var size = isMobile ? overlay.sizeMobile || 200 : overlay.size || 300;
                    if (size === 0) return;
                    var el = createImage(overlay.src, size, 'gb-allpages-overlay');
                    var pos = overlay.position || 'top-right';
                    switch(pos) {
                        case 'top-right': el.style.top = (overlay.offsetY||0)+'px'; el.style.right = (overlay.offsetX||0)+'px'; break;
                        case 'top-left': el.style.top = (overlay.offsetY||0)+'px'; el.style.left = (overlay.offsetX||0)+'px'; break;
                        case 'bottom-right': el.style.bottom = (overlay.offsetY||0)+'px'; el.style.right = (overlay.offsetX||0)+'px'; break;
                        case 'bottom-left': el.style.bottom = (overlay.offsetY||0)+'px'; el.style.left = (overlay.offsetX||0)+'px'; break;
                    }
                    if (overlay.opacity) el.style.opacity = overlay.opacity;
                    if (overlay.style) el.style.cssText += overlay.style;
                    apContainer.appendChild(el);
                });
                hero.appendChild(apContainer);
            }
        }

        // HOMEPAGE ONLY: logo, hero overlays, cards, footer, presents, banner
        if (isHomePage()) {
            if (theme.logo) {
                placeLogo(theme.logo, accent, theme.logoGlow);
            }

            if (theme.hero) {
                placeHeroComposition(theme.hero, accent);
            }

            if (theme.cards) {
                placeCardBadges(theme.cards, accent);
            }

            if (theme.footer) {
                placeFooterTrim(theme.footer, accent);
            }

            if (theme.presents) {
                placePresents(theme.presents);
            }

            placeHeroBanner(themeId);
        }
    }

    // SNOW GROUND - Full-width snow strip at bottom of hero
    function placeSnowGround() {
        if (!window.ChristmasSVGs || !window.ChristmasSVGs.snowGround) return;

        var hero = document.querySelector('.hero');
        if (!hero) return;

        hero.style.position = 'relative';

        var snowContainer = createContainer('gb-snow-ground');
        snowContainer.style.bottom = '0';
        snowContainer.style.left = '0';
        snowContainer.style.width = '100%';
        snowContainer.style.height = '80px';
        snowContainer.style.zIndex = '7';
        snowContainer.style.overflow = 'hidden';

        var heroWidth = hero.offsetWidth || window.innerWidth;
        snowContainer.innerHTML = ChristmasSVGs.snowGround(heroWidth);
        var svg = snowContainer.querySelector('svg');
        if (svg) {
            svg.style.cssText = 'width:100%;height:100%;display:block;';
        }

        hero.appendChild(snowContainer);
    }

    // CHRISTMAS TREE - Direct placement on hero (bypasses composition container for reliable z-index)
    function placeChristmasTree() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        hero.style.position = 'relative';

        var size = isMobile ? 280 : 500;
        var treeEl = document.createElement('div');
        treeEl.className = 'gb-con gb-christmas-tree';
        treeEl.style.cssText = 'position:absolute;pointer-events:none;bottom:0;left:0;'
            + 'width:' + size + 'px;height:' + size + 'px;z-index:4;opacity:0.95;'
            + '-webkit-mask-image:linear-gradient(to top, black 50%, transparent 95%);'
            + 'mask-image:linear-gradient(to top, black 50%, transparent 95%);';

        var img = document.createElement('img');
        img.src = 'theme-assets/christmas-tree.png';
        img.alt = '';
        img.draggable = false;
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;pointer-events:none;';
        treeEl.appendChild(img);

        hero.appendChild(treeEl);
        trackEl(treeEl);
    }

    function injectCSS(themeId, accent) {
        var css = '.gb-con{position:absolute;pointer-events:none;z-index:1;}';

        // Swing animations for nav hangers (if motion allowed)
        if (!reducedMotion) {
            for (var i = 0; i < 3; i++) {
                css += '@keyframes gb-swing-' + i + '{' +
                    '0%,100%{transform:rotate(' + (-3 + i) + 'deg);}' +
                    '50%{transform:rotate(' + (3 - i) + 'deg);}' +
                '}';
            }
        }

        state.styleEl = document.createElement('style');
        state.styleEl.textContent = css;
        document.head.appendChild(state.styleEl);
    }

    /* ═══════════════════════════════════════════
       HERO BANNER SYSTEM
       Big, bold, uniquely shaped themed badge
       placed on the hero section.
       Desktop: right side of hero
       Mobile: replaces logo space (centered)
    ═══════════════════════════════════════════ */
    var HERO_BANNERS = {
        // CHRISTMAS - Ornament bauble (circle with gold cap)
        christmas: {
            emoji: '\uD83C\uDF84', welcome: 'Merry Christmas!', sub: 'From Golden Barbers',
            w: 320, h: 320, wM: 220, hM: 220,
            radius: '50%', clip: null,
            bg: 'radial-gradient(circle at 30% 25%, #43A047, #2E7D32 50%, #1B5E20)',
            border: '3px solid rgba(212,175,55,0.6)', glow: 'rgba(212,175,55,0.35)',
            textColor: '#fff', accentColor: '#FFD700',
            cap: true, // gold ornament cap at top
            decoSvg: '<svg viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg"><circle cx="105" cy="105" r="100" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1.5" stroke-dasharray="6 4"/><circle cx="35" cy="55" r="4" fill="#C62828" opacity="0.7"/><circle cx="175" cy="55" r="3.5" fill="#FFD700" opacity="0.6"/><circle cx="40" cy="160" r="3" fill="#FFD700" opacity="0.5"/><circle cx="170" cy="160" r="4" fill="#C62828" opacity="0.7"/></svg>'
        },
        // VALENTINE'S - Heart shape
        valentines: {
            emoji: '\u2764\uFE0F', welcome: "Valentine's!", sub: 'Look Sharp, Feel Loved',
            w: 320, h: 290, wM: 220, hM: 200,
            radius: '0', clip: 'polygon(50% 5%, 57% 0%, 72% 0%, 86% 9%, 96% 24%, 100% 40%, 95% 58%, 80% 74%, 64% 88%, 50% 100%, 36% 88%, 20% 74%, 5% 58%, 0% 40%, 4% 24%, 14% 9%, 28% 0%, 43% 0%)',
            bg: 'radial-gradient(circle at 45% 35%, #F48FB1, #E91E63 45%, #880E4F)',
            border: 'none', glow: 'rgba(233,30,99,0.35)',
            textColor: '#fff', accentColor: '#FCE4EC',
            decoSvg: '<svg viewBox="0 0 230 210" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="70" r="2" fill="#fff" opacity="0.3"/><circle cx="170" cy="70" r="2" fill="#fff" opacity="0.3"/><circle cx="85" cy="45" r="1.5" fill="#FCE4EC" opacity="0.4"/><circle cx="145" cy="45" r="1.5" fill="#FCE4EC" opacity="0.4"/></svg>'
        },
        // HALLOWEEN - Tombstone (rounded top, flat bottom)
        halloween: {
            emoji: '\uD83C\uDF83', welcome: 'Spooky Season!', sub: 'Dare to Look Sharp',
            w: 270, h: 330, wM: 185, hM: 225,
            radius: '100px 100px 12px 12px', clip: null,
            bg: 'radial-gradient(ellipse at 50% 30%, #FF8F00, #E65100 50%, #4A148C)',
            border: '3px solid rgba(255,111,0,0.45)', glow: 'rgba(255,111,0,0.3)',
            textColor: '#FFE0B2', accentColor: '#FFD600',
            decoSvg: '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg"><path d="M10 230 L10 90 Q100 -10 190 90 L190 230" fill="none" stroke="rgba(255,215,0,0.12)" stroke-width="1.5"/><circle cx="30" cy="200" r="2" fill="rgba(255,255,255,0.15)"/><circle cx="170" cy="200" r="2" fill="rgba(255,255,255,0.15)"/><line x1="20" y1="220" x2="180" y2="220" stroke="rgba(255,255,255,0.08)" stroke-width="1"/></svg>'
        },
        // EASTER - Egg shape (tall oval, asymmetric)
        easter: {
            emoji: '\uD83D\uDC23', welcome: 'Happy Easter!', sub: 'Spring into Style',
            w: 260, h: 330, wM: 180, hM: 225,
            radius: '50% 50% 50% 50% / 60% 60% 40% 40%', clip: null,
            bg: 'radial-gradient(ellipse at 50% 35%, #C8E6C9, #81C784 35%, #66BB6A 60%, #F48FB1)',
            border: '3px solid rgba(255,255,255,0.3)', glow: 'rgba(129,199,132,0.25)',
            textColor: '#1B5E20', accentColor: '#E91E63',
            decoSvg: '<svg viewBox="0 0 180 230" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="90" x2="160" y2="90" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 6"/><line x1="15" y1="140" x2="165" y2="140" stroke="rgba(244,143,177,0.2)" stroke-width="1" stroke-dasharray="4 6"/><circle cx="35" cy="75" r="3" fill="#F48FB1" opacity="0.35"/><circle cx="145" cy="75" r="3" fill="#FFF59D" opacity="0.35"/><circle cx="50" cy="175" r="2.5" fill="#CE93D8" opacity="0.3"/><circle cx="130" cy="175" r="2.5" fill="#F48FB1" opacity="0.3"/></svg>'
        },
        // SUMMER - Surfboard (tall narrow pill)
        summer: {
            emoji: '\u2600\uFE0F', welcome: 'Summer Vibes!', sub: 'Stay Fresh, Stay Cool',
            w: 200, h: 330, wM: 140, hM: 225,
            radius: '80px', clip: null,
            bg: 'linear-gradient(180deg, #FFCA28 0%, #FF8F00 40%, #0277BD 80%, #01579B 100%)',
            border: '3px solid rgba(255,255,255,0.25)', glow: 'rgba(255,143,0,0.3)',
            textColor: '#fff', accentColor: '#FFD600',
            decoSvg: '<svg viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg"><line x1="80" y1="20" x2="80" y2="240" stroke="rgba(255,255,255,0.08)" stroke-width="2"/><line x1="20" y1="100" x2="140" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1"/><line x1="25" y1="160" x2="135" y2="160" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></svg>'
        },
        // AUTUMN - Shield/crest (pointed bottom)
        autumn: {
            emoji: '\uD83C\uDF42', welcome: 'Autumn Vibes!', sub: 'Warm Cuts, Cozy Style',
            w: 270, h: 330, wM: 185, hM: 225,
            radius: '0', clip: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)',
            bg: 'radial-gradient(ellipse at 50% 30%, #FF8A65, #DD2C00 45%, #BF360C)',
            border: 'none', glow: 'rgba(221,44,0,0.25)',
            textColor: '#FFF3E0', accentColor: '#FFAB91',
            decoSvg: '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg"><polygon points="100,230 5,168 5,5 195,5 195,168" fill="none" stroke="rgba(255,171,145,0.18)" stroke-width="2"/><line x1="100" y1="10" x2="100" y2="225" stroke="rgba(255,171,145,0.08)" stroke-width="1"/></svg>'
        },
        // WINTER - Hexagonal snowflake
        winter: {
            emoji: '\u2744\uFE0F', welcome: 'Winter Warmth!', sub: 'Hot Cuts, Cool Style',
            w: 320, h: 320, wM: 220, hM: 220,
            radius: '0',
            clip: 'polygon(50% 0%, 57% 18%, 75% 6%, 72% 27%, 93% 25%, 82% 42%, 100% 50%, 82% 58%, 93% 75%, 72% 73%, 75% 94%, 57% 82%, 50% 100%, 43% 82%, 25% 94%, 28% 73%, 7% 75%, 18% 58%, 0% 50%, 18% 42%, 7% 25%, 28% 27%, 25% 6%, 43% 18%)',
            bg: 'radial-gradient(circle at 40% 30%, #E3F2FD, #4FC3F7 35%, #01579B)',
            border: 'none', glow: 'rgba(79,195,247,0.3)',
            textColor: '#01579B', accentColor: '#E1F5FE',
            decoSvg: '<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg"><line x1="160" y1="6" x2="160" y2="314" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/><line x1="27" y1="83" x2="293" y2="237" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/><line x1="27" y1="237" x2="293" y2="83" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/><line x1="112" y1="6" x2="208" y2="314" stroke="rgba(255,255,255,0.04)" stroke-width="1"/><line x1="208" y1="6" x2="112" y2="314" stroke="rgba(255,255,255,0.04)" stroke-width="1"/><line x1="27" y1="131" x2="293" y2="189" stroke="rgba(255,255,255,0.04)" stroke-width="1"/><line x1="27" y1="189" x2="293" y2="131" stroke="rgba(255,255,255,0.04)" stroke-width="1"/><circle cx="160" cy="160" r="32" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/></svg>'
        },
        // RAMADAN - Lantern (dome top, narrow body)
        ramadan: {
            emoji: '\u262A\uFE0F', welcome: 'Ramadan Kareem!', sub: 'From Golden Barbers',
            w: 220, h: 340, wM: 155, hM: 235,
            radius: '50% 50% 8px 8px', clip: null,
            bg: 'linear-gradient(180deg, #4A148C 0%, #311B92 30%, #1A237E 60%, #0D1042 100%)',
            border: '3px solid rgba(184,134,11,0.45)', glow: 'rgba(156,39,176,0.3)',
            textColor: '#E8EAF6', accentColor: '#B8860B',
            decoSvg: '<svg viewBox="0 0 170 260" xmlns="http://www.w3.org/2000/svg"><path d="M10 250 L10 100 Q85 -5 160 100 L160 250" fill="none" stroke="rgba(184,134,11,0.2)" stroke-width="1.5"/><path d="M25 245 L25 108 Q85 8 145 108 L145 245" fill="none" stroke="rgba(156,39,176,0.12)" stroke-width="1"/><circle cx="85" cy="28" r="8" fill="none" stroke="rgba(184,134,11,0.25)" stroke-width="1.5"/><path d="M81 26 Q85 19 89 26" fill="rgba(184,134,11,0.25)"/><circle cx="40" cy="200" r="1.5" fill="rgba(184,134,11,0.2)"/><circle cx="130" cy="200" r="1.5" fill="rgba(184,134,11,0.2)"/><circle cx="85" cy="130" r="25" fill="none" stroke="rgba(156,39,176,0.06)" stroke-width="1"/></svg>'
        },
        // EID - Ornate dome arch
        eid: {
            emoji: '\u2728', welcome: 'Eid Mubarak!', sub: 'Celebrate in Style',
            w: 260, h: 340, wM: 180, hM: 235,
            radius: '50% 50% 12px 12px', clip: null,
            bg: 'radial-gradient(ellipse at 50% 25%, #FFF9C4, #FFD700 30%, #2E7D32 70%, #1B5E20)',
            border: '3px solid rgba(255,215,0,0.4)', glow: 'rgba(255,215,0,0.25)',
            textColor: '#FFF9C4', accentColor: '#FFD700',
            decoSvg: '<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><path d="M 10 250 L 10 100 Q 100 -5 190 100 L 190 250" fill="none" stroke="rgba(255,215,0,0.15)" stroke-width="1.5"/><path d="M 30 245 L 30 110 Q 100 15 170 110 L 170 245" fill="none" stroke="rgba(255,215,0,0.08)" stroke-width="1"/><rect x="18" y="170" width="164" height="1" fill="rgba(255,215,0,0.1)"/><rect x="18" y="200" width="164" height="1" fill="rgba(255,215,0,0.08)"/><circle cx="100" cy="45" r="3" fill="rgba(255,215,0,0.2)"/><circle cx="100" cy="45" r="8" fill="none" stroke="rgba(255,215,0,0.1)" stroke-width="0.8"/></svg>'
        },
        // BLACK FRIDAY - Angled bold rectangle (skewed)
        blackfriday: {
            emoji: '\uD83D\uDCB0', welcome: 'BLACK FRIDAY!', sub: 'Mega Deals Inside',
            w: 350, h: 200, wM: 240, hM: 140,
            radius: '6px', clip: null,
            bg: 'linear-gradient(135deg, #212121 0%, #111 50%, #1a0000 100%)',
            border: '3px solid rgba(255,23,68,0.6)', glow: 'rgba(255,23,68,0.4)',
            textColor: '#FFD600', accentColor: '#FF1744',
            skew: '-3deg',
            decoSvg: '<svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="268" height="148" rx="4" fill="none" stroke="rgba(255,23,68,0.2)" stroke-width="1.5" stroke-dasharray="10 5"/><rect x="12" y="12" width="256" height="136" rx="3" fill="none" stroke="rgba(255,214,0,0.1)" stroke-width="1"/></svg>'
        },
        // NEW YEAR - Starburst (12-point star)
        newyear: {
            emoji: '\uD83C\uDF89', welcome: 'Happy New Year!', sub: 'New Year, New Look',
            w: 320, h: 320, wM: 220, hM: 220,
            radius: '0', clip: 'polygon(50% 0%,58% 20%,75% 3%,72% 25%,97% 18%,82% 38%,100% 50%,82% 62%,97% 82%,72% 75%,75% 97%,58% 80%,50% 100%,42% 80%,25% 97%,28% 75%,3% 82%,18% 62%,0% 50%,18% 38%,3% 18%,28% 25%,25% 3%,42% 20%)',
            bg: 'radial-gradient(circle at 50% 45%, #FFFDE7, #FFD700 30%, #0D47A1)',
            border: 'none', glow: 'rgba(255,215,0,0.35)',
            textColor: '#0D47A1', accentColor: '#FFD700',
            decoSvg: '<svg viewBox="0 0 230 230" xmlns="http://www.w3.org/2000/svg"><circle cx="115" cy="115" r="55" fill="none" stroke="rgba(13,71,161,0.1)" stroke-width="1.5"/></svg>'
        }
    };

    var currentDiscount = null;
    var heroBannerEl = null;
    var heroBannerStringEl = null;

    function placeHeroBanner(themeId) {
        removeHeroBanner();

        var cfg = HERO_BANNERS[themeId];
        if (!cfg) return;

        var hero = document.querySelector('.hero');
        if (!hero) return;
        hero.style.position = 'relative';

        var isDiscount = currentDiscount && currentDiscount.active && currentDiscount.text;

        // Scale badge down so it doesn't overpower the original hero
        var scale = isMobile ? 0.45 : 0.9;
        var w = Math.round((isMobile ? cfg.wM : cfg.w) * scale);
        var h = Math.round((isMobile ? cfg.hM : cfg.h) * scale);

        var badge = document.createElement('div');
        badge.id = 'gb-hero-banner';

        // Position: top-right on desktop, tag style on mobile (lower + inset for breathing room)
        var posCSS = isMobile
            ? 'position:absolute;top:18%;right:4%;z-index:15;'
            : 'position:absolute;top:12%;right:4%;z-index:15;';

        var shapeCSS = 'border-radius:' + (cfg.radius || '0') + ';';
        if (cfg.clip) shapeCSS += 'clip-path:' + cfg.clip + ';-webkit-clip-path:' + cfg.clip + ';';

        badge.style.cssText = posCSS
            + 'width:' + w + 'px;height:' + h + 'px;'
            + shapeCSS
            + 'overflow:visible;display:flex;flex-direction:column;align-items:center;justify-content:center;'
            + 'text-align:center;pointer-events:auto;cursor:default;'
            + 'background:' + cfg.bg + ';'
            + (cfg.border !== 'none' ? 'border:' + cfg.border + ';' : '')
            + 'box-shadow:0 0 50px ' + cfg.glow + ',0 10px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.12);'
            + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
            + (cfg.skew ? 'transform:skew(' + cfg.skew + ');' : '')
            + 'opacity:0;';

        // Ornament cap (Christmas only)
        if (cfg.cap) {
            var cap = document.createElement('div');
            cap.style.cssText = 'position:absolute;top:-12px;left:50%;transform:translateX(-50%);'
                + 'width:22px;height:16px;background:linear-gradient(180deg,#FFD700,#B8860B);'
                + 'border-radius:4px 4px 2px 2px;z-index:3;'
                + 'box-shadow:0 -2px 6px rgba(212,175,55,0.4);';
            var ring = document.createElement('div');
            ring.style.cssText = 'position:absolute;top:-10px;left:50%;transform:translateX(-50%);'
                + 'width:14px;height:12px;border:2px solid #FFD700;border-radius:50%;background:transparent;z-index:4;';
            badge.appendChild(cap);
            badge.appendChild(ring);
        }

        // Decorative SVG layer
        if (cfg.decoSvg) {
            var decoWrap = document.createElement('div');
            decoWrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;'
                + (cfg.clip ? 'clip-path:' + cfg.clip + ';-webkit-clip-path:' + cfg.clip + ';' : 'border-radius:' + (cfg.radius || '0') + ';');
            decoWrap.innerHTML = cfg.decoSvg;
            badge.appendChild(decoWrap);
        }

        // Shimmer
        var shimmer = document.createElement('div');
        shimmer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;'
            + (cfg.clip ? 'clip-path:' + cfg.clip + ';-webkit-clip-path:' + cfg.clip + ';' : 'border-radius:' + (cfg.radius || '0') + ';')
            + 'background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.1) 50%,transparent 60%);'
            + 'background-size:300% 100%;animation:gbHBShimmer 4s ease-in-out infinite;';
        badge.appendChild(shimmer);

        // Content
        var content = document.createElement('div');
        content.style.cssText = 'position:relative;z-index:2;padding:' + (isMobile ? '10px' : '16px') + ';display:flex;flex-direction:column;align-items:center;gap:4px;'
            + (cfg.skew ? 'transform:skew(' + (parseFloat(cfg.skew) * -1) + 'deg);' : '');

        if (isDiscount) {
            var label = document.createElement('div');
            label.style.cssText = 'font-size:' + (isMobile ? '9px' : '11px') + ';text-transform:uppercase;letter-spacing:1.5px;opacity:0.8;font-weight:600;color:' + cfg.textColor + ';';
            label.textContent = cfg.emoji + ' Limited Offer';
            content.appendChild(label);

            var mainText = document.createElement('div');
            mainText.style.cssText = 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:900;color:' + cfg.textColor + ';line-height:1.2;'
                + 'text-shadow:0 2px 8px rgba(0,0,0,0.3);max-width:' + (w - 30) + 'px;';
            mainText.textContent = currentDiscount.text;
            content.appendChild(mainText);

            if (currentDiscount.code) {
                var codeBadge = document.createElement('div');
                codeBadge.style.cssText = 'margin-top:3px;padding:4px 12px;border-radius:20px;font-size:' + (isMobile ? '10px' : '12px') + ';'
                    + 'font-weight:800;letter-spacing:1.5px;cursor:pointer;pointer-events:auto;'
                    + 'background:rgba(0,0,0,0.25);color:' + cfg.textColor + ';border:1px solid rgba(255,255,255,0.2);'
                    + 'backdrop-filter:blur(4px);transition:all 0.2s;';
                codeBadge.textContent = currentDiscount.code.toUpperCase();
                codeBadge.title = 'Click to copy';
                codeBadge.onclick = function() {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(currentDiscount.code.toUpperCase());
                        codeBadge.textContent = 'COPIED!';
                        var origC = currentDiscount.code.toUpperCase();
                        setTimeout(function() { codeBadge.textContent = origC; }, 1500);
                    }
                };
                content.appendChild(codeBadge);
            }
        } else {
            var emojiEl = document.createElement('div');
            emojiEl.textContent = cfg.emoji;
            emojiEl.style.cssText = 'font-size:' + (isMobile ? '24px' : '32px') + ';filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));line-height:1;';
            if (!reducedMotion) emojiEl.style.animation = 'gbHBPulse 3s ease infinite';
            content.appendChild(emojiEl);

            var welcomeText = document.createElement('div');
            welcomeText.style.cssText = 'font-size:' + (isMobile ? '14px' : '18px') + ';font-weight:900;color:' + cfg.textColor + ';line-height:1.15;'
                + 'text-shadow:0 2px 8px rgba(0,0,0,0.25);max-width:' + (w - 20) + 'px;';
            welcomeText.textContent = cfg.welcome;
            content.appendChild(welcomeText);

            var subText = document.createElement('div');
            subText.style.cssText = 'font-size:' + (isMobile ? '9px' : '11px') + ';font-weight:600;color:' + cfg.accentColor + ';'
                + 'text-transform:uppercase;letter-spacing:1px;opacity:0.85;margin-top:2px;';
            subText.textContent = cfg.sub;
            content.appendChild(subText);
        }

        badge.appendChild(content);

        // Inject CSS animations once
        if (!document.getElementById('gb-hb-css')) {
            var style = document.createElement('style');
            style.id = 'gb-hb-css';
            style.textContent = '@keyframes gbHBShimmer{0%{background-position:200% 0}50%{background-position:-200% 0}100%{background-position:200% 0}}'
                + '@keyframes gbHBPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}'
                + '@keyframes gbHBFloat{0%,100%{transform:VAR translateY(0)}50%{transform:VAR translateY(-8px)}}'
                + '@keyframes gbHBIn{from{opacity:0;transform:VAR scale(0.6)}to{opacity:1;transform:VAR scale(1)}}';
            document.head.appendChild(style);
        }

        // Mobile: slight tilt for tag feel
        var mobileRotate = isMobile ? 'rotate(3deg) ' : '';

        // Animate in
        var skewT = cfg.skew ? 'skew(' + cfg.skew + ') ' : '';
        badge.style.animation = 'none';
        badge.offsetHeight; // force reflow
        badge.style.transition = 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s';
        badge.style.opacity = '1';
        badge.style.transform = mobileRotate + skewT + 'scale(1)';

        // Gentle float after entrance
        if (!reducedMotion) {
            setTimeout(function() {
                if (badge.parentNode) {
                    badge.style.transition = 'none';
                    var floatCSS = '@keyframes gbHBFloatLive{0%,100%{transform:' + mobileRotate + skewT + 'translateY(0)}50%{transform:' + mobileRotate + skewT + 'translateY(-5px)}}';
                    var liveStyle = document.getElementById('gb-hb-live');
                    if (liveStyle) liveStyle.remove();
                    liveStyle = document.createElement('style');
                    liveStyle.id = 'gb-hb-live';
                    liveStyle.textContent = floatCSS;
                    document.head.appendChild(liveStyle);
                    badge.style.animation = 'gbHBFloatLive 4s ease-in-out infinite';
                }
            }, 1200);
        }

        hero.appendChild(badge);
        heroBannerEl = badge;
        trackEl(badge);

        // Golden thread from neon circle to badge (mobile only)
        // Uses real DOM measurements after double-rAF to guarantee layout+paint
        if (isMobile) {
            var _hero = hero;
            var _w = w;
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    placeGoldenThread(_hero, _w);
                });
            });
        }

    }

    // Standalone golden thread — measures actual DOM positions after render
    function placeGoldenThread(hero, badgeW) {
        try {
            var neonEl = document.querySelector('.showcase-neon-circle');
            var badgeEl = document.getElementById('gb-hero-banner');
            if (!neonEl || !badgeEl || !hero) return;

            var heroRect = hero.getBoundingClientRect();
            var neonRect = neonEl.getBoundingClientRect();

            // Neon circle center + radius in hero-relative coords
            var ncx = neonRect.left + neonRect.width / 2 - heroRect.left;
            var ncy = neonRect.top + neonRect.height / 2 - heroRect.top;
            var nr = neonRect.width / 2;

            // Badge eyelet: top-right area, offset inward ~28% from right edge
            // Use CSS values (badge may still be animating scale)
            var heroW = hero.offsetWidth;
            var heroH = hero.offsetHeight;
            var bLeft = heroW - heroW * 0.04 - badgeW;
            var bTop = heroH * 0.18;
            var eyeletOff = Math.round(badgeW * 0.28);
            var endX = bLeft + badgeW - eyeletOff;
            var endY = bTop;

            // Thread starts at neon circle edge, angled toward badge but offset upward
            var dirAng = Math.atan2(endY - ncy, endX - ncx);
            var attachAng = dirAng - 0.6; // ~35deg upward offset
            var startX = ncx + nr * Math.cos(attachAng);
            var startY = ncy + nr * Math.sin(attachAng);

            // Tight bounding box
            var pad = 30;
            var L = Math.floor(Math.min(startX, endX) - pad);
            var T = Math.floor(Math.min(startY, endY) - pad);
            var R = Math.ceil(Math.max(startX, endX) + pad);
            var B = Math.ceil(Math.max(startY, endY) + pad + 45);
            var W = R - L;
            var H = B - T;

            // SVG-local coords
            var sx = Math.round(startX - L);
            var sy = Math.round(startY - T);
            var ex = Math.round(endX - L);
            var ey = Math.round(endY - T);

            // Natural asymmetric sag — not a perfect arc
            var sag = Math.max(sy, ey) + 30;
            var c1x = Math.round(sx + (ex - sx) * 0.22 + 4);
            var c1y = Math.round(sag + 6);
            var c2x = Math.round(sx + (ex - sx) * 0.7);
            var c2y = Math.round(sag - 8);

            var gid = 'gt' + Date.now();
            var d = 'M' + sx + ' ' + sy + ' C' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + ex + ' ' + ey;

            // 3-layer SVG: shadow, gold gradient, highlight
            var svg = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'
                + '<defs><linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" '
                + 'x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '">'
                + '<stop offset="0%" stop-color="#B8860B"/>'
                + '<stop offset="20%" stop-color="#FFD700"/>'
                + '<stop offset="40%" stop-color="#DAA520"/>'
                + '<stop offset="60%" stop-color="#FFCC00"/>'
                + '<stop offset="80%" stop-color="#B8860B"/>'
                + '<stop offset="100%" stop-color="#DAA520"/>'
                + '</linearGradient></defs>'
                + '<path d="' + d + '" stroke="rgba(50,35,5,0.25)" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
                + '<path d="' + d + '" stroke="url(#' + gid + ')" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
                + '<path d="' + d + '" stroke="rgba(255,240,170,0.35)" stroke-width="0.5" fill="none" stroke-linecap="round"/>'
                + '</svg>';

            var el = document.createElement('div');
            el.style.cssText = 'position:absolute;left:' + L + 'px;top:' + T + 'px;'
                + 'width:' + W + 'px;height:' + H + 'px;'
                + 'pointer-events:none;z-index:14;';
            el.innerHTML = svg;
            hero.appendChild(el);
            trackEl(el);
            heroBannerStringEl = el;

            // Gold eyelet dot at the badge connection point
            var ey2 = document.createElement('div');
            ey2.style.cssText = 'position:absolute;'
                + 'left:' + Math.round(endX - 5) + 'px;top:' + Math.round(endY - 5) + 'px;'
                + 'width:10px;height:10px;border-radius:50%;'
                + 'border:2px solid #DAA520;z-index:16;pointer-events:none;'
                + 'background:radial-gradient(circle at 35% 35%,rgba(255,223,100,0.5),rgba(139,105,20,0.7));'
                + 'box-shadow:0 0 4px rgba(218,165,32,0.3),inset 0 1px 2px rgba(255,255,255,0.3);';
            hero.appendChild(ey2);
            trackEl(ey2);
        } catch (e) {
            // Silently fail — thread is decorative only
        }
    }

    function removeHeroBanner() {
        if (heroBannerEl && heroBannerEl.parentNode) {
            heroBannerEl.parentNode.removeChild(heroBannerEl);
        }
        heroBannerEl = null;
        if (heroBannerStringEl && heroBannerStringEl.parentNode) {
            heroBannerStringEl.parentNode.removeChild(heroBannerStringEl);
        }
        heroBannerStringEl = null;
        var liveStyle = document.getElementById('gb-hb-live');
        if (liveStyle) liveStyle.remove();
    }

    function isHomePage() {
        var p = window.location.pathname;
        return p.endsWith('/') || p.endsWith('/index.html') || p.endsWith('/premium/') || p.endsWith('/premium');
    }

    function updateDiscount(discountData) {
        currentDiscount = discountData;
        if (state.currentTheme && isHomePage()) {
            placeHeroBanner(state.currentTheme);
        }
    }

    // Expose API
    window.GBSeasonalOverlays = {
        apply: apply,
        cleanup: cleanup,
        updateDiscount: updateDiscount,
        version: '2.2'
    };

})();
