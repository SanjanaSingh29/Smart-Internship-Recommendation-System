import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  Bell, Search, MapPin, DollarSign, CheckCircle, XCircle, 
  Heart, Clock, TrendingUp, BookOpen, FileCheck, User, LogOut, Check, Upload
} from "lucide-react";




export default function Dashboard() {

  console.log("THIS IS THE DASHBOARD FILE I AM EDITING");

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(5);
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [applications, setApplications] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    const localStudent = JSON.parse(localStorage.getItem("student") || "{}");
    setStudent(localStudent);

    console.log("Student:", localStudent);
    console.log("Projects:", localStudent.projects);

  // Load actual user applications from localStorage
    const savedApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );
    setApplications(savedApplications);
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  const handleSaveInternship = (internship) => {
    const saved =JSON.parse(localStorage.getItem("savedInternships")) || [];
    const alreadySaved = saved.some((item) => item.id === internship.id);
    if (alreadySaved) return;
    const updated = [...saved, internship];
    localStorage.setItem(
      "savedInternships",
      JSON.stringify(updated)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    navigate("/");
  };

  // Safe user skills parser — returns empty array if user has added 0 skills
  const userSkills = Array.isArray(student.skills)
    ? student.skills
    : typeof student.skills === "string" && student.skills.trim() !== ""
      ? student.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  console.log("Student:", student);
  console.log("Student skills:", student.skills);
  console.log("Parsed userSkills:", userSkills);
  console.log("Dashboard student:", student);
  console.log("Dashboard projects:", student.projects);

  // Check if resume is present in student state
  const hasResume = Boolean(student.resume || student.resumeUploaded || student.resumeUrl);

  

  // Base list of internships
  const allInternships = [
    {
      id: "1",
      company: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      role: "Software Engineer Intern",
      location: "Bangalore",
      workMode: "On-site",
      stipend: "₹50,000/month",
      requiredSkills: ["React", "JavaScript", "Python"],
      saveButton: (
        <button
          onClick={() => handleSaveInternship(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
        >
          ❤️ Save
        </button>
      ),
    },
    {
      id: "2",
      company: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      role: "Frontend Developer Intern",
      location: "Hyderabad",
      workMode: "Hybrid",
      stipend: "₹45,000/month",
      requiredSkills: ["React", "HTML", "CSS"],
      saveButton: (
        <button
          onClick={() => handleSaveInternship(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
        >
          ❤️ Save
        </button>
      ),
    },
    {
      id: "3",
      company: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      role: "SDE Intern",
      location: "Gurgaon",
      workMode: "On-site",
      stipend: "₹60,000/month",
      requiredSkills: ["Python", "SQL", "DSA"],
      saveButton: (
        <button
          onClick={() => handleSaveInternship(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
        >
          ❤️ Save
        </button>
      ),
    },
    {
      id: "4",
      company: "Adobe",
      logo: "https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg",
      role: "Data Analyst Intern",
      location: "Noida",
      workMode: "Hybrid",
      stipend: "₹40,000/month",
      requiredSkills: ["Python", "SQL"],
      saveButton: (
        <button
          onClick={() => handleSaveInternship(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
        >
          ❤️ Save
        </button>
      ),
    },
    {
      id: "5",
      company: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg",
      role: "Full Stack Intern",
      location: "Remote",
      workMode: "Remote",
      stipend: "₹55,000/month",
      requiredSkills: ["React", "JavaScript"],
      saveButton: (
        <button
          onClick={() => handleSaveInternship(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
        >
          ❤️ Save
        </button>
      ),
    },
    {
      id: "6",
      company: "Flipkart",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png",
      role: "Backend Intern",
      location: "Bangalore",
      workMode: "On-site",
      stipend: "₹35,000/month",
      requiredSkills: ["Python", "SQL", "MongoDB"],
      saveButton: (
        <button
          onClick={() => handleSaveInternship(item)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg"
        >
          ❤️ Save
        </button>
      ),
    },
  ];

  // Apply to internship handler
  const handleApply = (internship) => {
    const isAlreadyApplied = applications.some((app) => app.id === internship.id);
    if (isAlreadyApplied) return;

    const newApplication = {
      id: internship.id,
      company: internship.company,
      role: internship.role,
      status: "Applied",
      date: new Date().toLocaleDateString(),
    };

    const updatedApps = [...applications, newApplication];
    setApplications(updatedApps);
    localStorage.setItem("applications", JSON.stringify(updatedApps));
  };
  const hasSkill = (skillList, targetSkill) => {
    return skillList.some(
      (s) => s.trim().toLowerCase() === targetSkill.trim().toLowerCase()
    );
  };

  // Dynamic calculations for match percentage
  const processedInternships = allInternships.map((job) => {
  const matched = job.requiredSkills.filter((s) => hasSkill(userSkills, s));
  const missing = job.requiredSkills.filter((s) => !hasSkill(userSkills, s));

  const matchPercentage =
    userSkills.length > 0
      ? Math.round((matched.length / job.requiredSkills.length) * 100)
      : 0;
      return {
        ...job,
        match: matchPercentage,
        missingSkills: missing,
      };
    });
  const notifications = [];
  if (!hasResume) {
    notifications.push({
      type: "warning",
      message: "Upload your resume to improve your profile score."
    });
  }

  if (student.projects?.length === 0) {
    notifications.push({
      type: "info",
      message: "Add your projects to attract recruiters."
    });
  }

  if (userSkills.length < 5) {
    notifications.push({
      type: "info",
      message: "Add more skills to improve internship recommendations."
    });
  }

  notifications.push({
    type: "deadline",
    message: "Google Internship deadline: 2 Aug 2026"
  });

  notifications.push({
    type: "deadline",
    message: "Microsoft Internship deadline: 5 Aug 2026"
  });

  const matchedInternships = processedInternships.filter(
    job => job.match >= 80
  );

  if (matchedInternships.length > 0) {
    notifications.push({
      type: "success",
      message: `${matchedInternships.length} internships match your profile.`
    });
  } else {
    notifications.push({
      type: "info",
      message: "No internships match your profile yet. Keep adding skills!"
    });
  }

  // Filter based on search query, location, and work mode
  const filteredInternships = processedInternships.filter((job) => {
    const matchesSearch =
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "All" || job.location === locationFilter;
    const matchesWorkMode = workModeFilter === "All" || job.workMode === workModeFilter;

    return matchesSearch && matchesLocation && matchesWorkMode;
  });

  return (
    <div className="flex bg-blue-900 min-h-screen text-white">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar student={student} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 max-w-7xl mx-auto space-y-8">

        {/* 1. HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-blue-800 p-6 rounded-2xl border border-blue-800 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {student.name || "User"} 👋
            </h1>
            <p className="text-sm text-white mt-0.5">
              Find the best internships based on your skills.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 border border-blue-700 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold text-white transition"
            >
              <User size={16} /> Profile
            </Link>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  setUnreadCount(0);
                }
              }}
              className="p-2 bg-blue-700 hover:bg-slate-700 rounded-lg relative transition"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div 
                ref={notificationRef} 
                className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-bold text-slate-800 text-lg">
                    🔔 Notifications
                  </h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-5 text-center text-slate-500">
                      No new notifications.
                    </p>
                  ) : (
                    notifications.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border-b hover:bg-slate-50 cursor-pointer transition"
                      >
                        <p className="text-sm text-slate-700">
                          {item.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-red-600/20 text-white rounded-lg text-sm font-semibold transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* 2. QUICK STATISTICS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-800 p-5 rounded-xl border border-blue-800 shadow-sm">
            <p className="text-xs text-white font-bold uppercase tracking-wider">Recommended</p>
            <p className="text-2xl font-black text-white mt-1">{filteredInternships.length}</p>
          </div>
          <div className="bg-blue-800 p-5 rounded-xl border border-blue-800 shadow-sm">
            <p className="text-xs text-white font-bold uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-black text-white mt-1">{applications.length}</p>
          </div>
          <div className="bg-blue-800 p-5 rounded-xl border border-blue-800 shadow-sm">
            <p className="text-xs text-white font-bold uppercase tracking-wider">Profile Score</p>
            <p className="text-2xl font-black text-white mt-1">
              {hasResume ? "80%" : "30%"}
            </p>
          </div>
          <div className="bg-blue-800 p-5 rounded-xl border border-blue-800 shadow-sm">
            <p className="text-xs text-white font-bold uppercase tracking-wider">Skills Added</p>
            <p className="text-2xl font-black text-white mt-1">{userSkills.length}</p>
          </div>
        </section>

        {/* 3. SEARCH & FILTER SECTION */}
        <section className="bg-blue-800 p-5 rounded-2xl border border-blue-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-black" size={18} />
            <input
              type="text"
              placeholder="Search by Internship Role or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="All" text="All Locations">All Locations</option>
              <option value="Bangalore" text="Bangalore">Bangalore</option>
              <option value="Hyderabad" text="Hyderabad">Hyderabad</option>
              <option value="Gurgaon" text="Gurgaon">Gurgaon</option>
              <option value="Noida" text="Noida">Noida</option>
              <option value="Remote" text="Remote">Remote</option>
            </select>

            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="p-2.5 bg-white border border-white rounded-lg text-slate-700 font-medium text-slate placeholder:text-slate-500"
            >
              <option value="All">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </section>

        {/* 4. RECOMMENDED INTERNSHIPS ⭐ */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-200 pb-1 border-dashed">
              ⭐ Recommended Internships
            </h2>
            <span className="text-xs text-slate-500">Showing top matches</span>
          </div>
          {selectedInternship && (
            <div className="bg-blue-700 rounded-2xl p-6 border border-blue-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedInternship.company}
                </h2>

                <button
                  onClick={() => setSelectedInternship(null)}
                  className="text-white hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-white">
                <p>
                  <strong>Role:</strong> {selectedInternship.role}
                </p>
                <p>
                  <strong>Location:</strong> {selectedInternship.location}
                </p>
                <p>
                  <strong>Work Mode:</strong> {selectedInternship.workMode}
                </p>
                <p>
                  <strong>Stipend:</strong> {selectedInternship.stipend}
                </p>
                <p>
                  <strong>Required Skills:</strong>
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedInternship.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-lg ${
                      hasSkill(userSkills, skill)
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="mt-4">
                  <strong>Match Percentage:</strong>{" "}
                  {selectedInternship.match}%
                </p>
                <p>
                  <strong>Missing Skills:</strong>{" "}
                  {selectedInternship.missingSkills.length
                    ? selectedInternship.missingSkills.join(", ")
                    : "None 🎉"}
                </p>

              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((item) => {
              const hasApplied = applications.some((app) => app.id === item.id);

              return (
                <div key={item.id} className="bg-blue-700 p-5 rounded-2xl border border-blue-700 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="w-10 h-10 rounded-full bg-white p-1"
                        />

                        <span className="font-bold text-white text-base">
                          {item.company}
                        </span>
                      </div>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.match >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Match: {item.match}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-3">{item.role}</h3>

                    <div className="space-y-1 text-xs text-white mb-4">
                      <p className="flex items-center gap-1.5"><MapPin size={14} /> {item.location} ({item.workMode})</p>
                      <p className="flex items-center gap-1.5"><DollarSign size={14} /> {item.stipend}</p>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-2 border-t pt-3 text-xs">
                      <div>
                        <p className="text-white font-semibold mb-1">Required Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {item.requiredSkills.map((s, i) => (
                            <span 
                              key={i} 
                              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                                hasSkill(userSkills, s)
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <CheckCircle size={10} /> {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {item.missingSkills.length > 0 && (
                        <div>
                          <p className="text-white font-semibold mb-1">Missing Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {item.missingSkills.map((s, i) => (
                              <span key={i} className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <XCircle size={10} /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2 mt-5 pt-3 border-t">
                    <button 
                      onClick={() => setSelectedInternship(item)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg transition">View Details
                    </button>
                    <button 
                      onClick={() => handleApply(item)}
                      disabled={hasApplied}
                      className={`flex-1 text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                        hasApplied 
                          ? 'bg-emerald-600 text-white cursor-not-allowed opacity-90' 
                          : 'bg-slate-200 hover:bg-blue-700 text-slate-700'
                      }`}
                    >
                      {hasApplied ? <><Check size={14} /> Applied</> : "Apply Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GRID: SKILL MATCH & RESUME SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 5. SKILL MATCH ANALYSIS */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-white">📊 Skill Match Analysis</h2>
            
            <div>
              <p className="text-xs text-white font-semibold mb-2">YOUR SKILLS ({userSkills.length})</p>
              {userSkills.length === 0 ? (
                <p className="text-xs text-white italic">No skills added yet. Go to your Profile to add skills.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.map((skill, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-white font-semibold mb-2">RECOMMENDED SKILLS TO ADD</p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Node.js", "Python", "SQL"].filter(s => !hasSkill(userSkills, s)).map((skill, i) => (
                  <span key={i} className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                    • {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 6. CONDITIONAL RESUME SCORE */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm space-y-4 flex flex-col justify-between text-xs">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white">📄 Resume Score</h2>
              {hasResume ? (
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FileCheck size={12} /> Uploaded
                </span>
              ) : (
                <span className="text-xs font-semibold bg-white text-amber-800 px-2.5 py-0.5 rounded-full">
                  Not Uploaded
                </span>
              )}
            </div>

            {hasResume ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-700 flex items-center justify-center font-black text-xl text-white bg-blue-700">
                    82%
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Strong Resume</p>
                    <p className="text-xs text-slate-300">Optimized for technical ATS screeners.</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 border-t pt-3">
                  <p className="text-white font-semibold">SUGGESTIONS TO IMPROVE</p>
                  <ul className="list-disc list-inside text-white space-y-0.5">
                    <li>Add full-stack projects using React & Node.</li>
                    <li>Include industry certifications.</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="border-2 border-dashed border-slate-200 p-6 rounded-xl text-center space-y-3">
                <p className="text-xs text-white">
                  You haven't uploaded a resume yet. Upload your resume to calculate your ATS match score.
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  <Upload size={14} /> Upload Resume in Profile
                </Link>
              </div>
            )}
          </section>

        </div>
        {/* GRID: RECENT APPLICATIONS & SAVED INTERNSHIPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 7. RECENTLY APPLIED */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm">
            <h2 className="text-base font-bold text-white mb-4">💼 Recently Applied</h2>
            {applications.length === 0 ? (
              <p className="text-xs text-white py-4 text-center border border-dashed border-white rounded-xl">
                No applications yet. Click "Apply Now" on recommended internships to start applying.
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                {applications.map((app, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-blue-700 rounded-xl border border-blue-700">
                    <div>
                      <span className="font-semibold text-white block">{app.company}</span>
                      <span className="text-slate-300 text-[10px]">{app.role}</span>
                    </div>
                    <span className="bg-blue-700 text-white px-2 py-0.5 rounded font-bold">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* 8. My Projects */}
          <section className="bg-blue-700 p-4 rounded-2xl border border-blue-700 shadow-sm min-h-[220px]">
            <h2 className="text-base font-bold text-white mb-4">
              🚀 My Projects
            </h2>

            {student.projects && student.projects.length > 0 ? (
              <div className="space-y-3">
                {student.projects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-blue-800 p-4 rounded-xl border border-blue-600"
                  >
                    <h3 className="font-semibold text-white">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-300 mt-1">
                      {project.description}
                    </p>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-300 hover:underline text-sm mt-2 inline-block"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
            <p className="text-slate-400">
              No projects added yet.
              </p>
            )}
          </section>


          {/* 9. SAVED INTERNSHIPS */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
              <Heart size={16} className="text-red-500 fill-red-500" /> Saved Internships
            </h2>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(localStorage.getItem("savedInternships") || "[]").length === 0 ? (
                <p className="text-xs text-white">
                  No saved internships yet.
                </p>
              ) : (
                JSON.parse(localStorage.getItem("savedInternships") || "[]").map((job) => (
                  <span
                    key={job.id}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    {job.company}
                  </span>
                ))
              )}
            </div>
          </section>
        </div>

        {/* GRID: TRENDING SKILLS, LEARNING RECOMMENDATIONS, UPCOMING DEADLINES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 10. TRENDING SKILLS */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <TrendingUp size={16} className="text-blue-700" /> Trending Skills
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["React", "Python", "SQL", "Node.js", "AWS", "Power BI"].map((skill, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* 11. LEARNING RECOMMENDATIONS */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <BookOpen size={16} className="text-white" /> Recommended Learning
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              <p className="p-1.5 bg-purple-50 rounded text-purple-900 font-medium">• React Basics</p>
              <p className="p-1.5 bg-purple-50 rounded text-purple-900 font-medium">• Advanced SQL Queries</p>
              <p className="p-1.5 bg-purple-50 rounded text-purple-900 font-medium">• Node.js REST APIs</p>
            </div>
          </section>

          {/* 12. UPCOMING DEADLINES */}
          <section className="bg-blue-700 p-6 rounded-2xl border border-blue-700 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <Clock size={16} className="text-amber-600" /> Upcoming Deadlines
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center border-b pb-1">
                <span className="font-semibold text-white">Google Internship</span>
                <span className="text-white font-bold">2 Aug 2026</span>
              </div>
              <div className="flex justify-between items-center border-b pb-1">
                <span className="font-semibold text-white">Microsoft</span>
                <span className="text-white font-bold">5 Aug 2026</span>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}