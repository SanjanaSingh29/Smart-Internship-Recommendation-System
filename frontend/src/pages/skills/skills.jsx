import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentProfile, updateStudentProfile } from "../../services/auth";

const PRESET_SKILLS = [
  "React", "Node.js", "Python", "C++", "Java", "SQL", 
  "Tailwind CSS", "Data Structures", "Git", "Machine Learning", 
  "AutoCAD", "MATLAB", "SolidWorks", "JavaScript"
];

function Skills() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      try {
        if (student?.id || student?._id) {
          const data = await getStudentProfile(student.id || student._id);
          // Parse skills whether stored as comma-separated string or array
          if (data?.skills) {
            const parsed = Array.isArray(data.skills)
              ? data.skills
              : data.skills.split(",").map((s) => s.trim()).filter(Boolean);
            setSkillsList(parsed);
          }
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [student]);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    
    // Avoid duplicate additions
    if (skillsList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    setSkillsList((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    setSuccessMsg("");

    try {
      const updatedString = skillsList.join(", ");

      // Update LocalStorage
      const currentStudent = JSON.parse(localStorage.getItem("student")) || {};
      const updatedStudent = { ...currentStudent, skills: updatedString };
      localStorage.setItem("student", JSON.stringify(updatedStudent));

      // Sync with API if service is available
      if (updateStudentProfile && (student?.id || student?._id)) {
        await updateStudentProfile(student.id || student._id, {
          skills: updatedString,
        });
      }

      setSuccessMsg("Skills updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to save skills.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-gray-600">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 flex justify-center items-center p-4 text-white">
      <div className="bg-blue-800 border border-blue-700 rounded-2xl p-8 w-full max-w-2xl my-8 space-y-6 shadow-xl">
        
        {/* HEADER */}
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🧠 Technical Skills</h1>
            <p className="text-sm text-white mt-1">
              Add key technical skills to match with internship requirements.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-blue-700 border border-blue-700 text-white px-3 py-1.5 rounded-xl hover:bg-blue-600 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* INPUT FORM */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">
            Add Custom Skill
          </label>
          <div className=" flex gap-2 text-sm text-white items-center">
            <input
              type="text"
              placeholder="e.g. React, C++, AutoCAD"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(newSkill);
                }
              }}
              className="w-full bg-white border border-white p-2.5 rounded-xl text-sm text-slate-800 placeholder:text-slate-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkill)}
              className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-white uppercase tracking-wider">
            Quick Add Suggestions
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_SKILLS.map((preset) => {
              const isAdded = skillsList.some(
                (s) => s.toLowerCase() === preset.toLowerCase()
              );
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={isAdded}
                  onClick={() => handleAddSkill(preset)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    isAdded
                      ? "bg-blue-600 text-white border-blue-600 cursor-not-allowed"
                      : "bg-blue-600/10 text-white border-blue-600 hover:bg-slate-700 hover:border-blue-500 hover:text-blue-400"
                  }`}
                >
                  {isAdded ? `✓ ${preset}` : `+ ${preset}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* CURRENT SKILLS BADGES */}
        <div className="border-t pt-4 space-y-3">
          <h2 className="text-base font-bold text-white">
            Your Selected Skills ({skillsList.length})
          </h2>

          {skillsList.length === 0 ? (
            <p className="text-sm text-white italic">
              No skills added yet. Type a skill or click suggestions above!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 ">
              {skillsList.map((skill, index) => (
                <span
                  key={skill}
                  className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-400 font-bold ml-1 text-base leading-none"
                  >
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <p className="text-sm bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-semibold p-2.5 rounded border text-center">
            {successMsg}
          </p>
        )}

        {/* SAVE ACTIONS */}
        <div className="border-t pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="bg-blue-600 border border-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSkills}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-500 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Skills"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Skills;