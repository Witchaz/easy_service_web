import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface WorkDetails {
  id: number;
  customerName: string;
  address: string;
  province: string;
  userID: string;
  status: number;
}

interface Machine {
  id: number;
  model: string;
  serialNumber: string;
  warranty: boolean;
  description: string;
  rated: string;
}

export default function stWaitWork() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {};

  const [workDetails, setWorkDetails] = useState<WorkDetails | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkDetails = async () => {
      const url = `https://easy-service.prakasitj.com/works/searchByID/${workId}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to fetch work details");

        const data = await response.json();
        setWorkDetails(data[0]);

        fetchCustomerName(data[0].customerID);
        fetchMachinesByWorkID(data[0].id);
      } catch (error) {
        console.error("Error fetching work details:", error);
        setError("Error loading work details");
      }
    };

    if (workId) fetchWorkDetails();
  }, [workId]);

  const fetchCustomerName = async (customerID: number) => {
    const url = `https://easy-service.prakasitj.com/customers/getByID/${customerID}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch customer name");

      const data = await response.json();
      setCustomerName(data[0].name);
    } catch (error) {
      console.error("Error fetching customer name:", error);
      setCustomerName("Unknown");
    }
  };

  const fetchMachinesByWorkID = async (workId: number) => {
    const url = `https://easy-service.prakasitj.com/Requests/getListByWorkID/${workId}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch machines");

      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error("Error fetching machines:", error);
      setError("Error loading machine details");
    }
  };

  const handleBack = () => {
    navigate("/workWaitList");
  };

  

  const handleEdit = (field: string) => {
    if (field === "Power Supply") {
      navigate("/stWaitPowerSupplyList", { state: { workId } });
    }
    else if(field === 'AN Cost'){
        navigate("/expensesList", { state: { workId } });
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">หน้างาน</h2>
        
        {workDetails ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[500px] max-w-full mb-6">
            <p><strong>Work ID:</strong> {workDetails.id}</p>
            <p><strong>ชื่อลูกค้า:</strong> {customerName}</p>
            <p><strong>สถานที่ซ่อม:</strong> {workDetails.address}, {workDetails.province}</p>

            {machines.slice(0, 3).map((machine, index) => (
              <p key={machine.id}>รายละเอียดเครื่องซ่อมลำดับที่ {index + 1}: Model: {machine.model}</p>
            ))}
            {machines.length > 3 && <p>...</p>}

            <p><strong>ช่างผู้รับผิดชอบ:</strong> {workDetails.userID}</p>
            <p><strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> 0</p>
            <p><strong>ค่าใช้จ่ายอื่นๆ:</strong> 0</p>
            <p><strong>สถานะการทำงาน:</strong> {workDetails.status}</p>

            <div className="flex flex-col gap-2 mt-4 items-start">
                <button onClick={() => handleEdit("Power Supply")} className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600">
                    View Power Supply
                </button>
                <button onClick={() => handleEdit("AN Cost")} className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600">
                    View AN Cost
                </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="flex justify-between w-full max-w-[600px]">
          <button onClick={handleBack} className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800">Back</button>
        </div>
      </div>
    </>
  );
}

