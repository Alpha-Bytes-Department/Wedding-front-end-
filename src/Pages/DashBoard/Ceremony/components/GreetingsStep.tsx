import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";

interface GreetingsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (field: keyof CeremonyFormData) => any;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

interface GreetingOption {
  id: string;
  label: string;
  content: string;
}

const greetingOptions: GreetingOption[] = [
  {
    id: "option1",
    label: "Option 1",
    content:
      "We gather here today, in the presence of God, family and friends to join {groom_name} and {bride_name} in matrimony. We celebrate the coming together in love of this man and this woman. We remember that marriage is a time when growing love is made public, when two people share mutual promises before God and before us. We join in our support of them as they offer themselves to each other. We celebrate their joy, their love and their expectations.",
  },
  {
    id: "option2",
    label: "Option 2",
    content:
      "We gather here today to celebrate one of life’s greatest moments, to give recognition to the worth and beauty of love, and to add our best wishes to the words which shall unite {bride_name} and {groom_name} in their marriage.",
  },
  {
    id: "option3",
    label: "Option 3",
    content:
      "We gather here today, in the presence of God, family and friends to join {groom_name} and {bride_name} in matrimony. In witnessing this ceremony today, we are observing an outward sign of an inward union that already exists between {groom_name} and {bride_name}. Today, they have come before God and before us to publicly affirm their love; to promise to continue to nurture themselves, each other, and this union; and to acknowledge its centrality in their lives. They do so knowing that marriage is at once the most tender, yet challenging, of all relations in life. We join in our support of them as they offer themselves to each other. We celebrate their joy, their love and their expectations.",
  },
  {
    id: "option4",
    label: "Option 4",
    content:
      "We are gathered here together, in the presence of God, family and friends, to ratify in the outer, a union of souls that has already taken place in spirit.",
  },
  {
    id: "option5",
    label: "Option 5",
    content:
      "We gather here today, in the presence of God, family and friends to join {groom_name} and {bride_name} in matrimony. Every marriage ceremony is unique, and today, not only are two special people being joined together, but two faiths, as well. Out of two different and distinct traditions, they have come together to learn the best of what each has to offer, appreciating their differences, and confirming that love, which is spoken of in all religions, is our souls’ true home, our true meeting place. So, this is not only a joyous occasion, but a holy one, as well. May you see that your love for each other is truly a gift from God.",
  },
  {
    id: "option6",
    label: "Option 6",
    content:
      "Friends; we have been invited here today to share with {groom_name} and {bride_name} a very important moment in their lives. In the years they have been together, their love and understanding of each other has grown and matured, and now they have decided to live their lives together as husband and wife.",
  },
  {
    id: "option7",
    label: "Option 7",
    content:
      "Welcome, family, friends and loved ones.",
  },
  {
    id: "option8",
    label: "Option 8", 
    content:
      "We gather here today to celebrate the wedding of {groom_name} and {bride_name}. You have come from near and far to share in this formal commitment they make to one another, to offer your love and support to this union, and to allow them to start their married life together surrounded by the people dearest and most important to them.",
  },
  {
    id: "option9",
    label: "Option 9",
    content:
      "Today represents not only the joining of {groom_name} and {bride_name} but also the joining of their families and friends. {groom_name} and {bride_name} would like to recognize their parents on this occasion. They offer their profound gratitude for all the love and care their parents showed in raising them. The unconditional gifts of love and support that you have continually offered have inspired them to become who they are today. Without you, this day would not be possible.",
  },
  {
    id: "option10",
    label: "Option 10",
    content:
      "Marriage is a commitment in life, where two people can find and bring out the very best in each other. It offers opportunities for sharing and growth that no other human relationship can equal, a physical and emotional joining that has the promise of a lifetime.",
  },
  {
    id: "option11",
    label: "Option 11",
    content:
      "Marriage is perhaps the greatest and most challenging adventure of human relationships. No ceremony can create your marriage; only you can do that—through love and patience; through dedication and perseverance; through talking and listening, helping and supporting and believing in each other; through tenderness and laughter; through learning to forgive, learning to appreciate your differences, and by learning to make the important things matter, and to let go of the rest.",
  },
  {
    id: "option12",
    label: "Option 12",
    content:
      "{groom_name} and {bride_name}, marriage is the promise between two people who love each other, who trust that love, who honor one another as individuals in that togetherness, and who wish to spend the rest of their lives together. It enables the two separate souls to share their desires, longings, dreams, and memories, their joys and sorrows, and to help each other through all uncertainties of life. A strong marriage also nurtures each of you as separate individuals and allows you to maintain your unique identity and grow in your own way through the years ahead. It is a safe haven for each of you to become your best self, while together, you become better than you ever could be alone. You are adding to your life, not only the affection of each other, but also the companionship and blessing of a deep trust. You are agreeing to share strength, responsibilities and love. To make this relationship work, therefore, takes more than love. It takes trust, to know in your hearts that you want only the best for each other. It takes dedication, to stay open to one another, to learn and grow, even when it is difficult to do so. And it takes faith, to go forward together without knowing what the future holds for you both.",
  },
  {
    id: "option13",
    label: "Option 13",
    content:
      "We have come here today to celebrate love. We see it in the faces of {groom_name} and {bride_name} who stand before us, and we experience it in our own hearts as well. It is a love which is spoken of in all religions, and is our souls' true home, our true meeting place. It kindles our souls with hope. We are grateful to them for inviting us to witness and share in this precious moment. To this day they bring their love as a treasure to share with one another.",
  },
  {
    id: "option14",
    label: "Option 14",
    content:
      "We are gathered here today to witness the coming together of two people {groom_name} and {bride_name}, whose hearts and spirits are entwined as one. They now desire to profess before the entire world their intention henceforth to walk the road of life together.",
  },
  {
    id: "option15",
    label: "Option 15",
    content:
      "We, who have gathered in this circle, are now privileged to witness and to participate in a ceremony celebrating the public acknowledgment of a love which {groom_name} and {bride_name} have for each other, knowing that by our presence here with them, we are saying that they, together, are loved by many others. We have come to surround them as they stand before us in this center, where now {groom_name} and {bride_name} in essence say, \"Welcome to our marriage! Welcome to the Celebration!\"",
  }
];

