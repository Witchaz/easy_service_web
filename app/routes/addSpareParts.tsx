import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import NavBar from "app/components/_navBar";

interface Spareparts {
    name: string;
    description: string;
    price: number;
    unit: string;
}

export default function AddSpareparts() {
    const navigate = useNavigate();

    const [formSparepartsData, setFormSparepartsData] = useState<Spareparts>({
        name: "",
        description: "",
        price: 0,
        unit: "",
    });

    const [errors, setErrors] = useState({
        name: false,
        description: false,
        price: false,
        unit: false,

    });

    const handleChange = (e: { target: { name: string; value: any; }; }) => {
        const { name, value } = e.target;
        setFormSparepartsData({
            ...formSparepartsData,
            [name]: name === "price" ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newErrors = {
            name: !formSparepartsData.name,
            description: !formSparepartsData.description,
            price: formSparepartsData.price < 0,
            unit: !formSparepartsData.unit,
        };

        setErrors(newErrors);
        if (!Object.values(newErrors).includes(true)) {
            try {
                const url = 'https://easy-service.prakasitj.com/spare_parts/insertSparePart';
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formSparepartsData.name,
                        description: formSparepartsData.description,
                        price: formSparepartsData.price,
                        unit: formSparepartsData.unit,
                    }),
                };

                const response = await fetch(url, options);
                const data = await response.json();

                if (response.ok) {
                    console.log("Spare part added successfully:", data);
                    alert("Spare part added successfully.");
                    navigate("/SparepartsList");
                } else {
                    console.error("Failed to add spare part:", data);
                    alert("Failed to add spare part.");
                }
            } catch (error) {
                console.error("Error adding spare part:", error);
                alert("An error occurred while adding the spare part.");
            }
        }
    };

    const handleBack = () => {
        navigate("/SparepartsList");
    };

    return (
        <>
            <NavBar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">     
                <div className="bg-white p-10 rounded-lg shadow-md w-[800px] max-w-full">
                    <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">รายละเอียดอะไหล่</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formSparepartsData.name}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.name && <p className="text-red-500 text-sm">Please enter the name.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Description</label>
                            <input 
                                type="text" 
                                name="description"
                                value={formSparepartsData.description}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.description && <p className="text-red-500 text-sm">Please enter the description.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Price</label>
                            <input 
                                type="number" 
                                name="price"
                                value={formSparepartsData.price}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.price && <p className="text-red-500 text-sm">Price must be 0 or greater.</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Unit</label>
                            <input 
                                type="text" 
                                name="unit"
                                value={formSparepartsData.unit}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors.unit && <p className="text-red-500 text-sm">Please enter a valid unit.</p>}
                        </div>
                     
                        <div className="mt-6 flex justify-between">
                            <button type="button" className="bg-black text-white shrink border-white border-2 hover:bg-gray-800 p-2 rounded-lg"
                                onClick={handleBack}>
                                Back
                            </button>

                            <button type="submit" className="bg-lime-500 text-white shrink border-white border-2 hover:bg-lime-600 p-2 rounded-lg">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
