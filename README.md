# Think First

Data Structures practice where the student must commit an answer before any hint or solution opens.

- `index.html`: the whole app (no build step, no dependencies, no server).
- `questions.js`: the question bank (30 questions, 6 topics, two hints and a worked solution each, plus diagrams for tree, graph and linked list questions).
- `PRD.md`: the problem, metrics, decisions and pilot plan.

## Run it
Open `index.html` in a browser, or host the folder on GitHub Pages (Settings, Pages, deploy from the main branch, root folder).

## Data and privacy
No name, email or roll number is collected. Each student gets a random code in their own browser. Every question a student meets for the first time, and every second-chance result, is sent as one anonymous row to a Google Form (`CONFIG` at the top of the script in `index.html`). The form feeds a private Google Sheet that only the people it is shared with can open.

## Teacher sign in
The Teacher view and its menu button are hidden until a teacher signs in through the "Teacher sign in" link at the bottom of the page. All teachers share one login ID and password, given to them directly and not written in this repo. The page has no server, so the check runs in the browser against a salted hash (`TEACHER` in `index.html`). It keeps students out of the Teacher view but it is not strong security: someone who reads the code could get past it. The class data is protected separately by Google Sheet sharing. To change the password, replace the hash with PBKDF2-SHA256 of `id:password` using the salt and round count in `TEACHER`.

## Class sheet
- `Form Responses 1`: raw rows as they arrive.
- `Data`: the rows split into columns (student code, topic, question, attempts, hints, solution shown, first try, quick guess, confidence).
- `Analysis`: topics ranked hardest first, and a dropdown in B12 that lists one topic's questions hardest first with the share who needed the solution and the count who were sure but wrong.

Set `formAction` and `formEntry` to empty strings to switch collection off.

## Tests
A Playwright run covers the full flow on a phone-sized screen and the Teacher view on a desktop screen: 67 of 67 checks passed on 17 Nov 2026 (locks before commit, hint and solution unlock rules, second chance, stored records, report numbers, rows sent to the class form, code sharing, duplicate and junk codes, teacher sign in and sign out, diagrams).

## Adding questions
Append objects to `TF_QUESTIONS` in `questions.js` in the same shape. Keep ids unique and never reuse an id. Diagrams are optional: `fig` shows with the question and `whyFig` shows with the solution (the comment at the top of `questions.js` gives the shapes). A question diagram must not show a step the student is asked to work out.
