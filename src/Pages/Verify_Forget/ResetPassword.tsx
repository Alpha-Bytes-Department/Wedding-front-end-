import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useAxios } from "../../Component/Providers/AxiosProvider";
import { GlassSwal } from "../../utils/glassSwal";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { token } = useParams();
  const axios = useAxios();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      GlassSwal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Please try again."
      });
      return;
    }

    if (!token) {
      GlassSwal.fire({
        icon: "error",
        title: "Invalid Token",
        text: "Reset token is missing or invalid."
      });
      return;
    }

    setIsLoading(true);
    console.log("Submitting new password with token:", token);
    console.log("New Password:", data.newPassword);
    console.log("Confirm Password:", data.confirmPassword);
    try {
      const response = await axios.post(`/users/reset-password/${token}`, {
        password: data.newPassword,
      });
      console.log(response.data)

      GlassSwal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "Your password has been reset successfully. You can now login with your new password.",
      }).then(() => {
        navigate("/login");
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      GlassSwal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

//   ===================validating password=====================
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-amber-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <FaLock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-primary font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-secondary">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("newPassword", {
                    required: "New password is required",
                    validate: validatePassword,
                  })}
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li
                  className={`flex items-center ${
                    newPassword?.length >= 8 ? "text-green-600" : ""
                  }`}
                >
                  <span className="mr-2">
                    {newPassword?.length >= 8 ? "✓" : "•"}
                  </span>
                  At least 8 characters long
                </li>
                <li
                  className={`flex items-center ${
                    /(?=.*[a-z])/.test(newPassword || "")
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  <span className="mr-2">
                    {/(?=.*[a-z])/.test(newPassword || "") ? "✓" : "•"}
                  </span>
                  One lowercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /(?=.*[A-Z])/.test(newPassword || "")
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  <span className="mr-2">
                    {/(?=.*[A-Z])/.test(newPassword || "") ? "✓" : "•"}
                  </span>
                  One uppercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /(?=.*\d)/.test(newPassword || "") ? "text-green-600" : ""
                  }`}
                >
                  <span className="mr-2">
                    {/(?=.*\d)/.test(newPassword || "") ? "✓" : "•"}
                  </span>
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-primary hover:text-amber-600 font-medium transition-colors duration-200"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Wedding Planner. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
