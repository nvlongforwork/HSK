import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import { getWorksheetPinyin, loadStrokeData, MAX_CHARACTERS, MAX_CHARACTERS_PER_PAGE, parseWritingWords, renderWorksheetPages } from "../utils/writingWorksheet";
import brushFontUrl from "@expo-google-fonts/ma-shan-zheng/400Regular/MaShanZheng_400Regular.ttf?url";
import pinyinFontUrl from "../assets/fonts/Cohaerentia-Regular.ttf?url";
import fallbackPinyinFontUrl from "@expo-google-fonts/noto-sans/400Regular/NotoSans_400Regular.ttf?url";
import "./writing-worksheet.css";

const labels = {
  en: {
    title: "Create a writing worksheet", subtitle: "Make printable Chinese character practice pages in minutes.",
    input: "Characters, words or sentences to practise", hint: `Enter words on separate lines or separate them with commas. For a short sentence without punctuation, select “Treat each line as a sentence”. A sentence and its pinyin appear above the character rows. Up to ${MAX_CHARACTERS_PER_PAGE} individual characters fit on each A4 page.`,
    paperTitle: "Title on the worksheet (optional)", paperPlaceholder: "Chinese writing practice",
    example: "Try words", exampleSentence: "Try a sentence", sentenceMode: "Treat each line as a sentence", create: "Download A4 PDF", creating: "Creating PDF…",
    preview: "A4 preview", previewHint: "The first square is a model, the next four are tracing guides, and the remaining six are for independent practice.",
    empty: "Enter Chinese characters to see the worksheet.", invalid: `Enter 1–${MAX_CHARACTERS} Chinese characters.`,
    characters: "characters", pages: "pages", back: "Back to home", notice: "The stroke guide needs an internet connection. Tracing grids remain available if stroke data cannot be loaded.",
    error: "Could not create the PDF. Please try again.",
  },
  vi: {
    title: "Tạo writing worksheet", subtitle: "Tạo trang luyện viết chữ Hán để in cho học sinh.",
    input: "Chữ, từ hoặc câu cần tập viết", hint: `Nhập mỗi từ trên một dòng hoặc ngăn cách bằng dấu phẩy. Với câu ngắn không có dấu câu, chọn “Xem mỗi dòng là một câu”. Câu và pinyin sẽ hiện trước các hàng tập viết từng chữ. Chữ lẻ tối đa ${MAX_CHARACTERS_PER_PAGE} chữ trên mỗi trang A4.`,
    paperTitle: "Tiêu đề trên phiếu (không bắt buộc)", paperPlaceholder: "Luyện viết chữ Hán",
    example: "Thử từ vựng", exampleSentence: "Thử một câu", sentenceMode: "Xem mỗi dòng là một câu", create: "Tải PDF khổ A4", creating: "Đang tạo PDF…",
    preview: "Xem trước khổ A4", previewHint: "Ô đầu là chữ mẫu, bốn ô tiếp theo có chữ mờ để tô nét, sáu ô còn lại dành cho học sinh tự viết.",
    empty: "Nhập chữ Hán để xem phiếu tập viết.", invalid: `Hãy nhập từ 1 đến ${MAX_CHARACTERS} chữ Hán.`,
    characters: "chữ", pages: "trang", back: "Về trang chủ", notice: "Thứ tự nét cần kết nối Internet. Nếu không tải được dữ liệu nét, các ô tập viết vẫn được tạo bình thường.",
    error: "Chưa tạo được PDF. Vui lòng thử lại.",
  },
};

