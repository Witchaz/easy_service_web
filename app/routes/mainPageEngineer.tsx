import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "app/components/_navBarEngineer";
import { useID } from "~/context/IDContext";

export default function Main() {
  const navigate = useNavigate();
  const { id, clearId } = useID();
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Confirm logout action
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
       clearId();
      alert("You have been logged out.");
      navigate("/login"); // Redirect to login page
    }
    };
    
    const handleEdit = () => {
        navigate("/profileEngineer");
    }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-lime-600 mb-8">Main Menu</h1>
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <button
            className="bg-lime-500 text-black py-2 px-4 rounded-lg hover:bg-lime-600 w-full"
            onClick={() => handleNavigation("/workListEngineer")}
          >
            งานทั้งหมดที่ต้องไปตรวจ
          </button>
          <button
            className="bg-purple-500 text-black py-2 px-4 rounded-lg hover:bg-purple-600 w-full"
            onClick={() => handleNavigation("/workListSEngineer")}
          >
            งานทั้งหมดที่ต้องไปซ่อม
          </button>
          <button
            className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 w-full"
            onClick={() => handleNavigation("/request")}
          >
            เบิกอะไหล่
          </button>
          <button
            className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 w-full"
            onClick={() => handleNavigation("/historyRequest")}
          >
            ประวัติการเบิก
          </button>
          <button
            className="bg-orange-500 text-black py-2 px-4 rounded-lg hover:bg-orange-600 w-full"
            onClick={handleEdit}
          >
            โปรไฟล์ผู้ใช้
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
