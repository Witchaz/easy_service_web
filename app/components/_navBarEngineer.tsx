import {useNavigate } from "react-router-dom";


function NavBar() {
    const navigate = useNavigate();
    const handleNavigate = (path:string) => {
        navigate(path);
      };
    
    
    return (
      <>
        <div className="bg-gray-500 flex p-5">
          <h1 className="text-2xl font-bold grow text-primary">
            Service Innovation
          </h1>
          <div className="flex flex-row space-x-5">
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/workListEngineer")}>
              งานทั้งหมดที่ต้องไปตรวจ
            </a>
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/workListSEngineer")}>
              งานทั้งหมดที่ต้องไปซ่อม
            </a>
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/request")}>
              เบิกของ
            </a>
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/historyRequest")}>
              ประวัติเบิกของ
            </a>
            <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/workListEngineer")}>
              Inventory
            </a>
          </div>
        </div>
      </>
    );
  }
  
  export default NavBar;