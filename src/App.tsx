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
import VendorLayout from "./pages/vendor/VendorLayout";
import VendorDashboard from "./pages/vendor/VendorDashboard";

import VendorAddBusiness from "./pages/vendor/VendorAddBusiness";
import VendorBusinesses from "./pages/vendor/VendorBusinesses";
import VendorEditBusiness from "./pages/vendor/VendorEditBusiness";
import VendorBusinessInquiry from "./pages/vendor/VendorBusinessInquiry";
import GetBlog from "./pages/admin/GetBlog";
import AddBlog from "./pages/admin/AddBlog";
import Blogs from "./pages/Blogs";
import SingleBlog from "./pages/SingleBlog";

import BusinessListing from "./pages/BusinessListing";
import BusinessDetail from "./pages/BusinessDetail";
import AddBusiness from "./pages/AddBusiness";
import EditBusiness from "./pages/EditBusiness";
import VendorGetInquiry from "./pages/vendor/VendorGetInquiry";
import BusinessManagement from "./pages/admin/BusinessManagement";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserProfile from "./pages/user/UserProfile";
import VendorSupport from "./pages/vendor/VendorSupport";
import AdminSupport from "./pages/admin/AdminSupport";

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
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/properties" element={<Index />} />
            <Route path="/contact" element={<Index />} />

            <Route path="/business-listing" element={<BusinessListing />} />
            <Route path="/business/:id" element={<BusinessDetail />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/edit-business/:id" element={<EditBusiness />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
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
                <Route
                  path="add-blog"
                  element={
                    <PrivateRoute>
                      <AddBlog />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="get-blog"
                  element={
                    <PrivateRoute>
                      <GetBlog />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="businesses"
                  element={
                    <PrivateRoute>
                      <BusinessManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="support"
                  element={
                    <PrivateRoute>
                      <AdminSupport />
                    </PrivateRoute>
                  }
                />
              </Route>
            )}
            {user?.role === "vendor" && (
              <Route
                path="/vendor"
                element={
                  <PrivateRoute>
                    <VendorLayout />
                  </PrivateRoute>
                }
              >
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute>
                      <VendorDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="add-business"
                  element={
                    <PrivateRoute>
                      <VendorAddBusiness />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="businesses"
                  element={
                    <PrivateRoute>
                      <VendorBusinesses />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="edit-business/:businessId"
                  element={
                    <PrivateRoute>
                      <VendorEditBusiness />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="business-inquiry"
                  element={
                    <PrivateRoute>
                      <VendorBusinessInquiry />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="get-inquiry"
                  element={
                    <PrivateRoute>
                      <VendorGetInquiry />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="support"
                  element={
                    <PrivateRoute>
                      <VendorSupport />
                    </PrivateRoute>
                  }
                />
              </Route>
            )}

            {/* User Routes */}
            <Route
              path="/user/login"
              element={
                <OpenRoute>
                  <UserLogin />
                </OpenRoute>
              }
            />
            <Route
              path="/user/register"
              element={
                <OpenRoute>
                  <UserRegister />
                </OpenRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
