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
      check: "The Great Pyramid of Giza was finished around 2550 BCE, during the reign of Khufu. Cleopatra VII, the famous last queen of Egypt, was born in 69 BCE, roughly 2,500 years after the pyramid was built. The Apollo 11 Moon landing happened in 1969 CE, about 2,000 years after Cleopatra was born.",
      cite: [
        { label: "Encyclopaedia Britannica: Pyramids of Giza", url: "https://www.britannica.com/topic/Pyramids-of-Giza" },
        { label: "Encyclopaedia Britannica: Cleopatra", url: "https://www.britannica.com/biography/Cleopatra-queen-of-Egypt" }
      ]
    }
  }
];
