import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../Login/SocialLogin";
import { useAxios } from "../../Component/Providers/useAxios";
import { GlassSwal } from "../../utils/glassSwal";
import Logo from "../../Component/DashNav/Logo";

type Inputs = {
  email: string;
  password: string;
  partner_1: string;
  partner_2: string;
};

const Signup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const axios = useAxios();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    // Safe console log
    console.log("Signup Data:", {
      email: data.email,
      password: data.password,
      partner_1: data.partner_1,
      partner_2: data.partner_2,
    });
    setLoading(true);

    try {
      const response = await axios.post("/users/register", data);
      console.log("Signup Response:", response);

      if (response?.status === 201 || response?.status === 200) {
        await GlassSwal.success(
          "Registration Successful!",
          response?.data?.msg ||
            "Registration successful! Please check your email to verify."
        );
        navigate("/login");
      } else {
        await GlassSwal.error(
          "Signup Failed",
          response?.data?.msg ?? "Failed to create account. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "An error occurred during registration. Please try again.";
      await GlassSwal.error("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid lg:grid-cols-3 text-black min-h-screen md:px-0 px-5 ">
      <div className="bg-primary lg:flex items-center justify-center w-full  hidden">
        <Logo />
      </div>
      <div className="bg-white col-span-2 flex items-center justify-center h-full">
        <div className=" md:min-w-2xl ">
          <h1 className="lg:text-[55px] text-4xl font-primary text-center font-semibold">
            Create Account
          </h1>
          <SocialLogin />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-lg mx-auto "
          >
            <input
              type="text"
              placeholder="Partner 1 Name"
              className="border-b focus:outline-none border-b-[#c4c4c4]  px-4 py-2"
              {...register("partner_1", { required: true })}
            />
            <input
              type="text"
              placeholder="Partner 2 Name"
              className="border-b focus:outline-none border-b-[#c4c4c4]  px-4 py-2"
              {...register("partner_2", { required: true })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border-b focus:outline-none border-b-[#c4c4c4]  px-4 py-2"
              {...register("email", { required: true })}
            />
            <div className="relative border-b border-b-[#c4c4c4]  px-4 py-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full focus:outline-none"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2  transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.362-2.362A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary font-secondary font-bold mx-auto text-white rounded-xl px-5 mt-8 md:mt-18 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className=" text-center text-xl font-normal mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
