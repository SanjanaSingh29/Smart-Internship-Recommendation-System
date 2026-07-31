import React, { useState, useMemo } from "react";
import {
  Search, Filter, MapPin, DollarSign, Clock, Sparkles, Building2,
  CheckCircle2, XCircle, ArrowLeft, Bookmark, Share2, Download,
  ExternalLink, ChevronRight, SlidersHorizontal, BookOpen, UserCheck,
  Calendar, Layers, ShieldCheck, Briefcase, RefreshCw, X, Check
} from "lucide-react";

// --- MOCK DATABASE ---
const SAMPLE_USER_SKILLS = ["Python", "SQL", "Git", "C++", "HTML", "CSS"];

const INITIAL_INTERNSHIPS = [
  {
    id: "g-01",
    company: "Google",
    logo: "https://www.google.com/favicon.ico",
    role: "Software Engineer Intern",
    location: "Bangalore",
    mode: "Hybrid",
    stipend: 50000,
    duration: "3 Months",
    lastDate: "31 Aug 2026",
    postedDate: "2026-07-28",
    category: "Web Development",
    matchScore: 95,
    requiredSkills: ["Python", "DSA", "Git", "SQL", "React"],
    preferredSkills: ["Docker", "Linux", "Cloud"],
    description: "Work with Google's engineering team to build scalable web applications and AI-powered products.",
    responsibilities: [
      "Build scalable web applications with clean code standards",
      "Participate in daily peer code reviews and architectural discussions",
      "Work with senior engineers to optimize high-throughput distributed APIs"
    ],
    eligibility: { degree: "B.Tech", year: "2nd Year+", minCgpa: 7.0, stream: "Computer Science" },
    companyInfo: { founded: "1998", website: "https://www.google.com", industry: "Technology", employees: "180,000+" }
  },
  {
    id: "m-02",
    company: "Microsoft",
    logo: "https://www.microsoft.com/favicon.ico",
    role: "SDE Intern - Cloud Systems",
    location: "Hyderabad",
    mode: "Remote",
    stipend: 65000,
    duration: "6 Months",
    lastDate: "15 Aug 2026",
    postedDate: "2026-07-30",
    category: "Cloud Computing",
    matchScore: 88,
    requiredSkills: ["C++", "SQL", "Git", "Linux"],
    preferredSkills: ["Azure", "Kubernetes"],
    description: "Architect Next-Gen Azure infrastructure components and edge computing frameworks.",
    responsibilities: [
      "Write high-performance C++ backend modules",
      "Diagnose network latency spikes in distributed cloud microservices"
    ],
    eligibility: { degree: "B.Tech / M.Tech", year: "3rd Year+", minCgpa: 7.5, stream: "CS / IT / ECE" },
    companyInfo: { founded: "1975", website: "https://www.microsoft.com", industry: "Software", employees: "220,000+" }
  },
  {
    id: "a-03",
    company: "Amazon",
    logo: "https://www.amazon.com/favicon.ico",
    role: "AI / ML Research Intern",
    location: "Bangalore",
    mode: "On-site",
    stipend: 45000,
    duration: "3 Months",
    lastDate: "25 Aug 2026",
    postedDate: "2026-07-25",
    category: "AI/ML",
    matchScore: 78,
    requiredSkills: ["Python", "Machine Learning", "SQL", "PyTorch"],
    preferredSkills: ["Docker", "AWS"],
    description: "Build cutting-edge generative model pipelines for retail demand prediction.",
    responsibilities: [
      "Train transformer models on massive consumer behavioral datasets",
      "Optimize model inference runtimes for low-latency server deployments"
    ],
    eligibility: { degree: "B.Tech", year: "3rd Year+", minCgpa: 8.0, stream: "CS / AI" },
    companyInfo: { founded: "1994", website: "https://www.amazon.com", industry: "E-Commerce / Cloud", employees: "1,500,000+" }
  },
  {
    id: "ad-04",
    company: "Adobe",
    logo: "https://www.adobe.com/favicon.ico",
    role: "Frontend Engineer Intern",
    location: "Delhi",
    mode: "Hybrid",
    stipend: 40000,
    duration: "2 Months",
    lastDate: "20 Aug 2026",
    postedDate: "2026-07-29",
    category: "Web Development",
    matchScore: 91,
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    preferredSkills: ["UI/UX", "Tailwind"],
    description: "Create fluid digital creative interfaces for Creative Cloud Web applications.",
    responsibilities: [
      "Implement accessible and responsive Web Components in React",
      "Collaborate with UX researchers to refine Canvas interaction flows"
    ],
    eligibility: { degree: "B.Tech / B.Des", year: "2nd Year+", minCgpa: 6.5, stream: "Any STEM" },
    companyInfo: { founded: "1982", website: "https://www.adobe.com", industry: "Software", employees: "29,000+" }
  }
];

