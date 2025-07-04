"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

type Cafe = {
  id: string;
  name: string;
  logoUrl: string;
};

type CafeContextType = {
  cafe: Cafe | null;
  setCafe: (cafe: Cafe) => void;
};

const CafeContext = createContext<CafeContextType>({
  cafe: null,
  setCafe: () => {},
});

export const CafeProvider = ({ children }: { children: React.ReactNode }) => {
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cafe/name/${user.id}`)
      .then((res) => {
        setCafe(res.data.cafe);
        localStorage.setItem("cafeId", res.data.cafe.id);
      })
      .catch((err) => console.error("Cafe fetch failed:", err));
  }, [isLoaded, user?.id]);

  return (
    <CafeContext.Provider value={{ cafe, setCafe }}>
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => useContext(CafeContext);
