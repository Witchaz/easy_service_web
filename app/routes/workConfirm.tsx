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
        additionalExpenses,  
        status: 0,
    });

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
                // Fetch customerID
                const urlCustomerID = `https://easy-service.prakasitj.com/customers/getIDbyName/${encodeURIComponent(formData.customerName)}`;
                const optionsCustomerID = { method: 'GET' };
                const responseCustomerID = await fetch(urlCustomerID, optionsCustomerID);
                const dataCustomerID = await responseCustomerID.json();
                const customerID = dataCustomerID[0].id;
                alert(customerID);

                // Create new Work for warrantyDetails
                if (warrantyDetails.length > 0) {
                    const urlCreateWork = 'https://easy-service.prakasitj.com/works/createNewWork';
                    const optionsCreateWork = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            mail_date: "2024-11-01T08:00:00Z",
                            customerID,
                            address: formData.address,
                            province: formData.province,
                        })
                    };
                    await fetch(urlCreateWork, optionsCreateWork);

                    const urlWorkID = 'https://easy-service.prakasitj.com/works/getLastWork';
                    const responseWorkID = await fetch(urlWorkID, { method: 'GET' });
                    const dataWorkID = await responseWorkID.json();
                    const workID = dataWorkID[0].id;

                    // Create Requests for each detail in warrantyDetails
                    for (const detail of warrantyDetails) {
                        const urlCreateRequests = 'https://easy-service.prakasitj.com/Requests/insertRequest';
                        const optionsCreateRequests = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                model: detail.model,
                                sn: detail.serialNumber,
                                rated: detail.rated,
                                description: detail.description,
                                warranty: true,
                                workID: workID
                            })
                        };
                        await fetch(urlCreateRequests, optionsCreateRequests);
                    }
                }

                // Create new Work for nonWarrantyDetails
                if (nonWarrantyDetails.length > 0) {
                    const urlCreateWork = 'https://easy-service.prakasitj.com/works/createNewWork';
                    const optionsCreateWork = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            mail_date: "2024-11-01T08:00:00Z",
                            customerID,
                            address: formData.address,
                            province: formData.province,
                        })
                    };
                    await fetch(urlCreateWork, optionsCreateWork);

                    const urlWorkID = 'https://easy-service.prakasitj.com/works/getLastWork';
                    const responseWorkID = await fetch(urlWorkID, { method: 'GET' });
                    const dataWorkID = await responseWorkID.json();
                    const workID = dataWorkID[0].id;

                    // Create Requests for each detail in nonWarrantyDetails
                    for (const detail of nonWarrantyDetails) {
                        const urlCreateRequests = 'https://easy-service.prakasitj.com/Requests/insertRequest';
                        const optionsCreateRequests = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                model: detail.model,
                                sn: detail.serialNumber,
                                rated: detail.rated,
                                description: detail.description,
                                warranty: false,
                                workID: workID
                            })
                        };
                        await fetch(urlCreateRequests, optionsCreateRequests);
                    }
                }

                // แสดงข้อความและเปลี่ยนหน้า
                alert("ได้ทำการบันทึกงานแล้ว");
                navigate("/customerList");

            } catch (error) {
                console.error("Error creating work or fetching customer ID:", error);
                alert("เกิดข้อผิดพลาดขณะสร้างงานหรือดึงข้อมูล ID ของลูกค้า");
            }
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
