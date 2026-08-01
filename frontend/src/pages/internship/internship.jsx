import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const student = JSON.parse(localStorage.getItem("student")) || {};

  const STORAGE_KEY = `applied_${student.id}`;
  const [appliedIds, setAppliedIds] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(saved);
  });
  const [savedJobs, setSavedJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("savedInternships") || "[]");
  });
  const [activeModalInternship, setActiveModalInternship] = useState(null);

  // Fetch internships from your backend database on mount
  useEffect(() => {
    const fetchDatabaseInternships = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch list from your Flask backend (which queries your DB)
        const response = await api.get("/internships");
        
        // If response.data is an array, save it; otherwise fallback to empty array
        const data = Array.isArray(response.data) ? response.data : response.data.internships || [];
        setInternships(data);
      } catch (err) {
        console.error("Failed to fetch internships from database:", err);
        setError("Unable to load internships from the database. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseInternships();
  }, []);

  // Extract unique categories dynamically from the database results
  const categories = useMemo(() => {
    const catSet = new Set(["All"]);
    internships.forEach((item) => {
      if (item.category) catSet.add(item.category);
      if (item.domain) catSet.add(item.domain);
    });
    return Array.from(catSet);
  }, [internships]);

  // Dynamic search & category filter over database records
  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const itemCategory = item.category || item.domain || "General";
      const matchesCategory =
        selectedCategory === "All" || itemCategory === selectedCategory;

      const title = item.title || "";
      const company = item.company || "";
      const skills = Array.isArray(item.skills)
        ? item.skills
        : (item.skills || "").split(",").map((s) => s.trim());

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [internships, searchTerm, selectedCategory]);

  const handleApply = async (id) => {
    try {
      // Optional: Post application event to database
      await api.post(`/applications/apply`, { internshipId: id });
    } catch (err) {
      console.warn("Backend apply endpoint not active yet, saving locally.");
    } finally {
      setAppliedIds((prev) => {
        const updated = new Set([...prev, id]);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...updated])
        );
        return updated;
      });
      setActiveModalInternship(null);
    }
  };
  const handleSave = (internship) => {
    const exists = savedJobs.some((job) => job.id === internship.id);
    if (exists) {
      alert("Already saved!");
      return;
    }

    const updated = [...savedJobs, internship];
    setSavedJobs(updated);
    localStorage.setItem(
      "savedInternships",
      JSON.stringify(updated)
    );

    alert("Internship saved successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-600">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Fetching available internships from database...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold">Explore Internships</h1>
        <p className="text-slate-300 text-sm mt-1">
          Browse verified database listings matched to your field and skill profile.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls: Search & Dynamic Category Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search database by title, company, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Internship Cards Grid */}
      {filteredInternships.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">
            No internships in the database match your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInternships.map((internship) => {
            const id = internship.id || internship._id;
            const isApplied = appliedIds.has(id);
            const skillsList = Array.isArray(internship.skills)
              ? internship.skills
              : (internship.skills || "").split(",").filter(Boolean);

            return (
              <div
                key={id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">
                        {internship.title}
                      </h2>
                      <p className="text-sm text-slate-600 font-medium">
                        {internship.company}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      {internship.category || internship.domain || "General"}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-500 my-3">
                    <span>📍 {internship.location || "Remote"}</span>
                    <span>⏳ {internship.duration || "N/A"}</span>
                    <span>💰 {internship.stipend || "Unpaid / Undisclosed"}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {internship.description || "No description provided."}
                  </p>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto">
                  <span className="text-[11px] text-slate-400">
                    {internship.postedDate ? `Posted ${internship.postedDate}` : "Active"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(internship)}
                      className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                      ❤️ Saved
                    </button>
                    <button
                      onClick={() => setActiveModalInternship(internship)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleApply(id)}
                      disabled={isApplied}
                      className={`px-3 py-1.5 text-xs font-medium text-white rounded-md ${
                        isApplied
                        ? "bg-emerald-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isApplied ? "Applied ✓" : "Apply Now"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {activeModalInternship && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalInternship(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-slate-800">
              {activeModalInternship.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              {activeModalInternship.company}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg my-4 border border-slate-100">
              <div><strong>Location:</strong> {activeModalInternship.location || "Remote"}</div>
              <div><strong>Type:</strong> {activeModalInternship.type || "Full-time"}</div>
              <div><strong>Duration:</strong> {activeModalInternship.duration || "N/A"}</div>
              <div><strong>Stipend:</strong> {activeModalInternship.stipend || "N/A"}</div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">About the Role</h3>
                <p className="leading-relaxed">{activeModalInternship.description}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveModalInternship(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(activeModalInternship.id || activeModalInternship._id)}
                disabled={appliedIds.has(activeModalInternship.id || activeModalInternship._id)}
                className={`px-4 py-2 text-xs font-medium text-white rounded-md ${
                  appliedIds.has(activeModalInternship.id || activeModalInternship._id)
                    ? "bg-emerald-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {appliedIds.has(activeModalInternship.id || activeModalInternship._id)
                  ? "Applied ✓"
                  : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}