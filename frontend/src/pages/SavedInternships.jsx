import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Heart, Trash2, ExternalLink, Building, MapPin } from "lucide-react";

export default function SavedInternships() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);

  useEffect(() => {
    const saved =JSON.parse(localStorage.getItem("savedInternships")) || [];
    setSavedInternships(saved);
  }, []);
  savedInternships.map(job => {
    job.postedDate = new Date(job.postedDate).toLocaleDateString();
    return job;
  });

  const removeJob = (id) => {
    const updated = savedJobs.filter((job) => job.id !== id);
    setSavedJobs(updated);
    localStorage.setItem("savedInternships", JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={24} /> 
              Saved Internships
            </h1>
            <p className="text-white text-sm mt-1">
              Manage and track the internships you’ve bookmarked for later.
            </p>
          </header>

          {savedJobs.length === 0 ? (
            <div className="bg-blue-800 border border-blue-700 rounded-2xl p-12 text-center">
              <p className="text-white text-sm">You haven't saved any internships yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-blue-800 border border-blue-700 rounded-xl p-5 flex items-center justify-between hover:border-blue-600 transition"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base text-white">{job.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-blue-400">
                      <span className="flex items-center gap-1">
                        <Building size={14} /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => removeJob(job.id)}
                      className="p-2 text-white hover:text-red-400 hover:bg-blue-600 rounded-lg transition"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                    <a
                      href={job.link || "#"}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition"
                    >
                      Apply Now <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