const presentationOptions: GreetingOption[] = [
  {
    id: "presentation1",
    label: "Independent Bride",
    content: "{bride_name} walks herself down the aisle, symbolizing her independence and choice to enter this marriage.",
  },
  {
    id: "presentation2", 
    label: "Together Walk",
    content: "{bride_name} and {groom_name} walk down the aisle together, showing their equal partnership from the very beginning.",
  },
  {
    id: "presentation3",
    label: "Family Escort",
    content: "{bride_name} is lovingly escorted down the aisle by a family member who supports her in this joyous decision.",
  },
  {
    id: "presentation4",
    label: "Dual Family Presentation", 
    content: "Both {bride_name} and {groom_name} are presented by their families to each other, symbolizing the joining of two families in support of this union.",
  },
  {
    id: "presentation5",
    label: "Meeting at the Altar",
    content: "{bride_name} and {groom_name} walk themselves to the altar where they pause to honor their parents with an exchange of gratitude, respect, and thanks for their love and support.",
  },
  {
    id: "presentation6",
    label: "Traditional with Modern Acknowledgment", 
    content: "{bride_name} is walked down the aisle by her father in the traditional manner, and {groom_name} acknowledges this honor with gratitude and respect as he welcomes his bride.",
  },
];

const questionOptions: GreetingOption[] = [
  {
    id: "question1",
    label: "Option 1",
    content:
      "Who has the honor of presenting this bride today?",
  },
  {
    id: "question2",
    label: "Option 2",
    content:
      "Who has the honor of presenting this woman to be married to this man?",
  },
  {
    id: "question3",
    label: "Option 3",
    content:
      "Who gives this woman to be married to this man?",
  },
  {
    id: "question4",
    label: "Option 4",
    content:
      "Who stands with this woman to represent her family?",
  },
  {
    id: "question5",
    label: "Option 5",
    content:
      "Who presents this bride on this happy day of her life?",
  },
  {
    id: "question6",
    label: "Option 6",
    content:
      "Doubly blessed is that couple which come to the marriage altar with the approval and blessings of their families and friends. Who has the honor of presenting this woman to be married to this man?",
  },
  {
    id: "question7",
    label: "Option 7",
    content:
      "One of the most understated, but deepest, relationships in human life is that between a caring father and a loving daughter. One of the rare occasions in which this relationship is acknowledged is at a wedding ceremony. {bride_name}'s father, today, represents his family, but even more important, in this special gesture, he stands here today in his own loving support of his daughter and gives her hand to another man's for her safe keeping. So, it is with great pleasure that I now ask, \"Who gives this woman to be married to this man?\"",
  },
];

