import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

interface Expenses {
    description: string;
    unit: string;
    cost: number;
    amount: number;
}

interface FormData {
    customerName: string;
    address: string;
    province: string;
    mailDate: string;
    engineer: string;
    additionalExpenses: Expenses[];
    status: string;
    details: [];
}

export default function ExpensesList() {
    const location = useLocation();
    const navigate = useNavigate();

    const initialState = location.state || JSON.parse(sessionStorage.getItem("formData") || "{}");

    const [formData, setFormData] = useState<FormData>({
        customerName: initialState.customerName,
        address: initialState.address,
        province: initialState.province,
        mailDate: initialState.mailDate,
        engineer: initialState.engineer,
        additionalExpenses: initialState.additionalExpenses || [],
        status: initialState.status,
        details: initialState.details || [],
    });

    const totalCost = formData.additionalExpenses.reduce((sum, expense) => sum + expense.cost, 0);

    useEffect(() => {
        if (!sessionStorage.getItem("initialFormData")) {
            sessionStorage.setItem("initialFormData", JSON.stringify(formData));
        }
    }, [formData]);

    useEffect(() => {
        sessionStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);

    const handleAdd = () => {
        navigate("/expensesDetails", { state: { formData } });
    };

    const handleEdit = (index: number) => {
        navigate("/expensesEdit", { state: { expenses: formData.additionalExpenses, index, formData } });
    };

    const handleSave = () => {
        sessionStorage.setItem("formData", JSON.stringify(formData));
        navigate("/work", { state: { ...formData, totalCost } });
    };

    const handleBack = () => {
        const initialFormData = JSON.parse(sessionStorage.getItem("initialFormData") || "{}");
        navigate("/work", { state: initialFormData });
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                    ค่าใช้จ่ายอื่นๆ
                </h2>

                <h2>ค่าใช้จ่ายรวม : </h2>
                <div className="text-xl font-semibold text-gray-700 mb-4">
                    ผลรวมค่าใช้จ่ายทั้งหมด: ฿{totalCost.toFixed(2)}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    <div className="max-h-96 overflow-y-auto">
                        {formData.additionalExpenses.map((expense: Expenses, index) => (
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

                    <div className="flex justify-between mt-8">
                        <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800" onClick={handleBack}>
                            Back
                        </button>
                        <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleAdd}>
                            Add
                        </button>
                        <button className="bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-lime-600" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
