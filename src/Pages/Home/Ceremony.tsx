import { GoChecklist } from "react-icons/go";
import { HiOutlineDownload } from "react-icons/hi";
import { Link } from "react-router-dom";

const Ceremony = () => {
  const user = false;

  return (
    <div className="xl:px-30 bgp bg-[#f6efd7] md:py-30 py-16 px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 justify-around">
        <div></div>
      <div
        className="absolute lg:left-10 2xl:left-54 xl:left-40 min-h-[603px] items-center justify-center lg:flex hidden"
        id="image-container"
      >
        {/* First Layer */}
        <div className="relative w-[480px] h-[603px] z-30">
          <div className="w-[480px] border-2 top-0 left-0 border-black h-[603px] absolute z-40"></div>
          <div className="w-[480px] border-2 -top-10 left-10 border-amber-500 h-[603px] absolute z-40"></div>
          <img
            src="/wedding.jpg"
            alt=""
            className="w-[480px] h-[603px] object-cover -top-5 left-5 absolute z-50"
          />
        </div>
       
        <div className="absolute top-80 left-44 w-[480px] h-[603px] pointer-events-none">
          <div className="w-[350px] border-2 top-0 left-0 border-black h-[435px] absolute z-20"></div>
          <div className="w-[350px] border-2 -top-10 left-10 border-amber-500 h-[435px] absolute z-20"></div>
          {/* Image above all */}
          <img
            src="/bride.png"
            alt=""
            className="w-[350px] h-[435px] object-cover -top-5 left-5 absolute z-60"
          />
        </div>
      </div>
      <div className=" px-0 lg:px-20 xl:px-0 flex flex-col items-start gap-6">
        <img src="/flower.png" alt="flower" className=" size-20" />
        <h1 className="font-primary font-bold text-3xl lg:text-[55px]">
          Create Your Dream <br />{" "}
          <span className="text-primary">Wedding Ceremony</span>
        </h1>
        <p className=" text-xl text-start font-normal font-secondary text-black-web">
          Start building your ceremony with personalized options and make it
          unforgettable
        </p>

        <div className=" flex items-center flex-col gap-6 mx-auto justify-center">
          <div className=" flex md:flex-row flex-col items-center lg:flex-wrap xl:flex-nowrap justify-center gap-10 ">
            <div className=" p-1 border rounded-md w-44 ">
              <div className="bg-[#e9d69a] text-text py-7 ">
                <img
                  src="/weddingGate.png"
                  alt="weddingGate"
                  className="mx-auto size-[59px]"
                />
              </div>
              <p className="text-center text-[10px] py-6 uppercase">
                Choose your ceremony type and details
              </p>
            </div>
            <div className=" p-1 border rounded-md w-44 ">
              <div className="bg-[#e9d69a] text-text py-7 ">
                <img
                  src="/music.png"
                  alt="music"
                  className="mx-auto size-[59px]"
                />
              </div>
              <p className="text-center text-[10px] py-6 uppercase">
                Customize your vows, music, and rituals
              </p>
            </div>
            <div className=" p-1 border rounded-md w-44 ">
              <div className="bg-[#e9d69a] text-text py-7 ">
                <img
                  src="/envelop.png"
                  alt="envelop"
                  className="mx-auto size-[59px]"
                />
              </div>
              <p className="text-center text-[10px] py-6 uppercase">
                Save progress, review, and finalize your ceremony
              </p>
            </div>
          </div>
          <div className=" flex items-center md:flex-row flex-col justify-center gap-10 ">
            <div className=" p-1 border rounded-md w-44 ">
              <div className="bg-[#e9d69a] text-text py-7 ">
                <GoChecklist size={59} className=" mx-auto " />
              </div>
              <p className="text-center text-[10px] py-6 uppercase">
                Get Approved by Your <br /> Officiant
              </p>
            </div>
            <div className=" p-1 border rounded-md w-44 ">
              <div className="bg-[#e9d69a] text-text py-7 ">
                <HiOutlineDownload size={59} className=" mx-auto " />
              </div>
              <p className="text-center text-[10px] py-6 uppercase">
                Download your ceremony document when finalized
              </p>
            </div>
          </div>
          {buttons()}
        </div>
        
      </div>
    </div>
  );
};

const buttons=()=>{
  const user=false
  return (
    <div className="flex items-center md:flex-row flex-col  gap-4">
      <button className="bg-primary text-white py-2 px-4 rounded-xl text-lg font-semibold font-secondary">
        Start Planning
      </button>
      {!user ? (
        <Link
          to={"/signup"}
          className="bg-transparent border border-black text-black-web  py-2 px-4 rounded-xl text-lg font-semibold font-secondary"
        >
          Create Free Account
        </Link>
      ) : (
        <Link
          to={"/officiants"}
          className="bg-transparent border border-black text-black-web  py-2 px-4 rounded-xl text-lg font-semibold font-secondary"
        >
          Contact Officiants
        </Link>
      )}
    </div>
  );
}

export  { buttons , Ceremony};
