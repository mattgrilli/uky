/** Present-tense conjugation table for common Ukrainian verbs */
export interface Conjugation {
  infinitive: string;
  en: string;
  translit: string;
  /** Present tense forms: я, ти, він/вона, ми, ви, вони */
  present: {
    ya: string;
    ty: string;
    vin: string;
    my: string;
    vy: string;
    vony: string;
  };
  note?: string;
}

export const conjugations: Conjugation[] = [
  {
    infinitive: "Бути",
    en: "To be",
    translit: "Buty",
    present: { ya: "є", ty: "є", vin: "є", my: "є", vy: "є", vony: "є" },
    note: "In modern Ukrainian, 'є' is used for all persons (or often omitted entirely).",
  },
  {
    infinitive: "Мати",
    en: "To have",
    translit: "Maty",
    present: { ya: "маю", ty: "маєш", vin: "має", my: "маємо", vy: "маєте", vony: "мають" },
  },
  {
    infinitive: "Робити",
    en: "To do / make",
    translit: "Robyty",
    present: { ya: "роблю", ty: "робиш", vin: "робить", my: "робимо", vy: "робите", vony: "роблять" },
  },
  {
    infinitive: "Йти",
    en: "To go (on foot)",
    translit: "Yty",
    present: { ya: "іду", ty: "ідеш", vin: "іде", my: "ідемо", vy: "ідете", vony: "ідуть" },
  },
  {
    infinitive: "Їхати",
    en: "To go (by vehicle)",
    translit: "Yikhaty",
    present: { ya: "їду", ty: "їдеш", vin: "їде", my: "їдемо", vy: "їдете", vony: "їдуть" },
  },
  {
    infinitive: "Хотіти",
    en: "To want",
    translit: "Khotity",
    present: { ya: "хочу", ty: "хочеш", vin: "хоче", my: "хочемо", vy: "хочете", vony: "хочуть" },
  },
  {
    infinitive: "Могти",
    en: "To be able / can",
    translit: "Mohty",
    present: { ya: "можу", ty: "можеш", vin: "може", my: "можемо", vy: "можете", vony: "можуть" },
  },
  {
    infinitive: "Знати",
    en: "To know",
    translit: "Znaty",
    present: { ya: "знаю", ty: "знаєш", vin: "знає", my: "знаємо", vy: "знаєте", vony: "знають" },
  },
  {
    infinitive: "Говорити",
    en: "To speak / say",
    translit: "Hovoryty",
    present: { ya: "говорю", ty: "говориш", vin: "говорить", my: "говоримо", vy: "говорите", vony: "говорять" },
  },
  {
    infinitive: "Бачити",
    en: "To see",
    translit: "Bachyty",
    present: { ya: "бачу", ty: "бачиш", vin: "бачить", my: "бачимо", vy: "бачите", vony: "бачать" },
  },
  {
    infinitive: "Їсти",
    en: "To eat",
    translit: "Yisty",
    present: { ya: "їм", ty: "їси", vin: "їсть", my: "їмо", vy: "їсте", vony: "їдять" },
    note: "Irregular — stem changes across persons.",
  },
  {
    infinitive: "Пити",
    en: "To drink",
    translit: "Pyty",
    present: { ya: "п'ю", ty: "п'єш", vin: "п'є", my: "п'ємо", vy: "п'єте", vony: "п'ють" },
  },
  {
    infinitive: "Читати",
    en: "To read",
    translit: "Chytaty",
    present: { ya: "читаю", ty: "читаєш", vin: "читає", my: "читаємо", vy: "читаєте", vony: "читають" },
  },
  {
    infinitive: "Писати",
    en: "To write",
    translit: "Pysaty",
    present: { ya: "пишу", ty: "пишеш", vin: "пише", my: "пишемо", vy: "пишете", vony: "пишуть" },
  },
  {
    infinitive: "Любити",
    en: "To love / like",
    translit: "Lyubyty",
    present: { ya: "люблю", ty: "любиш", vin: "любить", my: "любимо", vy: "любите", vony: "люблять" },
  },
  {
    infinitive: "Жити",
    en: "To live",
    translit: "Zhyty",
    present: { ya: "живу", ty: "живеш", vin: "живе", my: "живемо", vy: "живете", vony: "живуть" },
  },
  {
    infinitive: "Працювати",
    en: "To work",
    translit: "Pratsyuvaty",
    present: { ya: "працюю", ty: "працюєш", vin: "працює", my: "працюємо", vy: "працюєте", vony: "працюють" },
  },
  {
    infinitive: "Вчити",
    en: "To study / teach",
    translit: "Vchyty",
    present: { ya: "вчу", ty: "вчиш", vin: "вчить", my: "вчимо", vy: "вчите", vony: "вчать" },
  },
  {
    infinitive: "Думати",
    en: "To think",
    translit: "Dumaty",
    present: { ya: "думаю", ty: "думаєш", vin: "думає", my: "думаємо", vy: "думаєте", vony: "думають" },
  },
  {
    infinitive: "Давати",
    en: "To give",
    translit: "Davaty",
    present: { ya: "даю", ty: "даєш", vin: "дає", my: "даємо", vy: "даєте", vony: "дають" },
  },
];

export const pronounLabels = [
  { key: "ya" as const, uk: "Я", en: "I" },
  { key: "ty" as const, uk: "Ти", en: "You (informal)" },
  { key: "vin" as const, uk: "Він/Вона", en: "He/She" },
  { key: "my" as const, uk: "Ми", en: "We" },
  { key: "vy" as const, uk: "Ви", en: "You (formal/plural)" },
  { key: "vony" as const, uk: "Вони", en: "They" },
];
