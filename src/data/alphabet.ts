export type LetterCategory = "vowel" | "consonant" | "semivowel" | "sign";

export interface UkrainianLetter {
  upper: string;
  lower: string;
  name: string;
  transliteration: string;
  ipa: string;
  hint: string;
  category: LetterCategory;
  exampleWord: string;
  exampleMeaning: string;
  /** English-speakable phonetic approximation for TTS fallback */
  phonetic: string;
  /** English-speakable approximation of the example word */
  examplePhonetic: string;
  index: number;
}

export const alphabet: UkrainianLetter[] = [
  { index: 1, upper: "А", lower: "а", name: "а", transliteration: "a", ipa: "/ɑ/", hint: "'a' in 'father'", category: "vowel", exampleWord: "абетка", exampleMeaning: "alphabet", phonetic: "ah", examplePhonetic: "ah-bet-kah" },
  { index: 2, upper: "Б", lower: "б", name: "бе", transliteration: "b", ipa: "/b/", hint: "'b' in 'bat'", category: "consonant", exampleWord: "батько", exampleMeaning: "father", phonetic: "beh", examplePhonetic: "baht-koh" },
  { index: 3, upper: "В", lower: "в", name: "ве", transliteration: "v", ipa: "/ʋ/", hint: "'v' in 'vine'", category: "consonant", exampleWord: "вода", exampleMeaning: "water", phonetic: "veh", examplePhonetic: "voh-dah" },
  { index: 4, upper: "Г", lower: "г", name: "ге", transliteration: "h", ipa: "/ɦ/", hint: "'h' in 'hello' (voiced)", category: "consonant", exampleWord: "голова", exampleMeaning: "head", phonetic: "heh", examplePhonetic: "ho-lo-vah" },
  { index: 5, upper: "Ґ", lower: "ґ", name: "ґе", transliteration: "g", ipa: "/ɡ/", hint: "'g' in 'go'", category: "consonant", exampleWord: "ґанок", exampleMeaning: "porch", phonetic: "geh", examplePhonetic: "gah-nok" },
  { index: 6, upper: "Д", lower: "д", name: "де", transliteration: "d", ipa: "/d/", hint: "'d' in 'do'", category: "consonant", exampleWord: "дім", exampleMeaning: "house", phonetic: "deh", examplePhonetic: "deem" },
  { index: 7, upper: "Е", lower: "е", name: "е", transliteration: "e", ipa: "/ɛ/", hint: "'e' in 'bet'", category: "vowel", exampleWord: "елемент", exampleMeaning: "element", phonetic: "eh", examplePhonetic: "eh-leh-ment" },
  { index: 8, upper: "Є", lower: "є", name: "є", transliteration: "ye", ipa: "/jɛ/", hint: "'ye' in 'yes'", category: "vowel", exampleWord: "Європа", exampleMeaning: "Europe", phonetic: "yeh", examplePhonetic: "yev-roh-pah" },
  { index: 9, upper: "Ж", lower: "ж", name: "же", transliteration: "zh", ipa: "/ʒ/", hint: "'s' in 'pleasure'", category: "consonant", exampleWord: "жінка", exampleMeaning: "woman", phonetic: "zheh", examplePhonetic: "zheen-kah" },
  { index: 10, upper: "З", lower: "з", name: "зе", transliteration: "z", ipa: "/z/", hint: "'z' in 'zoo'", category: "consonant", exampleWord: "земля", exampleMeaning: "earth", phonetic: "zeh", examplePhonetic: "zem-lyah" },
  { index: 11, upper: "И", lower: "и", name: "и", transliteration: "y", ipa: "/ɪ/", hint: "'i' in 'bit'", category: "vowel", exampleWord: "книга", exampleMeaning: "book", phonetic: "ih", examplePhonetic: "knih-gah" },
  { index: 12, upper: "І", lower: "і", name: "і", transliteration: "i", ipa: "/i/", hint: "'ee' in 'meet'", category: "vowel", exampleWord: "місто", exampleMeaning: "city", phonetic: "ee", examplePhonetic: "mees-toh" },
  { index: 13, upper: "Ї", lower: "ї", name: "ї", transliteration: "yi", ipa: "/ji/", hint: "'yee' in 'yeet'", category: "vowel", exampleWord: "їжа", exampleMeaning: "food", phonetic: "yee", examplePhonetic: "yee-zhah" },
  { index: 14, upper: "Й", lower: "й", name: "йот", transliteration: "y", ipa: "/j/", hint: "'y' in 'yes'", category: "semivowel", exampleWord: "йогурт", exampleMeaning: "yogurt", phonetic: "yot", examplePhonetic: "yo-goort" },
  { index: 15, upper: "К", lower: "к", name: "ка", transliteration: "k", ipa: "/k/", hint: "'k' in 'kit'", category: "consonant", exampleWord: "кава", exampleMeaning: "coffee", phonetic: "kah", examplePhonetic: "kah-vah" },
  { index: 16, upper: "Л", lower: "л", name: "ел", transliteration: "l", ipa: "/l/", hint: "'l' in 'let'", category: "consonant", exampleWord: "любов", exampleMeaning: "love", phonetic: "el", examplePhonetic: "lyoo-bohv" },
  { index: 17, upper: "М", lower: "м", name: "ем", transliteration: "m", ipa: "/m/", hint: "'m' in 'mom'", category: "consonant", exampleWord: "мати", exampleMeaning: "mother", phonetic: "em", examplePhonetic: "mah-tih" },
  { index: 18, upper: "Н", lower: "н", name: "ен", transliteration: "n", ipa: "/n/", hint: "'n' in 'no'", category: "consonant", exampleWord: "небо", exampleMeaning: "sky", phonetic: "en", examplePhonetic: "neh-boh" },
  { index: 19, upper: "О", lower: "о", name: "о", transliteration: "o", ipa: "/ɔ/", hint: "'o' in 'more'", category: "vowel", exampleWord: "око", exampleMeaning: "eye", phonetic: "oh", examplePhonetic: "oh-koh" },
  { index: 20, upper: "П", lower: "п", name: "пе", transliteration: "p", ipa: "/p/", hint: "'p' in 'pen'", category: "consonant", exampleWord: "привіт", exampleMeaning: "hello", phonetic: "peh", examplePhonetic: "prih-veet" },
  { index: 21, upper: "Р", lower: "р", name: "ер", transliteration: "r", ipa: "/r/", hint: "rolled 'r'", category: "consonant", exampleWord: "рука", exampleMeaning: "hand", phonetic: "er", examplePhonetic: "roo-kah" },
  { index: 22, upper: "С", lower: "с", name: "ес", transliteration: "s", ipa: "/s/", hint: "'s' in 'see'", category: "consonant", exampleWord: "сонце", exampleMeaning: "sun", phonetic: "es", examplePhonetic: "sohn-tseh" },
  { index: 23, upper: "Т", lower: "т", name: "те", transliteration: "t", ipa: "/t/", hint: "'t' in 'top'", category: "consonant", exampleWord: "так", exampleMeaning: "yes", phonetic: "teh", examplePhonetic: "tahk" },
  { index: 24, upper: "У", lower: "у", name: "у", transliteration: "u", ipa: "/u/", hint: "'oo' in 'moon'", category: "vowel", exampleWord: "учень", exampleMeaning: "student", phonetic: "oo", examplePhonetic: "oo-chen" },
  { index: 25, upper: "Ф", lower: "ф", name: "еф", transliteration: "f", ipa: "/f/", hint: "'f' in 'fun'", category: "consonant", exampleWord: "фото", exampleMeaning: "photo", phonetic: "ef", examplePhonetic: "foh-toh" },
  { index: 26, upper: "Х", lower: "х", name: "ха", transliteration: "kh", ipa: "/x/", hint: "'ch' in 'loch'", category: "consonant", exampleWord: "хліб", exampleMeaning: "bread", phonetic: "khah", examplePhonetic: "khleeb" },
  { index: 27, upper: "Ц", lower: "ц", name: "це", transliteration: "ts", ipa: "/t͡s/", hint: "'ts' in 'cats'", category: "consonant", exampleWord: "цукор", exampleMeaning: "sugar", phonetic: "tseh", examplePhonetic: "tsoo-kor" },
  { index: 28, upper: "Ч", lower: "ч", name: "че", transliteration: "ch", ipa: "/t͡ʃ/", hint: "'ch' in 'church'", category: "consonant", exampleWord: "час", exampleMeaning: "time", phonetic: "cheh", examplePhonetic: "chahs" },
  { index: 29, upper: "Ш", lower: "ш", name: "ша", transliteration: "sh", ipa: "/ʃ/", hint: "'sh' in 'ship'", category: "consonant", exampleWord: "школа", exampleMeaning: "school", phonetic: "shah", examplePhonetic: "shkoh-lah" },
  { index: 30, upper: "Щ", lower: "щ", name: "ща", transliteration: "shch", ipa: "/ʃt͡ʃ/", hint: "'sh' + 'ch' combined", category: "consonant", exampleWord: "щастя", exampleMeaning: "happiness", phonetic: "shchah", examplePhonetic: "shchahs-tyah" },
  { index: 31, upper: "Ь", lower: "ь", name: "м'який знак", transliteration: "-", ipa: "/ʲ/", hint: "softens previous consonant", category: "sign", exampleWord: "день", exampleMeaning: "day", phonetic: "soft sign", examplePhonetic: "den" },
  { index: 32, upper: "Ю", lower: "ю", name: "ю", transliteration: "yu", ipa: "/ju/", hint: "'you'", category: "vowel", exampleWord: "юнак", exampleMeaning: "young man", phonetic: "you", examplePhonetic: "you-nahk" },
  { index: 33, upper: "Я", lower: "я", name: "я", transliteration: "ya", ipa: "/jɑ/", hint: "'ya' in 'yard'", category: "vowel", exampleWord: "яблуко", exampleMeaning: "apple", phonetic: "yah", examplePhonetic: "yahb-loo-koh" },
];

export const vowels = alphabet.filter((l) => l.category === "vowel");
export const consonants = alphabet.filter((l) => l.category === "consonant");
export const semivowels = alphabet.filter((l) => l.category === "semivowel");
export const signs = alphabet.filter((l) => l.category === "sign");

export const quizzableLetters = alphabet.filter((l) => l.category !== "sign");

export function getLetterByIndex(index: number): UkrainianLetter | undefined {
  return alphabet.find((l) => l.index === index);
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
