import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

interface SpareParts {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  add_date: string;
}

interface LoaderData {
  SparePartsList: SpareParts[];
  total: number;
  q: string;
  page: number;
}

const getSparePartsList = async (searchTerm: string): Promise<Array<SpareParts>> => {
  const url = 'https://easy-service.prakasitj.com/spare_parts/getList';
  const options = { method: 'GET' };

  try {
    const response = await fetch(url, options);
    const data: SpareParts[] = await response.json();

    if (searchTerm) {
      return data.filter((sparePart) =>
        sparePart.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  } catch (error) {
    console.error("Error fetching spare parts data:", error);
    return [];
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const SparePartsList = await getSparePartsList(q);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedSparePartsList = SparePartsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return json({ SparePartsList: paginatedSparePartsList, total: SparePartsList.length, q, page });
};

export default function SparePartsList() {
  const { SparePartsList, total, q, page } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [selectedSparePart, setSelectedSparePart] = useState<string | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSelect = () => {
    if (selectedSparePart) {
      navigate('/editSpareparts', { state: { sparepartId: selectedSparePart } });
    } else {
      alert("กรุณาเลือกอะไหล่ก่อน");
    }
  };

  const handleAdd = () => {
    navigate('/addSpareParts');
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">คลังอะไหล่</h1>
        
        <div className="bg-white p-4 shadow-md rounded-lg">
          <Form id="search-form" onChange={(event) => submit(event.currentTarget)} role="search">
            <input
              type="text"
              aria-label="Search SparePartsList"
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
                <th className="p-2">Part Name</th>
                <th className="p-2">ID</th>
                <th className="p-2">Description</th>
                <th className="p-2">Price</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Added Date</th>
              </tr>
            </thead>
            <tbody>
              {SparePartsList.map((sparePart) => (
                <tr key={sparePart.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="radio"
                      name="SpareParts"
                      onChange={() => setSelectedSparePart(sparePart.id)}
                      checked={selectedSparePart === sparePart.id}
                    />
                  </td>
                  <td className="p-2">{sparePart.name}</td>
                  <td className="p-2">{sparePart.id}</td>
                  <td className="p-2">{sparePart.description}</td>
                  <td className="p-2">{sparePart.price} Baht</td>
                  <td className="p-2">{sparePart.unit}</td>
                  <td className="p-2">{new Date(sparePart.add_date).toLocaleDateString()}</td>
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

          <div className="flex justify-center space-x-10 mt-8">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600" onClick={handleAdd}>
              Add
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

