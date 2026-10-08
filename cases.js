// Each case: a witness explains a topic. Lines with a `lie` field are the ones students should catch.
// `truth` is the corrected fact, stated plainly. It is the last thing students see (truth sandwich).
// `lie` is the short explanation of how we know.
// `answers` are what Professor Pixel says when students ask a question.
export const CASES = [
  {
    title: "The Great Pyramid",
    lines: [
      { t: "The Great Pyramid was built for the pharaoh Khufu." },
      { t: "It is more than 4,500 years old." },
      { t: "Cleopatra lived closer to the pyramid than to the Moon landing.", truth: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.", lie: "Cleopatra lived about 2,500 years after the pyramid and about 2,000 years before the Moon landing." }
    ],
    answers: {
      source: "A very reliable website. Trust me.",
      reason: "They're both ancient Egypt, so they must be close in time.",
      check: "Pyramid: about 2560 BCE. Cleopatra: born 69 BCE. Moon landing: 1969."
    }
  }
];
