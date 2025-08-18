import { FaArrowRight } from "react-icons/fa6";
import ContactForm from "../../Home/ContactForm";
import { useNavigate } from "react-router-dom";

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
     const navigate=useNavigate()
    const NavigateToDetail = (officiantId: number): void => {
       navigate(`/officiant/${officiantId}`);
    }

  return (
    <div className="pt-24 md:pt-30">
      <img
        src="/flower.png"
        alt=""
        className=" size-16 mx-5 lg:mx-20 md:mt-10 lg:mt-20"
      />
      <div className=" flex text-center gap-6 lg:text-start flex-col lg:flex-row  justify-between px-5 md:px-10 lg:px-20">
        <h1 className=" text-2xl md:text-3xl lg:text-[55px] text-black font-primary font-bold">
          Meet Our Officiants for Perfect{" "}
          <span className=" text-primary">Ceremony Guide </span>{" "}
        </h1>
        <p className=" text-base md:text-lg lg:text-xl text-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas,
          culpa modi ab fugiat sint reprehenderit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-5 md:px-10 lg:px-20 xl:gap-14 mt-8 mb-10 lg:mb-20 justify-between">
        {officiants.map((officiant) => (
          <div
            key={officiant.id}
            className="bg-white p-2 group rounded-2xl shadow-xl shadow-[#00000040] border-2 max-w-80 border-primary mx-auto flex flex-col h-full"
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

            <div onClick={() => NavigateToDetail(officiant.id)} className="mt-auto text-primary cursor-pointer flex items-center justify-center gap-2 font-secondary font-bold text-[16px] underline">
              VIEW MORE{" "}
              <FaArrowRight
                size={18}
                className="group-hover:translate-x-3 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>
      <ContactForm />
    </div>
  );
};

export default Officiant;
