import NavBar from "~/components/_navBar";

export default function Documents() {
  return (
    <>
      <NavBar />
      <div className="p-10 bg-dark_secondary m-5 rounded-3xl">
        <div className="flex flex-row items-center">
          <h1 className="font-bold text-2xl grow">Documents</h1>
          <div className="space-x-8 flex row">
            <h1 className="font-bold rounded-xl border-4 border-secondary p-3 hover:bg-secondary hover:scale-125">
              Purchas order
            </h1>
            <h1 className="font-bold rounded-xl border-4 border-secondary p-3 hover:bg-secondary hover:scale-125">
              Invoices
            </h1>
            <h1 className="font-bold rounded-xl border-4 border-secondary p-3 hover:bg-secondary hover:scale-125">
              Quotation
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
