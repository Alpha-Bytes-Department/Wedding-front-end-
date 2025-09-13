import React, { createContext, useContext, type ReactNode } from "react";
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

interface AxiosProviderProps {
  children: ReactNode;
  baseURL?: string;
}

export const AxiosProvider: React.FC<AxiosProviderProps> = ({
  children,
  baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
}) => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add security token
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log API URL
      console.log(
        ` API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );

      return config;
    },
    (error) => {
      console.error(" Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response status
      console.log(
        ` API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - Status: ${response.status}`
      );
      return response;
    },
    (error) => {
      // Log error status
      if (error.response) {
        console.error(
          ` API Error: ${error.config?.method?.toUpperCase()} ${
            error.config?.url
          } - Status: ${error.response.status}`
        );

        // Handle unauthorized access
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          // Redirect to login or refresh token logic
          window.location.href = "/login";
        }
      } else {
        console.error(" Network Error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};
