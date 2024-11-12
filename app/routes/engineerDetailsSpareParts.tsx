import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface SparePartsRequest {
  id: number;
  request_id: number;
  spare_part_id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  add_date: string;
  spare_parts_qty: number;
  sn: string;
}

export default function EngineerDetailsSpareParts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSparePart, workId, machineId } = location.state || {}; // Retrieve values from the state
  const [sparePartName, setSparePartName] = useState<string>(""); // New state for name
  const [sparePartsQty, setSparePartsQty] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sn, setSn] = useState<string>("");

  useEffect(() => {
    const fetchSparePart = async () => {
      if (!selectedSparePart) {
        console.error("selectedSparePart is undefined or null");
        return;
      }

      const url = `https://easy-service.prakasitj.com/spare_parts/getByID/${selectedSparePart}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("Fetched spare part data:", data);

        if (data && data.length > 0) {
          const sparePartData = data[0];
          setSparePartName(sparePartData.name); // Set name in state
        }
      } catch (error) {
        console.error("Error fetching spare part:", error);
      }
    };

    fetchSparePart();
  }, [selectedSparePart]);

  const handleSave = async () => {
    if (sparePartsQty <= 0) {
      alert("จำนวนอะไหล่ต้องมากกว่า 0");
      return;
    }

    const url = 'https://easy-service.prakasitj.com/Spare_parts_requests/insertNewSparePartsRequest';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_id: machineId,
        spare_part_id: selectedSparePart,
        spare_parts_qty: sparePartsQty,
        description: description || "-",
        sn: sn || "-"
      })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.text();
      console.log("Inserted new spare part request:", data);

      if (response.ok) {
        alert("อะไหล่ถูกเพิ่มเรียบร้อยแล้ว!");
        navigate("/engineerSparePartList", { state: { workId, machineId } });
      } else {
        alert("เกิดข้อผิดพลาดในการเพิ่มอะไหล่ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error inserting spare part request:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มอะไหล่ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">เพิ่มอะไหล่ที่ใช้</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md w-[600px] max-w-full mb-6">
          <div className="mb-4">
            <p className="text-xl font-semibold text-gray-700">อะไหล่ที่เลือก: {sparePartName}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Spare Part Quantity</label>
            <input
              type="number"
              value={sparePartsQty}
              onChange={(e) => setSparePartsQty(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Serial Number (SN)</label>
            <input
              type="text"
              value={sn}
              onChange={(e) => setSn(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => navigate(-1)} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
              ยกเลิก
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
