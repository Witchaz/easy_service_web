import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface SparePartsRequest {
  id: number;
  request_id: number;
  spare_part_id: number;
  spare_parts_qty: number;
  description: string;
  sn: string;
}

export default function EngineerSparePartEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sparePartId, workId, machineId } = location.state || {}; // รับค่า sparePartId, workId, machineId จาก state ที่ถูกส่งมา

  const [sparePart, setSparePart] = useState<SparePartsRequest | null>(null);
  const [sparePartsQty, setSparePartsQty] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sn, setSn] = useState<string>("");

  useEffect(() => {
    const fetchSparePart = async () => {
      if (!sparePartId) {
        console.error("sparePartId is undefined or null");
        return;
      }

      const url = `https://easy-service.prakasitj.com/Spare_parts_requests/getById/${sparePartId}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Failed to fetch spare part. Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched spare part data:", data);
        setSparePart(data[0]);
        setSparePartsQty(data[0].spare_parts_qty);
        setDescription(data[0].description || "-");
        setSn(data[0].sn || "-");
      } catch (error) {
        console.error("Error fetching spare part:", error);
        }
        
    };

    fetchSparePart();
  }, [sparePartId]);

  const handleSave = async () => {
  if (sparePartsQty <= 0) {
    alert("จำนวนอะไหล่ต้องมากกว่า 0");
    return;
  }

  const url = `https://easy-service.prakasitj.com/Spare_parts_requests/editSparePartsRequest`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: sparePartId,
      spare_part_id: sparePart?.spare_part_id,
      spare_parts_qty: sparePartsQty,
      description: description || "-",
      sn: sn || "-"
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.text();
    console.log("Updated spare part data:", data);

    if (response.ok) {
      alert("ข้อมูลอะไหล่ถูกแก้ไขเรียบร้อยแล้ว!");
      navigate("/engineerSparePartList", { state: { workId, machineId } });
    } else {
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่ กรุณาลองใหม่อีกครั้ง");
    }
  } catch (error) {
    console.error("Error updating spare part:", error);
    alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่ กรุณาลองใหม่อีกครั้ง");
  }
};


  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">แก้ไขข้อมูลอะไหล่</h2>
        {sparePart ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-[600px] max-w-full mb-6">
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
            <div className="flex space-x-4 mt-4">
              <button onClick={() => navigate(-1)} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                ยกเลิก
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                ยืนยัน
              </button>
            </div>
          </div>
        ) : (
          <p>กำลังโหลดข้อมูลอะไหล่...</p>
        )}
      </div>
    </>
  );
}
