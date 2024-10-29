import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
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
        additionalExpenses = [], 
        status = 0,
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
        status,
    });

    const totalCost = formData.additionalExpenses.reduce((sum: any, expense: { cost: any; }) => sum + (expense.cost || 0), 0);
  
    useEffect(() => {
        sessionStorage.setItem("initialFormData", JSON.stringify(formData));
    }, []);

    const handleBack = () => {
        navigate("/customerList");
    };

    const handleEditDetails = () => {
        navigate("/machineList", { state: { ...formData } });
    };

    const handleEditAddress = () => {
        navigate("/workDescription", { state: { work: formData, from: "/work" } });
    };

    const handleNext = () => {
        if (formData.details.length < 1) {
            alert("กรุณาเพิ่มรายละเอียดเครื่องอย่างน้อย 1 เครื่องก่อนดำเนินการต่อ");
        } else {
            navigate("/workConfirm", { state: { ...formData } });
        }
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
                        {formData.details.length > 4 && <p>...</p>}

                        
                        <div className="flex space-x-4 mt-4">
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleEditDetails}>
                                Edit Details
                            </button>
                            <button className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg"
                                onClick={handleEditAddress}>
                                Edit Address
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full max-w-4xl">
                    <button className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800" onClick={handleBack}>
                        Back
                    </button>
                    <button className="bg-lime-500 text-white font-semibold px-4 py-2 rounded-lg" onClick={handleNext}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
