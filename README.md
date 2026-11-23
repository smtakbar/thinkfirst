# Think First

Data Structures practice where the student must commit an answer before any hint or solution opens.

- `index.html`: the whole app (no build step, no dependencies, no server).
- `questions.js`: the question bank (30 questions, 6 topics, two hints and a worked solution each, plus diagrams for tree, graph and linked list questions, and a second-chance version of every question).
- `careers.js`: the career strength data (topic weights, six roles with one-line descriptions, four learning tracks, and the 63 stored topic combinations).
- `PRD.md`: the problem, metrics, decisions and pilot plan.

## Run it
Open `index.html` in a browser, or host the folder on GitHub Pages (Settings, Pages, deploy from the main branch, root folder).

## Data and privacy
No name, email or roll number is collected. Each student gets a random code in their own browser. Every question a student meets for the first time, and every second-chance result, is sent as one anonymous row. So is one row when a student starts a topic, one when they finish it, and one if they answer the optional feedback question (asked once, after the first finished topic). Each row goes to a Google Form (`CONFIG` at the top of the script in `index.html`). The form feeds a private Google Sheet that only the people it is shared with can open.

## Teacher sign in
The Teacher view and its menu button are hidden until a teacher signs in through the "Teacher sign in" link at the bottom of the page. All teachers share one login ID and password, given to them directly and not written in this repo. The page has no server, so the check runs in the browser against a salted hash (`TEACHER` in `index.html`). It keeps students out of the Teacher view but it is not strong security: someone who reads the code could get past it. The class data is protected separately by Google Sheet sharing. To change the password, replace the hash with PBKDF2-SHA256 of `id:password` using the salt and round count in `TEACHER`.

## Class sheet
- `Form Responses 1`: raw rows as they arrive.
- `Data`: the rows split into columns, with a header row (student code, topic, question id, question, kind, attempts, hints, solution shown, first try, quick guess, confidence, result, sure but wrong).
- Row kinds (column E of `Data`): `first` and `second` are answers. `start` and `finish` mark a topic begun and completed, once per student per topic, with the question count in column F. `feedback` holds the reply in column D and its value in column F (2 helped, 1 no difference, 0 annoyed). `survey` rows are the open feedback answers: the question number (q1 to q5) is in column C and the student's words in column D. The `Analysis` tab reads only `first` rows, so the other kinds do not change its numbers.
- `Analysis`: topics ranked hardest first, with the number of distinct students behind each row, and a dropdown in B12 that lists one topic's questions hardest first with the share who needed the solution and the count who were sure but wrong. To the right (columns I to L, same topic order): students who started and finished each topic, students who finished at least 2 topics, and the feedback replies. Columns N to P: students who attempted (answered at least one question) in total and per topic, and that as a share of all students who opened any topic.

Set `formAction` and `formEntry` to empty strings to switch collection off.

## Tests
A Playwright run covers the full flow on a phone-sized screen and the Teacher view on a desktop screen: 116 of 116 checks passed on 18 Nov 2026 (locks before commit, hint and solution unlock rules, second chance, stored records, report numbers, rows sent to the class form, teacher sign in and sign out, diagrams, topic start and finish rows, the feedback question, the overall progress line, Try again and Change topic, a different question on every second chance, My report updating on every repeat try, the aced-topic rule, the strength message for one, two and six topics, the roadmap shown only from two aced topics, all 63 role combinations checked against the written rule, green completed cards, no duplicate rows on a repeat).

## Adding questions
Append objects to `TF_QUESTIONS` in `questions.js` in the same shape. Keep ids unique and never reuse an id. Diagrams are optional: `fig` shows with the question and `whyFig` shows with the solution (the comment at the top of `questions.js` gives the shapes). A question diagram must not show a step the student is asked to work out.

## Career strength message
A topic counts as aced when the student has finished it and, for every question in it, the solution was never shown, no more than one hint was opened and "Guessing" was not chosen on the first answer. It reads the stored first-try records, so second-chance results do not change it, a repeat never removes an earned result, and students who finished topics earlier qualify the next time they open the app. For the aced topics so far the app shows "You could be great at ..." with one or two roles and a one-line description of each, on the topic result screen and on My report. From two aced topics My report also offers a collapsed "Skills and technologies to develop" list. It is computed on the device from stored results: nothing new is sent or collected, and no links or job listings are shown. It is a sourced mapping of skills to roles, not a prediction of a career. The weights and rule are written at the top of `careers.js`.

## Student feedback
Home shows one line to every visitor: "If you have attempted the quiz, we would value your feedback: five short questions. New visitors can ignore this." Only a student who has answered at least one question sees the "Give feedback" button, and the form cannot be opened without that. It has five open questions, each answer is optional, capped at 400 characters, sent once per student with no name, and read in the Analysis tab of the class sheet.

## Build log
Think First is built while taking a product management course and updated as lessons arrive. The dated list of changes, one or two sentences each, is in section 11 of `PRD.md`.
