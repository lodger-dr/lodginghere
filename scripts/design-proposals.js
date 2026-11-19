const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure output directory exists
const outDir = path.join(__dirname, 'icon-previews');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Concept 1: "The Lodge Pin"
// A bold architectural house silhouette seamlessly fused with a location pin in negative space, 
// topped with a radiant beacon, on the vibrant LodgeHere flame gradient.
const concept1Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7539" />
      <stop offset="50%" stop-color="#F45B2A" />
      <stop offset="100%" stop-color="#CC370C" />
    </linearGradient>
    <radialGradient id="sunGlow1" cx="30%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="whiteGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF0E9" />
    </linearGradient>
    <linearGradient id="innerOrange1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF6B30" />
      <stop offset="100%" stop-color="#DE4212" />
    </linearGradient>
    <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#7A1800" flood-opacity="0.32" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#7A1800" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Full canvas fill for maskable safe zone -->
  <rect width="512" height="512" fill="url(#bgGrad1)" />
  <rect width="512" height="512" fill="url(#sunGlow1)" />
  <rect x="1.5" y="1.5" width="509" height="509" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.18" />

  <!-- Main Glyph Group: 280x280 centered in 512x512 -->
  <g filter="url(#shadow1)">
    <!-- Architectural Lodge Shell -->
    <!-- Gable roof + modern angled dormer + clean structural walls -->
    <path d="
      M 256 122
      C 263 122, 271 126, 277 132
      L 383 234
      C 391 242, 392 254, 386 263
      C 380 272, 368 276, 356 276
      L 344 276
      L 344 346
      C 344 362, 332 374, 316 374
      L 196 374
      C 180 374, 168 362, 168 346
      L 168 276
      L 156 276
      C 144 276, 132 272, 126 263
      C 120 254, 121 242, 129 234
      L 235 132
      C 241 126, 249 122, 256 122
      Z
    " fill="url(#whiteGrad1)" />

    <!-- Negative Space: The Map Pin & Welcoming Archway -->
    <!-- Upper loop of map pin with open archway base -->
    <path d="
      M 256 198
      C 284 198, 304 218, 304 246
      C 304 272, 286 298, 286 318
      L 286 374
      L 226 374
      L 226 318
      C 226 298, 208 272, 208 246
      C 208 218, 228 198, 256 198
      Z
    " fill="url(#innerOrange1)" />

    <!-- Center Radiant Location Core (The 'Here' Beacon) -->
    <circle cx="256" cy="246" r="18" fill="#FFFFFF" />
    <circle cx="256" cy="246" r="8.5" fill="#F45B2A" />

    <!-- Stylized Modern Geometric Window / Dormer Accent (Top Right) -->
    <path d="
      M 304 162
      L 304 140
      C 304 136, 308 132, 312 132
      L 326 132
      C 330 132, 334 136, 334 140
      L 334 190
      Z
    " fill="url(#whiteGrad1)" opacity="0.9" />
  </g>
</svg>
`;

// Concept 2: "The Interlocking Monogram (LH + Roofline + Geo-Beacon)"
// Ultra-modern, bespoke geometry where an 'L' and 'H' architecture form an iconic 
// geometric monogram with a golden location beacon. Minimal, bold, tech-forward.
const concept2Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7539" />
      <stop offset="50%" stop-color="#F45B2A" />
      <stop offset="100%" stop-color="#CC370C" />
    </linearGradient>
    <radialGradient id="sunGlow2" cx="35%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="whiteGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF2EC" />
    </linearGradient>
    <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#7A1800" flood-opacity="0.32" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#7A1800" flood-opacity="0.18" />
    </filter>
  </defs>

  <rect width="512" height="512" fill="url(#bgGrad2)" />
  <rect width="512" height="512" fill="url(#sunGlow2)" />
  <rect x="1.5" y="1.5" width="509" height="509" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.18" />

  <g filter="url(#shadow2)">
    <!-- Modern Roofline Chevron -->
    <path d="
      M 256 128
      L 378 226
      C 386 232, 388 244, 382 252
      C 376 260, 364 262, 356 256
      L 256 176
      L 156 256
      C 148 262, 136 260, 130 252
      C 124 244, 126 232, 134 226
      Z
    " fill="url(#whiteGrad2)" />

    <!-- Left Pillar (The 'L' of Lodge) -->
    <path d="
      M 166 248
      L 198 248
      C 204 248, 208 252, 208 258
      L 208 344
      L 292 344
      C 298 344, 302 348, 302 354
      C 302 360, 298 364, 292 364
      L 186 364
      C 174 364, 166 356, 166 344
      L 166 258
      C 166 252, 170 248, 166 248
      Z
    " fill="url(#whiteGrad2)" />

    <!-- Right Pillar (Completing the Lodge and forming the 'H' of Here) -->
    <path d="
      M 314 248
      L 346 248
      C 352 248, 356 252, 356 258
      L 356 354
      C 356 360, 352 364, 346 364
      L 324 364
      C 318 364, 314 360, 314 354
      Z
    " fill="url(#whiteGrad2)" />

    <!-- Central Location Pin Marker floating inside the pavilion -->
    <path d="
      M 256 226
      C 274 226, 288 240, 288 258
      C 288 276, 268 298, 256 312
      C 244 298, 224 276, 224 258
      C 224 240, 238 226, 256 226
      Z
    " fill="#FFF4EE" />
    <circle cx="256" cy="256" r="11" fill="#F45B2A" />
  </g>
</svg>
`;

// Concept 3: "The Campus Haven & Compass"
// Bold, balanced, high-contrast, iconic design.
// A confident geometric lodge with a distinctive curved roof overhang, 
// a prominent keyhole map pin archway, and a clean modern beacon.
// Super crisp at 16x16, 32x32, 192x192, and 512x512.
const concept3Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7539" />
      <stop offset="50%" stop-color="#F45B2A" />
      <stop offset="100%" stop-color="#CC370C" />
    </linearGradient>
    <radialGradient id="sunGlow3" cx="30%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="whiteGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF2EC" />
    </linearGradient>
    <linearGradient id="doorGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF6B30" />
      <stop offset="100%" stop-color="#DE4212" />
    </linearGradient>
    <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#7A1800" flood-opacity="0.32" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#7A1800" flood-opacity="0.18" />
    </filter>
  </defs>

  <rect width="512" height="512" fill="url(#bgGrad3)" />
  <rect width="512" height="512" fill="url(#sunGlow3)" />
  <rect x="1.5" y="1.5" width="509" height="509" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.18" />

  <g filter="url(#shadow3)">
    <!-- Base Lodge Structure -->
    <path d="
      M 256 116
      C 264 116, 272 120, 278 126
      L 392 232
      C 400 240, 401 252, 395 261
      C 388 270, 376 274, 365 274
      L 350 274
      L 350 354
      C 350 368, 338 380, 324 380
      L 188 380
      C 174 380, 162 368, 162 354
      L 162 274
      L 147 274
      C 136 274, 124 270, 117 261
      C 111 252, 112 240, 120 232
      L 234 126
      C 240 120, 248 116, 256 116
      Z
    " fill="url(#whiteGrad3)" />

    <!-- Signature Map-Pin Entryway Cutout -->
    <!-- Teardrop map pin with arched portal -->
    <path d="
      M 256 196
      C 286 196, 310 219, 310 248
      C 310 274, 290 300, 290 324
      L 290 380
      L 222 380
      L 222 324
      C 222 300, 202 274, 202 248
      C 202 219, 226 196, 256 196
      Z
    " fill="url(#doorGrad3)" />

    <!-- Radiant Inner White Pin Core -->
    <circle cx="256" cy="248" r="22" fill="#FFFFFF" />
    <!-- Center Brand Dot -->
    <circle cx="256" cy="248" r="10" fill="#F45B2A" />

    <!-- Modern Top Roof Beam/Chimney Accent (Architectural balance) -->
    <rect x="306" y="136" width="28" height="42" rx="6" fill="url(#whiteGrad3)" />
  </g>
</svg>
`;

async function run() {
  const proposals = [
    { name: 'concept1', svg: concept1Svg },
    { name: 'concept2', svg: concept2Svg },
    { name: 'concept3', svg: concept3Svg },
  ];

  for (const p of proposals) {
    const svgPath = path.join(outDir, `${p.name}.svg`);
    const pngPath = path.join(outDir, `${p.name}-512.png`);
    const smallPath = path.join(outDir, `${p.name}-48.png`);
    
    fs.writeFileSync(svgPath, p.svg.trim());
    await sharp(Buffer.from(p.svg)).resize(512, 512).png().toFile(pngPath);
    await sharp(Buffer.from(p.svg)).resize(48, 48).png().toFile(smallPath);
    console.log(`Rendered ${p.name} to 512px and 48px`);
  }
}

run().catch(console.error);
