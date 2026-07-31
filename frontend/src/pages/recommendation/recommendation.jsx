import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowUpDown,
  Info,
  PlayCircle,
  BookOpen,
  FileText,
  X,
  Check,
  TrendingUp,
  ChevronRight
} from "lucide-react";

const MOCK_RECOMMENDATIONS = [
  {
    id: "rec-1",
    company: "Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    role: "Software Engineer Intern",
    category: "AI/ML",
    location: "Bangalore",
    workMode: "Remote",
    stipend: 50000,
    duration: "6 Months",
    deadline: "2026-08-15",
    requiredSkills: ["Python", "DSA", "SQL", "Git", "React", "Docker"],
    description: "Join Google's engineering team to build scalable cloud applications and machine learning pipelines.",
    responsibilities: [
      "Collaborate with senior engineers to write production-level React and Python code.",
      "Optimize data processing pipelines using SQL.",
      "Participate in daily code reviews and backend architecture design."
    ],
    eligibility: "Pursuing B.Tech/BE in CS/IT or related branch with strong fundamentals.",
    applyUrl: "https://careers.google.com"
  },
  {
    id: "rec-2",
    company: "Microsoft",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    role: "Data Science Intern",
    category: "Data Science",
    location: "Hyderabad",
    workMode: "Hybrid",
    stipend: 45000,
    duration: "3 Months",
    deadline: "2026-08-20",
    requiredSkills: ["Python", "Machine Learning", "SQL", "Data Analysis", "PowerBI"],
    description: "Work on large datasets using predictive machine learning models to solve cloud infrastructure challenges.",
    responsibilities: [
      "Analyze multi-terabyte dataset logs to identify performance bottlenecks.",
      "Train predictive models using Python and Scikit-Learn.",
      "Deliver actionable business insights to engineering managers."
    ],
    eligibility: "Strong background in statistics, data structures, and Python.",
    applyUrl: "https://careers.microsoft.com"
  },
  {
    id: "rec-3",
    company: "Amazon",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    role: "Frontend Developer Intern",
    category: "Web Development",
    location: "Delhi",
    workMode: "On-site",
    stipend: 40000,
    duration: "6 Months",
    deadline: "2026-08-10",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "TypeScript", "Tailwind"],
    description: "Build ultra-responsive e-commerce user interface components used by global customers.",
    responsibilities: [
      "Develop reusable React components using Tailwind CSS.",
      "Improve page loading speeds and optimize web performance.",
      "Fix cross-browser UI rendering issues."
    ],
    eligibility: "Proficiency in modern JavaScript and React ecosystem.",
    applyUrl: "https://amazon.jobs"
  },
  {
    id: "rec-4",
    company: "Uber",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    role: "Backend Engineer Intern",
    category: "Web Development",
    location: "Bangalore",
    workMode: "Hybrid",
    stipend: 55000,
    duration: "6 Months",
    deadline: "2026-08-25",
    requiredSkills: ["Java", "C++", "SQL", "System Design", "Docker"],
    description: "Build distributed microservices driving real-time location matching systems.",
    responsibilities: [
      "Develop scalable REST APIs in Java.",
      "Optimize SQL database query performance.",
      "Containerize applications with Docker for cloud deployment."
    ],
    eligibility: "Strong Object-Oriented Programming and System Design skills.",
    applyUrl: "https://uber.com/careers"
  }
];

