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
  addDate: Date | string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useID();

  const [formData, setFormData] = useState<User | null>(null);
  const [errors, setErrors] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);

  // หน้าเดิมที่เข้ามา หากไม่มีค่า ให้ใช้ `/mainPage` เป็นค่าเริ่มต้น
  const previousPage = location.state?.from || "/mainPage";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setLoading(false);
        alert("User ID is not provided.");
        navigate(previousPage);
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
          alert("User not found.");
          navigate(previousPage);
          return;
        }

        setFormData(data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading user data.");
        navigate(previousPage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate, previousPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    const newErrors: Partial<User> = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.surname) newErrors.surname = "Surname is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.province) newErrors.province = "Province is required.";

    if (Object.keys(newErrors).length === 0) {
      const confirmed = window.confirm("Are you sure you want to save these changes?");
      if (confirmed) {
        try {
          await fetch("https://easy-service.prakasitj.com/user/editUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          alert("Update successful!");
          navigate(previousPage); // กลับไปหน้าก่อนหน้า
        } catch (error) {
          console.error("Error updating user:", error);
          alert("Failed to update user. Please try again.");
        }
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
        แก้ไขข้อมูลส่วนตัว {formData.name}
      </h2>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl"
      >
        <div className="mb-4">
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter username"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
        <div className="mb-4">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label>Surname *</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter surname"
          />
          {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
        </div>
        <div className="mb-4">
          <label>Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter address"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>
        <div className="mb-4">
          <label>Province *</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter province"
          />
          {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => navigate(previousPage)}
          >
            Back
          </button>
          <button type="submit" className="bg-lime-500 text-white py-2 px-4 rounded">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
