import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Twitch,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Businesses", href: "/business-listing" },
  { label: "Free Business Listing", href: "/vendor/register", hot: true },
  { label: "Articles", href: "/blogs" },
];

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get current location using geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyASz6Gqa5Oa3WialPx7Z6ebZTj02Liw-Gk`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            // Extract city name from address components
            const addressComponents = data.results[0].address_components;
            const city = addressComponents.find((component: any) => 
              component.types.includes('locality') || 
              component.types.includes('administrative_area_level_2')
            );
            
            if (city) {
              setCurrentLocation(city.long_name);
              toast.success(`Location detected: ${city.long_name}`);
            } else {
              setCurrentLocation("Location detected");
              toast.success("Location detected successfully");
            }
          }
        } catch (error) {
          // Silently handle geocoding error
          setCurrentLocation("Location detected");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied by user.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  // Auto-detect location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <header className="bg-background border-b border-border shadow-sm font-sans relative z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-0 py-3">
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
            {menuLinks.map((link) => (
              <div key={link.label} className="flex items-center space-x-2">
                <a
                  href={link.href}
                  className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                >
                  {link.label}
                </a>
                {link.hot && (
                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Hot
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Current Location */}
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              {isLoadingLocation ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Detecting location...</span>
                </>
              ) : currentLocation ? (
                <>
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{currentLocation}</span>
                  <button
                    onClick={getCurrentLocation}
                    className="text-xs text-purple-600 hover:underline ml-1"
                  >
                    Update
                  </button>
                </>
              ) : (
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-1 text-sm text-purple-600 hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Detect Location</span>
                </button>
              )}
            </div>

            {/* Call Number */}
            <div className="hidden lg:flex items-center space-x-2 text-purple-600 font-semibold">
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
          {menuLinks.map((link) => (
            <div key={link.label} className="flex items-center space-x-2">
              <a
                href={link.href}
                className="text-gray-800 hover:text-purple-600 transition-colors font-medium text-lg"
              >
                {link.label}
              </a>
              {link.hot && (
                <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Hot
                </span>
              )}
            </div>
          ))}

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
