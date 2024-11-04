import React, { useEffect, useState } from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate, useLocation, useParams } from "react-router-dom";

interface Work {
  id: number;
  mail_date: string;
  service_date: string | null;
  status: number;
  user_id: string | null;
  customer_id: number;
  address: string;
  province: string;
  add_date: string;
  machines?: Machine[];
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = parseInt(params.id || "0", 10);
  const response = await fetch(
    `https://easy-service.prakasitj.com/user/searchbyID/${id}`
  );
  if (!response.ok) {
    throw new Response("Failed to fetch work details", {
      status: response.status,
    });
  }
  return json(await response.json());
};

export default function WorkList() {
  const location = useLocation();
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = location.state?.userId; // Assuming userId is passed through state
  console.log("User ID:", userId);
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
      return await response.json();
    } catch (error) {
      console.error("Error fetching machine data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchWorks = async () => {
      const url = `https://easy-service.prakasitj.com/works/getWorksList`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok)
          throw new Error(`Failed to fetch works, status: ${response.status}`);

        const data: Work[] = await response.json();
        console.log("Fetched works data:", data); // ตรวจสอบข้อมูลที่ดึงมา

        // กรองงานตาม user_id
        const filteredWorks = data.filter((work) => work.user_id === userId);

        const worksWithDetails = await Promise.all(
          filteredWorks.map(async (work) => {
            const customerName = await fetchCustomerName(work.customer_id);
            const userName = await fetchEngineerName(work.user_id);
            const machines = await fetchMachinesByWorkID(work.id);
            return { ...work, customerName, userName, machines };
          })
        );

        setWorks(worksWithDetails);
      } catch (err) {
        setError("Error loading works data");
        console.error(err);
      }
    };
    fetchWorks();
  }, [userId]);

  const handleSelect = (workId: number) => {
    navigate("/stOneWork", { state: { workId } });
  };

  const handleNewButtonAction = async (workId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this work?"
    );
    if (confirmed) {
      const url = "https://easy-service.prakasitj.com/works/setWorkStatus";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          จำนวนงานที่รอเลือกช่าง
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {works.map((work) => (
            <div
              key={work.id}
              className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-between items-start"
            >
              <div>
                <p>
                  <strong>Work {work.id}</strong>
                </p>
                <p>
                  <strong>ชื่อลูกค้า:</strong> {work.customer_id}
                </p>
                <p>
                  <strong>สถานที่ซ่อม:</strong> {work.address}, {work.province}
                </p>
                {work.machines &&
                  work.machines.slice(0, 3).map((machine, index) => (
                    <p key={machine.id}>
                      รายละเอียดเครื่องซ่อมลำดับที่ {index + 1} : Model:{" "}
                      {machine.model.slice(0, 5)}...
                    </p>
                  ))}
                {work.machines && work.machines.length > 3 && <p>...</p>}
                <p>
                  <strong>ช่างผู้รับผิดชอบ:</strong> {work.customer_id || "-"}
                </p>
                <p>
                  <strong>ค่าใช้จ่ายซ่อมเครื่อง:</strong> 0
                </p>
                <p>
                  <strong>ค่าใช้จ่ายอื่นๆ:</strong> 0
                </p>
                <p>
                  <strong>สถานะการทำงาน:</strong> {work.status}
                </p>
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
