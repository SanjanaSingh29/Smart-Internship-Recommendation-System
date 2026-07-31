import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; // Adjust path if needed
import { Save, ArrowLeft, Plus, X, Briefcase, FolderGit2 } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    degree: "",
    university: "",
    cgpa: "",
    passingYear: "",
    bio: "",
    skills: [],
    preferredRoles: [],
    github: "",
    linkedin: "",
    portfolio: "",
    resumeName: "",
    experiences: [],
    projects: []
  });

  const [newSkill, setNewSkill] = useState("");
  const [newRole, setNewRole] = useState("");

  // Experience input states
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expDesc, setExpDesc] = useState("");

  // Project input states
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projLink, setProjLink] = useState("");

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("student") || "{}");
    setFormData({
      name: existing.name || "",
      email: existing.email || "",
      phone: existing.phone || "",
      location: existing.location || "",
      degree: existing.degree || "",
      university: existing.university || "",
      cgpa: existing.cgpa || "",
      passingYear: existing.passingYear || "",
      bio: existing.bio || "",
      skills: Array.isArray(existing.skills) ? existing.skills : [],
      preferredRoles: Array.isArray(existing.preferredRoles) ? existing.preferredRoles : [],
      github: existing.github || "",
      linkedin: existing.linkedin || "",
      portfolio: existing.portfolio || "",
      resumeName: existing.resumeName || "",
      experiences: Array.isArray(existing.experiences) ? existing.experiences : [],
      projects: Array.isArray(existing.projects) ? existing.projects : []
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Roles handlers
  const handleAddRole = () => {
    if (newRole.trim() && !formData.preferredRoles.includes(newRole.trim())) {
      setFormData({ ...formData, preferredRoles: [...formData.preferredRoles, newRole.trim()] });
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    setFormData({
      ...formData,
      preferredRoles: formData.preferredRoles.filter((r) => r !== roleToRemove)
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    if (expRole.trim() && expCompany.trim()) {
      const newExp = {
        role: expRole.trim(),
        company: expCompany.trim(),
        duration: expDuration.trim() || "Present",
        description: expDesc.trim()
      };
      setFormData({ ...formData, experiences: [...formData.experiences, newExp] });
      setExpRole("");
      setExpCompany("");
      setExpDuration("");
      setExpDesc("");
    }
  };

  const handleRemoveExperience = (index) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, idx) => idx !== index)
    });
  };

  // Project handlers
  const handleAddProject = () => {
    if (projTitle.trim()) {
      const newProj = {
        title: projTitle.trim(),
        description: projDesc.trim(),
        link: projLink.trim()
      };
      setFormData({ ...formData, projects: [...formData.projects, newProj] });
      setProjTitle("");
      setProjDesc("");
      setProjLink("");
    }
  };

  const handleRemoveProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, idx) => idx !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("student", JSON.stringify(formData));
    navigate("/profile");
  };

  return (
    <div className="flex min-h-screen bg-blue-900 text-white font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-white text-xs mt-1">Update your personal details, experience, and academic profile.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white transition"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="bg-blue-800 border border-blue-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-white mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-white border border-slate-800 rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@example.com"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 234 567 890"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New Delhi, India"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="bg-blue-800 border border-blue-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-white mb-1">Degree Program / Specialization</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">University / Institute</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Cumulative CGPA</label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Graduation Year</label>
                <input
                  type="text"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                  className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div className="text-xs">
              <label className="block text-white mb-1">About Me / Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a brief professional summary..."
                className="w-full bg-white border border-white rounded-xl p-3 text-slate-800 focus:border-blue-500 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Work / Internship Experience */}
          <div className="bg-blue-800 border border-blue-800 rounded-2xl p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} className="text-white" /> Work & Internship Experience
            </h2>

            <div className="bg-blue-700 p-4 rounded-xl border border-blue-700 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Role / Title (e.g. Web Developer)"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  className="bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  className="bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. May 2024 - Aug 2024)"
                  value={expDuration}
                  onChange={(e) => setExpDuration(e.target.value)}
                  className="bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
              </div>
              <textarea
                placeholder="Brief description of duties & accomplishments"
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                rows="2"
                className="w-full bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none resize-none"
              ></textarea>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-900 text-white rounded-xl flex items-center gap-1 font-semibold"
              >
                <Plus size={14} /> Add Experience
              </button>
            </div>

            {/* Render added experiences */}
            <div className="space-y-2">
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className="flex justify-between items-start bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white">{exp.role} <span className="text-blue-400">@ {exp.company}</span></h4>
                    <p className="text-[10px] text-slate-500">{exp.duration}</p>
                    <p className="text-slate-400 text-xs mt-1">{exp.description}</p>
                  </div>
                  <button type="button" onClick={() => handleRemoveExperience(idx)} className="text-slate-500 hover:text-red-400 p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Projects */}
          <div className="bg-blue-800 border border-blue-800 rounded-2xl p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 size={16} className="text-white" /> Key Projects
            </h2>

            <div className="bg-blue-700 p-4 rounded-xl border border-blue-700 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="Project Link (Optional)"
                  value={projLink}
                  onChange={(e) => setProjLink(e.target.value)}
                  className="bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
              </div>
              <textarea
                placeholder="Project summary..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                rows="2"
                className="w-full bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none resize-none"
              ></textarea>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-900 text-white rounded-xl flex items-center gap-1 font-semibold"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="flex justify-between items-start bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white">{proj.title}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">{proj.description}</p>
                  </div>
                  <button type="button" onClick={() => handleRemoveProject(idx)} className="text-slate-500 hover:text-red-400 p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Skills & Preferred Roles */}
          <div className="bg-blue-800 border border-blue-800 rounded-2xl p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Skills & Internship Preferences</h2>
            
            {/* Skills */}
            <div>
              <label className="block text-white mb-1">Technical Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g. React, Python)"
                  className="flex-1 bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-900 text-white rounded-xl flex items-center gap-1 font-semibold"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div className="pt-2">
              <label className="block text-white mb-1">Preferred Roles</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Add role preference (e.g. Full Stack Intern)"
                  className="flex-1 bg-white border border-white p-2.5 rounded-xl text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-900 text-white rounded-xl flex items-center gap-1 font-semibold"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredRoles.map((role, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 rounded-lg">
                    {role}
                    <button type="button" onClick={() => handleRemoveRole(role)} className="hover:text-red-400">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Online Profile Links */}
          <div className="bg-blue-800 border border-blue-800 rounded-2xl p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Online Profile Links & Resume</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white mb-1">GitHub Profile URL</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourhandle"
                  className="w-full bg-white border border-white p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourhandle"
                  className="w-full bg-white border border-white p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Portfolio Link</label>
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full bg-white border border-white p-3 text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-1">Resume File Name / Identifier Link</label>
              <input
                type="text"
                name="resumeName"
                value={formData.resumeName}
                onChange={handleChange}
                placeholder="https://yourportfolio.com/resume.pdf"
                className="w-full bg-white border border-white p-3 text-slate-800 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}