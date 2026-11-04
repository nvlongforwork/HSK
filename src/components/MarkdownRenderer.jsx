import { cloneElement, useId } from "react";
import { useLanguage } from "../i18n/useLanguage";
import PinyinText from "./PinyinText";
import AudioButton, { stripTones, SpeakerIcon } from "./AudioButton";
import useMandarinVoice from "../hooks/useMandarinVoice";
import { getVocabularyRecordingUrl } from "../data/hsk1AudioWords";
import { translateMarkdown } from "../i18n/translateMarkdown";
import "./grammar-topics.css";

const sectionStyle = {
  textAlign: "left",
  lineHeight: 1.8,
};

const h1Style = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h2)",
  fontWeight: 900,
  color: "var(--red-primary)",
  marginBottom: "8px",
  textAlign: "center",
};

const h2Style = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h3)",
  fontWeight: 700,
  color: "var(--ink-dark)",
  marginTop: "32px",
  marginBottom: "12px",
  borderBottom: "2px solid var(--gold-light)",
  paddingBottom: "8px",
};

const h3Style = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-body)",
  fontWeight: 700,
  color: "var(--red-primary)",
  marginTop: "24px",
  marginBottom: "8px",
};

const h4Style = {
  fontSize: "var(--fs-small)",
  fontWeight: 700,
  color: "var(--ink-medium)",
  marginTop: "16px",
  marginBottom: "4px",
};

const pStyle = {
  fontSize: "var(--fs-small)",
  color: "var(--ink-medium)",
  marginBottom: "8px",
};

const blockquoteStyle = {
  borderLeft: "4px solid var(--gold-primary)",
  paddingLeft: "16px",
  margin: "12px 0",
  background: "rgba(212, 160, 23, 0.06)",
  borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
  padding: "12px 16px",
};

const tableWrapStyle = {
  overflowX: "auto",
  margin: "16px 0",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "var(--fs-small)",
};

const thStyle = {
  background: "linear-gradient(135deg, var(--red-primary), var(--red-dark))",
  color: "#fff",
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 700,
  fontFamily: "var(--font-serif)",
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--cream-dark)",
  color: "var(--ink-medium)",
};

const tdZhStyle = {
  ...tdStyle,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-body)",
  fontWeight: 700,
  color: "var(--ink-dark)",
};

const liStyle = {
  fontSize: "var(--fs-small)",
  color: "var(--ink-medium)",
  marginBottom: "4px",
  paddingLeft: "4px",
};

const correctStyle = {
  color: "var(--red-primary)",
  fontWeight: 700,
};

const strongStyle = {
  fontWeight: 700,
  color: "var(--ink-dark)",
};

const codeStyle = {
  fontFamily: "var(--font-serif)",
  background: "rgba(212, 160, 23, 0.1)",
  padding: "2px 6px",
  borderRadius: "4px",
  color: "var(--red-primary)",
};

function renderInline(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);

    let firstMatch = null;
    let firstIndex = remaining.length;

    if (boldMatch && boldMatch.index < firstIndex) {
      firstMatch = { type: "bold", match: boldMatch };
      firstIndex = boldMatch.index;
    }
    if (codeMatch && codeMatch.index < firstIndex) {
      firstMatch = { type: "code", match: codeMatch };
      firstIndex = codeMatch.index;
    }

    if (!firstMatch) {
      parts.push(<PinyinText key={key++}>{remaining}</PinyinText>);
      break;
    }

    if (firstIndex > 0) {
      parts.push(<PinyinText key={key++}>{remaining.slice(0, firstIndex)}</PinyinText>);
    }

    if (firstMatch.type === "bold") {
      parts.push(
        <strong key={key++} style={strongStyle}>
          <PinyinText>{firstMatch.match[1]}</PinyinText>
        </strong>
      );
    } else {
      parts.push(
        <code key={key++} style={codeStyle}>
          <PinyinText>{firstMatch.match[1]}</PinyinText>
        </code>
      );
    }

    remaining = remaining.slice(firstIndex + firstMatch.match[0].length);
  }

  return parts;
}