export default function InternshipPortal() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("search"); // "search" | "details"
  const [selectedInternship, setSelectedInternship] = useState(INITIAL_INTERNSHIPS[0]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stipendRange, setStipendRange] = useState("ALL"); // "ALL" | "0-10" | "10-25" | "25-50" | "50+"
  const [minMatch, setMinMatch] = useState(0);
  const [sortBy, setSortBy] = useState("HIGHEST_MATCH");

  // User Actions State
  const [savedIds, setSavedIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [notification, setNotification] = useState("");

  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Autocomplete Suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const keywords = ["Python Developer", "Python Intern", "Python + AI", "React Frontend", "Full Stack", "Data Scientist"];
    return keywords.filter((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  // Filter & Search Execution Engine
  const filteredInternships = useMemo(() => {
    return INITIAL_INTERNSHIPS.filter((item) => {
      // Keyword/Search check
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        item.role.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.requiredSkills.some((s) => s.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Location Filter
      if (selectedLocations.length > 0 && !selectedLocations.includes(item.location)) {
        return false;
      }

      // Work Mode Filter
      if (selectedModes.length > 0 && !selectedModes.includes(item.mode)) {
        return false;
      }

      // Duration Filter
      if (selectedDurations.length > 0 && !selectedDurations.includes(item.duration)) {
        return false;
      }

      // Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }

      // Match Score Filter
      if (item.matchScore < minMatch) return false;

      // Stipend Filter
      if (stipendRange === "0-10" && item.stipend > 10000) return false;
      if (stipendRange === "10-25" && (item.stipend < 10000 || item.stipend > 25000)) return false;
      if (stipendRange === "25-50" && (item.stipend < 25000 || item.stipend > 50000)) return false;
      if (stipendRange === "50+" && item.stipend < 50000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "HIGHEST_MATCH") return b.matchScore - a.matchScore;
      if (sortBy === "HIGHEST_STIPEND") return b.stipend - a.stipend;
      if (sortBy === "NEWEST") return new Date(b.postedDate) - new Date(a.postedDate);
      if (sortBy === "ALPHABETICAL") return a.role.localeCompare(b.role);
      return 0;
    });
  }, [searchTerm, selectedLocations, selectedModes, selectedDurations, selectedCategories, minMatch, stipendRange, sortBy]);

  // Handle Save Toggle
  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      triggerToast("Removed from Saved Internships");
    } else {
      setSavedIds([...savedIds, id]);
      triggerToast("Saved to Bookmarks!");
    }
  };

  // Handle Apply
  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
      triggerToast("Application submitted successfully!");
    }
  };

  // Download PDF Summary
  const downloadPdf = (internship) => {
    const textContent = `
====================================================
INTERNSHIP DETAILS - ${internship.company.toUpperCase()}
====================================================
Role: ${internship.role}
Location: ${internship.location} (${internship.mode})
Stipend: ₹${internship.stipend.toLocaleString()}/month
Duration: ${internship.duration}
Apply Before: ${internship.lastDate}

MATCH ANALYSIS:
Score: ${internship.matchScore}%
Required Skills: ${internship.requiredSkills.join(", ")}

JOB DESCRIPTION:
${internship.description}

COMPANY DETAILS:
Website: ${internship.companyInfo.website}
Industry: ${internship.companyInfo.industry}
====================================================
    `;
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${internship.company}_${internship.role.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Details downloaded as file");
  };

  const handleOpenDetails = (internship) => {
    setSelectedInternship(internship);
    setActiveTab("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle helpers for array multi-selects
  const toggleArrayFilter = (setter, currentArray, value) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter((item) => item !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  const resetAllFilters = () => {
    setSelectedLocations([]);
    setSelectedModes([]);
    setSelectedDurations([]);
    setSelectedCategories([]);
    setStipendRange("ALL");
    setMinMatch(0);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* GLOBAL TOAST NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight">SmartIntern</span>
              <span className="ml-2 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-200">
                AI Powered
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "search" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Search & Filters
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "details" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Internship Details
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* HERO SEARCH SECTION */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-400/30 text-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Matches tailored to your skills
                </span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Find Your Next High-Impact Internship
                </h1>
                <p className="text-slate-300 text-xs md:text-sm">
                  Search across top companies with real-time algorithm skill gap analysis.
                </p>

                {/* SEARCH INPUT BAR */}
                <div className="relative pt-2">
                  <div className="flex items-center bg-white rounded-2xl p-2 shadow-lg text-slate-800">
                    <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="🔍 Search by Job Title, Company, or Skill (e.g. Python, React)..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full px-3 py-2 text-xs md:text-sm focus:outline-none bg-transparent"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* AUTOCOMPLETE DROPDOWN */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-30 text-slate-800 overflow-hidden">
                      <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Search Suggestions
                      </div>
                      {suggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchTerm(item);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-2.5 text-xs hover:bg-blue-50 cursor-pointer flex items-center justify-between transition"
                        >
                          <span className="font-semibold">{item}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TWO-COLUMN GRID: FILTERS (LEFT) + RESULTS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* SIDEBAR FILTERS (PAGE 2 REQUIREMENT) */}
              <div className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900">Filters</h2>
                  </div>
                  <button onClick={resetAllFilters} className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* 1. Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Location</label>
                  {["Delhi", "Bangalore", "Hyderabad", "Remote"].map((loc) => (
                    <label key={loc} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(loc)}
                        onChange={() => toggleArrayFilter(setSelectedLocations, selectedLocations, loc)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {loc}
                    </label>
                  ))}
                </div>

                {/* 2. Stipend */}
                <div className="space-y-2 border-t pt-3 border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">Stipend Range</label>
                  {[
                    { label: "All Rates", val: "ALL" },
                    { label: "₹0 - ₹10,000", val: "0-10" },
                    { label: "₹10,000 - ₹25,000", val: "10-25" },
                    { label: "₹25,000 - ₹50,000", val: "25-50" },
                    { label: "₹50,000+", val: "50+" }
                  ].map((s) => (
                    <label key={s.val} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="stipend"
                        checked={stipendRange === s.val}
                        onChange={() => setStipendRange(s.val)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>

                {/* 3. Work Mode */}
                <div className="space-y-2 border-t pt-3 border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">Work Mode</label>
                  {["Remote", "Hybrid", "On-site"].map((m) => (
                    <label key={m} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedModes.includes(m)}
                        onChange={() => toggleArrayFilter(setSelectedModes, selectedModes, m)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {m}
                    </label>
                  ))}
                </div>

                {/* 4. Internship Duration */}
                <div className="space-y-2 border-t pt-3 border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">Duration</label>
                  {["1 Month", "2 Months", "3 Months", "6 Months"].map((d) => (
                    <label key={d} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedDurations.includes(d)}
                        onChange={() => toggleArrayFilter(setSelectedDurations, selectedDurations, d)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {d}
                    </label>
                  ))}
                </div>

                {/* 5. Category */}
                <div className="space-y-2 border-t pt-3 border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">Category</label>
                  {["AI/ML", "Data Science", "Web Development", "Cloud Computing"].map((c) => (
                    <label key={c} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleArrayFilter(setSelectedCategories, selectedCategories, c)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {c}
                    </label>
                  ))}
                </div>

                {/* 6. Match Percentage threshold */}
                <div className="space-y-2 border-t pt-3 border-slate-100">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Min Match Score</label>
                    <span className="text-xs font-extrabold text-blue-600">{minMatch}%+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="10"
                    value={minMatch}
                    onChange={(e) => setMinMatch(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Any</span>
                    <span>70%+</span>
                    <span>80%+</span>
                    <span>90%+</span>
                  </div>
                </div>
              </div>

              {/* MAIN CARDS LIST (PAGE 1 REQUIREMENT) */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* SORTING HEADER BAR */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-3">
                  <div className="text-xs font-semibold text-slate-500">
                    Showing <span className="font-bold text-slate-900">{filteredInternships.length}</span> opportunities
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-bold text-slate-600">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="HIGHEST_MATCH">Highest Match Score</option>
                      <option value="NEWEST">Newest First</option>
                      <option value="HIGHEST_STIPEND">Highest Stipend</option>
                      <option value="ALPHABETICAL">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {/* INTERNSHIP CARDS GRID */}
                {filteredInternships.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">No matching internships found</h3>
                    <p className="text-xs text-slate-500">Try broadening your search term or clearing applied filters.</p>
                    <button
                      onClick={resetAllFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredInternships.map((item) => {
                    const isSaved = savedIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative group"
                      >
                        {/* CARD TOP ROW */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                              <img
                                src={item.logo}
                                alt={item.company}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://cdn-icons-png.flaticon.com/512/4300/4300059.png";
                                }}
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.company}</span>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                                {item.role}
                              </h3>
                            </div>
                          </div>

                          {/* AI MATCH BADGE */}
                          <div className="flex items-center gap-2">
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              ⭐ {item.matchScore}% Match
                            </div>
                            <button
                              onClick={(e) => toggleSave(item.id, e)}
                              className={`p-2 rounded-xl border transition ${
                                isSaved
                                  ? "bg-amber-50 border-amber-300 text-amber-600"
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                              }`}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>

                        {/* KEY ATTRIBUTES */}
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}</span>
                          <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> ₹{item.stipend.toLocaleString()}/month</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {item.mode} ({item.duration})</span>
                        </div>

                        {/* REQUIRED SKILLS CHIPS */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.requiredSkills.map((sk) => {
                              const hasSkill = SAMPLE_USER_SKILLS.includes(sk);
                              return (
                                <span
                                  key={sk}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                                    hasSkill
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  {sk} {hasSkill && "✓"}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* CARD FOOTER BUTTON */}
                        <div className="border-t pt-3 border-slate-100 flex justify-between items-center">
                          <span className="text-[11px] text-slate-400">Apply by {item.lastDate}</span>
                          <button
                            onClick={() => handleOpenDetails(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                          >
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* DETAILS PAGE VIEW (PAGE 3 & 4 REQUIREMENT) */}
        {activeTab === "details" && selectedInternship && (
          <div className="space-y-6">
            {/* BACK BUTTON HEADER */}
            <button
              onClick={() => setActiveTab("search")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Internship Search
            </button>

            {/* HEADER BANNER */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 p-3 shrink-0 flex items-center justify-center">
                  <img
                    src={selectedInternship.logo}
                    alt={selectedInternship.company}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedInternship.company}</span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-200">
                      {selectedInternship.category}
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">{selectedInternship.role}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  ⭐ {selectedInternship.matchScore}% Match
                </div>
                <button
                  onClick={() => downloadPdf(selectedInternship)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                  title="Download Summary"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSave(selectedInternship.id)}
                  className={`p-2.5 rounded-xl border transition ${
                    savedIds.includes(selectedInternship.id)
                      ? "bg-amber-50 border-amber-300 text-amber-600"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* BASIC INFORMATION TABLE MATRIX */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider">
                Basic Information
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-slate-100 text-xs">
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Company</span> <span className="font-bold text-slate-900">{selectedInternship.company}</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Role</span> <span className="font-bold text-slate-900">{selectedInternship.role}</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Location</span> <span className="font-bold text-slate-900">{selectedInternship.location}</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Mode</span> <span className="font-bold text-slate-900">{selectedInternship.mode}</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Duration</span> <span className="font-bold text-slate-900">{selectedInternship.duration}</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Stipend</span> <span className="font-bold text-slate-900">₹{selectedInternship.stipend.toLocaleString()}/month</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Last Date</span> <span className="font-bold text-slate-900">{selectedInternship.lastDate}</span></div>
                <div className="p-4"><span className="text-slate-400 block font-semibold mb-0.5">Status</span> <span className="font-bold text-emerald-600">Actively Hiring</span></div>
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT 2 COLUMNS: DESCRIPTION, RESPONSIBILITIES, ELIGIBILITY */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Description */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Description</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedInternship.description}</p>
                </div>

                {/* Responsibilities */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Responsibilities</h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {selectedInternship.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required vs Preferred Skills */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Skills Requirement</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block mb-1">Required Skills:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedInternship.requiredSkills.map((sk) => (
                          <span key={sk} className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-lg font-semibold border border-slate-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block mb-1">Preferred Skills:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedInternship.preferredSkills.map((sk) => (
                          <span key={sk} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-lg font-semibold border border-blue-100">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Eligibility Criteria</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block">Degree</span> <span className="font-bold">{selectedInternship.eligibility.degree}</span></div>
                    <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block">Year</span> <span className="font-bold">{selectedInternship.eligibility.year}</span></div>
                    <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block">Min CGPA</span> <span className="font-bold">{selectedInternship.eligibility.minCgpa}</span></div>
                    <div className="bg-slate-50 p-3 rounded-xl"><span className="text-slate-400 block">Branch</span> <span className="font-bold">{selectedInternship.eligibility.stream}</span></div>
                  </div>
                </div>
              </div>

              {/* RIGHT 1 COLUMN: MATCH ANALYSIS & ACTION BOX */}
              <div className="space-y-6">
                
                {/* MATCH ANALYSIS CARD (PROJECT FEATURE HIGHLIGHT) */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold">Match Analysis</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Assessment
                    </span>
                  </div>

                  {/* Progress Ring / Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-300">Overall Match Score</span>
                      <span className="text-2xl font-black text-emerald-400">{selectedInternship.matchScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                        style={{ width: `${selectedInternship.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Matched vs Missing Skills breakdown */}
                  {(() => {
                    const matched = selectedInternship.requiredSkills.filter((sk) => SAMPLE_USER_SKILLS.includes(sk));
                    const missing = selectedInternship.requiredSkills.filter((sk) => !SAMPLE_USER_SKILLS.includes(sk));
                    return (
                      <div className="space-y-3 pt-2 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold mb-1">✔ Matched Skills ({matched.length})</span>
                          <div className="flex flex-wrap gap-1">
                            {matched.map((m) => (
                              <span key={m} className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/30">
                                ✔ {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-semibold mb-1">❌ Missing Skills ({missing.length})</span>
                          <div className="flex flex-wrap gap-1">
                            {missing.map((ms) => (
                              <span key={ms} className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/30">
                                ❌ {ms}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Suggestions */}
                        {missing.length > 0 && (
                          <div className="border-t border-slate-800 pt-3 space-y-1.5">
                            <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" /> Recommended Prep Roadmap:
                            </span>
                            <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                              {missing.map((ms) => (
                                <li key={ms} className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg">
                                  <span>Complete {ms} Crash Course</span>
                                  <ChevronRight className="w-3 h-3 text-slate-400" />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* COMPANY INFORMATION CARD */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Company Overview</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between"><span className="text-slate-400">Founded</span><span className="font-semibold text-slate-800">{selectedInternship.companyInfo.founded}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Industry</span><span className="font-semibold text-slate-800">{selectedInternship.companyInfo.industry}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Employees</span><span className="font-semibold text-slate-800">{selectedInternship.companyInfo.employees}</span></div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Website</span>
                      <a href={selectedInternship.companyInfo.website} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* APPLY & SHARE ACTION BUTTONS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <button
                    onClick={() => handleApply(selectedInternship.id)}
                    disabled={appliedIds.includes(selectedInternship.id)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      appliedIds.includes(selectedInternship.id)
                        ? "bg-slate-100 text-emerald-700 cursor-not-allowed border border-emerald-300"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                    }`}
                  >
                    {appliedIds.includes(selectedInternship.id) ? (
                      <>
                        <Check className="w-4 h-4" /> Application Submitted
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleSave(selectedInternship.id)}
                      className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {savedIds.includes(selectedInternship.id) ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        triggerToast("Internship link copied to clipboard!");
                      }}
                      className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SIMILAR INTERNSHIPS (SECTION 4 REQUIREMENT) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">4. Similar Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_INTERNSHIPS.filter((i) => i.id !== selectedInternship.id)
                  .slice(0, 3)
                  .map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => handleOpenDetails(sim)}
                      className="p-4 border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md cursor-pointer transition space-y-3 bg-slate-50/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{sim.company}</span>
                          <h4 className="text-xs font-bold text-slate-900">{sim.role}</h4>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {sim.matchScore}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold pt-2 border-t border-slate-200">
                        <span>₹{sim.stipend.toLocaleString()}/mo</span>
                        <span className="text-blue-600 flex items-center gap-0.5">View <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}