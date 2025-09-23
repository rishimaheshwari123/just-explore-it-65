import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Verified,
  Eye,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  category: string;
  subCategory?: string;
  description: string;
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
  coordinates: {
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  ratings: {
    average: number;
    totalReviews: number;
  };
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
  features: string[];
  status: string; // 'active', 'inactive', 'pending', 'suspended'
}

const FeaturedProperties = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://just-explore-it-65.onrender.com/api/v1/property/getAll?category=Real Estate&limit=8"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Properties API response:", data);

      if (data.success && Array.isArray(data.businesses)) {
        // Filter only Real Estate businesses and take first 8
        const realEstateBusinesses = data.businesses.filter(
          (business) => business.category === "Real Estate"
        );
        setBusinesses(realEstateBusinesses.slice(0, 8));
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        const realEstateBusinesses = data.filter(
          (business) => business.category === "Real Estate"
        );
        setBusinesses(realEstateBusinesses.slice(0, 8));
      } else {
        console.warn("Invalid API response format:", data);
        setBusinesses([]);
      }
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      setBusinesses([]);
      toast.error("Failed to load featured properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : index < rating
            ? "text-yellow-400 fill-yellow-400/50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCall = async (businessId: string, phoneNumber: string) => {
    try {
      // Track call analytics
      await fetch(`/api/v1/property/${businessId}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Open phone dialer
      window.open(`tel:${phoneNumber}`);
      toast.success("Opening phone dialer...");
    } catch (error) {
      console.error("Error tracking call:", error);
      window.open(`tel:${phoneNumber}`);
    }
  };

  const handleGetDirections = async (
    businessId: string,
    coordinates: { latitude: number; longitude: number }
  ) => {
    try {
      // Track directions analytics
      await fetch(`/api/v1/property/${businessId}/directions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Open Google Maps with coordinates for precise navigation
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
      window.open(url, "_blank");
      toast.success("Opening directions in Google Maps...");
    } catch (error) {
      console.error("Error tracking directions:", error);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
      window.open(url, "_blank");
    }
  };

  const formatPriceRange = (priceRange?: string) => {
    if (!priceRange) return "Price on request";
    return priceRange;
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover premium properties with verified details and instant
              contact options
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="h-48 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover premium properties with verified details and instant
            contact options
          </p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No featured properties available at the moment.
            </p>
            <Button
              onClick={() => navigate("/add-property")}
              className="bg-primary hover:bg-primary/90"
            >
              List Your Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.map((business) => {
              const mainImage =
                business.images?.[0]?.url || "/placeholder-property.jpg";
              const fullAddress = `${business.address.street}, ${business.address.area}, ${business.address.city}`;

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
                          business.status === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        <Home className="h-3 w-3 mr-1" />
                        {business.status === "active"
                          ? "Available"
                          : "Not Available"}
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
                    {/* Business Title */}
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

                    {/* Business Type */}
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {business.businessType}
                      </Badge>
                    </div>

                    {/* Price Range */}
                    <div className="mb-3">
                      <span className="text-lg font-bold text-green-600">
                        {formatPriceRange(business.priceRange)}
                      </span>
                    </div>

                    {/* Features */}
                    {business.features?.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {business.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {business.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{business.features.length - 2} more
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
                          handleCall(
                            business._id,
                            business.contactInfo.primaryPhone
                          )
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
                      onClick={() => navigate(`/property/${business._id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {businesses.length > 0 && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/properties")}
              className="bg-primary hover:bg-primary/90"
            >
              View All Properties
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