function parseTable(lines, audioBaseUrl, vocabularyAudio, voice) {
  const headers = lines[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);

  const pinyinIndex = headers.findIndex((h) => h === "拼音" || h === "Pinyin");
  const wordIndex = pinyinIndex - 1;
  const hasWordAudio = vocabularyAudio && wordIndex >= 0
    && ["汉字", "Character", "Chữ"].includes(headers[wordIndex]);
  const hasPinyin = !hasWordAudio && audioBaseUrl && headers.some((h) => h === "拼音");

  const rows = lines.slice(2).map((line) =>
    hasWordAudio ? line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()) : line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
  );

  return (
    <div style={tableWrapStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {(hasPinyin || hasWordAudio) && <th style={{ ...thStyle, width: "48px", textAlign: "center" }}><SpeakerIcon size="22" /></th>}
            {headers.map((h, i) => (
              <th key={i} style={thStyle}>
                <PinyinText>{h}</PinyinText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const pinyin = hasPinyin && row[pinyinIndex] ? row[pinyinIndex] : null;
            const audioFile = pinyin ? stripTones(pinyin) + ".mp3" : null;
            const word = hasWordAudio ? row[wordIndex] : null;
            return (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "var(--white)" : "var(--cream)" }}>
                {hasWordAudio && (
                  <td style={{ ...tdStyle, textAlign: "center", padding: "6px" }}>
                    {word && <AudioButton src={getVocabularyRecordingUrl(word)} text={word} voice={voice} />}
                  </td>
                )}
                {hasPinyin && (
                  <td style={{ ...tdStyle, textAlign: "center", padding: "6px" }}>
                    {audioFile && <AudioButton src={`${audioBaseUrl}/${audioFile}`} />}
                  </td>
                )}
                {row.map((cell, ci) => (
                  <td key={ci} style={ci === 1 ? tdZhStyle : tdStyle}>
                    <PinyinText>{cell}</PinyinText>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MarkdownRenderer({ content, audioBaseUrl, vocabularyAudio = false, groupTopics = false }) {
  const { language } = useLanguage();
  const voice = useMandarinVoice(vocabularyAudio);
  const headingId = useId();
  if (!content) return null;

  const lines = translateMarkdown(content, language).split("\n");
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} style={h1Style}>
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} style={h2Style}>
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} style={h3Style}>
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={key++} style={h4Style}>
          {renderInline(line.slice(5))}
        </h4>
      );
      i++;
    } else if (line.startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const tableLines = [line];
      i++;
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<div key={key++}>{parseTable(tableLines, audioBaseUrl, vocabularyAudio, voice)}</div>);
    } else if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={key++} style={blockquoteStyle}>
          {quoteLines.map((ql, qi) => (
            <div key={qi} style={{ ...pStyle, marginBottom: "4px" }}>
              {renderInline(ql)}
            </div>
          ))}
        </blockquote>
      );
    } else if (line.match(/^(\d+)\. /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^(\d+)\. /)) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} style={{ paddingLeft: "24px", margin: "8px 0" }}>
          {listItems.map((item, li) => (
            <li key={li} style={liStyle}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    } else if (line.match(/^\s+- /)) {
      const subItems = [];
      while (i < lines.length && lines[i].match(/^\s+- /)) {
        const text = lines[i].replace(/^\s+- /, "");
        const isCorrect = text.includes("✓");
        subItems.push({ text: text.replace(" ✓", ""), isCorrect });
        i++;
      }
      elements.push(
        <ul key={key++} style={{ paddingLeft: "40px", margin: "4px 0 12px", listStyleType: "none" }}>
          {subItems.map((item, si) => (
            <li key={si} style={{ ...liStyle, ...(item.isCorrect ? correctStyle : {}) }}>
              {renderInline(item.text)}
              {item.isCorrect && " ✓"}
            </li>
          ))}
        </ul>
      );
    } else if (line.startsWith("- ")) {
      const listItems = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} style={{ paddingLeft: "24px", margin: "8px 0" }}>
          {listItems.map((item, li) => (
            <li key={li} style={liStyle}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else if (line.trim() === "") {
      i++;
    } else {
      elements.push(
        <p key={key++} style={pStyle}>
          {renderInline(line)}
        </p>
      );
      i++;
    }
  }

  if (!groupTopics) return <div style={sectionStyle}>{elements}</div>;

  // Keep each topic's paragraphs, structures, examples and tables together.
  // A level-four heading belongs to its current topic, while major headings
  // start an introduction outside the topic cards.
  const blocks = [];
  let current = null;
  let topicIndex = 0;
  for (const element of elements) {
    if (element.type === "h3") {
      const id = `${headingId}-topic-${topicIndex++}`;
      current = { type: "topic", id, children: [cloneElement(element, {
        id,
        style: { ...h3Style, marginTop: 0, marginBottom: "16px", fontSize: "var(--fs-h3)",
          paddingBottom: "12px", borderBottom: "1px solid var(--gold-light)" },
      })] };
      blocks.push(current);
    } else {
      const majorHeading = element.type === "h1" || element.type === "h2";
      if (!current || (majorHeading && current.type !== "intro")) {
        current = { type: "intro", children: [] };
        blocks.push(current);
      }
      current.children.push(element);
    }
  }

  return (
    <div style={sectionStyle} className="grammar-document">
      {blocks.map((block, index) => block.type === "topic" ? (
        <section className="grammar-topic" aria-labelledby={block.id} key={block.id}>
          {block.children}
        </section>
      ) : <div className="grammar-intro" key={`intro-${index}`}>{block.children}</div>)}
    </div>
  );
}
