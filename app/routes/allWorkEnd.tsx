import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

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

export default function AllWorkEnd() {
  const [works, setWorks] = useState<Work[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: null, label: "ทั้งหมด" },
    { value: 4, label: "งานที่เสร็จสิ้น" },
    { value: 5, label: "งานที่ถูกยกเลิก" },
  ];

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
      const status = statusFilter !== null ? statusFilter : "4,5";
      const url = `https://easy-service.prakasitj.com/works/getWorksListByStatus/${status}`;
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
  }, [statusFilter]);

  const handleSelect = (workId: number) => {
    navigate("/workEnd", { state: { workId } });
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "งานที่รอการเลือกช่างให้ไปตรวจ";
      case 1:
        return "งานที่ช่างกำลังตรวจสอบ";
      case 2:
        return "งานที่รอการยืนยันให้ไปซ่อม";
      case 3:
        return "งานที่ช่างกำลังซ่อม";
      case 4:
        return "งานที่เสร็จสิ้น";
      case 5:
        return "งานที่ถูกยกเลิก";
      default:
        return "สถานะไม่ทราบ";
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          งานที่จบแล้ว
        </h2>

        <select
          className="mb-6 p-2 border border-gray-300 rounded"
          value={statusFilter ?? ""}
          onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : null)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value ?? ""}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {works.length > 0 ? (
            works.map((work) => (
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
                    Select
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">ยังไม่มีงานที่ทำเสร็จ</p>
          )}
        </div>
        <a href="/mainPage">
          <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600 mt-4">Back</button>
        </a>
      </div>
    </>
  );
}
