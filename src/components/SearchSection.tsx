import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";

const SearchSection = () => {
  return (
    <section className="bg-gradient-to-br from-muted to-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Search across thousand of businesses
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8 bg-background p-6 rounded-xl shadow-lg border border-border">
            {/* Location Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                placeholder="Bhopal, ( M.P )"
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Search Input */}
            <div className="flex-2 relative">
              <Input
                placeholder="Search Here"
                className="h-12 text-base pr-12"
              />
              <Button
                variant="hero"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Select */}
            <div className="flex-1">
              <Select>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="restaurants">Restaurants</SelectItem>
                  <SelectItem value="hotels">Hotels</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;