const responseOptions: GreetingOption[] = [
  {
    id: "response1",
    label: "I Do",
    content: "I do.",
  },
  {
    id: "response2", 
    label: "Both Parents",
    content: "Her mother and I do.",
  },
  {
    id: "response3",
    label: "We Do",
    content: "We do.",
  },
  {
    id: "response4",
    label: "Father's Blessing",
    content: "She gives herself freely, with my love and blessing.",
  },
  {
    id: "response5",
    label: "Parents' Blessing", 
    content: "She gives herself freely, with our love and blessing.",
  },
  {
    id: "response6",
    label: "Mother & Father",
    content: "She gives herself freely, with her mother's and my love and blessing.",
  },
  {
    id: "response7",
    label: "Family Support",
    content: "She gives herself freely, with the love and support of her family and friends.",
  },
  {
    id: "response8",
    label: "Family Rep",
    content: "On behalf of her family, I do.",
  },
  {
    id: "response9",
    label: "All Who Love",
    content: "On behalf of all who love her, I do.",
  },
];

const invocationOptions: GreetingOption[] = [
  {
    id: "invocation1",
    label: "Father's Gift",
    content:
      "Our Father, love has been Your richest and greatest gift to the world. Love between two souls which matures into marriage is one of Your most beautiful types of love. Today we celebrate that love. May Your blessing be on this wedding service. Protect, guide, and bless {groom_name} and {bride_name} in their marriage. Surround them and us with Your love now and always. Amen.",
  },
  {
    id: "invocation2",
    label: "Creator's Blessing",
    content:
      "May the God who has created and sustain us, hear our words to each other and grant blessing to this couple, their families, and their friends. Amen.",
  },
  {
    id: "invocation3",
    label: "Gift of Love",
    content:
      "Thank you, Father, for love. Thank you for marriage. Thank you for giving your gift of beautiful love to {groom_name} and {bride_name}. Today, they want to dedicate that love to each other. We pray that Thy loving presence will encircle their wedding service. We pray that Thy blessing will encircle the marriage of {groom_name} and {bride_name}. Amen.",
  },
  {
    id: "invocation4",
    label: "Joy & Gratitude",
    content:
      "God, for the joy of this occasion, we thank You. For the meaning of this day, we thank You. For this important moment in an ever-growing relationship, we thank You. For your presence here and now and for your presence at all times. We thank You. Amen.",
  },
  {
    id: "invocation5",
    label: "May You Always",
    content:
      "May you always need one another, not so much to fill the emptiness as to help each other know your fullness. May you want one another, but not out of lack. May you embrace one another, but not encircle one another. May you succeed in all important ways with each other, and not fail in the little graces. Look for things to praise, often say \"I love you,\" and take no notice of small faults. May you have happiness, and may you find it in making one another happy. May you have love, and may you find it in loving one another.",
  },
  {
    id: "invocation6",
    label: "Marriage Blessings",
    content:
      "May your marriage bring you all the exquisite excitements a marriage should bring, and may life grant you patience, tolerance, and understanding. May you always need one another, but not out of lack. May you embrace one another, but not encircle one another. May you succeed in all important ways with each other, and not fail in the little graces. Look for things to praise, often say \"I love you,\" and take no notice of small faults. May you enthusiastically enter into the mystery that is the awareness of one another's presence—a bond that is as warm and near when you are side by side as when you are separated by time and circumstances. May you have happiness, and may you find it in making one another happy. May you have love, and may you find it in loving one another.",
  },
  {
    id: "invocation7",
    label: "Sacred Union",
    content:
      "Marriage is a gift from God, a miracle. After speaking to you both, it is obvious that you already know some of the great blessing's marriage has to offer. It is an opportunity to feel the joy of taking care of someone who takes care of you, to be challenged towards growth yet gently nurtured, to love deeply and receive it in return. It is about trust, friendship and having a partner to share all life has to offer. It is a commitment to participate in a process of mutual evolution, understanding and forgiveness. It is indeed a sacred union to be treated with reverence. Marriage is not a place to hide from the world. It is a safe place to grow and become wiser. It is a place to evolve into better people; so that you can go out in the world and make a difference by spreading the joy and wisdom that you have found with each other. {bride_name}, {groom_name} is a gift to you from God, but he is not a gift for you alone. It is God's will that in your love, this man might find within himself a greater sense of who he is meant to be. You are asked to see the good in this man, to accept him for who he is and who he shall be. In this way, God's purpose shall be accomplished in this relationship. May this man find the kingdom of heaven through the love you share. And so, it is with you also {groom_name}, that although {bride_name} is God's gift to you, she is not a gift intended for you alone. You are asked by God to so love this woman, that in your love she might find herself as God has created her, so beautiful and strong and brave and true, that the entire world might be blessed by the presence of a woman who shines so. May she find refuge in your arms as she has never before. May she know, from now on, that there is one on whose love she can depend on forever.",
  },
  {
    id: "invocation8",
    label: "Supreme Sharing",
    content:
      "Marriage is a supreme sharing, perhaps the greatest and most challenging adventure in the most intimate of human relationships. It is the joyful uniting of a man and a woman whose care and affection and understanding have flowered into a deep and abiding love. Those who take its sacred vows have their lives blended together into one, as the waters of two rivers are joined when they come together to form an even greater one. A true spiritual marriage is an act of metamorphosis, a profound mystery of creation and rebirth, as two become one. It is not a giving up or loss of oneself, but rather a giving over of oneself to something greater-a transformation of self in which each one can say, \"I am no longer only I but also we.\" It is a process in which each can be challenged to discover new possibilities in themselves and each other. In such a marriage, the wedding ceremony is the gateway into this mystery. For the lives the two of you have lived up until this moment are, in some sense, now truly completed and over. Together you now live within the creation of something wholly new and transcendent, something which has never existed before-your miraculous marriage-an expression that is at once public and private, precious, sacred, and truly unique to the two of you. In this act, you open yourselves to a fuller experience and expression of the great, vast miracle of love. No ceremony can create your marriage. Only you can do that-through love, patience, dedication, perseverance-through talking and listening and trying to understand-through helping and supporting and believing in each other-through learning to forgive, learning to respect and appreciate your differences, and learning to make the important things matter and to let go of the rest. What this ceremony can do is to witness and affirm the choice you have made to begin a new life today as husband and wife.",
  },
  {
    id: "invocation9",
    label: "True Love",
    content:
      "To love is not to possess, to own or imprison, nor to lose one's self in another. Love is to join and separate, to walk alone and together, to find a laughing freedom that lonely isolation does not permit. It is finally to be able to be who we really are. No longer clinging in childish dependency, nor docilely, living separate lives in silence. It is to be perfectly one's self and perfectly joined in permanent commitment to another–and to one's inner self. Love only endures when it moves like waves, receding and returning gently or passionately, or moving lovingly like the tide. In the moon's own predictable harmony, because finally, despite a child's scars or an adult's deepest wounds, they are openly free to be who they really are–and always secretly were. In the very core of their being where true and lasting love can alone abide.",
  },
  {
    id: "invocation10",
    label: "Faithful Love",
    content:
      "Gracious God, always faithful in Your love for us, we rejoice in Your presence. You create love. You unite us in one human family. May Your presence fill our hearts with new joy, and make new, the lives of your people whose marriage we celebrate. Bless all creation through this sign of Your love shown in the love of {groom_name} and {bride_name} for each other. Sustain them, and all of us, in a love that knows no end. Amen.",
  },
  {
    id: "invocation11",
    label: "Heart of Relations",
    content:
      "Loving God, You are at the heart of all our relationships. You are the understanding spirit that brings us together in friendship. You are the caring spirit that enables us to listen to each other's needs. You are the enduring spirit which holds fast when the storms of life hit home. You are the trusting spirit which builds our faith in one another. Bless this time together, we pray. Amen.",
  },
  {
    id: "invocation12",
    label: "Silent Partners",
    content:
      "O God in heaven, bless these friends of ours who are about to give their vows of faithfulness to each other and to live together in the covenant bond of marriage. Let your love become their love, so that in their lives together they may be more concerned about the other than themselves. Above all, help each of us to be their silent partners as we pray for them in the coming days, and be ready to assist them with good counsel and a helping hand. We pray this with joy in our hearts, Amen.",
  },
  {
    id: "invocation13",
    label: "Creator's Gift",
    content:
      "O God, Creator of us all, we thank you for the gift of life and on this day, we thank You especially for the joy that {groom_name} and {bride_name} have found in each other, and for the promises they will make before you. Bless all our families and friends on this special day. We pray particularly for those who are far away today but here in spirit, sharing the joy of this day. We pray, O God, that You remain with {groom_name} and {bride_name} as a partner in their marriage. Grant to them, and to us all, love and understanding all our days. Amen.",
  },
  {
    id: "invocation14",
    label: "Generous Love",
    content:
      "Gracious God, your generous love surrounds us, and everything we enjoy comes from You. In your great love you have given us the gift of marriage. Bless {groom_name} and {bride_name} as they pledge their lives to each other. We feel that you have brought them together in the beginning, helped their love grow, and in this moment are with them in a special way. May their love continue to grow and be a true reflection of Your love for us all. Amen.",
  },
  {
    id: "invocation15",
    label: "God of Promise",
    content:
      "O God of promise, Your greatest gift is love, bless {groom_name} and {bride_name} who today within Your presence will take each other in marriage. We thank You that they have found such love and faith and trust in each other that they wish to live for the other all the rest of their lives. Let nothing come between them, but throughout all the chances and changes of life keep them forever loving and forever true to each other. Keep them safe from all trouble which would hurt them in any way. But, when any trial does come to them, grant that it may only bring closer together and closer to You. Grant to them through all their days the perfect love which many waters cannot quench. Amen.",
  },
  {
    id: "invocation16",
    label: "Ebb & Flow",
    content:
      "When you love someone, you do not love them all the time, in exactly the same way, from moment to moment. That is impossible. It is even a disservice to pretend it is possible. Yet that is what most of us demand. We have such little faith in the ebb and flow of life and of love and of relationships. We leap forward at the flow of the tide and resist in terror its ebb, for we are afraid it will never return. We insist on permanence, on duration, on continuity. But the only continuity possible in life, as in love, is in growth, in fluidity and in freedom, as dancers are free, barely touching as they pass, but partners in creating the same pattern. I speak now to {groom_name} and {bride_name} of love, in which, the trust and freedom of the other person becomes as significant as the trust and freedom of one's self. I speak to them of generosity, which gathers the beauty of earth for riches and the kindness which turns away the wrath of foolish men and women. I speak of all our hopes for their continued growth through patience, one for the other. May {groom_name} and {bride_name} keep the vows made on this day, in freedom, teaching each other who they are, what they yet shall be, enabling them to know that, in the fullness of being, they are more than themselves and more than each other, that they are all of us and that together we share joyously the fruits of life on this Earth, our home.",
  },
  {
    id: "invocation17",
    label: "Act of Faith",
    content:
      "{groom_name} and {bride_name}, in presenting yourselves here today, to be joined in holy union, you perform an act of faith. This faith can grow and mature and endure, but only if you both determine to make it so. A lasting and growing love is never automatic, nor guaranteed by any ceremony. If you would have the foundation of your union be the love you have for each other, not just at this moment, but for all the days ahead, then cherish the hopes and dreams that you bring here today. Resolve that your love will never be blotted out by the commonplace nor obscured by the ordinary in life. Faults will appear where now you find contentment, and wonder can be crushed by the routine of daily living. Devotion, joy and love can grow only if you nurture them together. Stand fast in that hope and confidence; believe in your shared future just as strongly as you believe in yourselves and in each other today. In this spirit, can you create a partnership that will strengthen and sustain you all the days of your lives.",
  },
];

