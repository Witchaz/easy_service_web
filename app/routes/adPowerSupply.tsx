import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface Machine {
  id: number;
  model: string;
  sn: string;
  rated: string;
  description: string;
  warranty: boolean;
  add_date: string;
}

export default function adPowerSupplyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {}; // รับค่า workId จาก state ที่ถูกส่งมา

  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      if (!workId) {
        console.error("workId is undefined or null");
        setError("Invalid work ID");
        return;
      }

      const url = `https://easy-service.prakasitj.com/Requests/getListBywork_id/${workId}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Failed to fetch machines. Response status: ${response.status}`);
        }

        const data = await response.json();
        setMachines(data);
      } catch (error) {
        console.error("Error fetching machines:", error);
        setError("Error loading machine details");
      }
    };

    fetchMachines();
  }, [workId]);

  const handleBack = () => {
    navigate("/adWork", { state: { workId } });
  };

  const handleEditDetails = (machineId: number) => {
    navigate("/sSparePartList", { state: { machineId, workId } });
  };

  const handleRepairAction = async (machine: Machine) => {
    const confirmed = window.confirm("คุณต้องการดำเนินการนี้หรือไม่?");
    if (confirmed) {
      // Toggle "(ไม่ต้องซ่อม)" in the description
      const newDescription = machine.description.includes("(ไม่ต้องซ่อม)")
        ? machine.description.replace(" (ไม่ต้องซ่อม)", "") // Remove "(ไม่ต้องซ่อม)"
        : `${machine.description} (ไม่ต้องซ่อม)`; // Add "(ไม่ต้องซ่อม)"

      const url = "https://easy-service.prakasitj.com/Requests/editRequest";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: machine.id,
          model: machine.model,
          sn: machine.sn,
          rated: machine.rated,
          description: newDescription,
        }),
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to update machine details");

        const data = await response.text();
        console.log("Updated machine data:", data);
        alert("การดำเนินการสำเร็จ");

        // Update the description in the state
        setMachines((prevMachines) =>
          prevMachines.map((m) =>
            m.id === machine.id ? { ...m, description: newDescription } : m
          )
        );
      } catch (error) {
        console.error("Error updating machine:", error);
        alert("การดำเนินการล้มเหลว");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">
          รายการเครื่องที่ต้องการซ่อม
        </h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[500px] max-w-full mb-6 overflow-y-auto">
            {machines.length > 0 ? (
              machines.map((machine, index) => (
                <div
                  key={machine.id}
                  className="mb-4 bg-yellow-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>เครื่องที่ {index + 1}</strong>
                    </p>
                    <p>
                      <strong>Model:</strong> {machine.model}
                    </p>
                    <p>
                      <strong>SN:</strong> {machine.sn}
                    </p>
                    <p>
                      <strong>Rated:</strong> {machine.rated}
                    </p>
                    <p>
                      <strong>Description:</strong> {machine.description}
                    </p>
                    <p>
                      <strong>Warranty:</strong> {machine.warranty ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEditDetails(machine.id)}
                      className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600"
                    >
                      ดูอะไหล่ที่ต้องใช้
                    </button>
                    <button
                      onClick={() => handleRepairAction(machine)}
                      className={`py-2 px-4 rounded-lg text-white ${machine.description.includes("(ไม่ต้องซ่อม)") ? "bg-blue-500 hover:bg-blue-600":"bg-red-500 hover:bg-red-600" }`}
                    >
                      {machine.description.includes("(ไม่ต้องซ่อม)") ? "ซ่อมแซม" : "ไม่ต้องซ่อม"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No machine data available</p>
            )}
          </div>
        )}

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleBack}
            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}
