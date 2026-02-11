export interface RitualOption {
  id: string;
  label: string;
  content: string;
}

// Ritual Types
export const ritualTypes = [
  "Unity Candle Ceremony",
  "Sand Ceremony",
  "Handfasting Ceremony",
  "Wine/Cup Ceremony",
  "Rose Ceremony",
  "Ring Warming Ceremony",
  "Tree Planting Ceremony",
  "Stone Ceremony",
  "Oathing Stone Ceremony",
  "Cord of Three Strands",
];

// Sand Ceremony Options
export const sandCeremonyOptions: RitualOption[] = [
  {
    id: "sand1",
    label: "Traditional Sand Ceremony",
    content:
      "{groom_name} and {bride_name}, today you are making a life-long commitment to share the rest of your lives with each other. The two separate bottles of sand represent your lives until this moment—individual and unique. As you each hold your sand, remember that they represent everything you were, everything you are, and everything you will ever be. Now, as you pour your sand together, your lives also join together as one. Just as these grains of sand can never be separated and poured again into individual containers, so will your marriage be—an inseparable union of two lives joined in love.",
  },
  {
    id: "sand2",
    label: "Family Sand Ceremony",
    content:
      "{groom_name} and {bride_name}, the sand you hold represents not only yourselves, but also your families, your friends, and all who have shaped you into the people you are today. As you pour your sand together, you unite not just two lives, but two histories, two families, and two futures. This blended sand can never be separated, just as your union will be permanent and unbreakable.",
  },
  {
    id: "sand3",
    label: "Symbolic Sand Ceremony",
    content:
      "Each grain of sand brings to this mixture a lasting beauty that forever enriches the combination. {groom_name}, as you pour your sand, you bring your strength, your dreams, and your love. {bride_name}, as you pour your sand, you bring your grace, your wisdom, and your devotion. Together, you create something entirely new and beautiful—a symbol of your united love that will endure through all the seasons of your life together.",
  },
  {
    id: "sand4",
    label: "Spiritual Sand Ceremony",
    content:
      "Like countless grains of sand on the shore, your love is infinite and eternal. {groom_name} and {bride_name}, as you combine these individual containers of sand, remember that just as the ocean shapes the shore over time, your love will continue to shape and strengthen your marriage through all the years to come. May this blended sand remind you that you are stronger together than you could ever be apart.",
  },
];

// Rose Ceremony Options
export const roseCeremonyOptions: RitualOption[] = [
  {
    id: "rose1",
    label: "Rose Ceremony Option 1",
    content:
      "{groom_name} and {bride_name}, you have given and received a rose. This is your first gift as a married couple. In the future, whenever you give or receive a bouquet of roses, remember this moment and the love you pledged today.",
  },
  {
    id: "rose2",
    label: "Rose Ceremony Option 2",
    content:
      "The rose is a symbol of love, beauty, and new beginnings. {groom_name} and {bride_name}, as you exchange these roses, you exchange your promise to love, honor, and cherish each other.",
  },
  {
    id: "rose3",
    label: "Rose Ceremony Option 3",
    content:
      "{groom_name} and {bride_name}, the red rose is a symbol of love and passion. By exchanging these roses, you are giving each other your first gift as a married couple and promising that even in times of difficulty, you will remember this love.",
  },
];

// Unity Candle Options
export const unityCandleOptions: RitualOption[] = [
  {
    id: "candle1",
    label: "Traditional Unity Candle",
    content:
      "{groom_name} and {bride_name}, the two candles you brought from your families represent your lives before today. Lighting the center candle represents the joining of your two lives to one. As you light the unity candle together, the two of you now share one light. This represents that you are joined together in love, yet remain two individuals.",
  },
  {
    id: "candle2",
    label: "Family Unity Candle",
    content:
      "The outer candles represent {groom_name} and {bride_name} as individuals and the love, wisdom, and strength they have received from their families. Together they will light the center candle, representing their commitment to one another and the new family they are creating today.",
  },
  {
    id: "candle3",
    label: "Spiritual Unity Candle",
    content:
      "From every human being there rises a light that reaches straight to heaven. And when two souls that are destined for each other find one another, their streams of light flow together and a single brighter light goes forth from their united being. {groom_name} and {bride_name}, may the light of your love burn brightly, and may it light the way for others.",
  },
  {
    id: "candle4",
    label: "Modern Unity Candle",
    content:
      "{groom_name} and {bride_name}, you have each lit a candle representing your individual lives, your individual personalities and your individual dreams. Together you will light the center unity candle. The individual candles remain lit, showing that while you are now united as one, you have not lost your individuality. Let this unity candle be a symbol of your commitment to each other and to your marriage.",
  },
];

