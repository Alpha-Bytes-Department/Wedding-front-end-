import { useState } from "react";
import type { CeremonyFormData } from "../types";
import type { UseFormRegister } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";

interface VowsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

interface VowOption {
  id: string;
  label: string;
  content: string;
}

// Option definitions
const chargeOptions: VowOption[] = [
  {
    id: "charge1",
    label: "Sacred Expression",
    content:
      "{groom_name} and {bride_name}, the covenant which you are about to make with each other is meant to be a beautiful and sacred expression of your love for each other. As you pledge your vows to each other, and as you commit your lives to each other, we ask that you do so in all seriousness, and yet with a deep sense of joy, with deep conviction that you are committing yourselves to a dynamic growing relationship of trust, mutual support and caring love.",
  },
  {
    id: "charge2",
    label: "Divine Foundation",
    content:
      "I charge you both, as you stand in the presence of God, to remember that love and loyalty alone will avail as the foundations of a happy and enduring home. If the solemn vows which you are about to make be kept permanently, and if steadfastly you seek to do the will of your Heavenly Father, your life will be full of peace and joy, and the home which you are establishing will abide through every change.",
  },
  {
    id: "charge3",
    label: "Hand in Hand",
    content:
      "Hand in hand, you enter marriage; hand in hand you step out in faith. The hand you freely give to each other, is both the strongest and the most tender part of the body. In the years ahead you will need both strength and tenderness. Be firm in your commitment. Don't let your grip become weak. And yet, be flexible as you go through change. Don't let your hold become intolerable. Strength and tenderness; firm commitment and flexibility - of such is a marriage made, hand in hand: remember this well!",
  },
  {
    id: "charge4",
    label: "Respect and Tenderness",
    content:
      "{groom_name} and {bride_name}, I would ask that you both remember to treat yourself and each other with respect, and remind yourself often of what brought you together today. Give the highest priority to the tenderness, gentleness and kindness that your partnership deserves. When frustration and difficulty assail your marriage – as they do to every relationship at one time or another – focus on what still seems right between you, not only the part that seems wrong. This way, when clouds of trouble hide the sun in your lives and you lose sight of it for a moment, you can remember that the sun is still there. And if each of you will take responsibility for the quality of your life together, it will be marked by abundance and delight.",
  },
  {
    id: "charge5",
    label: "Solemn Contract",
    content:
      "{groom_name} and {bride_name}, the contract of marriage is most solemn and is not to be entered into lightly, but thoughtfully and seriously with a deep realization of its obligations and responsibilities. No other human ties are more tender and no other vows more important than those you are about to pledge.",
  },
];

const pledgeOptions: VowOption[] = [
  {
    id: "pledge1",
    label: "Traditional Faithfulness",
    content:
      "{groom_name}, will you have {bride_name} to be your wife, to live with her, respect her, and love her as God intends with the promise of faithfulness, tenderness, and helpfulness, as long as you both shall live?\n\n{bride_name}, will you have {groom_name} to be your husband, to live with him, respect him, and love him as God intends with the promise of faithfulness, tenderness, and helpfulness, as long as you both shall live?",
  },
  {
    id: "pledge2",
    label: "Lawfully Wedded",
    content:
      "Do you take this woman, {bride_name}, to be your lawfully wedded wife, to have and to hold, in sickness and in health, in good times and bad, for richer or poorer, keeping yourself solely unto her for as long as you both shall live?\n\nDo you take this man, {groom_name}, to be your lawfully wedded husband, to have and to hold, in sickness and in health, in good times and bad, for richer or poorer, keeping yourself solely unto him for as long as you both shall live?",
  },
  {
    id: "pledge3",
    label: "Love and Comfort",
    content:
      "Will you, {groom_name}, have {bride_name} to be your wife? Will you love her, comfort and keep her, and forsaking all others remain true to her as long as you both shall live?\n\nWill you, {bride_name}, have {groom_name} to be your husband? Will you love him, comfort and keep him, and forsaking all others remain true to him as long as you both shall live?",
  },
  {
    id: "pledge4",
    label: "Devotion Declaration",
    content:
      "{groom_name}, do you come before this gathering of friends and family to proclaim your love and devotion for {bride_name}? Do you promise to respect her, and care for her during times of joy and hardship? Do you commit yourself to share your feelings of happiness and sadness? Do you pledge to remain faithful to her?\n\n{bride_name}, do you come before this gathering of friends and family to proclaim your love and devotion for {groom_name}? Do you promise to respect him, and care for him during times of joy and hardship? Do you commit yourself to share your feelings of happiness and sadness? Do you pledge to remain faithful to him?",
  },
  {
    id: "pledge5",
    label: "Friend and Partner",
    content:
      "{groom_name}, will you have {bride_name} to be your wife, to live together as friend and partner? Will you love her as a person, respect her as an equal, sharing joy as well as sorrow, triumph, as well as defeat, and keep her beside you as long as you both shall live?\n\n{bride_name}, will you have {groom_name} to be your husband, to live together as friend and partner? Will you love him as a person, respect him as an equal, sharing joy as well as sorrow, triumph, as well as defeat, and keep him beside you as long as you both shall live?",
  },
  {
    id: "pledge6",
    label: "Simple Pledge",
    content:
      "{groom_name}, will you have {bride_name} to be your wife?\n\n{bride_name}, will you have {groom_name} to be your husband?",
  },
  {
    id: "pledge7",
    label: "Complete Commitment",
    content:
      "{groom_name}, do you take this woman {bride_name}, to be your lawfully wedded wife, to have and to hold, in sickness and in health, in good times and bad, for richer or poorer, keeping yourself solely unto her for as long as you both shall live?\n\n{bride_name}, do you take this man, {groom_name}, to be your lawfully wedded husband, to have and to hold, in sickness and in health, in good times and bad, for richer or poorer, keeping yourself solely unto him for as long as you both shall live?",
  },
];

