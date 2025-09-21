import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, BarChart3, Plus, Building2, MessageSquare, LogOut, Store, ShoppingBag, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/authSlice";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setToken(null));
    dispatch(setUser(null));
    navigate("/");
    toast.success("User Logout Succesfully!");
  };

  // Function to toggle sidebar collapse
  const handleToggle = () => {
    const collapsed = !isCollapsed;
    setIsCollapsed(collapsed);
    localStorage.setItem("sidebarCollapsed", collapsed.toString());
  };

  // Effect to close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsCollapsed(true);
        localStorage.setItem("sidebarCollapsed", "true");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { to: "/", icon: Home, label: "Back To Home", color: "text-blue-600", section: "general" },
    { to: "/vendor/dashboard", icon: BarChart3, label: "Dashboard", color: "text-green-600", section: "general" },
  ];

  // Property functionality removed as per requirements

  const businessMenuItems = [
    { to: "/vendor/add-business", icon: Store, label: "Add Business", color: "text-emerald-600" },
    { to: "/vendor/businesses", icon: ShoppingBag, label: "All Businesses", color: "text-teal-600" },
    { to: "/vendor/business-inquiry", icon: Mail, label: "Business Inquiry", color: "text-cyan-600" },
    { to: "/vendor/support", icon: MessageSquare, label: "Support Center", color: "text-red-600" },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed h-screen top-0 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`${isCollapsed ? "hidden" : "flex"} items-center space-x-2`}>
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">Vendor Panel</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* General Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? "bg-green-50 border-r-4 border-green-600 text-green-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-green-600" : item.color
                      } group-hover:scale-110 transition-transform`} 
                    />
                    <span className={`font-medium ${
                      isCollapsed ? "hidden" : "block"
                    } transition-all duration-200`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Property Management Section - Removed */}

        {/* Business Management Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
              Business Management
            </h3>
          )}
          {businessMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? "bg-emerald-50 border-r-4 border-emerald-600 text-emerald-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-emerald-600" : item.color
                      } group-hover:scale-110 transition-transform`} 
                    />
                    <span className={`font-medium ${
                      isCollapsed ? "hidden" : "block"
                    } transition-all duration-200`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Separator className="mx-4" />

      {/* User Profile & Logout */}
      <div className="p-4 space-y-3">
        {/* User Profile */}
        <div className={`flex items-center space-x-3 p-3 rounded-lg bg-gray-50 ${
          isCollapsed ? "justify-center" : ""
        }`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "V"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1) || "Vendor"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Property Vendor
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className={`w-full ${
            isCollapsed ? "px-2" : "px-4"
          } py-2 bg-red-600 hover:bg-red-700 transition-colors`}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
