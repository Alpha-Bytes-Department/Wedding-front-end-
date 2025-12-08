import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CeremonyContextData {
  partner1Name: string;
  partner2Name: string;
  setPartner1Name: (name: string) => void;
  setPartner2Name: (name: string) => void;
  isReversed: boolean;
  setIsReversed: (reversed: boolean) => void;
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
  const [partner1Name, setPartner1Name] = useState<string>("");
  const [partner2Name, setPartner2Name] = useState<string>("");
  const [isReversed, setIsReversed] = useState<boolean>(false);

  const value = {
    partner1Name,
    partner2Name,
    setPartner1Name,
    setPartner2Name,
    isReversed,
    setIsReversed,
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
