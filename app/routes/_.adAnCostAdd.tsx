import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Expenses {
  description: string;
  unit: string;
  cost: number;
  amount: number;
}

export default function adAnCostAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = location.state || {};

  const [formExpensesData, setFormExpensesData] = useState<Expenses>({
    description: "",
    unit: "",
    cost: 0,
    amount: 0,
  });

  const [errors, setErrors] = useState({
    description: false,
    unit: false,
    cost: false,
    amount: false,
  });

  const handleChange = (e: { target: { name: string; value: any } }) => {
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
          "https://easy-service.prakasitj.com/additionalcosts/insertAdditionalCost";
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          alert("Expense added successfully!");
          navigate("/adANCostList", { state: { workId } });
        } else {
          alert("Failed to add expense. Please try again.");
        }
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleBack = () => {
    navigate("/adANCostList", { state: { workId } });
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md w-[800px] max-w-full">
          <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">
            รายละเอียดค่าใช้จ่าย
          </h2>
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
