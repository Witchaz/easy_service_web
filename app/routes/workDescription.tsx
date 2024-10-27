import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

export default function EditDescription() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        customerName = "",
        address = "",
        province = "",
        mailDate = "",
        details = [],
        engineer = "",
        additionalCost = 0,
        status = 0,
    } = location.state?.work || {};


    const [formData, setFormData] = useState({
        customerName,
        address,
        province,
        mailDate,
        details,
        engineer,
        additionalCost,
        status,
    });

    const [errors, setErrors] = useState({
        address: false,
        province: false,
        mailDate: false,
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newErrors = {
            address: !formData.address,
            province: !formData.province,
            mailDate: !formData.mailDate,
        };

        setErrors(newErrors);
        if (!newErrors.address && !newErrors.province && !newErrors.mailDate) {
            navigate("/work"); 
        }
    };

    const handleCancel = () => {
        const previousPage = location.state?.from || "/customerList";
        navigate(previousPage);
    };

    return (
        <>
            <NavBar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-lg">
                    <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">สถานที่ซ่อม</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full mt-1 p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-lime-500`}
                                />
                                {errors.address && <p className="text-red-500 text-sm">Please enter the address.</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Province <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className={`w-full mt-1 p-2 border ${errors.province ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-lime-500`}
                                />
                                {errors.province && <p className="text-red-500 text-sm">Please enter the province.</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">
                                Mail Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="mailDate"
                                value={formData.mailDate}
                                onChange={handleChange}
                                className={`w-full mt-1 p-2 border ${errors.mailDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-lime-500`}
                            />
                            {errors.mailDate && <p className="text-red-500 text-sm">Please select a mail date.</p>}
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button type="button" onClick={handleCancel} className="bg-red-600 text-white shrink border-white border-2 hover:bg-red-800 p-2 rounded-lg">
                                Cancel
                            </button>
                            <button type="submit" className="bg-lime-500 text-white shrink border-white border-2 hover:bg-lime-600 p-2 rounded-lg">
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
