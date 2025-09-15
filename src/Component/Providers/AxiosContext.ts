import { createContext } from "react";
import type { AxiosInstance } from "axios";

// Create and export the context
export const AxiosContext = createContext<AxiosInstance | null>(null);
