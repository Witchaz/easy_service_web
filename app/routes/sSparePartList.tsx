import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface SparePartsRequest {
  id: number;
  request_id: number;
  spare_part_id: number;
  name: string;
  unit: string;
  price: number;
  spare_parts_qty: number;
  description: string;
  sn: string;
  add_date: Date;
}

export default function sSparePartList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { machineId, workId, originPage } = location.state || {}; 

  const [spareParts, setSpareParts] = useState<SparePartsRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSpareParts = async () => {
    if (!machineId) {
      setError("Invalid machine ID");
      return;
    }

    const url = `https://easy-service.prakasitj.com/Spare_parts_requests/getListInRequest/${machineId}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Failed to fetch spare parts. Response status: ${response.status}`);
      const data = await response.json();
      setSpareParts(data);
    } catch (error) {
      setError("Error loading spare part details");
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, [machineId]);

  const handleBack = () => {
    switch (originPage) {
      case "engineerWork":
        navigate("/engineerWork", { state: { workId } });
        break;
      case "engineerSPowerSupplyList":
        navigate("/engineerSPowerSupplyList", { state: { workId } });
        break;
      default:
        navigate(-1);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">รายการอะไหล่</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[500px] max-w-full mb-6 overflow-y-auto">
            {spareParts.length > 0 ? (
              spareParts.map((sparePart, index) => (
                <div key={sparePart.id} className="mb-4 bg-yellow-100 p-4 rounded-lg shadow-sm">
                  <p><strong>รายการที่ {index + 1}</strong></p>
                  <p><strong>Name:</strong> {sparePart.name}</p> 
                  <p><strong>Sn:</strong> {sparePart.sn || "-"}</p> 
                  <p><strong>Unit:</strong> {sparePart.unit}</p>
                  <p><strong>Quantity:</strong> {sparePart.spare_parts_qty}</p>
                  <p><strong>Price:</strong> ฿{sparePart.price}</p>
                  <p><strong>Description:</strong> {sparePart.description || "-"}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500 text-center">No spare part data available</p>
              </div>
            )}
          </div>
        )}
        <div className="flex space-x-24 mt-4">
          <button onClick={handleBack} className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800">Back</button>
        </div>
      </div>
    </>
  );
}
