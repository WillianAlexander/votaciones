const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../src/assets/BASESOCIOS.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../src/assets/socios.json');

try {
  const workbook = XLSX.readFile(INPUT_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  // Guardar JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`✔️  Generado ${OUTPUT_FILE} con ${data.length} registros.`);
} catch (err) {
  console.error('Error al convertir el Excel:', err);
  process.exit(1);
} 