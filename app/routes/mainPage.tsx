import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "app/components/_navBar";

export default function Main() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-lime-600 mb-8">Main Menu</h1>
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <button
            className="bg-blue-500 text-black py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
            onClick={() => handleNavigation("/customerList")}
          >
            Go to Customer List
          </button>
          <button
            className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 w-full"
            onClick={() => handleNavigation("/engineerList")}
          >
            Go to Engineer List
          </button>

           <button
            className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 w-full"
            onClick={() => handleNavigation("/sparePartsList")}
          >
            Go to SpareParts List
          </button>

          <button
            className="bg-orange-500 text-black py-2 px-4 rounded-lg hover:bg-orange-600 w-full"
            onClick={() => handleNavigation("/workList")}
          >
            Go to Work List
          </button>
          <button
            className="bg-purple-500 text-black py-2 px-4 rounded-lg hover:bg-purple-600 w-full"
            onClick={() => handleNavigation("/workWaitList")}
          >
            Go to Work Wait List
          </button>
          <button
            className="bg-lime-500 text-black py-2 px-4 rounded-lg hover:bg-lime-600 w-full"
            onClick={() => handleNavigation("/adWorkList")}
          >
            Go to Ad Work List
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full"
            onClick={() => handleNavigation("/allWorkEnd")}
          >
            Go to All Work
          </button>
        </div>
      </div>
    </>
  );
}
