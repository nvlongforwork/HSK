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

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
