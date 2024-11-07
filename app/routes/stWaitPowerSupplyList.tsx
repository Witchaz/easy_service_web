import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface Machine {
  id: number;
  sn: string;
  model: string;
  warranty: boolean; // Change warranty to boolean
  rated: string;
  add_date: Date;
}

export default function stWaitPowerSupplyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {}; // Receive workId

  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      const url = `https://easy-service.prakasitj.com/Requests/getListByWorkID/${workId}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to fetch machines");

        const data = await response.json();
        // Convert warranty field to boolean
        const formattedData = data.map((machine: any) => ({
          ...machine,
          warranty: Boolean(machine.warranty), // Ensure warranty is a boolean
        }));
        setMachines(formattedData);
      } catch (error) {
        console.error("Error fetching machines:", error);
        setError("Error loading machine details");
      }
    };

    if (workId) fetchMachines();
  }, [workId]);

  const handleBack = () => {
    navigate("/stWaitWork", { state: { workId } });
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">จำนวนเครื่องที่ต้องการซ่อม</h2>
        
        {/* Machine list container with fixed height and scroll */}
        <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[500px] max-w-full mb-6 overflow-y-auto" style={{ maxHeight: "400px" }}>
          {machines.map((machine, index) => (
            <div key={machine.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
              <div>
                <p><strong>รายละเอียดเครื่องซ่อมลำดับที่ {index + 1}</strong></p>
                <p><strong>Serial Number:</strong> {machine.sn}</p>
                <p><strong>Model / Type:</strong> {machine.model}</p>
                <p><strong>Warranty:</strong> {machine.warranty ? "Yes" : "No"}</p> {/* Display as Yes or No */}
                <p><strong>Rated:</strong> {machine.rated}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between w-full max-w-[600px]">
          <button onClick={handleBack} className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800">
            Back
          </button>
         
        </div>
      </div>
    </>
  );
}
