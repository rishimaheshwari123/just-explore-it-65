import React, { useState, useEffect } from "react";
import BusinessCard from "./BusinessCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  TrendingUp,
  Filter,
  Search,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Business {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  subCategory?: string;
  businessType: string;
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    email?: string;
    website?: string;
  };
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  area: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
  pricing: Array<{
    serviceName: string;
    price: number;
    unit: string;
    description?: string;
  }>;
  services: Array<{
    name: string;
    description?: string;
    price?: number;
  }>;
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  verification: {
    isVerified: boolean;
    trustScore: number;
  };
  premiumFeatures: {
    featuredListing: boolean;
    prioritySupport: boolean;
    analyticsAccess: boolean;
    customBranding: boolean;
  };
  isPremium: boolean;
  analytics: {
    totalViews: number;
    totalCalls: number;
    views: number;
    calls: number;
  };
  priceRange: string;
  features: string[];
  status: string;
}

const BusinessListing: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  const categories = [
    "Restaurants & Food",
    "Healthcare & Medical",
    "Education",
    "Beauty & Wellness",
    "Automotive",
    "Home Services",
    "Professional Services",
    "Retail & Shopping",
    "Entertainment",
    "Travel & Tourism",
    "Real Estate",
    "Technology",
    "Finance & Banking",
    "Sports & Fitness",
    "Pet Services",
  ];

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://just-explore-it-65.onrender.com/api/v1/property/businesses?limit=50"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }
      const data = await response.json();
      setBusinesses(data.businesses || []);
      setFilteredBusinesses(data.businesses || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast({
        title: "Error",
        description: "Failed to load businesses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    let filtered = [...businesses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (business) =>
          business.businessName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (business) => business.category === selectedCategory
      );
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (business) => business.area === selectedLocation
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter(
        (business) => business.priceRange === priceFilter
      );
    }

    // Sort businesses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.ratings.average - a.ratings.average;
        case "reviews":
          return b.ratings.totalReviews - a.ratings.totalReviews;
        case "name":
          return a.businessName.localeCompare(b.businessName);
        case "newest":
          return new Date(b._id).getTime() - new Date(a._id).getTime();
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
  }, [
    businesses,
    searchTerm,
    selectedCategory,
    selectedLocation,
    sortBy,
    priceFilter,
  ]);

  const uniqueLocations = [
    ...new Set(businesses.map((business) => business.area)),
  ];
  const priceRanges = ["₹", "₹₹", "₹₹₹", "₹₹₹₹"];

  return (
    <section className="py-5 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Business Directory
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover top-rated businesses in your area. Verified listings with
            genuine reviews and instant contact options.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBusinesses.length} of {businesses.length}{" "}
            businesses
          </p>
        </div>

        {/* Business Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No businesses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessListing;
