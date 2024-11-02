import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface Expenses {
  description: string;
  unit: string;
  cost: number;
  amount: number;
}

export default function ExpensesList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {}; // Receive workId

  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const url = `https://easy-service.prakasitj.com/additionalcosts/getFromWorkId/${workId}`;
      const options = { method: 'GET' };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to fetch expenses");

        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Error loading expenses data");
      }
    };

    if (workId) fetchExpenses();
  }, [workId]);

  const handleBack = () => {
    navigate("/stOneWork", { state: { workId } });
  };

  const handleAdd = () => {
    navigate('/expensesDetails', { state: { workId } });
  };

  const handleEdit = (index: number) => {
    navigate("/expensesEdit", { state: { expenses, index, workId } });
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const totalCost = expenses.reduce((sum, expense) => sum + expense.cost, 0);

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          ค่าใช้จ่ายอื่นๆ
        </h2>

        <div className="text-xl font-semibold text-gray-700 mb-4">
          ผลรวมค่าใช้จ่ายทั้งหมด: ฿{totalCost.toFixed(2)}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl h-[400px] overflow-y-auto">
          {expenses.map((expense, index) => (
            <div key={index} className="bg-gray-50 p-4 mb-4 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold mb-1">รายละเอียดค่าใช้จ่ายลำดับที่ {index + 1}</h3>
                <p>Description: {expense.description}</p>
                <p>Unit: {expense.unit}</p>
                <p>Amount: {expense.amount}</p>
                <p>Cost: {expense.cost}</p>
              </div>
              <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                onClick={() => handleEdit(index)}>
                Edit Details
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8 space-x-16">
          <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800" onClick={handleBack}>
            Back
          </button>
          <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </>
  );
}
