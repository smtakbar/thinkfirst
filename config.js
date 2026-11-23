// Integrity logging settings. Activity is flagged for the teacher, never blocked.
// An attempt is flagged when ALL of these hold: a copy or cut event happened on the question,
// the tab was hidden or the window blurred for more than awayMinSeconds, and the question was
// answered correctly less than answerMaxSeconds after the student came back to the tab.
window.TF_CONFIG = {
  integrity: {
    awayMinSeconds: 20,
    answerMaxSeconds: 10,
    requireCopy: true
  }
};