// Handfasting Ceremony Options
export const handfastingOptions: RitualOption[] = [
  {
    id: "handfasting1",
    label: "Traditional Handfasting",
    content:
      "{groom_name} and {bride_name}, please join hands. The handfasting ceremony is an ancient tradition that symbolizes your union. As we bind your hands, we bind your lives. Let this cord represent the ties that will hold you together through all of life's joys and challenges. You are bound not to restrict each other, but to support and strengthen one another.",
  },
  {
    id: "handfasting2",
    label: "Celtic Handfasting",
    content:
      "The tradition of handfasting comes from ancient Celtic customs. {groom_name} and {bride_name}, as your hands are joined, so your lives become one. The cords we place around your hands represent the invisible bonds of love that unite you. These bonds are not made of rope or cord, but of love, trust, and mutual respect.",
  },
  {
    id: "handfasting3",
    label: "Modern Handfasting",
    content:
      "{groom_name} and {bride_name}, this cord represents the ties that bind you together. Unlike the bonds that restrict, these are bonds that liberate—freeing you to be your truest selves while joined in love. As we tie this knot, remember that your love is a choice you make each day, and these bonds grow stronger with each act of kindness and understanding.",
  },
];

// Wine/Cup Ceremony Options
export const wineCeremonyOptions: RitualOption[] = [
  {
    id: "wine1",
    label: "Traditional Wine Ceremony",
    content:
      "{groom_name} and {bride_name}, this cup of wine represents the fullness of life. As you share from this cup, you share the sweet and the bitter moments that life will offer. By drinking together, you acknowledge that from this day forward, your lives will be intimately joined, and whatever life brings, you will face together.",
  },
  {
    id: "wine2",
    label: "Unity Cup Ceremony",
    content:
      "This ceremonial cup represents life—both the bitter and the sweet. {groom_name} and {bride_name}, as you drink from this shared cup, remember that from this moment forward, you will share all that life has to offer. The joy will be doubled because you share it, and any sorrow will be halved because your partner bears it with you.",
  },
  {
    id: "wine3",
    label: "Blessing Cup Ceremony",
    content:
      "May this cup be a symbol of your new life together. {groom_name} and {bride_name}, as you drink from this cup, may your love be as rich and enduring as fine wine, growing more precious with each passing year. Let this shared cup remind you that in marriage, two lives become one, sharing in all joys and sorrows.",
  },
];

// Ring Warming Ceremony Options
export const ringWarmingOptions: RitualOption[] = [
  {
    id: "ringwarming1",
    label: "Traditional Ring Warming",
    content:
      "We invite you all to take a moment to hold {groom_name} and {bride_name}'s wedding rings. As you hold them, please offer a silent prayer, blessing, or good wish for their marriage. These rings will carry not only their promises to each other, but also the love and blessings of everyone here today.",
  },
  {
    id: "ringwarming2",
    label: "Community Ring Warming",
    content:
      "These rings represent {groom_name} and {bride_name}'s unending love for each other. By passing these rings among their family and friends, each of you adds your love, your prayers, and your blessings to these symbols. When they wear these rings, they will carry with them the support and love of this entire community.",
  },
];

// Tree Planting Ceremony Options
export const treePlantingOptions: RitualOption[] = [
  {
    id: "tree1",
    label: "Unity Tree Planting",
    content:
      "{groom_name} and {bride_name}, this tree you plant together represents your marriage. Like your love, it will grow stronger and more beautiful with each passing season. Its roots will deepen just as your love deepens, and its branches will reach skyward just as your hopes and dreams reach toward the future. May this tree flourish as your marriage flourishes.",
  },
  {
    id: "tree2",
    label: "Family Tree Planting",
    content:
      "This tree represents the new family you are creating today. {groom_name} and {bride_name}, as you plant this tree together, remember that like any growing thing, your marriage will need care, attention, and nurturing. But with love and dedication, it will grow strong and provide shelter and beauty for generations to come.",
  },
];

