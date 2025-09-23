import React, { useState } from "react";
import {
  Star,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  Clock,
  MapPin,
  Shield,
  Camera,
  Users,
  Calendar,
  Award,
  Heart,
  Share2,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BusinessInquiryModal from "@/components/BusinessInquiryModal";

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
  status: {
    isOpen: boolean;
    message: string;
  };
}

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const {
    _id,
    businessName,
    description,
    category,
    contactInfo,
    address,
    businessHours,
    ratings,
    services,
    images,
    verification,
    analytics,
    priceRange,
    features,
    isPremium,
  } = business;

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = businessHours[currentDay];
    if (!todayHours || todayHours.isClosed) {
      return { isOpen: false, message: "Closed today" };
    }

    const openTime = todayHours.open;
    const closeTime = todayHours.close;

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { isOpen: true, message: `Open until ${closeTime}` };
    } else {
      return { isOpen: false, message: `Opens at ${openTime}` };
    }
  };

  const status = getCurrentStatus();
  const primaryImage =
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    "/placeholder.svg";
  const fullAddress = `${address.area}, ${address.city}, ${address.state}`;
  const [isLiked, setIsLiked] = useState(false);
  const [showFullHours, setShowFullHours] = useState(false);

  const handleCall = () => {
    window.open(`tel:${contactInfo.primaryPhone}`, "_self");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I found your business ${businessName} on our platform. I'm interested in your services.`
    );
    window.open(
      `https://wa.me/${contactInfo.primaryPhone.replace(
        /[^0-9]/g,
        ""
      )}?text=${message}`,
      "_blank"
    );
  };

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };

  const handleWebsite = () => {
    if (contactInfo.website) {
      window.open(
        contactInfo.website.startsWith("http")
          ? contactInfo.website
          : `https://${contactInfo.website}`,
        "_blank"
      );
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: businessName,
        text: `Check out ${businessName} - ${description}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group relative">
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold">
            <Award className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      {/* Image Gallery */}
      <div className="relative h-48 bg-gray-100">
        {images.length > 0 ? (
          <div className="flex h-full">
            <div className="flex-1 relative">
              <img
                src={primaryImage}
                alt={businessName}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center">
                  <Camera className="h-3 w-3 mr-1" />+{images.length - 1}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Camera className="h-12 w-12" />
          </div>
        )}

        {/* Verification Badge */}
        {verification.isVerified && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-600 hover:bg-green-700 text-white flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        {/* Open/Closed Status */}
        <div className="absolute bottom-2 left-2">
          <Badge
            className={`${
              status.isOpen ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {status.message}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-[110px]">
        {" "}
        {/* Adjusted padding to make space for the buttons */}
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
              {businessName}
            </h3>
            <p className="text-sm text-gray-600">{category}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {fullAddress}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-1">
              {renderStars(ratings.average)}
              <span className="ml-1 text-sm font-semibold text-gray-700">
                {ratings.average.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              ({ratings.totalReviews} reviews)
            </p>
            {analytics.totalViews > 0 && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Eye className="h-3 w-3 mr-1" />
                {analytics.totalViews} views
              </div>
            )}
          </div>
        </div>
        {/* Business Info Bar */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center">
              <span className="font-medium">{priceRange}</span>
            </div>
            {verification.trustScore > 0 && (
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Trust: {verification.trustScore}%
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className="flex items-center text-xs text-gray-600 hover:text-red-500"
            >
              <Heart
                className={`h-3 w-3 mr-1 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {analytics.totalCalls + (isLiked ? 1 : 0)}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center text-xs text-gray-600 hover:text-blue-500"
            >
              <Share2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        {/* Services */}
        {services.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              Services:
            </h4>
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service.name}
                </Badge>
              ))}
              {services.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        {/* Features */}
        {features.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              Features:
            </h4>
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
        {/* Location & Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            <span className="flex-1 truncate">{fullAddress}</span>
          </div>

          {/* Business Hours */}
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-gray-600">{status.message}</span>
              </div>
              <span className="text-green-600 font-semibold">{priceRange}</span>
            </div>

            <div className="mt-2">
              <button
                onClick={() => setShowFullHours(!showFullHours)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showFullHours ? "Hide" : "Show"} all hours
              </button>

              {showFullHours && (
                <div className="mt-2 space-y-1">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="capitalize font-medium">{day}:</span>
                      <span
                        className={
                          !hours.isClosed ? "text-green-600" : "text-red-600"
                        }
                      >
                        {!hours.isClosed
                          ? `${hours.open} - ${hours.close}`
                          : "Closed"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-xs text-gray-600">
            <span className="font-medium">Phone: </span>
            {contactInfo.primaryPhone}
            {contactInfo.email && (
              <div>
                <span className="font-medium">Email: </span>
                {contactInfo.email}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons fixed at the bottom of the card */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 gap-2 mb-2">
          <Button
            onClick={handleCall}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleWhatsApp}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleDirections}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Navigation className="h-4 w-4" />
          </Button>
          {contactInfo.website && (
            <Button
              onClick={handleWebsite}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Send Inquiry Button */}
        <BusinessInquiryModal
          business={business}
          trigger={
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Inquiry
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default BusinessCard;
