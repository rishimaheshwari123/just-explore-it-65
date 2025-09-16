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
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                BG
              </div>
              <span className="text-xl font-semibold">Business Gurujee</span>
            </div>
            <p className="text-white mb-4">
              Your trusted local business directory. Find the best businesses
              near you with verified reviews and ratings.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/business-listing?category=Restaurants & Food"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Travel & Tourism"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Healthcare & Medical"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Education"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link
                  to="/business-listing?category=Retail & Shopping"
                  className="text-white hover:text-secondary transition-colors"
                >
                  Shopping
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-white">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-white">info@businessgurujee.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-white">Bhopal, Madhya Pradesh</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Subscribe to Newsletter</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white">
            © 2024 Business Gurujee. All rights reserved. | Made with ❤️ in
            India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
