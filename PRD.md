# Think First: product brief

Status: built and browser-tested. **No student has used it yet. Every result below is marked [not measured] until the pilot runs.**

## 1. Problem
Students preparing for Data Structures exams can open a full solution (from a key, a friend or an AI assistant) before they have tried the question. They then recognise the answer without being able to produce it. Practice tools make this worse when the solution is one tap away.

This is a hypothesis taken from the literature on cognitive offloading and from the author's own conceptual paper on AI reliance. It has not been tested with these students **[assumption]**.

## 2. Users
- **Student:** B.E. third-semester CSE student at MJCET taking Data Structures (theory 25PC212CS, lab 25PC252CS), practising on a phone.
- **Teacher:** the course instructor, who wants to know which questions the class cannot do without help.

## 3. What it does
1. A question opens with the hints and the solution locked.
2. The student commits an answer and says how sure they are.
3. Each wrong attempt rules out that option and unlocks one hint. The solution opens only after two real attempts, or automatically after the third.
4. Missed questions come back once at the end of the topic with no hints (second chance).
5. The student gets a report. Each answer also goes, with no name attached, to the teacher's private class sheet, which ranks topics by difficulty and lists the hardest questions in a chosen topic.

## 4. Success metrics
| Metric | Definition | Target | Result |
|---|---|---|---|
| Think-first score (primary) | Share of first-time questions solved without the solution being shown | Above 70% **[assumption]** | [not measured] |
| Second-chance recovery | Share of missed questions answered correctly when they return | Above 50% **[assumption]** | [not measured] |
| Completion | Share of students who finish at least 2 of 6 topics | Above 60% **[assumption]** | [not measured] |
| Guardrail: quick guesses | Share of first answers committed in under 4 seconds | Below 15% **[assumption]** | [not measured] |
| Guardrail: overconfidence | Share of "sure" first answers that were wrong | Reported, no target | [not measured] |

## 5. Decisions and what was cut
| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Accounts | None. Students are anonymous. | Sign-in with roll number | Removes the barrier to first use and avoids holding personal data. Cost: a student who clears the browser counts as a new student. |
| Class data | Each answer is sent as one anonymous row to a Google Form that feeds a private Google Sheet | Students sending a results code by hand (first version), or a custom server | The first version depended on every student remembering to send a code. The form needs no hosting and the teacher already uses Sheets. Cost: the form address is public, so rows could be forged. |
| Teacher analysis | An Analysis tab in the sheet: topics ranked by difficulty, and a dropdown that lists one topic's questions hardest first | A custom dashboard page | The sheet stays private to the people it is shared with, and the teacher can sort, filter and chart it without new software. |
| Hints | Written by hand, two per question | AI-generated hints | An AI key cannot sit safely in a public page, and a wrong hint is worse than none. |
| Unlock rule | One hint per wrong attempt | Timer-based unlock | An attempt is evidence of thinking. Waiting is not. |
| Teacher access | One shared login ID and password, checked in the browser against a salted hash. The Teacher view and its menu button stay hidden until sign in. | Per-teacher accounts on a server | The page has no server and the pilot has one instructor. Cost: this hides the view from students but is not strong security. The class data stays protected by Google Sheet sharing. |
| Diagrams | Trees, graphs and linked lists are drawn from data. A question shows a diagram only when it does not do the work for the student. Other diagrams appear with the solution. | A diagram on every question | Drawing the tree is often the skill being tested, so showing it early would give the answer away. |
| Question format | Multiple choice with traces | Typed code answers | Checkable in the browser and usable on a phone. Cost: guessing is possible, so quick guesses are flagged. |

## 6. Known limits
- A student can still open an AI assistant in another tab. The tool makes thinking first the default path. It cannot enforce it.
- Three wrong attempts always reach the answer, so the think-first score has a floor that guessing can inflate. Read it together with the quick-guess share.
- 30 questions is enough for a one-week pilot, not for a semester.
- Rows are anonymous and unsigned. The numbers are for teaching decisions, not for grading.

## 7. Pilot plan
1. Share the link with the class through the instructor. One line of instructions: finish two topics.
2. After one week, read the Analysis tab of the class sheet and record the five metrics above.
3. Ask five students two questions: what annoyed you, and when did you want the solution sooner.
4. Decide from the data: keep, change or remove the three-attempt rule.

## 8. Next, in priority order
1. Question variants with different numbers, so a second chance cannot be answered from memory.
2. Topic-level difficulty ordering from the pilot data.
3. Lab-style questions that ask for the bug in a short C program.
