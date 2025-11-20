import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import { useAxios } from "../../Component/Providers/useAxios";
import { useAuth } from "../../Component/Providers/AuthProvider";
import GlassSwal from "../../utils/glassSwal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";
import Logo from "../../Component/DashNav/Logo";

type LoginInputs = {
  email: string;
  password: string;
};

type ForgotPasswordInputs = {
  Forgot_email: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Main login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: loginReset,
    formState: { errors: loginErrors },
  } = useForm<LoginInputs>();

  // Forgot password form - separate instance
  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    reset: forgotReset,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordInputs>();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  console.log("Login from:", from);
  const navigate = useNavigate();
  const axios = useAxios();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLoginSubmit = async (data: LoginInputs) => {
    console.log("=== LOGIN FORM SUBMISSION STARTED ===");
    console.log("Login Data:", data);

    setIsLoading(true);

    try {
      const response = await axios.post("/users/login", {
        email: data.email,
        password: data.password,
      });
      console.log("Login Response:", response.data);
      login(response.data);
      navigate(from, { replace: true });
      GlassSwal.fire({
        icon: "success",
        title: "Login Successful",
      });
      loginReset();
    } catch (error: any) {
      console.error("Login Error:", error);
      GlassSwal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.msg || "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =============== forgot password logic =================
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleEmailSubmit = async (data: ForgotPasswordInputs) => {
    console.log("=== FORGOT PASSWORD FORM SUBMISSION STARTED ===");
    console.log("Forgot Password Email:", data.Forgot_email);

    setForgotLoading(true);

    try {
      const response = await axios.post("/users/forget", {
        email: data.Forgot_email,
      });
      console.log("Forgot Password Response:", response.data);
      setStatus("success");
      forgotReset();
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      setStatus("error");
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset modal state when opening
  const handleModalOpen = () => {
    setStatus("idle");
    forgotReset();
    (document.getElementById("my_modal_3") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="grid lg:grid-cols-3 text-black  min-h-screen md:px-0 px-5 ">
      <div className="bg-primary lg:flex items-center justify-center w-full  hidden">
        <Logo />
      </div>
      <div className="bg-white col-span-2 flex items-center justify-center h-full">
        <div className=" md:min-w-2xl ">
          <h1 className="lg:text-[55px] text-4xl font-primary text-center font-semibold">
            Sign in / Login
          </h1>

          <SocialLogin />
          <form
            onSubmit={handleLoginSubmit(onLoginSubmit)}
            className="flex flex-col gap-4 max-w-lg mx-auto "
          >
            <div>
              <input
                type="email"
                placeholder="Email"
                className="border-b focus:outline-none border-b-[#c4c4c4]  px-4 py-2 w-full"
                {...loginRegister("email", { required: "Email is required" })}
              />
              {loginErrors.email && (
                <span className="text-red-500 text-sm">
                  {loginErrors.email.message}
                </span>
              )}
            </div>

            <div>
              <div className="relative border-b border-b-[#c4c4c4]  px-4 py-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full focus:outline-none"
                  {...loginRegister("password", {
                    required: "Password is required",
                  })}
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
              {loginErrors.password && (
                <span className="text-red-500 text-sm">
                  {loginErrors.password.message}
                </span>
              )}
            </div>

            <div
              onClick={handleModalOpen}
              className="text-right cursor-pointer"
            >
              <p className="text-sm text-primary underline">Forgot Password?</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary font-secondary cursor-pointer font-bold mx-auto text-white rounded-xl px-5 mt-8 md:mt-18 py-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className=" text-center text-xl font-normal mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-white rounded-2xl shadow-2xl p-8 relative max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle absolute right-2 top-2 bg-orange-100 text-orange-600 hover:bg-orange-200">
              ✕
            </button>
          </form>

          {status === "idle" ? (
            <h3 className="text-2xl font-bold text-orange-600 mb-4 text-center">
              Enter your Mail to reset password
            </h3>
          ) : status === "success" ? (
            <h3 className="text-2xl font-bold text-orange-600 mb-4 text-center">
              Mail Sent Successfully
            </h3>
          ) : (
            <h3 className="text-2xl font-bold text-orange-600 mb-4 text-center">
              Mail Sending Failed
            </h3>
          )}

          {status === "idle" && (
            <form
              onSubmit={handleForgotSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...forgotRegister("Forgot_email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  className="w-full border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl px-4 py-2 text-gray-800 outline-none transition-all"
                />
                {forgotErrors.Forgot_email && (
                  <span className="text-red-500 text-sm block mt-1">
                    {forgotErrors.Forgot_email.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-gradient-to-r cursor-pointer from-orange-400 to-orange-500 text-white font-semibold py-2 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50"
              >
                {forgotLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center space-y-3 py-6">
              <IoMdCheckmarkCircleOutline
                size={60}
                className="text-green-500"
              />
              <p className="text-lg font-medium text-gray-700">
                A mail sent successfully! Check your inbox to reset your
                password.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center text-center space-y-3 py-6">
              <RiCloseCircleLine size={60} className="text-red-500" />
              <p className="text-lg font-medium text-gray-700">
                Oops! Something went wrong. Please try again.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Login;
