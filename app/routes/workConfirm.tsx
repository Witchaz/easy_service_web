import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

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

    const handleSave = async () => {
        const warrantyDetails = formData.details.filter((detail: { warranty: boolean; }) => detail.warranty === true);
        const nonWarrantyDetails = formData.details.filter((detail: { warranty: boolean; }) => detail.warranty === false);
        
        if (warrantyDetails.length > 0 || nonWarrantyDetails.length > 0) {
            try {
                // 1. Get customerID by customerName using the specified URL
                const url = `https://easy-service.prakasitj.com/customers/getIDbyName/${encodeURIComponent(formData.customerName)}`;
                const options = { method: 'POST' };
                
                const response = await fetch(url, options);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to retrieve customer ID: ${errorText}`);
                }
                
                const data = await response.json();
                const customerID = data?.id;

                if (!customerID) {
                    throw new Error("Customer ID not found.");
                }

                // 2. Create new Work for warrantyDetails
                if (warrantyDetails.length > 0) {
                    const workResponse = await fetch("https://easy-service.prakasitj.com/works/createNewWork", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            mail_date: formData.mailDate,
                            service_date: null,
                            customerID,
                            address: formData.address,
                            province: formData.province,
                        }),
                    });

                    if (!workResponse.ok) {
                        const errorMessage = await workResponse.text();
                        throw new Error(`Failed to create work for warrantyDetails: ${errorMessage}`);
                    }

                    const workData = await workResponse.json();
                    const warrantyWorkID = workData?.id;

                    if (!warrantyWorkID) {
                        throw new Error("Failed to retrieve warrantyWorkID from the work creation response.");
                    }

                    // Create Request for each machine under warranty
                    for (const detail of warrantyDetails) {
                        await fetch("https://easy-service.prakasitj.com/request/insertRequest", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                model: detail.model,
                                sn: null,
                                rated: detail.rated,
                                description: detail.description,
                                warranty: detail.warranty,
                                workID: warrantyWorkID,
                            }),
                        });
                    }
                }

                // 3. Create new Work for nonWarrantyDetails
                if (nonWarrantyDetails.length > 0) {
                    const workResponse = await fetch("https://easy-service.prakasitj.com/works/createNewWork", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            mail_date: formData.mailDate,
                            service_date: null,
                            customerID,
                            address: formData.address,
                            province: formData.province,
                        }),
                    });

                    if (!workResponse.ok) {
                        const errorMessage = await workResponse.text();
                        throw new Error(`Failed to create work for nonWarrantyDetails: ${errorMessage}`);
                    }

                    const workData = await workResponse.json();
                    const nonWarrantyWorkID = workData?.id;

                    if (!nonWarrantyWorkID) {
                        throw new Error("Failed to retrieve nonWarrantyWorkID from the work creation response.");
                    }

                    // Create Request for each machine not under warranty
                    for (const detail of nonWarrantyDetails) {
                        await fetch("https://easy-service.prakasitj.com/request/insertRequest", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                model: detail.model,
                                sn: null,
                                rated: detail.rated,
                                description: detail.description,
                                warranty: detail.warranty,
                                workID: nonWarrantyWorkID,
                            }),
                        });
                    }
                }

                alert("ได้ทำการเพิ่มงานเรียบร้อยแล้ว");
                navigate("/customerList");
            } catch (error) {
                console.error("Error creating work or requests:", error);
                alert("เกิดข้อผิดพลาดขณะสร้างงานหรือบันทึกรายละเอียด");
            }
        } else {
            alert("ไม่มีรายละเอียดสำหรับการบันทึกงาน");
        }
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
                            formData.details.slice(0, 4).map((detail: { id: any; model: any; serialNumber: any; }, index: number) => (
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
