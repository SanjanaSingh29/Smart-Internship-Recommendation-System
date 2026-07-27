import { useState } from "react";
import Input from "../../components/ui/Input";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        if (!email || !password) {
            setError("Please fill all fields.");
            return;
        }
        setError("");

        console.log("Email:", email);
        console.log("Password:", password);
    }
    return(
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="bg-blue-800 rounded-2xl p-8 shadow-lg text-center text-white w-full max-w-md">
            <h1>Smart Internship Recommendation System</h1>
            <p className="mt-3">
          Find internships based on your skills and interests.
            </p>

            <p className="mt-2">
          Login to continue
            </p>
            <form className="mt-8" onSubmit={handleSubmit}>
                <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black"
          />
                <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black"
          />
                <div className="mt-2 flex justify-end">
                    <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}className="text-sm text-white hover:underline"
                    >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>


                {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
)}
                <div className="mt-4 flex justify-end">
                    <a href="#">Forgot Password?</a>
                </div>

                <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-white py-3 text-blue-600">Login
                </button>
                <p className="mt-6 text-center">
                    Don't have an account?
                    <Link 
                    to="/register"
                    className="ml-1 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

            </form>

      </div>
    </div>
  );
}

export default Login;