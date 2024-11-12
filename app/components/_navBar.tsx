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
          <a
            className="font-bold hover:text-primary"
            href="https://www.google.com"
          >
            Inventory
          </a>
          <a className="font-bold hover:text-primary" href="">
            Work order
          </a>
          <a className="font-bold hover:text-primary" href="">
            Dcoument
          </a>
          <a className="font-bold hover:text-primary" onClick={() => handleNavigate("/historyRequestAdmin")}>
            Request
          </a>
        </div>
      </div>
    </>
  );
}

export default NavBar;
