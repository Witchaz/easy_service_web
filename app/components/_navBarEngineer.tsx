import { useLocation, useNavigate } from "react-router-dom";

interface NavBarProps {
    id: string; // เพิ่ม props id
  }

function NavBar({ id }: NavBarProps) {
    const navigate = useNavigate();
    const handleNavigate = (path:string) => {
        navigate(path, { state:  id  }); // ส่ง id ไปยัง path ใหม่
      };
    
    
    return (
      <>
        <div className="bg-gray-500 flex p-5">
          <h1 className="text-2xl font-bold grow text-primary">
            Service Innovation
          </h1>
          <div className="flex flex-row space-x-5">
            <a
              className="font-bold hover:text-primary"
              href="https://www.google.com"
            >
              Inventory
            </a>
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/workListEngineer")}>
              Work order
            </a>
            <a className="font-bold hover:text-primary" href="">
              Document
            </a>
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/request")}>
              Request
            </a>
          </div>
        </div>
      </>
    );
  }
  
  export default NavBar;