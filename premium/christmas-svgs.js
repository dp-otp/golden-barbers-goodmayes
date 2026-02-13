/**
 * Professional Christmas SVG Elements v2
 * Premium 3D designs with rich gradients, depth, and natural styling
 */

var ChristmasSVGs = {

    // Realistic Candy Cane with stripes and shine
    candyCane: function(size) {
        var w = size;
        var h = size * 1.5;
        return '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150">' +
            '<defs>' +
            '<linearGradient id="candyWhite" x1="0%" y1="0%" x2="100%" y2="0%">' +
            '<stop offset="0%" style="stop-color:#ffffff;stop-opacity:1"/>' +
            '<stop offset="50%" style="stop-color:#f5f5f5;stop-opacity:1"/>' +
            '<stop offset="100%" style="stop-color:#e8e8e8;stop-opacity:1"/>' +
            '</linearGradient>' +
            '<linearGradient id="candyRed" x1="0%" y1="0%" x2="100%" y2="0%">' +
            '<stop offset="0%" style="stop-color:#d32f2f;stop-opacity:1"/>' +
            '<stop offset="50%" style="stop-color:#c62828;stop-opacity:1"/>' +
            '<stop offset="100%" style="stop-color:#b71c1c;stop-opacity:1"/>' +
            '</linearGradient>' +
            '</defs>' +
            '<path d="M 30 15 Q 20 15 20 25 Q 20 35 30 35" fill="url(#candyRed)" stroke="#8b0000" stroke-width="1.5"/>' +
            '<path d="M 30 20 Q 25 20 25 25 Q 25 30 30 30" fill="url(#candyWhite)" stroke="#cccccc" stroke-width="1"/>' +
            '<rect x="27" y="35" width="6" height="20" fill="url(#candyRed)" stroke="#8b0000" stroke-width="1"/>' +
            '<rect x="27" y="55" width="6" height="15" fill="url(#candyWhite)" stroke="#cccccc" stroke-width="0.5"/>' +
            '<rect x="27" y="70" width="6" height="20" fill="url(#candyRed)" stroke="#8b0000" stroke-width="1"/>' +
            '<rect x="27" y="90" width="6" height="15" fill="url(#candyWhite)" stroke="#cccccc" stroke-width="0.5"/>' +
            '<rect x="27" y="105" width="6" height="20" fill="url(#candyRed)" stroke="#8b0000" stroke-width="1"/>' +
            '<rect x="27" y="125" width="6" height="15" fill="url(#candyWhite)" stroke="#cccccc" stroke-width="0.5"/>' +
            '<ellipse cx="29" cy="50" rx="1.5" ry="8" fill="#ffffff" opacity="0.4"/>' +
            '<ellipse cx="29" cy="85" rx="1.5" ry="8" fill="#ffffff" opacity="0.4"/>' +
            '<ellipse cx="29" cy="115" rx="1.5" ry="8" fill="#ffffff" opacity="0.4"/>' +
            '</svg>';
    },

    // REALISTIC Natural Christmas Tree - organic conifer shape like a real Noble Fir
    christmasTree: function(size) {
        var uid = 'ct' + Math.random().toString(36).substr(2, 6);
        var w = size;
        var h = size * 1.5;
        return '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">' +
            '<defs>' +
            // Deep pine foliage - multiple greens for depth
            '<radialGradient id="' + uid + 'fol" cx="50%" cy="40%" r="60%">' +
            '<stop offset="0%" stop-color="#3d9142"/>' +
            '<stop offset="50%" stop-color="#2a7230"/>' +
            '<stop offset="100%" stop-color="#14501a"/>' +
            '</radialGradient>' +
            '<linearGradient id="' + uid + 'folL" x1="0%" y1="30%" x2="100%" y2="70%">' +
            '<stop offset="0%" stop-color="#5aad5e"/>' +
            '<stop offset="100%" stop-color="#2a7230"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'folD" x1="100%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#1a5c1f"/>' +
            '<stop offset="100%" stop-color="#0a3510"/>' +
            '</linearGradient>' +
            // Inner shadow for depth between branch layers
            '<radialGradient id="' + uid + 'inner" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#0a3510" stop-opacity="0.8"/>' +
            '<stop offset="100%" stop-color="#0a3510" stop-opacity="0"/>' +
            '</radialGradient>' +
            // Snow
            '<linearGradient id="' + uid + 'sn" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>' +
            '<stop offset="40%" stop-color="#eaf2ff" stop-opacity="0.8"/>' +
            '<stop offset="100%" stop-color="#d0dfef" stop-opacity="0.2"/>' +
            '</linearGradient>' +
            // Trunk
            '<linearGradient id="' + uid + 'trk" x1="0%" y1="0%" x2="100%" y2="0%">' +
            '<stop offset="0%" stop-color="#3e2723"/>' +
            '<stop offset="25%" stop-color="#5d4037"/>' +
            '<stop offset="50%" stop-color="#795548"/>' +
            '<stop offset="75%" stop-color="#5d4037"/>' +
            '<stop offset="100%" stop-color="#3e2723"/>' +
            '</linearGradient>' +
            // Star
            '<radialGradient id="' + uid + 'str" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#fffde7"/>' +
            '<stop offset="30%" stop-color="#ffd700"/>' +
            '<stop offset="80%" stop-color="#ffb300"/>' +
            '<stop offset="100%" stop-color="#e6a000"/>' +
            '</radialGradient>' +
            // Baubles
            '<radialGradient id="' + uid + 'bR" cx="35%" cy="28%">' +
            '<stop offset="0%" stop-color="#ff7070"/><stop offset="40%" stop-color="#e53935"/><stop offset="100%" stop-color="#b71c1c"/>' +
            '</radialGradient>' +
            '<radialGradient id="' + uid + 'bG" cx="35%" cy="28%">' +
            '<stop offset="0%" stop-color="#fff8e1"/><stop offset="40%" stop-color="#ffd700"/><stop offset="100%" stop-color="#b8860b"/>' +
            '</radialGradient>' +
            '<radialGradient id="' + uid + 'bB" cx="35%" cy="28%">' +
            '<stop offset="0%" stop-color="#90caf9"/><stop offset="40%" stop-color="#42a5f5"/><stop offset="100%" stop-color="#1565c0"/>' +
            '</radialGradient>' +
            '<radialGradient id="' + uid + 'bS" cx="35%" cy="28%">' +
            '<stop offset="0%" stop-color="#ffffff"/><stop offset="40%" stop-color="#e0e0e0"/><stop offset="100%" stop-color="#9e9e9e"/>' +
            '</radialGradient>' +
            // Garland
            '<linearGradient id="' + uid + 'gar" x1="0%" y1="0%" x2="100%" y2="0%">' +
            '<stop offset="0%" stop-color="#ffd700" stop-opacity="0.85"/>' +
            '<stop offset="50%" stop-color="#ffeb3b" stop-opacity="1"/>' +
            '<stop offset="100%" stop-color="#ffd700" stop-opacity="0.85"/>' +
            '</linearGradient>' +
            // Filters
            '<filter id="' + uid + 'sh"><feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feOffset dx="3" dy="5"/><feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '<filter id="' + uid + 'gl"><feGaussianBlur stdDeviation="3.5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '<filter id="' + uid + 'sg" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '</defs>' +

            // ===== STAR TOPPER =====
            '<g filter="url(#' + uid + 'sg)">' +
            '<polygon points="150,5 157,26 180,26 162,40 168,62 150,48 132,62 138,40 120,26 143,26" fill="url(#' + uid + 'str)" stroke="#e6a000" stroke-width="1.2"/>' +
            '<polygon points="150,14 154,26 167,26 157,36 160,48 150,40 140,48 143,36 133,26 146,26" fill="#fffde7" opacity="0.55"/>' +
            '<circle cx="150" cy="36" r="3.5" fill="#fff" opacity="0.9"/>' +
            '</g>' +

            // ===== TREE – natural conifer silhouette built from overlapping organic branch clusters =====
            '<g filter="url(#' + uid + 'sh)">' +

            // --- Central trunk visible between branches ---
            '<rect x="144" y="50" width="12" height="310" fill="url(#' + uid + 'trk)" opacity="0.25" rx="3"/>' +

            // --- LAYER 1: Top spire (narrow, pointed) ---
            '<path d="M 150 42 C 148 48 140 56 134 62 C 130 66 126 72 128 74 C 132 72 138 74 142 72 C 146 70 148 72 150 74 C 152 72 154 70 158 72 C 162 74 168 72 172 74 C 174 72 170 66 166 62 C 160 56 152 48 150 42 Z" fill="url(#' + uid + 'fol)"/>' +
            '<path d="M 150 42 C 148 48 140 56 134 62 C 130 66 128 74 128 74 L 150 68 Z" fill="url(#' + uid + 'folL)" opacity="0.3"/>' +
            '<path d="M 150 42 C 152 48 160 56 166 62 C 170 66 172 74 172 74 L 150 68 Z" fill="url(#' + uid + 'folD)" opacity="0.4"/>' +
            // Sub-branches drooping down
            '<path d="M 134 62 C 128 66 122 71 120 75 C 124 74 128 73 132 74" fill="url(#' + uid + 'fol)" opacity="0.9"/>' +
            '<path d="M 166 62 C 172 66 178 71 180 75 C 176 74 172 73 168 74" fill="url(#' + uid + 'folD)" opacity="0.9"/>' +
            // Snow on top
            '<path d="M 132 70 C 138 64 145 67 150 62 C 155 67 162 64 168 70 C 164 67 156 61 150 65 C 144 61 136 67 132 70 Z" fill="url(#' + uid + 'sn)" opacity="0.8"/>' +

            // --- LAYER 2: Upper mid ---
            // Dark gap between layers
            '<ellipse cx="150" cy="80" rx="30" ry="4" fill="url(#' + uid + 'inner)" opacity="0.4"/>' +
            // Main foliage
            '<path d="M 150 68 C 145 78 130 90 118 98 C 112 102 106 108 108 111 C 114 108 122 112 130 110 C 138 108 144 110 150 112 C 156 110 162 108 170 110 C 178 112 186 108 192 111 C 194 108 188 102 182 98 C 170 90 155 78 150 68 Z" fill="url(#' + uid + 'fol)"/>' +
            '<path d="M 150 68 C 145 78 130 90 118 98 C 112 102 108 111 108 111 L 150 100 Z" fill="url(#' + uid + 'folL)" opacity="0.3"/>' +
            '<path d="M 150 68 C 155 78 170 90 182 98 C 188 102 192 111 192 111 L 150 100 Z" fill="url(#' + uid + 'folD)" opacity="0.4"/>' +
            // Drooping sub-branches left
            '<path d="M 118 98 C 110 104 102 110 98 116 C 104 114 110 112 116 114" fill="url(#' + uid + 'fol)" opacity="0.85"/>' +
            '<path d="M 130 92 C 122 98 114 105 110 112 C 116 110 122 110 126 112" fill="url(#' + uid + 'fol)" opacity="0.7"/>' +
            // Drooping sub-branches right
            '<path d="M 182 98 C 190 104 198 110 202 116 C 196 114 190 112 184 114" fill="url(#' + uid + 'folD)" opacity="0.85"/>' +
            '<path d="M 170 92 C 178 98 186 105 190 112 C 184 110 178 110 174 112" fill="url(#' + uid + 'folD)" opacity="0.7"/>' +
            // Pine needle detail
            '<path d="M 120 100 L 114 104 L 118 105 L 112 110" stroke="#0d3a10" stroke-width="1" fill="none" opacity="0.4"/>' +
            '<path d="M 180 100 L 186 104 L 182 105 L 188 110" stroke="#0d3a10" stroke-width="1" fill="none" opacity="0.4"/>' +
            // Snow
            '<path d="M 110 108 C 120 98 135 104 150 96 C 165 104 180 98 190 108 C 184 103 165 94 150 100 C 135 94 116 103 110 108 Z" fill="url(#' + uid + 'sn)" opacity="0.75"/>' +

            // --- LAYER 3: Mid ---
            '<ellipse cx="150" cy="118" rx="46" ry="5" fill="url(#' + uid + 'inner)" opacity="0.35"/>' +
            '<path d="M 150 106 C 142 120 120 138 100 150 C 92 156 84 164 86 168 C 94 164 106 168 118 166 C 130 164 142 166 150 168 C 158 166 170 164 182 166 C 194 168 206 164 214 168 C 216 164 208 156 200 150 C 180 138 158 120 150 106 Z" fill="url(#' + uid + 'fol)"/>' +
            '<path d="M 150 106 C 142 120 120 138 100 150 C 92 156 86 168 86 168 L 150 148 Z" fill="url(#' + uid + 'folL)" opacity="0.25"/>' +
            '<path d="M 150 106 C 158 120 180 138 200 150 C 208 156 214 168 214 168 L 150 148 Z" fill="url(#' + uid + 'folD)" opacity="0.4"/>' +
            // Drooping branches
            '<path d="M 100 150 C 90 158 80 166 76 174 C 84 170 92 168 98 170" fill="url(#' + uid + 'fol)" opacity="0.85"/>' +
            '<path d="M 116 140 C 106 148 96 158 90 166 C 98 162 106 162 112 164" fill="url(#' + uid + 'fol)" opacity="0.7"/>' +
            '<path d="M 200 150 C 210 158 220 166 224 174 C 216 170 208 168 202 170" fill="url(#' + uid + 'folD)" opacity="0.85"/>' +
            '<path d="M 184 140 C 194 148 204 158 210 166 C 202 162 194 162 188 164" fill="url(#' + uid + 'folD)" opacity="0.7"/>' +
            // Needle detail
            '<path d="M 105 152 L 98 158 L 102 159 L 94 166" stroke="#0d3a10" stroke-width="1.2" fill="none" opacity="0.4"/>' +
            '<path d="M 195 152 L 202 158 L 198 159 L 206 166" stroke="#0d3a10" stroke-width="1.2" fill="none" opacity="0.4"/>' +
            // Snow
            '<path d="M 90 164 C 108 150 132 160 150 148 C 168 160 192 150 210 164 C 200 156 168 145 150 154 C 132 145 100 156 90 164 Z" fill="url(#' + uid + 'sn)" opacity="0.7"/>' +

            // --- LAYER 4: Lower mid ---
            '<ellipse cx="150" cy="174" rx="66" ry="5" fill="url(#' + uid + 'inner)" opacity="0.3"/>' +
            '<path d="M 150 160 C 138 178 110 200 82 216 C 72 222 62 232 64 236 C 74 232 90 236 106 234 C 122 232 138 234 150 236 C 162 234 178 232 194 234 C 210 236 226 232 236 236 C 238 232 228 222 218 216 C 190 200 162 178 150 160 Z" fill="url(#' + uid + 'fol)"/>' +
            '<path d="M 150 160 C 138 178 110 200 82 216 C 72 222 64 236 64 236 L 150 205 Z" fill="url(#' + uid + 'folL)" opacity="0.25"/>' +
            '<path d="M 150 160 C 162 178 190 200 218 216 C 228 222 236 236 236 236 L 150 205 Z" fill="url(#' + uid + 'folD)" opacity="0.4"/>' +
            // Drooping branches
            '<path d="M 82 216 C 70 226 58 236 54 244 C 64 240 74 238 80 240" fill="url(#' + uid + 'fol)" opacity="0.85"/>' +
            '<path d="M 102 206 C 88 218 76 230 70 240 C 80 236 88 236 94 238" fill="url(#' + uid + 'fol)" opacity="0.7"/>' +
            '<path d="M 218 216 C 230 226 242 236 246 244 C 236 240 226 238 220 240" fill="url(#' + uid + 'folD)" opacity="0.85"/>' +
            '<path d="M 198 206 C 212 218 224 230 230 240 C 220 236 212 236 206 238" fill="url(#' + uid + 'folD)" opacity="0.7"/>' +
            // Snow
            '<path d="M 70 232 C 95 216 128 226 150 212 C 172 226 205 216 230 232 C 218 224 172 210 150 218 C 128 210 82 224 70 232 Z" fill="url(#' + uid + 'sn)" opacity="0.65"/>' +

            // --- LAYER 5: Base (widest) ---
            '<ellipse cx="150" cy="242" rx="86" ry="5" fill="url(#' + uid + 'inner)" opacity="0.3"/>' +
            '<path d="M 150 228 C 134 250 98 275 62 296 C 50 304 40 314 42 318 C 56 312 76 318 96 316 C 116 314 136 316 150 318 C 164 316 184 314 204 316 C 224 318 244 312 258 318 C 260 314 250 304 238 296 C 202 275 166 250 150 228 Z" fill="url(#' + uid + 'fol)"/>' +
            '<path d="M 150 228 C 134 250 98 275 62 296 C 50 304 42 318 42 318 L 150 278 Z" fill="url(#' + uid + 'folL)" opacity="0.25"/>' +
            '<path d="M 150 228 C 166 250 202 275 238 296 C 250 304 258 318 258 318 L 150 278 Z" fill="url(#' + uid + 'folD)" opacity="0.4"/>' +
            // Drooping branches
            '<path d="M 62 296 C 48 308 36 318 32 326 C 44 322 54 320 60 322" fill="url(#' + uid + 'fol)" opacity="0.85"/>' +
            '<path d="M 86 282 C 70 296 56 310 48 320 C 60 316 70 316 76 318" fill="url(#' + uid + 'fol)" opacity="0.7"/>' +
            '<path d="M 238 296 C 252 308 264 318 268 326 C 256 322 246 320 240 322" fill="url(#' + uid + 'folD)" opacity="0.85"/>' +
            '<path d="M 214 282 C 230 296 244 310 252 320 C 240 316 230 316 224 318" fill="url(#' + uid + 'folD)" opacity="0.7"/>' +
            // Extra bottom fringe branches for fullness
            '<path d="M 70 304 C 58 314 48 322 44 328 C 52 326 60 324 66 326" fill="url(#' + uid + 'fol)" opacity="0.6"/>' +
            '<path d="M 230 304 C 242 314 252 322 256 328 C 248 326 240 324 234 326" fill="url(#' + uid + 'folD)" opacity="0.6"/>' +
            // Needle detail
            '<path d="M 76 294 L 66 302 L 72 304 L 60 314" stroke="#0d3a10" stroke-width="1.2" fill="none" opacity="0.35"/>' +
            '<path d="M 224 294 L 234 302 L 228 304 L 240 314" stroke="#0d3a10" stroke-width="1.2" fill="none" opacity="0.35"/>' +
            '<path d="M 100 280 L 90 290 L 94 292 L 84 302" stroke="#0d3a10" stroke-width="1" fill="none" opacity="0.3"/>' +
            '<path d="M 200 280 L 210 290 L 206 292 L 216 302" stroke="#0d3a10" stroke-width="1" fill="none" opacity="0.3"/>' +
            // Snow
            '<path d="M 50 314 C 80 296 118 308 150 292 C 182 308 220 296 250 314 C 235 304 182 288 150 298 C 118 288 65 304 50 314 Z" fill="url(#' + uid + 'sn)" opacity="0.6"/>' +

            '</g>' +

            // ===== TRUNK (visible below bottom branches) =====
            '<g filter="url(#' + uid + 'sh)">' +
            '<path d="M 136 318 L 134 360 L 140 362 L 160 362 L 166 360 L 164 318" fill="url(#' + uid + 'trk)" stroke="#3e2723" stroke-width="1.5"/>' +
            '<line x1="142" y1="320" x2="141" y2="360" stroke="#4e342e" stroke-width="2" opacity="0.5"/>' +
            '<line x1="150" y1="320" x2="150" y2="362" stroke="#795548" stroke-width="1.5" opacity="0.4"/>' +
            '<line x1="158" y1="320" x2="159" y2="360" stroke="#4e342e" stroke-width="2" opacity="0.5"/>' +
            '<path d="M 137 328 Q 140 330 137 334" stroke="#2e1b0e" stroke-width="0.8" fill="none" opacity="0.4"/>' +
            '<path d="M 157 340 Q 160 342 157 346" stroke="#2e1b0e" stroke-width="0.8" fill="none" opacity="0.4"/>' +
            '</g>' +

            // ===== GOLD TINSEL GARLANDS (natural draping curves) =====
            '<path d="M 128 72 Q 140 82 150 76 Q 160 82 172 72" stroke="url(#' + uid + 'gar)" stroke-width="2" fill="none" opacity="0.8"/>' +
            '<path d="M 106 110 Q 126 126 150 118 Q 174 126 194 110" stroke="url(#' + uid + 'gar)" stroke-width="2.5" fill="none" opacity="0.75"/>' +
            '<path d="M 86 164 Q 114 184 150 172 Q 186 184 214 164" stroke="url(#' + uid + 'gar)" stroke-width="2.5" fill="none" opacity="0.7"/>' +
            '<path d="M 66 234 Q 104 256 150 240 Q 196 256 234 234" stroke="url(#' + uid + 'gar)" stroke-width="3" fill="none" opacity="0.65"/>' +
            '<path d="M 48 314 Q 96 336 150 318 Q 204 336 252 314" stroke="url(#' + uid + 'gar)" stroke-width="3" fill="none" opacity="0.6"/>' +

            // ===== ORNAMENTS =====
            // Layer 1
            '<g filter="url(#' + uid + 'gl)"><circle cx="138" cy="66" r="6" fill="url(#' + uid + 'bR)"/><ellipse cx="136" cy="63" rx="2.5" ry="2.8" fill="#ffcdd2" opacity="0.85"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="162" cy="66" r="5.5" fill="url(#' + uid + 'bG)"/><ellipse cx="160" cy="63.5" rx="2.2" ry="2.5" fill="#fff9c4" opacity="0.9"/></g>' +
            // Layer 2
            '<g filter="url(#' + uid + 'gl)"><circle cx="115" cy="106" r="7.5" fill="url(#' + uid + 'bB)"/><ellipse cx="112.5" cy="103" rx="3" ry="3.5" fill="#e3f2fd" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="150" cy="110" r="6.5" fill="url(#' + uid + 'bS)"/><ellipse cx="148" cy="107.5" rx="2.8" ry="3" fill="#fff" opacity="0.95"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="185" cy="106" r="7.5" fill="url(#' + uid + 'bR)"/><ellipse cx="183" cy="103" rx="3" ry="3.5" fill="#ffcdd2" opacity="0.85"/></g>' +
            // Layer 3
            '<g filter="url(#' + uid + 'gl)"><circle cx="96" cy="158" r="8.5" fill="url(#' + uid + 'bG)"/><ellipse cx="93.5" cy="154.5" rx="3.5" ry="4" fill="#fff9c4" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="135" cy="162" r="7" fill="url(#' + uid + 'bR)"/><ellipse cx="133" cy="159" rx="3" ry="3.2" fill="#ffcdd2" opacity="0.85"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="165" cy="160" r="7" fill="url(#' + uid + 'bB)"/><ellipse cx="163" cy="157" rx="3" ry="3.2" fill="#e3f2fd" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="204" cy="158" r="8.5" fill="url(#' + uid + 'bS)"/><ellipse cx="202" cy="154.5" rx="3.5" ry="4" fill="#fff" opacity="0.95"/></g>' +
            // Layer 4
            '<g filter="url(#' + uid + 'gl)"><circle cx="78" cy="228" r="9" fill="url(#' + uid + 'bR)"/><ellipse cx="75.5" cy="224" rx="3.8" ry="4.2" fill="#ffcdd2" opacity="0.85"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="120" cy="232" r="7.5" fill="url(#' + uid + 'bG)"/><ellipse cx="118" cy="228.5" rx="3.2" ry="3.5" fill="#fff9c4" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="180" cy="232" r="7.5" fill="url(#' + uid + 'bB)"/><ellipse cx="178" cy="228.5" rx="3.2" ry="3.5" fill="#e3f2fd" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="222" cy="228" r="9" fill="url(#' + uid + 'bG)"/><ellipse cx="220" cy="224" rx="3.8" ry="4.2" fill="#fff9c4" opacity="0.9"/></g>' +
            // Layer 5
            '<g filter="url(#' + uid + 'gl)"><circle cx="62" cy="302" r="9.5" fill="url(#' + uid + 'bB)"/><ellipse cx="59.5" cy="298" rx="4" ry="4.5" fill="#e3f2fd" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="108" cy="306" r="8" fill="url(#' + uid + 'bR)"/><ellipse cx="106" cy="302.5" rx="3.2" ry="3.5" fill="#ffcdd2" opacity="0.85"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="150" cy="310" r="8.5" fill="url(#' + uid + 'bG)"/><ellipse cx="148" cy="306" rx="3.5" ry="4" fill="#fff9c4" opacity="0.9"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="192" cy="306" r="8" fill="url(#' + uid + 'bS)"/><ellipse cx="190" cy="302.5" rx="3.2" ry="3.5" fill="#fff" opacity="0.95"/></g>' +
            '<g filter="url(#' + uid + 'gl)"><circle cx="238" cy="302" r="9.5" fill="url(#' + uid + 'bR)"/><ellipse cx="236" cy="298" rx="4" ry="4.5" fill="#ffcdd2" opacity="0.85"/></g>' +

            // ===== TWINKLING LIGHTS =====
            '<circle cx="140" cy="79" r="3" fill="#ff3333" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.8s" repeatCount="indefinite"/></circle>' +
            '<circle cx="160" cy="78" r="2.5" fill="#33cc33" opacity="0.9"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/></circle>' +
            '<circle cx="116" cy="122" r="3" fill="#ffd700" opacity="0.9"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite"/></circle>' +
            '<circle cx="150" cy="120" r="2.5" fill="#ff3333" opacity="0.9"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite"/></circle>' +
            '<circle cx="184" cy="122" r="3" fill="#3377ff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.7s" repeatCount="indefinite"/></circle>' +
            '<circle cx="96" cy="178" r="3" fill="#33cc33" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.1s" repeatCount="indefinite"/></circle>' +
            '<circle cx="130" cy="180" r="2.5" fill="#ffd700" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite"/></circle>' +
            '<circle cx="170" cy="178" r="2.5" fill="#ff3333" opacity="0.9"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.9s" repeatCount="indefinite"/></circle>' +
            '<circle cx="204" cy="178" r="3" fill="#3377ff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.3s" repeatCount="indefinite"/></circle>' +
            '<circle cx="78" cy="250" r="3.5" fill="#ffd700" opacity="0.9"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite"/></circle>' +
            '<circle cx="118" cy="252" r="2.5" fill="#33cc33" opacity="0.9"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite"/></circle>' +
            '<circle cx="150" cy="244" r="3" fill="#ff3333" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.4s" repeatCount="indefinite"/></circle>' +
            '<circle cx="182" cy="252" r="2.5" fill="#3377ff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.1s" repeatCount="indefinite"/></circle>' +
            '<circle cx="222" cy="250" r="3.5" fill="#ffd700" opacity="0.9"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.7s" repeatCount="indefinite"/></circle>' +
            '<circle cx="58" cy="322" r="3.5" fill="#ff3333" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.9s" repeatCount="indefinite"/></circle>' +
            '<circle cx="106" cy="324" r="3" fill="#ffd700" opacity="0.9"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite"/></circle>' +
            '<circle cx="150" cy="320" r="3.5" fill="#33cc33" opacity="0.9"><animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite"/></circle>' +
            '<circle cx="194" cy="324" r="3" fill="#3377ff" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/></circle>' +
            '<circle cx="242" cy="322" r="3.5" fill="#ff3333" opacity="0.9"><animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.6s" repeatCount="indefinite"/></circle>' +

            '</svg>';
    },

    // Gift Boxes - 3 flat modern boxes in traditional Christmas colours (red, green, gold) with textures
    giftBoxes: function(size) {
        var uid = 'gb' + Math.random().toString(36).substr(2, 6);
        var w = size * 2;
        var h = size * 1.1;
        return '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170">' +
            '<defs>' +
            // Christmas Red box
            '<linearGradient id="' + uid + 'red" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#DC3545"/><stop offset="100%" stop-color="#C62828"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'redSide" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#B71C1C"/><stop offset="100%" stop-color="#9A1515"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'redTop" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#EF5350"/><stop offset="100%" stop-color="#DC3545"/>' +
            '</linearGradient>' +
            // Christmas Green box
            '<linearGradient id="' + uid + 'grn" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#2E7D32"/><stop offset="100%" stop-color="#1B5E20"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'grnSide" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#155218"/><stop offset="100%" stop-color="#0D3B10"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'grnTop" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#43A047"/><stop offset="100%" stop-color="#2E7D32"/>' +
            '</linearGradient>' +
            // Gold box
            '<linearGradient id="' + uid + 'gld" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#FFD54F"/><stop offset="100%" stop-color="#F9A825"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'gldSide" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#E8901A"/><stop offset="100%" stop-color="#C67C00"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'gldTop" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#FFEE58"/><stop offset="100%" stop-color="#FFD54F"/>' +
            '</linearGradient>' +
            // Ribbon colours
            '<linearGradient id="' + uid + 'ribGld" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#FFD54F"/><stop offset="100%" stop-color="#E8901A"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'ribRed" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#EF5350"/><stop offset="100%" stop-color="#C62828"/>' +
            '</linearGradient>' +
            '<linearGradient id="' + uid + 'ribGrn" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#43A047"/><stop offset="100%" stop-color="#1B5E20"/>' +
            '</linearGradient>' +
            // Shine highlight for texture
            '<linearGradient id="' + uid + 'shine" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.15"/><stop offset="50%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.08"/>' +
            '</linearGradient>' +
            // Subtle noise texture pattern
            '<filter id="' + uid + 'tex"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/><feColorMatrix type="saturate" values="0" in="noise" result="grey"/><feBlend in="SourceGraphic" in2="grey" mode="overlay" result="blend"/><feComposite in="blend" in2="SourceGraphic" operator="in"/></filter>' +
            // Drop shadow
            '<filter id="' + uid + 'ds"><feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/><feOffset dx="2" dy="3"/><feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '</defs>' +

            // ===== BOX 1 - Red box, center (cube-shaped, main focal point) =====
            '<g filter="url(#' + uid + 'ds)">' +
            // Front face
            '<rect x="105" y="72" width="70" height="70" rx="2" fill="url(#' + uid + 'red)" filter="url(#' + uid + 'tex)"/>' +
            // Texture shine overlay on front
            '<rect x="105" y="72" width="70" height="70" rx="2" fill="url(#' + uid + 'shine)"/>' +
            // Edge highlight left
            '<line x1="106" y1="73" x2="106" y2="141" stroke="#EF5350" stroke-width="1" opacity="0.5"/>' +
            // Right side face
            '<path d="M 175 72 L 191 60 L 191 130 L 175 142 Z" fill="url(#' + uid + 'redSide)"/>' +
            '<path d="M 175 72 L 191 60 L 191 130 L 175 142 Z" fill="url(#' + uid + 'shine)"/>' +
            // Top face
            '<path d="M 105 72 L 121 60 L 191 60 L 175 72 Z" fill="url(#' + uid + 'redTop)"/>' +
            // Gold ribbon vertical
            '<rect x="134" y="72" width="10" height="70" fill="url(#' + uid + 'ribGld)"/>' +
            '<path d="M 134 72 L 141 66 L 151 66 L 144 72 Z" fill="#FFEE58" opacity="0.8"/>' +
            '<path d="M 144 72 L 151 66 L 151 72 Z" fill="#E8901A" opacity="0.5"/>' +
            // Gold ribbon horizontal
            '<rect x="105" y="101" width="70" height="9" fill="url(#' + uid + 'ribGld)"/>' +
            '<path d="M 175 101 L 191 91 L 191 99 L 175 110 Z" fill="#E8901A" opacity="0.8"/>' +
            // Ribbon cross highlight
            '<rect x="135" y="102" width="8" height="7" fill="#FFEE58" opacity="0.3"/>' +
            // Gold bow
            '<ellipse cx="133" cy="69" rx="14" ry="9" fill="#FFD54F" transform="rotate(-18,133,69)"/>' +
            '<ellipse cx="149" cy="69" rx="14" ry="9" fill="#F9A825" transform="rotate(18,149,69)"/>' +
            // Bow ribbon tails
            '<path d="M 131 76 Q 126 84 122 78" stroke="#E8901A" stroke-width="2" fill="none" opacity="0.7"/>' +
            '<path d="M 151 76 Q 156 84 160 78" stroke="#E8901A" stroke-width="2" fill="none" opacity="0.7"/>' +
            '<circle cx="141" cy="72" r="5.5" fill="#E8901A"/>' +
            '<ellipse cx="141" cy="70.5" rx="2.8" ry="2" fill="#FFEE58" opacity="0.7"/>' +
            '</g>' +

            // ===== BOX 2 - Green box, left =====
            '<g filter="url(#' + uid + 'ds)">' +
            // Front face
            '<rect x="28" y="92" width="62" height="58" rx="2" fill="url(#' + uid + 'grn)" filter="url(#' + uid + 'tex)"/>' +
            '<rect x="28" y="92" width="62" height="58" rx="2" fill="url(#' + uid + 'shine)"/>' +
            '<line x1="29" y1="93" x2="29" y2="149" stroke="#43A047" stroke-width="1" opacity="0.5"/>' +
            // Right side face
            '<path d="M 90 92 L 103 84 L 103 142 L 90 150 Z" fill="url(#' + uid + 'grnSide)"/>' +
            '<path d="M 90 92 L 103 84 L 103 142 L 90 150 Z" fill="url(#' + uid + 'shine)"/>' +
            // Top face
            '<path d="M 28 92 L 41 84 L 103 84 L 90 92 Z" fill="url(#' + uid + 'grnTop)"/>' +
            // Red ribbon vertical
            '<rect x="53" y="92" width="8" height="58" fill="url(#' + uid + 'ribRed)"/>' +
            '<path d="M 53 92 L 59 87 L 67 87 L 61 92 Z" fill="#EF5350" opacity="0.8"/>' +
            '<path d="M 61 92 L 67 87 L 67 92 Z" fill="#B71C1C" opacity="0.5"/>' +
            // Red ribbon horizontal
            '<rect x="28" y="116" width="62" height="7" fill="url(#' + uid + 'ribRed)"/>' +
            '<path d="M 90 116 L 103 109 L 103 115 L 90 123 Z" fill="#B71C1C" opacity="0.8"/>' +
            '<rect x="54" y="117" width="6" height="5" fill="#EF5350" opacity="0.3"/>' +
            // Red bow
            '<ellipse cx="52" cy="90" rx="11" ry="7" fill="#EF5350" transform="rotate(-18,52,90)"/>' +
            '<ellipse cx="65" cy="90" rx="11" ry="7" fill="#DC3545" transform="rotate(18,65,90)"/>' +
            '<path d="M 50 96 Q 45 103 42 98" stroke="#B71C1C" stroke-width="1.8" fill="none" opacity="0.6"/>' +
            '<path d="M 67 96 Q 72 103 75 98" stroke="#B71C1C" stroke-width="1.8" fill="none" opacity="0.6"/>' +
            '<circle cx="58.5" cy="92" r="4.5" fill="#C62828"/>' +
            '<ellipse cx="58.5" cy="90.5" rx="2.2" ry="1.6" fill="#EF9A9A" opacity="0.7"/>' +
            '</g>' +

            // ===== BOX 3 - Gold box, right (slightly tilted) =====
            '<g filter="url(#' + uid + 'ds)" transform="rotate(-5, 240, 140)">' +
            // Front face
            '<rect x="200" y="100" width="58" height="52" rx="2" fill="url(#' + uid + 'gld)" filter="url(#' + uid + 'tex)"/>' +
            '<rect x="200" y="100" width="58" height="52" rx="2" fill="url(#' + uid + 'shine)"/>' +
            '<line x1="201" y1="101" x2="201" y2="151" stroke="#FFEE58" stroke-width="1" opacity="0.4"/>' +
            // Right side face
            '<path d="M 258 100 L 270 93 L 270 145 L 258 152 Z" fill="url(#' + uid + 'gldSide)"/>' +
            '<path d="M 258 100 L 270 93 L 270 145 L 258 152 Z" fill="url(#' + uid + 'shine)"/>' +
            // Top face
            '<path d="M 200 100 L 212 93 L 270 93 L 258 100 Z" fill="url(#' + uid + 'gldTop)"/>' +
            // Green ribbon vertical
            '<rect x="224" y="100" width="7" height="52" fill="url(#' + uid + 'ribGrn)"/>' +
            '<path d="M 224 100 L 229 95 L 236 95 L 231 100 Z" fill="#43A047" opacity="0.8"/>' +
            // Green ribbon horizontal
            '<rect x="200" y="122" width="58" height="7" fill="url(#' + uid + 'ribGrn)"/>' +
            '<path d="M 258 122 L 270 116 L 270 122 L 258 129 Z" fill="#155218" opacity="0.8"/>' +
            '<rect x="225" y="123" width="5" height="5" fill="#43A047" opacity="0.3"/>' +
            // Green bow
            '<ellipse cx="223" cy="98" rx="9" ry="6" fill="#43A047" transform="rotate(-18,223,98)"/>' +
            '<ellipse cx="234" cy="98" rx="9" ry="6" fill="#2E7D32" transform="rotate(18,234,98)"/>' +
            '<path d="M 221 104 Q 217 110 214 106" stroke="#1B5E20" stroke-width="1.5" fill="none" opacity="0.6"/>' +
            '<path d="M 236 104 Q 240 110 243 106" stroke="#1B5E20" stroke-width="1.5" fill="none" opacity="0.6"/>' +
            '<circle cx="228.5" cy="100" r="3.8" fill="#1B5E20"/>' +
            '<ellipse cx="228.5" cy="98.5" rx="2" ry="1.4" fill="#66BB6A" opacity="0.7"/>' +
            '</g>' +

            // Sparkle accents
            '<polygon points="20,85 22,80 24,85 22,90" fill="#FFD700" opacity="0.6"/>' +
            '<polygon points="20,85 15,83 20,81 25,83" fill="#FFD700" opacity="0.4"/>' +
            '<polygon points="298,90 300,85 302,90 300,95" fill="#FFD700" opacity="0.5"/>' +
            '<polygon points="298,90 293,88 298,86 303,88" fill="#FFD700" opacity="0.35"/>' +
            '<circle cx="12" cy="110" r="1.5" fill="#FFD700" opacity="0.5"/>' +
            '<circle cx="308" cy="115" r="1.2" fill="#FFD700" opacity="0.4"/>' +

            '</svg>';
    },

    // Snow ground - seamless repeating strip
    snowGround: function(width) {
        var uid = 'sg' + Math.random().toString(36).substr(2, 6);
        return '<svg width="' + width + '" height="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 80" preserveAspectRatio="none">' +
            '<defs>' +
            '<linearGradient id="' + uid + 'sg" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>' +
            '<stop offset="30%" stop-color="#f0f4ff" stop-opacity="0.95"/>' +
            '<stop offset="60%" stop-color="#dce6f5" stop-opacity="0.88"/>' +
            '<stop offset="100%" stop-color="#c5d5ea" stop-opacity="0.75"/>' +
            '</linearGradient>' +
            '<filter id="' + uid + 'sf"><feGaussianBlur stdDeviation="1.5"/></filter>' +
            '</defs>' +
            // Main snow mound shape - organic, undulating
            '<path d="M 0 35 C 40 15 80 25 120 18 C 160 10 200 22 250 12 C 300 5 340 18 400 14 C 460 8 500 20 560 16 C 620 10 660 22 720 18 C 780 12 820 24 880 16 C 940 8 980 20 1040 14 C 1080 10 1120 22 1160 18 C 1180 15 1200 20 1200 20 L 1200 80 L 0 80 Z" fill="url(#' + uid + 'sg)"/>' +
            // Subtle highlights on top of snow
            '<path d="M 0 38 C 50 22 100 30 150 24 C 200 18 260 28 320 20 C 380 14 430 26 500 18 C 560 12 620 24 700 20 C 760 16 820 26 900 22 C 960 16 1020 28 1100 22 C 1150 18 1200 25 1200 25 L 1200 30 C 1150 30 1100 28 1040 30 C 980 32 920 26 860 30 C 800 32 740 28 680 30 C 620 32 560 26 500 28 C 440 30 380 24 320 28 C 260 30 200 26 140 30 C 80 32 40 28 0 32 Z" fill="#ffffff" opacity="0.6"/>' +
            // Sparkle dots
            '<circle cx="80" cy="28" r="1.2" fill="#fff" opacity="0.9"/>' +
            '<circle cx="200" cy="22" r="1" fill="#fff" opacity="0.8"/>' +
            '<circle cx="350" cy="20" r="1.5" fill="#fff" opacity="0.85"/>' +
            '<circle cx="500" cy="24" r="1" fill="#fff" opacity="0.9"/>' +
            '<circle cx="650" cy="22" r="1.3" fill="#fff" opacity="0.8"/>' +
            '<circle cx="800" cy="25" r="1" fill="#fff" opacity="0.85"/>' +
            '<circle cx="950" cy="20" r="1.2" fill="#fff" opacity="0.9"/>' +
            '<circle cx="1100" cy="23" r="1" fill="#fff" opacity="0.8"/>' +
            '</svg>';
    },

    // Christmas Ornament with glow (for logo)
    ornamentGlow: function(size) {
        return '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
            '<defs>' +
            '<radialGradient id="ornGlow">' +
            '<stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.8"/>' +
            '<stop offset="40%" style="stop-color:#ff0000;stop-opacity:0.6"/>' +
            '<stop offset="70%" style="stop-color:#00ff00;stop-opacity:0.4"/>' +
            '<stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>' +
            '</radialGradient>' +
            '<radialGradient id="ornBall" cx="35%" cy="35%">' +
            '<stop offset="0%" style="stop-color:#ff4444;stop-opacity:1"/>' +
            '<stop offset="50%" style="stop-color:#cc0000;stop-opacity:1"/>' +
            '<stop offset="100%" style="stop-color:#990000;stop-opacity:1"/>' +
            '</radialGradient>' +
            '<filter id="ornGlowFilter" x="-50%" y="-50%" width="200%" height="200%">' +
            '<feGaussianBlur stdDeviation="8" result="glow"/>' +
            '<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>' +
            '</filter>' +
            '</defs>' +
            '<circle cx="50" cy="50" r="45" fill="url(#ornGlow)" filter="url(#ornGlowFilter)"/>' +
            '<circle cx="50" cy="54" r="28" fill="url(#ornBall)" stroke="#660000" stroke-width="2"/>' +
            '<rect x="45" y="20" width="10" height="8" fill="#daa520" stroke="#b8860b" stroke-width="1" rx="1"/>' +
            '<circle cx="40" cy="45" r="8" fill="#fff" opacity="0.6"/>' +
            '<circle cx="38" cy="43" r="4" fill="#fff" opacity="0.9"/>' +
            '</svg>';
    }
};

// Export for use in main engine
window.ChristmasSVGs = ChristmasSVGs;
