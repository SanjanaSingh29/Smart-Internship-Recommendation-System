import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";


function App() {
  return (
  <Routes>
    <Route path="/" element={<Login />} />

    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />
  </Routes>
  );
}

export default App;