import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

import { MapPin, Search, Filter, Star, Clock, DollarSign } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/constants/categories";
import { useState, useEffect, useRef } from "react";

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
}

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [rating, setRating] = useState("all");
  const [distance, setDistance] = useState("all");
  const [openNow, setOpenNow] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASz6Gqa5Oa3WialPx7Z6ebZTj02Liw-Gk&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  const handleLocationSearch = (query: string) => {
    setLocationInput(query);

    if (!query.trim() || !isGoogleMapsLoaded) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: query,
        types: ["(cities)"],
        componentRestrictions: { country: "in" },
      },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          const suggestions = predictions.map((prediction) => ({
            name: prediction.description,
            lat: 0,
            lng: 0,
            placeId: prediction.place_id,
          }));
          setLocationSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setLocationInput(suggestion.name);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    if (locationInput) params.set("location", locationInput);
    if (priceRange && priceRange !== "all")
      params.set("priceRange", priceRange);
    if (rating && rating !== "all") params.set("rating", rating);
    if (distance && distance !== "all") params.set("distance", distance);
    if (openNow) params.set("openNow", "true");

    window.location.href = `/business-listing?${params.toString()}`;
  };

  const clearFilters = () => {
    setPriceRange("all");
    setRating("all");
    setDistance("all");
    setOpenNow(false);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern
              id="pattern-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">
            Discover a World of Local Businesses
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find everything from professional services to your favorite local
            shops with ease.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-2xl border border-gray-200">
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row gap-4 w-full"
          >
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search businesses, services, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 pl-12 bg-gray-50 border-gray-200 text-base rounded-2xl focus-visible:ring-indigo-500"
              />
            </div>

            {/* Location Input with Autocomplete */}
            <div className="flex-1 relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                ref={locationInputRef}
                placeholder="Enter your city or area"
                value={locationInput}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={() => locationInput && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-14 pl-12 bg-gray-50 border-gray-200 text-base rounded-2xl focus-visible:ring-indigo-500"
              />
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto top-full mt-2">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-200"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      <div className="font-medium text-slate-800">
                        {suggestion.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Select */}
            <div className="flex-1">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-14 bg-gray-50 border-gray-200 text-base rounded-2xl focus-visible:ring-indigo-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {BUSINESS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>

          {/* Buttons & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button
              type="submit"
              onClick={handleSearch}
              className="flex-1 h-14 font-bold text-base rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Now
            </Button>

            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-14 bg-white border-gray-300 text-slate-700 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-slate-800">
                      Filter Options
                    </h4>
                    <p className="text-sm text-slate-500">
                      Refine your search.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        Price Range
                      </label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="h-10 bg-gray-50 rounded-lg">
                          <SelectValue placeholder="Any Price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Price</SelectItem>
                          <SelectItem value="budget">
                            Budget (₹0-₹500)
                          </SelectItem>
                          <SelectItem value="mid">
                            Mid Range (₹500-₹2000)
                          </SelectItem>
                          <SelectItem value="premium">
                            Premium (₹2000+)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        Minimum Rating
                      </label>
                      <Select value={rating} onValueChange={setRating}>
                        <SelectTrigger className="h-10 bg-gray-50 rounded-lg">
                          <SelectValue placeholder="Any Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Rating</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="2">2+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Distance Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                        Distance
                      </label>
                      <Select value={distance} onValueChange={setDistance}>
                        <SelectTrigger className="h-10 bg-gray-50 rounded-lg">
                          <SelectValue placeholder="Any Distance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Distance</SelectItem>
                          <SelectItem value="1">Within 1 km</SelectItem>
                          <SelectItem value="5">Within 5 km</SelectItem>
                          <SelectItem value="10">Within 10 km</SelectItem>
                          <SelectItem value="25">Within 25 km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Open Now Checkbox */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="openNow"
                        checked={openNow}
                        onCheckedChange={(checked) => setOpenNow(checked)}
                        className="w-5 h-5 border-gray-300 rounded focus-visible:ring-indigo-500"
                      />
                      <label
                        htmlFor="openNow"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 flex items-center"
                      >
                        <Clock className="h-4 w-4 mr-1 text-orange-600" />
                        Open Now
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearFilters}
                      className="text-gray-500 hover:text-indigo-600"
                    >
                      Clear All
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