export default function WritingWorksheet() {
  const { language } = useLanguage();
  const copy = labels[language];
  const [input, setInput] = useState("");
  const [sentenceMode, setSentenceMode] = useState(false);
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState([]);
  const [preparing, setPreparing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => parseWritingWords(input, { sentenceMode }), [input, sentenceMode]);

  useEffect(() => {
    if (!parsed.valid) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setPreparing(true);
      try {
        const chars = parsed.words.join("");
        const [strokeData] = await Promise.all([
          loadStrokeData([...chars]),
          document.fonts.load('32px "Worksheet Brush"', chars),
          document.fonts.load('16px "Worksheet Pinyin"', `${parsed.entries.map((entry) => typeof entry === "string" ? getWorksheetPinyin(entry) : entry.pinyin).join(" ")} Name Date Score`),
        ]);
        if (active) {
          const pages = renderWorksheetPages(parsed.entries, strokeData, { dpi: 144, title });
          setPreview(pages.map((canvas) => canvas.toDataURL("image/png")));
        }
      } catch {
        if (active) setError(copy.error);
      } finally {
        if (active) setPreparing(false);
      }
    }, 350);
    return () => { active = false; window.clearTimeout(timer); };
  }, [parsed, title, copy.error]);

  async function downloadPdf() {
    if (!parsed.valid || exporting) return;
    setError("");
    setExporting(true);
    try {
      const chars = parsed.words.join("");
      const [strokeData] = await Promise.all([
        loadStrokeData([...chars]),
        document.fonts.load('32px "Worksheet Brush"', chars),
        document.fonts.load('16px "Worksheet Pinyin"', `${parsed.entries.map((entry) => typeof entry === "string" ? getWorksheetPinyin(entry) : entry.pinyin).join(" ")} Name Date Score`),
      ]);
      const { createWritingWorksheetPdf } = await import("../utils/writingWorksheetPdf");
      const pdf = await createWritingWorksheetPdf(parsed.entries, strokeData, { title, fontUrl: brushFontUrl, pinyinFontUrl, fallbackPinyinFontUrl });
      const file = new Blob([pdf], { type: "application/pdf" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Chinese-writing-worksheet-A4.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError(copy.error);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="worksheet-page">
      <Link className="worksheet-back" to="/">← {copy.back}</Link>
      <header className="worksheet-heading">
        <span className="worksheet-eyebrow">汉字 · WRITING PRACTICE</span>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <div className="worksheet-layout">
        <section className="worksheet-controls" aria-label={copy.title}>
          <label htmlFor="worksheet-words">{copy.input}</label>
          <p id="worksheet-input-hint">{copy.hint}</p>
          <textarea id="worksheet-words" aria-describedby="worksheet-input-hint" rows="8" value={input}
            placeholder={"我们\n想\n学习"} onChange={(event) => { setInput(event.target.value); setError(""); }} />
          <button className="worksheet-example" type="button" onClick={() => { setInput("我们\n想\n学习"); setSentenceMode(false); }}>{copy.example} ↗</button>
          <button className="worksheet-example" type="button" onClick={() => { setInput("我喜欢学习汉语。"); setSentenceMode(true); }}>{copy.exampleSentence} ↗</button>
          <label className="worksheet-sentence-option">
            <input type="checkbox" checked={sentenceMode} onChange={(event) => setSentenceMode(event.target.checked)} />
            {copy.sentenceMode}
          </label>
          <label htmlFor="worksheet-title">{copy.paperTitle}</label>
          <input id="worksheet-title" type="text" maxLength="40" value={title} placeholder={copy.paperPlaceholder}
            onChange={(event) => setTitle(event.target.value)} />
          <div className="worksheet-count" aria-live="polite">{parsed.characters} / {MAX_CHARACTERS} {copy.characters}</div>
          {input && !parsed.valid && <p className="worksheet-error" role="alert">{copy.invalid}</p>}
          {error && <p className="worksheet-error" role="alert">{error}</p>}
          <button className="worksheet-download" type="button" disabled={!parsed.valid || exporting} onClick={downloadPdf}>
            <span aria-hidden="true">↓</span> {exporting ? copy.creating : copy.create}
          </button>
          <p className="worksheet-notice">{copy.notice}</p>
        </section>

        <section className="worksheet-preview" aria-label={copy.preview}>
          <div className="worksheet-preview-heading">
            <h2>{copy.preview}</h2>
            {preview.length > 0 && parsed.valid && <span>{preview.length} {copy.pages}</span>}
          </div>
          <p>{copy.previewHint}</p>
          {parsed.valid && preparing && <div className="worksheet-loading" role="status">{copy.creating}</div>}
          {!parsed.valid ? <div className="worksheet-empty"><span aria-hidden="true">田</span>{copy.empty}</div> :
            <div className="worksheet-preview-pages">
              {preview.map((url, index) => <img key={index} src={url} alt={`${copy.preview} ${index + 1}`} />)}
            </div>}
        </section>
      </div>
    </main>
  );
}
