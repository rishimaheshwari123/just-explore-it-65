import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Verified,
  Eye,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const FeaturedBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const navigate = useNavigate();

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

  const fetchFeaturedBusinesses = async (page = 1, loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/property/featured-businesses?page=${page}&limit=12`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.businesses)) {
        if (loadMore) {
          setBusinesses((prev) => [...prev, ...data.businesses]);
        } else {
          setBusinesses(data.businesses);
        }
        setTotalBusinesses(data.total || 0);
        setHasMore(
          data.businesses.length === 12 && page * 12 < (data.total || 0)
        );
      } else {
        if (!loadMore) {
          setBusinesses([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching featured businesses:", error);
      if (!loadMore) {
        setBusinesses([]);
      }
      toast.error("Failed to load businesses");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreBusinesses = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchFeaturedBusinesses(nextPage, true);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (business) => business.category === selectedCategory
      );
    }

    // Filter by location (city or area)
    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (business) =>
          business.address.city === selectedLocation ||
          business.area === selectedLocation
      );
    }

    // Search by location
    if (searchLocation.trim()) {
      const searchTerm = searchLocation.toLowerCase();
      filtered = filtered.filter(
        (business) =>
          business.address.city.toLowerCase().includes(searchTerm) ||
          business.address.area.toLowerCase().includes(searchTerm) ||
          business.address.state.toLowerCase().includes(searchTerm) ||
          business.area.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredBusinesses(filtered);
  };

  const getUniqueLocations = () => {
    const locations = new Set<string>();
    businesses.forEach((business) => {
      locations.add(business.address.city);
      if (business.area) locations.add(business.area);
    });
    return Array.from(locations).sort();
  };

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [selectedCategory, selectedLocation, searchLocation, businesses]);

  const isBusinessOpen = (businessHours: Business["businessHours"]) => {
    const now = new Date();
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = businessHours[currentDay];
    if (!todayHours || todayHours.isClosed) return false;

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  const handleCall = async (businessId: string, phone: string) => {
    try {
      // Track call interaction
      await fetch(
        `http://localhost:8000/api/v1/property/business/${businessId}/track-interaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "call" }),
        }
      );

      // Open phone dialer
      window.open(`tel:${phone}`, "_self");
    } catch (error) {
      console.error("Error tracking call:", error);
      window.open(`tel:${phone}`, "_self");
    }
  };

  const handleGetDirections = async (
    businessId: string,
    coordinates: { latitude: number; longitude: number }
  ) => {
    try {
      // Track direction interaction
      await fetch(
        `http://localhost:8000/api/v1/property/business/${businessId}/track-interaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "direction" }),
        }
      );

      // Open Google Maps with coordinates for precise navigation
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
      window.open(url, "_blank");
      toast.success("Opening directions in Google Maps...");
    } catch (error) {
      console.error("Error tracking direction:", error);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
      window.open(url, "_blank");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : i < rating
            ? "text-yellow-400 fill-yellow-400/50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Businesses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Loading businesses...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated businesses in your area with verified reviews and
            instant contact options
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filter Businesses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {getUniqueLocations().map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Search Location
              </label>
              <Input
                placeholder="Search by city, area..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredBusinesses.length} of {businesses.length}{" "}
            businesses
          </div>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No featured businesses available at the moment.
            </p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No businesses found matching your filters. Try adjusting your
              search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => {
              const isOpen = isBusinessOpen(business.businessHours);
              const mainImage = business.images?.[0]?.url || "/placeholder.svg";
              const minPrice =
                business.pricing?.length > 0
                  ? Math.min(...business.pricing.map((p) => p.price))
                  : null;

              return (
                <Card
                  key={business._id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={mainImage}
                      alt={business.businessName}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {business.category}
                      </Badge>
                      {business.verification.isVerified && (
                        <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                          <Verified className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`text-xs ${
                          isOpen
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>

                    {/* Views Counter */}
                    <div className="absolute bottom-3 right-3">
                      <Badge className="bg-black/70 text-white text-xs flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {business.analytics.totalViews}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Business Name */}
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                      {business.businessName}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(business.ratings.average)}
                      </div>
                      <span className="text-sm font-medium">
                        {business.ratings.average.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({business.ratings.totalReviews} reviews)
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {business.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {business.address.area}, {business.address.city}
                      </span>
                    </div>

                    {/* Pricing */}
                    {minPrice && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-green-600">
                          Starting from ₹{minPrice}
                        </span>
                      </div>
                    )}

                    {/* Services */}
                    {business.services?.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {business.services
                            .slice(0, 2)
                            .map((service, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {service.name}
                              </Badge>
                            ))}
                          {business.services.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{business.services.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() =>
                          handleCall(business._id, business.contactInfo.phone)
                        }
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() =>
                          handleGetDirections(
                            business._id,
                            business.coordinates
                          )
                        }
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                    </div>

                    {/* View Details Button */}
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => navigate(`/business/${business._id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load More and View All Buttons */}
        {businesses.length > 0 && (
          <div className="text-center mt-12 space-y-4">
            {hasMore && (
              <Button
                size="lg"
                onClick={loadMoreBusinesses}
                disabled={loadingMore}
                variant="outline"
                className="mr-4"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading More...
                  </>
                ) : (
                  `Load More (${totalBusinesses - businesses.length} remaining)`
                )}
              </Button>
            )}
            <Button
              size="lg"
              onClick={() => navigate("/business-listing")}
              className="bg-primary hover:bg-primary/90"
            >
              View All Businesses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
