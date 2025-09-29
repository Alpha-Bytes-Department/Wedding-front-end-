import React, { type ReactNode } from "react";
import axios, {
  // type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
// Import the context from separate file
import { AxiosContext } from "./AxiosContext";
// import {  useNavigate } from "react-router-dom";

interface AxiosProviderProps {
  children: ReactNode;
  baseURL?: string;
}

// Add type for requests with retry flag
// interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

export const AxiosProvider: React.FC<AxiosProviderProps> = ({
  children,
  baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
}) => {
  // Create a ref to track document visibility
  const isTabActiveRef = React.useRef(true);
  
  // Listen for visibility changes
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
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
      // Skip requests if tab is in background and request is non-critical
      const isNonCriticalRequest = 
        config.url?.includes('/notifications') || 
        config.url?.includes('/activity');
        
      // Only throttle non-critical requests when tab is in background
      if (!isTabActiveRef.current && isNonCriticalRequest) {
        // For non-critical background requests, add cancelToken
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        
        // Auto-cancel after a short timeout if tab is still in background
        setTimeout(() => {
          if (!isTabActiveRef.current) {
            source.cancel('Request canceled - tab in background');
          }
        }, 1000);
      }
      
      // Add security token
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log API URL in development only
      if (process.env.NODE_ENV === 'development') {
        console.log(
          ` API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
            config.url
          }`
        );
      }

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
      // Log response status (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(
          ` API Response: ${response.config.method?.toUpperCase()} ${
            response.config.url
          } - Status: ${response.status}`
        );
      }
      return response;
    },
    async (error) => {
     
      // Check for cancellation or timeout (common in background tabs)
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return Promise.reject(error);
      }
      
      // Handle timeouts more gracefully
      if (error.code === 'ECONNABORTED') {
        console.log('Request timed out. Tab may be in background.');
        return Promise.reject(error);
      }
     
      // Log error status
      if (error.response) {
        console.error(
          ` API Error: ${error.config?.method?.toUpperCase()} ${
            error.config?.url
          } - Status: ${error.response.status}`
        );

        // Handle unauthorized access
        if (error.response.status === 401) {
          // Don't retry if we already tried to refresh the token
          if (error.config._retry) {
            console.log("Already tried to refresh token, logging out");
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(error);
          }
          
          console.log("=== Attempting to refresh token ===");
          
          // Get refresh token
          const refreshToken = localStorage.getItem("refreshToken");
          
          // If no refresh token, logout
          if (!refreshToken) {
            console.log("No refresh token available, logging out");
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(error);
          }
          
          try {
            // Mark the request for retry
            error.config._retry = true;
            
            // Only try to refresh token if the tab is active or it's a critical request
            if (!isTabActiveRef.current && !error.config.url?.includes('/auth/')) {
              console.log("Tab in background, skipping token refresh");
              return Promise.reject(error);
            }
            
            const response = await axios.post(
              `${baseURL}/users/refresh-token`,
              { token: refreshToken },
              { 
                timeout: 5000, // Short timeout for token refresh
                headers: { 'Content-Type': 'application/json' }
              }
            );
            
            if (response.status === 200 && response.data.accessToken) {
              
              console.log("=== Refresh Token Successful ===");
              const { accessToken , refreshToken , user } = response.data;
              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", refreshToken);
              localStorage.setItem("user", JSON.stringify(user));

              
              // Update the failed request with the new token
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              
              // Retry the original request
              return axios.request(error.config);
            } else {
              throw new Error("Invalid refresh token response");
            }
          } catch (refreshError) {
            console.log("=== Refresh Token Failed ===", refreshError);
            localStorage.setItem("accessTokendummy", JSON.stringify(refreshError));
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(error);
          }
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

// useAxios hook moved to separate file
