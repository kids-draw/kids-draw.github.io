import sharp from 'sharp';
import fs from 'fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0B132B" />
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#46EC67" />
      <stop offset="50%" stop-color="#12EDAB" />
      <stop offset="100%" stop-color="#ADED92" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDFBF7" />
      <stop offset="100%" stop-color="#F5F3E9" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#12EDAB" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Playful Background Circles -->
  <circle cx="100" cy="120" r="180" fill="#1E7D94" opacity="0.15" />
  <circle cx="1100" cy="500" r="220" fill="#46EC67" opacity="0.12" />
  <circle cx="950" cy="100" r="140" fill="#12EDAB" opacity="0.1" />

  <!-- Canvas Board Preview Card -->
  <g transform="translate(100, 80)">
    <rect width="1000" height="470" rx="32" fill="url(#cardGrad)" filter="url(#glow)" stroke="#1E7D94" stroke-width="4" stroke-opacity="0.3" />
    
    <!-- Top Bar inside Card -->
    <rect x="0" y="0" width="1000" height="70" rx="32" fill="#FFFFFF" fill-opacity="0.8" />
    <circle cx="40" cy="35" r="10" fill="#FF5E5E" />
    <circle cx="70" cy="35" r="10" fill="#FFBB00" />
    <circle cx="100" cy="35" r="10" fill="#46EC67" />
    
    <!-- Drawing Art simulation -->
    <path d="M 120 300 Q 250 180 380 280 T 640 240 T 900 320" fill="none" stroke="url(#brandGrad)" stroke-width="16" stroke-linecap="round" />
    <path d="M 180 360 Q 320 440 500 360 T 820 400" fill="none" stroke="#FF4365" stroke-width="12" stroke-linecap="round" opacity="0.8" />
    <path d="M 300 200 Q 450 120 600 220" fill="none" stroke="#FFD124" stroke-width="10" stroke-linecap="round" opacity="0.9" />

    <!-- Logo & Brand Header in Card -->
    <g transform="translate(60, 110)">
      <!-- Sparkle Icon Box -->
      <rect width="70" height="70" rx="20" fill="url(#brandGrad)" stroke="#1E7D94" stroke-width="3" />
      <path d="M 35 15 L 42 28 L 55 35 L 42 42 L 35 55 L 28 42 L 15 35 L 28 28 Z" fill="#1E7D94" />
      
      <!-- Brand Text -->
      <text x="90" y="52" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="52" fill="#1E7D94" letter-spacing="-1">Kids<tspan fill="#46EC67">Draw</tspan></text>
      
      <!-- Subtitle -->
      <text x="92" y="86" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="#1E7D94" opacity="0.85">Free Online Magic Drawing Board for Kids ✨</text>
    </g>

    <!-- Badges / Features -->
    <g transform="translate(60, 390)">
      <!-- Badge 1: 100% Private -->
      <rect width="180" height="42" rx="21" fill="#ADED92" fill-opacity="0.4" stroke="#1E7D94" stroke-width="2" />
      <text x="90" y="27" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#1E7D94" text-anchor="middle">🛡️ 100% Private</text>
      
      <!-- Badge 2: Instant PNG Download -->
      <rect x="200" width="220" height="42" rx="21" fill="#12EDAB" fill-opacity="0.3" stroke="#1E7D94" stroke-width="2" />
      <text x="310" y="27" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#1E7D94" text-anchor="middle">⚡ Instant PNG Export</text>

      <!-- Badge 3: 7 Languages -->
      <rect x="440" width="180" height="42" rx="21" fill="#46EC67" fill-opacity="0.3" stroke="#1E7D94" stroke-width="2" />
      <text x="530" y="27" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#1E7D94" text-anchor="middle">🌍 7 Languages</text>

      <!-- Badge 4: No Sign-Up -->
      <rect x="640" width="190" height="42" rx="21" fill="#FFD124" fill-opacity="0.3" stroke="#1E7D94" stroke-width="2" />
      <text x="735" y="27" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#1E7D94" text-anchor="middle">🎉 No Registration</text>
    </g>
  </g>

  <!-- URL Watermark -->
  <text x="600" y="600" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="20" fill="#ADED92" text-anchor="middle" letter-spacing="1">https://kids-draw.github.io</text>
</svg>`;

async function generate() {
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile('public/og-image.png');
  console.log('og-image.png generated successfully!');
}

generate();
