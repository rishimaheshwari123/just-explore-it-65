import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
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

      const script = document.createElement('script');
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
        types: ['(cities)'],
        componentRestrictions: { country: 'in' }
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const suggestions = predictions.map(prediction => ({
            name: prediction.description,
            lat: 0,
            lng: 0,
            placeId: prediction.place_id
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
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (locationInput) params.set('location', locationInput);
    if (priceRange && priceRange !== 'all') params.set('priceRange', priceRange);
    if (rating && rating !== 'all') params.set('rating', rating);
    if (distance && distance !== 'all') params.set('distance', distance);
    if (openNow) params.set('openNow', 'true');
    
    window.location.href = `/business-listing?${params.toString()}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Discover Amazing
            <span className="block">Businesses Near You</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Search across thousands of verified businesses and find exactly what you're looking for
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
          {/* Search Input */}
          <div className="flex-[2] relative group">
            <Input
              placeholder="Search businesses, services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 text-base pr-14 bg-white/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-300"
            />
            <Button
              type="submit"
              variant="hero"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Location Input with Autocomplete */}
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <MapPin className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            <Input
              ref={locationInputRef}
              placeholder="Enter city name"
              value={locationInput}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() => locationInput && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-12 pr-20 h-14 text-base bg-white/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-300"
            />
            <Button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocationInput('Near Me');
                      setShowSuggestions(false);
                    },
                    (error) => {
                      console.error('Error getting location:', error);
                      alert('Unable to get your location. Please enter manually.');
                    }
                  );
                } else {
                  alert('Geolocation is not supported by this browser.');
                }
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
              title="Use current location"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto top-full mt-1">
                {locationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Select */}
          <div className="flex-1 group">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-14 text-base bg-white/50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-300">
                <SelectValue placeholder="Select Category" />
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
          
          {/* Desktop Search Button */}
          <div className="hidden md:block">
            <Button
              type="submit"
              variant="hero"
              className="h-14 px-10 text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              <Search className="h-5 w-5 mr-3" />
              Search Now
            </Button>
          </div>
          
          {/* Search Button for Mobile */}
          <div className="md:hidden">
            <Button
              type="submit"
              variant="hero"
              className="w-full h-14 text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              <Search className="h-5 w-5 mr-3" />
              Search Now
            </Button>
          </div>
        </form>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/70 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 text-purple-700 hover:bg-purple-50 rounded-xl px-6 py-2 transition-all duration-300"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-6 bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/30 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-10 bg-white/80 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="budget">Budget (₹0-₹500)</SelectItem>
                    <SelectItem value="mid">Mid Range (₹500-₹2000)</SelectItem>
                    <SelectItem value="premium">Premium (₹2000+)</SelectItem>
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
                  <SelectTrigger className="h-10 bg-white/80 border border-gray-300 rounded-lg">
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
                  <SelectTrigger className="h-10 bg-white/80 border border-gray-300 rounded-lg">
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

              {/* Open Now Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-orange-600" />
                  Availability
                </label>
                <Button
                  type="button"
                  variant={openNow ? "default" : "outline"}
                  onClick={() => setOpenNow(!openNow)}
                  className={`w-full h-10 rounded-lg transition-all duration-300 ${
                    openNow 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-white/80 border border-gray-300 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Open Now
                </Button>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPriceRange('all');
                  setRating('all');
                  setDistance('all');
                  setOpenNow(false);
                }}
                className="text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg px-4 py-2"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchSection;
