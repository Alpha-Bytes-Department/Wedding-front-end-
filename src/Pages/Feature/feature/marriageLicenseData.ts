export interface MarriageLicenseSection {
  title: string;
  content: string[];
}

export interface MarriageLicenseInfo {
  title: string;
  sections: MarriageLicenseSection[];
}

export type StateName = "pennsylvania" | "ohio" | "newyork";

export const marriageLicenseData: Record<StateName, MarriageLicenseInfo> = {
  pennsylvania: {
    title: "Pennsylvania Marriage License",
    sections: [
      {
        title: "General Requirements and Process",
        content: [
          "In-person Application: Both applicants must be present to apply for the license.",
          "Age and Identification: Both parties must be at least 18 years old and present a valid government-issued photo ID (like a driver's license, passport, or military ID) and proof of their Social Security number (such as the card itself, a W-2, or a pay stub).",
          "Previous Marriages: If either applicant was previously married, you must provide proof that the marriage has been legally ended. This is typically a certified copy of a divorce decree or a death certificate.",
          "Waiting Period: Pennsylvania has a mandatory three-day waiting period from the date of application. You cannot get married until after this period.",
          "License Validity: Once issued, the license is valid for 60 days and can be used for a ceremony anywhere within Pennsylvania. It is not valid outside of the state.",
        ],
      },
      {
        title: "Finding a Place to Apply",
        content: [
          "To find the office closest to you, you will need to search for the specific county's website. The official office that issues marriage licenses is the Clerk of the Orphans' Court or the Register of Wills for that county.",
          "Use a search engine to find the official website for any Pennsylvania county.",
          "On the county's website, look for a 'Government' or 'Departments' section.",
          "Find and navigate to the 'Clerk of the Orphans' Court' or 'Register of Wills' page. This is where you will find specific information on their marriage license application process, including hours, fees, and any pre-application forms.",
          "Since the fee varies by county, it is a good idea to check their website or call ahead to confirm the exact amount and accepted forms of payment (some may be cash only).",
        ],
      },
    ],
  },
  ohio: {
    title: "Ohio Marriage License",
    sections: [
      {
        title: "General Requirements and Process",
        content: [
          "Where to Apply: You must apply in the county where either one of you lives. If neither of you is an Ohio resident, you must apply in the county where the marriage ceremony will take place.",
          "In-Person Appearance: Both applicants must appear in person at the Probate Court.",
          "Identification and Age: You must be 18 years or older. You will need a valid government-issued photo ID (like a driver's license or passport) and proof of your Social Security number (the card, a W-2 form, or a tax return).",
          "Previous Marriages: If either party was previously married, you must provide the date, county, and case number of your most recent divorce, dissolution, or annulment decree. In some counties, you may need a certified copy of the divorce decree or a death certificate if your previous spouse is deceased.",
          "Waiting Period: Unlike Pennsylvania, there is no mandatory waiting period in Ohio. Many counties can issue the license on the same day you apply, as long as you have all the required documents.",
          "License Validity: The license is valid for 60 days from the date of issuance and can be used for a ceremony anywhere within Ohio.",
        ],
      },
      {
        title: "Finding a Place to Apply",
        content: [
          "To find the correct office, you need to search for the Probate Court in the specific county where you plan to apply.",
          "Use a search engine to find the official website for an Ohio county.",
          "On the county's website, look for the 'Probate Court' department. This is the office that issues marriage licenses.",
          "On that page, you will find specific information regarding their marriage license process, including office hours, any online pre-application forms, required documents, and the current fee.",
          "Fees can range, but they are typically between $45 and $75. It is a good practice to confirm the exact cost and payment methods (cash, credit card, etc.) with the court before you visit.",
        ],
      },
    ],
  },
  newyork: {
    title: "New York Marriage License",
    sections: [
      {
        title: "General Requirements and Process",
        content: [
          "Where to Apply: You must apply in person to any Town or City Clerk in New York State. You do not have to be a resident of New York.",
          "In-Person Appearance: Both applicants must be present to apply for the license. A representative cannot apply for the license on your behalf, even with a power of attorney.",
          "Identification and Age: You must be 18 years or older. Both parties are required to present documentary proof of age and identity. This could include a certified copy of a birth certificate, a passport, or a driver's license. It is best to check with the specific clerk's office for what they require.",
          "Previous Marriages: If either party was previously married, you must provide the full name of the former spouse and the date and location of the divorce decree or the death of the spouse. Some offices may require a certified copy of the divorce decree.",
          "Waiting Period: There is a mandatory 24-hour waiting period after you receive the license before your marriage ceremony can be performed. The clock starts from the exact time the license is issued.",
          "License Validity: The license is valid for 60 days from the day after it is issued. It can be used for a ceremony anywhere within New York State but not outside of it.",
          "Cost: The fee for a marriage license is typically $40 outside of New York City. The cost for a New York City marriage license is $35. Fees may be paid with cash, check, or credit/debit card, depending on the office.",
        ],
      },
      {
        title: "Finding a Place to Apply",
        content: [
          "To find the correct office, you should contact the Town or City Clerk in the location where you want to apply.",
          "For New York City: You can find specific instructions, including online application options and scheduling appointments, on the NYC City Clerk's official website.",
          "For the rest of New York State: Use a search engine to find the official website for the Town or City Hall in the area you wish to apply. On their website, navigate to the 'City Clerk' or 'Town Clerk' department. That page will have details about their specific marriage license application process, including office hours and any unique local requirements.",
        ],
      },
    ],
  },
};
