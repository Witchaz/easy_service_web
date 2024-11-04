import React, { useEffect, useState } from "react";
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
    id: customerId || "",
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // สำหรับเก็บข้อผิดพลาดของฟิลด์

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) {
        setError("Customer ID not provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://easy-service.prakasitj.com/customers/getByID/${customerId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch customer data. Status: ${response.status}`
          );
        }

        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Customer data not found.");
        }

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
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching data.");
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
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // ลบข้อความข้อผิดพลาดเมื่อมีการแก้ไข
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    // ตรวจสอบช่องที่จำเป็นต้องกรอก
    if (!customer.name) errors.name = "ชื่อ/บริษัท ต้องไม่ว่าง";
    if (!customer.tel || customer.tel.length !== 10)
      errors.tel = "หมายเลขโทรศัพท์ต้องมี 10 หลัก";
    if (!customer.address) errors.address = "ที่อยู่ ต้องไม่ว่าง";
    if (!customer.tax_id || customer.tax_id.length !== 10)
      errors.tax_id = "หมายเลขประจำตัวผู้เสียภาษีต้องมี 10 หลัก";
    if (!customer.province) errors.province = "จังหวัด ต้องไม่ว่าง";
    if (customer.credit_limit <= 0)
      errors.credit_limit = "Credit limit ต้องมากกว่า 0";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // ถ้าตรวจสอบไม่มีข้อผิดพลาด
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return; // ตรวจสอบข้อมูลก่อนส่ง

    try {
      const response = await fetch(
        "https://easy-service.prakasitj.com/customers/editcustomers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customer),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer.");
      }

      alert("Customer updated successfully.");
      navigate("/customerList");
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading customer data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Show error message in red
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
          แก้ไขข้อมูลลูกค้า ID: {customer.id}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl"
        >
          <div className="mb-4">
            <label>Name/Company *</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              required
            />
            {formErrors.name && (
              <p className="text-red-500">{formErrors.name}</p>
            )}{" "}
            {/* ข้อผิดพลาดสำหรับชื่อ */}
          </div>
          <div className="mb-4">
            <label>Phone Number *</label>
            <input
              type="text"
              name="tel"
              value={customer.tel}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              required
            />
            {formErrors.tel && <p className="text-red-500">{formErrors.tel}</p>}{" "}
            {/* ข้อผิดพลาดสำหรับโทรศัพท์ */}
          </div>
          <div className="mb-4">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={customer.address}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              required
            />
            {formErrors.address && (
              <p className="text-red-500">{formErrors.address}</p>
            )}{" "}
            {/* ข้อผิดพลาดสำหรับที่อยู่ */}
          </div>
          <div className="mb-4">
            <label>Customer TAX *</label>
            <input
              type="text"
              name="tax_id"
              value={customer.tax_id}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              required
            />
            {formErrors.tax_id && (
              <p className="text-red-500">{formErrors.tax_id}</p>
            )}{" "}
            {/* ข้อผิดพลาดสำหรับ TAX ID */}
          </div>
          <div className="mb-4">
            <label>Province *</label>
            <input
              type="text"
              name="province"
              value={customer.province}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              required
            />
            {formErrors.province && (
              <p className="text-red-500">{formErrors.province}</p>
            )}{" "}
            {/* ข้อผิดพลาดสำหรับจังหวัด */}
          </div>
          <div className="mb-4">
            <label>Credit Limit *</label>
            <input
              type="number"
              name="credit_limit"
              value={customer.credit_limit}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              required
            />
            {formErrors.credit_limit && (
              <p className="text-red-500">{formErrors.credit_limit}</p>
            )}{" "}
            {/* ข้อผิดพลาดสำหรับ Credit Limit */}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => navigate("/customerList")}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-lime-500 text-white py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
