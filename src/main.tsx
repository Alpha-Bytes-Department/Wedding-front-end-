import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Route/Router.tsx";
import { RouterProvider } from "react-router";
import { AxiosProvider } from "./Component/Providers/AxiosProvider.tsx";
import { AuthProvider } from "./Component/Providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <AxiosProvider>
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  </AxiosProvider>
);