// Stone Ceremony Options
export const stoneCeremonyOptions: RitualOption[] = [
  {
    id: "stone1",
    label: "Unity Stone Ceremony",
    content:
      "{groom_name} and {bride_name}, these stones represent the solid foundation of your love. As you place your stones together, you create a strong foundation for your marriage. Just as these stones will endure through time and weather, may your love endure through all of life's seasons.",
  },
  {
    id: "stone2",
    label: "Wishing Stone Ceremony",
    content:
      "Friends and family, you each received a stone as you arrived today. Please take a moment to hold your stone and make a wish or say a prayer for {groom_name} and {bride_name}. These stones, blessed with your love and good wishes, will become the foundation of a garden that will remind them always of this day and your love for them.",
  },
];

// Oathing Stone Ceremony Options
export const oathingStoneOptions: RitualOption[] = [
  {
    id: "oathingstone1",
    label: "Traditional Oathing Stone",
    content:
      "{groom_name} and {bride_name}, this ancient stone has witnessed countless promises through the ages. As you place your hands upon it together, you join your promises to all those who came before you. May this stone remind you that your vows are sacred and enduring, as solid and permanent as the stone itself.",
  },
  {
    id: "oathingstone2",
    label: "Sacred Oathing Stone",
    content:
      "This oathing stone represents the permanence and strength of the commitment you make today. {groom_name} and {bride_name}, as you touch this stone together, remember that your marriage, like this stone, is meant to withstand the tests of time. Let its strength remind you of the strength you find in each other.",
  },
];

// Cord of Three Strands Options
export const cordOfThreeStrandsOptions: RitualOption[] = [
  {
    id: "cord1",
    label: "Traditional Cord of Three Strands",
    content:
      "{groom_name} and {bride_name}, this cord is made of three strands. Two strands represent each of you—your individual strengths, your unique gifts, and your separate identities. The third strand represents God (or your shared faith/values), who joins you together. A cord of three strands is not easily broken. When woven together, these three strands create something stronger than any individual strand could be alone.",
  },
  {
    id: "cord2",
    label: "Unity Cord of Three Strands",
    content:
      "As we braid these three cords together, we symbolize the joining of {groom_name}, {bride_name}, and the divine presence in your marriage. Each strand maintains its own strength and character, but together they create an unbreakable bond. May your marriage be strengthened by this three-fold cord that cannot be easily broken.",
  },
];

// Closing Statement Options
export const closingOptions: RitualOption[] = [
  {
    id: "closing1",
    label: "Traditional Closing",
    content:
      "May your marriage be filled with love, laughter, and happiness. May you always find in each other your best friend and your greatest love.",
  },
  {
    id: "closing2",
    label: "Blessing Closing",
    content:
      "May the love that has brought {groom_name} and {bride_name} together continue to grow and flourish throughout their married life. May they always support each other and find joy in their union.",
  },
  {
    id: "closing3",
    label: "Heartfelt Closing",
    content:
      "{groom_name} and {bride_name}, as you begin this wonderful journey together, remember that love is not just a feeling, but a choice you make each day. Choose love, choose kindness, and choose each other.",
  },
];

// Pronouncing Options
export const pronouncingOptions: RitualOption[] = [
  {
    id: "pronounce1",
    label: "Traditional Pronouncement",
    content:
      "By the power vested in me, I now pronounce you husband and wife. What God has joined together, let no one separate.",
  },
  {
    id: "pronounce2",
    label: "Modern Pronouncement",
    content:
      "By the authority vested in me, and in the presence of your family and friends, I now pronounce you married. You are now husband and wife.",
  },
  {
    id: "pronounce3",
    label: "Heartfelt Pronouncement",
    content:
      "{groom_name} and {bride_name}, having pledged your love and commitment to each other before these witnesses, I am delighted to pronounce you husband and wife.",
  },
];

// Kiss Options
export const kissOptions: RitualOption[] = [
  {
    id: "kiss1",
    label: "Traditional Kiss",
    content: "You may now kiss your bride!",
  },
  {
    id: "kiss2",
    label: "Modern Kiss",
    content:
      "May your first act as a married couple be one of love. You may now kiss each other for the first time as husband and wife!",
  },
  {
    id: "kiss3",
    label: "Romantic Kiss",
    content: "{groom_name}, you may now kiss {bride_name}, your wife!",
  },
];

// Introduction of Couple Options
export const introductionOptions: RitualOption[] = [
  {
    id: "intro1",
    label: "Traditional Introduction",
    content:
      "Ladies and gentlemen, it is my great pleasure to present to you for the first time as a married couple, Mr. and Mrs. {groom_name} {bride_name}!",
  },
  {
    id: "intro2",
    label: "Modern Introduction",
    content:
      "Family and friends, please join me in celebrating the newly married couple, {groom_name} and {bride_name}!",
  },
  {
    id: "intro3",
    label: "Casual Introduction",
    content:
      "Everyone, please give a warm welcome to the happy couple, {groom_name} and {bride_name}!",
  },
];

