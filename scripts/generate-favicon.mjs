/**
 * generate-favicon.mjs
 * Creates a minimal valid favicon.ico (16×16 and 32×32 BMP-based ICO)
 * with the portfolio accent color #6c63ff.
 *
 * Run: node scripts/generate-favicon.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const outPath = join(root, 'public/favicon.ico');
mkdirSync(dirname(outPath), { recursive: true });

// ICO file format:
// - ICONDIR header (6 bytes)
// - ICONDIRENTRY for each image (16 bytes each)
// - DIB (Device Independent Bitmap) image data for each entry

// Color: #6c63ff → R=0x6c, G=0x63, B=0xff
const R = 0x6c, G = 0x63, B = 0xff;

/**
 * Build a 32-bpp BMP DIB for a solid-color square icon of `size` pixels.
 * ICO images use a DIB with an AND mask appended.
 * @param {number} size - width and height in pixels (e.g. 16 or 32)
 * @returns {Buffer}
 */
function buildDIB(size) {
  const pixelCount = size * size;
  const rowBytes = size * 4; // 32bpp, no padding needed for powers of 2
  const xorDataSize = pixelCount * 4; // BGRA pixels
  const andDataSize = Math.ceil(size / 8) * size; // 1bpp AND mask, 4-byte aligned rows
  const andRowBytes = Math.ceil(Math.ceil(size / 8) / 4) * 4;
  const andDataSizeAligned = andRowBytes * size;

  const dibHeaderSize = 40;
  const totalSize = dibHeaderSize + xorDataSize + andDataSizeAligned;
  const buf = Buffer.alloc(totalSize, 0);
  let off = 0;

  // BITMAPINFOHEADER (40 bytes)
  buf.writeUInt32LE(40, off); off += 4;           // biSize
  buf.writeInt32LE(size, off); off += 4;           // biWidth
  buf.writeInt32LE(size * 2, off); off += 4;       // biHeight (doubled for ICO: XOR + AND mask)
  buf.writeUInt16LE(1, off); off += 2;             // biPlanes
  buf.writeUInt16LE(32, off); off += 2;            // biBitCount (32bpp)
  buf.writeUInt32LE(0, off); off += 4;             // biCompression (BI_RGB)
  buf.writeUInt32LE(xorDataSize, off); off += 4;   // biSizeImage
  buf.writeInt32LE(0, off); off += 4;              // biXPelsPerMeter
  buf.writeInt32LE(0, off); off += 4;              // biYPelsPerMeter
  buf.writeUInt32LE(0, off); off += 4;             // biClrUsed
  buf.writeUInt32LE(0, off); off += 4;             // biClrImportant

  // XOR bitmap: rows stored bottom-to-top, each pixel is BGRA
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      buf[off++] = B;     // Blue
      buf[off++] = G;     // Green
      buf[off++] = R;     // Red
      buf[off++] = 0xFF;  // Alpha (fully opaque)
    }
  }

  // AND mask: all zeros = fully opaque (no transparency holes)
  // Already zeroed by Buffer.alloc, so off just needs to advance
  off += andDataSizeAligned;

  return buf;
}

// Build DIBs for 16×16 and 32×32
const dib16 = buildDIB(16);
const dib32 = buildDIB(32);

// ICO ICONDIR header
// Reserved(2) + Type(2)=1 + Count(2)=2
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);   // Reserved
icoHeader.writeUInt16LE(1, 2);   // Type: 1 = ICO
icoHeader.writeUInt16LE(2, 4);   // Count: 2 images

// Each ICONDIRENTRY is 16 bytes:
//   Width(1) Height(1) ColorCount(1) Reserved(1) Planes(2) BitCount(2) BytesInRes(4) ImageOffset(4)
const entry16 = Buffer.alloc(16);
const entry32 = Buffer.alloc(16);

const headerSize = 6;
const entrySize = 16;
const numImages = 2;
const dataOffset16 = headerSize + entrySize * numImages;          // after header + 2 entries
const dataOffset32 = dataOffset16 + dib16.length;

// Entry for 16×16
entry16[0] = 16;   // Width
entry16[1] = 16;   // Height
entry16[2] = 0;    // ColorCount (0 = more than 256 colors)
entry16[3] = 0;    // Reserved
entry16.writeUInt16LE(1, 4);              // Planes
entry16.writeUInt16LE(32, 6);            // BitCount
entry16.writeUInt32LE(dib16.length, 8);  // BytesInRes
entry16.writeUInt32LE(dataOffset16, 12); // ImageOffset

// Entry for 32×32
entry32[0] = 32;
entry32[1] = 32;
entry32[2] = 0;
entry32[3] = 0;
entry32.writeUInt16LE(1, 4);
entry32.writeUInt16LE(32, 6);
entry32.writeUInt32LE(dib32.length, 8);
entry32.writeUInt32LE(dataOffset32, 12);

const icoBuffer = Buffer.concat([icoHeader, entry16, entry32, dib16, dib32]);
writeFileSync(outPath, icoBuffer);
console.log(`Created: ${outPath} (${icoBuffer.length} bytes, 16×16 + 32×32)`);
