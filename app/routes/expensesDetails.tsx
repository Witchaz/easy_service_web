import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

interface Expenses {
    description: string;
    unit: string;
    cost: number;
    amount: number;
}

export default function ExpensesDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData, formDataLast } = location.state || {};
    const expenses = formData.additionalExpenses || [];

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

    const handleChange = (e: { target: { name: string; value: any; }; }) => {
        const { name, value } = e.target;
        setFormExpensesData({
            ...formExpensesData,
            [name]: name === "cost" || name === "amount" ? parseFloat(value) : value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newErrors = {
            description: !formExpensesData.description,
            unit: !formExpensesData.unit,
            cost: formExpensesData.cost <= 0,
            amount: formExpensesData.amount <= 0,
        };

        setErrors(newErrors);
        if (!newErrors.description && !newErrors.unit && !newErrors.cost && !newErrors.amount) {
            const newExpense = {
                description: formExpensesData.description,
                unit: formExpensesData.unit,
                cost: formExpensesData.cost,
                amount: formExpensesData.amount,
            };

            const updatedExpenses = [...expenses, newExpense];
            const updatedFormData = { ...formData, additionalExpenses: updatedExpenses };

            // Store updated data in sessionStorage
            sessionStorage.setItem("formData", JSON.stringify(updatedFormData));

            navigate("/expensesList", { state: updatedFormData });
        }
    };

    const handleBack = () => {
        navigate("/expensesList", { state: { ...formData, additionalExpenses: expenses, formDataLast } });
    };

    return (
        <>
            <NavBar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-10 rounded-lg shadow-md w-[800px] max-w-full">
                    <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">รายละเอียดค่าใช้จ่าย</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formExpensesData.description}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.description && <p className="text-red-500 text-sm">Please enter the description.</p>}
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
                            {errors.unit && <p className="text-red-500 text-sm">Please enter the unit.</p>}
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
                            {errors.cost && <p className="text-red-500 text-sm">Please enter a valid cost.</p>}
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
                            {errors.amount && <p className="text-red-500 text-sm">Please enter a valid amount.</p>}
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                className="bg-black text-white shrink border-white border-2 hover:bg-gray-800 p-2 rounded-lg"
                                onClick={handleBack}
                            >
                                Back
                            </button>

                            <button
                                type="submit"
                                className="bg-lime-500 text-white shrink border-white border-2 hover:bg-lime-600 p-2 rounded-lg"
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
