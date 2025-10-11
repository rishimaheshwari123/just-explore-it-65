import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

import { MapPin, Search, Filter, Star, Clock, DollarSign } from "lucide-react";
// BUSINESS_CATEGORIES and Select components are no longer needed, so their imports are removed
// import { BUSINESS_CATEGORIES } from "@/constants/categories";
import { useState, useEffect, useRef } from "react";

// Add type declarations for Google Maps API to avoid TypeScript errors
declare global {
  interface Window {
    google: any; // Using 'any' for simplicity
  }
}

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
}

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // State for category is removed
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
      // IMPORTANT: Replace this placeholder with your actual key, loaded from a secure environment variable.
      const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
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

    if (
      !query.trim() ||
      !isGoogleMapsLoaded ||
      !window.google?.maps?.places?.AutocompleteService
    ) {
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
      (predictions: any, status: any) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          const suggestions = predictions.map((prediction: any) => ({
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
    // Removed: if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
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

  // State and filtering logic for categories is removed
  // const [categorySearch, setCategorySearch] = useState("");
  // const allOptions = ["All Categories", ...BUSINESS_CATEGORIES];
  // const filteredCategories = allOptions.filter((cat) =>
  //   cat.toLowerCase().includes(categorySearch.toLowerCase())
  // );

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 py-4">
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

      <div className="relative w-11/12 mx-auto px- z-10">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-slate-900">
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
            // Changed to a 3-column layout on large screens: Search | Location | Button
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_2fr_1fr] items-stretch gap-3 w-full"
          >
            {/* Search Input - Flex-1 removed, relying on grid column sizing */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search businesses, services, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 bg-gray-50 border-gray-200 text-sm rounded-xl focus-visible:ring-indigo-500"
              />
            </div>

            {/* Location Input - Flex-1 removed, relying on grid column sizing */}
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                ref={locationInputRef}
                placeholder="Enter your city or area"
                value={locationInput}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={() => locationInput && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-12 pl-10 bg-gray-50 border-gray-200 text-sm rounded-xl focus-visible:ring-indigo-500"
              />
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto top-full mt-2">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-200"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      <div className="text-sm font-medium text-slate-800">
                        {suggestion.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Select Section: REMOVED */}
            {/* The previous <div> for category select is completely gone. */}

            {/* Search Button */}
            <Button
              type="submit"
              className="h-12 px-4 font-semibold text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center whitespace-nowrap"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>

            {/* Filters Button (Commented out, as in the original code) */}
            {/* ... Popover code ... */}
          </form>

          {/* Buttons & Filters */}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
