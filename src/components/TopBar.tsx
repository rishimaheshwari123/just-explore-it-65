import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm md:text-base">
        {/* Left Content */}
        <div className="flex items-center space-x-2 text-center md:text-left">
          <Megaphone className="w-5 h-5 shrink-0" />
          <span className="font-medium">
            For listing your products, please register here
          </span>
        </div>

        {/* Right Button */}
        <Link
          to="/vendor/register"
          className="bg-white text-indigo-600 font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-indigo-100 transition w-full md:w-auto text-center"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
}