export default function Recommendation() {
  const [studentSkills, setStudentSkills] = useState([]);
  const [studentGoal, setStudentGoal] = useState("");
  const [studentCgpa, setStudentCgpa] = useState("9.14");

  const [savedIds, setSavedIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [skillGapModal, setSkillGapModal] = useState(null);
  const [aiExplainModal, setAiExplainModal] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minStipend, setMinStipend] = useState(0);
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem("student") || "{}");
    let skills = [];
    if (Array.isArray(savedStudent.skills)) {
      skills = savedStudent.skills;
    } else if (typeof savedStudent.skills === "string" && savedStudent.skills.trim()) {
      skills = savedStudent.skills.split(",").map((s) => s.trim());
    } else {
      skills = ["Python", "SQL", "React", "DSA", "Data Structures", "Git"];
    }

    setStudentSkills(skills);
    setStudentGoal(savedStudent.career_goal || savedStudent.preferred_domain || "Software & AI Engineering");
    setStudentCgpa(savedStudent.cgpa || "9.14");

    setSavedIds(JSON.parse(localStorage.getItem("saved_internships") || "[]"));
    setAppliedIds(JSON.parse(localStorage.getItem("applied_internships") || "[]"));
  }, []);

  const toggleSave = (id) => {
    const updated = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    localStorage.setItem("saved_internships", JSON.stringify(updated));
  };

  const handleApply = (internship) => {
    if (!appliedIds.includes(internship.id)) {
      const updated = [...appliedIds, internship.id];
      setAppliedIds(updated);
      localStorage.setItem("applied_internships", JSON.stringify(updated));
    }
    window.open(internship.applyUrl, "_blank");
  };

  const processedInternships = useMemo(() => {
    return MOCK_RECOMMENDATIONS.map((internship) => {
      const userSkillsLower = studentSkills.map((s) => s.toLowerCase());
      const matchedSkills = [];
      const missingSkills = [];

      internship.requiredSkills.forEach((skill) => {
        if (userSkillsLower.includes(skill.toLowerCase())) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const skillMatchRatio = matchedSkills.length / internship.requiredSkills.length;
      let calculatedScore = Math.round(skillMatchRatio * 80);

      if (parseFloat(studentCgpa) >= 8.0) calculatedScore += 15;
      if (studentGoal.toLowerCase().includes(internship.category.toLowerCase())) calculatedScore += 5;

      const finalMatchScore = Math.min(calculatedScore, 98);

      const whyReasons = [];
      if (matchedSkills.length > 0) whyReasons.push(`Matches ${matchedSkills.length} of your skills (${matchedSkills.slice(0, 3).join(", ")})`);
      if (parseFloat(studentCgpa) >= 8.0) whyReasons.push(`Academic CGPA (${studentCgpa}) exceeds requirements`);
      if (studentGoal.toLowerCase().includes(internship.category.toLowerCase())) whyReasons.push(`Directly matches your target domain: ${internship.category}`);

      return {
        ...internship,
        matchScore: finalMatchScore,
        matchedSkills,
        missingSkills,
        whyReasons,
      };
    });
  }, [studentSkills, studentGoal, studentCgpa]);

  const filteredInternships = useMemo(() => {
    return processedInternships
      .filter((item) => {
        const matchesSearch =
          item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = !selectedLocation || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
        const matchesWorkMode = !selectedWorkMode || item.workMode === selectedWorkMode;
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        const matchesStipend = item.stipend >= minStipend;

        return matchesSearch && matchesLocation && matchesWorkMode && matchesCategory && matchesStipend;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchScore - a.matchScore;
        if (sortBy === "stipend") return b.stipend - a.stipend;
        if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
        return 0;
      });
  }, [processedInternships, searchQuery, selectedLocation, selectedWorkMode, selectedCategory, minStipend, sortBy]);

  const stats = useMemo(() => {
    const scores = processedInternships.map((i) => i.matchScore);
    return {
      total: processedInternships.length,
      highestMatch: Math.max(...scores, 0),
      avgMatch: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      saved: savedIds.length,
      applied: appliedIds.length,
    };
  }, [processedInternships, savedIds, appliedIds]);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Recommended Internships <Sparkles size={22} className="text-amber-500 fill-amber-500" />
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Personalized matching calculated directly against your current skill stack and academic criteria.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700">
            <TrendingUp size={16} /> Recommendation Engine Active
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold block uppercase">Matches</span>
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold block uppercase">Top Score</span>
            <span className="text-2xl font-bold text-emerald-600">{stats.highestMatch}%</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold block uppercase">Avg Match</span>
            <span className="text-2xl font-bold text-blue-600">{stats.avgMatch}%</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold block uppercase">Saved</span>
            <span className="text-2xl font-bold text-purple-600">{stats.saved}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 text-[11px] font-bold block uppercase">Applied</span>
            <span className="text-2xl font-bold text-amber-600">{stats.applied}</span>
          </div>
        </div>

        {/* CONTROLS & SEARCH BAR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by role or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Web Development">Web Development</option>
            </select>

            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-between items-center pt-2 border-t border-slate-100 gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Location filter..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-xs w-28 py-0.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Min Stipend:</span>
                <input
                  type="range"
                  min="0"
                  max="60000"
                  step="5000"
                  value={minStipend}
                  onChange={(e) => setMinStipend(Number(e.target.value))}
                  className="accent-blue-600 cursor-pointer w-24"
                />
                <span className="font-bold text-slate-800">₹{minStipend.toLocaleString()}/mo</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <span className="text-slate-500 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 font-bold border-none rounded-lg px-2.5 py-1 text-xs focus:ring-0"
              >
                <option value="match">Highest Match Score</option>
                <option value="stipend">Highest Stipend</option>
                <option value="deadline">Application Deadline</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD GRID */}
        {filteredInternships.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <AlertTriangle size={32} className="mx-auto text-amber-500" />
            <h3 className="font-bold text-slate-800">No recommendations match your query</h3>
            <p className="text-xs text-slate-500">Try adjusting your filters or resetting minimum stipend requirements.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInternships.map((internship) => {
              const isSaved = savedIds.includes(internship.id);
              const isApplied = appliedIds.includes(internship.id);

              return (
                <div
                  key={internship.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={internship.companyLogo}
                          alt={internship.company}
                          className="w-10 h-10 object-contain p-1 rounded-lg border border-slate-100 bg-slate-50"
                        />
                        <div>
                          <h3 className="font-bold text-base text-slate-900 leading-snug">{internship.role}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{internship.company}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSave(internship.id)}
                        className={`p-2 rounded-xl transition ${
                          isSaved ? "bg-purple-50 text-purple-600" : "bg-slate-50 text-slate-400 hover:text-slate-600"
                        }`}
                        title={isSaved ? "Saved" : "Save Internship"}
                      >
                        <Bookmark size={18} className={isSaved ? "fill-purple-600" : ""} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <MapPin size={13} className="text-slate-400" /> {internship.location}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Briefcase size={13} className="text-slate-400" /> {internship.workMode}
                      </span>
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                        <DollarSign size={13} /> ₹{internship.stipend.toLocaleString()}/mo
                      </span>
                    </div>

                    {/* MATCH METER */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Sparkles size={14} className="text-amber-500 fill-amber-500" /> Match Score
                        </span>
                        <span className="font-black text-blue-700">{internship.matchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            internship.matchScore >= 80 ? "bg-emerald-500" : internship.matchScore >= 60 ? "bg-blue-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${internship.matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* WHY RECOMMENDED */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Why Recommended?</span>
                        <button
                          onClick={() => setAiExplainModal(internship)}
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Info size={12} /> AI Reason
                        </button>
                      </div>
                      <ul className="text-xs space-y-1 text-slate-700">
                        {internship.whyReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SKILLS MATCHED & GAP */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-xs">
                        <span className="text-slate-400 font-bold block mb-1">Matching Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {internship.matchedSkills.map((sk, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {internship.missingSkills.length > 0 && (
                        <div className="text-xs pt-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400 font-bold">Missing Skills:</span>
                            <button
                              onClick={() => setSkillGapModal(internship)}
                              className="text-[11px] font-bold text-amber-600 hover:underline"
                            >
                              Bridge Gap →
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {internship.missingSkills.map((sk, idx) => (
                              <span key={idx} className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                                • {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION BAR */}
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Deadline: <strong className="text-slate-700">{internship.deadline}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInternship(internship)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleApply(internship)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition ${
                          isApplied
                            ? "bg-slate-200 text-slate-600 cursor-default"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isApplied ? <><CheckCircle2 size={13} /> Applied</> : <><ExternalLink size={13} /> Apply</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedInternship && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto relative border border-slate-200">
              <button
                onClick={() => setSelectedInternship(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedInternship.companyLogo}
                  alt={selectedInternship.company}
                  className="w-12 h-12 object-contain p-1 border rounded-xl"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedInternship.role}</h2>
                  <p className="text-xs text-slate-500 font-semibold">{selectedInternship.company} • {selectedInternship.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-xs font-semibold text-slate-700">
                <div><span className="text-slate-400 block">STIPEND</span> ₹{selectedInternship.stipend.toLocaleString()}/mo</div>
                <div><span className="text-slate-400 block">DURATION</span> {selectedInternship.duration}</div>
                <div><span className="text-slate-400 block">WORK MODE</span> {selectedInternship.workMode}</div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Description</h4>
                <p className="text-slate-600 leading-relaxed">{selectedInternship.description}</p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Responsibilities</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedInternship.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Eligibility</h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">{selectedInternship.eligibility}</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApply(selectedInternship)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5"
                >
                  Apply Now <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SKILL GAP MODAL */}
        {skillGapModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setSkillGapModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
                <BookOpen size={20} /> Bridge Skill Gap
              </div>
              <p className="text-xs text-slate-500">
                Target learning resources to maximize your match score for <strong>{skillGapModal.role}</strong>.
              </p>

              <div className="space-y-3">
                {skillGapModal.missingSkills.map((skill, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-xs text-slate-800 block">Missing Skill: {skill}</span>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial course')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-red-400 hover:text-red-600 font-semibold"
                      >
                        <PlayCircle size={12} /> YouTube
                      </a>
                      <a
                        href="https://roadmap.sh"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 font-semibold"
                      >
                        <ChevronRight size={12} /> Roadmap
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(skill + ' documentation')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-emerald-400 hover:text-emerald-600 font-semibold"
                      >
                        <FileText size={12} /> Docs
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI LOGIC EXPLANATION MODAL */}
        {aiExplainModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setAiExplainModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                <Sparkles size={18} className="fill-blue-600" /> Recommendation Breakdown
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  "The <strong>{aiExplainModal.role}</strong> position at <strong>{aiExplainModal.company}</strong> is matched at <strong>{aiExplainModal.matchScore}%</strong>."
                </p>
                <p className="text-slate-500">
                  This score is computed using skill overlaps ({aiExplainModal.matchedSkills.join(", ")}), target domain alignment, and your current CGPA.
                </p>
              </div>

              <button
                onClick={() => setAiExplainModal(null)}
                className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}