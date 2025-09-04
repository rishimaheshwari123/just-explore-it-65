import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BG
            </div>
            <span className="text-xl font-semibold text-foreground">Business Gurujee</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Advertise
            </a>
            <div className="flex items-center space-x-2">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Free Business Listing
              </a>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-bold">
                Hot
              </span>
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="text-secondary font-semibold border-secondary hover:bg-secondary hover:text-secondary-foreground">
              Login / Signup
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;