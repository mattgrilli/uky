// Downloads Ukrainian TTS audio from Google Translate for all letters and example words.
// Run: node scripts/download-audio.mjs

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, "..", "public", "audio");

// All items to download: [filename, ukrainian text]
const items = [
  // Letters
  ["letter-01", "а"],
  ["letter-02", "б"],
  ["letter-03", "в"],
  ["letter-04", "г"],
  ["letter-05", "ґ"],
  ["letter-06", "д"],
  ["letter-07", "е"],
  ["letter-08", "є"],
  ["letter-09", "ж"],
  ["letter-10", "з"],
  ["letter-11", "и"],
  ["letter-12", "і"],
  ["letter-13", "ї"],
  ["letter-14", "й"],
  ["letter-15", "к"],
  ["letter-16", "л"],
  ["letter-17", "м"],
  ["letter-18", "н"],
  ["letter-19", "о"],
  ["letter-20", "п"],
  ["letter-21", "р"],
  ["letter-22", "с"],
  ["letter-23", "т"],
  ["letter-24", "у"],
  ["letter-25", "ф"],
  ["letter-26", "х"],
  ["letter-27", "ц"],
  ["letter-28", "ч"],
  ["letter-29", "ш"],
  ["letter-30", "щ"],
  ["letter-31", "ь"],
  ["letter-32", "ю"],
  ["letter-33", "я"],
  // Example words
  ["word-01", "абетка"],
  ["word-02", "батько"],
  ["word-03", "вода"],
  ["word-04", "голова"],
  ["word-05", "ґанок"],
  ["word-06", "дім"],
  ["word-07", "елемент"],
  ["word-08", "Європа"],
  ["word-09", "жінка"],
  ["word-10", "земля"],
  ["word-11", "книга"],
  ["word-12", "місто"],
  ["word-13", "їжа"],
  ["word-14", "йогурт"],
  ["word-15", "кава"],
  ["word-16", "любов"],
  ["word-17", "мати"],
  ["word-18", "небо"],
  ["word-19", "око"],
  ["word-20", "привіт"],
  ["word-21", "рука"],
  ["word-22", "сонце"],
  ["word-23", "так"],
  ["word-24", "учень"],
  ["word-25", "фото"],
  ["word-26", "хліб"],
  ["word-27", "цукор"],
  ["word-28", "час"],
  ["word-29", "школа"],
  ["word-30", "щастя"],
  ["word-31", "день"],
  ["word-32", "юнак"],
  ["word-33", "яблуко"],
];

function downloadTTS(text, filename) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=uk&client=tw-ob&q=${encoded}`;

    const outPath = path.join(audioDir, `${filename}.mp3`);

    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        https.get(res.headers.location, { headers: { "User-Agent": "Mozilla/5.0" } }, (res2) => {
          const stream = fs.createWriteStream(outPath);
          res2.pipe(stream);
          stream.on("finish", () => {
            stream.close();
            resolve(outPath);
          });
        }).on("error", reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for "${text}"`));
        return;
      }

      const stream = fs.createWriteStream(outPath);
      res.pipe(stream);
      stream.on("finish", () => {
        stream.close();
        resolve(outPath);
      });
    }).on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(audioDir, { recursive: true });

  console.log(`Downloading ${items.length} audio files...`);

  for (const [filename, text] of items) {
    try {
      await downloadTTS(text, filename);
      console.log(`  OK: ${filename} ("${text}")`);
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`  FAIL: ${filename} ("${text}"):`, err.message);
    }
  }

  console.log("Done!");
}

main();
