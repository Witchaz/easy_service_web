import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

export default function WorkConfirm() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        customerName,
        address,
        province,
        mailDate,
        details = [],
        engineer = "",
        additionalExpenses = [], 
        status,
    } = location.state || {};

    const [formData] = useState({
        customerName,
        address,
        province,
        mailDate,
        details: details.map((detail: { id: any }, index: number) => ({
            ...detail,
            id: detail.id || index + 1,
        })),
        engineer,
        additionalExpenses,  
        status: 0,
    });

    const totalCost = formData.additionalExpenses.reduce((sum: any, expense: { cost: any; }) => sum + (expense.cost || 0), 0);

    useEffect(() => {
        sessionStorage.setItem("initialFormData", JSON.stringify(formData));
    }, []);

    const handleBack = () => {
        navigate("/work", { state: { ...formData } });
    };

    const handleEditDetails = () => {
        navigate("/machineConfirm", { state: { ...formData } });
    };

    const handleSave = () => {
        const warrantyDetails = formData.details.filter((detail: { warranty: boolean; }) => detail.warranty === true);
        const nonWarrantyDetails = formData.details.filter((detail: { warranty: boolean; }) => detail.warranty === false);

        // เพิ่มการบันทึกข้อมูลหรือส่งข้อมูลต่อที่นี่
        console.log("Details with warranty:", warrantyDetails);
        console.log("Details without warranty:", nonWarrantyDetails);

        alert("ได้ทำการเพิ่มงานเรียบร้อยแล้ว");
        navigate("/customerList");
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h1 className="text-center text-3xl font-semibold text-lime-600 mt-8 mb-6">
                    ยืนยันการบันทึก
                </h1>
                
                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[550px] overflow-y-auto mb-6">
                    <div className="border-b border-gray-300 py-4">
                        <p><strong>ชื่อลูกค้า:</strong> {formData.customerName}</p>
                        <p><strong>สถานที่ซ่อม:</strong> {formData.address}</p>

                        {formData.details.length > 0 ? (
                            formData.details.slice(0, 4).map((detail: { id: Key | null | undefined; model: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; serialNumber: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: number) => (
                                <p key={detail.id}>
                                    <strong>รายละเอียดเครื่องซ่อมลำดับที่ {index + 1} :</strong> Model: {detail.model}, Serial Number: {detail.serialNumber}
                                </p>
                            ))
                        ) : (
                            <p>รายละเอียด : -</p>
                        )}
                        {formData.details.length > 4  && <p>...</p>}

                        <div className="flex space-x-4 mt-4">
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleEditDetails}>
                                details machine
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full max-w-4xl">
                    <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800" onClick={handleBack}>
                        Back
                    </button>
                    <button className="bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
