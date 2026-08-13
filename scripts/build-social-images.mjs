import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const socialDir = path.join(publicDir, 'social');
const backgroundPath = path.join(root, 'scripts', 'assets', 'social-card-background.png');
const logoPath = path.join(publicDir, 'logo.png');

const cards = [
  {
    file: 'og-image.png',
    width: 1200,
    height: 630,
    logoSize: 188,
    logoX: 112,
    logoY: 220,
    titleX: 354,
    titleY: 298,
    subtitleY: 375,
    titleSize: 82,
    subtitleSize: 37,
  },
  {
    file: 'twitter-card.png',
    width: 1200,
    height: 675,
    logoSize: 196,
    logoX: 108,
    logoY: 239,
    titleX: 360,
    titleY: 320,
    subtitleY: 399,
    titleSize: 82,
    subtitleSize: 37,
  },
];

const xml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

await fs.mkdir(socialDir, { recursive: true });

for (const card of cards) {
  const logo = await sharp(logoPath)
    .trim({ background: '#ffffff', threshold: 10 })
    .resize(card.logoSize, card.logoSize, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer();

  const typography = Buffer.from(`
    <svg width="${card.width}" height="${card.height}" viewBox="0 0 ${card.width} ${card.height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${card.titleX}" y="${card.titleY}"
        fill="#202122" font-family="Georgia, 'Times New Roman', serif"
        font-size="${card.titleSize}" font-weight="700" letter-spacing="-2">${xml('AI Learning Wiki')}</text>
      <text x="${card.titleX + 3}" y="${card.subtitleY}"
        fill="#54595d" font-family="'Noto Sans KR', 'Malgun Gothic', sans-serif"
        font-size="${card.subtitleSize}" font-weight="400" letter-spacing="-1">${xml('AI와 LLM을 연결하는 백과사전')}</text>
    </svg>
  `);

  await sharp(backgroundPath)
    .resize(card.width, card.height, { fit: 'cover', position: 'centre' })
    .composite([
      { input: logo, left: card.logoX, top: card.logoY },
      { input: typography, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 100 })
    .toFile(path.join(socialDir, card.file));
}

console.log(`social images: ${cards.map(({ file, width, height }) => `${file} ${width}x${height}`).join(', ')}`);
