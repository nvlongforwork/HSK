import { useLanguage } from "../i18n/useLanguage";

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-switch" role="group" aria-label={t("Language")} title={t("Switch language: Alt + L")}>
      <button type="button" lang="en" aria-pressed={language === "en"}
        aria-label={t("English–Chinese")} aria-keyshortcuts="Alt+L"
        onClick={() => setLanguage("en")}>EN–中文</button>
      <button type="button" lang="vi" aria-pressed={language === "vi"}
        aria-label={t("Vietnamese–Chinese")} aria-keyshortcuts="Alt+L"
        onClick={() => setLanguage("vi")}>VI–中文</button>
    </div>
  );
}
