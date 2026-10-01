import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";
import CodeAnalyzer from "./pages/CodeAnalyzer";
import ProjectGenerator from "./pages/ProjectGenerator";
import AnalysisResult from "./pages/AnalysisResult";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code-analyzer" element={<CodeAnalyzer />} />
        <Route path="/project-generator" element={<ProjectGenerator />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis/:id" element={<AnalysisResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;