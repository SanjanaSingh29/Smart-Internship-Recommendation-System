import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/input";
import { registerUser } from "../../services/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle states for eye icons
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");

      const response = await registerUser({
        name,
        email,
        password,
      });

      alert("Registration Successful! Please complete your profile.");

      if (response?.student || response?.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem(
          "student",
          JSON.stringify(response.student || response.user)
        );
        navigate("/profile/edit", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.error || "Registration failed. Try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-blue-800 rounded-2xl p-8 shadow-lg text-white w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">
          Welcome Back! to Intern AI
        </h1>
        <h2 className="text-lg font-semibold mt-2 flex items-center justify-center gap-2">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-blue-100">
          Get personalized internship recommendations in 2 minutes.
        </p>

        <form className="mt-6 space-y-4 text-left" onSubmit={handleRegister}>
          <Input
            label="Full Name *"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email *"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password *"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />

          <Input
            label="Confirm Password *"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            togglePassword={() => setShowConfirmPassword((prev) => !prev)}
          />

          {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-white py-3 text-blue-900 font-semibold hover:bg-gray-100 transition mt-4"
          >
            Create Account & Continue
          </button>

          <p className="text-center text-sm text-blue-100 mt-4">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-semibold text-white hover:underline"
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