import { useCallback, useRef, useState } from "react";
import { alphabet } from "../data/alphabet";

// Build lookup maps: Ukrainian text -> audio file path
const audioMap = new Map<string, string>();
alphabet.forEach((l) => {
  const idx = String(l.index).padStart(2, "0");
  audioMap.set(l.lower, `/audio/letter-${idx}.mp3`);
  audioMap.set(l.upper, `/audio/letter-${idx}.mp3`);
  audioMap.set(l.exampleWord, `/audio/word-${idx}.mp3`);
});

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const say = useCallback((text: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const src = audioMap.get(text);
    if (!src) {
      console.warn(`[UKY] No audio for "${text}"`);
      return;
    }

    setSpeaking(true);
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onended = () => {
      setSpeaking(false);
      audioRef.current = null;
    };
    audio.onerror = () => {
      console.warn(`[UKY] Failed to play ${src}`);
      setSpeaking(false);
      audioRef.current = null;
    };

    audio.play().catch(() => {
      setSpeaking(false);
      audioRef.current = null;
    });
  }, []);

  return { say, speaking, supported: true };
}
