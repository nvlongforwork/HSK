import { useState, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "../i18n/useLanguage";

let activeAudio = null;
function switchAudio(next) {
  if (activeAudio && activeAudio !== next) activeAudio.pause();
  activeAudio = next;
}

export function stripTones(pinyin) {
  const toneMap = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v', 'ü': 'v',
  };
  return pinyin.toLowerCase().split('').map(c => toneMap[c] || c).join('');
}

export function SpeakerIcon({ size, playing }) {
  const s = parseInt(size);
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#D4A017" />
      <path d="M13 16.5 L13 23.5 L17 23.5 L22 27 L22 13 L17 16.5 Z" fill="white" />
      <path d="M25 15.5 C26.5 17 26.5 23 25 24.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={playing ? 1 : 0.7} />
      <path d="M27.5 13 C30 16 30 24 27.5 27" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={playing ? 1 : 0.5} />
      <path d="M30 10.5 C33.5 14.5 33.5 25.5 30 29.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={playing ? 1 : 0.3} />
    </svg>
  );
}

export function useAudioPlayer(src, text, voice) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef(null);
  const speechRef = useRef(null);

  const play = useCallback(() => {
    if (failed || (!src && !voice)) return;

    const speak = () => {
      if (!text || !voice || !window.speechSynthesis) {
        setFailed(true);
        setPlaying(false);
        return;
      }
      audioRef.current?.pause();
      audioRef.current = null;
      switchAudio(null);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.85;
      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => { speechRef.current = null; setPlaying(false); };
      utterance.onerror = () => { speechRef.current = null; setPlaying(false); setFailed(true); };
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (!src) {
      speak();
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(src);
      let fallbackStarted = false;
      const fallback = () => {
        if (fallbackStarted || audioRef.current !== audio) return;
        fallbackStarted = true;
        speak();
      };
      audio.addEventListener("error", fallback);
      audio.addEventListener("pause", () => setPlaying(false));
      audio.addEventListener("ended", () => {
        if (activeAudio === audio) activeAudio = null;
        setPlaying(false);
      });
      audioRef.current = audio;
      switchAudio(audio);
      window.speechSynthesis?.cancel();
      audio.play().then(() => {
        if (audioRef.current === audio) setPlaying(true);
      }).catch(fallback);
    } else {
      const audio = audioRef.current;
      audio.currentTime = 0;
      switchAudio(audio);
      window.speechSynthesis?.cancel();
      audio.play().then(() => {
        if (audioRef.current === audio) setPlaying(true);
      }).catch(() => {
        if (audioRef.current === audio) speak();
      });
    }
  }, [src, text, voice, failed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (activeAudio === audioRef.current) activeAudio = null;
      audioRef.current = null;
    }
    if (speechRef.current) {
      window.speechSynthesis?.cancel();
      speechRef.current = null;
    }
    setFailed(false);
    setPlaying(false);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (activeAudio === audioRef.current) activeAudio = null;
        audioRef.current = null;
      }
      if (speechRef.current) {
        window.speechSynthesis?.cancel();
        speechRef.current = null;
      }
    };
  }, [src, text, voice]);

  return { play, playing, failed };
}

export default function AudioButton({ src, text, voice, size = "28px" }) {
  const { t } = useLanguage();
  const { play, playing, failed } = useAudioPlayer(src, text, voice);

  const unavailable = failed || (!src && !voice);

  const handlePlay = (e) => {
    e.stopPropagation();
    play();
  };

  return (
    <button
      onClick={handlePlay}
      type="button"
      disabled={unavailable}
      style={{
        background: "none",
        border: "none",
        cursor: unavailable ? "not-allowed" : "pointer",
        padding: "2px",
        borderRadius: "50%",
        transition: "transform 0.15s, opacity 0.2s",
        opacity: unavailable ? 0.4 : playing ? 0.7 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      title={t(unavailable ? "Mandarin audio unavailable" : "Play pronunciation")}
      aria-label={unavailable ? t("Mandarin audio unavailable") : `${t("Play pronunciation")}: ${text || ""}`}
    >
      <SpeakerIcon size={size} playing={playing} />
    </button>
  );
}
