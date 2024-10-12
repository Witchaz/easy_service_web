import { useState } from "react";
import { json } from "@remix-run/node";


export default function CreateID() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");
  const [error, setError] = useState(""); 
  const [fieldError, setFieldError] = useState("");
    

  let signIn = (username: string, password: string,comfirmPassword:string): boolean => {
    if ((!username || !password || !comfirmPassword) && (password !== comfirmPassword)) {
        setError("Some fields are required"); 
        setFieldError("Passwords do not match"); 
        return false;
    }
    else if (!username || !password || !comfirmPassword) {
        setError("Some fields are required"); 
        setFieldError(""); 
        return false;
    }
    else if (password !== comfirmPassword) {
      setError(""); 
      setFieldError("Passwords do not match"); 
      return false;
      }
    
    
    setError("");
    setFieldError("");
    return true; 
  };

  return (
    <>
      <div className="flex flex-col space-y-4 p-5 justify-center align-middle min-h-screen">
        <h1 className="text-center font-bold text-3xl">Easy service</h1>
        <h2 className="text-center text-xl">Create ID</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {fieldError && <p className="text-red-500 text-center">{fieldError}</p>}       

        <div className="grid grid-cols-[120px_auto] justify-center gap-2">
          <h3>Username :</h3>
          <input
            value={username}
            name="username"
            className="bg-slate-500 shrink border-white border-2 max-w-96 "
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <h3>Password :</h3>
          <input
            value={password}
            name="password"
            className="bg-slate-500 shrink border-white border-2 max-w-96"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
           />
          <h3>Confirm Password :</h3>
          <input
            value={comfirmPassword}
            name="comfirm_password"
            className="bg-slate-500 shrink border-white border-2 max-w-96"
            type="password"
            onChange={(e) => setComfirmPassword(e.target.value)}
            required
          /> 
        </div>
        <div className="flex justify-center">
          <button
            className="shrink border-white border-2 hover:bg-slate-800 p-2 rounded-lg"
            onClick={() => signIn(username, password,comfirmPassword)}
          >
            Sign in
          </button>
        </div>
        <div className="flex justify-center">
          Already have an account? <a href="/login">
            <div style={{ color: 'red' }}>Log in Now</div></a>
        </div>
      </div>
    </>
  );
}
