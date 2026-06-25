import { BingoCell } from '../types';

// A curated list of extremely common and fun 5-letter English words
export const WORDS = [
  "ABOUT", "ABOVE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN", "AGENT", "AGREE", "AHEAD",
  "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY",
  "APART", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE", "ARMOR", "ARROW", "ASSET", "AUDIO", "AWAKE", "AWARD",
  "BADGE", "BAKER", "BASIC", "BASIS", "BEACH", "BEARD", "BEAST", "BEGIN", "BEING", "BELOW", "BENCH", "BIBLE",
  "BIRTH", "BLACK", "BLADE", "BLAME", "BLANK", "BLAST", "BLEND", "BLIND", "BLINK", "BLOCK", "BLOND", "BLOOD",
  "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAVE", "BREAD", "BREAK", "BREED", "BRICK", "BRIDE", "BRIEF",
  "BRING", "BROAD", "BRUSH", "BUILD", "BUNCH", "BURST", "CABIN", "CABLE", "CAMEL", "CANAL", "CANDY",
  "CARGO", "CARRY", "CARVE", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHAMP", "CHANT", "CHAOS", "CHARM",
  "CHART", "CHASE", "CHEAP", "CHEAT", "CHECK", "CHEEK", "CHEER", "CHEST", "CHIEF", "CHILD", "CHILL", "CHIPS",
  "CHOIR", "CIVIC", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLOCK",
  "CLOSE", "CLOTH", "CLOUD", "CLOWN", "COACH", "COAST", "COCOA", "COLON", "COMET", "CORAL", "COUCH",
  "COUNT", "COURT", "COVER", "CRACK", "CRAFT", "CRANE", "CRASH", "CRAWL", "CRAZY", "CREAM", "CREED", "CREEK",
  "CREST", "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CRUSH", "CYCLE", "DAILY", "DAIRY", "DANCE",
  "DEATH", "DEBUT", "DELAY", "DEPTH", "DEVIL", "DIARY", "DIGIT", "DIRTY", "DISCO", "DIZZY", "DONUT",
  "DOUBT", "DRAFT", "DRAIN", "DRAMA", "DREAD", "DREAM", "DRESS", "DRIFT", "DRILL", "DRINK", "DRIVE", "DROWN",
  "DUMMY", "DUSTY", "DWARF", "DWELL", "EARLY", "EARTH", "EBONY", "ELBOW", "ELDER", "ELECT", "ELITE", "EMPTY",
  "ENACT", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "EQUIP", "ERASE", "ERROR", "EVENT", "EVERY", "EXACT",
  "EXIST", "EXTRA", "FAINT", "FAIRY", "FAITH", "FALSE", "FANCY", "FATAL", "FAULT", "FAVOR", "FEAST", "FIBER",
  "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED", "FLAME", "FLASH", "FLASK", "FLEET", "FLESH",
  "FLICK", "FLOAT", "FLOCK", "FLOOD", "FLOOR", "FLOUR", "FLUID", "FLUTE", "FLYER", "FOCUS", "FOGGY", "FORCE",
  "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FROST", "FRUIT", "FUNNY",
  "GIANT", "GLASS", "GLEAM", "GLIDE", "GLOBE", "GLOOM", "GLORY", "GLOVE", "GRACE", "GRADE", "GRAIN", "GRAND",
  "GRANT", "GRAPE", "GRAPH", "GRASP", "GRASS", "GRAVE", "GRAVY", "GREAT", "GREEN", "GREET", "GRIEF", "GRILL",
  "GRIND", "GROOM", "GROSS", "GROUP", "GROWL", "GROWN", "GUARD", "GUEST", "GUIDE", "GUILD", "GUILT",
  "HABIT", "HAIRY", "HAPPY", "HARSH", "HASTE", "HAVOC", "HEART", "HEAVY", "HELLO", "HONOR", "HORSE", "HOTEL",
  "HOUSE", "HUMAN", "HUMOR", "HURRY", "IDEAL", "IMAGE", "IMPLY", "INDEX", "INNER", "INPUT", "IVORY", "JEANS",
  "JELLY", "JEWEL", "JOINT", "JOKER", "JUDGE", "JUICE", "JUMBO", "KNIFE", "KNOCK", "LABEL", "LABOR",
  "LARGE", "LASER", "LATER", "LATEX", "LAUGH", "LAYER", "LEARN",
  "LEASE", "LEASH", "LEAST", "LEMON", "LEVEL", "LEVER", "LIGHT", "LIMIT", "LINER", "LIVER", "LOCAL",
  "LOGIC", "LOOSE", "LUCKY", "LUNCH", "LYRIC", "MACRO", "MAGIC", "MAJOR", "MAKER", "MANGO", "MANOR", "MAPLE",
  "MARCH", "MATCH", "MAYOR", "MEDAL", "MELON", "MERCY", "MERGE", "MERIT", "METAL", "MICRO", "MIDST",
  "MIGHT", "MILKY", "MINER", "MINOR", "MINUS", "MIXER", "MODEL", "MOIST", "MONEY", "MONTH", "MOTOR",
  "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUMMY", "MUSIC", "NIGHT", "NINTH", "NOBLE", "NOISE", "NORTH",
  "NOVEL", "NURSE", "NYMPH", "OCEAN", "OFFER", "OFTEN", "OLIVE", "ONION", "ONSET", "OPERA", "OPTIC", "ORBIT",
  "ORDER", "ORGAN", "OTHER", "OTTER", "OUGHT", "OUTER", "OWNER", "OZONE", "PAINT", "PANEL", "PANIC", "PAPER",
  "PARTY", "PATCH", "PATIO", "PEACH", "PEARL", "PEDAL", "PENNY", "PHASE", "PHONE", "PHOTO", "PIANO",
  "PILOT", "PINCH", "PIVOT", "PIXEL", "PIZZA", "PLACE", "PLAIN", "PLANE", "PLANK", "PLANT", "PLATE", "PLAZA",
  "PLEAD", "PLUCK", "PLUMB", "PLUSH", "POINT", "POKER", "POLAR",
  "PORCH", "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROBE",
  "PROUD", "PROVE", "PULSE", "PUPIL", "PUPPY", "PURSE", "QUEEN", "QUERY", "QUEST", "QUEUE", "QUICK", "QUIET",
  "QUILT", "QUIRK", "QUITE", "QUOTA", "QUOTE", "RADIO", "RAISE", "RANCH", "RANGE", "RAPID", "RATIO", "REACH",
  "REACT", "READY", "REALM", "REBEL", "REFER", "REIGN", "RELAX", "REPLY", "RESET", "RESIN", "RETRO", "RIDER",
  "RIDGE", "RIFLE", "RIGHT", "RIGID", "RIGOR", "RINSE", "RIVAL", "RIVER", "ROBOT", "ROCKY", "ROGUE", "ROUGH",
  "ROUND", "ROUTE", "ROYAL", "RULER", "RUMOR", "RURAL", "SAINT", "SALAD", "SALON", "SALSA", "SALTY", "SANDY",
  "SATIN", "SAUCE", "SCALE", "SCALP", "SCARE", "SCARF", "SCENE", "SCENT", "SCONE", "SCOPE", "SCORE", "SCORN",
  "SCOUT", "SCRAP", "SCREW", "SCUBA", "SEDAN", "SEIZE", "SENSE", "SERUM", "SERVE", "SETUP", "SEVEN",
  "SEVER", "SHACK", "SHADE", "SHADY", "SHAFT", "SHAKE", "SHAKY", "SHAME", "SHAPE", "SHARE", "SHARK", "SHARP",
  "SHAVE", "SHAWL", "SHEEP", "SHEER", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHINY", "SHIRT", "SHOCK",
  "SHOOT", "SHORE", "SHORT", "SHOUT", "SHOVE", "SHOWN", "SHRUB", "SHRUG", "SIGHT", "SILLY",
  "SINCE", "SIREN", "SIXTY", "SKATE", "SKILL", "SKIRT", "SKULL", "SLANG", "SLATE",
  "SLEEK", "SLEEP", "SLEPT", "SLICE", "SLIDE", "SLIME", "SLING", "SLOPE", "SLOTH", "SMALL", "SMART",
  "SMASH", "SMELL", "SMILE", "SMOKE", "SMOKY", "SNAIL", "SNAKE", "SNEAK", "SOBER", "SOLAR", "SOLID",
  "SOLVE", "SONAR", "SONIC", "SORRY", "SOUND", "SOUTH", "SPACE", "SPADE", "SPARK", "SPASM", "SPEAK", "SPEAR",
  "SPEED", "SPELL", "SPEND", "SPENT", "SPICE", "SPICY", "SPIKE", "SPILL", "SPINE", "SPIRE",
  "SPLIT", "SPOIL", "SPOKE", "SPOON", "SPORT", "SPRAY", "SQUAD", "SQUAT", "SQUID", "STACK", "STAFF",
  "STAGE", "STAIN", "STAIR", "STAKE", "STALE", "STAMP", "STAND", "STARE", "STARK", "START", "STATE", "STEAK",
  "STEAL", "STEAM", "STEEL", "STEEP", "STEER", "STICK", "STIFF", "STILL", "STING", "STINK", "STOCK",
  "STONE", "STORM", "STORY", "STOUT", "STOVE", "STRAP", "STRAW", "STRAY", "STRIP", "STUDY", "STUFF", "STUMP",
  "STYLE", "SUITE", "SUNNY", "SUPER", "SURGE", "SUSHI", "SWEAR", "SWEAT", "SWEEP", "SWEET", "SWELL", "SWEPT",
  "SWIFT", "SWING", "SWIPE", "SWIRL", "SWORD", "SYRUP", "TABLE", "TASTE", "TASTY", "TEACH", "TEETH", "TEMPO",
  "TEMPT", "TENOR", "TENSE", "TENTH", "TERSE", "THEFT", "THEME", "THERE", "THICK", "THIEF", "THIGH", "THING",
  "THINK", "THIRD", "THORN", "THOSE", "THREE", "THREW", "THROW", "THUMB", "TIGER", "TIGHT", "TITLE", "TOAST",
  "TODAY", "TOKEN", "TONAL", "TONIC", "TOOTH", "TOPIC", "TORCH", "TORSO", "TOTAL", "TOUCH", "TOUGH",
  "TOWEL", "TOWER", "TOXIC", "TRACE", "TRACK", "TRADE", "TRAIL", "TRAIN", "TRAIT", "TRASH", "TREAD", "TREAT",
  "TREND", "TRIAL", "TRIBE", "TRICK", "TROOP", "TRUCK", "TRULY", "TRUNK", "TRUST", "TRUTH",
  "TULIP", "TUMOR", "TUNER", "TUNIC", "TURBO", "TUTOR", "TWICE", "TWINS", "TWIRL", "TWIST", "ULCER",
  "ULTRA", "UNCLE", "UNDER", "UNION", "UNITE", "UNITY", "UNTIL", "UPSET", "URBAN", "USAGE", "USUAL", "UTTER",
  "VAGUE", "VALID", "VALUE", "VALVE", "VAPOR", "VAULT", "VEGAN", "VENOM", "VENUE", "VERGE", "VERSE",
  "VIGOR", "VILLA", "VINYL", "VIRAL", "VIRUS", "VISIT", "VISOR", "VISTA", "VITAL", "VIVID", "VOCAL", "VODKA",
  "VOGUE", "VOICE", "VOMIT", "VOTER", "VOWEL", "WACKY", "WAFER", "WAGER", "WAGON", "WAIST", "WAIVE",
  "WALTZ", "WASTE", "WATCH", "WATER", "WAVEY", "WEARY", "WEAVE", "WHEAT", "WHEEL", "WHERE",
  "WHICH", "WHILE", "WHIRL", "WHITE", "WHOLE", "WIDOW", "WIDTH", "WINCH", "WINDY", "WIPER", "WITCH",
  "WITTY", "WOMAN", "WOMEN", "WORDS", "WORDY", "WORKS", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD",
  "WOUND", "WOVEN", "WRECK", "WRIST", "WRITE", "WRONG", "WROTE", "YACHT", "YEARS", "YEAST", "YIELD", "YOUNG",
  "YOUTH", "ZEBRA", "ZEROS", "ZESTY"
];

