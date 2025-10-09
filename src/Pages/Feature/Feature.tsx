import { Buttons } from "../Home/Ceremony";
import ContactForm from "../Home/ContactForm";
import { useEffect, useState } from "react";

const Feature = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<'pennsylvania' | 'ohio' | 'newyork' | null>(null);

  const marriageLicenseData = {
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
            "License Validity: Once issued, the license is valid for 60 days and can be used for a ceremony anywhere within Pennsylvania. It is not valid outside of the state."
          ]
        },
        {
          title: "Finding a Place to Apply",
          content: [
            "To find the office closest to you, you will need to search for the specific county's website. The official office that issues marriage licenses is the Clerk of the Orphans' Court or the Register of Wills for that county.",
            "Use a search engine to find the official website for any Pennsylvania county.",
            "On the county's website, look for a 'Government' or 'Departments' section.",
            "Find and navigate to the 'Clerk of the Orphans' Court' or 'Register of Wills' page. This is where you will find specific information on their marriage license application process, including hours, fees, and any pre-application forms.",
            "Since the fee varies by county, it is a good idea to check their website or call ahead to confirm the exact amount and accepted forms of payment (some may be cash only)."
          ]
        }
      ]
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
            "License Validity: The license is valid for 60 days from the date of issuance and can be used for a ceremony anywhere within Ohio."
          ]
        },
        {
          title: "Finding a Place to Apply",
          content: [
            "To find the correct office, you need to search for the Probate Court in the specific county where you plan to apply.",
            "Use a search engine to find the official website for an Ohio county.",
            "On the county's website, look for the 'Probate Court' department. This is the office that issues marriage licenses.",
            "On that page, you will find specific information regarding their marriage license process, including office hours, any online pre-application forms, required documents, and the current fee.",
            "Fees can range, but they are typically between $45 and $75. It is a good practice to confirm the exact cost and payment methods (cash, credit card, etc.) with the court before you visit."
          ]
        }
      ]
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
            "Cost: The fee for a marriage license is typically $40 outside of New York City. The cost for a New York City marriage license is $35. Fees may be paid with cash, check, or credit/debit card, depending on the office."
          ]
        },
        {
          title: "Finding a Place to Apply",
          content: [
            "To find the correct office, you should contact the Town or City Clerk in the location where you want to apply.",
            "For New York City: You can find specific instructions, including online application options and scheduling appointments, on the NYC City Clerk's official website.",
            "For the rest of New York State: Use a search engine to find the official website for the Town or City Hall in the area you wish to apply. On their website, navigate to the 'City Clerk' or 'Town Clerk' department. That page will have details about their specific marriage license application process, including office hours and any unique local requirements."
          ]
        }
      ]
    }
  };

  const openModal = (state: 'pennsylvania' | 'ohio' | 'newyork') => {
    setSelectedState(state);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedState(null);
  };

 useEffect(() => {
window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    
}, []);



  return (
    <div className="pt-24 md:pt-30 text-black">
      <h1 className="text-2xl sm:text-3xl font-bold md:text-[55px] px-5 pt-5 md:pt-20 font-primary text-center mb-16">
        Make It
        <span className="text-primary">Yours </span>
      </h1>

      {/* First Feature */}
      <div className="flex  items-center justify-around px-8 gap-12">
        <div className="flex flex-col items-center justify-around lg:flex-row gap-12">
          {/* Left side - Content */}
          <div className="flex-1 max-w-lg">
            <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-12 relative">
              {/* Service icon */}
              <div className="mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                Stress-Free Ceremony Planning 💍
              </h2>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                With Erie Wedding Officiants, every moment of your ceremony is
                personalized to reflect your unique love story and personality.
                Your love, our guidance.
              </p>
              <button className="bg-primary group hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                Book for consult
                <svg
                  className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Right side - Image collage */}
          <div className="flex-1 relative pb-10">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Top left - Wedding rings */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding rings"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top right - Happy couple */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=faces"
                  alt="Happy wedding couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom left - Wedding party */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding party celebration"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom right - Table setting */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 mt-4">
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop&crop=center"
                  alt="Elegant table setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Feature */}
      <div className="flex items-center justify-around lg:flex-row px-8 gap-12">
        <div className="flex flex-col items-center justify-around lg:flex-row  gap-12">
          {/* Left side - Content */}
          <div className="flex-1 relative pb-10 lg:block hidden">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Top left - Wedding rings */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding rings"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top right - Happy couple */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=faces"
                  alt="Happy wedding couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom left - Wedding party */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding party celebration"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom right - Table setting */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 mt-4">
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop&crop=center"
                  alt="Elegant table setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-12 relative">
              {/* Service icon */}
              <div className="mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                Seamless Collaboration 📜
              </h2>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                With Erie Wedding Officiants, every moment of your ceremony is
                personalized to reflect your unique love story and personality.
                Your love, our guidance.
              </p>
              <button className="bg-primary group hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                Book for consult
                <svg
                  className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Right side - Image collage */}
          <div className="flex-1 relative pb-10">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Top left - Wedding rings */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding rings"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top right - Happy couple */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=faces"
                  alt="Happy wedding couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom left - Wedding party */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding party celebration"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom right - Table setting */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 mt-4">
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop&crop=center"
                  alt="Elegant table setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Feature */}
      <div className="flex items-center justify-around lg:flex-row px-8 gap-12">
        <div className="flex flex-col items-center justify-around lg:flex-row  gap-12">
          {/* Left side - Content */}
          <div className="flex-1 max-w-lg ">
            <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-12 relative">
              {/* Service icon */}
              <div className="mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                Organized & Accessible 🔔
              </h2>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                Your love story is unique, and your ceremony should be too. Our
                experienced officiants work closely with you to craft a ceremony
                that truly represents your journey together, ensuring every
                detail is perfect.
              </p>
              <button className="bg-primary group hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                Book for consult
                <svg
                  className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Right side - Image collage */}
          <div className="flex-1 relative pb-10">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Top left - Wedding rings */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding rings"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top right - Happy couple */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=faces"
                  alt="Happy wedding couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom left - Wedding party */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop&crop=center"
                  alt="Wedding party celebration"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom right - Table setting */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 mt-4">
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop&crop=center"
                  alt="Elegant table setting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto my-10 px-6 py-8 bg-gradient-to-r from-white via-pink-50 to-white  text-center">
        <h3 className="text-xl md:text-3xl lg:text-4xl xl:text-6xl font-semibold mb-4 font-primary">
          Personalized Ceremonies Tailored to Your Love Story
        </h3>

        <p className=" md:text-xl text-gray-700 leading-relaxed mb-4">
          With years of experience, we specialize in creating
          <span className="text-primary font-semibold">
            {" "}
            personalized wedding ceremonies{" "}
          </span>
          that reflect your <span className="italic">unique love story</span>.
          Whether you prefer a<span className="font-medium"> traditional </span>{" "}
          or <span className="font-medium">modern</span> ceremony, we are here
          to make your special day unforgettable.
        </p>

        <p className="text-lg md:text-xl md:text- text-gray-600 mb-6">
          We understand the importance of finding the right officiant to
          officiate your wedding, and we are dedicated to ensuring that your
          ceremony is exactly how you envision it.
        </p>
        <p className="text-lg pb-6 md:-base text-gray-700 mr-2">
          Guidance on marriage licenses:
        </p>
        <div className="inline-flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <button
            onClick={() => openModal("pennsylvania")}
            className="px-3 py-1 rounded-lg bg-primary text-white text-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
          >
            Pennsylvania
          </button>
          <button
            onClick={() => openModal("ohio")}
            className="px-3 py-1 rounded-lg bg-primary/90 text-white text-lg font-semibold hover:bg-primary transition-colors duration-200"
          >
            Ohio
          </button>
          <button
            onClick={() => openModal("newyork")}
            className="px-3 py-1 rounded-lg bg-primary/80 text-white text-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
          >
            New York
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row  md:justify-between items-center md:items-start gap-4 my-10 px-5 md:px-10 lg:px-20">
        <div className=" text-start flex flex-col justify-start gap-4">
          <h1 className=" text-3xl lg:text-[55px] font-primary text-black font-bold">
            Start Building <span className="text-primary">Your Ceremony</span>{" "}
          </h1>
          <p className=" text-xl font-secondary text-text font-normal ">
            Join us today and create the wedding ceremony you've always dreamed
            of with ease.
          </p>{" "}
          <Buttons />
        </div>
        <img src="/shake.jpg" alt="" className="md:w-1/3 rounded-md" />
      </div>
      <ContactForm />

      {/* Modal */}
      {isModalOpen && selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/90 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold font-primary">
                {marriageLicenseData[selectedState].title}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 group"
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
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

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-8">
                {marriageLicenseData[selectedState].sections.map(
                  (section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 shadow-sm border border-pink-100"
                    >
                      <h3 className="text-xl md:text-2xl font-bold font-primary text-gray-800 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {sectionIndex + 1}
                        </div>
                        {section.title}
                      </h3>
                      <div className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700 leading-relaxed font-secondary">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Important Notice */}
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-amber-800 font-primary">
                      Important Notice
                    </h4>
                    <p className="text-amber-700 font-secondary">
                      Requirements and procedures may vary by county. Always
                      verify current information and requirements with the local
                      office before applying for your marriage license.
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={closeModal}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold font-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feature