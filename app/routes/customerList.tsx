import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

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
  addDate: Date | string; // อนุญาตให้เป็น Date หรือ string เพื่อการแปลงข้อมูล
}

interface LoaderData {
  users: User[];
  total: number;
  q: string;
  page: number;
}

const getUsers = async (searchTerm: string): Promise<Array<User>> => {
  const users: User[] = [
    {
      id: 1,
      username: "devonlane",
      password: "password123",
      name: "Devon",
      surname: "Lane",
      address: "123 Main St, Philadelphia, USA",
      province: "Philadelphia",
      role: "Admin",
      addDate: new Date(), // เก็บเป็น Date object
    },
    {
      id: 2,
      username: "kmurphy",
      password: "password123",
      name: "Kathryn",
      surname: "Murphy",
      address: "456 Broadway Ave, Los Angeles, USA",
      province: "Los Angeles",
      role: "User",
      addDate: new Date(), // เก็บเป็น Date object
    },
    {
      id: 3,
      username: "epenna",
      password: "password123",
      name: "Eleanor",
      surname: "Pena",
      address: "789 Elm St, Manhattan, USA",
      province: "Manhattan",
      role: "User",
      addDate: new Date(), // เก็บเป็น Date object
    },
  ];

  if (searchTerm) {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

export default function CustomerList() {
  const { users, total, q, page } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSelect = () => {
    if (selectedUser) {
      navigate("/workDescription", { state: { userId: selectedUser } });
    } else {
      alert("กรุณาเลือกผู้ใช้ก่อน");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">
          ข้อมูลผู้ใช้
        </h1>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <Form
            id="search-form"
            onChange={(event) => submit(event.currentTarget)}
            role="search"
          >
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
                <th className="p-2">Username</th>
                <th className="p-2">Name</th>
                <th className="p-2">Surname</th>
                <th className="p-2">Address</th>
                <th className="p-2">Role</th>
                <th className="p-2">Add Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="radio"
                      name="user"
                      value={user.id}
                      onChange={() => setSelectedUser(user.id)}
                      checked={selectedUser === user.id}
                    />
                  </td>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.surname}</td>
                  <td className="p-2">{user.address}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    {new Date(user.addDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span>
                Page: {page} of {totalPages}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {page > 1 && (
                <Link
                  to={`?page=${page - 1}&q=${q}`}
                  className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  to={`?page=${page + 1}&q=${q}`}
                  className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center"
                >
                  Next
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              className="bg-yellow-400 text-white py-2 px-6 rounded-lg hover:bg-yellow-500"
              onClick={handleSelect}
            >
              Select
            </button>

            <a href="/newUser">
              <button className="bg-lime-500 text-white py-2 px-6 rounded-lg hover:bg-lime-600">
                ADD
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
