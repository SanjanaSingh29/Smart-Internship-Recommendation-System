import { useState } from "react";
import Input from "../../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      console.log("Backend Response:", response);
      console.log("Student Object:", response.student);

      // Save Auth Token if provided
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Safe extraction of student object and ID fallback
      const studentObj = response.student || response.user || response;
      const extractedId =
        studentObj?.id ||
        studentObj?._id ||
        studentObj?.student_id ||
        response?.id;

      if (!extractedId) {
        throw new Error("Invalid session response: Missing Student ID.");
      }

      // Read existing stored state to prevent wiping data on login
      const existingData = JSON.parse(localStorage.getItem("student") || "{}");

      const updatedStudentData = {
        ...existingData,
        ...studentObj,
        id: extractedId,
        email: studentObj?.email || email,
        name: studentObj?.name || existingData?.name || "",
      };

      localStorage.setItem("student", JSON.stringify(updatedStudentData));
      console.log("Saved in localStorage:", updatedStudentData);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-blue-800 rounded-2xl p-8 shadow-lg text-center text-white w-full max-w-md">
        <h1 className="text-2xl font-bold">
          Smart Internship Recommendation System
        </h1>
        <p className="mt-3 text-sm text-blue-100">
          Find internships based on your skills and interests.
        </p>

        <p className="mt-2 text-sm text-blue-200">Login to continue</p>

        <form className="mt-8 text-left space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

          <div className="flex justify-end text-sm">
            <a href="#" className="text-blue-200 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-3 font-semibold text-blue-900 hover:bg-blue-50 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-blue-100">
            Don't have an account?
            <Link
              to="/register"
              className="ml-1 font-semibold text-white hover:underline"
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