/* ============================================================
   EDIT ZONE — every piece of writing lives here, plain English.
   ============================================================ */

const HER_NAME = "Taleen";
const HIS_NAME = "Mohammad";
const CANDLE_COUNT = 22;
const BIRTHDAY_LABEL = "SEPTEMBER 3RD";

// ---------- ACT I: The Opening Letter + The Gift ----------
const GIFT_TAG_TO = "To Taleen,";
const GIFT_TAG_FROM = "from Mohammad.";

// Your words, exactly as written, split into paragraphs for the card.
const OPENING_LETTER = [
  "My darling. I don't really know where to begin, because somehow, every time I try to put what you mean to me into words, they never feel like enough.",
  "You've become someone I carry with me in so many little parts of my day — someone I think about when something makes me smile, someone I want to tell things to, someone whose happiness genuinely matters to me.",
  "And today, more than anything, I just want you to feel how loved you are.",
  "I wish I could put every feeling I have for you into this little corner of the internet and let you see it exactly the way I feel it, but I can't. So instead, I made you this.",
  "Every little detail here was made with you in mind, because you deserve something that feels like it belongs to you.",
  "I hope as you go through it, you smile, laugh, maybe get a little emotional, and most importantly, feel just how much you mean to me.",
  "Happiest birthday, my baby. This is all for you."
];
const POST_UNWRAP_LINE = "Happy birthday, my queen.";

// ---------- ACT II: The Journey ----------
// clock (optional) renders as a small tag above the line.
const JOURNEY_LINES = [
  { clock: BIRTHDAY_LABEL, text: "Don't ask where we're going." },
  { text: "You don't get a hint." },
  { text: "Okay... maybe one." },
  { text: "Somewhere the sand meets the sea." }
];

// ---------- ACT III: Arrival ----------
const WAITER_GREETING_LINES = [
  "Good evening, sir and ma'am.",
  "May I take your order?"
];

// ---------- ACT IV: The Dinner ----------
const MENU = {
  starters: [
    { name: "Garlic Butter Shrimp", desc: "pan-seared, lemon, cracked pepper" },
    { name: "Oysters", desc: "chilled, mignonette" },
    { name: "Calamari", desc: "lightly fried, chili aioli" }
  ],
  mains: [
    { name: "Grilled Sea Bass", desc: "citrus butter, charred asparagus", reaction: "A beautiful choice tonight." },
    { name: "Lobster", desc: "whole, drawn butter, herbs", reaction: "Excellent choice, ma'am." },
    { name: "Seafood Pasta", desc: "linguine, white wine, chili flake", reaction: "I had a feeling you'd pick that one." }
  ]
};
const WAITER_DEFAULT_REACTION = "A wonderful choice.";

// ---------- ACT V: The Letter ----------
// Shown as one continuous handwritten card, exactly as written.
const LETTER_PARAGRAPHS = [
  "My queen, my whole world, and the love of my life —",
  "Doing this has been really beautiful, and pretty stressful. I really hope you're loving this so far. But wait, there's more to come.",
  "I just want to say... you look really gorgeous right now. And until I can say this with tears in my eyes in front of you, I hope you're enjoying this.",
  "I love you forever."
];

// ---------- ACT VI: The Suitcase ----------
const SUITCASE_INTRO_LINE = "Waiter: this is for you madam....";
const GOLD_PASS = {
  validDate: BIRTHDAY_LABEL,
  holder: HER_NAME,
  front: "For one day, your wishes are my plans.",
  terms: "Terms & conditions: I am not allowed to say no.",
  back: "Use responsibly, my queen."
};
const RING_CAPTION = "until I can put this on you.";
const KEY_INSCRIPTION = "Wait, wait — you'll need this later.";
const KEY_FOOTNOTE = "After we're done, ask to use the key...";

// ---------- ACT VIII: The Cake ----------
const CAKE_LINE_1 = "HAPPY 22ND MI AMORRRR";
const CAKE_INTRO_LINE = "There's one more thing I've been saving for last.";
const CAKE_LINE_2 = "Make a wish.";

// ---------- ACT IX: The Finale ----------
const FINALE_TITLE = "HAPPIEST BIRTHDAY, MI AMOR";
const FINALE_SIGNATURE = "— " + HIS_NAME;
