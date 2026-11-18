# Think First: product brief

Status: live with a class since 17 Nov 2026. Early results below are read from the class sheet on 18 Nov 2026 (last row at 21:53, sheet time). **Each anonymous browser code is counted as one student. A student who clears the browser or switches phone would count twice, so counts can run slightly high. The pilot is still running. Anything not measured is marked [not measured].**

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
4. At the end of a topic where something was missed, the student chooses "Let's try again" or "Change topic". Try again shows a different version of each missed question (all 30 questions have one) with no hints. A missed question never returns as the same question.
5. A slim line on the question screen and the home screen shows how much of the whole quiz the student has met (for example "You have completed 17% of the quiz. Keep thinking first."). It counts questions met, never speed or correctness.
6. My report follows the student's latest try at each question, so every repeat of a topic updates it. There is no clear button and no results code to send. Each answer still goes, with no name attached, to the teacher's private class sheet.
7. A student who aces a topic (see section 6) sees which roles ask for the skills that topic exercises. From two aced topics My report also offers a short, collapsed learning roadmap. Completed topics are highlighted green on the home screen.
8. Diagrams for trees, graphs and linked lists, and powers written as superscripts (5x³ + 4x²), keep questions readable on a phone.

## 4. Success metrics
Results are from the sheet on 18 Nov 2026. "Excluding two heaviest students" removes the two students who each answered all 30 questions (about 60 of the 144 first answers), because they dominate the totals. I cannot tell whether those two are fast students or testers.

| Metric | Definition | Target | Result, all students | Result, excluding two heaviest students |
|---|---|---|---|---|
| Think-first score (primary) | Share of first-time questions solved without the solution being shown | Above 70% **[assumption]** | 87.5% (144 first answers, 24 students) | 84.5% (84 first answers, 22 students) |
| Second-chance recovery | Share of missed questions answered correctly when they return | Above 50% **[assumption]** | 80% (28 of 35) | 78% (18 of 23) |
| Completion | Share of students who answered at least one question that finish at least 2 of 6 topics (from `finish` rows) | Above 60% **[assumption]** | **Not met.** 17% (4 of 24 students who answered) | 9% (2 of 22) |
| Topic drop-off | Share of started topics that were not finished (`start` rows without a matching `finish` row) | Reported, no target | 74% (62 of 84 started student and topic pairs) | [not computed] |
| Student sentiment | Replies to "You had to answer before the solution opened. How was that?" Optional, asked once per student. | Reported, no target | 4 replies: 2 helped, 1 no difference, 1 annoyed. Too few to read | same |
| Guardrail: quick guesses | Share of first answers committed in under 4 seconds | Below 15% **[assumption]** | 0.7% (1 of 144). Within the guardrail | 1.2% (1 of 84) |
| Guardrail: overconfidence | Share of "sure" first answers that were wrong | Reported, no target | 31% (36 of 115) | 44% (25 of 57) |
| First-try correct (context) | Share of first answers right on the first attempt | Reported, no target | 63% | 51% |

**Completion denominator (decided by the author, 18 Nov 2026):** students who answered at least one question. Students who only opened a topic are not counted, because opening a page is not an attempt. For context, 4 of the 57 students who opened a topic (7%) finished at least two topics. The sheet's per-topic "share of all students" figures still divide by everyone who opened a topic, so they are not the completion metric.

## 5. Early pilot findings (18 Nov 2026, read from the class sheet)
- **Reach.** 289 rows from 17 Nov 13:57 to 18 Nov 21:53. 57 students opened a topic, 24 answered at least one question, 9 finished at least one topic and 4 finished at least two. Students seen per day: 23 on 17 Nov and 37 on 18 Nov. A student who clears the browser or switches phone would count as a new student, so these counts can run slightly high. The enrolled class size has not been given. For the resume line ("piloted with a class of N students at MJCET"), use the measured number of students who answered at least one question (24 on 18 Nov, to be re-read at the end of the pilot), or the enrolled number if the instructor provides it.
- **The largest drop-off is before the first answer.** 33 of the 57 students who opened a topic never answered a question (58%). The overall progress line was added on 18 Nov with this drop-off in mind. Their effect is **[not measured]**, and comparing before and after needs the timestamps of those changes.
- **Hardest topic so far: Trees.** Share of first answers not right on the first try, share that needed the solution, first answers and students behind them:

| Topic | Not right first try | Needed the solution | First answers | Students | Share of all 57 students who attempted it |
|---|---|---|---|---|---|
| Trees | 53% | 18% | 34 | 9 | 16% |
| Arrays and Searching | 42% | 11% | 36 | 13 | 23% |
| Stacks and Queues | 31% | 6% | 16 | 4 | 7% |
| Linked Lists | 29% | 14% | 14 | 3 | 5% |
| Graphs | 29% | 11% | 28 | 7 | 12% |
| Sorting and Hashing | 19% | 13% | 16 | 4 | 7% |

  Treat the order as a first look. Stacks, Linked Lists and Sorting rest on 3 or 4 students each, and the two heaviest students supply a large share of every row.
- **Students are often sure and wrong.** Between a third and a half of "sure" first answers were wrong, which points to shared misconceptions worth class time. The question-level table in the sheet lists them.
- **Guessing is rare.** Only 1 of 144 first answers was committed in under 4 seconds, so the 70% think-first score is not being inflated by instant guessing. It can still be inflated by the third-attempt rule (section 8).
- **Second chance recovers most misses (78% to 80%).** Some of these rows came from the earlier version that re-asked the same question, so part of that figure may reflect memory. The 18 Nov version shows different questions, and a clean read needs data after that change.
- **Sentiment is too thin to read.** Four replies.

## 6. Career strength message: analysis and decisions
**Purpose.** Give each student a reason to keep going by connecting what they did well to roles that ask for those skills. It is not a prediction of anyone's career.

**Rule for "aced" (set by the author, 18 Nov 2026).** A topic counts when the student has finished it and, for every question in it, the solution was never shown, no more than one hint was opened and "Guessing" was not chosen on the first answer. The rule reads stored first-try records, so second-chance results do not change it, a repeat cannot remove an earned result, and students who finished topics before the feature shipped qualify the next time they open the app. Nothing new is sent.

**Evidence chain and what was found.**
- **Topic to ability, specialisation, role, roadmap** is sourced where possible to ACM/IEEE CS2023 (topic content and knowledge areas) and O*NET occupation pages (knowledge, skills, abilities of research, software, systems and database occupations). Links with no source are marked "reasoned, not sourced" in the working document.
- **No study was found** showing that a quiz score on one Data Structures topic predicts success in a role. The message therefore says "could", carries the note "Based on common skill requirements for these roles. It is a suggestion, not a prediction", and its effect on motivation or choices is **[not measured]**.
- **O*NET abilities are almost the same for every computing occupation** (reasoning, mathematics, critical thinking), so they cannot tell one role from another. Role separation rests on CS2023 content and on job postings, summarised without links.
- **All six topics sit inside one CS2023 area** (Algorithmic Foundations), so every topic points to algorithms by default. Weights give algorithm credit only where algorithm design is the distinguishing content, or every combination collapsed to Algorithm Engineer (56 of 63 in the first try).

**What was built.**
- Four specialisations: algorithms, systems, data, languages and compilers. Six roles: Algorithm Engineer, Research Engineer, Systems Software Engineer (includes performance work), Kernel Developer, Compiler Engineer, Database Engineer. Four learning tracks, each with a stack and three projects, on top of a shared foundation.
- Each topic gives weights to the specialisations. A combination sums them, each role is scored, the top role always wins and a second is added if it scores at least 70% of the top. Ties follow a fixed role order. All 63 combinations are stored in `careers.js` and a test recomputes them from the rule.
- Result of the rule: Algorithm Engineer appears in 37 combinations, Systems Software Engineer in 30, Kernel Developer in 22, Database Engineer and Compiler Engineer in 12 each, Research Engineer in 6. 7 combinations get one role and 56 get two.
- The message shows the role name and a one-line description only. No links and no job listings appear in the app. The roadmap appears only on My report, only from two aced topics, and is collapsed by default.

**Decisions made by the author.** AI/ML Research Engineer dropped (six data-structure topics are weak evidence for it). Performance Engineer merged into Systems Software Engineer. No job listings or external links shown.

**Judgement calls to revisit.** The topic and role weights are judgement based on sourced topic content, not measured values. The second-role line was moved from 80% to 70% because at 80% Linked Lists alone and Stacks and Queues alone gave only Kernel Developer.

