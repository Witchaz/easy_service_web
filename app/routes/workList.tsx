import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

interface Work {
  id: string;
  mail_date: string;
  service_date: string | null;
  status: number;
  userID: string | null;
  customerID: number;
  customerName?: string;
  address: string;
  province: string;
  add_date: string;
  machines?: Machine[];
}

interface Machine {
  id: string;
  model: string;
  serialNumber: string;
  warranty: boolean;
  description: string;
  rated: string;
  add_date: string;
}

export default function WorkList() {
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCustomerName = async (customerID: number): Promise<string> => {
    const url = `https://easy-service.prakasitj.com/customers/getByID/${customerID}`;
    const options = { method: "GET" };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data[0].name;
    } catch (error) {
      console.error("Error fetching customer name:", error);
      return "Unknown";
    }
  };

  const fetchMachinesByWorkID = async (workID: string): Promise<Machine[]> => {
    const url = `https://easy-service.prakasitj.com/Requests/getListByWorkID/${workID}`;
    const options = { method: "GET" };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data.map((machine: any) => ({
        id: machine.id,
        model: machine.model,
        serialNumber: machine.sn,
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

  useEffect(() => {
    const fetchWorks = async () => {
      const url = "https://easy-service.prakasitj.com/works/getWorksList";
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch works, status: ${response.status}`);

        const data: Work[] = await response.json();

        const worksWithDetails = await Promise.all(
          data.map(async (work) => {
            const customerName = await fetchCustomerName(work.customerID);
            const machines = await fetchMachinesByWorkID(work.id);
            return { ...work, customerName, machines };
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

  const handleSelect = (workId: string) => {
    navigate("/selectEngineer", { state: { workId } });
  };

  const handleNewButtonAction = (workId: string) => {
    // กำหนดการกระทำเมื่อกดปุ่มใหม่
    alert(`New action for work ID: ${workId}`);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          จำนวนงานที่รอเลือกช่าง
        </h2>
        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {works.map((work) => (
            <div key={work.id} className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-between items-start">
              <div>
                <p><strong>Work{work.id}</strong></p>
                <p><strong>ชื่อลูกค้า:</strong> {work.customerName}</p>
                <p><strong>สถานที่ซ่อม:</strong> {work.address}, {work.province}</p>
                {work.machines && work.machines.slice(0, 2).map((machine, index) => (
                  <p key={machine.id}>
                    รายละเอียดเครื่องซ่อมลำดับที่ {index + 1} : Model: {machine.model.slice(0, 5)}...
                  </p>
                ))}
                {work.machines && work.machines.length > 2 && <p>...</p>}
                <p><strong>ช่างผู้รับผิดชอบ:</strong> {work.userID || "-"}</p>
                <p><strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> 0</p>
                <p><strong>ค่าใช้จ่ายอื่นๆ:</strong> 0</p>
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
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2" // เพิ่ม mt-2 เพื่อเว้นระยะ
                  onClick={() => handleNewButtonAction(work.id)}
                >
                  New Button
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
