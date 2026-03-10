import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import RouteLoader from "../Component/Shared/RouteLoader";

// Eager load critical routes (homepage, layout, error)
import Home from "../Pages/Home/Home";
import Layout from "../Layout/Layout";
import Error from "../Pages/Error/Error";
import DashBoardOutline from "../DashBoardLayout/DashBoardOutline";
import { PrivateRoute } from "../Component/PrivateRoute/PrivateRoute";
import { CeremonyProvider } from "../Pages/DashBoard/Ceremony/contexts/CeremonyContext";

// Lazy load authentication pages (with auto-retry on chunk load failure)
const Login = lazyWithRetry(() => import("../Pages/Login/Login"), "Login");
const Signup = lazyWithRetry(() => import("../Pages/SignUp/Signup"), "Signup");
const ResetPassword = lazyWithRetry(
  () => import("../Pages/Verify_Forget/ResetPassword"),
  "ResetPassword",
);
const VerifyUser = lazyWithRetry(
  () => import("../Pages/Verify_Forget/verifyUser"),
  "VerifyUser",
);

// Lazy load public pages
const Feature = lazyWithRetry(
  () => import("../Pages/Feature/Feature"),
  "Feature",
);
const Officiant = lazyWithRetry(
  () => import("../Pages/Officiant/Officiant_Home/Officiant"),
  "Officiant",
);
const OfficiantDetail = lazyWithRetry(
  () => import("../Pages/Officiant/Officiant_Details/OfficiantDetail"),
  "OfficiantDetail",
);

// Lazy load dashboard pages
const DashHome = lazyWithRetry(
  () => import("../Pages/DashBoard/Home/DashHome"),
  "DashHome",
);
const Ceremony = lazyWithRetry(
  () => import("../Pages/DashBoard/Ceremony/Ceremony"),
  "Ceremony",
);
const Bookings = lazyWithRetry(
  () => import("../Pages/DashBoard/Bookings/Bookings"),
  "Bookings",
);
const CeremonyReview = lazyWithRetry(
  () => import("../Pages/DashBoard/CeremonyReview/CeremonyReview"),
  "CeremonyReview",
);
const Note = lazyWithRetry(
  () => import("../Pages/DashBoard/Notes/Note"),
  "Note",
);
const Payment = lazyWithRetry(
  () => import("../Pages/Payment/AgreementPayment"),
  "Payment",
);
const Discussions = lazyWithRetry(
  () => import("../Pages/DashBoard/Discussion/Discussions"),
  "Discussions",
);
const Schedule = lazyWithRetry(
  () => import("../Pages/DashBoard/Schedule/Schedule"),
  "Schedule",
);
const Settings = lazyWithRetry(
  () => import("../Pages/DashBoard/Settings/Settings"),
  "Settings",
);
const UserManagement = lazyWithRetry(
  () => import("../Pages/DashBoard/UserManagement/UserManagement"),
  "UserManagement",
);
const Agreement = lazyWithRetry(
  () => import("../Pages/DashBoard/Agreement/Agreement"),
  "Agreement",
);
const AgreementList = lazyWithRetry(
  () => import("../Pages/DashBoard/Agreement/AgreementList"),
  "AgreementList",
);
const OfficiantAgreement = lazyWithRetry(
  () => import("../Pages/DashBoard/Agreement/OfficiantAgreement"),
  "OfficiantAgreement",
);
const OfficiantAgreementList = lazyWithRetry(
  () => import("../Pages/DashBoard/Agreement/OfficiantAgreementList"),
  "OfficiantAgreementList",
);
const Bills = lazyWithRetry(
  () => import("../Pages/DashBoard/Bills/Bills"),
  "Bills",
);
const EventManagement = lazyWithRetry(
  () => import("../Pages/DashBoard/EventManagement/EventManagement"),
  "EventManagement",
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
            <CeremonyProvider>
              <Ceremony />
            </CeremonyProvider>
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
      {
        path: "/dashboard/agreement/:eventId",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Agreement />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/agreements",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <AgreementList />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/bills",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <Bills />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/officiant-agreement",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <OfficiantAgreement />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/officiant-agreements",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <OfficiantAgreementList />
          </Suspense>
        ),
      },
      {
        path: "/dashboard/event-management",
        element: (
          <Suspense fallback={<RouteLoader />}>
            <EventManagement />
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
