// Downloads Ukrainian TTS audio for sentences.
// Run: node scripts/download-sentence-audio.mjs

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, "..", "public", "audio");

const sentences = [
  [1, "Я знаю"],
  [2, "Він іде"],
  [3, "Вона читає"],
  [4, "Ми працюємо"],
  [5, "Це добре"],
  [6, "Дякую вам"],
  [7, "Доброго ранку"],
  [8, "Я люблю каву"],
  [9, "Він п'є чай"],
  [10, "Вона живе тут"],
  [11, "Ми їмо борщ"],
  [12, "Де є магазин?"],
  [13, "Я хочу воду"],
  [14, "Він читає книгу"],
  [15, "Ми маємо час"],
  [16, "Вона знає мене"],
  [17, "Я хочу їсти рис"],
  [18, "Він може говорити українською"],
  [19, "Вона любить читати книги"],
  [20, "Ми живемо в місті"],
  [21, "Я вивчаю українську мову"],
  [22, "Він працює кожного дня"],
  [23, "Де можна купити каву?"],
  [24, "Я думаю що це добре"],
];

function downloadTTS(text, filename) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=uk&client=tw-ob&q=${encoded}`;
    const outPath = path.join(audioDir, `${filename}.mp3`);

    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 100) {
      console.log(`  SKIP: ${filename} (already exists)`);
      return resolve(outPath);
    }

    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, { headers: { "User-Agent": "Mozilla/5.0" } }, (res2) => {
          const stream = fs.createWriteStream(outPath);
          res2.pipe(stream);
          stream.on("finish", () => { stream.close(); resolve(outPath); });
        }).on("error", reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for "${text}"`));
        return;
      }
      const stream = fs.createWriteStream(outPath);
      res.pipe(stream);
      stream.on("finish", () => { stream.close(); resolve(outPath); });
    }).on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(audioDir, { recursive: true });
  console.log(`Downloading ${sentences.length} sentence audio files...`);

  for (const [idx, text] of sentences) {
    const filename = `sentence-${String(idx).padStart(2, "0")}`;
    try {
      await downloadTTS(text, filename);
      console.log(`  OK: ${filename} ("${text}")`);
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`  FAIL: ${filename} ("${text}"):`, err.message);
    }
  }
  console.log("Done!");
}

main();
