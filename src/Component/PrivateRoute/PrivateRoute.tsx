import { useAuth } from '../Providers/AuthProvider'
import { type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlassSwal from '../../utils/glassSwal';
import { InfinitySpin  } from "react-loader-spinner";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {loading,user}=useAuth()
    if(loading){
        return (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className=' border-8  p-10 rounded-full size-60 flex items-center justify-center border-[#d4af3728]'>
                <InfinitySpin
                  visible={true}                  
                  color="#D4AF37"
                  ariaLabel="infinity-spin-loading"
                />
            </div>
          </div>
        );
    }
    if(!user){
       GlassSwal.error("Unauthorized","You need to login to access this page").then(()=>{
        navigate("/login",{state:{from:location.pathname},replace:true});
       });
    }

  return children;
}
