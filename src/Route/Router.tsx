import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Signup from "../Pages/SignUp/Signup";
import Layout from "../Layout/Layout";
import Feature from "../Pages/Feature/Feature";
import Officiant from "../Pages/Officiant/Officiant_Home/Officiant";
import OfficiantDetail from "../Pages/Officiant/Officiant_Details/OfficiantDetail";

const Router = createBrowserRouter(
  [
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
    

  ],
  
);
export default Router;
