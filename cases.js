// Demo case, used when a teacher hasn't made their own yet.
// Each question: 3 statements, `lie` is the index of the false one.
// `truth` is the corrected fact, stated plainly. It is the last thing students read (truth sandwich).
// `why` is how we know. `source` is what "Look at more sources" shows.
export const DEMO = {
  title: "Ancient Egypt",
  questions: [
    {
      lines: [
        "The Great Pyramid was built for the pharaoh Khufu.",
        "The Great Pyramid of Giza is more than 4,500 years old.",
        "Cleopatra lived closer to the pyramid than to the Moon landing."
      ],
      lie: 2,
      truth: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
      why: "Cleopatra lived about 2,500 years after the pyramid and about 2,000 years before the Moon landing.",
      source: "The Great Pyramid was finished around 2550 BCE. Cleopatra VII was born in 69 BCE. Apollo 11 landed on the Moon in 1969 CE.",
      cite: [
        { label: "Britannica: Pyramids of Giza", url: "https://www.britannica.com/topic/Pyramids-of-Giza" },
        { label: "Britannica: Cleopatra", url: "https://www.britannica.com/biography/Cleopatra-queen-of-Egypt" }
      ]
    },
    {
      lines: [
        "The Nile River flooded every year and left rich soil behind.",
        "Ancient Egyptians wrote with pictures called hieroglyphs.",
        "Mummies were only made for pharaohs."
      ],
      lie: 2,
      truth: "Many Egyptians were mummified, not just pharaohs. Even animals like cats were mummified.",
      why: "Archaeologists have found mummies of nobles, ordinary people and millions of animals.",
      source: "Mummification was expensive, so the richest got the most care, but it was used across Egyptian society and for sacred animals.",
      cite: [{ label: "Britannica: Mummy", url: "https://www.britannica.com/topic/mummy-preserved-body" }]
    },
    {
      lines: [
        "Slaves built the pyramids while being whipped by guards.",
        "Pyramid workers lived in a town near the building site.",
        "The pyramids were tombs for Egyptian kings."
      ],
      lie: 0,
      truth: "The pyramids were mostly built by paid workers who lived in a nearby town.",
      why: "Archaeologists found the workers' town, their bakeries and their tombs right next to the pyramids.",
      source: "Excavations at Giza uncovered housing, food supplies and honored tombs for the crews who built the pyramids.",
      cite: [{ label: "Harvard Giza Project", url: "https://giza.fas.harvard.edu/" }]
    }
  ]
};