## 7. Decisions and what was cut
| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Accounts | None. Students are anonymous. | Sign-in with roll number | Removes the barrier to first use and avoids holding personal data. Cost: a student who clears the browser counts as a new student. |
| Class data | Each answer is sent as one anonymous row to a Google Form that feeds a private Google Sheet | Students sending a results code by hand, or a custom server | The first version depended on every student remembering to send a code. The form needs no hosting and the teacher already uses Sheets. Cost: the form address is public, so rows could be forged. |
| Results code and code checker | Removed (18 Nov 2026). The report is for the student and the sheet is for the teacher. | Keeping "Share with your teacher" and a code box in the Teacher view | The sheet already receives every answer, so the code was a second, manual path with no extra information. |
| Teacher analysis | An Analysis tab in the sheet: topics ranked by difficulty with the number of students behind each row, a dropdown that lists one topic's questions hardest first, completion and feedback tables, and the share of students who attempted each topic | A custom dashboard page | The sheet stays private to the people it is shared with, and the teacher can sort, filter and chart it without new software. |
| Hints | Written by hand, two per question | AI-generated hints | An AI key cannot sit safely in a public page, and a wrong hint is worse than none. |
| Unlock rule | One hint per wrong attempt | Timer-based unlock | An attempt is evidence of thinking. Waiting is not. |
| Teacher access | One shared login ID and password, checked in the browser against a salted hash. The Teacher view and its menu button stay hidden until sign in. | Per-teacher accounts on a server | The page has no server and the pilot has one instructor. Cost: this hides the view from students but is not strong security. The class data stays protected by Google Sheet sharing. The password is short and the hash is public, so it could be cracked. |
| Second chance | A different version of every missed question (30 written by hand), chosen from Try again or skipped with Change topic | Re-asking the same question, or only reshuffling it | The same question can be answered from memory. Cost: 30 more questions to write and check. |
| Overall progress line | A small line and thin bar with short messages, counting questions met | A large progress bar, or points and streaks | A quiet cue should lower the drop-off before the first answer without rewarding speed. Risk: a student may chase the percentage and guess, so quick guesses stay a guardrail. Effect [not measured]. |
| My report | Latest try per question, updated on every repeat. First-try records are kept separately for the sheet and the aced rule. | Freezing the report at the first try, or a clear button | Students should see current standing, and the class data should stay clean. No clear button, so a repeat is the only way to change the report. |
| Diagrams | Trees, graphs and linked lists are drawn from data. A question shows a diagram only when it does not do the work for the student. Other diagrams appear with the solution. | A diagram on every question | Drawing the tree is often the skill being tested, so showing it early would give the answer away. |
| Question format | Multiple choice with traces | Typed code answers | Checkable in the browser and usable on a phone. Cost: guessing is possible, so quick guesses are flagged. |
| Career message | Roles and short descriptions from the aced topics, no links, no job listings | Naming companies or live job postings, or predicting a career | Postings expire and add no evidence a student can act on. The mapping is a suggestion. |

## 8. Known limits
- A student can still open an AI assistant in another tab. The tool makes thinking first the default path. It cannot enforce it.
- Three wrong attempts always reach the answer, so the think-first score has a floor that guessing can inflate. Read it together with the quick-guess share.
- 30 questions plus 30 second-chance versions is enough for a one-week pilot, not for a semester.
- Rows are anonymous and unsigned, and each browser code is counted as one student. A student on two phones counts twice, and rows could be forged because the form address is public. The numbers are for teaching decisions, not for grading.
- Two students supply about 40% of the first answers, so class-level percentages move a lot with them. Both versions of each metric are shown.
- The enrolled class size is not known, so reach has no true denominator. Completion uses students who answered as its denominator.
- The career mapping is a sourced mapping of skills to roles. It is not validated against any outcome, and several links are reasoned, not sourced.

## 9. Pilot plan
1. Done: the link was shared with the class and students started on 17 Nov 2026.
2. Get the class size from the instructor, so reach and completion have a real denominator.
3. After one week, read the Analysis tab and record the metrics above again. Compare answers before and after 18 Nov (variants, progress line) using the row timestamps, and say so when the comparison is not clean.
4. Read the feedback replies, then ask five students two questions: what annoyed you, and when did you want the solution sooner.
5. Decide from the data: keep, change or remove the three-attempt rule, and whether the progress line and career message changed how many students answer a first question.

## 10. Next, in priority order
1. Raise the share of students who answer a first question (58% of those who opened a topic did not). Candidate: start the first question straight from the home screen.
2. Revisit the 60% completion target once the class size is known. It is an assumption, and 17% is far below it.
3. Topic-level difficulty ordering from a larger sample.
4. Lab-style questions that ask for the bug in a short C program.
5. Unit-wise questions from the instructor's quiz, with two hints and a worked solution each.
