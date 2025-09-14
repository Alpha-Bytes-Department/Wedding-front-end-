import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useAxios } from "../../Component/Providers/AxiosProvider";
import { GlassSwal } from "../../utils/glassSwal";

export default function VerifyPage() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const axios = useAxios();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      GlassSwal.error(
        "Verification Failed",
        "No verification token found."
      ).then(() => navigate("/"));
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/users/verify/${token}`);
        console.log("Verification Response:", response);
        if (response?.status === 200 ) {
          await GlassSwal.success(
            "Email Verified!",
            response?.data?.message ?? "Your email has been successfully verified."
          );
          navigate("/");
        } else {
          await GlassSwal.error(
            "Verification Failed",
            response?.data?.message ?? "Verification failed."
          );
          navigate("/");
        }
      } catch (err: any) {
        await GlassSwal.error(
          "Something went wrong",
          err?.response?.data?.message ?? "Unable to verify at the moment."
        );
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-amber-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <FaCheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-primary font-bold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-secondary">
            We're verifying your email address
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-8">
          {loading ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Verifying Your Email
                </h3>
                <p className="text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Verification Complete
              </h3>
              <p className="text-gray-600">
                Redirecting you to the homepage...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Wedding Planner. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