export interface BingoPoolItem {
  label: string;
  description: string;
  type: string;
  value?: string | number;
}

// Full pool of interesting Bingo conditions to sample from
export const BINGO_CONDITIONS_POOL: BingoPoolItem[] = [
  { label: "Solve in <= 3 Tries", description: "Guess the correct word in 3 or fewer attempts", type: "SOLVE_GUESS_LE_3" },
  { label: "Solve in Exactly 4", description: "Guess the correct word in exactly 4 attempts", type: "SOLVE_GUESS_EQ_4" },
  { label: "Solve in 5-6 Tries", description: "Guess the correct word in 5 or 6 attempts", type: "SOLVE_GUESS_5_6" },
  
  { label: "Starts with Vowel", description: "The correct word starts with A, E, I, O, or U", type: "WORD_STARTS_VOWEL" },
  { label: "Starts with S / T / A / C", description: "The correct word starts with S, T, A, or C", type: "WORD_STARTS_STAC" },
  { label: "Ends with 'E'", description: "The correct word ends with the letter E", type: "WORD_ENDS_E" },
  { label: "Ends with 'Y'", description: "The correct word ends with the letter Y", type: "WORD_ENDS_Y" },
  { label: "Ends with Consonant", description: "The correct word ends with a consonant (not A, E, I, O, U, Y)", type: "WORD_ENDS_CONSONANT" },

  { label: "Has Double Letter", description: "The correct word has a repeating letter (e.g., APPLE, SILLY)", type: "WORD_HAS_DOUBLE" },
  { label: "No Repeating Letters", description: "Every letter in the correct word is unique", type: "WORD_NO_REPEATS" },
  
  { label: "Contains 'E'", description: "The correct word contains the letter E", type: "WORD_CONTAINS_LETTER", value: "E" },
  { label: "Contains 'A'", description: "The correct word contains the letter A", type: "WORD_CONTAINS_LETTER", value: "A" },
  { label: "Contains 'O'", description: "The correct word contains the letter O", type: "WORD_CONTAINS_LETTER", value: "O" },
  { label: "Contains 'I'", description: "The correct word contains the letter I", type: "WORD_CONTAINS_LETTER", value: "I" },
  { label: "Contains 'U'", description: "The correct word contains the letter U", type: "WORD_CONTAINS_LETTER", value: "U" },
  { label: "Contains 'S' or 'T'", description: "The correct word contains either S or T", type: "WORD_CONTAINS_S_OR_T" },
  { label: "Contains 'R' or 'L'", description: "The correct word contains either R or L", type: "WORD_CONTAINS_R_OR_L" },
  { label: "Rare Letter: Z/X/Q/J/K", description: "The correct word contains at least one of: Z, X, Q, J, or K", type: "WORD_CONTAINS_RARE" },

  { label: "Green in Column 1", description: "A letter in the first position is green in your final solved state", type: "GREEN_COL_1" },
  { label: "Green in Column 3", description: "A letter in the middle position is green in your final solved state", type: "GREEN_COL_3" },
  { label: "Green in Column 5", description: "A letter in the last position is green in your final solved state", type: "GREEN_COL_5" },
  { label: "All Green Final", description: "All letters in your final winning guess are Green (standard Wordle win)", type: "ALL_GREEN" },

  { label: "Had 3+ Yellows", description: "Had 3 or more Yellow letters in any single guess during the round", type: "GAME_3_YELLOWS" },
  { label: "Had 4+ Greens", description: "Had 4 or more Green letters in any single guess during the round", type: "GAME_4_GREENS" },
  { label: "Zero Yellow Solve", description: "Solved the word without ever getting a Yellow tile (only Green or Absent)", type: "SOLVE_ZERO_YELLOWS" },
  { label: "Consonant Blend", description: "Word has a consonant blend like CH, SH, TH, ST, GR, PL, CL", type: "WORD_HAS_BLEND" }
];

