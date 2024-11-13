import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { Form, Link, useSubmit } from "@remix-run/react";
import { useNavigate, useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

interface SparePartEngineerTable {
  id: number;
  spare_part_id: number;
  name: string; 
  quantity: number;
  user_id: number;
  add_date: string;
}

export default function EngineerSparePart() {
  const location = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const { userId } = location.state || {};

  const [spareParts, setSpareParts] = useState<SparePartEngineerTable[]>([]);
  const [filteredParts, setFilteredParts] = useState<SparePartEngineerTable[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpareParts = async () => {
      if (!userId) {
        setError("User ID is missing");
        return;
      }

      const url = `https://easy-service.prakasitj.com/spare_parts_engineer/getFromUserID/${userId}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: SparePartEngineerTable[] = await response.json();
        setSpareParts(data);
        setFilteredParts(data);
      } catch (error) {
        console.error("Error fetching spare parts:", error);
        setError("Failed to load spare parts data");
      }
    };

    fetchSpareParts();
  }, [userId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = spareParts.filter((part) =>
      part.name.toLowerCase().includes(term)
    );
    setFilteredParts(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    navigate("/engineerList");
  };

  const paginatedParts = filteredParts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
          <h2 className="text-red-500 text-center mt-8">{error}</h2>
          <button
            onClick={handleBack}
            className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600 mt-4"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">
          รายการอะไหล่ของช่าง
        </h1>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <Form id="search-form" role="search">
            <input
              type="text"
              aria-label="Search spare parts"
              id="q"
              name="q"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-lg p-2 w-1/3 mb-4"
            />
          </Form>

          {paginatedParts.length > 0 ? (
            <table className="table-auto w-full text-left">
              <thead className="text-gray-600">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Add Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedParts.map((part, index) => (
                  <tr key={part.id} className="border-t">
                    <td className="p-2">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="p-2">{part.name}</td>
                    <td className="p-2">{part.quantity}</td>
                    <td className="p-2">
                      {new Date(part.add_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-lg text-gray-600">ไม่มีรายการอะไหล่</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <div>
              <span>
                Page: {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center"
                >
                  Previous
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