const vowIntroOptions: VowOption[] = [
  {
    id: "vowIntro1",
    label: "Classic Introduction",
    content:
      "Please join hands and speak your vows to one another. {groom_name}, you may begin.",
  },
  {
    id: "vowIntro2",
    label: "Heartfelt Introduction",
    content:
      "{groom_name} and {bride_name}, please look into each other's eyes and share the promises that come from your hearts.",
  },
  {
    id: "vowIntro3",
    label: "Simple Introduction",
    content:
      "Now {groom_name} and {bride_name} will exchange the vows they have written for each other.",
  },
  {
    id: "vowIntro4",
    label: "Personal Commitment",
    content:
      "{groom_name} and {bride_name} are here to marry each other. No one else's will can create such a union. It is their words, their intentions, their vision, that must define and shape this marriage. So, I call upon them now to state their promises before this group: the pledges that will bind them together.",
  },
  {
    id: "vowIntro5",
    label: "Journey of Love",
    content:
      "You have known each other for years, through the first glance of acquaintance to this moment of commitment. At some moment, you decided to marry. From that moment of yes to this moment of yes, indeed, you have been making promises and agreements in an informal way. All those conversations that were held riding in a car or over a meal or during long walks – all those sentences that began with \"When we're married\" and continued with \"I will\" and \"you will\" and \"we will\" – those late-night talks that included \"someday\" and \"somehow\" and \"maybe\" – and all those promises that are unspoken matters of the heart. Just two people working out what they want, what they believe, what they hope for each other. All these common things, and more, are the real process of a wedding. The symbolic vows that you are about to make are a way of saying to one another, \"You know all those things we've promised and hoped and dreamed – well, I meant it all, every word.\" Look at one another and remember this moment in time. Before this moment you have been many things to one another – acquaintance, friend, companion, lover, dancing partner, and even teacher, for you have learned much from one another in these last few years. You have learned that good company and friendship count for more than wealth, good looks or position. And you've learned that marriage is a maze into which we wander – a maze that is best traveled through with a great companion. Now you shall say a few words that take you across a threshold of life, and things will never quite be the same between you. For after these vows, you shall say to the world, {groom_name} is my husband, {bride_name} is my wife.",
  },
  {
    id: "vowIntro6",
    label: "Serious Commitment",
    content:
      "{groom_name} and {bride_name}, as you stand here today, I remind you of the serious nature of the relationship you are about to enter. Marriage is the voluntary and full commitment of two consenting adults to love each other for a lifetime. For a marriage to be successful, you must each be loyal to the other, stand firm in your defense of each other and be supportive of one another's life goals and dreams. It is a solemn, binding, yet challenging relationship.",
  },
  {
    id: "vowIntro7",
    label: "Celebrating Differences",
    content:
      "Often people feel that religious differences, between two people who are about to marry, may be an obstacle to their happiness. {groom_name} and {bride_name} disagree. They believe that all marriages are mixed marriages. They may differ in the way they spend money or the way they resolve conflicts or in their sleeping patterns. There is not one couple on this earth that would say that they agree on everything. Couples, who come together from different religious, cultural, or ethnic backgrounds acknowledge their differences immediately. They learn skills of negotiation to cope with their differences. And these are the exact skills that are needed in all marriages. Intercultural couples can be stronger than other couples who share similar backgrounds.",
  },
  {
    id: "vowIntro8",
    label: "Enriched Diversity",
    content:
      "Often couples who share their ethnic, religious, and cultural backgrounds can be lulled into a kind of complacency because their differences may not be so obvious. The cultural life of an inter-faith married couple can also be more enriched than those who share the same backgrounds. Diversity keeps life interesting. The differences shared can be enjoyed. It takes special people who can learn to celebrate their differences — special people like the two of you.",
  },
  {
    id: "vowIntro9",
    label: "Foundation Building",
    content:
      "{groom_name} and {bride_name} by coming here today, you have now taken the initial step in what hopefully will be a wonderful and lasting life together. Understand that a union between two people takes work. Just as Rome wasn't built in a day, neither is a relationship ever complete. It needs constant nurturing. A good marriage is one that fosters respect, a devoted love, and a willingness to make sacrifices for each other. These are the foundation blocks of a newly formed union. Symbolically you have been brought together as one, yet are still two separate entities with unique ideas, talents and ways of being. Respect and value those differences, and your relationship will flourish.",
  },
  {
    id: "vowIntro10",
    label: "Sacred Trust",
    content:
      "{groom_name} and {bride_name}, as you stand here in the presence of God and these witnesses, I remind you, that love, loyalty and trust are the basis of a mature and fulfilling relationship. Marriage is a serious undertaking; it is intended to bind your lives together forever and is not to be taken lightly. Your engagement set into motion the interweaving of your lives – and we hope that you will continue to grow closer throughout your years together. None of us knows what the future will bring. Yet your love for one another, and trust in the strength of your union makes possible the act of faith you are making today. As you exchange the vows, which will start you on your journey together, know that our love and support go with you. As you make your promises to each other, we will remember promises we, too, have made and take this opportunity to make new, our own.",
  },
  {
    id: "vowIntro11",
    label: "Gentle Reminders",
    content:
      "This is a new beginning for both of you and I'd like to offer some gentle reminders to ease your life-long task of living and growing together. Be kind to each other. And, when you disagree, do it respectfully. Be gentle and forgiving with each other. When you forgive, your hearts make room for a little more love, a little more understanding and a little more compassion. Communicate with each other. Share the joy that's in your heart and the sorrow that burdens your soul. Open your hearts to each other and find the love.",
  },
  {
    id: "vowIntro12",
    label: "Holy Union",
    content:
      "A Holy Union between two people is a beautiful thing indeed. Something to be thankful for and something to never take for granted. Each morning when you awaken, give thanks for the gift that you have been given in each other and for your willingness to receive it. A Holy Union is a sacred trust given to you by God. God says, \"Here. Here is my beloved child, and I am entrusting YOU with their care. I am entrusting you to love them, honor them, support them, cherish them, and hold their hand through thick and thin as I cannot do in human form except through you. You are being asked to serve in this capacity because you are willing, and able, and desiring of it.\" Let it always remind you that God answers all prayers eventually.",
  },
  {
    id: "vowIntro13",
    label: "Sacred Promises",
    content:
      "Marriage is not a legal document. No pastor or priest or judge can create a marriage because a marriage, truly, is nothing except the promises made and kept by two individuals. Today {groom_name} and {bride_name}, your wedding day, is one brief day in time, and although your vows are spoken in a matter of minutes, they are promises that will last a lifetime.",
  },
  {
    id: "vowIntro14",
    label: "Life's Journey",
    content:
      "This moment is the anchor that holds your past and your future together. Tonight you are beginning a journey together that will last the rest of your lives. And like any journey, there will be highs and lows. An amazing journey can lead you to a mountaintop where you see all that is before you. Today hopefully being one such experience. Sometimes you will walk through valleys and have trouble finding your way. But no matter where you go, and no matter how long the journey is or how difficult, the person beside you will make your journey worthwhile. And let me just remind you that love and loyalty are the essence of a happy and enduring marriage. No other human ties are more tender, and certainly none are more sacred than those that you share with each other now.",
  },
  {
    id: "vowIntro15",
    label: "Ancient Tradition",
    content:
      "The formal exchange of your wedding vows is the most ancient part of a wedding ceremony. These are the words that couples for centuries have spoken to one another and, while they are very simple words, they have extraordinary meaning and importance. As you speak them to one another, you will discover that these are truly sacred promises, and sacred promises must be kept forever. I am going to speak these words to you now, and ask that you speak them to each other.",
  },
  {
    id: "vowIntro16",
    label: "Learning to Love",
    content:
      "{groom_name} and {bride_name}, life is given to each of us as individuals, and yet we must learn to live together. Love is given to us by our family or by our friends. We learn to love by being loved. Learning to love and living together is one of the greatest challenges of life – and is the shared goal of a married life. You are now taking into your care and keeping the happiness of the one person in all the world whom you love best. You are adding to your life not only the affection of each other, but also the companionship and blessing of a deep trust as well. You are agreeing to share strength, responsibilities and to share love.",
  },
  {
    id: "vowIntro17",
    label: "Inner Love",
    content:
      "{groom_name} and {bride_name}, the vows that you are about to exchange serve as a verbal representation of the love you have promised to each other. For it is not the words that you speak today which will unite you together as one, but the inner sense of love and commitment that each of you feels within your soul.",
  },
  {
    id: "vowIntro18",
    label: "Public Recognition",
    content:
      "This wedding ceremony is the public recognition of a commitment that {groom_name} and {bride_name} have already made privately in their hearts. But it's also their commitment to all of you who know and love them.",
  },
  {
    id: "vowIntro19",
    label: "Witness Journey",
    content:
      "By inviting you to bear witness to their vows this day, {groom_name} and {bride_name} have chosen to take you with them on the first step of their journey into marriage.",
  },
  {
    id: "vowIntro20",
    label: "Heart Marriage",
    content:
      "{groom_name} and {bride_name} know that this wedding is a celebration of the marriage that has already occurred in their hearts, a marriage that will grow, not without challenge and adversity, but with patience, love, and the belief that they have chosen wisely in choosing one another.",
  },
  {
    id: "vowIntro21",
    label: "Sacred Foundation",
    content:
      "We've come to the point of your ceremony where you're going to say your vows to one another. But before you do that, I ask you to remember that love – which is rooted in faith, trust, and acceptance – will be the foundation of an abiding and deepening relationship. No other ties are more tender, no other vows more sacred than those you now assume.",
  },
  {
    id: "vowIntro22",
    label: "Joy and Freedom",
    content:
      "If you are able to keep the vows you take here today, not because of any religious or civic law, but out of a desire to love and be loved by another person fully, without limitation, then your life will have joy and the home you establish will be a place in which you both will find the direction of your growth, your freedom, and your responsibility.",
  },
  {
    id: "vowIntro23",
    label: "Guest Participation",
    content:
      "{groom_name} and {bride_name} want this day to mean something special to you as guests. Those who are married may want to silently renew and reaffirm your vows today by gently taking the hand of your partner during this ceremony. Others may want to also join hands and think about what it means to be a friend, for marriage is built first on friendship.",
  },
  {
    id: "vowIntro24",
    label: "Sacred Institution",
    content:
      "There are no ties on earth so sweet, none so tender as those you are about to assume. There are no vows so solemn as those you are about to make. There is no institution of earth so sacred as that of the union you will form, for the true home is not only the place in which you will live, but is also the dwelling place where each lives in the heart and mind of the other.",
  },
  {
    id: "vowIntro25",
    label: "Beautiful Unknown",
    content:
      "{groom_name} and {bride_name}, in a moment you will exchange your vows with each other. These promises are meant to be a beautiful and sacred expression of your love for each other. The beauty of these vows lie in the unknown. For you will be making promises about a future that you can't be sure of, a life that you don't know how it will turn out, and a marriage that you don't know what it will face.",
  },
];

