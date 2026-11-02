import { useState, useRef, useCallback, useEffect } from "react";

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

export function useAudioPlayer(src) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef(null);

  const play = useCallback(() => {
    if (failed || !src) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("error", () => setFailed(true));
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setFailed(true));
  }, [src, failed]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { play, playing, failed };
}

export default function AudioButton({ src, size = "28px" }) {
  const { play, playing, failed } = useAudioPlayer(src);

  if (failed) return null;

  const handlePlay = (e) => {
    e.stopPropagation();
    play();
  };

  return (
    <button
      onClick={handlePlay}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        borderRadius: "50%",
        transition: "transform 0.15s, opacity 0.2s",
        opacity: playing ? 0.7 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      title="Play audio"
    >
      <SpeakerIcon size={size} playing={playing} />
    </button>
  );
}
