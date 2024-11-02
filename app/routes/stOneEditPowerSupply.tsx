import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "app/components/_navBar";

export default function StOneEditPowerSupply() {
    const location = useLocation();
    const navigate = useNavigate();
    const { machineId, workId } = location.state || {}; // Receive machineId and workId

    const [formMachineData, setFormMachineData] = useState({
        serialNumber: "",
        model: "",
        warranty: false,
        rated: "",
        description: "",
    });

    const [errors, setErrors] = useState({
        serialNumber: false,
        rated: false,
        model: false,
        description: false,
    });

    useEffect(() => {
        const fetchMachineData = async () => {
            const url = `https://easy-service.prakasitj.com/Requests/getByID/${machineId}`;
            const options = { method: 'GET' };

            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error("Failed to fetch machine data");

                const data = await response.json();
                setFormMachineData({
                    serialNumber: data[0].sn,
                    model: data[0].model,
                    warranty: data[0].warranty,
                    rated: data[0].rated,
                    description: data[0].description,
                });
                console.log(data);
                
            } catch (error) {
                console.error("Error fetching machine data:", error);
            }
        };

        if (machineId) fetchMachineData();
    }, [machineId]);

    const handleChange = (e: { target: { name: string; value: any; checked: boolean; type: string } }) => {
        const { name, value, checked, type } = e.target;
        setFormMachineData({
            ...formMachineData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const newErrors = {
            serialNumber: !formMachineData.serialNumber,
            rated: !formMachineData.rated,
            model: !formMachineData.model,
            description: !formMachineData.description,
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            const url = 'https://easy-service.prakasitj.com/Requests/editRequest';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: machineId,
                    model: formMachineData.model,
                    sn: formMachineData.serialNumber,
                    rated: formMachineData.rated,
                    description: formMachineData.description,
                    warranty: formMachineData.warranty,
                    workID: workId,
                })
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log("Update successful:", data);
                // Navigate back to the machine list after update
                navigate("/stOnePowerSupplyList", { state: { workId } });
            } catch (error) {
                console.error("Error updating machine data:", error);
            }
        }
    };

    const handleBack = () => {
        navigate("/stOnePowerSupplyList", { state: { workId } });
    };

    const handleDelete = () => {
        // Perform delete operation if required, then navigate back
        navigate("/stOnePowerSupplyList", { state: { workId } });
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                    แก้ไขรายละเอียดเครื่องที่จะซ่อม
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
                            <input 
                                type="checkbox" 
                                name="warranty"
                                checked={formMachineData.warranty}
                                onChange={handleChange}
                                className="appearance-none w-8 h-8 border-2 border-red-500 rounded-md checked:bg-lime-500 checked:border-lime-500 focus:outline-none mr-2"
                            />
                            <span>{formMachineData.warranty ? "Yes" : "No"}</span>
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