const vowOptions: VowOption[] = [
  {
    id: "vow1",
    label: "Complete Devotion",
    content:
      "I, {groom_name}, give myself to you {bride_name} completely as your husband. I accept you, as my wife, to live and to understand, to stay by your side in sickness and in health, at all times, for all the days of my life.\n\nI, {bride_name}, give myself to you {groom_name} completely as your wife. I accept you, as my husband, to live and to understand, to stay by your side in sickness and in health, at all times, for all the days of my life.",
  },
  {
    id: "vow2",
    label: "Chosen Love",
    content:
      "{bride_name}, I have chosen you alone from all the world to be my wedded wife, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish 'til death do us part.\n\n{groom_name}, I have chosen you alone from all the world to be my wedded husband, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish 'til death do us part.",
  },
  {
    id: "vow3",
    label: "Sacred Promises",
    content:
      "I, {groom_name}, take you {bride_name} to be my wife, and these things I promise you: I will be faithful to you and honest with you. I will respect, trust, and help and care for you. I will share my life with you. I will forgive you as we have been forgiven; and I will try with you better to understand ourselves, the world, and God; through the best and the worst of what is to come as long as we live.\n\nI, {bride_name}, take you {groom_name} to be my husband, and these things I promise you: I will be faithful to you and honest with you. I will respect, trust, and help and care for you. I will share my life with you. I will forgive you as we have been forgiven; and I will try with you better to understand ourselves, the world, and God; through the best and the worst of what is to come as long as we live.",
  },
  {
    id: "vow4",
    label: "Unreserved Love",
    content:
      "I will be your husband. I give you all my love without reservation. We have so many joyful times ahead of us—many decisions and many possibilities. I promise to place our personal growth and the continuous growth of our love above all other considerations. I will be honest with you. I will accept you as an equal and as a unique individual. I will be open with my affection and support. Together I know that we can build a life filled with satisfaction. I'm happy we found each other. I love you.\n\nI will be your wife. I give you all my love without reservation. We have so many joyful times ahead of us—many decisions and many possibilities. I promise to place your personal growth and the continuous growth of our love above all other considerations. I will be honest with you. I will accept you as an equal and as a unique individual. I will be open with my affection and support. Together I know that we can build a life filled with satisfaction. I'm happy we found each other. I love you.",
  },
  {
    id: "vow5",
    label: "Standing Together",
    content:
      "I, {groom_name}, take you {bride_name}, to be my wife; and I promise in the midst of our families and friends and God, to stand beside you and with you always; in times of celebration and times of sadness; in times of pleasure and times of anger; in times of pain and times of health; I will live with you and love you as long as we live.\n\nI, {bride_name}, take you {groom_name}, to be my husband; and I promise in the midst of our families and friends and God, to stand beside you and with you always; in times of celebration and times of sadness; in times of pleasure and times of anger; in times of pain and times of health; I will live with you and love you as long as we live.",
  },
  {
    id: "vow6",
    label: "Joy and Sorrow",
    content:
      "{bride_name}, I take you to be my wife. To laugh with you in joy, to grieve with you in sorrow, to grow with you in love, to be faithful to you alone, as long as we both shall live.\n\n{groom_name}, I take you to be my husband. To laugh with you in joy, to grieve with you in sorrow, to grow with you in love, to be faithful to you alone, as long as we both shall live.",
  },
  {
    id: "vow7",
    label: "Best Friend",
    content:
      "I love you {bride_name}, you are my best friend. Today, I give myself to you in marriage. I promise to encourage and inspire you, to laugh with you, and to comfort you in times of sorrow and struggle. I promise to love you in good times and in bad, when life seems easy and when it seems hard, when our love is simple, and when it is an effort. I promise to cherish you, and to always hold you in highest regard. These things I give to you today, and all the days of our life.\n\nI love you {groom_name}, you are my best friend. Today, I give myself to you in marriage. I promise to encourage and inspire you, to laugh with you, and to comfort you in times of sorrow and struggle. I promise to love you in good times and in bad, when life seems easy and when it seems hard, when our love is simple, and when it is an effort. I promise to cherish you, and to always hold you in highest regard. These things I give to you today, and all the days of our life.",
  },
  {
    id: "vow8",
    label: "Simple Promise",
    content:
      "I, {groom_name}, take thee to be my wife {bride_name}. To have and to hold, in sickness and in health, for richer or poorer, in joy and sorrow, and I promise my love to you.\n\nI, {bride_name}, take thee to be my husband {groom_name}. To have and to hold, in sickness and in health, for richer or poorer, in joy and sorrow, and I promise my love to you.",
  },
  {
    id: "vow9",
    label: "Eternal Bond",
    content:
      "{bride_name}, I take you to be my wife, to be faithful to you alone, to share all that is to come, encompassing all sorrows and joys, all hardships and triumphs, all the experiences of life, a permanent commitment made in love, kept in faith, alive in hope, and eternally made new.\n\n{groom_name}, I take you to be my husband, to be faithful to you alone, to share all that is to come, encompassing all sorrows and joys, all hardships and triumphs, all the experiences of life, a permanent commitment made in love, kept in faith, alive in hope, and eternally made new.",
  },
  {
    id: "vow10",
    label: "Life Companion",
    content:
      "Today, {bride_name}, I join my life to yours—not merely as your husband, but as your friend, your lover, and your confidant. Let me be the shoulder you lean on, the rock on which you rest, the companion of your life. With you, I will walk my path from this day forward.\n\nToday, {groom_name}, I join my life to yours—not merely as your wife, but as your friend, your lover, and your confidant. Let me be the shoulder you lean on, the rock on which you rest, the companion of your life. With you, I will walk my path from this day forward.",
  },
  {
    id: "vow11",
    label: "Complete Offering",
    content:
      "All that I am and all that I have, I offer to you in love and in joy. From this day forward, I will love you and comfort you, hold you close, prize you above all others, and remain faithful to you all the days of our lives.\n\nAll that I am and all that I have, I offer to you in love and in joy. From this day forward, I will love you and comfort you, hold you close, prize you above all others, and remain faithful to you all the days of our lives.",
  },
  {
    id: "vow12",
    label: "Trust and Love",
    content:
      "I, {groom_name}, take you, {bride_name}, as my friend and love, beside me and apart from me, in laughter and in tears, in conflict and tranquility, asking that you be no other than yourself, loving what I know of you, trusting what I do not yet know, in all the ways that life may find us.\n\nI, {bride_name}, take you, {groom_name}, as my friend and love, beside me and apart from me, in laughter and in tears, in conflict and tranquility, asking that you be no other than yourself, loving what I know of you, trusting what I do not yet know, in all the ways that life may find us.",
  },
  {
    id: "vow13",
    label: "Poetic Love",
    content:
      "I will take joy in you and in our life together. You are to me the whispering of the tides, the seduction of summer's heat. You are my friend, my lover. Grow old and wise with me. I look forward to the life before us, of rainbows and sunsets and a willingness to share all things. I love you. I adore you.\n\nI will take joy in you and in our life together. You are to me the whispering of the tides, the seduction of summer's heat. You are my friend, my lover. Grow old and wise with me. I look forward to the life before us, of rainbows and sunsets and a willingness to share all things. I love you. I adore you.",
  },
  {
    id: "vow14",
    label: "Solemn Vow",
    content:
      "I, {groom_name}, take you, {bride_name}, to be my lawfully wedded wife, my constant friend, my faithful partner and my love from this day forward. In the presence of God, our family and friends, I offer you my solemn vow to be your faithful partner in sickness and in health, in good times and in bad, and in joy as well as in sorrow. I promise to love you unconditionally, to support you in your goals, to honor and respect you, to laugh with you and cry with you, and to cherish you for as long as we both shall live.\n\nI, {bride_name}, take you, {groom_name}, to be my lawfully wedded husband, my constant friend, my faithful partner and my love from this day forward. In the presence of God, our family and friends, I offer you my solemn vow to be your faithful partner in sickness and in health, in good times and in bad, and in joy as well as in sorrow. I promise to love you unconditionally, to support you in your goals, to honor and respect you, to laugh with you and cry with you, and to cherish you for as long as we both shall live.",
  },
  {
    id: "vow15",
    label: "Beloved Promise",
    content:
      "I, {groom_name}, take you, {bride_name}, to be my beloved wife, to have and to hold you, to honor you, to treasure you, to be at my side in sorrow and in joy, in the good times, and in the bad, and to love and cherish you always. I promise you this from my heart, for all the days of my life.\n\nI, {bride_name}, take you, {groom_name}, to be my beloved husband, to have and to hold you, to honor you, to treasure you, to be at my side in sorrow and in joy, in the good times, and in the bad, and to love and cherish you always. I promise you this from my heart, for all the days of my life.",
  },
];

