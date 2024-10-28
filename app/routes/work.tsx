import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

export default function Work() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        customerName,
        address,
        province,
        mailDate,
        details = [],
        engineer = "",
        additionalCost = 0,
        status = "",
    } = location.state || {};

    const locationDetails = location.state?.details || details;

    const [formData] = useState({
        customerName: customerName,
        address: address,
        province: province,
        mailDate: mailDate,
        details: locationDetails.map((detail: { id: any; }, index: number) => ({...detail, id: detail.id || index + 1})),
        engineer: engineer,
        additionalCost: additionalCost,
        status: status,
    });

    const handleBack = () => {
        navigate("/customerList");
    };

    const handleEditDetails = () => {
        navigate("/machineList", { state: { ...formData } });
    };

    const handleEditAddress = () => {
        navigate("/workDescription", { state: { work: formData, from: "/work" } });
    };

    const handleEditEngineer = () => {
        
        navigate("/selectEngineer", { state: { work:formData } });
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h1 className="text-center text-3xl font-semibold text-lime-600 mt-8 mb-6">
                    หน้าเพิ่มงาน
                </h1>
                
                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[550px] overflow-y-auto mb-6">
                    <div className="border-b border-gray-300 py-4">
                        <p><strong>สถานที่ซ่อม:</strong> {formData.address}</p>

                        {formData.details.length > 0 ? (
                            formData.details.slice(0, 3).map((detail: { id: Key | null | undefined; model: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; serialNumber: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: number) => (
                                <p key={detail.id}>
                                    <strong>รายละเอียดเครื่องซ่อมลำดับที่ {index + 1} :</strong> Model: {detail.model}, Serial Number: {detail.serialNumber}
                                </p>
                            ))
                        ) : (
                            <p>รายละเอียด : -</p>
                        )}
                        {formData.details.length > 3 && <p>...</p>}

                        <p><strong>ช่างผู้รับผิดชอบ :</strong> {formData.engineer}</p>
                        <p><strong>ค่าใช้จ่ายเพิ่มเติม :</strong> {formData.additionalCost}</p>
                        <p><strong>สถานะการทำงาน :</strong> {formData.status}</p>

                        <div className="flex space-x-4 mt-4">
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleEditDetails}>
                                Edit Details
                            </button>
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleEditAddress}>
                                Edit Address
                            </button>
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg">
                                Edit Cost
                            </button>
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleEditEngineer}>
                                Edit Engineer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full max-w-4xl">
                    <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800" onClick={handleBack}>
                        Back
                    </button>
                    <button className="bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg">
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
