import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineUser } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/authSlice";
import { FcBullish, FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";

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

  return (
    <div
      ref={sidebarRef}
      className={`fixed h-screen top-0 overflow-y-scroll z-50 ${
        isCollapsed ? "w-20" : "w-64"
      } bg-white transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        <div
          className={`${
            isCollapsed ? "hidden" : "block"
          } text-gray-600 font-bold text-xl`}
        >
          <img src="/logo.png" alt=" Logo" className="h-12 w-auto" />
        </div>
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className="bg-transparent border-none w-8 h-8 flex justify-center items-center cursor-pointer text-gray-600"
        >
          {isCollapsed ? <CiMenuFries size={22} /> : <RxCross1 size={22} />}
        </button>
      </div>

      {/* Navigation links */}
      <ul className="text-gray-600 list-none flex flex-col gap-2 p-4 mb-14">
        {[
          { to: "/", icon: <FaHome />, label: "Back To Home" },
          { to: "/admin/dashboard", icon: <FcBullish />, label: "Dashboard" },

          {
            to: "/admin/vendors",
            icon: <FcPlus />,
            label: "Manage Vendors",
          },
          {
            to: "/admin/add-blog",
            icon: <FcPlus />,
            label: "Add Blog",
          },
          {
            to: "/admin/get-blog",
            icon: <FcPlus />,
            label: "Get Blog",
          },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleToggle}
            className={({ isActive }) =>
              `text-gray-600 py-4 flex items-center hover:border-r-4 hover:border-black ${
                isActive ? "border-r-4 border-black" : ""
              }`
            }
          >
            <div className="text-2xl">{item.icon}</div>
            <span
              className={`ml-4 text-xl ${isCollapsed ? "hidden" : "block"}`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </ul>

      {/* User and logout section */}
      <div className="absolute left-2 right-2 bottom-0 mt-10">
        <div
          className={`flex items-center justify-center w-full ${
            isCollapsed
              ? "w-11 h-11 rounded-full bg-black "
              : "bg-black py-2 px-4 rounded-lg"
          }`}
        >
          <div
            className={`cursor-pointer flex items-center justify-center text-white ${
              isCollapsed ? "w-10 h-10 rounded-full" : ""
            }`}
          >
            {isCollapsed ? (
              <AiOutlineUser size={20} />
            ) : (
              <span className="text-xl">
                {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`bg-red-600 text-white text-xl flex items-center justify-center mt-2 ${
            isCollapsed
              ? "w-12 h-12 rounded-full"
              : "py-2 px-4 w-full rounded-lg"
          }`}
        >
          {isCollapsed ? (
            <MdLogout className="cursor-pointer" />
          ) : (
            <span className="flex gap-1 cursor-pointer  items-center text-xl">
              <MdLogout /> Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
