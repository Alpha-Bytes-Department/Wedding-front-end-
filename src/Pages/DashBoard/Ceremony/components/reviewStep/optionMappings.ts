// Option label mappings for displaying human-readable labels
const optionLabelMappings: { [key: string]: { [key: string]: string } } = {
  language: {
    English: "English",
    Spanish: "Spanish",
    French: "French",
    German: "German",
    Italian: "Italian",
  },
  greetingSpeech: {
    greeting1: "Traditional Welcome",
    greeting2: "Modern Welcome",
    greeting3: "Heartfelt Welcome",
  },
  presentationOfBride: {
    presentation1: "Traditional Presentation",
    presentation2: "Modern Presentation",
    presentation3: "Family Presentation",
  },
  questionForPresentation: {
    question1: "Traditional Question",
    question2: "Modern Question",
    question3: "Personal Question",
  },
  responseToQuestion: {
    response1: "Traditional Response",
    response2: "Modern Response",
    response3: "Personal Response",
  },
  invocation: {
    invocation1: "Traditional Invocation",
    invocation2: "Modern Invocation",
    invocation3: "Personal Invocation",
  },
  chargeToGroomAndBride: {
    charge1: "Traditional Charge",
    charge2: "Modern Charge",
    charge3: "Personal Charge",
  },
  pledge: {
    pledge1: "Traditional Pledge",
    pledge2: "Modern Pledge",
    pledge3: "Personal Pledge",
  },
  introductionToExchangeOfVows: {
    intro_vows1: "Traditional Introduction",
    intro_vows2: "Modern Introduction",
    intro_vows3: "Personal Introduction",
  },
  vows: {
    vows1: "Traditional Vows",
    vows2: "Modern Vows",
    vows3: "Personal Vows",
  },
  readings: {
    reading1: "Traditional Reading",
    reading2: "Modern Reading",
    reading3: "Personal Reading",
  },
  introductionToExchangeOfRings: {
    intro_rings1: "Traditional Ring Introduction",
    intro_rings2: "Modern Ring Introduction",
    intro_rings3: "Personal Ring Introduction",
  },
  blessingsOfRings: {
    blessing1: "Traditional Blessing",
    blessing2: "Modern Blessing",
    blessing3: "Personal Blessing",
  },
  exchangeOfRingsGroom: {
    exchange_groom1: "Traditional Groom Exchange",
    exchange_groom2: "Modern Groom Exchange",
    exchange_groom3: "Personal Groom Exchange",
  },
  exchangeOfRingsBride: {
    exchange_bride1: "Traditional Bride Exchange",
    exchange_bride2: "Modern Bride Exchange",
    exchange_bride3: "Personal Bride Exchange",
  },
  prayerOnTheNewUnion: {
    prayer1: "Traditional Prayer",
    prayer2: "Modern Prayer",
    prayer3: "Personal Prayer",
  },
  ritualsOption: {
    sand1: "Sand Ceremony Option 1",
    sand2: "Sand Ceremony Option 2",
    sand3: "Sand Ceremony Option 3",
    rose1: "Rose Ceremony Option 1",
    rose2: "Rose Ceremony Option 2",
    rose3: "Rose Ceremony Option 3",
    candle1: "Unity Candle Option 1",
    candle2: "Unity Candle Option 2",
    candle3: "Unity Candle Option 3",
  },
  closingStatement: {
    closing1: "Traditional Closing",
    closing2: "Blessing Closing",
    closing3: "Heartfelt Closing",
  },
  pronouncing: {
    pronounce1: "Traditional Pronouncement",
    pronounce2: "Modern Pronouncement",
    pronounce3: "Heartfelt Pronouncement",
  },
  kiss: {
    kiss1: "Traditional Kiss",
    kiss2: "Modern Kiss",
    kiss3: "Romantic Kiss",
  },
  introductionOfCouple: {
    intro1: "Traditional Introduction",
    intro2: "Modern Introduction",
    intro3: "Casual Introduction",
  },
};

