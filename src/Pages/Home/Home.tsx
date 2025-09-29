import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Ceremony, Buttons } from "./Ceremony";
import ClientReview from "./ClientReview";
import ContactForm from "./ContactForm";
import Header from "./Header";
import Officiant from "./Officiant";
import Slider from "./Slider";

const Home = () => {
  const location = useLocation();

  // Handle scrolling when navigating to home with hash
  useEffect(() => {
    if (location.hash === "#client-review") {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const element = document.getElementById("client-review");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300); // Slightly longer delay for components to fully render
    }
  }, [location]);
  return (
    <div className="text-black ">
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
          </p>{" "}
          <Buttons />
        </div>
        <img src="/shake.jpg" alt="" className="md:w-1/3 rounded-md" />
      </div>
      <ContactForm />
    </div>
  );
};

export default Home;
