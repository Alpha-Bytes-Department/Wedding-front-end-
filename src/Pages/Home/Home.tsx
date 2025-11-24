import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Slider from "./Slider";

// Lazy load below-the-fold components
const Officiant = lazy(() => import("./Officiant"));
const Ceremony = lazy(() =>
  import("./Ceremony").then((module) => ({ default: module.Ceremony }))
);
const Buttons = lazy(() =>
  import("./Ceremony").then((module) => ({ default: module.Buttons }))
);
const ClientReview = lazy(() => import("./ClientReview"));
const ContactForm = lazy(() => import("./ContactForm"));

// Lightweight loading fallback
const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

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
    } else {
      // Scroll to top if no hash
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <div className="text-black ">
      <Header />
      <Slider />
      <Suspense fallback={<SectionLoader />}>
        <Officiant />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Ceremony />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ClientReview />
      </Suspense>
      <div className="flex flex-col md:flex-row  md:justify-between items-center md:items-start gap-4 my-10 px-5 md:px-10 lg:px-20">
        <div className=" text-start flex flex-col justify-start gap-4">
          <h1 className=" text-3xl lg:text-[55px] font-primary text-black font-bold">
            Start Building <span className="text-primary">Your Ceremony</span>{" "}
          </h1>
          <p className=" text-xl font-secondary text-text font-normal ">
            Join us today and create the wedding ceremony you've always dreamed
            of with ease.
          </p>{" "}
          <Suspense
            fallback={
              <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-full"></div>
            }
          >
            <Buttons />
          </Suspense>
        </div>
        <img
          src="/shake.jpg"
          alt=""
          className="md:w-1/3 rounded-md"
          loading="lazy"
        />
      </div>
      <Suspense fallback={<SectionLoader />}>
        <ContactForm />
      </Suspense>
    </div>
  );
};

export default Home;
