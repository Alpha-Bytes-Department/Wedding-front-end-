import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Signup from "../Pages/SignUp/Signup";
import Layout from "../Layout/Layout";
import Feature from "../Pages/Feature/Feature";
import Officiant from "../Pages/Officiant/Officiant_Home/Officiant";
import OfficiantDetail from "../Pages/Officiant/Officiant_Details/OfficiantDetail";
import DashBoardOutline from "../DashBoardLayout/DashBoardOutline";
import Ceremony from "../Pages/DashBoard/Ceremony/Ceremony";
import DashHome from "../Pages/DashBoard/Home/DashHome";
import Note from "../Pages/DashBoard/Notes/Note";
import Discussions from "../Pages/DashBoard/Discussion/Discussions";
import Schedule from "../Pages/DashBoard/Schedule/Schedule";
import Settings from "../Pages/DashBoard/Settings/Settings";
import Bookings from "../Pages/DashBoard/Bookings/Bookings";
import CeremonyReview from "../Pages/DashBoard/CeremonyReview/CeremonyReview";
import ResetPassword from "../Pages/Verify_Forget/ResetPassword";
import VerifyUser from "../Pages/Verify_Forget/verifyUser";
import { PrivateRoute } from "../Component/PrivateRoute/PrivateRoute";
import Payment from "../Pages/Payment/Payment";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout  />,
    errorElement: <Error  />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/feature",
        element: <Feature />,
      },
      {
        path: "/feature",
        element: <Feature />,
      },
      {
        path: "/officiant",
        element: <Officiant />,
      },
      {
        path: "/officiant/:officiantId",
        element: <OfficiantDetail />,
      },
    ],
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verify/:token",
    element: <VerifyUser />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashBoardOutline /></PrivateRoute>,
    children: [
      {
        path: "/dashboard",
        element: <DashHome />,
      },
      {
        path: "/dashboard/bookings",
        element: <Bookings />,
      },
      {
        path: "/dashboard/review",
        element: <CeremonyReview />,
      },
      {
        path: "/dashboard/notes",
        element: <Note />,
      },
      {
        path: "/dashboard/discussions",
        element: <Discussions />,
      },
      {
        path: "/dashboard/ceremony",
        element: <Ceremony />,
      },
      {
        path: "/dashboard/schedule",
        element: <Schedule />,
      },
      {
        path: "/dashboard/settings",
        element: <Settings />,
      },

    ],
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
export default Router;
