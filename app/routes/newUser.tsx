import { useState } from "react";
import { Form } from "@remix-run/react"; 
import NavBar from "app/components/_navBar";
import React from "react";


export default function newUser() {
  const [nameUser, setNameUser] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [tax, setTax] = useState("");
  const [province, setProvince] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [date, setDate] = useState("");
    
  const [error, setError] = useState(""); 
  const [fieldError, setFieldError] = useState("");
    
  let newUser = (nameUser: string, phoneNumber: string, address: string, tax: string, province: string, creditLimit: number, date: Date): boolean => {
    //if else
    return false
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const creditLimitNumber = parseFloat(creditLimit); 
    const dateObject = new Date(date); 

    newUser(nameUser, phoneNumber, address, tax, province, creditLimitNumber, dateObject);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col space-y-4 p-5 justify-center align-middle min-h-screen">
        <h1 className="text-center font-bold text-3xl">Easy service</h1>
        <h2 className="text-center text-xl">New User Page</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {fieldError && <p className="text-red-500 text-center">{fieldError}</p>}       

        <div className="grid grid-cols-[250px_auto] justify-center gap-2">
          <Form>
            <h3>Username :</h3>
            <input
              value={nameUser}
              name="nameUser"
              className="bg-slate-500 shrink border-white border-2 max-w-80 "
              onChange={(e) => setNameUser(e.target.value)}
              required
            /></Form>
          <Form>
            <h3>phoneNumber :</h3>
            <input
              value={phoneNumber}
              name="phoneNumber"
              className="bg-slate-500 shrink border-white border-2 max-w-80"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              />
          </Form>
          <Form>
          <h3>Address:</h3>
          <input
            value={address}
            name="address"
            className="bg-slate-500 shrink border-white border-2 max-w-80"
            onChange={(e) => setAddress(e.target.value)}
            required
            />
          </Form>
          <Form>
            <h3>Tax :</h3>
            <input
              value={tax}
              name="tax"
              className="bg-slate-500 shrink border-white border-2 max-w-80 "
              onChange={(e) => setTax(e.target.value)}
              required
            /></Form>
          <Form>
            <h3>Province :</h3>
            <input
              value={province}
              name="province"
              className="bg-slate-500 shrink border-white border-2 max-w-80"
              onChange={(e) => setProvince(e.target.value)}
              required
              />
          </Form>
          <Form>
          <h3>Credit Limit:</h3>
          <input
            value={creditLimit}
            name="creditLimit"
            className="bg-slate-500 shrink border-white border-2 max-w-80"
            type="number"
            onChange={(e) => setCreditLimit(e.target.value)}
            required
            />
          </Form>
          <Form>
            <h3>Date:</h3>
            <input
              value={date}
              name="date"
              className="bg-slate-500 shrink border-white border-2 max-w-80"
              type="date"
              onChange={(e) => setDate(e.target.value)}
              required
              />
          </Form>
        </div>
        <div className="flex justify-center">
          <a href = '/customerList'>
            <button type="button" className="bg-red-600 text-white shrink border-white border-2 hover:bg-red-800 p-2 rounded-lg mr-8">
              cancel
            </button>
          </a>
          <button type="submit"
            className="bg-lime-500 text-white shrink border-white border-2 hover:bg-lime-600 p-2 rounded-lg ml-8">
            Add
          </button>
        </div>
      </div>
    </>
  );
}
