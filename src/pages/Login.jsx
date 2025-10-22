import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cfs-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock login validation
    if (email === "demo@cfsbrands.com" && password === "password123") {
      navigate("/dashboard"); // redirect to dashboard
    } else {
      setError("Invalid credentials. Try demo@cfsbrands.com / password123");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-cfs-navy">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[90%] max-w-md text-center">
        <img src={logo} alt="CFS Brands Logo" className="h-20 mx-auto mb-8" />
        <h1 className="text-3xl font-bold text-[#0057B8] mb-8 leading-tight tracking-tight">
          CFS Facilities Tool
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EC1E4] leading-normal"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EC1E4] leading-normal"
          />

          {error && <p className="text-red-600 text-sm leading-normal">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#0057B8] text-white py-2 rounded-lg font-semibold shadow hover:bg-[#0A2540] transition leading-normal"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 leading-normal">
          Use demo@cfsbrands.com / password123
        </p>
      </div>
    </div>
  );
}