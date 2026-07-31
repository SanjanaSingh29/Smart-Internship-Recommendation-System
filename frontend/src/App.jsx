import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

// Page Imports
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import EditProfile from "./pages/profile/edit_profile";
import Skills from "./pages/skills/skills";
import Internship from "./pages/internship/internship";
import Recommendation from "./pages/recommendation/recommendation";
import Application from "./pages/application/application";
import Setting from "./pages/setting/setting";
import SavedInternships from "./pages/SavedInternships";

// Auth Guard Import
import ProtectedRoute from "./components/ui/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit_profile" element={<EditProfile />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <Skills />
          </ProtectedRoute>
        }
      />

      <Route
        path="/internship"
        element={
          <ProtectedRoute>
            <Internship />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recommendation"
        element={
          <ProtectedRoute>
            <Recommendation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/application"
        element={
          <ProtectedRoute>
            <Application />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setting"
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        }
      />
      <Route>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Top-level pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved" element={<SavedInternships />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* PLURAL PATH REDIRECTS (Prevents wildcard triggers if links use plural paths) */}
      <Route path="/internships" element={<Navigate to="/internship" replace />} />
      <Route path="/recommendations" element={<Navigate to="/recommendation" replace />} />
      <Route path="/applications" element={<Navigate to="/application" replace />} />
      <Route path="/settings" element={<Navigate to="/setting" replace />} />

      {/* CATCH-ALL WILDCARD FALLBACK */}
      <Route
        path="*"
        element={
          localStorage.getItem("token")
          ? <Navigate to="/dashboard" replace />
          : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;