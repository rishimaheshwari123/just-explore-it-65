import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, BarChart3, Users, Plus, FileText, LogOut, Building2, MessageSquare } from "lucide-react";
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
    { to: "/", icon: Home, label: "Back To Home", color: "text-blue-600" },
    { to: "/admin/dashboard", icon: BarChart3, label: "Dashboard", color: "text-green-600" },
    { to: "/admin/vendors", icon: Users, label: "Manage Vendors", color: "text-purple-600" },
    { to: "/admin/businesses", icon: Building2, label: "Manage Businesses", color: "text-cyan-600" },
    { to: "/admin/support", icon: MessageSquare, label: "Support Center", color: "text-red-600" },
    { to: "/admin/add-blog", icon: Plus, label: "Add Blog", color: "text-orange-600" },
    { to: "/admin/get-blog", icon: FileText, label: "Get Blog", color: "text-indigo-600" },
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
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
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-blue-600" : item.color
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
      </nav>

      <Separator className="mx-4" />

      {/* User Profile & Logout */}
      <div className="p-4 space-y-3">
        {/* User Profile */}
        <div className={`flex items-center space-x-3 p-3 rounded-lg bg-gray-50 ${
          isCollapsed ? "justify-center" : ""
        }`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1) || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Administrator
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
