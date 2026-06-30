/**
 * generate-pdf.mjs
 * Creates a minimal valid PDF placeholder at src/assets/cv/dina-cv.pdf.
 * This is a development placeholder only — replace with the real CV before deployment.
 *
 * Run: node scripts/generate-pdf.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const outPath = join(root, 'src/assets/cv/dina-cv.pdf');
mkdirSync(dirname(outPath), { recursive: true });

// Minimal valid PDF 1.4 with one page containing a text note.
// Structure: header, catalog, pages, page, content stream, xref, trailer.
const content = `BT /F1 14 Tf 72 720 Td (CV Dina Kartika P. - PLACEHOLDER - Ganti sebelum deployment.) Tj ET`;
const contentLen = content.length;

const pdf = [
  `%PDF-1.4`,
  `1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj`,
  `2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj`,
  `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]`,
  `  /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj`,
  `4 0 obj << /Length ${contentLen} >>`,
  `stream`,
  content,
  `endstream`,
  `endobj`,
  `5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`,
].join('\n');

// Build cross-reference table
const lines = pdf.split('\n');
const offsets = [];
let pos = 0;
const objRegex = /^(\d+) 0 obj/;

// We need byte offsets for each object — rebuild with exact byte counting
const encoder = new TextEncoder();

// Re-assemble and track offsets
const parts = [];
let byteOffset = 0;
const objOffsets = {};

function addLine(line) {
  const bytes = Buffer.from(line + '\n', 'utf8');
  parts.push(bytes);
  byteOffset += bytes.length;
}

const pdfLines = [
  `%PDF-1.4`,
  ``,
  `1 0 obj`,
  `<< /Type /Catalog /Pages 2 0 R >>`,
  `endobj`,
  ``,
  `2 0 obj`,
  `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
  `endobj`,
  ``,
  `3 0 obj`,
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]`,
  `   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>`,
  `endobj`,
  ``,
  `4 0 obj`,
  `<< /Length ${contentLen} >>`,
  `stream`,
  content,
  `endstream`,
  `endobj`,
  ``,
  `5 0 obj`,
  `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
  `endobj`,
  ``,
];

byteOffset = 0;

for (const line of pdfLines) {
  const m = line.match(/^(\d+) 0 obj$/);
  if (m) {
    objOffsets[parseInt(m[1])] = byteOffset;
  }
  const bytes = Buffer.from(line + '\n', 'utf8');
  parts.push(bytes);
  byteOffset += bytes.length;
}

// xref table start offset
const xrefOffset = byteOffset;

const xrefLines = [
  `xref`,
  `0 6`,
  `0000000000 65535 f `,
];

for (let i = 1; i <= 5; i++) {
  xrefLines.push(`${String(objOffsets[i]).padStart(10, '0')} 00000 n `);
}

xrefLines.push(
  `trailer`,
  `<< /Size 6 /Root 1 0 R >>`,
  `startxref`,
  `${xrefOffset}`,
  `%%EOF`,
);

for (const line of xrefLines) {
  parts.push(Buffer.from(line + '\n', 'utf8'));
}

const finalBuf = Buffer.concat(parts);
writeFileSync(outPath, finalBuf);
console.log(`Created: ${outPath} (${finalBuf.length} bytes)`);
console.log('NOTE: This is a placeholder PDF. Replace with the real CV before deployment.');
