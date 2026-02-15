import { PiCheckLight } from "react-icons/pi";
import { PiFlowerTulipBold } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";

interface BookingPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}
const BookingPackage = () => {
  const bookingPackage = [
    {
      id: "1",
      name: "Vow Renewal Ceremony",
      price: 300,
      description: "Standard ceremony for vow renewal",
      features: [
        "Standard ceremony for Vow Renewal",
        "Performing Ceremony",
        "Includes travel to venue within 50 mile radius",
      ],
    },
    {
      id: "2",
      name: "Standard Wedding Ceremony",
      price: 300,
      description: "Standard Wedding Ceremony with no customization",
      features: [
        "Standard Wedding Ceremony (no customization)",
        "Performing Ceremony",
        "Includes travel to venue within 50 mile radius",
        "Filing of Marriage License",
      ],
    },
    {
      id: "3",
      name: "Customized Wedding Ceremony",
      price: 400,
      description: "Personalized Wedding Ceremony",
      features: [
        "Personalized Wedding Ceremony",
        "Performing Ceremony",
        "Includes travel to venue within 50 mile radius",
        "Filing of Marriage License",
      ],
    },
    {
      id: "4",
      name: "Ceremony Creation",
      price: 100,
      description: "Ceremony creation package including editing & templates",
      features: [
        "Access to Ceremony Creation Tool",
        "Feedback and editing of Ceremony",
        "Access to online library & templates",
        "Access to completed ceremony in printable format",
      ],
    },
    {
      id: "5",
      name: "Wedding Officiant Coaching Services",
      price: 350,
      description: "Coaching and preparation for the officiant",
      features: [
        "Prepare the Officiant of your choosing",
        "Assist Officiant in obtaining credentials",
        "Assist couple & Officiant in creating ceremony",
        "Train Officiant on procedures for filing license",
      ],
    },
    {
      id: "6",
      name: "Wedding Rehearsal",
      price: 100,
      description: "Wedding rehearsal facilitation",
      features: [
        "Facilitation of Wedding Rehearsal",
        "Includes travel to venue within 50 mile radius",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5 lg:py-10 w-full">
      {bookingPackage
        .sort((a: any, b: any) => a.price - b.price)
        .map((pkg: BookingPackage, index: number) => (
          <div
            key={pkg.id}
            className="group bg-white border border-[#f5f0d9] hover:border-primary/40 rounded-3xl max-w-sm w-full p-6 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 mx-auto"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Decorative top accent */}
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
              <PiFlowerTulipBold className="text-primary text-sm" />
              <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
              <HiOutlineSparkles className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <h2 className="lg:text-xl text-base md:text-lg font-primary font-bold text-text">
              {pkg.name}
            </h2>
            <p className="text-text text-2xl font-bold py-2.5 font-secondary">
              ${pkg.price}
              <span className="text-xs text-black-web font-normal ml-1">
                Starting price
              </span>
            </p>
            <div className="h-px w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent mb-3" />
            <ul className="list-none py-2 space-y-2">
              {pkg.features.map((feat: string, idx: number) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <PiCheckLight
                    size={22}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />
                  <span className="text-text font-secondary text-sm md:text-base leading-relaxed">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default BookingPackage;
