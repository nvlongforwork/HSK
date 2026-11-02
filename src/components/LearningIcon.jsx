const drawings = {
  vocabulary: <><path d="M16 8c-4-3-9-3-12-2v20c4-1 8-1 12 2 4-3 8-3 12-2V6c-3-1-8-1-12 2Z" /><path d="M16 8v20M8 11h4M8 15h4M20 11h4M20 15h4" /></>,
  grammar: <><path d="M18 4H6v24h20V16M18 4v8h8L18 4Z" /><path d="m15 24 2-6 9-9 4 4-9 9-6 2ZM10 10h4M10 15h3" /></>,
  exercises: <><path d="m5 27 2-8L23 3l6 6-16 16-8 2ZM19 7l6 6M7 19l6 6" /><path d="M5 27h22" /></>,
  "practice-tests": <><rect x="6" y="6" width="20" height="23" rx="3" /><rect x="11" y="3" width="10" height="6" rx="2" /><path d="m10 16 2 2 4-4M19 16h3M10 23h12" /></>,
  "multiple-choice": <><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="6" /><path d="m12 16 3 3 5-6" /></>,
  "read-and-fill": <><path d="M20 3H7v26h18V8l-5-5ZM20 3v5h5M11 13h10M11 18h10M11 23h4" /><path d="M18 23h3" strokeWidth="3" /></>,
  flashcards: <><path d="m6 23-3-15 18-4 2 5" /><rect x="9" y="9" width="19" height="21" rx="3" /><path d="M14 16h9M14 21h6M14 26h7" /></>,
  "listen-and-fill": <><path d="M4 18v-3a12 12 0 0 1 24 0v3M8 17v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="17" width="6" height="11" rx="2" /><rect x="23" y="17" width="6" height="11" rx="2" /></>,
};

export default function LearningIcon({ name }) {
  return <svg className="learning-icon" viewBox="0 0 32 32" width="1em" height="1em"
    fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[name] || drawings.exercises}</svg>;
}
