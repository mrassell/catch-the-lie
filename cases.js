// Each case is one multiple-choice question: three statements, exactly one of which is the lie.
// `truth` is the corrected fact, `why` explains how we know.
// `source` is the paragraph shown under "Look at more sources" (it must not give the answer away),
// and `cite` lists where the facts come from.
export const CASES = [
  {
    lines: [
      { t: "The Great Pyramid was built for the pharaoh Khufu." },
      { t: "The Great Pyramid of Giza is more than 4,500 years old." },
      {
        t: "Cleopatra lived closer to the pyramid than to the Moon landing.",
        lie: true,
        truth: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
        why: "Cleopatra lived about 2,500 years after the pyramid and about 2,000 years before the Moon landing."
      }
    ],
    source:
      "The Great Pyramid of Giza was finished around 2550 BCE, during the reign of Khufu. Cleopatra VII, the famous last queen of Egypt, was born in 69 BCE, roughly 2,500 years after the pyramid was built. The Apollo 11 Moon landing happened in 1969 CE, about 2,000 years after Cleopatra was born.",
    cite: [
      { label: "Encyclopaedia Britannica: Pyramids of Giza", url: "https://www.britannica.com/topic/Pyramids-of-Giza" },
      { label: "Encyclopaedia Britannica: Cleopatra", url: "https://www.britannica.com/biography/Cleopatra-queen-of-Egypt" }
    ]
  },
  {
    lines: [
      { t: "The Great Wall of China was built and rebuilt over many centuries." },
      {
        t: "The Great Wall of China is easily visible from space with the naked eye.",
        lie: true,
        truth: "The Great Wall of China cannot be seen from space with the naked eye.",
        why: "The wall is very long but narrow, and NASA says it is generally not visible to the unaided eye from low Earth orbit."
      },
      { t: "Much of the Great Wall that visitors see today was built during the Ming dynasty." }
    ],
    source:
      "The Great Wall is not one single wall but a series of walls and fortifications built by different Chinese states and dynasties. Work began in the first millennium BCE and continued for many centuries. Most of the best-preserved sections were built or rebuilt under the Ming dynasty (1368 to 1644). In many places the wall is only a few metres wide.",
    cite: [
      { label: "Encyclopaedia Britannica: Great Wall of China", url: "https://www.britannica.com/topic/Great-Wall-of-China" },
      { label: "NASA: China's Wall Less Great in View from Space", url: "https://webarchive.library.unt.edu/eot2008/20080917153200/http://www.nasa.gov/vision/space/workinginspace/great_wall.html" }
    ]
  },
  {
    lines: [
      {
        t: "Vikings wore horned helmets into battle.",
        lie: true,
        truth: "There is no evidence that Vikings wore horned helmets into battle.",
        why: "The horned Viking look comes from 19th-century art and costume design, not from archaeological finds."
      },
      { t: "Vikings from Scandinavia raided, traded and settled across much of Europe." },
      { t: "Norse explorers built a settlement in North America around 1000 CE, centuries before Columbus." }
    ],
    source:
      "The Viking Age is usually dated from roughly 800 to 1050 CE. Scandinavians sailed in shallow-hulled longships that could cross open sea and travel far up rivers. At L'Anse aux Meadows in Newfoundland, archaeologists found the remains of an 11th-century Norse settlement. It is the earliest known European presence in North America.",
    cite: [
      { label: "UNESCO: L'Anse aux Meadows", url: "https://whc.unesco.org/en/list/4" },
      { label: "History.com: Did Vikings Really Wear Horned Helmets?", url: "https://history.com/news/did-vikings-really-wear-horned-helmets" }
    ]
  },
  {
    lines: [
      { t: "Napoleon Bonaparte became Emperor of the French in 1804." },
      { t: "Napoleon died in exile on the island of Saint Helena in 1821." },
      {
        t: "Napoleon was unusually short, only about 5 feet 2 inches tall in modern measurements.",
        lie: true,
        truth: "Napoleon was about 5 feet 7 inches tall, average or slightly above average for a Frenchman of his time.",
        why: "The 5 feet 2 inches figure was in older French units, in which the foot and inch were longer than the English ones."
      }
    ],
    source:
      "Napoleon rose from army officer to ruler of France in the years after the French Revolution. He was crowned emperor in 1804. Measurements recorded in his lifetime used the old French system, which was replaced by the metric system. After his final defeat he was exiled by Britain to Saint Helena, a remote island in the South Atlantic.",
    cite: [
      { label: "Encyclopaedia Britannica: Napoleon I", url: "https://www.britannica.com/biography/Napoleon-I" },
      { label: "Encyclopaedia Britannica: Was Napoleon Short?", url: "https://www.britannica.com/story/was-napoleon-short" }
    ]
  }
];
