import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteLoader from "../Component/Shared/RouteLoader";

// Eager load critical routes (homepage, layout, error)
import Home from "../Pages/Home/Home";
import Layout from "../Layout/Layout";
import Error from "../Pages/Error/Error";
import DashBoardOutline from "../DashBoardLayout/DashBoardOutline";
import { PrivateRoute } from "../Component/PrivateRoute/PrivateRoute";

// Lazy load authentication pages
const Login = lazy(() => import("../Pages/Login/Login"));
const Signup = lazy(() => import("../Pages/SignUp/Signup"));
const ResetPassword = lazy(
  () => import("../Pages/Verify_Forget/ResetPassword")
);
const VerifyUser = lazy(() => import("../Pages/Verify_Forget/verifyUser"));

// Lazy load public pages
const Feature = lazy(() => import("../Pages/Feature/Feature"));
const Officiant = lazy(
  () => import("../Pages/Officiant/Officiant_Home/Officiant")
);
const OfficiantDetail = lazy(
  () => import("../Pages/Officiant/Officiant_Details/OfficiantDetail")
);

// Lazy load dashboard pages (heavy components)
const DashHome = lazy(() => import("../Pages/DashBoard/Home/DashHome"));
const Ceremony = lazy(() => import("../Pages/DashBoard/Ceremony/Ceremony"));
const Bookings = lazy(() => import("../Pages/DashBoard/Bookings/Bookings"));
const CeremonyReview = lazy(
  () => import("../Pages/DashBoard/CeremonyReview/CeremonyReview")
);
const Note = lazy(() => import("../Pages/DashBoard/Notes/Note"));
const Payment = lazy(() => import("../Pages/Payment/Payment"));
const Discussions = lazy(
  () => import("../Pages/DashBoard/Discussion/Discussions")
);
const Schedule = lazy(() => import("../Pages/DashBoard/Schedule/Schedule"));
const Settings = lazy(() => import("../Pages/DashBoard/Settings/Settings"));
const UserManagement = lazy(
  () => import("../Pages/DashBoard/UserManagement/UserManagement")
);

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
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Feature />
          </Suspense>
        ),
      },
      {
        path: "/officiant",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Officiant />
          </Suspense>
        ),
      },
      {
        path: "/officiant/:officiantId",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <OfficiantDetail />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/reset-password/:token",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <VerifyUser />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardOutline />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <DashHome />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/bookings",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Bookings />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/review",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <CeremonyReview />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/notes",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Note />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/payment",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Payment />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/discussions",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Discussions />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/ceremony",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Ceremony />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/schedule",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Schedule />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/settings",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/admin",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <UserManagement />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);
export default Router;