/**
 * Get the ritual options array for a given ritual type
 */
export const getRitualOptions = (ritualType: string): RitualOption[] => {
  switch (ritualType) {
    case "Sand Ceremony":
      return sandCeremonyOptions;
    case "Rose Ceremony":
      return roseCeremonyOptions;
    case "Unity Candle Ceremony":
      return unityCandleOptions;
    case "Handfasting Ceremony":
      return handfastingOptions;
    case "Wine/Cup Ceremony":
      return wineCeremonyOptions;
    case "Ring Warming Ceremony":
      return ringWarmingOptions;
    case "Tree Planting Ceremony":
      return treePlantingOptions;
    case "Stone Ceremony":
      return stoneCeremonyOptions;
    case "Oathing Stone Ceremony":
      return oathingStoneOptions;
    case "Cord of Three Strands":
      return cordOfThreeStrandsOptions;
    default:
      return [];
  }
};

/**
 * Get all ritual options combined (for modal label lookups)
 */
export const getAllOptions = (): RitualOption[] => [
  ...sandCeremonyOptions,
  ...roseCeremonyOptions,
  ...unityCandleOptions,
  ...handfastingOptions,
  ...wineCeremonyOptions,
  ...ringWarmingOptions,
  ...treePlantingOptions,
  ...stoneCeremonyOptions,
  ...oathingStoneOptions,
  ...cordOfThreeStrandsOptions,
  ...closingOptions,
  ...pronouncingOptions,
  ...kissOptions,
  ...introductionOptions,
];

/**
 * Replace name placeholders in option content
 */
export const replaceNames = (
  content: string,
  partner1Name: string,
  partner2Name: string,
): string => {
  return content
    .replace(/{bride_name}/g, partner2Name || "Partner 2's Name")
    .replace(/{groom_name}/g, partner1Name || "Partner 1's Name");
};

/**
 * Get option content with names replaced
 */
export const getOptionContent = (
  options: RitualOption[],
  optionId: string,
  partner2Name: string,
  partner1Name: string,
): string => {
  const option = options.find((opt) => opt.id === optionId);
  if (!option) return "";
  return replaceNames(option.content, partner1Name, partner2Name);
};

/**
 * Find which option array contains the given option ID and return the field name
 */
export const getFieldForOptionId = (optionId: string): string | null => {
  if (
    sandCeremonyOptions.find((opt) => opt.id === optionId) ||
    roseCeremonyOptions.find((opt) => opt.id === optionId) ||
    unityCandleOptions.find((opt) => opt.id === optionId) ||
    handfastingOptions.find((opt) => opt.id === optionId) ||
    wineCeremonyOptions.find((opt) => opt.id === optionId) ||
    ringWarmingOptions.find((opt) => opt.id === optionId) ||
    treePlantingOptions.find((opt) => opt.id === optionId) ||
    stoneCeremonyOptions.find((opt) => opt.id === optionId) ||
    oathingStoneOptions.find((opt) => opt.id === optionId) ||
    cordOfThreeStrandsOptions.find((opt) => opt.id === optionId)
  ) {
    return "ritualsOption";
  }
  if (closingOptions.find((opt) => opt.id === optionId))
    return "closingStatement";
  if (pronouncingOptions.find((opt) => opt.id === optionId))
    return "pronouncing";
  if (kissOptions.find((opt) => opt.id === optionId)) return "kiss";
  if (introductionOptions.find((opt) => opt.id === optionId))
    return "introductionOfCouple";
  return null;
};

/**
 * Find which options array contains the given option ID
 */
export const getOptionsArrayForId = (optionId: string): RitualOption[] => {
  const allArrays = [
    sandCeremonyOptions,
    roseCeremonyOptions,
    unityCandleOptions,
    handfastingOptions,
    wineCeremonyOptions,
    ringWarmingOptions,
    treePlantingOptions,
    stoneCeremonyOptions,
    oathingStoneOptions,
    cordOfThreeStrandsOptions,
    closingOptions,
    pronouncingOptions,
    kissOptions,
    introductionOptions,
  ];
  for (const arr of allArrays) {
    if (arr.find((opt) => opt.id === optionId)) return arr;
  }
  return [];
};
