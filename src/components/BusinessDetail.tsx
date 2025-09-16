import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Verified,
  Eye,
  Mail,
  Globe,
  Calendar,
  CreditCard,
  Wifi,
  Car,
  Shield,
  Award,
  Users,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react';

interface Business {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  subCategory?: string;
  businessType: string;
  fullAddress: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  rating: {
    average: number;
    count: number;
  };
  status: {
    isOpen: boolean;
    message: string;
  };
  verified: boolean;
  images: string[];
  features: string[];
  services: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBusinessDetail();
    }
  }, [id]);

  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/property/business/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setBusiness(data.business);
        // Track view
        trackInteraction('view');
      } else {
        console.error('Business not found:', data.message);
        toast.error('Business not found');
        navigate('/businesses');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      toast.error('Failed to load business details');
      navigate('/businesses');
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = async (type: string) => {
    try {
      await fetch(`/api/v1/property/business/${id}/track-interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const handleCall = (phone: string) => {
    trackInteraction('call');
    window.open(`tel:${phone}`, '_self');
  };

  const handleGetDirections = () => {
    if (business) {
      trackInteraction('direction');
      const address = `${business.location.address}, ${business.location.city}, ${business.location.state} ${business.location.pincode}`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (business?.contactInfo.website) {
      trackInteraction('website');
      window.open(business.contactInfo.website, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business?.businessInfo.businessName,
          text: business?.businessInfo.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const isBusinessOpen = () => {
    if (!business) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = business.businessHours[currentDay];
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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'parking available':
        return <Car className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'wheelchair accessible':
        return <Shield className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-48 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
          <Button onClick={() => navigate('/businesses')}>Back to Businesses</Button>
        </div>
      </div>
    );
  }

  const isOpen = isBusinessOpen();
  const mainImage = business.images?.[selectedImage]?.url || '/placeholder-business.jpg';

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative">
            <img
              src={mainImage}
              alt={business.businessInfo.businessName}
              className="w-full h-64 md:h-96 object-cover"
            />
            
            {/* Image Navigation */}
            {business.media?.images?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-2 bg-black/50 rounded-lg p-2">
                  {business.media.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === selectedImage ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {business.businessInfo.category}
              </Badge>
              {business.verified && (
                <Badge className="bg-green-500 text-white flex items-center gap-1">
                  <Verified className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <Badge 
                className={`${
                  business.status.isOpen 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {business.status.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {business.businessName}
                    </CardTitle>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(business.rating.average)}
                      </div>
                      <span className="font-medium">
                        {business.rating.average.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({business.rating.count} reviews)
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{business.fullAddress}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {business.description}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            {business.services?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services.map((service, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-1">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {service.description}
                          </p>
                        )}
                        {service.price && service.price > 0 && (
                          <p className="text-sm font-medium text-green-600">
                            ₹{service.price}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {business.features?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(business.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2">
                      <span className="capitalize font-medium">{day}</span>
                      <span className={!hours.isOpen ? 'text-red-500' : 'text-green-600'}>
                        {!hours.isOpen ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => handleCall(business.contactInfo.phone)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call {business.contactInfo.phone}
                </Button>

                {business.contactInfo.alternatePhone && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCall(business.contactInfo.alternatePhone!)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Alt: {business.contactInfo.alternatePhone}
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGetDirections}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>

                {business.contactInfo.website && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleWebsiteClick}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}

                {business.contactInfo.email && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`mailto:${business.contactInfo.email}`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{business.contactInfo.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{business.contactInfo.email}</span>
                </div>

                {business.contactInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={business.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {business.contactInfo.website}
                    </a>
                  </div>
                )}

                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Reviews
                  </span>
                  <span className="font-medium">{business.rating.count}</span>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>{business.fullAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Business
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;