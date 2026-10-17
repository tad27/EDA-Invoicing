const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPNG(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const body = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, body, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Draw the EDA Invoicing stylized Pixel 'E' Logo inside badge
function renderLogo(size, isMaskable = false, isAppleTouch = false) {
  return createPNG(size, size, (x, y, w, h) => {
    // Center point
    const cx = w / 2;
    const cy = h / 2;

    // Badge sizing
    // If maskable, safe zone is 80%, so badge occupies central area with padding
    const badgeScale = isMaskable ? 0.72 : (isAppleTouch ? 1.0 : 0.88);
    const badgeSize = w * badgeScale;
    const badgeRadius = isAppleTouch ? 0 : (badgeSize * 0.22); // iOS clips icons itself
    const bx1 = (w - badgeSize) / 2;
    const by1 = (h - badgeSize) / 2;
    const bx2 = bx1 + badgeSize;
    const by2 = by1 + badgeSize;

    // Check if inside badge rounded rect
    let inBadge = false;
    if (x >= bx1 && x < bx2 && y >= by1 && y < by2) {
      if (badgeRadius === 0) {
        inBadge = true;
      } else {
        // check corners
        const nearLeft = x < bx1 + badgeRadius;
        const nearRight = x >= bx2 - badgeRadius;
        const nearTop = y < by1 + badgeRadius;
        const nearBottom = y >= by2 - badgeRadius;

        if ((nearLeft || nearRight) && (nearTop || nearBottom)) {
          const cornerX = nearLeft ? bx1 + badgeRadius : bx2 - badgeRadius;
          const cornerY = nearTop ? by1 + badgeRadius : by2 - badgeRadius;
          const distSq = (x - cornerX) ** 2 + (y - cornerY) ** 2;
          inBadge = distSq <= badgeRadius ** 2;
        } else {
          inBadge = true;
        }
      }
    }

    if (!inBadge) {
      // If maskable or Apple touch, fill outer canvas with solid black (#000000)
      if (isMaskable || isAppleTouch) {
        return [0, 0, 0, 255];
      }
      return [0, 0, 0, 0]; // transparent outside badge
    }

    // Inside Badge: Default background is #000000 (Black)
    // 3 cols x 5 rows grid for letter 'E'
    const gridCols = 3;
    const gridRows = 5;

    // Glyphs proportion inside badge
    const glyphsScale = isMaskable ? 0.44 : 0.52;
    const gridH = badgeSize * glyphsScale;
    const blockSize = gridH / 5.8;
    const gap = blockSize * 0.28;
    const gridW = gridCols * blockSize + (gridCols - 1) * gap;
    const totalH = gridRows * blockSize + (gridRows - 1) * gap;

    const gx1 = cx - gridW / 2;
    const gy1 = cy - totalH / 2;

    // Active blocks in 3x5 matrix:
    // Row 0: [0, 1, 2] - Blue
    // Row 1: [0] - Blue
    // Row 2: [0, 1] Blue, [2] White (#FFFFFF)
    // Row 3: [0] - Blue
    // Row 4: [0, 1, 2] - Blue
    const blockCornerRadius = blockSize * 0.18;

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        let isActive = false;
        let isWhite = false;

        if (r === 0 || r === 4) {
          isActive = true;
        } else if (r === 1 || r === 3) {
          if (c === 0) isActive = true;
        } else if (r === 2) {
          isActive = true;
          if (c === 2) isWhite = true; // signature white dot
        }

        if (isActive) {
          const px = gx1 + c * (blockSize + gap);
          const py = gy1 + r * (blockSize + gap);

          if (x >= px && x < px + blockSize && y >= py && y < py + blockSize) {
            // Rounded corners on blocks
            let inBlock = true;
            const bNearLeft = x < px + blockCornerRadius;
            const bNearRight = x >= px + blockSize - blockCornerRadius;
            const bNearTop = y < py + blockCornerRadius;
            const bNearBottom = y >= py + blockSize - blockCornerRadius;

            if ((bNearLeft || bNearRight) && (bNearTop || bNearBottom)) {
              const bCornerX = bNearLeft ? px + blockCornerRadius : px + blockSize - blockCornerRadius;
              const bCornerY = bNearTop ? py + blockCornerRadius : py + blockSize - blockCornerRadius;
              const distSq = (x - bCornerX) ** 2 + (y - bCornerY) ** 2;
              inBlock = distSq <= blockCornerRadius ** 2;
            }

            if (inBlock) {
              if (isWhite) {
                return [255, 255, 255, 255]; // White block detail
              }
              return [61, 90, 254, 255]; // Signal Blue #3D5AFE
            }
          }
        }
      }
    }

    return [0, 0, 0, 255]; // Badge background color
  });
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons for EDA Invoicing...');

// 1. Apple Touch Icon for iPhone / iPad (180x180)
const appleTouch = renderLogo(180, false, true);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
console.log('Generated apple-touch-icon.png (180x180)');

// 2. PWA Standard 192x192
const pwa192 = renderLogo(192, false, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
console.log('Generated pwa-192x192.png (192x192)');

// 3. PWA Standard 512x512
const pwa512 = renderLogo(512, false, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
console.log('Generated pwa-512x512.png (512x512)');

// 4. PWA Maskable 512x512 (with 15% safe padding)
const pwaMaskable = renderLogo(512, true, false);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);
console.log('Generated pwa-maskable-512x512.png (512x512)');

console.log('All PWA and iOS icons generated successfully!');
