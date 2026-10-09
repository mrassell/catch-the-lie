// Demo case, used when a teacher hasn't made their own yet.
// Each question: 3 statements, `lie` is the index of the false one.
// `truth` is the corrected fact, stated plainly. It is the last thing students read (truth sandwich).
// `why` is how we know. `evidence` is the evidence board: one fact per statement, shuffled, never saying which is the lie.
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
      evidence: [
        { quote: "The Great Pyramid of Giza was built around 2560 BCE for the pharaoh Khufu.", from: "Britannica · Pyramids of Giza", url: "https://www.britannica.com/topic/Pyramids-of-Giza" },
        { quote: "Cleopatra VII was born in 69 BCE. The Apollo 11 Moon landing was in 1969 CE.", from: "Britannica · Cleopatra", url: "https://www.britannica.com/biography/Cleopatra-queen-of-Egypt" },
        { quote: "Construction of the Great Pyramid finished roughly 4,500 years ago.", from: "Britannica · Pyramids of Giza", url: "https://www.britannica.com/topic/Pyramids-of-Giza" }
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
      evidence: [
        { quote: "Egyptians of many social classes were mummified, and so were millions of sacred animals like cats and ibises.", from: "Britannica · Mummy", url: "https://www.britannica.com/topic/mummy-preserved-body" },
        { quote: "Hieroglyphic writing used pictures to stand for sounds and ideas.", from: "Britannica · Hieroglyph", url: "https://www.britannica.com/topic/hieroglyph" },
        { quote: "The yearly Nile flood left behind a layer of rich black silt that made farming possible.", from: "Britannica · Nile River", url: "https://www.britannica.com/place/Nile-River" }
      ]
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
      evidence: [
        { quote: "Archaeologists found a town next to the pyramids with bakeries, homes and tombs for the workers.", from: "Harvard Giza Project", url: "https://giza.fas.harvard.edu/" },
        { quote: "The workers were buried in their own tombs near the pyramids, an honor for respected workers.", from: "Harvard Giza Project", url: "https://giza.fas.harvard.edu/" },
        { quote: "The pyramids at Giza were built as royal tombs.", from: "Britannica · Pyramids of Giza", url: "https://www.britannica.com/topic/Pyramids-of-Giza" }
      ]
    }
  ]
};
