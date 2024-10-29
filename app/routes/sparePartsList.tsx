import { json , LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit} from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "app/components/_navBar";
import { useNavigate } from "react-router-dom"; 


const ITEMS_PER_PAGE = 6; 

interface SpareParts {
  name: string;
  id: string;
  quantity: number;
  price: number;
  unti: string;
}

interface LoaderData {
  SparePartss: SpareParts[];
  total: number;
  q: string;
  page: number;
}

const getSparePartss = async (searchTerm: string): Promise<Array<SpareParts>> => {
  
  const SparePartss = [
    { name: 'Devon Lane', id: 'chikeo@mail.com', quantity: 4, price: 125, unti: '104,345.00' },
    { name: 'Kathryn Murphy', id: 'rohan_anna@mail.com', quantity: 7, price: 11, unti: '2,400.98' },
    { name: 'Eleanor Pena', id: 'pedroharu@mail.com', quantity: 74, price: 98, unti: '56,987.00' },
    { name: 'Annette Black', id: 'eusebia234@mail.com', quantity: 25, price: 51, unti: '12,567.90' },
    { name: 'Guy Hawkins', id: 'midget1245@mail.com', quantity: 23, price: 12, unti: '4,670.44' },
    { name: 'Floyd Miles', id: 'mottgeoff@mail.com', quantity: 85, price: 56, unti: '24,456.56' },
    
  ];

  if (searchTerm) {
        return SparePartss.filter(SpareParts => SpareParts.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  return SparePartss;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  
  const SparePartss = await getSparePartss(q); 
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedSparePartss = SparePartss.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  return json({ SparePartss: paginatedSparePartss, total: SparePartss.length, q, page });
};

export default function SparePartsList() {
  const { SparePartss, total, q, page } = useLoaderData<LoaderData>(); 
  const submit = useSubmit();
  const navigate = useNavigate();
  
  const [selectedSpareParts, setSelectedSpareParts] = useState<string | null>(null);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  
  const handleSelect = () => {
    if (selectedSpareParts) {
      navigate('/workDescription', { state: { SparePartsName: selectedSpareParts } });
    } else {
      alert("กรุณาเลือกผู้ใช้ก่อน");
    }
    };
    
    const handleAdd = () => {
        navigate('/addSpareParts');
    }
    return (
        <>
        <NavBar />
            <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-center text-3xl font-bold  text-lime-600 mb-8">คลังอะไหล่</h1>
            
            <div className="bg-white p-4 shadow-md rounded-lg">
                <Form id="search-form" onChange={(event) => submit(event.currentTarget)} role="search">
                <input
                    type="text"
                    aria-label="Search SparePartss"
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
                    <th className="p-2">SpareParts Name</th>
                    <th className="p-2">id</th>
                    <th className="p-2">quantity</th>
                    <th className="p-2">price</th>
                    <th className="p-2">unti.</th>
                    </tr>
                </thead>
                <tbody>
                    {SparePartss.map((SpareParts, index) => (
                    <tr key={index} className="border-t">
                        <td className="p-2">
                        <input
                            type="radio"
                            name="SpareParts"
                            value={SpareParts.name}
                            onChange={() => setSelectedSpareParts(SpareParts.name)} 
                            checked={selectedSpareParts === SpareParts.name} 
                        />
                        </td>
                        <td className="p-2">{SpareParts.name}</td>
                        <td className="p-2">{SpareParts.id}</td>
                        <td className="p-2">{SpareParts.quantity}</td>
                        <td className="p-2">{SpareParts.price} price</td>
                        <td className="p-2">${SpareParts.unti}</td>
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
                    <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600" onClick={handleAdd}>
                        Add
                    </button>
                    
                    <button className="bg-lime-500 text-white py-2 px-6 rounded-lg hover:bg-lime-600" onClick={handleSelect}>
                        Select
                    </button>
                </div>
            </div>
            </div>
        </>
    );
}


