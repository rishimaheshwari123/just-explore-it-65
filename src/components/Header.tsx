import React, { useState } from "react";
import {
  Menu,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Twitch,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-background border-b border-border shadow-sm font-sans relative z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              BG
            </div>
            <span className="text-xl font-semibold text-gray-800">
              Business Gurujee
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Advertise
            </a>
            <div className="flex items-center space-x-2">
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Free Business Listing
              </a>
              <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Hot
              </span>
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Call Number */}
            <div className="hidden md:flex items-center space-x-2 text-purple-600 font-semibold">
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </div>

            {/* Hamburger menu - Mobile only */}
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-purple-600 p-2 rounded-full transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop Login Button */}
            <Link
              to={"/login"}
              className="hidden md:block px-4 py-2 rounded-full text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white transition-colors font-semibold"
            >
              Login / Signup
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold text-gray-800">Menu</span>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-purple-600 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          <a
            href="#"
            className="text-gray-800 hover:text-purple-600 transition-colors font-medium text-lg"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-800 hover:text-purple-600 transition-colors font-medium text-lg"
          >
            Advertise
          </a>
          <a
            href="#"
            className="text-gray-800 hover:text-purple-600 transition-colors font-medium text-lg"
          >
            Free Business Listing
          </a>

          {/* Call Number - Mobile */}
          <div className="flex items-center space-x-2 text-purple-600 font-semibold mt-4">
            <Phone className="h-5 w-5" />
            <span>+91 98765 43210</span>
          </div>

          <button className="mt-6 w-full px-4 py-2 rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-colors font-semibold">
            Login / Signup
          </button>

          {/* Social media icons */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Connect With Us
            </h3>
            <div className="flex justify-center space-x-4 mt-5">
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Twitch className="h-6 w-6" />
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        />
      )}
    </header>
  );
};

export default Header;
