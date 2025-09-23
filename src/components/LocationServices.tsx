import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Star,
  Car,
  Bike,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface Business {
  _id: string;
  businessName: string;
  category: string;
  ratings: {
    average: number;
    totalReviews: number;
  };
  distance?: number;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
  };
  contactInfo: {
    primaryPhone: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const LocationServices: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [loading, setLoading] = useState(false);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);

  const fetchNearbyBusinesses = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        latitude: userLocation.lat.toString(),
        longitude: userLocation.lng.toString(),
        distance: "5", // 5km radius
        limit: "6",
        sortBy: "distance",
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(
        `https://just-explore-it-65.onrender.com/api/v1/property/businesses?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setNearbyBusinesses(data.businesses || []);
      } else {
        setNearbyBusinesses([]);
      }
    } catch (error) {
      console.error("Error fetching nearby businesses:", error);
      toast.error("Failed to load nearby businesses");
      setNearbyBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyBusinesses();
    }
  }, [userLocation, selectedCategory, sortBy]);

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

  const formatDistance = (distance?: number) => {
    if (!distance) return "N/A";
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const categories = [
    "all",
    "Healthcare",
    "Electronics",
    "Food",
    "Automotive",
    "Fitness",
    "Education",
  ];

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          // Silently handle geolocation error and set default location
          setUserLocation({ lat: 28.4595, lng: 77.0266 });
          setLoading(false);
        }
      );
    } else {
      // Set default location if geolocation is not supported
      setUserLocation({ lat: 28.4595, lng: 77.0266 });
      setLoading(false);
    }
  };

  // Fetch nearby businesses from API
  useEffect(() => {
    if (userLocation) {
      fetchNearbyBusinesses();
    }
  }, [userLocation, selectedCategory]);

  const filteredBusinesses = nearbyBusinesses.filter(
    (business) =>
      selectedCategory === "all" || business.category === selectedCategory
  );

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (sortBy === "distance") {
      return (a.distance || 0) - (b.distance || 0);
    } else if (sortBy === "rating") {
      return b.ratings.average - a.ratings.average;
    }
    return 0;
  });

  const openInMaps = (business: Business) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${business.coordinates.latitude},${business.coordinates.longitude}`;
    window.open(url, "_blank");
  };

  const viewAllOnMap = () => {
    if (nearbyBusinesses.length === 0) {
      toast.error("No businesses to show on map");
      return;
    }

    // Create a Google Maps URL with multiple destinations
    const destinations = nearbyBusinesses
      .map(
        (business) =>
          `${business.coordinates.latitude},${business.coordinates.longitude}`
      )
      .join("|");

    // If user location is available, use it as starting point
    const origin = userLocation
      ? `${userLocation.latitude},${userLocation.longitude}`
      : "";

    const baseUrl = "https://www.google.com/maps/dir/";
    const url = origin
      ? `${baseUrl}${origin}/${destinations.split("|")[0]}` // Show route to first business
      : `https://www.google.com/maps/search/?api=1&query=${
          destinations.split("|")[0]
        }`; // Just show first business location

    window.open(url, "_blank");
    toast.success("Opening map view with all businesses");
  };

  return (
    <section className="py-2 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Nearby Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Discover local businesses and services around you with real-time
            location data
          </p>

          {/* Location Status */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              {userLocation ? "Location detected" : "Getting your location..."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={loading}
            >
              <Navigation className="h-4 w-4 mr-1" />
              {loading ? "Locating..." : "Refresh Location"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading nearby businesses...</p>
            </div>
          ) : sortedBusinesses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No businesses found in your area</p>
            </div>
          ) : (
            sortedBusinesses.map((business) => (
              <div
                key={business._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Business Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      business.images?.[0]?.url || "/api/placeholder/300/200"
                    }
                    alt={business.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={
                        isBusinessOpen(business) ? "default" : "secondary"
                      }
                      className="bg-white/90 text-gray-800"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {isBusinessOpen(business) ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="outline"
                      className="bg-white/90 text-gray-800"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {business.distance
                        ? formatDistance(business.distance)
                        : "N/A"}
                    </Badge>
                  </div>
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {business.businessName}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {business.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm ml-1">
                        {business.ratings.average.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({business.ratings.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {business.address.street}, {business.address.area},{" "}
                    {business.address.city}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => openInMaps(business)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `tel:${business.contactInfo.primaryPhone}`,
                          "_self"
                        )
                      }
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Travel Options */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Car className="h-3 w-3" />
                      <span>5 min</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Bike className="h-3 w-3" />
                      <span>12 min</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>18 min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map Integration Note */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-7xl mx-auto">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">
              Interactive Map View
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Click on "Directions" to open Google Maps with turn-by-turn
              navigation to your selected business.
            </p>
            <Button
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={viewAllOnMap}
              disabled={nearbyBusinesses.length === 0}
            >
              <Navigation className="h-4 w-4 mr-2" />
              View All on Map
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationServices;