const readingOptions: VowOption[] = [
  {
    id: "reading1",
    label: "Love is Patient",
    content:
      "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
  },
  {
    id: "reading2",
    label: "Apache Blessing",
    content:
      "Now you will feel no rain, for each of you will be shelter to the other. Now you will feel no cold, for each of you will be warmth to the other. Now there is no more loneliness, for each of you will be companion to the other.",
  },
  {
    id: "reading3",
    label: "Rumi on Love",
    content:
      "Love is the bridge between two hearts. In your light I learn how to love. In your beauty, how to make poems. You dance inside my chest where no one sees you, but sometimes I do, and that sight becomes this art, this music, this form.",
  },
  {
    id: "reading4",
    label: "Union by Fulghum",
    content:
      "You have known each other from the first glance of acquaintance to this point of commitment. At some point, you decided to marry. From that moment of yes, to this moment of yes, indeed, you have been making commitments in an informal way. All of those conversations that were held in a car, or over a meal, or during long walks – all those conversations that began with, \"When we're married\", and continued with \"I will\" and \"you will\" and \"we will\" – all those late night talks that included \"someday\" and \"somehow\" and \"maybe\" – and all those promises that are unspoken matters of the heart. All these common things, and more, are the real process of a wedding. The symbolic vows that you are about to make are a way of saying to one another, \"You know all those things that we've promised, and hoped, and dreamed – well, I meant it all, every word.\"",
  },
  {
    id: "reading5",
    label: "The Prophet",
    content:
      "Love one another but make not a bond of love. Let it rather be a moving sea between the shores of your souls. Fill each other's cup but drink not from the same cup. Sing and dance together and be joyous, but let each one of you be alone even as the strings of the lute are alone though they quiver with the same music. Give your hearts but not into each other's keeping for only the hand of life can contain your hearts. And stand together yet not too near together for the pillars of the temple stand apart and the oak tree and the cypress grow not in each other's shadow.",
  },
  {
    id: "reading6",
    label: "Temporary Madness",
    content:
      "Love is a temporary madness. It erupts like an earthquake and then subsides. And when it subsides you have to make a decision. You have to work out whether your roots have become so entwined together that it is inconceivable that you should ever part. Because this is what love is. Love is not breathlessness, it is not excitement, and it is not the promulgation of promises of eternal passion. That is just being in love which any of us can convince ourselves we are. Love itself is what is left over when being in love has burned away, and this is both an art and a fortunate accident.",
  },
  {
    id: "reading7",
    label: "Good Marriage",
    content:
      "A good marriage must be created. In marriage the \"little\" things are the big things. It is never being too old to hold hands. It is remembering to say, \"I love you\" at least once a day. It is never going to sleep angry. It is having a mutual sense of values, and common objectives. It is standing together and facing the world. It is forming a circle that gathers in the whole family. It is speaking words of appreciation, and demonstrating gratitude in thoughtful ways. It is having the capacity to forgive and forget. It is giving each other an atmosphere in which each can grow.",
  },
  {
    id: "reading8",
    label: "Love Without Giving",
    content:
      "You can give without loving, but you can never love without giving. The great acts of love are done by those who are habitually performing small acts of kindness. We pardon to the extent that we love. Love is knowing that even when you are alone, you will never be lonely again. And the great happiness of life is the conviction that we are loved. Loved for ourselves. And even loved in spite of ourselves.",
  },
  {
    id: "reading9",
    label: "Sonnet 116",
    content:
      "Let me not to the marriage of true minds admit impediments. Love is not love which alters when it alteration finds, or bends with the remover to remove: O no! It is an ever-fixed mark that looks on tempests and is never shaken; it is the star to every wandering bark, whose worth's unknown, although his height be taken. Love's not Time's fool, though rosy lips and cheeks within his bending sickle's compass come: Love alters not with his brief hours and weeks, but bears it out even to the edge of doom.",
  },
  {
    id: "reading10",
    label: "Love by Croft",
    content:
      "I love you not only for what you are, but for what I am when I am with you. I love you, not only for what you have made of yourself, but for what you are making of me. I love you for the part of me that you bring out. I love you for putting your hand into my heaped-up heart and passing over all the foolish, weak things that you can't help dimly seeing there, and for drawing out into the light all the beautiful belongings that no one else had looked quite far enough to find.",
  },
  {
    id: "reading11",
    label: "Gift from Sea",
    content:
      "When you love someone, you do not love them all the time, in exactly the same way, from moment to moment. It is impossible. It is even a lie to pretend to. And yet this is exactly what most of us demand. We have so little faith in the ebb and flow of life, of love, of relationships. We leap at the flow of the tide and resist in terror its ebb. We are afraid it will never return. We insist on permanency, on duration, on continuity; when the only continuity possible, in life as in love, is in growth, in fluidity - in freedom.",
  },
  {
    id: "reading12",
    label: "Fearful Gamble",
    content:
      "But ultimately there comes a moment when a decision must be made. Ultimately two people who love each other must ask themselves how much they hope for as their love grows and deepens, and how much risk they are willing to take…It is indeed a fearful gamble…Because it is the nature of love to create, a marriage itself is something which has to be created, so that, together we become a new creature. To marry is the biggest risk in human relations that a person can take.",
  },
  {
    id: "reading13",
    label: "Apache Blessing Full",
    content:
      "Now you will feel no rain, for each of you will be the shelter for each other. Now you will feel no cold, for each of you will be the warmth for the other. Now you are two persons, but there is only one life before. Go now to your dwelling place to enter into the days of your life together. And may your days be good and long upon the earth. Treat yourselves and each other with respect, and remind yourselves often of what brought you together.",
  },
  {
    id: "reading14",
    label: "Marriage Blessing",
    content:
      "May your marriage bring you all the exquisite excitements a marriage should bring, and may life grant you also patience, tolerance, and understanding. May you always need one another - not so much to fill your emptiness as to help you to know your fullness. A mountain needs a valley to be complete; the valley does not make the mountain less, but more; and the valley is more a valley because it has a mountain towering over it.",
  },
  {
    id: "reading15",
    label: "Soulmate Connection",
    content:
      "A soulmate is someone who has locks that fit our keys, and keys to fit our locks. When we feel safe enough to open the locks, our truest selves step out and we can be completely and honestly who we are; we can be loved for who we are and not for who we're pretending to be. Each unveils the best part of the other. No matter what else goes wrong around us, with that one person we're safe in our own paradise.",
  },
  {
    id: "reading16",
    label: "I Promise",
    content:
      "I promise to give you the best of myself and to ask of you no more than you can give. I promise to respect you as your own person and to realize that your interests, desires and needs are no less important than my own. I promise to share with you my time and my attention and to bring joy, strength and imagination to our relationship. I promise to keep myself open to you, to let you see through the window of my world into my innermost fears and feelings, secrets and dreams.",
  },
  {
    id: "reading17",
    label: "How Do I Love Thee",
    content:
      "How do I love thee? Let me count the ways. I love thee to the depth and breadth and height my soul can reach, when feeling out of sight for the ends of Being and ideal Grace. I love thee to the level of every day's most quiet need, by sun and candle-light. I love thee freely, as men strive for Right; I love thee purely, as they turn from Praise. I love thee with the passion put to use in my old griefs, and with my childhood's faith.",
  },
  {
    id: "reading18",
    label: "These I Promise",
    content:
      "I cannot promise you a life of sunshine I cannot promise riches, wealth or gold I cannot promise you an easy pathway that leads away from change or growing old. But I can promise all my heart's devotion a smile to chase away your tears of sorrow a love that's ever true and ever growing a hand to hold in yours through each tomorrow.",
  },
  {
    id: "reading19",
    label: "The One",
    content:
      "When the one whose hand you're holding is the one who holds your heart when the one whose eyes you gaze into gives your hopes and dreams their start, when the one you think of first and last is the one who holds you tight, and the things you plan together make the whole world seem just right, when the one whom you believe in puts their faith and trust in you, you've found the one and only love you'll share your whole life through.",
  },
  {
    id: "reading20",
    label: "Circle of Love",
    content:
      "Marriage is a commitment to life, to the best that two people can find and bring out in each other. It offers opportunities for sharing and growth that no other human relationship can equal; a joining that is promised for a lifetime. Within the circle of its love, marriage encompasses all of life's most important relationships. A wife and a husband are each other's best friend, confidant, lover, teacher, listener, and critic.",
  },
  {
    id: "reading21",
    label: "Summer's Day",
    content:
      "Shall I compare thee to a summer's day? Thou are more lovely and more temperate: Rough winds do shake the darling buds of May, and summer's lease hath all too short a date; Sometime too hot the eye of heaven shines, and often is his gold complexion dimmed; And every fair from fair sometime declines, by chance or nature's changing course untrimmed; But thy eternal summer shall not fade, nor lose possession of that fair thou ow'st.",
  },
  {
    id: "reading22",
    label: "Blessing Hands",
    content:
      "These are the hands of your best friend, young and strong and full of love for you, that are holding yours on your wedding day, as you promise to love each other today, tomorrow, and forever. These are the hands that will work alongside yours, as together you build your future. These are the hands that will passionately love you and cherish you through the years, and with the slightest touch, will comfort you like no other.",
  },
  {
    id: "reading23",
    label: "Genesis Creation",
    content:
      "The LORD God said, \"It is not good for the man to be alone. I will make a helper suitable for him.\" So the LORD God caused the man to fall into a deep sleep; and while he was sleeping, he took one of the man's ribs and closed up the place with flesh. Then the LORD God made a woman from the rib he had taken out of the man, and he brought her to the man. The man said, \"This is now bone of my bones and flesh of my flesh.\" For this reason a man will leave his father and mother and be united to his wife, and they will become one flesh.",
  },
  {
    id: "reading24",
    label: "Isaiah Joy",
    content:
      "As a young man marries a young woman, so will your Builder marry you; as a bridegroom rejoices over his bride, so will your God rejoice over you.",
  },
  {
    id: "reading25",
    label: "Matthew Unity",
    content:
      "Haven't you read, that at the beginning the Creator 'made them male and female,' and said, 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh'? So they are no longer two, but one. Therefore what God has joined together, let man not separate.",
  },
  {
    id: "reading26",
    label: "Ephesians Love",
    content:
      "Husbands, love your wives, just as Christ loved the church and gave himself up for her. In this same way, husbands ought to love their wives as their own bodies. He who loves his wife loves himself. After all, no one ever hated his own body, but he feeds and cares for it. For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.",
  },
];

