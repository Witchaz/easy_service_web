import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

interface Machine {
    serialNumber: string;
    model: string;
    warranty: string;
    rated: string;
}

interface FormData {
    customerName: string;
    address: string;
    province: string;
    mailDate: string;
    engineer: string;
    additionalCost: number;
    status: string;
    details: Machine[];
}

export default function MachineList() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        customerName,
        address,
        province,
        mailDate,
        engineer,
        additionalCost,
        status,
        details,
    } = location.state || {};

    // Load initial data from sessionStorage if available
    useEffect(() => {
        const initialData = sessionStorage.getItem("initialFormData");
        if (!initialData) {
            sessionStorage.setItem("initialFormData", JSON.stringify({
                customerName,
                address,
                province,
                mailDate,
                engineer,
                additionalCost,
                status,
                details: details || [],
            }));
        }
    }, [customerName, address, province, mailDate, engineer, additionalCost, status, details]);

    const [formData, setFormData] = useState<FormData>({
        customerName,
        address,
        province,
        mailDate,
        engineer,
        additionalCost,
        status,
        details: details || [],
    });

    const handleAdd = () => {
        navigate("/machineDetails", { state: { formData } });
    };

    const handleEdit = (index: number) => {
        navigate("/machineEdit", { state: { machines: formData.details, index, formData } });
    };

    const handleSave = () => {
        // ส่งข้อมูลที่อัปเดตกลับไปยัง Work
        navigate("/work", { state: { ...formData } });
        sessionStorage.removeItem("initialFormData"); // ลบค่าเริ่มต้นเมื่อมีการบันทึก
    };

    const handleBack = () => {
        // ดึงข้อมูลเริ่มต้นจาก sessionStorage เมื่อกด Back
        const initialFormData = sessionStorage.getItem("initialFormData");
        if (initialFormData) {
            navigate("/work", { state: JSON.parse(initialFormData) });
        }
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                    จำนวนเครื่องที่ต้องการซ่อม
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    <div className="max-h-96 overflow-y-auto">
                        {formData.details.map((machine: Machine, index) => (
                            <div key={index} className="bg-gray-50 p-4 mb-4 rounded-md flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold mb-1">รายละเอียดเครื่องซ่อมลำดับที่ {index + 1}</h3>
                                    <p>Serial Number: {machine.serialNumber}</p>
                                    <p>Model / Type: {machine.model}</p>
                                    <p>Rated: {machine.rated}</p>
                                    <p>Warranty: {machine.warranty}</p>
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
