import React, { useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";


interface FormData {
    username: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    province: string;
    role: string;
}

export default function AddEngineer() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        name: "",
        surname: "",
        address: "",
        province: "",
        role: ""
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Partial<FormData> = {};

        if (!formData.username) newErrors.username = "Username is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.surname) newErrors.surname = "Surname is required.";
        if (!formData.address) newErrors.address = "Address is required.";
        if (!formData.province) newErrors.province = "Province is required.";
        if (!formData.role) newErrors.role = "Role is required.";

        if (Object.keys(newErrors).length === 0) {
            try {
                const url = "https://easy-service.prakasitj.com/user/addNewUser";
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                console.log(response);
                if (response.ok) {
                    alert("Engineer added successfully.");
                    navigate("/engineerList");
                } else {
                    alert("Failed to add Engineer.");
                }
            } catch (error) {
                console.error("Error adding user:", error);
                alert("An error occurred. Please try again.");
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleBack = () => {
       navigate("/engineerList");
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">เพิ่มช่าง</h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    <div className="mb-4">
                        <label>Username </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Password </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Name </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Surname </label>
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Province</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                    </div>

                    <div className="flex justify-between">
                        <button type="button" className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleBack}>
                            Back
                        </button>
                        <button type="submit" className="bg-lime-500 text-white py-2 px-4 rounded">
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
