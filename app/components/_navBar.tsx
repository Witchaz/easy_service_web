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
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/customerList")}>
            รายชื่อลูกค้า
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/workList")}>
            งานที่รอเลือกช่าง
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/adWorkList")}>
            งานที่รอช่างเข้าไปตรวจสอบ
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/workWaitList")}>
            งานที่ช่างกำลังทำ
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/allWorkEnd")}>
            งานที่จบแล้ว
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/engineerList")}>
            รายชื่อช่าง
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/sparePartsList")}>
            คลังอะไหล่
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/historyRequestAdmin")}>
            เบิกของ
          </a>
        </div>
      </div>
    </>
  );
}

export default NavBar;
