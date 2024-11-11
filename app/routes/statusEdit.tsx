import NavBar from "app/components/_navBar";
import { useLocation, useNavigate } from "react-router-dom";


export default function statusEdit(){
    const location = useLocation();
    const {id, workId, status} = location.state;
    const navigate = useNavigate();

    console.log(workId)
    console.log(status)
    const onClickBack = () => {
      navigate("/workListEngineer", { state:id });
    };
    const updateStatus = async () => {
      const url = 'https://easy-service.prakasitj.com/works/setWorkStatus';
      const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              id: workId,
              status: status+1,
          }),
      };
      const response = await fetch(url, options);
      const data = await response.text();
      console.log(data);
      if (response.ok) {
          alert("Expense added successfully!");
          navigate("/workListEngineer", { state:id });
        } else {
          alert("Failed to add expense. Please try again.");
      }
    };
    return (
        <>
          <NavBar />
          <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <h2 className="text-center text-2xl font-semibold text-lime-600 mt-8 mb-6">
              แก้ไขสถานะการทำงาน
            </h2>
            <div className="w-full max-w-4xl h-[500px] overflow-y-auto space-y-6">
              <div className="mb-4">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={workId}
                  value={workId}
                  className="border rounded w-full py-2 px-3"
                  placeholder="Enter username"
                  readOnly
                />
              </div>
              <div className="flex flex-col items-center">

                <button
                  className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600"
                  onClick={updateStatus}
                >
                  Edit Status
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2"
                  onClick={onClickBack}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </>
      );
    
}