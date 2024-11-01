import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { json, redirect, ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import React, { useState } from "react";

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

interface LoaderData {
  user: User;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = parseInt(params.id || "0", 10);
  const response = await fetch(`https://easy-service.prakasitj.com/user/searchbyID/${id}`);
  const users: User[] = await response.json();
  
  if (users.length === 0) {
    throw new Response("User not found", { status: 404 });
  }

  const user = users[0];
  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const userData = {
    id: parseInt(formData.get("id") as string, 10),
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    surname: formData.get("surname") as string,
    address: formData.get("address") as string,
    province: formData.get("province") as string,
    role: formData.get("role") as string,
  };

  await fetch("https://easy-service.prakasitj.com/user/editUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  alert("Login successful!");
  

  return redirect(`/user/${userData.id}`);
};

export default function EditEngineer() {
  const data = useLoaderData<LoaderData>();
  const user = data.user;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<User>(user);
  const [errors, setErrors] = useState<Partial<User>>({});

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
    const newErrors: Partial<User> = {};

    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.surname) newErrors.surname = "Surname is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.province) newErrors.province = "Province is required.";
    if (!formData.role) newErrors.role = "Role is required.";

    if (Object.keys(newErrors).length === 0) {
      await fetch("https://easy-service.prakasitj.com/user/editUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      alert("Update Succesful!");
      navigate("/engineerList");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          Edit Engineer ID: {user.id} {user.name}
        </h2>
        <Form method="post" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <input type="hidden" name="id" defaultValue={user.id.toString()} />
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
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
          <div className="mb-4">
            <label>Role *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter role"
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <div className="flex justify-between">
            <button type="button" className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => navigate("/engineerList")}>
              Back
            </button>
            <button type="submit" className="bg-lime-500 text-white py-2 px-4 rounded" >
              Confirm
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
