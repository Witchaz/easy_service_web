import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

interface Customer {
  id: string;
  name: string;
  credit_limit: number;
  address: string;
  tax_id: string;
  tel: string;
  province: string;
  addDate: Date | string; // สามารถเป็น Date หรือ string ได้
}

interface LoaderData {
  customers: Customer[];
  total: number;
  q: string;
  page: number;
}

const getCustomers = async (searchTerm: string): Promise<Array<Customer>> => {
  const response = await fetch("https://easy-service.prakasitj.com/customers/getList");
  const customers: Customer[] = await response.json();

  if (searchTerm) {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  return customers;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const customers = await getCustomers(q);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = customers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return json({ customers: paginatedCustomers, total: customers.length, q, page });
};

export default function CustomerList() {
  const { customers, total, q, page } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSelect = () => {
    if (selectedCustomer) {
      navigate("/workDescription", { state: { customerId: selectedCustomer } });
    } else {
      alert("กรุณาเลือกผู้ใช้ก่อน");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-center text-3xl font-bold text-lime-600 mb-8">ข้อมูลลูกค้า</h1>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <Form id="search-form" onChange={(event) => submit(event.currentTarget)} role="search">
            <input
              type="text"
              aria-label="Search customers"
              id="q"
              name="q"
              placeholder="Search by name"
              className="border border-gray-300 rounded-lg p-2 w-1/3"
            />
          </Form>

          <table className="table-auto w-full text-left">
            <thead className="text-gray-600">
              <tr>
                <th className="p-2">Select</th>
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Credit Limit</th>
                <th className="p-2">Address</th>
                <th className="p-2">Tax ID</th>
                <th className="p-2">Tel.</th>
                <th className="p-2">Province</th>
                <th className="p-2">Add Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="radio"
                      name="customer"
                      value={customer.id}
                      onChange={() => setSelectedCustomer(customer.id)}
                      checked={selectedCustomer === customer.id}
                    />
                  </td>
                  <td className="p-2">{customer.id}</td>
                  <td className="p-2">{customer.name}</td>
                  <td className="p-2">${customer.credit_limit.toFixed(2)}</td>
                  <td className="p-2">{customer.address}</td>
                  <td className="p-2">{customer.tax_id}</td>
                  <td className="p-2">{customer.tel}</td>
                  <td className="p-2">{customer.province}</td>
                  <td className="p-2">
                    {new Date(customer.addDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span>Page: {page} of {totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              {page > 1 && (
                <Link to={`?page=${page - 1}&q=${q}`} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link to={`?page=${page + 1}&q=${q}`} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
                  Next
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button className="bg-yellow-400 text-white py-2 px-6 rounded-lg hover:bg-yellow-500" onClick={handleSelect}>
              Select
            </button>

            <a href="/newUser">
              <button className="bg-lime-500 text-white py-2 px-6 rounded-lg hover:bg-lime-600">ADD</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
