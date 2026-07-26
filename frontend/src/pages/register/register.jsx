import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");


    function handleRegister(event) {
  event.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    setError("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setError("");

  console.log({
    name,
    email,
    password,
    confirmPassword,
  });


  console.log("Registration Successful!");
}
    return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-blue-800 rounded-2xl p-8 shadow-lg text-white w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="mt-3 text-center">
          Register to get internship recommendations.
        </p>

        <form className="mt-8" onSubmit={handleRegister}>

          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>)}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-white py-3 text-blue-600 font-semibold hover:bg-gray-200 transition"
          >
            Register
          </button>

          <p className="mt-6 text-center">
            Already have an account?

            <Link
              to="/login"
              className="ml-1 font-medium hover:underline"
            >
              Login
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;