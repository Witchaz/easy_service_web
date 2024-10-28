import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavBar from "app/components/_navBar";

export default function MachineEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const { machines, index, formData, formDataLast } = location.state || {};
    
    const machineToEdit = machines[index];

    const [formMachineData, setFormMachineData] = useState({
        serialNumber: machineToEdit.serialNumber,
        model: machineToEdit.model,
        warranty: machineToEdit.warranty,
        rated: machineToEdit.rated,
    });

    const [errors, setErrors] = useState({
        serialNumber: false,
        rated: false,
        model: false,
        warranty: false,
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormMachineData({
            ...formMachineData,
            [name]: value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newErrors = {
            serialNumber: !formMachineData.serialNumber,
            rated: !formMachineData.rated,
            model: !formMachineData.model,
            warranty: !formMachineData.warranty
        };

        setErrors(newErrors);
        if (!newErrors.serialNumber && !newErrors.rated && !newErrors.model && !newErrors.warranty) {
            const updatedMachines = machines.map((machine: any, i: any) => 
                i === index ? { ...machine, ...formMachineData } : machine
            );

            navigate("/machineList", {
                state: { ...formData, details: updatedMachines, formDataLast } 
            }); 
        }
    };

    const handleBack = () => {
        navigate("/machineList", { state: { ...formData, details: machines, formDataLast } });
    };

    const handleDelete = () => {
        const updatedMachines = machines.filter((_: any, i: any) => i !== index);
        navigate("/machineList", { state: { ...formData, details: updatedMachines, formDataLast } });
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                    แก้ไขรายละเอียดที่จะซ่อม
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
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
                            {errors.serialNumber && <p className="text-red-500 text-sm">Please enter the serialNumber.</p>}
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
                            {errors.model && <p className="text-red-500 text-sm">Please enter the Model/Type.</p>}
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
                            {errors.rated && <p className="text-red-500 text-sm">Please enter the rated.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Warranty</label>
                            <input 
                                type="text" 
                                name="warranty"
                                value={formMachineData.warranty}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.warranty && <p className="text-red-500 text-sm">Please enter the warranty.</p>}
                        </div>
                        
                        <div className="mt-6 flex justify-between">
                            <button type="button" className="bg-black text-white shrink border-white border-2 hover:bg-gray-800 p-2 rounded-lg"
                                onClick={handleBack}>
                                Back
                            </button>

                            <button type="button" className="bg-red-600 text-white shrink border-white border-2 hover:bg-red-800 p-2 rounded-lg"
                                onClick={handleDelete}>
                                Delete
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
