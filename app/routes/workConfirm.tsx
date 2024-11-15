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
    console.log(customerName)
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
            const urlCustomerID = `https://easy-service.prakasitj.com/customers/getIDbyName/${(formData.customerName)}`;
            const optionsCustomerID = { method: 'GET' };
            const responseCustomerID = await fetch(urlCustomerID, optionsCustomerID);

            if (!responseCustomerID.ok) {
                throw new Error(`Failed to fetch customer ID: ${responseCustomerID.status}`);
            }

            const dataCustomerID = await responseCustomerID.json();

            if (!dataCustomerID || !Array.isArray(dataCustomerID) || dataCustomerID.length === 0) {
                throw new Error('No customer found with the given name.');
            }

            const customerID = dataCustomerID[0].id;

            // Process warrantyDetails
            if (warrantyDetails.length > 0) {
                await createWorkAndRequests(customerID, warrantyDetails, true);
            }

            // Process nonWarrantyDetails
            if (nonWarrantyDetails.length > 0) {
                await createWorkAndRequests(customerID, nonWarrantyDetails, false);
            }

            // Show success message and navigate
            alert("ได้ทำการบันทึกงานแล้ว");
            navigate("/customerList");
        } catch (error) {
            console.error("Error creating work or fetching customer ID:", error);
            alert("เกิดข้อผิดพลาดขณะสร้างงานหรือดึงข้อมูล ID ของลูกค้า");
        }
        }
    else {
        const urlCustomerID = `https://easy-service.prakasitj.com/customers/getIDbyName/${(formData.customerName)}`;
        const optionsCustomerID = { method: 'GET' };
        const responseCustomerID = await fetch(urlCustomerID, optionsCustomerID);

        if (!responseCustomerID.ok) {
            throw new Error(`Failed to fetch customer ID: ${responseCustomerID.status}`);
        }

        const dataCustomerID = await responseCustomerID.json();

        if (!dataCustomerID || !Array.isArray(dataCustomerID) || dataCustomerID.length === 0) {
            throw new Error('No customer found with the given name.');
        }

        const customerID = dataCustomerID[0].id;
        const urlCreateWork = 'https://easy-service.prakasitj.com/works/createNewWork';
        const optionsCreateWork = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            
            customer_id: customerID,
            address: formData.address,
            province: formData.province,
        }),
        };

        const responseCreateWork = await fetch(urlCreateWork, optionsCreateWork);
        alert("ได้ทำการบันทึกงานแล้ว");
        navigate("/customerList");
        }
};

// Helper function to create work and requests
const createWorkAndRequests = async (customerID: any, details: any, isWarranty: boolean) => {
    const urlCreateWork = 'https://easy-service.prakasitj.com/works/createNewWork';
    const optionsCreateWork = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            
            customer_id: customerID,
            address: formData.address,
            province: formData.province,
        }),
    };

    const responseCreateWork = await fetch(urlCreateWork, optionsCreateWork);

    if (!responseCreateWork.ok) {
        throw new Error('Failed to create a new work entry.');
    }

    const urlWorkID = 'https://easy-service.prakasitj.com/works/getLastWork';
    const responseWorkID = await fetch(urlWorkID, { method: 'GET' });

    if (!responseWorkID.ok) {
        throw new Error('Failed to fetch the last work ID.');
    }

    const dataWorkID = await responseWorkID.json();
    const workID = dataWorkID[0].id;

    for (const detail of details) {
        const urlCreateRequests = 'https://easy-service.prakasitj.com/Requests/insertRequest';
        const optionsCreateRequests = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: detail.model,
                sn: detail.serialNumber,
                rated: detail.rated,
                description: detail.description,
                warranty: isWarranty,
                work_id: workID,
            }),
        };

        const responseCreateRequest = await fetch(urlCreateRequests, optionsCreateRequests);

        if (!responseCreateRequest.ok) {
            throw new Error('Failed to create a request entry.');
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
