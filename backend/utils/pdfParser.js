import { readFileSync } from 'fs';

async function parsePDF(filePath) {
  try {
    // Use dynamic import
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js');
    const pdf = pdfParse.default;
    
    const dataBuffer = readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF Parse Error:', error);
    throw new Error('Could not parse PDF');
  }
}

export default parsePDF;
