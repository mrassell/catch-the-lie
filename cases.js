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
  },
  {
    title: "The Declaration of Independence",
    lines: [
      { t: "Congress adopted it on July 4, 1776." },
      { t: "Thomas Jefferson wrote most of the first draft." },
      { t: "Everyone signed it together on July 4th.", truth: "Most delegates signed the Declaration on August 2, 1776, not July 4.", lie: "The National Archives says most signed on August 2. Paintings of everyone signing together are not a record of the day." }
    ],
    answers: {
      source: "Every famous painting shows them signing together.",
      reason: "The date at the top says July 4.",
      check: "National Archives: most delegates signed on August 2, 1776."
    }
  },
  {
    title: "Votes for Women",
    lines: [
      { t: "The 19th Amendment gave women the vote in 1920." },
      { t: "Susan B. Anthony was arrested in 1872 for voting." },
      { t: "She lived to see the 19th Amendment pass.", truth: "Susan B. Anthony died in 1906. She did not live to see the 19th Amendment pass in 1920.", lie: "The Library of Congress lists her life as 1820 to 1906. The amendment is nicknamed after her because of her work." }
    ],
    answers: {
      source: "Everybody knows that story.",
      reason: "She fought so hard, so she must have seen it.",
      check: "Library of Congress: Susan B. Anthony, 1820 to 1906."
    }
  },
  {
    title: "The Great Wall of China",
    lines: [
      { t: "It is many walls built over hundreds of years." },
      { t: "Most of what stands today is from the Ming dynasty." },
      { t: "Astronauts can easily see it from space.", truth: "You can NOT easily see the Great Wall from space with just your eyes.", lie: "The wall is long but narrow and about the same color as the land around it, so astronauts can't pick it out." }
    ],
    answers: {
      source: "Lots of people say it online.",
      reason: "It's super long, so it must be visible.",
      check: "NASA: the wall is generally not visible to the naked eye from orbit."
    }
  },
  {
    title: "The Vikings",
    lines: [
      { t: "The Vikings came from Scandinavia." },
      { t: "Viking warriors wore horned helmets.", truth: "Vikings did NOT wear horned helmets.", lie: "No horned battle helmet has ever been found. That look came from 1800s costumes." },
      { t: "Leif Erikson reached North America around 1000." },
      { t: "Vikings only raided and never traded.", truth: "Vikings were also farmers and traders, not just raiders.", lie: "One-sided. Vikings also farmed and traded as far as Baghdad." }
    ],
    answers: {
      source: "Movies and Halloween costumes.",
      reason: "Raiding is what they're famous for.",
      check: "Museum: no horned helmets found. Vikings traded from Ireland to Baghdad."
    }
  }
];
