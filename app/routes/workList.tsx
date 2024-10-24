import NavBar from "app/components/_navBar";

const getWorks = () => {
    const works = [
        {
            title: "Work1",
            serial: "123-456-7890",
            code: "Call",
            modelType: "2021-09-20 10:30 AM",
            conclusion: "Discussed upcoming service appointment",
        },
        {
            title: "Work2",
            serial: "123-456-7890",
            code: "Call",
            modelType: "2021-09-20 10:30 AM",
            conclusion: "Discussed upcoming service appointment",
        },
        {
            title: "Work3",
            serial: "123-456-7890",
            code: "Call",
            modelType: "2021-09-20 10:30 AM",
            conclusion: "Discussed upcoming service appointment",
        },
        {
            title: "Work4",
            serial: "123-456-7890",
            code: "Call",
            modelType: "2021-09-20 10:30 AM",
            conclusion: "Discussed upcoming service appointment",
        },
        {
            title: "Work5",
            serial: "123-456-7890",
            code: "Call",
            modelType: "2021-09-20 10:30 AM",
            conclusion: "Discussed upcoming service appointment",
        },
    ];
    return works
};

export default function WorkList() {
    const works = getWorks()
    return (
        <>
            <NavBar />
                <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <h1 className="text-3xl font-bold text-lime-600 mb-8">Work</h1>

                
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4">
                    <div className="h-96 overflow-y-auto pr-2">
                    {works.map((work, index) => (
                        <div
                        key={index}
                        className="mb-4 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">{work.title}</h2>
                            <p>Serial Number: {work.serial}</p>
                            <p>Code: {work.code}</p>
                            <p>Model/Type: {work.modelType}</p>
                            <p>Conclusion Service: {work.conclusion}</p>
                        </div>
                        <button className="bg-lime-400 text-white py-2 px-4 rounded-lg hover:bg-lime-500">
                            Edit Details
                        </button>
                        </div>
                        ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                    <button className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 mr-20">
                        ADD
                    </button>
                    <button className="bg-lime-400 text-white py-2 px-6 rounded-lg hover:bg-lime-500">
                        Next
                    </button>
                    </div>
                </div>
        </>
    );
}