const ringIntroOptions: VowOption[] = [
  {
    id: "ringIntro1",
    label: "Ancient Symbol",
    content:
      "The ring is an ancient symbol, so perfect and simple. It has no beginning and has no end. It is round like the sun, like the moon, like the eye, like arms that embrace. It is a circle; for love that is given comes back round again. Your rings are precious because you wear them with love. They symbolize your commitment in marriage. They remind you of who you are, where you've been, and where you're going. As you wear them through time, they will reflect not only who you are as individuals, but also who you are a couple.",
  },
  {
    id: "ringIntro2",
    label: "Precious Metals",
    content:
      "These rings are made of precious metals; purified by the heat of many fires. They are a symbol of the wealth that resides inside each of you and the purity of your love for one another.",
  },
  {
    id: "ringIntro3",
    label: "Visible Symbol",
    content:
      "Though we have heard the vows, which have been shared by {groom_name} and {bride_name}, words, once spoken, are carried away on the wind. Therefore, the wedding ring is a visible symbol of the promises that have been made.",
  },
  {
    id: "ringIntro4",
    label: "Circle of Eternity",
    content:
      "The circle has frequently been used to symbolize eternity. The ring, like the circle, is a reminder of the perfection and endurance of {groom_name} and {bride_name}'s commitment to and love for one another.",
  },
  {
    id: "ringIntro5",
    label: "Vows and Promises",
    content:
      "These rings represent the vows and promises you've willingly exchanged. They reflect the commitment those words inspire and all your hopes and dreams for the future. May these rings symbolize your inherent wholeness and unity with one another, giving you the strength to happily honor your commitments to each other. May they remind you that marriage is not a destination but a journey, with no beginning and no end, just a moment to moment opportunity to love and be loved to the best of your ability.",
  },
  {
    id: "ringIntro6",
    label: "Token of Pledge",
    content:
      "Throughout human tradition, when you make a pledge, it has been deemed good to have a token to remind you of that pledge. For this purpose you have chosen rings. They are appropriate to the task because they are circles never ending, like the promises you make to each other today. And they are made of precious metal, never to be tarnished, like the love you have expressed before me and these witnesses. Please take these rings and honor each other in their giving.",
  },
  {
    id: "ringIntro7",
    label: "Wholeness and Peace",
    content:
      "A circle is the ancient symbol of wholeness and peace. It also represents the boundaries beyond which the special-ness of a particular relationship does not extend. In the form of a ring the circle is the accepted token of a marriage covenant. As these rings are fashioned from one of the earth's most precious materials, so may your love, nourished and sustained by the love of God, be the most precious and durable of the values you share. In giving and receiving these rings, you again acknowledge that your lives remain joined in one unbroken circle, wherever you go, you will always return to your shared life together.",
  },
  {
    id: "ringIntro8",
    label: "Precious Possession",
    content:
      "The wedding ring is a symbol of married love, the precious metals show that your love is your most precious possession, and the unending circle symbolizes that your love may never cease.",
  },
  {
    id: "ringIntro9",
    label: "Greater Union",
    content:
      "Marriage is a state in which two people come together and create a union that is greater than the sum of its parts. It is difficult to express in words the profound relationship that is love. Since the beginning of time, the ring has been an emblem of the sincerity and permanence of a couple's love for one another and regard for their marriage. As the circle can begin anew at any point, so a good marriage can pick any point to renew itself. These rings are symbols of your eternal love.",
  },
  {
    id: "ringIntro10",
    label: "Unbroken Circle",
    content:
      "The ring is a symbol of the unbroken circle of love. Love freely given has no beginning and no end, no giver and no receiver for each is the giver and each is the receiver. May these rings always remind you of the vows you have taken.",
  },
  {
    id: "ringIntro11",
    label: "Binding Contract",
    content:
      "I hold in my hand two beautiful rings, symbolic of a binding contract, to be given and received as bonds of never-ending love and devoted friendship, circles of life and circles of love. May these rings be blessed as the symbol of this affectionate unity.",
  },
  {
    id: "ringIntro12",
    label: "Blessed Signs",
    content:
      "Bless, O Lord, these rings to be signs of the vows by which this man and this woman have bound themselves to each other. Amen.",
  },
  {
    id: "ringIntro13",
    label: "Sign of Devotion",
    content:
      "May the Lord bless these rings which you give as your sign of love and devotion. Amen.",
  },
  {
    id: "ringIntro14",
    label: "Committed Love",
    content:
      "From the earliest of times, the circle has been a symbol of completeness, a symbol of committed love. An unbroken and never-ending circle symbolized a commitment of love that is also never ending. As often as either of you looks at this symbol, I hope that you will be reminded of these commitments to one another, which you make today. May these rings be blessed by God as the changeless symbol of this affectionate unity.",
  },
  {
    id: "ringIntro15",
    label: "Most Important",
    content:
      "The giving and receiving of rings is the most important part of a marriage ceremony, because the rings are made in the symbol of that which is eternal. There is no beginning and no end, and as you place these symbols on each other's finger, it signifies that there shall be no end to your marriage, and no end to the happiness that you will both share together. But let me remind you that these are also the special symbols you will wear before the world, certainly when you go back to your family, and friends, and co-workers. In fact, you will notice the response when you walk away from this beautiful place tonight. For when people look at you, they will look at your hand and notice the ring on your finger. They will know that you belong to someone special and that someone special belongs to you. Every day for the rest of your lives, every time you wash your hands or reach out to touch each other, these rings will be there to remind you of the great love that you share and of the wonder that the person standing in front of you loves you as much as you love them. So when you place these rings upon each other's fingers, wear them with love and with honor.",
  },
  {
    id: "ringIntro16",
    label: "Spiritual Grace",
    content:
      "Wedding rings are an outward and visible sign of an inward spiritual grace and the unbroken circle of love, signifying to all the union of this man and this woman in marriage.",
  },
  {
    id: "ringIntro17",
    label: "New Beginning",
    content:
      "These rings mark a new beginning in your journey together, filled with wonder, surprise, laughter, tears, celebration, grief, and joy. Let us pray: Bless, O god, the giving of these rings, that they who wear them may live in your peace and realized potential. Amen.",
  },
  {
    id: "ringIntro18",
    label: "More Precious",
    content:
      "These rings are made of precious metal, but they are made more precious by your wearing them, for they will adorn your loving hands. May they be a symbol of your eternal love for one another. As you wear them, may they be a constant reminder to you of one another, and of the deep bond of faith, trust, and love which they represent.",
  },
  {
    id: "ringIntro19",
    label: "Large Significance",
    content:
      "These rings are very large in their significance. They are made of precious metal, which symbolizes that your love is the most precious element in each other's life. The ring has no beginning and no ending, which symbolizes that the love between the two of you will never cease.",
  },
  {
    id: "ringIntro20",
    label: "Endless Love",
    content:
      "Let us pray. Bless, O Lord, the giving and receiving of these rings. May {groom_name} and {bride_name} abide in Thy peace and grow in their knowledge of Your presence through their loving union. May the seamless circle of these rings become the symbol of their endless love and serve to remind them of the holy covenant they have entered into today to be faithful, loving, and kind to each other. Dear God, may they live in Your grace and be forever true to this union. Amen.",
  },
  {
    id: "ringIntro21",
    label: "Two Contributions",
    content:
      "The ring is the symbol of the commitment which binds these two together. There are two rings because there are two people, each to make a contribution to the life of the other, and to their new life together. Let us pray: Bless, O Lord, the giving of these rings, that they who wear them may abide together in your peace and grow in one another's eyes.",
  },
  {
    id: "ringIntro22",
    label: "Visible Signs",
    content:
      "Father, bless these rings which {groom_name} and {bride_name} have set apart to be visible signs of the inward and spiritual bond which unites their hearts. As they give and receive these rings, may they testify to the world of the covenant made between them here. Amen",
  },
  {
    id: "ringIntro23",
    label: "Symbol of God",
    content:
      "The circle has long been a symbol of God. Without beginning or end and with no point of weakness, the circle is a reminder of the eternal quality of God and of unending strength. Let the seamless circle of these rings become the symbol of your endless love. Your wedding rings are most special because they say that even in your uniqueness you have chosen to be bonded, to allow the presence of another human being to enhance who you are.",
  },
  {
    id: "ringIntro24",
    label: "Proclamation Symbol",
    content:
      "At this time, will you take out the rings you have for each other. As you wear these things, they will speak to the community you live in, the people you work with, and strangers you run across. The ring is a symbol which proclaims to the world that you share a love with another and that you are deeply connected in the bond of marriage. We know what it means when other people see your wedding ring, but before you exchange your rings, I want you to listen to what these rings will speak to you. As you go from this celebration with the ring on your finger, allow it to remind you of this day. Allow it to awaken the deep passionate feelings that are stirring in your hearts at this moment. Let it remind you of the love that you have just professed with your vows. But also allow it to speak of more than just symbolism. Your ring should not only remind you of what you already feel. Hear the ring's plea for action. Hear how it whispers to once again profess your love to your spouse. Listen to its call to live out your love by doing romantic acts, thoughtful gestures, and caring deeds. Let it be a reminder that love needs to be offered and not just felt. When others see the ring, they will know you're married. When you see your ring and when you feel it on your hand, you should be reminded that your love needs to be displayed and conveyed in action.",
  },
  {
    id: "ringIntro25",
    label: "Vessel of Words",
    content:
      "At this time will you take out the rings you have for each other. {groom_name} and {bride_name}, you have just made promises of love and devotion to each other. These rings are symbols of the vows you have just spoken. Words are intangible and difficult to hold onto, so the ring becomes a vessel which will hold the words you have given to one another. The words of \"loving and cherishing,\" \"for better and for worse,\" \"honor and respecting,\" are now encased in the ring. It is a physical way to hold on to the promises made to you. When you first put on a new ring it feels unnatural. You feel the weight and you hear it clank against objects. It's a foreign object on your hand. But then there is a shift that happens. You become comfortable with the ring. It begins to mold your finger and feel comfortable until the day it just becomes a part of your hand. The ring is no longer a piece of jewelry that you wear. It becomes an extension of your hand. So this ring that embodies your vows…your promises eventually becomes an extension of your hand. In other words, you become your ring….you become your vows. At first, the ring is a symbol of the vows you have made…it contains them, but during that change when the ring begins to mold to your finger, you become the ring, because you begin to embody the vows. Instead of the ring being only a symbol of the promise \"to love and cherish\" you become the love and you display the action of one who cherishes. You are no longer holding onto promises of sticking around through better and worse, but you begin to live it out….You hold on…you work through. You take on the process of honoring and respecting that you said you would. As you place the rings on each other's finger, the ring is a symbol, a promise, that one day…many days…many years… you will fulfill.",
  },
  {
    id: "ringIntro26",
    label: "Constant Vows",
    content:
      "At this time will you take out the rings you have for each other, for these rings will be a visible sign of the vows you have made. The hand you place this ring on will not stay the same. In time, wrinkles will form, calluses will come and go, and different scars may appear. Not only will each of you change physically over time, but internally you will change as well. Your ideals, values, hopes may evolve. Things that are important to you today may not be the same over time. In 10, 20, 30 years you will change, but your rings, which represent your vows, will be constant. The promises to love, cherish, and respect one another no matter what life brings or what paths you take will always be worn around your finger. Your love will be constant as you walk together into the unknown. Your rings and your vows will cling to your finger and hold you together no matter what may come",
  },
  {
    id: "ringIntro27",
    label: "Emblem of Purity",
    content:
      "The wedding ring is justly regarded as a fitting emblem of the purity and perpetuity of marriage. It is symbolic of the circle of eternity, as it is so fashioned as to have neither beginning nor end; while gold is so incorruptible that it cannot be tarnished by use or by time. So may this marriage, at this time celebrated, be incorruptible in its purity and more lasting than time itself.",
  },
  {
    id: "ringIntro28",
    label: "Spirit Symbol",
    content:
      "And so we come {bride_name} and {groom_name}, to the presentation of rings by which you symbolize and bind your love. The circle has long been a symbol of spirit and the power of God. The sky and the earth are round. The wind in its greatest power whirls. The sun and moon, both round, come forth and go down again in a circle. Even the seasons form a great circle in their changing and always come back again to where they were. Without beginning or end and with no point of weakness, the circle is a reminder of the eternal quality of God and of unending strength. Let the seamless circle of these rings become the symbol of your endless love and unending faithfulness.",
  },
  {
    id: "ringIntro29",
    label: "Bonded Uniqueness",
    content:
      "Your wedding rings are most special because they say that even in your uniqueness you have chosen to be bonded, to allow the presence of another human being to enhance who you are. Your rings carry a potent double message: We are individuals and yet we belong; we are not alone. As you wear them through time, they will reflect not only who you are but also the glorious union that you are now creating. God, bless these rings and the two who exchange them. Fill them with your Holy Presence. Keep them safe in the circle of your protection and love.",
  },
];

