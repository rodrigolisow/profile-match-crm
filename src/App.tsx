import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import TestTaking from "./pages/TestTaking";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCandidates from "./pages/AdminCandidates";
import AdminCandidateDetail from "./pages/AdminCandidateDetail";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/candidates" element={<AdminCandidates />} />
      <Route path="/admin/candidates/:candidateId" element={<AdminCandidateDetail />} />
      <Route path="/profile" element={<CandidateProfile />} />
      <Route path="/test/:assessmentId" element={<TestTaking />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
