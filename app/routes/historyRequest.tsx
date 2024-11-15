import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBarEngineer";
import { useID } from "../context/IDContext";

interface TransactionLog {
  id: number;
  spare_part_id: number;
  quantity: number;
  user_id: number;
  fromuser_id: number;
  status: number;
  add_date: string;
}

interface SparePart {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  add_date: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useID();
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  console.log("ID from Context:", id);

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = `https://easy-service.prakasitj.com/transactionLogs/getList`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch transactions, status: ${response.status}`);
        const data: TransactionLog[] = await response.json();
        const filteredTransactions = data.filter((transaction) => transaction.user_id === id);
        setTransactions(filteredTransactions);
      } catch (err) {
        setError("Error loading transaction data");
        console.error(err);
      }
    };

    const fetchSpareParts = async () => {
      try {
        const response = await fetch(`https://easy-service.prakasitj.com/spare_parts/getList`);
        if (!response.ok) throw new Error("Failed to fetch spare parts");
        const data: SparePart[] = await response.json();
        setSpareParts(data);
      } catch (err) {
        setError("Error loading spare parts data");
        console.error(err);
      }
    };

    fetchTransactions();
    fetchSpareParts();
  }, [id]);

  const getSparePartName = (sparePartId: number) => {
    const sparePart = spareParts.find((part) => part.id === sparePartId);
    return sparePart ? sparePart.name : "Unknown";
  };

  const handleAccept = async (transactionId: number) => {
    try {
      const transaction = transactions.find((t) => t.id === transactionId);
      if (!transaction) {
        alert("Transaction not found");
        return;
      }
  
      // ดึงข้อมูลอะไหล่ในคลังของช่าง
      const response = await fetch(
        `https://easy-service.prakasitj.com/spare_parts_engineer/getFromUserID/${transaction.user_id}`
      );
  
      if (!response.ok) {
        alert("Failed to fetch spare parts in stock");
        return;
      }
  
      const sparePartsInStock = await response.json();
      const existingSparePart = sparePartsInStock.find(
        (part: any) => part.spare_part_id === transaction.spare_part_id
      );
  
      if (existingSparePart) {
        // แก้ไขจำนวนอะไหล่ในคลัง
        await fetch(`https://easy-service.prakasitj.com/spare_parts_engineer/editSparePartsEngineer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: existingSparePart.spare_part_engineer_id,
            spare_part_id: transaction.spare_part_id,
            quantity: existingSparePart.quantity + transaction.quantity,
            user_id: transaction.user_id,
          }),
        });
      } else {
        // เพิ่มอะไหล่ใหม่ในคลัง
        await fetch(`https://easy-service.prakasitj.com/spare_parts_engineer/insertSparePartsEngineer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spare_part_id: transaction.spare_part_id,
            quantity: transaction.quantity,
            user_id: transaction.user_id,
          }),
        });
      }
  
      // อัปเดตสถานะ Transaction
      const statusUpdate = 3;
      const updateResponse = await fetch(
        `https://easy-service.prakasitj.com/transactionLogs/updateStatusTransactionLog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...transaction,
            status: statusUpdate,
          }),
        }
      );
  
      if (!updateResponse.ok) {
        alert("Failed to accept transaction");
        return;
      }
  
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, status: statusUpdate } : t))
      );
  
      alert("อัพเดตข้อมูลเรียบร้อย");
    } catch (err) {
      console.error("Error accepting transaction:", err);
    }
  };
  
  const handleReject = async (transactionId: number) => {
    try {
      const transaction = transactions.find((t) => t.id === transactionId);
      const statusUpdate = 4;
      if (!transaction) {
        alert("Transaction not found");
        return;
      }

      const response = await fetch(`https://easy-service.prakasitj.com/transactionLogs/updateStatusTransactionLog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transaction,
          status: statusUpdate,
        }),
      });

      if (!response.ok) {
        alert("Failed to reject transaction");
        return;
      }

      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, status: statusUpdate } : t))
      );
      alert("อัพเดตข้อมูลเรียบร้อย");
    } catch (err) {
      console.error("Error rejecting transaction:", err);
    }
  };

  const filteredTransactions = statusFilter !== null
  ? transactions.filter((transaction) => transaction.status === statusFilter)
  : transactions;

  
  const sortedTransactions = filteredTransactions.sort((a, b) => b.id - a.id);

  const getStatusName = (status: number) => {
    switch (status) {
      case 0:
        return "รออนุมัติ";
      case 1:
        return "รอดำเนินการ";
      case 2:
        return "ถูกปฎิเสธ";
      case 3:
        return "เสร็จสิ้น(เรียบร้อย)";
      case 4:
        return "เสร็จสิ้น(ปฎิเสธ)";
      default:
        return "สถานะไม่รู้จัก";
    }
  };
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          รายการเบิกอะไหล่ของคุณ
        </h2>
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${statusFilter === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter(null)}
          >
            ทั้งหมด
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter(0)}
          >
            รออนุมัติ
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter(1)}
          >
            รอดำเนินการ
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 2 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter(2)}
          >
            ถูกปฎิเสธ
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 3 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter(3)}
          >
            เสร็จสิ้น(เรียบร้อย)
          </button>
          <button
            className={`px-4 py-2 rounded ${statusFilter === 4 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter(4)}
          >
            เสร็จสิ้น(ปฎิเสธ)
          </button>
        </div>

        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-between items-start">
                <div>
                  <p><strong>Transaction ID:</strong> {transaction.id}</p>
                  <p><strong>Spare Part:</strong> {getSparePartName(transaction.spare_part_id)}</p>
                  <p><strong>Quantity:</strong> {transaction.quantity}</p>
                  <p><strong>Status:</strong> {getStatusName(transaction.status)}</p>
                  <p><strong>Add Date:</strong> {new Date(transaction.add_date).toLocaleString()}</p>
                </div>
                {transaction.status === 1 ? (
                  <div className="flex space-x-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleAccept(transaction.id)}
                    >
                      ยอมรับ
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleReject(transaction.id)}
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                ) : null}
              </div>
            ))}

        </div>
        <a href="/mainPageEngineer">
          <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600 mt-4">Back</button>
        </a>
      </div>
    </>
  );
}