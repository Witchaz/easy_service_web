import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBarEngineer";
import { useNavigate } from "react-router-dom";
import { useID } from "../context/IDContext";

interface Work {
  id: number;
  mail_date: string;
  service_date: string | null;
  status: number;
  user_id: string | null;
  userName?: string;
  customer_id: number;
  customerName?: string;
  address: string;
  province: string;
  add_date: string;
  machines?: Machine[];
  additionalCost?: number;
  repairCost?: number;
}

interface Machine {
  id: number;
  model: string;
  sn: string;
  warranty: boolean;
  description: string;
  rated: string;
  add_date: string;
}

interface SparePartEngineer {
  id: number;
  spare_part_id: number;
  name: string;
  quantity: number;
  user_id: number;
}

export default function workListSEngineer() {
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id: engineerId } = useID();

  const fetchCustomerName = async (customer_id: number): Promise<string> => {
    const url = `https://easy-service.prakasitj.com/customers/getByID/${customer_id}`;
    const options = { method: "GET" };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data[0]?.name || "Unknown";
    } catch (error) {
      console.error("Error fetching customer name:", error);
      return "Unknown";
    }
  };

  const fetchEngineerName = async (user_id: string | null): Promise<string> => {
    if (!user_id) return "-";
    const url = `https://easy-service.prakasitj.com/user/searchbyID/${user_id}`;
    const options = { method: "GET" };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data.length > 0 ? `${data[0].name} ${data[0].surname}` : "Unknown";
    } catch (error) {
      console.error("Error fetching engineer name:", error);
      return "Unknown";
    }
  };

  const fetchMachinesByWorkID = async (workId: number): Promise<Machine[]> => {
  const url = `https://easy-service.prakasitj.com/Requests/getListBywork_id/${workId}`;
  const options = { method: "GET" };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to fetch machines");

    const data = await response.json();

    // Filter out machines where the description contains "(ไม่ต้องซ่อม)"
    const filteredMachines = data.filter((machine: any) => !machine.description.includes("(ไม่ต้องซ่อม)"));

    return filteredMachines.map((machine: any) => ({
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


  const fetchRepairCost = async (machineId: number): Promise<number> => {
    const url = `https://easy-service.prakasitj.com/Spare_parts_requests/getListInRequest/${machineId}`;
    const options = { method: "GET" };
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch spare parts data");

      const data = await response.json();
      return data.reduce(
        (total: number, part: { price: number; spare_parts_qty: number }) =>
          total + part.price * part.spare_parts_qty,
        0
      );
    } catch (error) {
      console.error("Error fetching repair cost:", error);
      return 0;
    }
  };

  const fetchAdditionalCost = async (work_id: number): Promise<number> => {
    const url = `https://easy-service.prakasitj.com/additionalcosts/getFromWorkId/${work_id}`;
    const options = { method: "GET" };
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch additional costs");

      const data = await response.json();
      return data.reduce((total: number, cost: { cost: number }) => total + cost.cost, 0);
    } catch (error) {
      console.error("Error fetching additional costs:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchWorks = async () => {
      const url = `https://easy-service.prakasitj.com/works/getWorksListByStatus/3`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch works, status: ${response.status}`);

        const data: Work[] = await response.json();
        const worksWithDetails = await Promise.all(
          data.map(async (work) => {
            const customerName = await fetchCustomerName(work.customer_id);
            const userName = await fetchEngineerName(work.user_id);
            const machines = await fetchMachinesByWorkID(work.id);
            const additionalCost = await fetchAdditionalCost(work.id);

            let repairCost = 0;
            for (const machine of machines) {
              if (!machine.description.includes("(ไม่ต้องซ่อม)")) {
                repairCost += await fetchRepairCost(machine.id);
              }
            }

            return { ...work, customerName, userName, machines, additionalCost, repairCost };
          })
        );

        setWorks(worksWithDetails);
      } catch (err) {
        setError("Error loading works data");
        console.error(err);
      }
    };

    fetchWorks();
  }, []);

  const handleSelect = (workId: number) => {
    navigate("/engineerSWork", { state: { workId } });
  };

  const handleNewButtonAction = async (workId: number) => {
  const confirmed = window.confirm("Are you sure you want to confirm this work?");
  if (!confirmed) return;

  const work = works.find((w) => w.id === workId);
  if (!work) {
    alert("Work not found.");
    return;
  }

  try {
    // Fetch engineer's spare parts inventory
    const url = `https://easy-service.prakasitj.com/spare_parts_engineer/getFromUserID/${engineerId}`;
    const options = { method: "GET" };
    const engineerPartsResponse = await fetch(url, options);
    const engineerSpareParts = await engineerPartsResponse.json();

    // Check spare parts for each machine in the work
    for (const machine of work.machines || []) {
      if (machine.description.includes("(ไม่ต้องซ่อม)")) {
        console.log(`Skipping machine ${machine.id} due to '(ไม่ต้องซ่อม)' in description.`);
        continue; // Skip machines marked as "(ไม่ต้องซ่อม)"
      }

      const machinePartsResponse = await fetch(
        `https://easy-service.prakasitj.com/Spare_parts_requests/getListInRequest/${machine.id}`,
        { method: "GET" }
      );
      const machineSpareParts = await machinePartsResponse.json();

      for (const machinePart of machineSpareParts) {
        // Find matching spare part by `spare_part_id` in the engineer's inventory
        const matchingEngineerPart = engineerSpareParts.find(
          (part: { spare_part_id: any }) => part.spare_part_id === machinePart.spare_part_id
        );

        if (matchingEngineerPart) {
          if (matchingEngineerPart.quantity >= machinePart.spare_parts_qty) {
            // Calculate the new quantity after usage
            const newQuantity = matchingEngineerPart.quantity - machinePart.spare_parts_qty;

            // Update the quantity in the database
            await fetch(`https://easy-service.prakasitj.com/spare_parts_engineer/editSparePartsEngineer`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: matchingEngineerPart.spare_part_engineer_id,
                spare_part_id: machinePart.spare_part_id,
                quantity: newQuantity >= 0 ? newQuantity : 0,
                user_id: engineerId,
              }),
            });
          } else {
            alert(`Insufficient quantity of spare part: ${machinePart.name}`);
            return;
          }
        } else {
          alert(`Spare part ${machinePart.name} is not available in the engineer's inventory.`);
          return;
        }
      }
    }

    // Confirm work status update
    const confirmUrl = 'https://easy-service.prakasitj.com/works/setWorkStatus';
    const confirmOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: workId,
        status: work.status + 1,
      }),
    };

    const confirmResponse = await fetch(confirmUrl, confirmOptions);
    if (!confirmResponse.ok) throw new Error("Failed to confirm the work.");

    alert("Work confirmed and spare parts updated successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating work and spare parts:", error);
    alert("Failed to confirm the work. Please try again.");
  }
};


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
  
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          งานทั้งหมดที่ต้องไปซ่อม
        </h2>
        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {works.length > 0 ? (
            works
              .filter((work) => work.user_id === engineerId)
              .map((work) => (
                <div key={work.id} className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-between items-start">
                  <div>
                    <p><strong>Work {work.id}</strong></p>
                    <p><strong>ชื่อลูกค้า:</strong> {work.customerName}</p>
                    <p><strong>สถานที่ซ่อม:</strong> {work.address}, {work.province}</p>
                    {work.machines && work.machines.slice(0, 3).map((machine, index) => (
                      <p key={machine.id}>
                        รายละเอียดเครื่องซ่อมลำดับที่ {index + 1} : Model: {machine.model.slice(0, 5)}...
                      </p>
                    ))}
                    {work.machines && work.machines.length > 3 && <p>...</p>}
                    <p><strong>ช่างผู้รับผิดชอบ:</strong> {work.userName || "-"}</p>
                    <p><strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> ฿{work.repairCost?.toFixed(2) || "0"}</p>
                    <p><strong>ค่าใช้จ่ายอื่นๆ:</strong> ฿{work.additionalCost?.toFixed(2) || "0"}</p>
                    <p><strong>สถานะการทำงาน:</strong> {getStatusText(work.status)}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600"
                      onClick={() => handleSelect(work.id)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2"
                      onClick={() => handleNewButtonAction(work.id)}
                    >
                      Confirm Work
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-lg font-semibold text-gray-600">ยังไม่มีงานที่ต้องไปซ่อม</p>
          )}
        </div>
        <a href="/mainPageEngineer">
          <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600 mt-4">Back</button>
        </a>
      </div>
    </>
  );
}
