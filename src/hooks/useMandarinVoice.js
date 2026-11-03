import { useEffect, useState } from "react";

function selectMandarinVoice(voices) {
  return voices.find((voice) => /^zh[-_]CN$/i.test(voice.lang))
    || voices.find((voice) => /^(zh[-_]Hans|cmn[-_])/i.test(voice.lang))
    || voices.find((voice) => /^zh[-_]/i.test(voice.lang) && !/[-_](HK|MO)$/i.test(voice.lang))
    || null;
}

export default function useMandarinVoice(enabled = true) {
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    if (!enabled || !window.speechSynthesis) return;
    const speech = window.speechSynthesis;
    const refresh = () => setVoice(selectMandarinVoice(speech.getVoices()));
    refresh();
    speech.addEventListener("voiceschanged", refresh);
    return () => speech.removeEventListener("voiceschanged", refresh);
  }, [enabled]);

  return voice;
}
