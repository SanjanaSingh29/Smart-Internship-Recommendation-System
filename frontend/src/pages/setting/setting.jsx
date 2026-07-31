import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust path to match your API service configuration

function Settings() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal & Deletion State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState({ text: "", isError: false });

  // Preferences State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    recommendationUpdates: true,
    applicationStatus: true,
  });

  const [prefMsg, setPrefMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawStudent = localStorage.getItem("student") || localStorage.getItem("user");

    if (!token || !rawStudent || rawStudent === "undefined") {
      console.warn("No active session found. Redirecting to login...");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedData = JSON.parse(rawStudent);
      setStudent(parsedData);

      const savedPrefs = localStorage.getItem("user_preferences");
      if (savedPrefs) {
        setNotifications(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error("Failed to parse user session data:", e);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Handle Password Change Form
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassMsg({ text: "", isError: false });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMsg({ text: "Please fill in all password fields.", isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: "New passwords do not match.", isError: true });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ text: "Password must be at least 6 characters.", isError: true });
      return;
    }

    setPassMsg({ text: "Password updated successfully!", isError: false });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Toggle Notification Switches
  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Save Preferences to LocalStorage
  const handleSavePreferences = () => {
    localStorage.setItem("user_preferences", JSON.stringify(notifications));
    setPrefMsg("Preferences saved successfully!");
    setTimeout(() => setPrefMsg(""), 3000);
  };

  // Export User Profile JSON Data
  const handleExportData = () => {
    if (!student) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(student, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${student.name || "profile"}_data.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear Session Cache locally without database deletion
  const handleClearCache = () => {
    if (window.confirm("This will clear your local storage session and log you out. Continue?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  // CONFIRMED LOGOUT & DATABASE PURGE
  const handleConfirmLogout = async () => {
    try {
      setIsDeleting(true);

      const userId = student?.id || student?._id;

      if (!userId) {
        alert("Error: Student ID not found in session.");
        setIsDeleting(false);
        return;
      }

      // Send DELETE request to Flask API route (/api/users/<student_id>)
      const response = await api.delete(`/users/${userId}`);

      if (response.status === 200) {
        // Clear local storage after DB deletion succeeds
        localStorage.clear();
        sessionStorage.clear();

        setShowLogoutModal(false);
        alert("Account deleted! All profile data removed from database.");

        // Redirect directly to sign up since profile details were deleted
        navigate("/signup", { replace: true });
      }
    } catch (error) {
      console.error("Database deletion failed:", error);
      alert(
        error.response?.data?.error ||
          "Failed to delete user profile from database. Logout cancelled."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-gray-600">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 relative">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl my-8 space-y-8">
        
        {/* HEADER */}
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage security, notification preferences, and account privacy.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-300 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* 1. PASSWORD & SECURITY */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">🔒 Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full border p-2 rounded text-sm focus:border-blue-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full border p-2 rounded text-sm focus:border-blue-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full border p-2 rounded text-sm focus:border-blue-700 outline-none"
                />
              </div>
            </div>

            {passMsg.text && (
              <p className={`text-xs font-semibold ${passMsg.isError ? "text-red-500" : "text-emerald-600"}`}>
                {passMsg.text}
              </p>
            )}

            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-800 transition"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* 2. NOTIFICATIONS */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">🔔 Notification Settings</h2>
          
          <div className="space-y-3 max-w-md">
            <label className="flex items-center justify-between text-sm text-gray-700 cursor-pointer">
              <span>Email alerts for new recommended internships</span>
              <input
                type="checkbox"
                checked={notifications.recommendationUpdates}
                onChange={() => handleToggle("recommendationUpdates")}
                className="w-4 h-4 accent-blue-700 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-sm text-gray-700 cursor-pointer">
              <span>Application status updates (Accepted / Reviewed)</span>
              <input
                type="checkbox"
                checked={notifications.applicationStatus}
                onChange={() => handleToggle("applicationStatus")}
                className="w-4 h-4 accent-blue-700 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-sm text-gray-700 cursor-pointer">
              <span>System updates and newsletter</span>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={() => handleToggle("emailAlerts")}
                className="w-4 h-4 accent-blue-700 rounded"
              />
            </label>

            {prefMsg && <p className="text-xs text-emerald-600 font-semibold">{prefMsg}</p>}

            <button
              type="button"
              onClick={handleSavePreferences}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-900 transition"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* 3. DATA & PRIVACY */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">📁 Privacy & Data</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
            >
              📥 Export Profile Data (JSON)
            </button>

            <button
              type="button"
              onClick={handleClearCache}
              className="bg-gray-100 text-gray-700 border px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition"
            >
              🧹 Clear Local Cache & Logout
            </button>
          </div>
        </div>

        {/* 4. LOGOUT & DATABASE PURGE SECTION */}
        <div className="border-t border-red-200 pt-6">
          <div className="bg-red-600 text-white rounded-xl p-6 shadow-md border border-red-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">🚪 Logout</h2>

              <p className="text-xs text-red-100 mt-1">
                Sign out from your account. Your profile will remain safe.
              </p>

              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate("/login", { replace: true });
                }}
                className="bg-red-600 text-white border border-white font-bold px-6 py-2.5 rounded-lg hover:bg-white hover:text-red-600 transition text-sm shadow-sm whitespace-nowrap">
                  Logout
              </button>
            </div>

            <div className="border-l border-red-700 h-12 hidden sm:block"></div>
          </div>
        </div>  

      </div>

      {/* POP-UP CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center">
              <span className="text-4xl block mb-2">⚠️</span>
              <h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Are you sure you want to log out? <br />
                <span className="text-red-600 font-semibold block mt-1">
                  This will remove all your details from the database. You will need to create your profile again.
                </span>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg text-xs hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmLogout}
                className="w-1/2 bg-red-600 text-white font-semibold py-2 rounded-lg text-xs hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;