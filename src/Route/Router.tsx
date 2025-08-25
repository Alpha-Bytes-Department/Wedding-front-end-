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

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <DashBoardOutline />,
    children: [
      {
        path: "/dashboard",
        element: <DashHome />,
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

    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);
export default Router;
