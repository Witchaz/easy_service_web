import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface Expense {
  id: number;
  description: string;
  unit: string;
  cost: number;
  amount: number;
}

export default function adANCostEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { expenses, expenseId, workId } = location.state || {};

  const expenseToEdit = expenses.find(
    (expense: Expense) => expense.id === expenseId
  );

  const [formExpensesData, setFormExpensesData] = useState(
    expenseToEdit || {
      description: "",
      unit: "",
      cost: 0,
      amount: 0,
    }
  );

  const [errors, setErrors] = useState({
    description: false,
    unit: false,
    cost: false,
    amount: false,
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormExpensesData({
      ...formExpensesData,
      [name]: name === "cost" || name === "amount" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newErrors = {
      description: !formExpensesData.description,
      unit: !formExpensesData.unit,
      cost: formExpensesData.cost <= 0,
      amount: formExpensesData.amount <= 0,
    };

    setErrors(newErrors);
    if (
      !newErrors.description &&
      !newErrors.unit &&
      !newErrors.cost &&
      !newErrors.amount
    ) {
      try {
        const url =
          "https://easy-service.prakasitj.com/additionalcosts/editAdditionalCost";
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: expenseId,
            description: formExpensesData.description,
            cost: formExpensesData.cost,
            amount: formExpensesData.amount,
            unit: formExpensesData.unit,
            work_id: workId,
          }),
        };

        const response = await fetch(url, options);
        const data = await response.text();
        console.log(data);

        if (response.ok) {
          alert("Expense updated successfully!");
          navigate("/expensesList", { state: { expenses, workId } });
        } else {
          alert("Failed to update expense. Please try again.");
        }
      } catch (error) {
        console.error("Error updating expense:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleBack = () => {
    navigate("/adANCostList", { state: { expenses, workId } });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (confirmed) {
      try {
        const url =
          "https://easy-service.prakasitj.com/additionalcosts/deleteAdditionalCost";
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: expenseId }),
        };

        const response = await fetch(url, options);
        const data = await response.text();
        console.log(data);

        if (response.ok) {
          alert("Expense deleted successfully!");
          navigate("/expensesList", {
            state: {
              expenses: expenses.filter(
                (expense: Expense) => expense.id !== expenseId
              ),
              workId,
            },
          });
        } else {
          alert("Failed to delete expense. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  if (!formExpensesData) return <p>Loading...</p>;

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          แก้ไขรายละเอียดค่าใช้จ่าย
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formExpensesData.description}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  Please enter the description.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Unit</label>
              <input
                type="text"
                name="unit"
                value={formExpensesData.unit}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.unit && (
                <p className="text-red-500 text-sm">Please enter the unit.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Cost</label>
              <input
                type="number"
                name="cost"
                value={formExpensesData.cost}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.cost && (
                <p className="text-red-500 text-sm">
                  Please enter a valid cost.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                value={formExpensesData.amount}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">
                  Please enter a valid amount.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="bg-black text-white border-white border-2 hover:bg-gray-800 p-2 rounded-lg"
                onClick={handleBack}
              >
                Back
              </button>

              <button
                type="button"
                className="bg-red-600 text-white border-white border-2 hover:bg-red-800 p-2 rounded-lg"
                onClick={handleDelete}
              >
                Delete
              </button>

              <button
                type="submit"
                className="bg-lime-500 text-white border-white border-2 hover:bg-lime-600 p-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