const ringBlessingOptions: VowOption[] = [
  {
    id: "blessing1",
    label: "Divine Faith",
    content:
      "Heavenly Father, bless these rings. Grant that {groom_name} and {bride_name} may wear them with deep faith in each other. May they do your will and always live together in peace, love, and abiding joy. We ask this through Christ our Lord. Amen.",
  },
  {
    id: "blessing2",
    label: "Peaceful Unity",
    content:
      "Heavenly father, bless these rings. Grant that {groom_name} and {bride_name} may wear them with deep faith in each other. May they always live together in peace, love, and abiding joy. Amen.",
  },
  {
    id: "blessing3",
    label: "Journey Reflection",
    content:
      "These rings mark the beginning of a long journey filled with wonder, surprises, laughter, tears, celebration, grief, joy. May these rings glow in reflection of the warmth and love which flow through the wearers today.",
  },
  {
    id: "blessing4",
    label: "Eternal Love",
    content:
      "These rings have no beginning and no end. They set forth the eternal nature of real love. They will represent the love and trust that {groom_name} and {bride_name} promise to each other this day.",
  },
  {
    id: "blessing5",
    label: "Unity Circle",
    content:
      "The circle is the symbol of the sun, earth, and universe. It is the symbol of peace. Let this ring be the symbol of unity and peace in which your two lives are joined in one unbroken circle. Wherever you go, return unto one another and your togetherness.",
  },
  {
    id: "blessing6",
    label: "Shared Symbol",
    content:
      "Although you each wear only one of them, these rings essentially belong to you both. For they are a symbol of the love you share and the promise that it will be a strong and lasting love. Throughout the years, they will speak softly of your vow to grow along with one another, to face the challenges of life, to remain one another's first priority and keep your relationship rich and full. They will give you strength and comfort in times of uncertainty and heighten life's joys as you share them. Never again do you walk alone for your love will always be with you.",
  },
  {
    id: "blessing7",
    label: "Treasured Reminder",
    content:
      "From the earliest times, the circle has been a sign of completeness. The rings that you have chosen to wear have neither beginning nor end, much like your love for one another. They are a symbol of the words that you speak today. May these rings be from this day forward, your most treasured adornment, and may the love they symbolize, be your most precious possession. As you wear these rings, may they be constant reminders of these promises you are making today.",
  },
  {
    id: "blessing8",
    label: "Beautiful Creation",
    content:
      "Wedding bands are visible, tangible symbols of a couple's commitment and of their emotional and spiritual connection. Many people talk about rings as being a perfect circle, having no beginning and no end. But we all know that these rings have a beginning. Rock is dug up from the earth. Metals are liquefied, forged, cooled, and polished. Something beautiful is made from simple, raw elements. Love is like that. It comes from humble beginnings, made by imperfect beings. It is the process of making something beautiful where there was once nothing at all. {groom_name} and {bride_name}, let these rings serve as a reminder of the feelings you have in your hearts at this very moment. When you look at your wedding bands, remember the great gift that you have been given and all that you have in one another. Remember that you have someone to share this life with and never again will you walk alone.",
  },
];

