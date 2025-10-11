import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // 'bg-primary' को 'bg-gray-800' में बदल दिया गया है ग्रे थीम के लिए
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 object-contain cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
            <p className="text-gray-300 mb-4">
              Your trusted local business directory. Find the best businesses
              near you with verified reviews and ratings.
            </p>
            {/* Social Media Icons with Background */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/14K2Axjtp6W/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  // आइकॉन में background, padding और rounded-full जोड़ा गया है
                  className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>

              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  // आइकॉन में background, padding और rounded-full जोड़ा गया है
                  className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://www.instagram.com/drupesh92?igsh=ZGZqa2pvaGZ4bTlw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  // आइकॉन में background, padding और rounded-full जोड़ा गया है
                  className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  // आइकॉन में background, padding और rounded-full जोड़ा गया है
                  className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Popular Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/business-listing?category=Restaurants & Food"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Travel & Tourism"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Healthcare & Medical"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Education"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Retail & Shopping"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shopping
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Get In Touch
            </h3>
            <div className="space-y-3 mb-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-white" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-white" />
                <span className="text-gray-300">info@businessgurujee.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-gray-300">Bhopal, Madhya Pradesh</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-white">
                Subscribe to Newsletter
              </h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  // Input के लिए ग्रे-थीम से मेल खाने वाली स्टाइलिंग
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-gray-500"
                />
                {/* Button variant को 'default' या 'primary' में बदला जा सकता है, या 'secondary' रखा जा सकता है। 
                मैंने इसे 'default' में बदल दिया है ताकि यह ग्रे के साथ अच्छा दिखे। */}
                <Button variant="default" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Business Gurujee. All rights reserved. | Made with ❤️ in
            India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
