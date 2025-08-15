import { FaArrowRight } from 'react-icons/fa6';

const Officiant = () => {

    const officiants = [
      {
        id: 1,
        name: "John Doe",
        role: "Romantic Garden Wedding Specialist",
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/052/239/819/small/smiling-young-man-in-suit-with-beard-professional-and-confident-isolated-on-a-transparent-background-png.png",
        description:
          "John is a licensed officiant with over 10 years of experience.",
      },
      {
        id: 4,
        name: "John Doe",
        role: "Culinary Wedding Specialist",
        image:
          "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-smart-business-man-png-image_10275559.png",
        description:
          "John is a licensed officiant with over 10 years of experience.",
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Beach Wedding Specialist",
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/052/239/819/small/smiling-young-man-in-suit-with-beard-professional-and-confident-isolated-on-a-transparent-background-png.png",
        description: "Jane is known for her warm and personalized ceremonies.",
      },
      {
        id: 3,
        name: "Mike Johnson",
        role: "Mountain Wedding Specialist",
        image:
          "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-smart-business-man-png-image_10275559.png",
        description:
          "Mike has a background in counseling and brings a unique perspective to ceremonies.",
      },
    ];

  return (
    <div className=" lg:px-30  px-5 md:px-10">
      <div className=" text-start flex flex-col md:flex-row gap-6 justify-between">
        <h1 className="text-3xl font-primary md:text-[55px]  font-bold">
          Meet Our Officiants for Perfect{" "}
          <span className="text-primary">Ceremony Guide</span>
        </h1>
        <div className=" group">
          <p className="text-xl font-normal  text-black-web text-start font-secondary">
            Our officiants are experienced professionals who are dedicated to
            making your ceremony unforgettable.
          </p>
          <p className="flex items-center gap-3 font-normal font-secondary text-primary">
            SEE MORE{" "}
            <span className=" group-hover:translate-x-5 transition-transform duration-300">
              <FaArrowRight />
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mt-8 mb-10 lg:mb-20 justify-between">
        {officiants.map((officiant) => (
          <div
            key={officiant.id}
            className="bg-white p-2 group rounded-2xl shadow-xl shadow-[#00000040] border-2 max-w-72 border-primary mx-auto flex flex-col h-full"
          >
            <img
              src={officiant.image}
              alt={officiant.name}
              className="w-58 mx-auto"
            />
            <h2 className="text-text font-secondary text-center font-bold text-2xl py-5">
              {officiant.name}
            </h2>
            <p className="text-lg text-center pb-5 text-text">
              {officiant.role}
            </p>
            <p className="pb-8 text-[16px] text-center text-black-web flex-1">
              {officiant.description}
            </p>

            <div className="mt-auto text-primary flex items-center justify-center gap-2 font-secondary font-bold text-[16px] underline">
              Book Now{" "}
              <FaArrowRight
                size={18}
                className="group-hover:translate-x-3 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Officiant