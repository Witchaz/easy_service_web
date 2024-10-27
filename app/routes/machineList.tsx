import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

interface Machine {
    id: number;
    serialNumber: string;
    model: string;
    warranty: string;
    rated: string;
}


const getMachines = () => {
    const machines = [
        {
        id: 1,
        serialNumber: "2538A7",
        model: "Derivistiya",
        warranty: "2021-09-20 10:30 AM",
        rated: "4 Cubicmetre",
        },
        {
        id: 2,
        serialNumber: "BR120/L55A1",
        model: "Leopard",
        warranty: "2021-09-20 10:30 AM",
        rated: "12 Cubicmetre",
        },
        {
        id: 3,
        serialNumber: "MG25SA2",
        model: "Merkavar",
        warranty: "2021-09-20 10:30 AM",
        rated: "10 Cubicmetre",
        },
    ];
    return machines;
}

export default function MachineList() { 
    const machines = getMachines();
    const navigate = useNavigate();

    const handleAdd = () => {
        navigate("/machineDetails");
    }

    const handleEdit = (machine: Machine) => {  
        navigate("/machineEdit", { state: machine }); // ส่ง machine โดยตรง
    }

    const handleBack = () => {
        navigate("/work");
    }

    return (
        <>
            <NavBar />
                <div className="flex flex-col items-center min-h-screen bg-gray-100">
                    <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                        จำนวนเครื่องที่ต้องการซ่อม
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        
                        <div className="max-h-96 overflow-y-auto">
                            { machines.map((machine) => (
                                <div key={machine.id} className="bg-gray-50 p-4 mb-4 rounded-md flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold mb-1">รายละเอียดเครื่องซ่อมลำดับที่ {machine.id}</h3>
                                        <p>Serial Number: {machine.serialNumber}</p>
                                        <p>Model / Type: {machine.model}</p>
                                        <p>Rated: {machine.rated}</p>
                                        <p>Warranty: {machine.warranty}</p>
                                    </div>
                                    <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                        onClick={() => handleEdit(machine)}>
                                        Edit Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-8">
                            <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800" onClick={handleBack}>
                                back
                            </button>
                            <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleAdd}>
                                add
                            </button>
                            <button className="bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-lime-600">
                                next
                            </button>
                        </div>
                    
                    </div>
                </div>
        </>
    )
}