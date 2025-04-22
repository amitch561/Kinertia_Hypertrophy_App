
import { Toaster } from "@/components/ui/toast-container";
import { Toaster as Sonner } from "@/components/ui/sonner-toast";
import { TooltipProvider } from "@/components/ui/tooltip-popup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkoutProvider } from "@/contexts/WorkoutProvider";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import NotFound from "./pages/NotFound";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import CreateWorkout from "./pages/CreateWorkout";
import MesocyclesPage from "@/pages/MesocyclesPage";
import MacroCyclePlanPage from "@/pages/MacroCyclePlanPage";

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <WorkoutProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/onboarding"
                  element={
                    <AuthenticatedRoute>
                      <Onboarding />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <AuthenticatedRoute>
                      <Dashboard />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/workout"
                  element={
                    <AuthenticatedRoute>
                      <Workout />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <AuthenticatedRoute>
                      <Calendar />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthenticatedRoute>
                      <Profile />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/create-workout"
                  element={
                    <AuthenticatedRoute>
                      <CreateWorkout />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/mesocycles"
                  element={
                    <AuthenticatedRoute>
                      <MesocyclesPage />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/create-plan"
                  element={
                    <AuthenticatedRoute>
                      <MacroCyclePlanPage />
                    </AuthenticatedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </WorkoutProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
