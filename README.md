# React + Vite

## HSK exercise development

Run `npm ci`, then `npm run dev`. Use `npm run build`, `npm test`, and
`npm run lint` to check changes.

HSK 1 exercise pages read `exercises.md` from the existing HSK-MEDIA repository:

- `### Multiple Choice`: numbered prompts and lettered options; exactly one `✓`
  or `✔` marks the correct answer. Answer markers stay hidden until submission.
- `### Fill in the Blanks`: numbered prompts followed by `→ answer`.
  Answers use Chinese characters; surrounding whitespace, punctuation, and
  full-width forms are normalized. Open responses (`[...]`) and answers carrying
  `reorder:` editorial notes require teacher review and do not count in the score.
- `### Flashcards`: a `Front | Back` table. Learners can flip, navigate, mark
  learned, undo, and restart. Learned marks last for the current practice session;
  they are not saved across page reloads or exercise changes.

Quizzes require every question to be answered before checking. Answers lock after
submission and can be cleared with Try again. Changing lesson or exercise starts
a fresh session. Fetch failures display a Retry button.

Listen & Fill remains unavailable until real lesson recordings and listening
content are provided. This change does not add audio, authentication, HSK 2–6
content, or persistent learner progress.

## Language and layout

The header offers English–Chinese (default) and Vietnamese–Chinese. Click the
language buttons or press **Alt + L** to switch. The choice is saved locally in
`hsk-language`; if browser storage is blocked, switching still works for the
current session. The shortcut is ignored while typing in a form field.

Interface labels, lesson metadata, and the existing English explanations use
Vietnamese display translations in `src/i18n/vi.js` and `vi-content.js`. Chinese
examples, pinyin, source Markdown, and answer keys stay intact. When adding new
English media phrases, add their Vietnamese translations there as well.

Changing language preserves the active route and exercise answers. Page headings
use smaller shared font sizes. Exercise type cards grow to fit their labels,
with four columns on desktop and two on narrow screens.

Practice Tests is a placeholder for teacher-provided tests. It intentionally does
not fetch or display the Exercises material.

## Unit 1 vocabulary pilot

Only `/hsk/1/lesson-1/vocabulary` adds a picture column and Word list / Flashcards
study tabs. The existing media table remains the source of words, pinyin,
English meanings, and Chinese example sentences. The front of each card shows
only the Chinese word. Clicking reveals the current language's meaning, an
illustration, pinyin, and the example sentence. A language switch keeps the
current card and face. Next/Previous return to the Chinese face; Enter/Space flip
the focused card, and Left/Right navigate it.

Other lessons continue to use the existing Markdown renderer. The Unit 1 visual
metadata is in `src/data/unit1VocabularyVisuals.js`. OpenMoji SVG files are bundled
in `public/images/vocabulary/unit-1`, with source and CC BY-SA 4.0 attribution in
that directory's `ATTRIBUTION.md` and a credit link below the study panel.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