const ringExchangeGroomOptions: VowOption[] = [
  {
    id: "groomRing1",
    label: "Traditional Sacred",
    content:
      "With this ring I thee wed, and with all my worldly goods I thee endow. In the name of the Father, and of the Son, and of the Holy Spirit.",
  },
  {
    id: "groomRing2",
    label: "Eternal Love",
    content:
      "{bride_name}, I give you this ring as a symbol of my eternal love. As you wear it, may it be a reminder of how much I love you, not only on this precious day, but every single day of your life.",
  },
  {
    id: "groomRing3",
    label: "Love & Faithfulness",
    content:
      "{bride_name}, I give you this ring as a symbol of my love and faithfulness to you.",
  },
  {
    id: "groomRing4",
    label: "Lifelong Giving",
    content:
      "{bride_name}, wear this ring as a sign of my life and the giving that will last the rest of my life.",
  },
  {
    id: "groomRing5",
    label: "Shared Love",
    content:
      "{bride_name}, I give you this ring as a symbol of the love I have for you. Wear it now as a sign of the love we share together.",
  },
  {
    id: "groomRing6",
    label: "Love & Affection",
    content:
      "I give you this ring, as I give of myself, with love and affection.",
  },
  {
    id: "groomRing7",
    label: "Eternal Symbol",
    content:
      "I, {groom_name}, give you, {bride_name}, this ring as an eternal symbol of my love and commitment to you.",
  },
  {
    id: "groomRing8",
    label: "Complete Vow",
    content:
      "{bride_name}, I give you this ring as a symbol of my vow, and with all that I am, and with all that I have, and with it, I marry you and join my life with yours.",
  },
];

const ringExchangeBrideOptions: VowOption[] = [
  {
    id: "brideRing1",
    label: "Traditional Sacred",
    content:
      "With this ring I thee wed, and with all my worldly goods I thee endow. In the name of the Father, and of the Son, and of the Holy Spirit.",
  },
  {
    id: "brideRing2",
    label: "Eternal Love",
    content:
      "{groom_name}, I give you this ring as a symbol of my eternal love. As you wear it, may it be a reminder of how much I love you, not only on this precious day, but every single day of your life.",
  },
  {
    id: "brideRing3",
    label: "Love & Faithfulness",
    content:
      "{groom_name}, I give you this ring as a symbol of my love and faithfulness to you.",
  },
  {
    id: "brideRing4",
    label: "Lifelong Giving",
    content:
      "{groom_name}, wear this ring as a sign of my life and the giving that will last the rest of my life.",
  },
  {
    id: "brideRing5",
    label: "Shared Love",
    content:
      "{groom_name}, I give you this ring as a symbol of the love I have for you. Wear it now as a sign of the love we share together.",
  },
  {
    id: "brideRing6",
    label: "Love & Affection",
    content:
      "I give you this ring, as I give of myself, with love and affection.",
  },
  {
    id: "brideRing7",
    label: "Eternal Symbol",
    content:
      "I, {bride_name}, give you, {groom_name}, this ring as an eternal symbol of my love and commitment to you.",
  },
  {
    id: "brideRing8",
    label: "Complete Vow",
    content:
      "{groom_name}, I give you this ring as a symbol of my vow, and with all that I am, and with all that I have, and with it, I marry you and join my life with yours.",
  },
];

const prayerOptions: VowOption[] = [
  {
    id: "prayer1",
    label: "Marriage Blessing",
    content:
      "May your marriage always be blessed with the purse and profoundly loving feelings drawing you so closely together now: extraordinary communication, listening and understanding, putting yourselves in the other's place, as well as expressing you own needs; eagerness to compromise, because you love so much, you want to give whatever is needed, wanted, for happiness; and deep commitment to do whatever it takes to maintain the strong bond present on your wedding day. May your marriage always be blessed, now and forever.",
  },
  {
    id: "prayer2",
    label: "Divine Light",
    content:
      "Most gracious God, Thou hast kindled in these hearts the fire of a divine love. Wilt thou keep it aflame upon the altar of their souls. Wilt thou make the inward aspirations of their hearts the outward reality of their home. Wilt thou make that home a place of light and truth, a place of beauty, a place of joy and happiness all the days of their lives. Amen.",
  },
  {
    id: "prayer3",
    label: "Love's Endurance",
    content:
      "Love is patient, love is kind. It does not envy; it does not boast. It is not proud; it is not rude. It is not self-seeking, it is not easily angered, and it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres. And now, faith, hope, and love abide, but the greatest of these is love.",
  },
  {
    id: "prayer4",
    label: "Five Blessings",
    content:
      "In joining your lives may God grant you both: Love—to afford each other a special quality of time together. Joy—in the accomplishments of one another. Understanding—that your interests and desires will not always be the same. Friendship—based on mutual trust. Courage—to speak of a misunderstanding and to work on a solution before the setting of the sun. Compassion—to comfort each other in pain and sorrow. Foresight—to realize rainbows follow rainy days. Imagination—to keep with you part of the child you used to be. Mirth—from your sense of humor. Awareness—to live each day with the knowledge that there is no promise of tomorrow. May God bless you and keep you in the Palm of His hand.",
  },
  {
    id: "prayer5",
    label: "Why Marriage",
    content:
      "Because to the depths of me, I long to love one person, with all my heart, my soul, my mind, my body. Because I need a forever friend to trust with the intimacies of me, who won't hold them against me, who loves me when I'm unlikeable. Who sees the small child in me and who looks for the divine potential of me. Because I need to cuddle in the warmth of the night with someone who thanks God for me, with someone I feel blessed to hold. Because marriage means opportunity to grow in love in friendship. Because marriage is a discipline to be added to a list of achievements. Because marriages do not fail, people fail when they enter into marriage expecting another to make them whole. Because, knowing this, I promise myself to take full responsibility for my spiritual, mental, and physical wholeness. I create me, I take half of the responsibility for my marriage. Together, we create our marriage. Because of this understanding, the possibilities are limitless.",
  },
  {
    id: "prayer6",
    label: "God's Love",
    content:
      "GOD IS LOVE\nMay you have His kind of love for each other.\n\nLOVE IS PATIENT AND KIND\nMay you be able to lovingly overlook each other's faults and weaknesses.\n\nLOVE IS NOT JEALOUS OR BOASTFUL\nMay you seek praise for each other and not for yourselves.\n\nLOVE IS NOT ARROGANT OR RUDE\nMay you give of yourselves for each other's needs and treat one another with utmost respect.\n\nLOVE DOES NOT INSIST ON ITS OWN WAY\nMay you genuinely listen to each other with a willingness to be wrong yourselves.\n\nLOVE IS NOT IRRITABLE OR RESENTFUL\nMay you be tolerant of each other's moods, always ready to forgive, never holding a grudge.\n\nLOVE DOES NOT REJOICE AT WRONG BUT REJOICES IN THE RIGHT\nMay you experience happiness because of each other's triumphs and successes.\n\nLOVE BEARS ALL THINGS\nMay you see to understand each other's differences, knowing you will stick together through it all.\n\nLOVE HOPES ALL THINGS\nMay you always expect the best in each situation, regardless of temporary setbacks.\n\nLOVE ENDURES ALL THINGS\nMay you never give up your commitment to work on improving your relationship.\n\nLOVE NEVER ENDS\nMay you spend the rest of your lives together, enjoying His love.",
  },
  {
    id: "prayer7",
    label: "Two Human Souls",
    content:
      "What greater thing is there for two human souls, than to feel that they are joined for life- to strengthen each other in all labor, to rest on each other in all sorrow, to minister to each other in all pain, to be one with each other in silent unspeakable memories.",
  },
  {
    id: "prayer8",
    label: "Gentle Spirit",
    content:
      "The vows you have just taken, pledging love, mean far more than mere words ever can. May their gentle spirit move in you. May your years fulfill the beauty of the feelings expressed today, and may you always put these vows above the things that make life smaller. May God always be with, protect, and guide both of you, now and forever.",
  },
  {
    id: "prayer9",
    label: "Irish Blessing",
    content:
      "May the road rise to meet you, May the wind be always at your back. May the sun shine warm upon your face, The rains fall soft upon your fields. And until we meet again, May God hold you in the palm of his hand. May God be with you and bless you; May you see your children's children. May you be poor in misfortune, Rich in blessings, May you know nothing but happiness from this day forward. May the road rise to meet you May the wind be always at your back May the warm rays of sun fall upon your home and may the hand of a friend always be near. May green be the grass you walk on, May blue be the skies above you, May pure be the joys that surround you, May true be the hearts that love you.",
  },
];

