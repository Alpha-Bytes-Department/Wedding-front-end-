import { useContext } from 'react';
import type { AxiosInstance } from 'axios';
import { AxiosContext } from './AxiosContext';

export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};
