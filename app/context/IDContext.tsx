import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface IDContextProps {
  id: number | null;
  setId: (id: number) => void;
}

const IDContext = createContext<IDContextProps | undefined>(undefined);

export const IDProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);

  // ดึงค่า `id` จาก `localStorage` เมื่อโหลดครั้งแรก
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setId(Number(storedId));
    }
  }, []);

  // อัปเดตค่า `localStorage` ทุกครั้งที่ค่า `id` เปลี่ยนแปลง
  const handleSetId = (newId: number) => {
    setId(newId);
    localStorage.setItem("userId", newId.toString());
  };

  return (
    <IDContext.Provider value={{ id, setId: handleSetId }}>
      {children}
    </IDContext.Provider>
  );
};

export const useID = () => {
  const context = useContext(IDContext);
  if (!context) {
    throw new Error("useID must be used within an IDProvider");
  }
  return context;
};
