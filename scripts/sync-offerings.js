import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

const CSV_PATH = './official_data.csv';
const JSON_OUTPUT_PATH = './src/data/official_offerings.json';

function sync() {
  console.log('🚀 開始同步咖啡清單...');

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ 找不到檔案: ${CSV_PATH}`);
    console.log('請先從 Google Sheet 下載 CSV 並重新命名為 official_data.csv 放在專案根目錄。');
    return;
  }

  try {
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const formattedData = records.map((row, index) => ({
      id: index + 1,
      store: row.store,
      name: row.name,
      origin: row.origin,
      process: row.process,
      roast: row.roast,
      // 將字串轉為陣列，並去除空白
      flavors: row.flavors.split(',').map(f => f.trim()).filter(f => f),
      price: parseInt(row.price) || 0,
      description: row.description
    }));

    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(formattedData, null, 2));
    console.log(`✅ 同步成功！共匯入 ${formattedData.length} 筆資料。`);
    console.log(`位置: ${JSON_OUTPUT_PATH}`);
  } catch (err) {
    console.error('❌ 轉換失敗:', err.message);
  }
}

sync();
