import { FcGoogle } from 'react-icons/fc'
import { MdOutlineFacebook } from 'react-icons/md'

const SocialLogin = () => {
  return (
    <div className=" flex md:flex-row flex-col py-18 justify-center gap-6 md:gap-14">
                <div className="flex items-center gap-2 text-black-web rounded-xl border border-[#c4c4c4] px-4 py-1">
                  <FcGoogle size={30} className="md:size-[45px] size-[30px]" />
                  <p className="text-xl font-secondary ">Sign in with Google</p>
                </div>
                <div className="flex items-center gap-2 text-black-web rounded-xl border border-[#c4c4c4] px-4 py-1">
                  <MdOutlineFacebook
                    size={30}
                    className="md:size-[45px] size-[30px] text-[#3b579d]"
                  />
                  <p className="md:text-xl text-lg font-secondary ">
                    Sign in with Facebook
                  </p>
                </div>
              </div>
  )
}

export default SocialLogin