export const getOptionLabel = (optionId: string, category: string): string => {
  return (
    optionLabelMappings[category]?.[optionId] || optionId || "Not specified"
  );
};

// Content mappings for modal previews
export const getOptionContent = (
  optionId: string,
  category: string,
  partner1Name: string,
  partner2Name: string,
): string => {
  const p1 = partner1Name || "Partner 1's Name";
  const p2 = partner2Name || "Partner 2's Name";

  const contentMappings: { [key: string]: { [key: string]: string } } = {
    greetingSpeech: {
      greeting1: `We are gathered here today to witness and celebrate the union of ${p1} and ${p2}. Today, they will make a commitment to each other that will last a lifetime.`,
      greeting2: `Welcome everyone! We're here to celebrate the love between ${p1} and ${p2} as they begin their journey together as husband and wife.`,
      greeting3: `Dear family and friends, thank you for gathering here today to witness ${p1} and ${p2} as they exchange vows and begin their new life together.`,
    },
    presentationOfBride: {
      presentation1: `Who gives this woman to be married to this man?`,
      presentation2: `Who supports ${p2} in her marriage to ${p1}?`,
      presentation3: `${p2}, who walks with you today and gives you their blessing?`,
    },
    questionForPresentation: {
      question1: `Do you give your blessing to this union?`,
      question2: `Do you support ${p1} and ${p2} in their marriage?`,
      question3: `Will you continue to love and support this couple?`,
    },
    responseToQuestion: {
      response1: `I do.`,
      response2: `We do, with love and pride.`,
      response3: `Yes, we will always support them.`,
    },
    invocation: {
      invocation1: `Let us pray. Heavenly Father, we ask for your blessing on ${p1} and ${p2} as they unite in marriage. Guide them in love and happiness. Amen.`,
      invocation2: `We invoke the presence of love and commitment as ${p1} and ${p2} join their lives together.`,
      invocation3: `May the love that has brought ${p1} and ${p2} together continue to grow and flourish throughout their married life.`,
    },
    chargeToGroomAndBride: {
      charge1: `${p1} and ${p2}, you have come here today to be united in marriage. This is a sacred commitment that should not be entered into lightly.`,
      charge2: `Today, ${p1} and ${p2}, you are choosing to bind your lives together in marriage. This is a beautiful commitment built on love, trust, and mutual respect.`,
      charge3: `${p1} and ${p2}, marriage is a partnership of two people who love each other and choose to walk through life together.`,
    },
    pledge: {
      pledge1: `Do you, ${p1}, take ${p2} to be your wife, to love and to cherish, in sickness and in health, for richer or poorer, for better or worse, for as long as you both shall live?`,
      pledge2: `${p1}, do you promise to love, honor, and respect ${p2} as your partner in marriage?`,
      pledge3: `${p1}, will you take ${p2} as your wife and promise to stand by her through all of life's joys and challenges?`,
    },
    introductionToExchangeOfVows: {
      intro_vows1: `${p1} and ${p2} will now exchange the vows they have written for each other.`,
      intro_vows2: `Now, ${p1} and ${p2} would like to share their personal promises to each other.`,
      intro_vows3: `At this time, ${p1} and ${p2} will speak the words that come from their hearts.`,
    },
    vows: {
      vows1: `I, ${p1}, take you, ${p2}, to be my wife. I promise to love you, honor you, and cherish you for all the days of my life.`,
      vows2: `${p2}, I choose you to be my partner in life. I promise to support you, encourage you, and love you unconditionally.`,
      vows3: `Today I give myself to you, ${p2}. I promise to be your faithful companion and to build our dreams together.`,
    },
    readings: {
      reading1: `Love is patient, love is kind. It does not envy, it does not boast, it is not proud. Love never fails.`,
      reading2: `Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up.`,
      reading3: `Set me as a seal upon your heart, as a seal upon your arm; for love is as strong as death.`,
    },
    introductionToExchangeOfRings: {
      intro_rings1: `The wedding rings are an outward and visible sign of an inward and spiritual bond which unites two hearts in endless love.`,
      intro_rings2: `${p1} and ${p2} will now exchange rings as a symbol of their eternal commitment.`,
      intro_rings3: `These rings represent the unbroken circle of love. ${p1} and ${p2}, please exchange your rings.`,
    },
    blessingsOfRings: {
      blessing1: `May these rings be blessed as the symbol of this affectionate unity. Let them remind you always of the vows you have taken here today.`,
      blessing2: `Bless these rings, O Lord, that they who wear them may live in your peace and continue in your favor all the days of their lives.`,
      blessing3: `These rings are symbols of the wholeness and endless love you share. May they remind you of the promises you make today.`,
    },
    exchangeOfRingsGroom: {
      exchange_groom1: `${p2}, I give you this ring as a symbol of my love and commitment to you. Wear it as a reminder of the vows we have spoken today.`,
      exchange_groom2: `With this ring, I thee wed. ${p2}, this ring represents my promise to love and honor you always.`,
      exchange_groom3: `${p2}, this ring is a circle, representing our eternal love. I place it on your finger as a symbol of my devotion to you.`,
    },
    exchangeOfRingsBride: {
      exchange_bride1: `${p1}, I give you this ring as a symbol of my love and commitment to you. Wear it as a reminder of the vows we have spoken today.`,
      exchange_bride2: `With this ring, I thee wed. ${p1}, this ring represents my promise to love and honor you always.`,
      exchange_bride3: `${p1}, this ring is a circle, representing our eternal love. I place it on your finger as a symbol of my devotion to you.`,
    },
    prayerOnTheNewUnion: {
      prayer1: `Lord, we ask your blessing upon ${p1} and ${p2} as they begin their married life together. Guide them in love and grant them happiness all their days.`,
      prayer2: `May ${p1} and ${p2} be blessed with love, joy, and peace in their marriage. May they always find strength in each other.`,
      prayer3: `We pray for ${p1} and ${p2}, that their love may continue to grow stronger each day and that they may find joy in their journey together.`,
    },
    ritualsOption: {
      sand1: `${p1} and ${p2}, today you are making a life-long commitment to share the rest of your lives with each other. Your relationship is symbolized through the pouring of these two individual containers of sand.`,
      sand2: `${p1} and ${p2}, the two separate bottles of sand represent your lives until this moment; individual and unique. As you now combine your sand together, your lives also join together as one.`,
      sand3: `${p1} and ${p2}, today you are making a life-long commitment to share the rest of your lives with each other. Your relationship is symbolized through the pouring of these two individual containers of sand.`,
    },
    closingStatement: {
      closing1:
        "May your marriage be filled with love, laughter, and happiness. May you always find in each other your best friend and your greatest love.",
      closing2: `May the love that has brought ${p1} and ${p2} together continue to grow and flourish throughout their married life.`,
      closing3: `${p1} and ${p2}, as you begin this wonderful journey together, remember that love is not just a feeling, but a choice you make each day.`,
    },
    pronouncing: {
      pronounce1:
        "By the power vested in me, I now pronounce you husband and wife. What God has joined together, let no one separate.",
      pronounce2:
        "By the authority vested in me, and in the presence of your family and friends, I now pronounce you married. You are now husband and wife.",
      pronounce3: `${p1} and ${p2}, having pledged your love and commitment to each other before these witnesses, I am delighted to pronounce you husband and wife.`,
    },
    kiss: {
      kiss1: "You may now kiss your bride!",
      kiss2: "You may now kiss each other as married partners!",
      kiss3: `${p1}, you may now kiss ${p2}, your wife!`,
    },
    introductionOfCouple: {
      intro1: `Ladies and gentlemen, it is my great pleasure to present to you for the first time as a married couple, Mr. and Mrs. ${p1} ${p2}!`,
      intro2: `Family and friends, please join me in celebrating the newly married couple, ${p1} and ${p2}!`,
      intro3: `Everyone, please give a warm welcome to the happy couple, ${p1} and ${p2}!`,
    },
  };

  return contentMappings[category]?.[optionId] || "Content not available";
};
