import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentData = localStorage.getItem("student");
  const student = studentData ? JSON.parse(studentData) : null;
  const studentId = student?.id || null;

  useEffect(() => {
    const apps =JSON.parse(localStorage.getItem("applications")) || [];

    setApplications(apps);
    fetchApplications();
  }, []);
  applications.map(app => {
    app.appliedDate = new Date(app.appliedDate).toLocaleDateString();
    return app;
  });
  
  
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const studentData = localStorage.getItem("student");
      const student = studentData ? JSON.parse(studentData) : null;

      const response = await api.get(`/application?student_id=${student?.id || ""}`);
      setApplications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-semibold text-white hover:underline mb-1 inline-block"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">📄 My Applications</h1>
            <p className="text-white text-sm mt-1">
              Track and view the status of your internship applications.
            </p>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-blue-700 rounded-xl shadow-sm border p-12 text-center text-gray-500 font-medium">
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          /* EMPTY STATE (Shown when student hasn't applied to any internship) */
          <div className="bg-blue-800 rounded-xl shadow-sm border border-blue-700 p-12 text-center max-w-2xl mx-auto space-y-4 my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              📥
            </div>
            <h2 className="text-2xl font-bold text-white">No Applications Yet</h2>
            <p className="text-white text-sm max-w-md mx-auto leading-relaxed">
              You haven't submitted any internship applications yet. Browse available listings matching your skills and start applying.
            </p>
            <div className="pt-2">
              <Link
                to="/internship"
                className="inline-block bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition shadow-sm"
              >
                Explore Internships
              </Link>
            </div>
          </div>
        ) : ( 
          /* LIST STATE */
          <div className="bg-blue-700 rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-600 border-b text-xs font-bold text-white uppercase tracking-wider">
                    <th className="p-4">Role & Company</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-600 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-600 transition">
                      <td className="p-4">
                        <div className="font-bold text-white">{app.title}</div>
                        <div className="text-xs text-gray-400">{app.company}</div>
                      </td>
                      <td className="p-4 text-white">{app.appliedDate || "N/A"}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-600 border border-blue-600">
                          {app.status || "Submitted"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Applications;