import { Link } from "react-router-dom";

const Header = () => {
  // const scrollToPricing = () => {
  //   const pricingElement = document.getElementById('pricing');
  //   if (pricingElement) {
  //     pricingElement.scrollIntoView({ 
  //       behavior: 'smooth',
  //       block: 'start'
  //     });
  //   }
  // };

  return (
    <div
      className="h-[100vh] bg-no-repeat bg-center bg-cover sm:px-16 px-5 py-5 sm:py-13 font-inter text-white relative"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className=" font-primary font-medium text-6xl text-center text-black">
          Design Your Dream Ceremony, <br /> Together.
        </h1>
        <p className="text-xl text-center text-black font-secondary font-normal py-13">
          Welcome to a modern platform where couples and officiants <br /> unite to
          create unforgettable wedding ceremonies. Plan, <br /> approve, and perfect
          every detail with ease and joy.
        </p>
        <div className="flex space-x-4">
          <button className="bg-primary text-white py-2 px-4 rounded-xl text-lg font-semibold font-secondary">
            Start Planning
          </button>
          <Link to={'/signup'} className="bg-transparent border border-primary text-primary py-2 px-4 rounded-xl text-lg font-semibold font-secondary">
           Create Free Account
          </Link>
        </div>
      </div>



      <div
        className="absolute left-0 bottom-0 w-full overflow-hidden pointer-events-none"
        style={{ height: "150px" }}
      >
        <svg
          viewBox="0 0 100 20"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            d="M0,20 Q50,0 100,20 L100,20 L0,20 Z"
            fill="rgba(255,255,255,1)"
          />
        </svg>
      </div>
    </div>
  );
};

export default Header;
