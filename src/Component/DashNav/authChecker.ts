import { useNavigate } from "react-router-dom";
import GlassSwal from "../../utils/glassSwal";
import { useAuth } from "../Providers/AuthProvider";
import { useEffect } from "react";

const authChecker = () => {
  const { user } = useAuth();
    const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      GlassSwal.info("Already Logged In", "You are already logged in!").then(
        () => {
          navigate("/");
        }
      );
    }
  }, [user, navigate]);
}

  export default authChecker;