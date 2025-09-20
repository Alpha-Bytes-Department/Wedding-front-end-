import { FaArrowRight, FaUserTie } from 'react-icons/fa6';
import { useAxios } from '../../Component/Providers/useAxios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Officiant = () => {
  const axios = useAxios();
  const [officiants, setOfficiants] = useState<
    Array<{
      id: string | number;
      name: string;
      image: string;
      role: string;
      description: string;
    }>
  >([]);

  // Track which images have failed to load
  const [failedImages, setFailedImages] = useState<Set<string | number>>(
    new Set()
  );

  const fetchOfficiants = useCallback(async () => {
    try {
      const response = await axios.get("/users/officiants");
      console.log("Officiants in home:", response.data);
      const objectarray = response?.data?.officiants?.slice(0, 4).map((officiant: any) => ({
        id: officiant._id,
        name: officiant.name,
        image: officiant.profilePicture,
        role: officiant.specialization,
        description: officiant.bio,
      }));
      setOfficiants(objectarray);
    } catch (error) {
      console.error("Error fetching officiants:", error);
    }
  }, [axios]);

  useEffect(() => {
    fetchOfficiants();
  }, [fetchOfficiants]);

  const navigate = useNavigate();
  const NavigateToDetail = (officiantId: string | number): void => {
    navigate(`/officiant/${officiantId}`);
  };

  const handleImageError = (officiantId: string | number) => {
    setFailedImages((prev) => new Set(prev).add(officiantId));
  };

  const shouldShowImage = (officiant: any) => {
    return officiant.image && !failedImages.has(officiant.id);
  };
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-14 mt-8 mb-10 lg:mb-20 justify-between">
       {officiants?.map((officiant) => (
                 <div
                   key={officiant.id}
                   className="bg-white p-2 group rounded-2xl shadow-xl shadow-[#00000040] border-2 max-w-80 border-primary mx-auto flex flex-col h-full"
                 >
                 
                   <div className="flex h-60 justify-center items-center min-h-[160px]">
                     {shouldShowImage(officiant) ? (
                       <img
                         src={officiant.image}
                         alt={officiant.name}
                         className="w-58 mx-auto"
                         onError={() => handleImageError(officiant.id)}
                       />
                     ) : (
                       <FaUserTie className="text-gray-400 size-36 " />
                     )}
                   </div>
       
                   <h2 className="text-text font-secondary text-center font-bold text-2xl py-5">
                     {officiant.name}
                   </h2>
                   <p className="text-lg text-center pb-5 text-text">
                     {officiant.role}
                   </p>
                   <p className="pb-8 text-[16px] text-center text-black-web flex-1">
                     {officiant.description}
                   </p>
       
                   <div
                     onClick={() => NavigateToDetail(officiant.id)}
                     className="mt-auto text-primary cursor-pointer flex items-center justify-center gap-2 font-secondary font-bold text-[16px] underline"
                   >
                     VIEW MORE{" "}
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