const GreetingsStep = ({
  
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: GreetingsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { groomName, brideName } =
    useCeremonyContext();

  const openModal = (optionId: string) => {
    setSelectedModal(optionId);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const handleSelection = (fieldName: string, optionId: string) => {
    // Find the option and get its content with name replacements
    let options: GreetingOption[] = [];
    switch (fieldName) {
      case "greetingSpeech":
        options = greetingOptions;
        break;
      case "presentationOfBride":
        options = presentationOptions;
        break;
      case "questionForPresentation":
        options = questionOptions;
        break;
      case "responseToQuestion":
        options = responseOptions;
        break;
      case "invocation":
        options = invocationOptions;
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
    options: GreetingOption[],
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
      {/* Names Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
      </div> */}

      {/* Language Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Language
        </label>
        <CustomDropdown
          name="language"
          options={[
            "English",
            "spanish",
          ]}
          value={watch("language") || ""}
          placeholder="Select language"
          isOpen={openDropdowns.language || false}
          onToggle={() => onToggleDropdown("language")}
          onSelect={(name, value) => onSelectDropdown(name, value)}
        />
      </div>

      {/* Greeting Speech Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Greeting Speech
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="greetingSpeech"
            options={greetingOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("greetingSpeech");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = greetingOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select greeting option"
            isOpen={openDropdowns.greetingSpeech || false}
            onToggle={() => onToggleDropdown("greetingSpeech")}
            onSelect={(value) => {
              const option = greetingOptions.find((opt) => opt.label === value);
              if (option) handleSelection("greetingSpeech", option.id);
            }}
          />

          {/* Modal Buttons for Preview */}
          <div className="flex gap-2 flex-wrap">
            {greetingOptions.map((option) => (
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

      {/* Additional Greeting Elements */}
      <div className="grid grid-cols-1 gap-6">
        {/* Presentation of Bride */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Presentation of Bride
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="presentationOfBride"
              options={presentationOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("presentationOfBride");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = presentationOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select presentation option"
              isOpen={openDropdowns.presentationOfBride || false}
              onToggle={() => onToggleDropdown("presentationOfBride")}
              onSelect={(value) => {
                const option = presentationOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("presentationOfBride", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {presentationOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question for Presentation */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Question for Presentation of Bride
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="questionForPresentation"
              options={questionOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("questionForPresentation");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = questionOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select question option"
              isOpen={openDropdowns.questionForPresentation || false}
              onToggle={() => onToggleDropdown("questionForPresentation")}
              onSelect={(value) => {
                const option = questionOptions.find(
                  (opt) => opt.label === value
                );
                if (option)
                  handleSelection("questionForPresentation", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {questionOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                   {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Response to Question */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Response to the Question
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="responseToQuestion"
              options={responseOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("responseToQuestion");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = responseOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select response option"
              isOpen={openDropdowns.responseToQuestion || false}
              onToggle={() => onToggleDropdown("responseToQuestion")}
              onSelect={(value) => {
                const option = responseOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("responseToQuestion", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {responseOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                   {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invocation */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Invocation (Opening Prayer)
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="invocation"
              options={invocationOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("invocation");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = invocationOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select invocation option"
              isOpen={openDropdowns.invocation || false}
              onToggle={() => onToggleDropdown("invocation")}
              onSelect={(value) => {
                const option = invocationOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("invocation", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {invocationOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                   {option.label}
                </button>
              ))}
            </div>
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
                      ...greetingOptions,
                      ...presentationOptions,
                      ...questionOptions,
                      ...responseOptions,
                      ...invocationOptions,
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

                    // Check which option type this is
                    if (
                      greetingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        greetingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      presentationOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        presentationOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      questionOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        questionOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      responseOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        responseOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      invocationOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        invocationOptions,
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
                    // Determine which field this option belongs to
                    if (
                      greetingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("greetingSpeech", selectedModal);
                    } else if (
                      presentationOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("presentationOfBride", selectedModal);
                    } else if (
                      questionOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("questionForPresentation", selectedModal);
                    } else if (
                      responseOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("responseToQuestion", selectedModal);
                    } else if (
                      invocationOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("invocation", selectedModal);
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

export default GreetingsStep;
