import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom"; 

const ITEMS_PER_PAGE = 6; 

interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  province: string;
  role: string;
  add_date: Date | string;
}

interface LoaderData {
  users: User[];
  total: number;
  q: string;
  page: number;
}

const getUsers = async (searchTerm: string): Promise<Array<User>> => {
    const response = await fetch("https://easy-service.prakasitj.com/user/getUserList");
    const users: User[] = await response.json();

    if (searchTerm) {
        return users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return users;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const users = await getUsers(q);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return json({ users: paginatedUsers, total: users.length, q, page });
};

export default function SelectEngineer() {
    const { users, total, q, page } = useLoaderData<LoaderData>();
    const submit = useSubmit();
    const navigate = useNavigate();
    const location = useLocation();
    const { workId } = location.state || {}; // รับค่า workId จาก state

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q]);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const handleSelect = async () => {
    if (selectedUser) {
        const url = 'https://easy-service.prakasitj.com/works/editResponsiblePerson';
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: workId,
                userID: selectedUser.id,
            }),
        };
        try {
            const response = await fetch(url, options);
            const responseData = await response.text(); // เปลี่ยนเป็น text() เพื่ออ่านข้อมูลที่ไม่ใช่ JSON

            

            if (response.ok) {
                console.log("Update successful:", responseData);
                alert("เลือกช่างแล้ว");
                navigate("/stOneWork", { state: { workId } });
            } else {
                console.error("Failed with response status:", response.status);
                alert("Failed to assign engineer. Please try again.");
            }
        } catch (error) {
            console.error("Error updating responsible person:", error);
            alert("Failed to assign engineer. Please try again.");
        }
        } else {
            alert("Please select an engineer.");
        }
    };



    const handleBack = () => {
        navigate("/stOneWork", { state: { workId } });
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen p-8 bg-gray-50">
                <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">เลือกช่าง</h1>
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <Form id="search-form" onChange={(event) => submit(event.currentTarget)} role="search">
                        <input
                            type="text"
                            aria-label="Search users"
                            id="q"
                            name="q"
                            placeholder="Search by name"
                            className="border border-gray-300 rounded-lg p-2 w-1/3"
                        />
                    </Form>
                    
                    <table className="table-auto w-full text-left">
                        <thead className="text-gray-600">
                            <tr>
                                <th className="p-2">Select</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Surname</th>
                                <th className="p-2">Address</th>
                                <th className="p-2">Province</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Add Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-2">
                                        <input
                                            type="radio"
                                            name="user"
                                            value={user.name}
                                            onChange={() => setSelectedUser(user)}
                                            checked={selectedUser?.id === user.id}
                                        />
                                    </td>
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.surname}</td>
                                    <td className="p-2">{user.address}</td>
                                    <td className="p-2">{user.province}</td>
                                    <td className="p-2">{user.role}</td>
                                    <td className="p-2">
                                        {new Date(user.add_date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <span>Page: {page} of {totalPages}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {page > 1 && (
                                <Link to={`?page=${page - 1}&q=${q}`} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">Previous</Link>
                            )}
                            {page < totalPages && (
                                <Link to={`?page=${page + 1}&q=${q}`} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">Next</Link>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-20 mt-8">
                        <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800" onClick={handleBack}>
                            Back
                        </button>
                        <button className="bg-lime-500 text-white py-2 px-6 rounded-lg hover:bg-lime-600" onClick={handleSelect}>
                            Select
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