// Helper to shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate a random 5x5 Bingo Board with center Free Space
export function generateBingoBoard(): BingoCell[] {
  const shuffledPool = shuffleArray(BINGO_CONDITIONS_POOL);
  const board: BingoCell[] = [];
  let poolIndex = 0;

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) {
        // Center is FREE SPACE
        board.push({
          id: `cell-free`,
          label: "FREE SPACE",
          description: "Stamps automatically!",
          type: "FREE_SPACE",
          stamped: true,
          row: r,
          col: c,
          isFree: true
        });
      } else {
        const cond = shuffledPool[poolIndex % shuffledPool.length];
        board.push({
          id: `cell-${r}-${c}`,
          label: cond.label,
          description: cond.description,
          type: cond.type,
          value: cond.value,
          stamped: false,
          row: r,
          col: c
        });
        poolIndex++;
      }
    }
  }

  return board;
}

// Function to check if a word matches a specific Bingo cell condition
export function evaluateCondition(
  cell: BingoCell,
  secretWord: string,
  guesses: string[],
  guessCount: number,
  guessColors: ('correct' | 'present' | 'absent')[][] // Array of guess letter feedbacks
): boolean {
  if (cell.isFree) return true;

  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const word = secretWord.toUpperCase();

  switch (cell.type) {
    case "SOLVE_GUESS_LE_3":
      return guessCount > 0 && guessCount <= 3;
    
    case "SOLVE_GUESS_EQ_4":
      return guessCount === 4;

    case "SOLVE_GUESS_5_6":
      return guessCount >= 5 && guessCount <= 6;

    case "WORD_STARTS_VOWEL":
      return vowels.includes(word[0]);

    case "WORD_STARTS_STAC":
      return ['S', 'T', 'A', 'C'].includes(word[0]);

    case "WORD_ENDS_E":
      return word[4] === 'E';

    case "WORD_ENDS_Y":
      return word[4] === 'Y';

    case "WORD_ENDS_CONSONANT":
      return !vowels.includes(word[4]) && word[4] !== 'Y';

    case "WORD_HAS_DOUBLE": {
      const letters = word.split('');
      const unique = new Set(letters);
      return unique.size < letters.length;
    }

    case "WORD_NO_REPEATS": {
      const letters = word.split('');
      const unique = new Set(letters);
      return unique.size === letters.length;
    }

    case "WORD_CONTAINS_LETTER":
      if (typeof cell.value === 'string') {
        return word.includes(cell.value.toUpperCase());
      }
      return false;

    case "WORD_CONTAINS_S_OR_T":
      return word.includes('S') || word.includes('T');

    case "WORD_CONTAINS_R_OR_L":
      return word.includes('R') || word.includes('L');

    case "WORD_CONTAINS_RARE":
      return ['Z', 'X', 'Q', 'J', 'K'].some(letter => word.includes(letter));

    case "GREEN_COL_1":
      // Did column 1 (index 0) end up Green? Since we solved it, the solved letter is always green
      // but let's double check if we solved it. If guessCount > 0, we did solve it, so col 1 is green.
      return guessCount > 0;

    case "GREEN_COL_3":
      return guessCount > 0;

    case "GREEN_COL_5":
      return guessCount > 0;

    case "ALL_GREEN":
      return guessCount > 0;

    case "GAME_3_YELLOWS": {
      // Loop through each guess's color feedback, count yellow ('present')
      return guessColors.some(colors => {
        const yellows = colors.filter(c => c === 'present').length;
        return yellows >= 3;
      });
    }

    case "GAME_4_GREENS": {
      return guessColors.some(colors => {
        const greens = colors.filter(c => c === 'correct').length;
        return greens >= 4;
      });
    }

    case "SOLVE_ZERO_YELLOWS": {
      if (guessCount === 0) return false;
      // Evaluate if we solved it without any 'present' status in our guesses
      return !guessColors.some(colors => colors.includes('present'));
    }

    case "WORD_HAS_BLEND": {
      const blends = [
        "CH", "SH", "TH", "ST", "GR", "PL", "CL", "TR", "BR", "FL", "SP", "SM", "SN", "PR", "CR", "DR", "WH"
      ];
      return blends.some(blend => word.includes(blend));
    }

    default:
      return false;
  }
}
