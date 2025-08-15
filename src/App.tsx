import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { HomePage } from "@/pages/HomePage";
import { CoursesPage } from "@/pages/CoursesPage";
import { ContactPage } from "@/pages/ContactPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { StudentDashboard } from "@/pages/dashboards/StudentDashboard";
import { StaffDashboard } from "@/pages/dashboards/StaffDashboard";
import { LecturerDashboard } from "@/pages/dashboards/LecturerDashboard";
import { getCurrentUser } from "@/utils/auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCurrentUser());

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage onLogout={handleLogout} />} />
            <Route path="/courses" element={<CoursesPage onLogout={handleLogout} />} />
            <Route path="/contact" element={<ContactPage onLogout={handleLogout} />} />
            <Route path="/gallery" element={<GalleryPage onLogout={handleLogout} />} />
            <Route path="/calendar" element={<CalendarPage onLogout={handleLogout} />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/student" element={<StudentDashboard onLogout={handleLogout} />} />
            <Route path="/staff" element={<StaffDashboard onLogout={handleLogout} />} />
            <Route path="/lecturer" element={<LecturerDashboard onLogout={handleLogout} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
