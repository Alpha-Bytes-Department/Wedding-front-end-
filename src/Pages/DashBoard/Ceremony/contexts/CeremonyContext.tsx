import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CeremonyContextData {
  groomName: string;
  brideName: string;
  setGroomName: (name: string) => void;
  setBrideName: (name: string) => void;
}

const CeremonyContext = createContext<CeremonyContextData | undefined>(
  undefined
);

interface CeremonyProviderProps {
  children: ReactNode;
}

export const CeremonyProvider: React.FC<CeremonyProviderProps> = ({
  children,
}) => {
  const [groomName, setGroomName] = useState<string>("");
  const [brideName, setBrideName] = useState<string>("");

  const value = {
    groomName,
    brideName,
    setGroomName,
    setBrideName,
  };

  return (
    <CeremonyContext.Provider value={value}>
      {children}
    </CeremonyContext.Provider>
  );
};

export const useCeremonyContext = () => {
  const context = useContext(CeremonyContext);
  if (context === undefined) {
    throw new Error(
      "useCeremonyContext must be used within a CeremonyProvider"
    );
  }
  return context;
};
