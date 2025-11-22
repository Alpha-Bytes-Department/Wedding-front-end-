import { PiCheckLight } from "react-icons/pi";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5  py-5 lg:py-10">
      {bookingPackage
        .sort((a: any, b: any) => a.price - b.price)
        .map((pkg: BookingPackage) => (
          <div
            key={pkg.id}
            className="border-2 border-primary rounded-2xl max-w-sm w-full p-5"
          >
            <h2 className="lg:text-2xl text-base md:text-lg font-primary font-medium">
              {pkg.name}
            </h2>
            <p className="text-black text-xl font-bold py-2.5">
              ${pkg.price}
              <span className="text-xs text-gray-500">Starting price</span>
            </p>
            <hr className="border border-primary" />
            <ul className="list-disc list-inside py-2">
              {pkg.features.map((feat: string, idx: number) => (
                <li key={idx} className="flex gap-2 items-center pb-2">
                  <PiCheckLight size={30} className="text-primary" />{" "}
                  <span className="text-text font-secondary text:sm md:text-lg">
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
