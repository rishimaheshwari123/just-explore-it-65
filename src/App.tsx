import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import OpenRoute from "@/components/auth/OpenRoute";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Dashboard from "./pages/admin/Dashboard";
import Layout from "./pages/admin/Layout";
import { RootState } from "./redux/store";
import { useSelector } from "react-redux";
import VendorRegister from "./pages/VendorRegister";
import VendorLogin from "./pages/VendorLogin";
import VendorManagement from "./pages/admin/VendorManagement";

const queryClient = new QueryClient();

const App = () => {
  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route
              path="/login"
              element={
                <OpenRoute>
                  <AdminLogin />
                </OpenRoute>
              }
            />
            <Route
              path="/register"
              element={
                <OpenRoute>
                  <AdminSignup />
                </OpenRoute>
              }
            />
            <Route
              path="/vendor/register"
              element={
                <OpenRoute>
                  <VendorRegister />
                </OpenRoute>
              }
            />
            <Route
              path="/vendor/login"
              element={
                <OpenRoute>
                  <VendorLogin />
                </OpenRoute>
              }
            />

            {/* ✅ Admin Routes (only if role = admin) */}
            {user?.role === "admin" && (
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="vendors"
                  element={
                    <PrivateRoute>
                      <VendorManagement />
                    </PrivateRoute>
                  }
                />
              </Route>
            )}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
