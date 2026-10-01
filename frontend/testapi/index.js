import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getApiKey() {
  const argKey = process.argv[2];
  if (argKey && argKey.trim() && !argKey.endsWith('.jpg') && !argKey.endsWith('.png')) {
    return argKey.trim();
  }

  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/VITE_GEMINI_API_KEY\s*=\s*(.+)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}

  return '';
}

function fileToGenerativePart(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'image/jpeg';
  if (ext === '.png') mimeType = 'image/png';
  if (ext === '.webp') mimeType = 'image/webp';

  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType
    }
  };
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testModelOcr(model, filePath, apiKey) {
  const fileName = path.basename(filePath);
  const imagePart = fileToGenerativePart(filePath);

  const prompt = `
  Ekstrak data NIK dan NAMA dari gambar KTP ini.
  Kembalikan HANYA format JSON murni seperti ini:
  {
    "nik": "351...",
    "nama": "NAMA LENGKAP"
  }
  `;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          imagePart
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const startTime = performance.now();

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      const durationSec = ((performance.now() - startTime) / 1000).toFixed(2);

      if (res.ok) {
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsedData = JSON.parse(rawText);

        console.log(`    ✅ [${model}] SUKSES (${durationSec} detik)!`);
        console.log(`       🆔 NIK  : ${parsedData.nik}`);
        console.log(`       👤 NAMA : ${parsedData.nama}`);
        return { success: true, durationSec, nik: parsedData.nik, nama: parsedData.nama };
      } 

      if (res.status === 503) {
        console.warn(`    ⚠️ [${model}] Server padat (503), mencoba ulang...`);
        await delay(2000);
      } else {
        console.error(`    ❌ [${model}] Gagal (${res.status}) [${durationSec}s]: ${data.error?.message?.substring(0, 70) || 'Error'}`);
        break;
      }
    } catch (err) {
      const durationSec = ((performance.now() - startTime) / 1000).toFixed(2);
      console.error(`    ❌ [${model}] Error [${durationSec}s]: ${err.message}`);
      break;
    }
  }

  return { success: false, durationSec: 0 };
}

async function runDirectFlashTest() {
  const apiKey = getApiKey();

  console.log('====================================================');
  console.log('   🔍 PENGUJIAN LANGSUNG GEMINI 3.7 & 3.8 FLASH');
  console.log('====================================================');

  if (!apiKey) {
    console.error('❌ GAGAL: API Key tidak ditemukan di .env!');
    process.exit(1);
  }

  // Cek file gambar KTP di folder
  const files = fs.readdirSync(__dirname).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.error(`❌ GAGAL: Tidak ada file gambar (.jpg/.png/.webp) di folder '${__dirname}'`);
    process.exit(1);
  }

  console.log(`🖼️  Ditemukan ${files.length} file gambar: ${files.join(', ')}`);

  // Target model Gemini 3.7 & 3.8 Flash
  const targetModels = ['gemini-3.7-flash', 'gemini-3.8-flash'];
  const results = [];

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    console.log(`\n====================================================`);
    console.log(`📄 MEMPROSES GAMBAR: ${file}`);
    console.log(`====================================================`);

    for (const model of targetModels) {
      console.log(`🧪 Menguji Model: ${model}...`);
      const res = await testModelOcr(model, filePath, apiKey);

      if (res.success) {
        results.push({
          file,
          model,
          durationSec: res.durationSec,
          nik: res.nik,
          nama: res.nama
        });
      }

      await delay(1000); // Jeda rate limit
    }
  }

  // Rekapitulasi Akhir
  console.log('\n====================================================');
  console.log('🏆 RANGKUMAN PENGUJIAN GEMINI 3.7 & 3.8 FLASH');
  console.log('====================================================');

  if (results.length > 0) {
    results.forEach((r, idx) => {
      console.log(`${idx + 1}. [Gambar: ${r.file}]`);
      console.log(`   └─ Model   : ${r.model}`);
      console.log(`   └─ Waktu   : ${r.durationSec} detik`);
      console.log(`   └─ Hasil   : NIK ${r.nik} | NAMA ${r.nama}\n`);
    });
  } else {
    console.log('❌ Model 3.7 / 3.8 Flash tidak merespon atau belum tersedia di API Key ini.');
  }

  console.log('====================================================\n');
}

runDirectFlashTest();