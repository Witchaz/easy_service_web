import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";
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

export default function TransactionList() {
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useID();
  console.log("ID from Context:", id);

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = `https://easy-service.prakasitj.com/transactionLogs/getList`;
      const options = { method: "GET" };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Failed to fetch transactions, status: ${response.status}`);

        const data: TransactionLog[] = await response.json();
        const filteredTransactions = data.filter((transaction) => transaction.user_id === id);
        setTransactions(filteredTransactions);
      } catch (err) {
        setError("Error loading transaction data");
        console.error(err);
      }
    };

    fetchTransactions();
  }, [id]);

  const handleAccept = async (transactionId: number) => {
    try {
      const transaction = transactions.find((t) => t.id === transactionId);
      const statusUpdate = 1;

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
      const statusUpdate = 2;
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
    } catch (err) {
      console.error("Error rejecting transaction:", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          รายการเบิกอะไหล่ของคุณ
        </h2>
        <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-between items-start">
              <div>
                <p><strong>Transaction ID:</strong> {transaction.id}</p>
                <p><strong>Spare Part ID:</strong> {transaction.spare_part_id}</p>
                <p><strong>Quantity:</strong> {transaction.quantity}</p>
                <p><strong>Status:</strong> {transaction.status}</p>
                <p><strong>Add Date:</strong> {new Date(transaction.add_date).toLocaleString()}</p>
              </div>
              {transaction.status === 0 ? (
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
      </div>
    </>
  );
}
