import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBarEngineer";
import { useLocation, useNavigate } from "react-router-dom";

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

const fetchSN = async (id: string) => {
  try {
    const response = await fetch(`https://easy-service.prakasitj.com/Requests/getByID/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch SN');
    }
    const data = await response.json();
    return data[0]?.sn || null;
  } catch (error) {
    console.error("Error fetching SN:", error);
    return null;
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
  const location = useLocation();
  const { id, machineId, workId } = location.state;

  console.log(machineId)
  const [selectedSpareParts, setSelectedSpareParts] = useState<{ id: string; qty: number }[]>([]);
  const [description, setDescription] = useState<string | null>(null);
  const [sn, setSn] = useState<string | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  useEffect(() => {
    const fetchSerialNumber = async () => {
      if (workId) {
        const serialNumber = await fetchSN(workId);
        setSn(serialNumber);
      }
    };

    fetchSerialNumber();
  }, [workId]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSparePartSelection = (id: string, qty: number) => {
    setSelectedSpareParts((prev) => {
      if (qty > 0) {
        const existing = prev.find((part) => part.id === id);
        if (existing) {
          return prev.map((part) => (part.id === id ? { ...part, qty } : part));
        } else {
          return [...prev, { id, qty }];
        }
      } else {
        return prev.filter((part) => part.id !== id);
      }
    });
  };

  const handleAdd = async () => {
    if (selectedSpareParts.length === 0) {
      alert("กรุณาเลือกอะไหล่และกรอกจำนวนก่อน");
      return;
    }

    // ลูปแต่ละ SparePart และทำการ POST ทีละค่า
    for (let part of selectedSpareParts) {
      const payload = {
        request_id: machineId,
        spare_part_id: part.id,
        spare_part_qty: part.qty,
        price:( SparePartsList.find((sp) => sp.id === part.id)?.price || 0)*part.qty,
        description: description || "",
        sn: sn || "",
      };
      

      try {
        const response = await fetch("https://easy-service.prakasitj.com/Spare_parts_requests/insertNewSparePartsRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log(`เพิ่มอะไหล่ ${part.id} สำเร็จ`);
        } else {
          const errorData = await response.json();
          console.error(`Error adding spare part ${part.id}:`, errorData);
          alert("เกิดข้อผิดพลาดในการเพิ่มอะไหล่");
          break; // ถ้ามีข้อผิดพลาด จะหยุดการส่งข้อมูลทันที
        }
      } catch (error) {
        console.error("Error:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        break; // ถ้ามีข้อผิดพลาดในการเชื่อมต่อ จะหยุดการส่งข้อมูลทันที
      }
    }
    alert("เพิ่มอะไหล่สำเร็จ")

    navigate("/workListEngineer", { state: id });
  };

  return (
    <>
      <NavBar id={id}/>
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
                <th className="p-2">Part Name</th>
                <th className="p-2">ID</th>
                <th className="p-2">Description</th>
                <th className="p-2">Price</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {SparePartsList.map((sparePart) => (
                <tr key={sparePart.id} className="border-t">
                  <td className="p-2">{sparePart.name}</td>
                  <td className="p-2">{sparePart.id}</td>
                  <td className="p-2">{sparePart.description}</td>
                  <td className="p-2">{sparePart.price} Baht</td>
                  <td className="p-2">{sparePart.unit}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      onChange={(e) =>
                        handleSparePartSelection(sparePart.id, parseInt(e.target.value, 10) || 0)
                      }
                      className="border border-gray-300 rounded-lg p-1 w-full"
                    />
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

          <div className="flex justify-center space-x-10 mt-8">
            <a href="/mainPage">
              <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600">Back</button>
            </a>
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
