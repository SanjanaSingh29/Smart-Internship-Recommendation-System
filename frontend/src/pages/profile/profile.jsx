import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Globe, 
  Edit3, 
  MapPin,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  FolderGit2,
  Calendar
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Read logged-in user profile from localStorage dynamically
    const data = JSON.parse(localStorage.getItem("student") || "{}");
    setStudent(data);
  }, []);

  if (!student) {
    return (
      <div className="flex min-h-screen bg-blue-900 text-white items-center justify-center">
        <p className="text-white text-sm">Loading profile data...</p>
      </div>
    );
  }

  // Safely extract arrays/objects to prevent parsing errors
  const skills = Array.isArray(student.skills)
  ? student.skills
  : typeof student.skills === "string"
      ? student.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const preferredRoles = Array.isArray(student.preferredRoles) ? student.preferredRoles : [];
  const experiences = Array.isArray(student.experiences) ? student.experiences : [];
  const projects = Array.isArray(student.projects) ? student.projects : [];
  const certifications = Array.isArray(student.certifications) ? student.certifications : [];

  return (
    <div className="flex min-h-screen bg-blue-900 text-white font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header Banner */}
          <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-600/20">
                  {student.name ? student.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{student.name || "User Profile"}</h1>
                  <p className="text-white text-sm flex items-center gap-2 mt-1">
                    <GraduationCap size={16} className="text-white" />
                    {student.degree || "Degree Not Specified"}
                  </p>
                  <p className="text-white text-xs flex items-center gap-2 mt-1">
                    <MapPin size={14} /> {student.location || "Location Not Provided"}
                  </p>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-blue-600 transition"
                >
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </button>
                <Link
                  to="/edit_profile"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Personal, Contact & Social Links */}
            <div className="space-y-6">
              
              {/* Personal Info */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-white" /> Personal Info
                </h2>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-white">Email Address</p>
                    <p className="text-white font-medium flex items-center gap-2 mt-0.5">
                      <Mail size={14} className="text-white" /> {student.email || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white">Phone Number</p>
                    <p className="text-white font-medium flex items-center gap-2 mt-0.5">
                      <Phone size={14} className="text-white" /> {student.phone || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white">Location</p>
                    <p className="text-white font-medium flex items-center gap-2 mt-0.5">
                      <MapPin size={14} className="text-white" /> {student.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Links (GitHub, LinkedIn, Portfolio) */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe size={16} className="text-white" /> Online Links
                </h2>
                
                <div className="space-y-2 text-xs">
                  {student.github ? (
                    <a href={student.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 bg-slate-800/50 hover:bg-blue-700 rounded-xl text-white transition">
                      <Globe size={16} className="text-white" />
                      <span className="truncate">GitHub Profile Link</span>
                    </a>
                  ) : (
                    <p className="text-white text-xs italic">No GitHub link provided</p>
                  )}

                  {student.linkedin ? (
                    <a href={student.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 bg-blue-700 hover:bg-blue-700 rounded-xl text-white transition">
                      <Globe size={16} className="text-white" />
                      <span className="truncate">LinkedIn Profile Link</span>
                    </a>
                  ) : (
                    <p className="text-white text-xs italic">No LinkedIn link provided</p>
                  )}

                  {student.portfolio && (
                    <a href={student.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 bg-blue-700 hover:bg-blue-700 rounded-xl text-white transition">
                      <Globe size={16} className="text-emerald-400" />
                      <span className="truncate">Personal Portfolio</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Bio, Academics, Experience, Projects & Skills */}
            <div className="md:col-span-2 space-y-6">
              
              {/* About Bio */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">About Me</h2>
                <p className="text-white text-xs leading-relaxed">
                  {student.bio || "No summary bio added yet. Click 'Edit Profile' to update your overview."}
                </p>
              </div>

              {/* Academic Information */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={16} className="text-white" /> Academic Information
                </h2>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-white">
                    <p className="text-black">University / College</p>
                    <p className="text-black font-bold mt-1 text-sm">{student.university || "Not provided"}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-white">
                    <p className="text-black">Cumulative CGPA</p>
                    <p className="text-black font-bold mt-1 text-sm">{student.cgpa ? `${student.cgpa} / 10.0` : "N/A"}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-white">
                    <p className="text-black">Degree & Branch</p>
                    <p className="text-black font-semibold mt-1">{student.degree || "Not provided"}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-white">
                    <p className="text-black">Graduation Year</p>
                    <p className="text-black font-semibold mt-1">{student.passingYear || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Work / Internship Experience */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-white" /> Experience
                </h2>

                {experiences.length > 0 ? (
                  <div className="space-y-3">
                    {experiences.map((exp, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-white space-y-1">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold text-black">{exp.role}</h3>
                          <span className="text-[10px] text-white flex items-center gap-1">
                            <Calendar size={12} /> {exp.duration}
                          </span>
                        </div>
                        <p className="text-xs text-black font-medium">{exp.company}</p>
                        <p className="text-xs text-black mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white italic">No experience added yet.</p>
                )}
              </div>

              {/* Projects Section */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 size={16} className="text-white" /> Key Projects
                </h2>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="bg-blue-700 p-4 rounded-xl border border-blue-700 space-y-2">
                        <h3 className="text-xs font-bold text-white">{proj.title}</h3>
                        <p className="text-xs text-white">{proj.description}</p>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="inline-block text-[10px] text-white hover:underline">
                            View Project Link →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white italic">No projects listed yet.</p>
                )}
              </div>

              {/* Skills & Certifications */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-white" /> Skills & Expertise
                </h2>

                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-700 border border-blue-700 text-white text-xs rounded-xl font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-white italic">No skills added yet.</p>
                  )}
                </div>

                {preferredRoles.length > 0 && (
                  <div className="pt-4 border-t border-blue-700">
                    <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                      <Briefcase size={14} /> Preferred Internship Roles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {preferredRoles.map((role, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-700 text-white text-xs rounded-lg">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Attached Resume */}
              <div className="bg-blue-700 border border-blue-700 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 text-white rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">{student.resumeName || "No Resume Uploaded"}</h3>
                    <p className="text-[10px] text-white mt-0.5">Attached Resume • PDF Document</p>
                  </div>
                </div>
                {student.resumeName && (
                  <span className="flex items-center gap-1 text-xs text-white font-medium">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}