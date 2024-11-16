import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBarEngineer";
import { useNavigate, useLocation } from "react-router-dom";

interface WorkDetails {
  id: number;
  customerID: number;
  address: string;
  province: string;
  user_id: string | null;
  userName?: string;
  userSurname?: string;
  status: number;
}

interface Machine {
  id: number;
  model: string;
  sn: string;
  warranty: boolean;
  rated: string;
  description: string;
  add_date: string;
}

interface SparePartRequest {
  price: number;
  spare_parts_qty: number;
}

interface AdditionalCost {
  id: number;
  description: string;
  cost: number;
  amount: number;
  unit: string;
  work_id: number;
}

export default function engineerSWork() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {};

  const [workDetails, setWorkDetails] = useState<WorkDetails | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [totalAdditionalCost, setTotalAdditionalCost] = useState<number>(0);
  const [totalRepairCost, setTotalRepairCost] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "งานที่ต้องไปตรวจ";
      case 3:
        return "งานที่ต้องไปซ่อม";
      default:
        return "สถานะไม่ทราบ";
    }
  };

  useEffect(() => {
    const fetchWorkDetails = async () => {
      const url = `https://easy-service.prakasitj.com/works/searchByID/${workId}`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to fetch work details");

        const data = await response.json();
        if (data.length > 0) {
          const work = data[0];
          setWorkDetails({
            id: work.id,
            customerID: work.customer_id,
            address: work.address,
            province: work.province,
            user_id: work.user_id,
            status: work.status,
          });

          fetchCustomerName(work.customer_id);
          fetchEngineerName(work.user_id);
          const machinesData = await fetchMachinesByWorkID(work.id);
          setMachines(machinesData);
          fetchAdditionalCosts(work.id);
          calculateRepairCost(machinesData);
        } else {
          setError("No work details found");
        }
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
      setCustomerName(data[0]?.name || "Unknown");
    } catch (error) {
      console.error("Error fetching customer name:", error);
      setCustomerName("Unknown");
    }
  };

  const fetchEngineerName = async (user_id: string | null) => {
    if (!user_id) return;

    const url = `https://easy-service.prakasitj.com/user/searchbyID/${user_id}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch engineer name");

      const data = await response.json();
      setWorkDetails((prev) => {
        if (prev) {
          return { ...prev, userName: data[0]?.name || "Unknown", userSurname: data[0]?.surname || "" };
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching engineer name:", error);
    }
  };

  const fetchMachinesByWorkID = async (workId: number): Promise<Machine[]> => {
    const url = `https://easy-service.prakasitj.com/Requests/getListBywork_id/${workId}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch machines");

      const data = await response.json();
      return data.map((machine: any) => ({
        id: machine.id,
        model: machine.model,
        sn: machine.sn,
        warranty: machine.warranty,
        rated: machine.rated,
        description: machine.description,
        add_date: machine.add_date,
      }));
    } catch (error) {
      console.error("Error fetching machines:", error);
      return [];
    }
  };

  const fetchAdditionalCosts = async (workId: number) => {
    const url = `https://easy-service.prakasitj.com/additionalcosts/getFromWorkId/${workId}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch additional costs");

      const data: AdditionalCost[] = await response.json();
      const totalCost = data.reduce((sum, cost) => sum + cost.cost, 0);
      setTotalAdditionalCost(totalCost);
    } catch (error) {
      console.error("Error fetching additional costs:", error);
    }
  };

  const calculateRepairCost = async (machines: Machine[]) => {
    try {
      let totalRepairCost = 0;

      for (const machine of machines) {
        if (machine.description.includes("(ไม่ต้องซ่อม)")) {
          continue;
        }
        const url = `https://easy-service.prakasitj.com/Spare_parts_requests/getListInRequest/${machine.id}`;
        const options = { method: "GET" };
        
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to fetch spare parts for machine");

        const data: SparePartRequest[] = await response.json();
        
        const machineCost = data.reduce((sum, part) => sum + part.price * part.spare_parts_qty, 0);
        totalRepairCost += machineCost;
      }
      
      setTotalRepairCost(totalRepairCost);
    } catch (error) {
      console.error("Error calculating repair cost:", error);
    }
  };

  const handleBack = () => {
    navigate("/workListSEngineer");
  };

  const handleEdit = (field: string) => {
    if (field === "Power Supply") {
      navigate("/engineerSPowerSupplyList", { state: { workId } });
    }
    else if (field === "An Cost") {
      navigate("/engineerSAnList", { state: { workId } });
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

            {machines.length > 0 ? (
              machines.map((machine, index) => (
                <p key={machine.id}>
                  รายละเอียดเครื่องซ่อมลำดับที่ {index + 1}: Model: {machine.model} SN: {machine.sn}
                </p>
              ))
            ) : (
              <p>No machine data available</p>
            )}

            <p><strong>ช่างผู้รับผิดชอบ:</strong> {workDetails.userName} {workDetails.userSurname || "-"}</p>
            <p><strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> ฿{totalRepairCost.toFixed(2)}</p>
            <p><strong>ค่าใช้จ่ายอื่นๆ:</strong> ฿{totalAdditionalCost.toFixed(2)}</p>
            <p><strong>สถานะการทำงาน:</strong> {getStatusText(workDetails.status)}</p>

            <div className="flex flex-col gap-2 mt-4 items-start">
              <button onClick={() => handleEdit("Power Supply")} className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600">
                View Power Supply
              </button>
                   
              <button onClick={() => handleEdit("An Cost")} className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600">
                View Additional Costs​
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
