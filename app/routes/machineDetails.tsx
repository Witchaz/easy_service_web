import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import NavBar from "app/components/_navBar";

interface Machine {
    serialNumber: string;
    model: string;
    rated: string;
    warranty: boolean;  // boolean type
    description: string; // เพิ่มฟิลด์ description
}

export default function MachineDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData, formDataLast } = location.state || {};
    const machines = formData.details || [];

    const [formMachineData, setFormMachineData] = useState({
        serialNumber: "",
        model: "",
        rated: "",
        warranty: false,  // เริ่มต้นเป็น false
        description: "",  // เพิ่มฟิลด์ description เริ่มต้นเป็น empty string
    });

    const [errors, setErrors] = useState({
        serialNumber: false,
        model: false,
        rated: false,
        description: false,
    });

    const handleChange = (e: { target: { name: string; value: any; checked: boolean; type: string } }) => {
        const { name, value, checked, type } = e.target;
        setFormMachineData({
            ...formMachineData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const newErrors = {
            serialNumber: !formMachineData.serialNumber,
            rated: !formMachineData.rated,
            model: !formMachineData.model,
            description: !formMachineData.description,
        };

        setErrors(newErrors);
        if (!newErrors.serialNumber && !newErrors.rated && !newErrors.model && !newErrors.description) {
            const newMachine: Machine = {
                serialNumber: formMachineData.serialNumber,
                model: formMachineData.model,
                rated: formMachineData.rated,
                warranty: formMachineData.warranty,
                description: formMachineData.description,  // เพิ่ม description
            };

            navigate("/machineList", { state: { ...formData, details: [...machines, newMachine], formDataLast } });
        }
    };

    const handleBack = () => {
        navigate("/machineList", { state: { ...formData, details: machines, formDataLast } });
    };

    return (
        <>
            <NavBar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">     
                <div className="bg-white p-10 rounded-lg shadow-md w-[800px] max-w-full">
                    <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">รายละเอียดเครื่องที่จะซ่อม</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Serial Number</label>
                            <input 
                                type="text" 
                                name="serialNumber"
                                value={formMachineData.serialNumber}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.serialNumber && <p className="text-red-500 text-sm">Please enter the serial number.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Model / Type</label>
                            <input 
                                type="text" 
                                name="model"
                                value={formMachineData.model}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.model && <p className="text-red-500 text-sm">Please enter the model/type.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Rated</label>
                            <input 
                                type="text" 
                                name="rated"
                                value={formMachineData.rated}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.rated && <p className="text-red-500 text-sm">Please enter the rated value.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Description</label>
                            <input 
                                type="text" 
                                name="description"
                                value={formMachineData.description}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.description && <p className="text-red-500 text-sm">Please enter a description.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Warranty</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setFormMachineData({ ...formMachineData, warranty: true })}
                                    className={`w-20 h-10 rounded-md font-semibold ${formMachineData.warranty ? "bg-lime-500 text-white" : "bg-gray-200 text-gray-700"} border`}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormMachineData({ ...formMachineData, warranty: false })}
                                    className={`w-20 h-10 rounded-md font-semibold ${!formMachineData.warranty ? "bg-lime-500 text-white" : "bg-gray-200 text-gray-700"} border`}
                                >
                                    No
                                </button>
                            </div>
                            <span className="block mt-2">{formMachineData.warranty ? "Warranty: Yes" : "Warranty: No"}</span>
                        </div>

                        
                        <div className="mt-6 flex justify-between">
                            <button type="button" className="bg-black text-white shrink border-white border-2 hover:bg-gray-800 p-2 rounded-lg"
                                onClick={handleBack}>
                                Back
                            </button>

                            <button type="submit" className="bg-lime-500 text-white shrink border-white border-2 hover:bg-lime-600 p-2 rounded-lg">
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
