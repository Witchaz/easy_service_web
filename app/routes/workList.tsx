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
  address: string;
  province: string;
  add_date: string;
}

export default function WorkList() {
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      const url = "https://easy-service.prakasitj.com/works/getWorksList";
      const options = { method: "GET" };
      
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch works, status: ${response.status}`);
        
        const data = await response.json();
        setWorks(data);
      } catch (err) {
        setError("Error loading works data");
        console.error(err);
      }
    };

    fetchWorks();
  }, []);

  const handleSelect = (workId: string) => {
    navigate("/workDetails", { state: { workId } });
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          จำนวนงานทั้งหมด
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl h-[500px] overflow-y-auto">
          {works.map((work, index) => (
            <div key={work.id} className="border-b border-gray-300 py-4 mb-4 flex justify-between items-center">
              <div>
                <p><strong>Work{index + 1}</strong></p>
                <p><strong>ชื่อลูกค้า ID:</strong> {work.customerID}</p>
                <p><strong>สถานที่ซ่อม:</strong> {work.address}, {work.province}</p>
                <p><strong>วันที่ส่งจดหมาย:</strong> {new Date(work.mail_date).toLocaleDateString()}</p>
                <p><strong>วันที่ให้บริการ:</strong> {work.service_date ? new Date(work.service_date).toLocaleDateString() : '-'}</p>
                <p><strong>วันที่เพิ่ม:</strong> {new Date(work.add_date).toLocaleDateString()}</p>
                <p><strong>สถานะการทำงาน:</strong> {work.status}</p>
              </div>
              <button
                className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600"
                onClick={() => handleSelect(work.id)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
