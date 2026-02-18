/** Sentences for the sentence builder game */
export interface Sentence {
  /** Ukrainian words in correct order */
  words: string[];
  /** English translation */
  en: string;
  /** Transliteration */
  translit: string;
  /** Difficulty: 1 = 2-3 words, 2 = 3-4 words, 3 = 4-5 words */
  difficulty: 1 | 2 | 3;
  /** Audio file index */
  audioIndex: number;
}

export function getSentenceAudioPath(index: number): string {
  return `/audio/sentence-${String(index).padStart(2, "0")}.mp3`;
}

export const sentences: Sentence[] = [
  // Difficulty 1: 2-3 word sentences
  { words: ["Я", "знаю"], en: "I know", translit: "Ya znayu", difficulty: 1, audioIndex: 1 },
  { words: ["Він", "іде"], en: "He goes", translit: "Vin ide", difficulty: 1, audioIndex: 2 },
  { words: ["Вона", "читає"], en: "She reads", translit: "Vona chytaye", difficulty: 1, audioIndex: 3 },
  { words: ["Ми", "працюємо"], en: "We work", translit: "My pratsyuyemo", difficulty: 1, audioIndex: 4 },
  { words: ["Це", "добре"], en: "This is good", translit: "Tse dobre", difficulty: 1, audioIndex: 5 },
  { words: ["Дякую", "вам"], en: "Thank you (formal)", translit: "Dyakuyu vam", difficulty: 1, audioIndex: 6 },
  { words: ["Доброго", "ранку"], en: "Good morning", translit: "Dobroho ranku", difficulty: 1, audioIndex: 7 },

  // Difficulty 2: 3-4 word sentences
  { words: ["Я", "люблю", "каву"], en: "I love coffee", translit: "Ya lyublyu kavu", difficulty: 2, audioIndex: 8 },
  { words: ["Він", "п'є", "чай"], en: "He drinks tea", translit: "Vin pye chai", difficulty: 2, audioIndex: 9 },
  { words: ["Вона", "живе", "тут"], en: "She lives here", translit: "Vona zhyve tut", difficulty: 2, audioIndex: 10 },
  { words: ["Ми", "їмо", "борщ"], en: "We eat borscht", translit: "My yimo borshch", difficulty: 2, audioIndex: 11 },
  { words: ["Де", "є", "магазин?"], en: "Where is the store?", translit: "De ye mahazyn?", difficulty: 2, audioIndex: 12 },
  { words: ["Я", "хочу", "воду"], en: "I want water", translit: "Ya khochu vodu", difficulty: 2, audioIndex: 13 },
  { words: ["Він", "читає", "книгу"], en: "He reads a book", translit: "Vin chytaye knyhu", difficulty: 2, audioIndex: 14 },
  { words: ["Ми", "маємо", "час"], en: "We have time", translit: "My mayemo chas", difficulty: 2, audioIndex: 15 },
  { words: ["Вона", "знає", "мене"], en: "She knows me", translit: "Vona znaye mene", difficulty: 2, audioIndex: 16 },

  // Difficulty 3: 4-5 word sentences
  { words: ["Я", "хочу", "їсти", "рис"], en: "I want to eat rice", translit: "Ya khochu yisty rys", difficulty: 3, audioIndex: 17 },
  { words: ["Він", "може", "говорити", "українською"], en: "He can speak Ukrainian", translit: "Vin mozhe hovoryty ukrayinskoyu", difficulty: 3, audioIndex: 18 },
  { words: ["Вона", "любить", "читати", "книги"], en: "She likes to read books", translit: "Vona lyubyt chytaty knyhy", difficulty: 3, audioIndex: 19 },
  { words: ["Ми", "живемо", "в", "місті"], en: "We live in the city", translit: "My zhyvemo v misti", difficulty: 3, audioIndex: 20 },
  { words: ["Я", "вивчаю", "українську", "мову"], en: "I am studying the Ukrainian language", translit: "Ya vyvchayu ukrayinsku movu", difficulty: 3, audioIndex: 21 },
  { words: ["Він", "працює", "кожного", "дня"], en: "He works every day", translit: "Vin pratsyuye kozhnoho dnya", difficulty: 3, audioIndex: 22 },
  { words: ["Де", "можна", "купити", "каву?"], en: "Where can one buy coffee?", translit: "De mozhna kupyty kavu?", difficulty: 3, audioIndex: 23 },
  { words: ["Я", "думаю", "що", "це", "добре"], en: "I think that this is good", translit: "Ya dumayu shcho tse dobre", difficulty: 3, audioIndex: 24 },
];
