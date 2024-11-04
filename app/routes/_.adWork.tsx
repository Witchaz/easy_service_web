import React, { useEffect, useState } from "react";
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

interface AdditionalCost {
  id: number;
  description: string;
  cost: number;
  amount: number;
  unit: string;
  work_id: number;
}

export default function adWork() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {};

  const [workDetails, setWorkDetails] = useState<WorkDetails | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [totalAdditionalCost, setTotalAdditionalCost] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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
          return {
            ...prev,
            userName: data[0]?.name || "Unknown",
            userSurname: data[0]?.surname || "",
          };
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

  const handleBack = () => {
    navigate("/adWorkList");
  };

  const handleEdit = (field: string) => {
    if (field === "Power Supply") {
      navigate("/adPowerSupply", { state: { workId } });
    } else if (field === "Location") {
      navigate("/adLocation", {
        state: { workId, customerID: workDetails?.customerID },
      });
    } else if (field === "Engineer") {
      navigate("/selectEngineer", {
        state: { workId, previousPage: "/adWork" },
      }); // Navigate with previousPage
    } else if (field === "AN Cost") {
      navigate("/adANCostList", { state: { workId } });
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">
          หน้างาน
        </h2>

        {workDetails ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-[800px] h-[500px] max-w-full mb-6">
            <p>
              <strong>Work ID:</strong> {workDetails.id}
            </p>
            <p>
              <strong>ชื่อลูกค้า:</strong> {customerName}
            </p>
            <p>
              <strong>สถานที่ซ่อม:</strong> {workDetails.address},{" "}
              {workDetails.province}
            </p>

            {machines.length > 0 ? (
              machines.map((machine, index) => (
                <p key={machine.id}>
                  รายละเอียดเครื่องซ่อมลำดับที่ {index + 1}: Model:{" "}
                  {machine.model} SN: {machine.sn}
                </p>
              ))
            ) : (
              <p>No machine data available</p>
            )}

            <p>
              <strong>ช่างผู้รับผิดชอบ:</strong> {workDetails.userName}{" "}
              {workDetails.userSurname || "-"}
            </p>
            <p>
              <strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> 0
            </p>
            <p>
              <strong>ค่าใช้จ่ายอื่นๆ:</strong> ฿
              {totalAdditionalCost.toFixed(2)}
            </p>
            <p>
              <strong>สถานะการทำงาน:</strong> {workDetails.status}
            </p>

            <div className="flex flex-col gap-2 mt-4 items-start">
              <button
                onClick={() => handleEdit("Power Supply")}
                className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600"
              >
                Edit Power Supply
              </button>
              <button
                onClick={() => handleEdit("Location")}
                className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600"
              >
                Edit Location
              </button>
              <button
                onClick={() => handleEdit("Engineer")}
                className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600"
              >
                Edit Engineer
              </button>
              <button
                onClick={() => handleEdit("AN Cost")}
                className="bg-lime-500 text-white py-1 px-3 rounded-lg hover:bg-lime-600"
              >
                Edit AN Cost
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="flex justify-between w-full max-w-[600px]">
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
