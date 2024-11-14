import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBarEngineer";
import { useNavigate, useLocation } from "react-router-dom";

interface SparePartsRequest {
  id: number;
  request_id: number;
  spare_part_id: number;
  name: string;           // ชื่ออะไหล่
  unit: string;           // หน่วย
  price: number;          // ราคา
  spare_parts_qty: number;
  description: string;
  sn: string;
  add_date: Date;
}

export default function EngineerSparePartList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { machineId, workId } = location.state || {}; // รับค่า machineId และ workId จาก state ที่ถูกส่งมา

  const [spareParts, setSpareParts] = useState<SparePartsRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSpareParts = async () => {
    if (!machineId) {
      console.error("machineId is undefined or null");
      setError("Invalid machine ID");
      return;
    }

    const url = `https://easy-service.prakasitj.com/Spare_parts_requests/getListInRequest/${machineId}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch spare parts. Response status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched spare parts data:", data);
      setSpareParts(data);
    } catch (error) {
      console.error("Error fetching spare parts:", error);
      setError("Error loading spare part details");
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, [machineId]);

  const handleBack = () => {
    navigate("/engineerPowerSupplyList", { state: { workId } });
  };

  const handleEdit = (sparePartId: number) => {
    navigate("/engineerSparePartEdit", { state: { sparePartId, workId, machineId } });
};

  const handleDelete = async (sparePartId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this spare part?");
    if (confirmed) {
        try {
            const url = 'https://easy-service.prakasitj.com/Spare_parts_requests/deleteSparePartsRequest';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: sparePartId }), // ใช้ชื่อฟิลด์ที่ API ต้องการ
            };

            const response = await fetch(url, options);
            const data = await response.text();
            console.log(data);

            if (response.ok) {
                alert("Spare part deleted successfully!");
                fetchSpareParts(); // รีเฟรชรายการหลังจากลบ
            } else {
                alert("Failed to delete spare part. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting spare part:", error);
            setError("An error occurred while deleting the spare part. Please try again.");
        }
    }
};
  const handleAdd = () => {
    navigate("/engineerAddSpareParts", { state: { workId, machineId } });
  };



  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">รายการอะไหล่ที่ต้องการ</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[500px] max-w-full mb-6 overflow-y-auto">
            {spareParts.length > 0 ? (
              spareParts.map((sparePart, index) => (
                <div key={sparePart.id} className="mb-4 bg-yellow-100 p-4 rounded-lg shadow-sm flex justify-between items-start">
                  <div>
                    <p><strong>รายการที่ {index + 1}</strong></p>
                    <p><strong>Name:</strong> {sparePart.name}</p> 
                    <p><strong>Sn:</strong> {sparePart.sn || "-"}</p> 
                    <p><strong>Unit:</strong> {sparePart.unit}</p>
                    <p><strong>Quantity:</strong> {sparePart.spare_parts_qty}</p>
                    <p><strong>Price:</strong> ฿{sparePart.price}</p>
                    <p><strong>Description:</strong> {sparePart.description || "-"}</p>    
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEdit(sparePart.id)}
                      className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sparePart.id)}
                      className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No spare part data available</p>
            )}
          </div>
        )}

        <div className="flex space-x-24 mt-4">
          <button onClick={handleBack} className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800">Back</button>
          <button onClick={handleAdd} className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600">Add</button>
        </div>
      </div>
    </>
  );
}
