export function speak(text: string, lang = "uk-UA"): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8;

  const voices = window.speechSynthesis.getVoices();
  const ukVoice = voices.find((v) => v.lang.startsWith("uk"));
  if (ukVoice) utterance.voice = ukVoice;

  window.speechSynthesis.speak(utterance);
}

export function isSpeechSupported(): boolean {
  return "speechSynthesis" in window;
}
