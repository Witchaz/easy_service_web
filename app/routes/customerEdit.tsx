import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface FormData {
    name: string;
    tel: string;
    address: string;
    tax_id: string;
    province: string;
    credit_limit: number; 
    id: string;
}

export default function CustomerEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const { customerId } = location.state || {};  // Retrieve customerId from state

    const [formData, setFormData] = useState<FormData>({
        name: "",
        tel: "",
        address: "",
        tax_id: "",
        province: "",
        credit_limit: 0,  
        id: "",
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    useEffect(() => {
        // Fetch customer data by customerId
        if (customerId) {
            fetch(`https://easy-service.prakasitj.com/customers/getByID/${customerId}`, { method: "GET" })
                .then(response => response.json())
                .then(data => {
                    setFormData({
                        name: data.name,
                        tel: data.tel,
                        address: data.address,
                        tax_id: data.tax_id,
                        province: data.province,
                        credit_limit: data.credit_limit,
                        id: data.id,
                    });
                })
                .catch(error => console.error("Error fetching customer data:", error));
        }
    }, [customerId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "credit_limit" ? Number(value) : value,
        });
        setErrors({
            ...errors,
            [name]: "", 
        });
    };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const newErrors: Partial<FormData> = {};

    //     if (!formData.name) newErrors.name = "Name/Company is required.";
    //     if (!formData.tel) newErrors.tel = "Phone Number is required.";
    //     if (!formData.address) newErrors.address = "Address is required.";
    //     if (!formData.tax_id) newErrors.tax_id = "Customer TAX is required.";
    //     if (!formData.province) newErrors.province = "Province is required.";

    //     if (Object.keys(newErrors).length === 0) {
    //         try {
    //             const url = `https://easy-service.prakasitj.com/customers/updateCustomer/${customerId}`;
    //             const response = await fetch(url, {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(formData),
    //             });
    //             if (response.ok) {
    //                 alert("Customer updated successfully.");
    //                 navigate("/customerList");
    //             } else {
    //                 alert("Failed to update customer.");
    //             }
    //         } catch (error) {
    //             console.error("Error updating customer:", error);
    //             alert("An error occurred. Please try again.");
    //         }
    //     } else {
    //         setErrors(newErrors);
    //     }
    // };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Partial<FormData> = {};

        
        if (!formData.name) newErrors.name = "Name/Company is required.";
        if (!formData.tel) newErrors.tel = "Phone Number is required.";
        if (!formData.address) newErrors.address = "Address is required.";
        if (!formData.tax_id) newErrors.tax_id = "Customer TAX is required.";
        if (!formData.province) newErrors.province = "Province is required.";
        

      if (Object.keys(newErrors).length <= 0) {
          
                try {//แก้
                    const url = "https://easy-service.prakasitj.com/customers/addNewCustomer";
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    console.log(response);
                    if (response.ok) {
                        alert("add new customer.");
                        navigate("/customerList");
                    } else {
                        alert("Failed to add customer.");
                    }
                } catch (error) {
                    console.error("Error adding customer:", error);
                    alert("An error occurred. Please try again.");
                }
            }
              
        };

    const handleBack = () => {
        navigate("/customerList");
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                    แก้ไขข้อมูลลูกค้า ID: {formData.id}
                </h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    <div className="mb-4">
                        <label>Name/Company *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Phone Number *</label>
                        <input
                            type="text"
                            name="tel"
                            value={formData.tel}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.tel && <p className="text-red-500 text-sm">{errors.tel}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Address *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Customer TAX *</label>
                        <input
                            type="text"
                            name="tax_id"
                            value={formData.tax_id}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.tax_id && <p className="text-red-500 text-sm">{errors.tax_id}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Province *</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                    </div>
                    <div className="mb-4">
                        <label>Credit Limit *</label>
                        <input
                            type="number"
                            name="credit_limit"
                            value={formData.credit_limit}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleBack}>
                            Back
                        </button>
                        <button type="submit" className="bg-lime-500 text-white py-2 px-4 rounded">
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
