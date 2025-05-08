
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmailBuilder from "./pages/EmailBuilder";
import Automations from "./pages/Automations";
import SmtpSettings from "./pages/SmtpSettings";
import Settings from "./pages/Settings";
import AdminLayout from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rotas da área administrativa */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="email-builder" element={<EmailBuilder />} />
            <Route path="automations" element={<Automations />} />
            <Route path="smtp" element={<SmtpSettings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Rota catch-all para páginas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
