import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import Perfil from "./pages/Perfil";
import Resultados from "./pages/Resultados";
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
      
      {/* Candidate Dashboard Routes with Layout */}
      <Route path="/dashboard" element={
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      } />
      <Route path="/perfil" element={
        <DashboardLayout>
          <Perfil />
        </DashboardLayout>
      } />
      <Route path="/resultados" element={
        <DashboardLayout>
          <Resultados />
        </DashboardLayout>
      } />
      
      {/* Legacy routes - can be removed later */}
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      
      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/candidates" element={<AdminCandidates />} />
      <Route path="/admin/candidates/:candidateId" element={<AdminCandidateDetail />} />
      
      {/* Test and profile routes */}
      <Route path="/profile" element={<CandidateProfile />} />
      <Route path="/test/:assessmentId" element={<TestTaking />} />
      <Route path="/teste/:assessmentId" element={<TestTaking />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
