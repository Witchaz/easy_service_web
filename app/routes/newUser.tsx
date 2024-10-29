import React, { useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

interface FormData {
    name: string;
    tel: string;
    address: string;
    tax_id: string;
    province: string;
    credit_limit: number; 
}

const NewCustomer: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        tel: "",
        address: "",
        tax_id: "",
        province: "",
        credit_limit: 0,  
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === "credit_limit" ? Number(value) : value,
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = (): Partial<FormData> => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name) newErrors.name = "Name/Company is required.";
        if (!formData.tel) {
            newErrors.tel = "Phone Number is required.";
        } else if (!/^\d{10}$/.test(formData.tel)) {
            newErrors.tel = "Phone Number must be a 10-digit number.";
        }
        if (!formData.address) newErrors.address = "Address is required.";
        if (!formData.tax_id) {
            newErrors.tax_id = "Customer TAX is required.";
        } else if (!/^\d{10}$/.test(formData.tax_id)) {
            newErrors.tax_id = "Customer TAX must be a 10-digit number.";
        }
        if (!formData.province) newErrors.province = "Province is required.";

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (formData.credit_limit >= 0) {
            

            if (Object.keys(formErrors).length > 0) {
                setErrors(formErrors);
                return;
            }

            try {
                const response = await fetch("https://easy-service.prakasitj.com/customers/addNewCustomer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            
                if (response.ok) {
                    alert("Customer added successfully.");
                    navigate("/customerList");
                } else {
                    alert("Failed to add customer.");
                }
            } catch (error) {
                console.error("Error adding customer:", error);
                alert("An error occurred. Please try again.");
            }
        }
        alert("credit_limit >= 0.");
    };

    const handleBack = () => {
        navigate("/customerList");
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-2xl font-semibold text-lime-600 mt-8 mb-6">เพิ่มข้อมูลลูกค้า</h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    {["name", "tel", "address", "tax_id", "province"].map((field, idx) => (
                        <div key={idx} className="mb-4">
                            <label className="capitalize">{field.replace("_", " ")} *</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field as keyof FormData]}
                                onChange={handleChange}
                                className="border rounded w-full py-2 px-3"
                            />
                            {errors[field as keyof FormData] && (
                                <p className="text-red-500 text-sm">{errors[field as keyof FormData]}</p>
                            )}
                        </div>
                    ))}
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
};

export default NewCustomer;