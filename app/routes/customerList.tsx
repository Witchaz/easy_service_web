import { json , LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit} from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";


const ITEMS_PER_PAGE = 6; 

interface Customer {
  name: string;
  email: string;
  location: string;
  orders: number;
  tel: string;
}

interface LoaderData {
  customers: Customer[];
  total: number;
  q: string;
  page: number;
}

const getCustomers = async (searchTerm: string): Promise<Array<Customer>> => {
  
  const customers = [
    { name: 'Devon Lane', email: 'chikeo@mail.com', location: 'Philadelphia, USA', orders: 125, tel: '104,345.00' },
    { name: 'Kathryn Murphy', email: 'rohan_anna@mail.com', location: 'Los Angeles, USA', orders: 11, tel: '2,400.98' },
    { name: 'Eleanor Pena', email: 'pedroharu@mail.com', location: 'Manhattan, USA', orders: 98, tel: '56,987.00' },
    { name: 'Annette Black', email: 'eusebia234@mail.com', location: 'Toronto, CA', orders: 51, tel: '12,567.90' },
    { name: 'Guy Hawkins', email: 'midget1245@mail.com', location: 'Pittsburgh, USA', orders: 12, tel: '4,670.44' },
    { name: 'Floyd Miles', email: 'mottgeoff@mail.com', location: 'Montreal, CA', orders: 56, tel: '24,456.56' },
    
  ];

  if (searchTerm) {
    return customers.filter(customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
  
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  return (
    <>
      <NavBar />
        <div className="min-h-screen p-8 bg-gray-50">
          <h1 className="text-center text-3xl font-bold mb-8">Customer</h1>
          
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
                  <th className="p-2">Customer Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Orders</th>
                  <th className="p-2">Tel.</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      <input
                        type="radio"
                        name="customer"
                        value={customer.name}
                        onChange={() => setSelectedCustomer(customer.name)} 
                        checked={selectedCustomer === customer.name} 
                      />
                    </td>
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.location}</td>
                    <td className="p-2">{customer.orders} orders</td>
                    <td className="p-2">${customer.tel}</td>
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
                  <Link to={`?page=${page - 1}&q=${q}`} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">Previous</Link>
                )}
                {page < totalPages && (
                  <Link to={`?page=${page + 1}&q=${q}`} className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">Next</Link>
                )}
              </div>
            </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button className="bg-yellow-400 text-white py-2 px-6 rounded-lg hover:bg-yellow-500 mr-8"
              onClick={() => alert(`Selected: ${selectedCustomer}`)}>Select</button>
              
            <a href="/newUser">
              <button className="bg-lime-500 text-white py-2 px-6 rounded-lg hover:bg-lime-600">ADD</button>
            </a>
            
            </div>
          </div>
          </div>
      </>
  );
}


