import React, { useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

interface FormData {
    name: string;
    phoneNumber: string;
    address: string;
    customerTax: string;
    province: string;
    creditLimit: number; 
    addDate: string; 
}

export default function EditCustomer() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        phoneNumber: "",
        address: "",
        customerTax: "",
        province: "",
        creditLimit: 0, 
        addDate: "", 
    });

    const [errors, setErrors] = useState<Partial<FormData>>({
        name: "",
        phoneNumber: "",
        address: "",
        customerTax: "",
        province: "",
        creditLimit: 0,
        addDate: "",
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const newValue = name === "creditLimit" ? Number(value) : value;

        setFormData({
            ...formData,
            [name]: newValue,
        });
        setErrors({
            ...errors,
            [name]: "", 
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Partial<FormData> = {};

        
        if (!formData.name) newErrors.name = "Name/Company is required.";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
        if (!formData.address) newErrors.address = "Address is required.";
        if (!formData.customerTax) newErrors.customerTax = "Customer TAX is required.";
        if (!formData.province) newErrors.province = "Province is required.";
        
        if (!formData.addDate) newErrors.addDate = "Add Date is required.";

      if (Object.keys(newErrors).length > 0) {
          //addค่าลูกค้า
             navigate("/customerList")
        }
    
    };

    const handleBack = () => {
       navigate("/customerList")
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">แก้ไขข้อมูลลูกค้า</h2>
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
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
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
                            name="customerTax"
                            value={formData.customerTax}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.customerTax && <p className="text-red-500 text-sm">{errors.customerTax}</p>}
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
                            name="creditLimit"
                            value={formData.creditLimit}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        
                    </div>
                    <div className="mb-4">
                        <label>Add Date *</label>
                        <input
                            type="date"
                            name="addDate"
                            value={formData.addDate}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                        {errors.addDate && <p className="text-red-500 text-sm">{errors.addDate}</p>}
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
