import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom"; // เพิ่ม useLocation

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

export default function WorkEngineer() {
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // รับค่า location
    
  // รับค่า id จาก state
    const { id } = location.state || {};
    console.log("aa");
    console.log(id);
    
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
      if (data.length > 0) {
        return `${data[0].name} ${data[0].surname}`;
      }
      return "Unknown";
    } catch (error) {
      console.error("Error fetching engineer name:", error);
      return "Unknown";
    }
  };

  const fetchMachinesByWorkID = async (work_id: number): Promise<Machine[]> => {
    const url = `https://easy-service.prakasitj.com/Requests/getListBywork_id/${work_id}`;
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch machine data");

      const data = await response.json();
      return data.map((machine: any) => ({
        id: machine.id,
        model: machine.model,
        sn: machine.sn,
        warranty: machine.warranty,
        description: machine.description,
        rated: machine.rated,
        add_date: machine.add_date,
      }));
    } catch (error) {
      console.error("Error fetching machine data:", error);
      return [];
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
    if (!id) {
      setError("No ID provided.");
      return;
    }

    const url = `https://easy-service.prakasitj.com/works/getWorksListByStatus/1`; // ใช้ API เพื่อดึงงานที่มี status 1
    const options = { method: "GET" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Failed to fetch works, status: ${response.status}`);

      const data: Work[] = await response.json();

      // กรองงานที่มี user_id ตรงกับ id ที่เรารับมา
      const filteredWorks = data.filter(work => work.user_id === id);

      const worksWithDetails = await Promise.all(
        filteredWorks.map(async (work) => {
          const customerName = await fetchCustomerName(work.customer_id);
          const userName = await fetchEngineerName(work.user_id);
          const machines = await fetchMachinesByWorkID(work.id);
          const additionalCost = await fetchAdditionalCost(work.id);

          return { ...work, customerName, userName, machines, additionalCost };
        })
      );

      setWorks(worksWithDetails);
    } catch (err) {
      setError("Error loading works data");
      console.error(err);
    }
  };

  fetchWorks();
}, [id]); // เพิ่ม [id] เพื่อให้ทำงานใหม่เมื่อ id เปลี่ยนแปลง

  const handleSelect = (workId: number) => {
    navigate("/stOneWork", { state: { workId } });
  };

  const handleNewButtonAction = async (workId: number) => {
    const work = works.find((w) => w.id === workId);
    if (!work) {
      alert("Work not found.");
      return;
    }

    if (!work.user_id) {
      alert("This work has no assigned engineer. Please assign an engineer first.");
      return;
    }

    if (!work.machines || work.machines.length === 0) {
      alert("This work has no machines. Please ensure there is at least one machine.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to confirm this work?");
    if (confirmed) {
      const url = 'https://easy-service.prakasitj.com/works/setWorkStatus';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: workId,
          status: 1,
        }),
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
          throw new Error("Failed to confirm the work: " + errorText);
        }

        const data = await response.text();
        console.log("Work status updated:", data);
        alert("Work confirmed successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error confirming work:", error);
        alert("Failed to confirm the work. Please try again.");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          จำนวนงานที่รอเลือกช่าง{id}
        </h2>
        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {works.map((work) => (
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
                <p><strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> 0</p>
                <p><strong>ค่าใช้จ่ายอื่นๆ:</strong> ฿{work.additionalCost?.toFixed(2) || "0"}</p>
                <p><strong>สถานะการทำงาน:</strong> {work.status}</p>
              </div>
              <div className="flex flex-col items-center">
                <button
                  className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600"
                  onClick={() => handleSelect(work.id)}
                >
                  Select
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2"
                  onClick={() => handleNewButtonAction(work.id)}
                >
                  Confirm Work
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
