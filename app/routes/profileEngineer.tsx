import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBarEngineer";
import { useNavigate } from "react-router-dom";
import { useID } from "../context/IDContext";

interface UserProfile {
  id: number;
  username: string;
  name: string;
  surname: string;
  address: string;
  province: string;
  role: string;
  addDate: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useID();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      alert("User ID is missing. Redirecting to login page.");
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      const url = `https://easy-service.prakasitj.com/user/searchbyID/${id}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
          throw new Error("User not found.");
        }

        setUserData(data[0]);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/mainPageEngineer");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!userData) {
    return <div className="text-center">No user data available.</div>;
    }
    
    const handleEdit = (field: string) => {
    if (field === "Edit Profile") {
      navigate("/editProfile" , { state: { from: "/profileEngineer" } });
    } else if (field === "Change password") {
      navigate("/changepassword" , { state: { from: "/profileEngineer" } });
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">โปรไฟล์ผู้ใช้</h2>

        <div className="bg-white p-6 rounded-lg shadow-md w-[800px] max-w-full mb-6">
          <p><strong>รหัสผู้ใช้:</strong> {userData.id}</p>
          <p><strong>ชื่อผู้ใช้:</strong> {userData.username}</p>
          <p><strong>ชื่อ:</strong> {userData.name}</p>
          <p><strong>นามสกุล:</strong> {userData.surname}</p>
          <p><strong>ที่อยู่:</strong> {userData.address}</p>
          <p><strong>จังหวัด:</strong> {userData.province}</p>
          <p><strong>บทบาท:</strong> {userData.role}</p>
          <div className="flex flex-col gap-2 mt-4 items-start">
              <button onClick={() => handleEdit("Edit Profile")} className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600">
                Edit Profile
              </button>
              <button onClick={() => handleEdit("Change password")} className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600">
                เปลี่ยนรหัสผ่าน
              </button>
            </div>

        </div>

        <div className="flex justify-between w-full max-w-[600px]">
          <button
            onClick={handleBack}
            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    </>
  );
}
