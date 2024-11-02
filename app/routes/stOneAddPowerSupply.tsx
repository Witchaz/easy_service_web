import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "app/components/_navBar";

interface Machine {
  serialNumber: string;
  model: string;
  rated: string;
  warranty: boolean;
  description: string;
}

export default function StOneAddPowerSupply() {
    const navigate = useNavigate();
    const location = useLocation();
        const { workId } = location.state || {}; // Receiving workId from the previous page
        

    const [formMachineData, setFormMachineData] = useState({
        serialNumber: "",
        model: "",
        rated: "",
        warranty: false,
        description: "",
    });

    const [errors, setErrors] = useState({
        serialNumber: false,
        model: false,
        rated: false,
        description: false,
    });

    const handleChange = (e: { target: { name: string; value: any; checked: boolean; type: string } }) => {
        const { name, value, checked, type } = e.target;
        setFormMachineData({
        ...formMachineData,
        [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        
        const newErrors = {
        serialNumber: !formMachineData.serialNumber,
        rated: !formMachineData.rated,
        model: !formMachineData.model,
        description: !formMachineData.description,
        };

        setErrors(newErrors);
        if (!Object.values(newErrors).includes(true)) {
        // Prepare data for API call
        const payload = {
            model: formMachineData.model,
            sn: formMachineData.serialNumber,
            rated: formMachineData.rated,
            description: formMachineData.description,
            warranty: formMachineData.warranty,
            workID: workId,
        };

        // API call to insert new machine request
        const url = 'https://easy-service.prakasitj.com/Requests/insertRequest';
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        };

        const response = await fetch(url, options);
        const data = await response.json();  
        alert("Machine added successfully!");
        navigate("/stOnePowerSupplyList", { state: { workId } });
    }
  };

  const handleBack = () => {
    navigate("/stOnePowerSupplyList", { state: { workId } });
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md w-[800px] max-w-full">
          <h2 className="text-center text-2xl font-semibold text-lime-600 mb-6">รายละเอียดเครื่องที่จะซ่อม</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Serial Number</label>
              <input 
                type="text" 
                name="serialNumber"
                value={formMachineData.serialNumber}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.serialNumber && <p className="text-red-500 text-sm">Please enter the serial number.</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Model / Type</label>
              <input 
                type="text" 
                name="model"
                value={formMachineData.model}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.model && <p className="text-red-500 text-sm">Please enter the model/type.</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Rated</label>
              <input 
                type="text" 
                name="rated"
                value={formMachineData.rated}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.rated && <p className="text-red-500 text-sm">Please enter the rated value.</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <input 
                type="text" 
                name="description"
                value={formMachineData.description}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3"
              />
              {errors.description && <p className="text-red-500 text-sm">Please enter a description.</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Warranty</label>
              <input 
                type="checkbox" 
                name="warranty"
                checked={formMachineData.warranty}
                onChange={handleChange}
                className="appearance-none w-8 h-8 border-2 border-red-500 rounded-md checked:bg-lime-500 checked:border-lime-500 focus:outline-none mr-2"
              />
              <span>{formMachineData.warranty ? "Yes" : "No"}</span>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button type="button" className="bg-black text-white border-white border-2 hover:bg-gray-800 p-2 rounded-lg"
                onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="bg-lime-500 text-white border-white border-2 hover:bg-lime-600 p-2 rounded-lg">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}