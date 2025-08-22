import { buttons } from "./Ceremony";

const Header = () => {
  

  return (
    <div
      className="h-[100vh] bg-no-repeat bg-center bg-cover sm:px-16 px-5 py-5 sm:py-13 font-inter text-white relative"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className=" font-primary font-medium md:text-4xl text-3xl lg:text-6xl text-center text-black">
          Design Your Dream Ceremony, <br className="" /> Together.
        </h1>
        <p className="lg:text-xl text-sm md:text-[16px] text-center text-black font-secondary font-normal py-13">
          Welcome to a modern platform where couples and officiants{" "}
          <br className="md:block hidden" /> unite to create unforgettable
          wedding ceremonies. Plan, <br className="md:block hidden" /> approve,
          and perfect every detail with ease and joy.
        </p>
        {buttons()}
      </div>

      <div
        className="absolute left-0 -bottom-[1px] w-full overflow-hidden pointer-events-none"
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
