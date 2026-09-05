import { PDFDocument } from "pdf-lib";

/** Combines JPEG pages ([{ bytes: Uint8Array, width, height }]) into one PDF, returns Uint8Array. */
export async function buildPdfFromJpegs(pages) {
  const pdfDoc = await PDFDocument.create();

  for (const { bytes, width, height } of pages) {
    const image = await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  return pdfDoc.save();
}
