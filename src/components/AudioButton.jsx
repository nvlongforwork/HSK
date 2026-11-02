import { useState, useRef } from "react";

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

export default function AudioButton({ src, size = "18px" }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef(null);

  if (failed) return null;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("error", () => setFailed(true));
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setFailed(true));
  };

  return (
    <button
      onClick={handlePlay}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: size,
        padding: "2px 6px",
        borderRadius: "4px",
        transition: "background 0.2s",
        opacity: playing ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196, 30, 58, 0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
      title="Play audio"
    >
      {playing ? "🔊" : "🔈"}
    </button>
  );
}
