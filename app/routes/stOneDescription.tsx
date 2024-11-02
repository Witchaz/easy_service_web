import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "app/components/_navBar";

export default function StOneDescription() {
    const navigate = useNavigate();
    const location = useLocation();
    const { workId } = location.state || {}; // รับค่า workId จาก state ที่ถูกส่งมา

    const [formData, setFormData] = useState({
        customerID: 0,
        address: "",
        province: "",
        userID: "", // ควรเพิ่ม userID หรือค่าอื่นๆ ที่เกี่ยวข้องถ้ามี
    });

    const [errors, setErrors] = useState({
        address: false,
        province: false,
    });

    useEffect(() => {
        const fetchWorkData = async () => {
            const url = `https://easy-service.prakasitj.com/works/searchByID/${workId}`;
            const options = { method: 'GET' };

            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error("Failed to fetch work data");
                const data = await response.json();
                
                if (data.length > 0) {
                    const work = data[0];
                    setFormData({
                        customerID: work.customerID,
                        address: work.address || "",
                        province: work.province || "",
                        userID: work.userID || "", // ควรมีค่า userID ที่ได้มาจาก API
                    });
                }
            } catch (error) {
                console.error("Error fetching work data:", error);
            }
        };

        if (workId) fetchWorkData();
    }, [workId]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newErrors = {
            address: !formData.address,
            province: !formData.province,
        };

        setErrors(newErrors);
        if (!newErrors.address && !newErrors.province) {
            const url = 'https://easy-service.prakasitj.com/works/editWork';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: workId,
                    customerID: formData.customerID,
                    address: formData.address,
                    province: formData.province,
                    userID: formData.userID,
                }),
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log("Update successful:", data);
                navigate("/stOneWork", { state: { workId } });
            } catch (error) {
                console.error("Error updating work data:", error);
            }
        }
    };

    const handleCancel = () => {
        navigate("/stOneWork", { state: { workId } });
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

                        <div className="mt-6 flex justify-between">
                            <button type="button" onClick={handleCancel} className="bg-red-600 text-white shrink border-white border-2 hover:bg-red-800 p-2 rounded-lg">
                                Cancel
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
