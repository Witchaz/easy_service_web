import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface IDContextProps {
  id: number | null; // เปลี่ยนให้ `id` รองรับ `null`
  setId: (id: number | null) => void; // เปลี่ยน `setId` ให้รองรับ `null`
  clearId: () => void; // ฟังก์ชันสำหรับตั้งค่า `id` เป็น `null`
}

const IDContext = createContext<IDContextProps | undefined>(undefined);

export const IDProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null); // เปลี่ยน useState ให้รองรับ `null`

  // ดึงค่า `id` จาก `localStorage` เมื่อโหลดครั้งแรก
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setId(Number(storedId));
    }
  }, []);

  // ฟังก์ชันสำหรับตั้งค่า id และอัปเดตใน localStorage
  const handleSetId = (newId: number | null) => {
    setId(newId);
    if (newId === null) {
      localStorage.removeItem("userId"); // ลบ `userId` ออกจาก localStorage
    } else {
      localStorage.setItem("userId", newId.toString());
    }
  };

  // ฟังก์ชันสำหรับตั้งค่า id เป็น null
  const clearId = () => handleSetId(null);

  return (
    <IDContext.Provider value={{ id, setId: handleSetId, clearId }}>
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
