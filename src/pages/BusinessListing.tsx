import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Verified,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';

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
  ratings: {
    average: number;
    totalReviews: number;
  };
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
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  services: Array<{
    name: string;
    description: string;
  }>;
  priceRange: string;
  features: string[];
  status: string;
}

const BusinessListing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectedDistance, setSelectedDistance] = useState('10'); // km
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const categories = [
    'Restaurants',
    'Hotels',
    'Healthcare',
    'Education',
    'Automotive',
    'Beauty & Spa',
    'Shopping',
    'Services',
    'Entertainment',
    'Real Estate'
  ];

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad'
  ];

  useEffect(() => {
    fetchBusinesses();
  }, [searchTerm, selectedCategory, selectedLocation, sortBy, userLocation, selectedDistance, useCurrentLocation]);

  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast.success('Location detected successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enable location services.');
          setUseCurrentLocation(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setUseCurrentLocation(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation !== 'all' && !useCurrentLocation) params.append('city', selectedLocation);
      if (sortBy !== 'relevance') params.append('sortBy', sortBy);
      
      // Set a higher limit to show all businesses
      params.append('limit', '50');
      
      // Add location-based parameters
      if (useCurrentLocation && userLocation) {
        params.append('latitude', userLocation.latitude.toString());
        params.append('longitude', userLocation.longitude.toString());
        params.append('distance', selectedDistance);
        params.append('sortBy', 'distance');
      }
      
      console.log('API URL:', `http://localhost:8002/api/v1/property/businesses?${params.toString()}`);
      
      const response = await fetch(`http://localhost:8002/api/v1/property/businesses?${params.toString()}`);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setBusinesses(data.businesses || []);
      } else {
        console.error('Failed to fetch businesses:', data.message);
        // Show empty state instead of error for better UX
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedLocation !== 'all') params.append('location', selectedLocation);
    
    setSearchParams(params);
    fetchBusinesses();
  };

  const handleBusinessClick = (businessId: string) => {
    navigate(`/business/${businessId}`);
  };

  const handleCall = (phone: string, businessId: string) => {
    // Track call interaction
    fetch(`http://localhost:8002/api/v1/property/business/${businessId}/interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'call' })
    }).catch(console.error);
    
    window.open(`tel:${phone}`, '_self');
  };

  const isBusinessOpen = (businessHours: Business['businessHours']) => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = businessHours[currentDay];
    if (!todayHours || todayHours.isClosed) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : i < rating
            ? 'text-yellow-400 fill-yellow-400/50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const BusinessCard = ({ business }: { business: Business }) => {
    const isOpen = isBusinessOpen(business.businessHours);
    const mainImage = business.images?.find(img => img.isPrimary)?.url || business.images?.[0]?.url || '/placeholder-business.jpg';

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative">
          <img
            src={mainImage}
            alt={business.businessName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => handleBusinessClick(business._id)}
          />
          
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className="bg-primary text-primary-foreground text-xs">
              {business.category}
            </Badge>
            {business.verification.isVerified && (
              <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                <Verified className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {business.premiumFeatures.featuredListing && (
              <Badge className="bg-yellow-500 text-white text-xs">
                Featured
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <Badge 
              className={`text-xs ${
                isOpen 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>

          <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/70 text-white text-xs flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {business.analytics.totalViews}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <h3 
              className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors"
              onClick={() => handleBusinessClick(business._id)}
            >
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
              <span className="text-sm text-muted-foreground">
                ({business.ratings.totalReviews})
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">
                {business.address.area && `${business.address.area}, `}
                {business.address.city}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {business.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => handleCall(business.contactInfo.primaryPhone, business._id)}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => handleBusinessClick(business._id)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BusinessListItem = ({ business }: { business: Business }) => {
    const isOpen = isBusinessOpen(business.businessHours);
    const mainImage = business.images?.find(img => img.isPrimary)?.url || business.images?.[0]?.url || '/placeholder-business.jpg';

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img
              src={mainImage}
              alt={business.businessName}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBusinessClick(business._id)}
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 
                    className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleBusinessClick(business._id)}
                  >
                    {business.businessName}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-xs">{business.category}</Badge>
                    {business.verification.isVerified && (
                      <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                        <Verified className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Badge 
                  className={`text-xs ${
                    isOpen 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {isOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {renderStars(business.ratings.average)}
                </div>
                <span className="text-sm font-medium">
                  {business.ratings.average.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({business.ratings.totalReviews} reviews)
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {business.address.area && `${business.address.area}, `}
                  {business.address.city}, {business.address.state}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {business.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => handleCall(business.contactInfo.primaryPhone, business._id)}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBusinessClick(business._id)}
                >
                  View Details
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-black/10 text-black text-xs flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {business.analytics.totalViews}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Find Local Businesses</h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search for businesses, services, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 h-12">
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
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} className="h-12 px-8">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="views">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {businesses.length} businesses found
              </span>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Use Current Location</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useLocation"
                      checked={useCurrentLocation}
                      onChange={(e) => setUseCurrentLocation(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="useLocation" className="text-sm">
                      Find businesses near me
                    </label>
                  </div>
                </div>
                
                {useCurrentLocation && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance Range</label>
                    <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Within 1 km</SelectItem>
                        <SelectItem value="2">Within 2 km</SelectItem>
                        <SelectItem value="5">Within 5 km</SelectItem>
                        <SelectItem value="10">Within 10 km</SelectItem>
                        <SelectItem value="20">Within 20 km</SelectItem>
                        <SelectItem value="50">Within 50 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Status</label>
                  <div className="text-sm text-muted-foreground">
                    {useCurrentLocation ? (
                      userLocation ? (
                        <span className="text-green-600">✓ Location detected</span>
                      ) : (
                        <span className="text-orange-600">⏳ Detecting location...</span>
                      )
                    ) : (
                      <span className="text-gray-600">Using selected city</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 rounded flex-1"></div>
                      <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLocation('all');
              fetchBusinesses();
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {businesses.map((business) => 
              viewMode === 'grid' ? (
                <BusinessCard key={business._id} business={business} />
              ) : (
                <BusinessListItem key={business._id} business={business} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessListing;