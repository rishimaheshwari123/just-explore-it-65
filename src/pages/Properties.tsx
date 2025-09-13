import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, MapPin, Tag, Search, Filter, X, Navigation, SortAsc } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getAllPropertyAPI } from "@/service/operations/property";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { BUSINESS_CATEGORIES } from "@/constants/categories";

interface Property {
  _id: string;
  title: string;
  location: string;
  category: string;
  images: { url: string }[];
  description?: string;
  latitude?: string;
  longitude?: string;
  distance?: number;
}

const Properties = () => {
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get unique locations from properties
  const uniqueLocations = Array.from(new Set(properties.map(p => p.location).filter(Boolean)));

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast.success("Location detected for distance sorting");
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error("Failed to get your location for distance sorting");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  // Calculate distances for all properties
  const calculatePropertyDistances = (propertiesData: Property[]) => {
    if (!userLocation) return propertiesData;

    return propertiesData.map(property => {
      if (property.latitude && property.longitude) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(property.latitude),
          parseFloat(property.longitude)
        );
        return { ...property, distance };
      }
      return { ...property, distance: undefined };
    });
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllPropertyAPI();
      const propertiesData = response ?? [];
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  // Filter properties based on search term, category, and location
  const filterProperties = () => {
    let filtered = properties;

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = calculatePropertyDistances(filtered);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(property => property.category === selectedCategory);
    }

    // Filter by location (improved matching)
    if (selectedLocation !== "all") {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        selectedLocation.toLowerCase().includes(property.location.toLowerCase())
      );
    }

    // Sort by distance if enabled and user location is available
    if (sortByDistance && userLocation) {
      filtered = filtered.sort((a, b) => {
        // Properties with distance come first, then properties without distance
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        if (a.distance !== undefined && b.distance === undefined) {
          return -1;
        }
        if (a.distance === undefined && b.distance !== undefined) {
          return 1;
        }
        return 0;
      });
    }

    setFilteredProperties(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSortByDistance(false);
    // Clear URL parameters
    setSearchParams({});
  };

  useEffect(() => {
    fetchProperties();
    
    // Handle URL parameters
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (categoryParam && BUSINESS_CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    
    if (locationParam) {
      setSelectedLocation(locationParam);
    }
  }, [searchParams]);

  useEffect(() => {
    filterProperties();
  }, [searchTerm, selectedCategory, selectedLocation, properties, sortByDistance, userLocation]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <p className="text-lg text-gray-600">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      <TopBar />
      <Header />
      <div className="mx-auto max-w-7xl px-4">
        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
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

              {/* Distance Sort Button */}
              <Button
                variant={sortByDistance ? "default" : "outline"}
                onClick={() => {
                  if (!userLocation) {
                    getUserLocation();
                  } else {
                    setSortByDistance(!sortByDistance);
                  }
                }}
                className="flex items-center gap-2"
              >
                {userLocation ? (
                  <>
                    <SortAsc className="w-4 h-4" />
                    {sortByDistance ? "Distance: On" : "Sort by Distance"}
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Get Location
                  </>
                )}
              </Button>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedCategory !== "all" || selectedLocation !== "all" || sortByDistance) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSearchTerm("")} 
                    />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedCategory("all")} 
                    />
                  </Badge>
                )}
                {selectedLocation !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Location: {selectedLocation}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedLocation("all")} 
                    />
                  </Badge>
                )}
                {sortByDistance && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Sorted by Distance
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSortByDistance(false)} 
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <Home className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  No properties available yet
                </h3>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <Card
                key={property._id}
                className="cursor-pointer overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                {property.images && property.images.length > 0 && (
                  <div className="relative aspect-video">
                    <img
                      src={property.images[0]?.url || "/placeholder.svg"}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold">
                    {property.title}
                  </CardTitle>
                  <Badge className="flex w-fit items-center space-x-1 bg-blue-100 text-blue-800">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span>{property.category}</span>
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    {property.distance !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {property.distance} km away
                      </Badge>
                    )}
                  </div>
                  {property.description && (
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {property.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Properties;
