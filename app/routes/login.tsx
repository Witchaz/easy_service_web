import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const login = async (username: string, password: string): Promise<void> => {
    if (!username || !password) {
      setError("Some fields are required");
      return;
    }

    const url = 'https://easy-service.prakasitj.com/user/login/';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    };

    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        const data = await response.json();
        console.log(data.error);
        if (!data.error) {
          setError(""); 
          alert("Login successful!");
          navigate("/customerList");
        } else {
          setError("Invalid username or password");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 p-5 justify-center align-middle min-h-screen">
        <h1 className="text-center font-bold text-3xl">Easy service</h1>
        <h2 className="text-center text-xl">Login Page</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="grid grid-cols-[120px_auto] justify-center gap-2">
          <h3>Username :</h3>
          <input
            value={username}
            name="username"
            className="bg-slate-500 shrink border-white border-2 max-w-96"
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
        </div>
        <div className="flex justify-center">
          <button
            className="shrink border-white border-2 hover:bg-slate-800 p-2 rounded-lg"
            onClick={() => login(username, password)}
          >
            Login
          </button>
        </div>
        <div className="flex justify-center">
          Don't have an account? 
          <a href="/create_id">
            <div style={{ color: 'red', marginLeft: '4px' }}>create account</div>
          </a>
        </div>
      </div>
    </>
  );
}
