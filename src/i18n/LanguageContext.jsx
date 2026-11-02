import { useEffect, useState } from "react";
import { translateText } from "./translate";
import { LanguageContext } from "./useLanguage";

const STORAGE_KEY = "hsk-language";

function savedLanguage() {
  try { return localStorage.getItem(STORAGE_KEY) === "vi" ? "vi" : "en"; }
  catch { return "en"; }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(savedLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem(STORAGE_KEY, language); } catch { /* Storage may be disabled. */ }
  }, [language]);

  useEffect(() => {
    function handleShortcut(event) {
      const editing = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])");
      if (event.altKey && event.code === "KeyL" && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.repeat && !editing) {
        event.preventDefault();
        setLanguage((current) => current === "en" ? "vi" : "en");
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const t = (text) => translateText(text, language);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