const VowsStep = ({
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: VowsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { groomName, brideName } = useCeremonyContext();

  const openModal = (optionId: string) => {
    setSelectedModal(optionId);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const handleSelection = (fieldName: string, optionId: string) => {
    // Find the option and get its content with name replacements
    let options: VowOption[] = [];
    switch (fieldName) {
      case "chargeToGroomAndBride":
        options = chargeOptions;
        break;
      case "pledge":
        options = pledgeOptions;
        break;
      case "introductionToExchangeOfVows":
        options = vowIntroOptions;
        break;
      case "vows":
        options = vowOptions;
        break;
      case "readings":
        options = readingOptions;
        break;
      case "introductionToExchangeOfRings":
        options = ringIntroOptions;
        break;
      case "blessingsOfRings":
        options = ringBlessingOptions;
        break;
      case "exchangeOfRingsGroom":
        options = ringExchangeGroomOptions;
        break;
      case "exchangeOfRingsBride":
        options = ringExchangeBrideOptions;
        break;
      case "prayerOnTheNewUnion":
        options = prayerOptions;
        break;
    }
    
    const option = options.find(opt => opt.id === optionId);
    if (option) {
      const currentBrideName = brideName || "Bride's Name";
      const currentGroomName = groomName || "Groom's Name";
      const content = option.content
        .replace(/{bride_name}/g, currentBrideName)
        .replace(/{groom_name}/g, currentGroomName);
      onSelectDropdown(fieldName, content);
    }
  };

  const getOptionContent = (
    options: VowOption[],
    optionId: string,
    brideNameVal: string,
    groomNameVal: string
  ) => {
    const option = options.find((opt) => opt.id === optionId);
    if (!option) return "";

    return option.content
      .replace(/{bride_name}/g, brideNameVal || "Bride's Name")
      .replace(/{groom_name}/g, groomNameVal || "Groom's Name");
  };

  return (
    <div className="space-y-6">
      {/* Charge to Groom and Bride */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Charge to Groom and Bride
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="chargeToGroomAndBride"
            options={chargeOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("chargeToGroomAndBride");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = chargeOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select charge option"
            isOpen={openDropdowns.chargeToGroomAndBride || false}
            onToggle={() => onToggleDropdown("chargeToGroomAndBride")}
            onSelect={(value) => {
              const option = chargeOptions.find((opt) => opt.label === value);
              if (option) handleSelection("chargeToGroomAndBride", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {chargeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pledge */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Pledge
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="pledge"
            options={pledgeOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("pledge");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = pledgeOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select pledge option"
            isOpen={openDropdowns.pledge || false}
            onToggle={() => onToggleDropdown("pledge")}
            onSelect={(value) => {
              const option = pledgeOptions.find((opt) => opt.label === value);
              if (option) handleSelection("pledge", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {pledgeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Introduction to Exchange of Vows */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Introduction to Exchange of Vows
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="introductionToExchangeOfVows"
            options={vowIntroOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("introductionToExchangeOfVows");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = vowIntroOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select vow introduction option"
            isOpen={openDropdowns.introductionToExchangeOfVows || false}
            onToggle={() => onToggleDropdown("introductionToExchangeOfVows")}
            onSelect={(value) => {
              const option = vowIntroOptions.find((opt) => opt.label === value);
              if (option)
                handleSelection("introductionToExchangeOfVows", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {vowIntroOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vows */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Vows
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="vows"
            options={vowOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("vows");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = vowOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select vow option"
            isOpen={openDropdowns.vows || false}
            onToggle={() => onToggleDropdown("vows")}
            onSelect={(value) => {
              const option = vowOptions.find((opt) => opt.label === value);
              if (option) handleSelection("vows", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {vowOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Readings */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Readings
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="readings"
            options={readingOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("readings");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = readingOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select reading option"
            isOpen={openDropdowns.readings || false}
            onToggle={() => onToggleDropdown("readings")}
            onSelect={(value) => {
              const option = readingOptions.find((opt) => opt.label === value);
              if (option) handleSelection("readings", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {readingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Introduction to Exchange of Rings */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Introduction to Exchange of Rings
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="introductionToExchangeOfRings"
            options={ringIntroOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("introductionToExchangeOfRings");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = ringIntroOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select ring introduction option"
            isOpen={openDropdowns.introductionToExchangeOfRings || false}
            onToggle={() => onToggleDropdown("introductionToExchangeOfRings")}
            onSelect={(value) => {
              const option = ringIntroOptions.find(
                (opt) => opt.label === value
              );
              if (option)
                handleSelection("introductionToExchangeOfRings", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringIntroOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blessings of Rings */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Blessings of Rings
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="blessingsOfRings"
            options={ringBlessingOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("blessingsOfRings");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = ringBlessingOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select ring blessing option"
            isOpen={openDropdowns.blessingsOfRings || false}
            onToggle={() => onToggleDropdown("blessingsOfRings")}
            onSelect={(value) => {
              const option = ringBlessingOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("blessingsOfRings", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringBlessingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange of Rings - Groom */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Exchange of Rings - Groom to Bride
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="exchangeOfRingsGroom"
            options={ringExchangeGroomOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("exchangeOfRingsGroom");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = ringExchangeGroomOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select groom's ring exchange option"
            isOpen={openDropdowns.exchangeOfRingsGroom || false}
            onToggle={() => onToggleDropdown("exchangeOfRingsGroom")}
            onSelect={(value) => {
              const option = ringExchangeGroomOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("exchangeOfRingsGroom", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringExchangeGroomOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange of Rings - Bride */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Exchange of Rings - Bride to Groom
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="exchangeOfRingsBride"
            options={ringExchangeBrideOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("exchangeOfRingsBride");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = ringExchangeBrideOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select bride's ring exchange option"
            isOpen={openDropdowns.exchangeOfRingsBride || false}
            onToggle={() => onToggleDropdown("exchangeOfRingsBride")}
            onSelect={(value) => {
              const option = ringExchangeBrideOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("exchangeOfRingsBride", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringExchangeBrideOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prayer on the New Union */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Prayer on the New Union
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="prayerOnTheNewUnion"
            options={prayerOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("prayerOnTheNewUnion");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = prayerOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select prayer option"
            isOpen={openDropdowns.prayerOnTheNewUnion || false}
            onToggle={() => onToggleDropdown("prayerOnTheNewUnion")}
            onSelect={(value) => {
              const option = prayerOptions.find((opt) => opt.label === value);
              if (option) handleSelection("prayerOnTheNewUnion", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {prayerOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Option Preview */}
      {selectedModal && (
        <div className="fixed inset-0 bg-[#6851134d] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {(() => {
                    const allOptions = [
                      ...chargeOptions,
                      ...pledgeOptions,
                      ...vowIntroOptions,
                      ...vowOptions,
                      ...readingOptions,
                      ...ringIntroOptions,
                      ...ringBlessingOptions,
                      ...ringExchangeGroomOptions,
                      ...ringExchangeBrideOptions,
                      ...prayerOptions,
                    ];
                    return (
                      allOptions.find((opt) => opt.id === selectedModal)
                        ?.label || "Preview"
                    );
                  })()}{" "}
                  Preview
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {(() => {
                    const currentBrideName =
                      watch("brideName") || brideName || "";
                    const currentGroomName =
                      watch("groomName") || groomName || "";

                    // Check which option type this is and get content
                    if (chargeOptions.find((opt) => opt.id === selectedModal)) {
                      return getOptionContent(
                        chargeOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      pledgeOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        pledgeOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      vowIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        vowIntroOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      vowOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        vowOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      readingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        readingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        ringIntroOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringBlessingOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        ringBlessingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringExchangeGroomOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        ringExchangeGroomOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringExchangeBrideOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        ringExchangeBrideOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      prayerOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        prayerOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    }
                    return "";
                  })()}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Determine which field this option belongs to and select it
                    if (chargeOptions.find((opt) => opt.id === selectedModal)) {
                      handleSelection("chargeToGroomAndBride", selectedModal);
                    } else if (
                      pledgeOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("pledge", selectedModal);
                    } else if (
                      vowIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection(
                        "introductionToExchangeOfVows",
                        selectedModal
                      );
                    } else if (
                      vowOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("vows", selectedModal);
                    } else if (
                      readingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("readings", selectedModal);
                    } else if (
                      ringIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection(
                        "introductionToExchangeOfRings",
                        selectedModal
                      );
                    } else if (
                      ringBlessingOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("blessingsOfRings", selectedModal);
                    } else if (
                      ringExchangeGroomOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("exchangeOfRingsGroom", selectedModal);
                    } else if (
                      ringExchangeBrideOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("exchangeOfRingsBride", selectedModal);
                    } else if (
                      prayerOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("prayerOnTheNewUnion", selectedModal);
                    }
                    closeModal();
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Select This Option
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VowsStep;
