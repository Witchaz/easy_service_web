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
  workCounts: { [userId: number]: number };
}

const getUsers = async (searchTerm: string): Promise<Array<User>> => {
  const response = await fetch("https://easy-service.prakasitj.com/user/getUserList");
  const users: User[] = await response.json();

  return users
    .filter(user => user.role !== "admin") // Exclude admin users
    .filter(user =>
      searchTerm ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );
};

const getWorkCounts = async (): Promise<{ [userId: number]: number }> => {
  const url = `https://easy-service.prakasitj.com/works/getWorksListByStatus/1,3,6`;
  const options = { method: "GET" };

  try {
    const response = await fetch(url, options);
    const works = await response.json();

    const workCounts: { [userId: number]: number } = {};
    works.forEach((work: { user_id: number }) => {
      workCounts[work.user_id] = (workCounts[work.user_id] || 0) + 1;
    });

    return workCounts;
  } catch (error) {
    console.error("Error fetching works:", error);
    return {};
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const users = await getUsers(q);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const workCounts = await getWorkCounts();

  return json({ users: paginatedUsers, total: users.length, q, page, workCounts });
};

export default function SelectEngineer() {
  const { users, total, q, page, workCounts } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();
  const { workId, previousPage } = location.state || {};

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSelect = async () => {
    if (selectedUserId !== null) {
      try {
        const url = "https://easy-service.prakasitj.com/works/editResponsiblePerson";
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: workId,
            user_id: selectedUserId,
          }),
        };
        const response = await fetch(url, options);
        const responseText = await response.text();

        if (!response.ok) {
          console.error("Error response:", responseText);
          throw new Error("Failed to assign engineer. " + responseText);
        }

        alert("เลือกช่างแล้ว");
        navigate(previousPage || "/stOneWork", { state: { workId } });
      } catch (error) {
        console.error("Error updating responsible person:", error);
        alert("Failed to assign engineer. Please try again.");
      }
    } else {
      alert("Please select an engineer.");
    }
  };

  const handleBack = () => {
    if (previousPage) {
      navigate(previousPage, { state: { workId } });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">เลือกช่าง</h1>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <Form id="search-form" onChange={(event) => submit(event.currentTarget, { replace: true, state: { workId, previousPage } })} role="search">
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
                <th className="p-2">Work Count</th>
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
                      onChange={() => setSelectedUserId(user.id)}
                      checked={selectedUserId === user.id}
                    />
                  </td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.surname}</td>
                  <td className="p-2">{user.address}</td>
                  <td className="p-2">{user.province}</td>
                  <td className="p-2">{workCounts[user.id] || 0}</td>
                  <td className="p-2">{new Date(user.add_date).toLocaleDateString()}</td>
                  
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
                <Link to={`?page=${page - 1}&q=${q}`} state={{ workId, previousPage }} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link to={`?page=${page + 1}&q=${q}`} state={{ workId, previousPage }} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
                  Next
                </Link>
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
