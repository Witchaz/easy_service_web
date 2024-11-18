import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "app/components/_navBarEngineer";
import { useID } from "~/context/IDContext";

interface SelectedSparePart {
    
  id: string;
  name: string; 
  price: number;
  qty: number;
}

export default function RequestList() {
  const [selectedSpareParts, setSelectedSpareParts] = useState<SelectedSparePart[]>([]);
  const navigate = useNavigate();
  const { id } = useID();

  useEffect(() => {
    const saved = localStorage.getItem("selectedSpareParts");
    if (saved) {
      setSelectedSpareParts(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    if (selectedSpareParts.length === 0) {
      alert("ไม่มีข้อมูลให้บันทึก");
      return;
    }

    for (let part of selectedSpareParts) {
      const payload = {
        spare_part_id: Number(part.id),
        quantity: Number(part.qty),
        user_id: id, 
        fromuser_id: 7,
      };
      
      if (!Number.isInteger(part.qty)) {
        alert(`จำนวนของอะไหล่ ${part.name} ต้องเป็นจำนวนเต็ม`);
        return;
      }
      if (part.qty <= 0 ) {
        alert(`จำนวนของอะไหล่ ${part.name} ต้องมากกว่า 0`);
        return;
      }
      if (part.qty > 100) {
        alert(`จำนวนของอะไหล่ ${part.name} ต้องไม่เกิน 1000`);
        return;
      }
      try {
        const response = await fetch("https://easy-service.prakasitj.com/transactionLogs/insertTransactionLog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error adding spare part ${part.id}:`, errorData);
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        return;
      }
    }

    alert("บันทึกข้อมูลสำเร็จ");
    localStorage.removeItem("selectedSpareParts");
    navigate("/workListEngineer");
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">รายการอะไหล่ที่ต้องการเบิก</h1>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Part ID</th>
                <th className="p-2">Part Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {selectedSpareParts.map((part) => (
                <tr key={part.id} className="border-t">
                  <td className="p-2">{part.id}</td>
                  <td className="p-2">{part.name}</td>
                  <td className="p-2">{part.price*part.qty} Baht</td>
                  <td className="p-2">{part.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center space-x-10 mt-8">
            <button className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600" onClick={() => navigate("/request")}>
              Back
            </button>
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
