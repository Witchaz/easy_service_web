import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useID } from "../context/IDContext";

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  province: string;
  role: string;
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useID();

  const [userData, setUserData] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Previous page or fallback to "/mainPage"
  const previousPage = location.state?.from || "/mainPage";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        alert("User ID is missing. Redirecting to login page.");
        navigate("/login");
        return;
      }

      const url = `https://easy-service.prakasitj.com/user/searchbyID/${id}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
          throw new Error("User not found.");
        }

        setUserData(data[0]);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) {
      setError("User data is missing. Please try again.");
      return;
    }

    if (newPassword.length < 3) {
      setError("Password must be at least 3 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const url = "https://easy-service.prakasitj.com/user/editUser";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          password: newPassword,
        }),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to update password.");
      }

      alert("Password changed successfully!");
      navigate(previousPage); // Navigate back to previous page
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
        เปลี่ยนรหัสผ่าน
      </h2>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label>รหัสผ่านใหม่ *</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-4">
          <label>ยืนยันรหัสผ่านใหม่ *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="Confirm new password"
          />
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => navigate(previousPage)}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="bg-lime-500 text-white py-2 px-4 rounded"
          >
            ยืนยัน
          </button>
        </div>
      </form>
    </div>
  );
}
