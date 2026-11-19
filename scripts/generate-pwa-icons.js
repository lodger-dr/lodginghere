const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const appDir = path.join(projectRoot, 'src', 'app');
const previewsDir = path.join(projectRoot, 'public', 'previews');

if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

// Master SVG Design (512x512)
// Designed for maskable compatibility (inner 80% circle safe zone), 
// high-DPI retina display, iOS home screens, Android adaptive icons, and browser favicons.
const masterIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Canvas Gradients -->
    <linearGradient id="lhBgGrad" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#FF7927" />
      <stop offset="45%" stop-color="#F45B2A" />
      <stop offset="100%" stop-color="#CC380E" />
    </linearGradient>

    <!-- Top Specular Ambient Glow for Tactile Material Finish -->
    <radialGradient id="lhAmbientGlow" cx="50%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <!-- Subtle Diagonal Sheen for Extra Polish -->
    <linearGradient id="lhSheen" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- White Glyph Body Gradient -->
    <linearGradient id="lhGlyphGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF2EC" />
    </linearGradient>

    <!-- Inner Cutout Gradient (revealing warm dimensional depth) -->
    <linearGradient id="lhInnerCutout" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF6B30" />
      <stop offset="100%" stop-color="#DE4212" />
    </linearGradient>

    <!-- Layered Drop Shadow for Tactile Elevation -->
    <filter id="lhElevation" x="-20%" y="-20%" width="140%" height="140%">
      <!-- Deep ambient shadow -->
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#6E1600" flood-opacity="0.32" />
      <!-- Crisp key-light contact shadow -->
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#6E1600" flood-opacity="0.20" />
    </filter>

    <!-- Subtle Bevel Highlight for Glyph Ridge -->
    <filter id="lhGlyphBevel" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="1" flood-color="#FFFFFF" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Full-bleed background for maskable compatibility -->
  <rect width="512" height="512" fill="url(#lhBgGrad)" />
  <rect width="512" height="512" fill="url(#lhAmbientGlow)" />
  <rect width="512" height="512" fill="url(#lhSheen)" />

  <!-- Crisp Inner Bezel Edge (Apple/Google Native Tile Style) -->
  <rect x="1.5" y="1.5" width="509" height="509" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-opacity="0.20" />

  <!-- Hero Mark Group: Perfectly centered and bounded within the 80% safe zone circle (diameter 410) -->
  <!-- Total bounding box: width ~252, height ~260, from y=120 to y=380 -->
  <g filter="url(#lhElevation)">
    
    <!-- Architectural Lodge Silhouette with Rounded Apex and Eaves -->
    <path d="
      M 256 120
      C 264 120, 272 124, 278 130
      L 380 230
      C 388 238, 389 250, 383 259
      C 377 268, 365 272, 354 272
      L 342 272
      L 342 352
      C 342 366, 330 378, 316 378
      L 196 378
      C 182 378, 170 366, 170 352
      L 170 272
      L 158 272
      C 147 272, 135 268, 129 259
      C 123 250, 124 238, 132 230
      L 234 130
      C 240 124, 248 120, 256 120
      Z
    " fill="url(#lhGlyphGrad)" />

    <!-- Modern Architectural Chimney / Beacon Tower (Right Roof Slope) -->
    <!-- Echoing the official LodgeHere geometric roof flair -->
    <path d="
      M 298 156
      L 298 136
      C 298 131, 302 127, 307 127
      L 321 127
      C 326 127, 330 131, 330 136
      L 330 188
      Z
    " fill="url(#lhGlyphGrad)" opacity="0.94" />

    <!-- Center Cutout: The Integrated Geolocation Pin & Welcoming Archway -->
    <!-- Combines the Map Pin ('Here') with the Lodge Entrance ('Lodge') -->
    <path d="
      M 256 196
      C 285 196, 308 219, 308 247
      C 308 272, 289 297, 289 320
      L 289 378
      L 223 378
      L 223 320
      C 223 297, 204 272, 204 247
      C 204 219, 227 196, 256 196
      Z
    " fill="url(#lhInnerCutout)" />

    <!-- Inner Keyhole Drop Shadow for Carved Dimensional Look -->
    <path d="
      M 256 196
      C 285 196, 308 219, 308 247
      C 308 272, 289 297, 289 320
      L 289 378
      L 223 378
      L 223 320
      C 223 297, 204 272, 204 247
      C 204 219, 227 196, 256 196
      Z
    " fill="none" stroke="#9E2200" stroke-width="2" stroke-opacity="0.25" />

    <!-- Radiant Location Beacon Core -->
    <!-- Outer White Ring -->
    <circle cx="256" cy="247" r="20" fill="#FFFFFF" />
    <!-- Inner Brand Flame Dot -->
    <circle cx="256" cy="247" r="9" fill="#F45B2A" />

    <!-- Subtle Campus Community Base Bar (Floor Accent) -->
    <rect x="227" y="372" width="58" height="6" rx="3" fill="#FFFFFF" opacity="0.4" />
  </g>
</svg>
`;

async function generateAll() {
  console.log('🎨 Starting LodgeHere PWA App Icon Redesign Generation...');

  const svgBuffer = Buffer.from(masterIconSvg.trim());

  // 1. Write Vector SVG to public/icon.svg
  const publicSvgPath = path.join(publicDir, 'icon.svg');
  fs.writeFileSync(publicSvgPath, masterIconSvg.trim(), 'utf8');
  console.log('✓ Wrote vector SVG to public/icon.svg');

  // 2. Generate 512x512 PWA icons
  // - public/icon-512.png (PWA manifest standard)
  // - public/icon.png (Next.js layout metadata & fallback)
  // - src/app/icon.png (Next.js App router icon file)
  const icon512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), icon512);
  fs.writeFileSync(path.join(appDir, 'icon.png'), icon512);
  console.log('✓ Wrote 512x512 icons: public/icon-512.png, public/icon.png, src/app/icon.png');

  // 3. Generate 192x192 PWA icons
  // - public/icon-192.png (PWA manifest standard, maskable)
  const icon192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  console.log('✓ Wrote 192x192 icon: public/icon-192.png');

  // 4. Generate 180x180 Apple Touch icons
  // - public/apple-touch-icon.png (iOS Web Clip / home screen)
  // - src/app/apple-icon.png (Next.js App Router apple-icon)
  const icon180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), icon180);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), icon180);
  console.log('✓ Wrote 180x180 Apple touch icons: public/apple-touch-icon.png, src/app/apple-icon.png');

  // 5. Generate Favicons
  // - public/favicon-32x32.png
  // - public/favicon.ico & src/app/favicon.ico (standard 32x32 PNG-embedded ICO)
  const icon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const icon16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), icon32);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), icon16);

  // Simple, valid ICO header with 32x32 and 16x16 PNG entries
  // Structure: ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes each) + image data
  function createIco(images) {
    const numImages = images.length;
    const headerSize = 6 + 16 * numImages;
    let offset = headerSize;

    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type 1 = ICO
    header.writeUInt16LE(numImages, 4); // count

    const dataBuffers = [];

    images.forEach((img, i) => {
      const entryOffset = 6 + i * 16;
      header.writeUInt8(img.width >= 256 ? 0 : img.width, entryOffset); // width
      header.writeUInt8(img.height >= 256 ? 0 : img.height, entryOffset + 1); // height
      header.writeUInt8(0, entryOffset + 2); // color palette
      header.writeUInt8(0, entryOffset + 3); // reserved
      header.writeUInt16LE(1, entryOffset + 4); // color planes
      header.writeUInt16LE(32, entryOffset + 6); // bits per pixel
      header.writeUInt32LE(img.buffer.length, entryOffset + 8); // size of image data
      header.writeUInt32LE(offset, entryOffset + 12); // offset of image data

      dataBuffers.push(img.buffer);
      offset += img.buffer.length;
    });

    return Buffer.concat([header, ...dataBuffers]);
  }

  const icoBuffer = createIco([
    { width: 32, height: 32, buffer: icon32 },
    { width: 16, height: 16, buffer: icon16 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Wrote valid multi-resolution favicon.ico to public/ and src/app/');

  // 6. Generate Verification Previews (for Maskable Safe Zone check)
  // A. Circular Mask (Android home screen)
  const circleMaskSvg = `
    <svg width="512" height="512">
      <circle cx="256" cy="256" r="230" fill="#fff" />
    </svg>
  `;
  const circleMasked = await sharp(icon512)
    .composite([{ input: Buffer.from(circleMaskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(previewsDir, 'preview-android-circle.png'), circleMasked);

  // B. Squircle Mask (Samsung / OneUI / iOS)
  const squircleMaskSvg = `
    <svg width="512" height="512">
      <rect x="0" y="0" width="512" height="512" rx="115" fill="#fff" />
    </svg>
  `;
  const squircleMasked = await sharp(icon512)
    .composite([{ input: Buffer.from(squircleMaskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(previewsDir, 'preview-ios-squircle.png'), squircleMasked);

  console.log('✓ Generated preview masks in public/previews/');
  console.log('🎉 All icons successfully generated and saved!');
}

generateAll().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
