import React, { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate, useLocation } from "react-router-dom";

interface Customer {
    id: string;
    name: string;
    credit_limit: number;
    address: string;
    tax_id: string;
    tel: string;
    province: string;
    add_date: Date;
}

export default function CustomerEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const { customerId } = location.state || {};

    const [customer, setCustomer] = useState<Customer>({
        id: customerId,
        name: "",
        credit_limit: 0,
        address: "",
        tax_id: "",
        tel: "",
        province: "",
        add_date: new Date(),
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    const fetchCustomerData = async () => {
        if (!customerId) {
            console.error("Customer ID is missing. Unable to fetch data.");
            setError("Customer ID not provided.");
            setLoading(false);
            return;
        }

        try {
            console.log("Fetching customer data for ID:", customerId);
            const response = await fetch(`https://easy-service.prakasitj.com/customers/getByID/${customerId}`);

            if (!response.ok) {
                console.error("Failed to fetch customer data. Status:", response.status);
                setError("Failed to fetch customer data.");
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            if (!data || data.length === 0) {
                console.error("No data returned for customer ID:", customerId);
                setError("Customer data not found.");
            } else {
                setCustomer({
                    id: data.id || customerId,
                    name: data.name || "",
                    credit_limit: data.credit_limit || 0,
                    address: data.address || "",
                    tax_id: data.tax_id || "",
                    tel: data.tel || "",
                    province: data.province || "",
                    add_date: new Date(data.add_date), 
                });
                setError("");
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setError("An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    fetchCustomerData();
}, [customerId]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: name === "credit_limit" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("https://easy-service.prakasitj.com/customers/editCustomer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                alert("Customer updated successfully.");
                navigate("/customerList");
            } else {
                alert("Failed to update customer.");
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading customer data...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100">
                <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
                    แก้ไขข้อมูลลูกค้า ID: {customer.id} {customer.name}
                </h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    <div className="mb-4">
                        <label>Name/Company *</label>
                        <input
                            type="text"
                            name="name"
                            value={customer.name}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Phone Number *</label>
                        <input
                            type="text"
                            name="tel"
                            value={customer.tel}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Address *</label>
                        <input
                            type="text"
                            name="address"
                            value={customer.address}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Customer TAX *</label>
                        <input
                            type="text"
                            name="tax_id"
                            value={customer.tax_id}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Province *</label>
                        <input
                            type="text"
                            name="province"
                            value={customer.province}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Credit Limit *</label>
                        <input
                            type="number"
                            name="credit_limit"
                            value={customer.credit_limit}
                            onChange={handleChange}
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => navigate("/customerList")}>
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
