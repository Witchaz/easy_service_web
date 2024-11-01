// app/routes/editEngineer.tsx
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { json, redirect, ActionFunction, LoaderFunctionArgs } from "@remix-run/node";

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

// ฟังก์ชันโหลดเพื่อดึงข้อมูลของผู้ใช้ตาม id
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = parseInt(params.id || "0", 10); // รับ id จาก URL params
  const response = await fetch(`https://easy-service.prakasitj.com/user/searchbyID/${id}`);
  const users: User[] = await response.json(); // เปลี่ยนให้เป็น User[]
  
  if (users.length === 0) {
    throw new Response("User not found", { status: 404 }); // เพิ่มการจัดการกรณีไม่พบผู้ใช้
  }

  const user = users[0]; // เข้าถึงผู้ใช้แรกในอาร์เรย์
  return { user };
};

// ฟังก์ชันเพื่อจัดการกับข้อมูลที่ถูกส่งจากฟอร์ม
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const userData = {
    id: parseInt(formData.get("id") as string, 10), // ใช้ ID ที่ส่งมาจากฟอร์ม
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    surname: formData.get("surname") as string,
    address: formData.get("address") as string,
    province: formData.get("province") as string,
    role: formData.get("role") as string,
  };

  console.log("Form Data:", Array.from(formData.entries()));
  console.log("User ID from formData:", userData.id); // ตรวจสอบค่า ID ที่ได้รับ

  await fetch("https://easy-service.prakasitj.com/user/editUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return redirect(`/user/${userData.id}`);
};

export default function EditEngineer() {
  const data = useLoaderData<LoaderData>();
  const user = data.user;
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          Edit Engineer ID: {user.id} {user.name}
        </h2>
        <Form method="post" className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <input type="hidden" name="id" defaultValue={user.id} />
          <div className="mb-4">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              defaultValue={user.username}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-4">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              defaultValue={user.password}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter password"
            />
          </div>
          <div className="mb-4">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter name"
            />
          </div>
          <div className="mb-4">
            <label>Surname *</label>
            <input
              type="text"
              name="surname"
              defaultValue={user.surname}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter surname"
            />
          </div>
          <div className="mb-4">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              defaultValue={user.address}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter address"
            />
          </div>
          <div className="mb-4">
            <label>Province *</label>
            <input
              type="text"
              name="province"
              defaultValue={user.province}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter province"
            />
          </div>
          <div className="mb-4">
            <label>Role *</label>
            <input
              type="text"
              name="role"
              defaultValue={user.role}
              className="border rounded w-full py-2 px-3"
              placeholder="Enter role"
            />
          </div>
          <div className="flex justify-between">
            <button type="button" className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => navigate("/engineerList")}>
              Back
            </button>
            <button type="submit" className="bg-lime-500 text-white py-2 px-4 rounded">
              Confirm
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
