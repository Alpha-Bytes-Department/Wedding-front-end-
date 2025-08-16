import { Ceremony,buttons } from "./Ceremony"
import ClientReview from "./ClientReview"
import Header from "./Header"
import Officiant from "./Officiant"
import Slider from "./Slider"


const Home = () => {
  return (
    <div className=" ">
      <Header />
      <Slider />
      <Officiant />
      <Ceremony />
      <ClientReview />
      <div className="flex flex-col md:flex-row  md:justify-between items-center md:items-start gap-4 my-10 px-5 md:px-10 lg:px-20">
        <div className=" text-start flex flex-col justify-start gap-4">
          <h1 className=" text-3xl lg:text-[55px] font-primary text-black font-bold">
          Start Building <span className="text-primary">Your Ceremony</span>{" "}
          </h1>
          <p className=" text-xl font-secondary text-text font-normal ">
            Join us today and create the wedding ceremony you've always dreamed
            of with ease.
          </p> {buttons()}
        </div>
        <img src="/shake.jpg" alt="" className="md:w-1/3 rounded-lg" />

      </div>
    </div>
  );
}

export default Home