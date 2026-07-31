import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Award, 
  Settings, 
  Briefcase, 
  Heart, 
  MessageSquare, 
  HelpCircle,
  FileText
} from "lucide-react";

export default function Sidebar() {
  // Safely parse student data to avoid ReferenceError
  const student = JSON.parse(localStorage.getItem("student") || "{}");
  const location = useLocation();

  // Expanded Sidebar Navigation Links
  const mainNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Applications", path: "/applications", icon: Briefcase },
    { name: "Saved Internships", path: "/saved", icon: Heart },
    { name: "Skills & Resume", path: "/skills", icon: Award },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const secondaryNavItems = [
    { name: "Settings", path: "/setting", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* App Branding */}
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
            IP
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">InternPortal</h2>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Menu
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System & Support Section */}
        <div className="space-y-1 border-t border-slate-800/60 pt-4">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Preferences
          </p>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer User Info */}
      <div className="pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
          {student.name ? student.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-white truncate">
            {student.name || "User"}
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {student.email || "student@example.com"}
          </p>
        </div>
      </div>
    </aside>
  );
}