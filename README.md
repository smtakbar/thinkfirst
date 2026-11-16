# Think First

Data Structures practice where the student must commit an answer before any hint or solution opens.

- `index.html`: the whole app (no build step, no dependencies, no server).
- `questions.js`: the question bank (30 questions, 6 topics, two hints and a worked solution each).
- `PRD.md`: the problem, metrics, decisions and pilot plan.

## Run it
Open `index.html` in a browser, or host the folder on GitHub Pages (Settings, Pages, deploy from the main branch, root folder).

## Data and privacy
No name, email or roll number is collected. Each student gets a random code in their own browser. Every question a student meets for the first time, and every second-chance result, is sent as one anonymous row to a Google Form (`CONFIG` at the top of the script in `index.html`). The form feeds a private Google Sheet that only the people it is shared with can open.

## Class sheet
- `Form Responses 1`: raw rows as they arrive.
- `Data`: the rows split into columns (student code, topic, question, attempts, hints, solution shown, first try, quick guess, confidence).
- `Analysis`: topics ranked hardest first, and a dropdown in B12 that lists one topic's questions hardest first with the share who needed the solution and the count who were sure but wrong.

Set `formAction` and `formEntry` to empty strings to switch collection off.

## Tests
A Playwright run covers the full flow on a phone-sized screen and the Teacher view on a desktop screen: 57 of 57 checks passed on 16 Nov 2026 (locks before commit, hint and solution unlock rules, second chance, stored records, report numbers, rows sent to the class form, code sharing, duplicate and junk codes).

## Adding questions
Append objects to `TF_QUESTIONS` in `questions.js` in the same shape. Keep ids unique and never reuse an id.
