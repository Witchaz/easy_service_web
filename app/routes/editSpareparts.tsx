import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

interface Spareparts {
    name: string;
    description: string;
    price: number;
    unit: string;
}

export default function EditSpareparts() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sparepartId } = location.state || {};

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

    useEffect(() => {
        const fetchSparepartData = async () => {
            const url = `https://easy-service.prakasitj.com/spare_parts/getByID/${sparepartId}`;
            const options = { method: 'GET' };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                setFormSparepartsData({
                    name: data[0].name,
                    description: data[0].description,
                    price: data[0].price,
                    unit: data[0].unit,
                });
            } catch (error) {
                console.error("Error fetching spare part data:", error);
            }
        };

        if (sparepartId) {
            fetchSparepartData();
        }
    }, [sparepartId]);

    const handleChange = (e: { target: { name: string; value: any; }; }) => {
        const { name, value } = e.target;
        setFormSparepartsData({
            ...formSparepartsData,
            [name]: name === "price" ? Math.max(0, parseFloat(value)) : value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newErrors = {
            name: !formSparepartsData.name,
            description: !formSparepartsData.description,
            price: formSparepartsData.price <= 0,
            unit: !formSparepartsData.unit,
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            updateSparepart();
        }
    };

    const updateSparepart = async () => {
        const url = 'https://easy-service.prakasitj.com/spare_parts/editSparePart';
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: sparepartId,
                name: formSparepartsData.name,
                description: formSparepartsData.description,
                price: formSparepartsData.price,
                unit: formSparepartsData.unit,
            })
        };

        const response = await fetch(url, options);
            
        alert("ได้แก้ไขและบันทึกข้อมูลแล้ว");
        navigate("/SparePartsList");
    };



    const handleBack = () => {
        navigate("/SparePartsList");
    };

    return (
        <>
            <NavBar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-10 rounded-lg shadow-md w-[800px] max-w-full">
                    <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">แก้ไขอะไหล่</h2>
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
                                min={0}
                            />
                            {errors.price && <p className="text-red-500 text-sm">Please enter a valid price.</p>}
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
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
