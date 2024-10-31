import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface WorkDetails {
  id: string;
  customerName: string;
  address: string;
  province: string;
  details: Array<{
    model: string;
    serialNumber: string;
  }>;
  engineer: string;
  powerSupply: number;
  partsCost: number;
  additionalExpenses: number;
  status: number;
}

export default function sWork() {
  const [work, setWork] = useState<WorkDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { workId } = location.state || {};

  useEffect(() => {
    if (workId) {
      const fetchWorkDetails = async () => {
        try {
          const response = await fetch(`https://easy-service.prakasitj.com/works/searchByID/${workId}`);
          if (!response.ok) throw new Error(`Failed to fetch work details, status: ${response.status}`);
          
          const data = await response.json();
          setWork(data);
        } catch (err) {
          setError("Error loading work data");
          console.error(err);
        }
      };

      fetchWorkDetails();
    }
  }, [workId]);

  const handleBack = () => {
    navigate("/workList");
  };

  const handleEdit = (type: string) => {
    // Implement navigation for editing different fields if required
    console.log(`Editing ${type}`);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!work) {
    return <p className="text-center">Loading work details...</p>;
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          หน้างาน
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <div>
            <p><strong>Work{work.id}</strong></p>
            <p><strong>ชื่อลูกค้า:</strong> {work.customerName}</p>
            <p><strong>สถานที่ซ่อม:</strong> {work.address}, {work.province}</p>
            {work.details.length > 0 ? (
              work.details.slice(0, 3).map((detail, index) => (
                <p key={index}><strong>รายละเอียดเครื่องซ่อมลำดับที่ {index + 1}:</strong> Model: {detail.model}, Serial Number: {detail.serialNumber}</p>
              ))
            ) : (
              <p>รายละเอียด: -</p>
            )}
            {work.details.length > 3 && <p>...</p>}
            <p><strong>ช่างผู้รับผิดชอบ:</strong> {work.engineer}</p>
            <p><strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> ฿{work.powerSupply}</p>
            <p><strong>ค่าใช้จ่ายอื่นๆ:</strong> ฿{work.partsCost}</p>
            <p><strong>สถานะการทำงาน:</strong> {work.status}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button onClick={() => handleEdit("powerSupply")} className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
              Edit Power Supply
            </button>
            <button onClick={() => handleEdit("location")} className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
              Edit Location
            </button>
            <button onClick={() => handleEdit("engineer")} className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
              Edit Engineer
            </button>
            <button onClick={() => handleEdit("status")} className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
              Edit Status
            </button>
            <button onClick={() => handleEdit("partsCost")} className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
              Edit Parts Cost
            </button>
            <button onClick={() => handleEdit("additionalCost")} className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600">
              Edit AN Cost
            </button>
          </div>
        </div>
        <div className="flex justify-between w-full max-w-2xl mt-6">
          <button onClick={handleBack} className="bg-black text-white py-2 px-4 rounded-lg">
            Back
          </button>
          <button className="bg-lime-500 text-white py-2 px-4 rounded-lg">
            Save
          </button>
        </div>
      </div>
    </>
  );
}
