import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
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
            <p className="text-primary-foreground/80 mb-4">
              Your trusted local business directory. Find the best businesses near you with verified reviews and ratings.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Contact</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Business Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Restaurants</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Hotels</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Healthcare</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Education</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Shopping</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-primary-foreground/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-primary-foreground/80">info@businessgurujee.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-primary-foreground/80">Bhopal, Madhya Pradesh</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Subscribe to Newsletter</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 Business Gurujee. All rights reserved. | Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;