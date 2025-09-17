import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  Clock,
  Verified,
  Eye,
  Edit,
  Trash2,
  Navigation,
} from "lucide-react";

interface Business {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  subCategory?: string;
  businessType: string;
  establishedYear?: string;
  employeeCount?: string;
  whatsappNumber?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
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
    price?: {
      min: number;
      max?: number;
      currency?: string;
      priceType?: string;
    };
    features?: string[];
  }>;
  priceRange: string;
  features: string[];
  status: string;
}

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/property/business/${id}`
      );
      const data = await response.json();
      if (data.success) {
        setBusiness(data.business);
        trackView();
      } else {
        toast.error("Business not found");
        navigate("/business-listing");
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      toast.error("Failed to load business details");
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch(
        `http://localhost:8000/api/v1/property/business/${id}/interaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "view" }),
        }
      );
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const handleCall = (phone: string) => {
    // Track call interaction
    fetch(`http://localhost:8000/api/v1/property/business/${id}/interaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "call" }),
    }).catch(console.error);

    window.open(`tel:${phone}`, "_self");
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this business? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/property/business/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Business deleted successfully");
        navigate("/business-listing");
      } else {
        toast.error(data.message || "Failed to delete business");
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business");
    } finally {
      setDeleting(false);
    }
  };

  const isBusinessOpen = (businessHours: any) => {
    const now = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
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
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatBusinessHours = (businessHours: any) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return days.map((day, index) => {
      const hours = businessHours[day];
      return (
        <div key={day} className="flex justify-between text-sm">
          <span className="font-medium">{dayNames[index]}</span>
          <span className={hours?.isClosed ? "text-red-500" : "text-green-600"}>
            {hours?.isClosed ? "Closed" : `${hours?.open} - ${hours?.close}`}
          </span>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading business details...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Business Not Found</h2>
          <Button onClick={() => navigate("/business-listing")}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const isOpen = isBusinessOpen(business.businessHours);
  const mainImage =
    business.images?.find((img) => img.isPrimary)?.url ||
    business.images?.[0]?.url ||
    "/placeholder-business.jpg";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {business.businessName}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge>{business.category}</Badge>
                {business.verification.isVerified && (
                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                    <Verified className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Badge
                  className={`${
                    isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                onClick={() => navigate(`/edit-business/${business._id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card>
              <CardContent className="p-0">
                <img
                  src={mainImage}
                  alt={business.businessName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {business.description}
                </p>
              </CardContent>
            </Card>

            {/* Price Range */}
            {business.priceRange && (
              <Card>
                <CardHeader>
                  <CardTitle>Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {business.priceRange}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {business.priceRange === "$" && "Budget-friendly"}
                      {business.priceRange === "$$" && "Moderate pricing"}
                      {business.priceRange === "$$$" && "Premium pricing"}
                      {business.priceRange === "$$$$" && "Luxury pricing"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {business.services && business.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services & Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {business.services.map((service, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">
                              {service.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {service.description}
                            </p>
                            {service.features &&
                              service.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {service.features.map((feature, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                          </div>
                          {service.price && (
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-primary">
                                ₹{service.price.min}
                                {service.price.max &&
                                  service.price.max !== service.price.min && (
                                    <span> - ₹{service.price.max}</span>
                                  )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {service.price.priceType || "per service"}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {business.features && business.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="font-medium">
                    {business.contactInfo.primaryPhone}
                  </p>
                </div>

                {business.contactInfo.secondaryPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <p className="font-medium">
                      {business.contactInfo.secondaryPhone}
                    </p>
                  </div>
                )}

                {business.contactInfo.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <p>{business.contactInfo.email}</p>
                  </div>
                )}

                {business.contactInfo.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <a
                      href={business.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {business.whatsappNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <a
                      href={`https://wa.me/${business.whatsappNumber.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      WhatsApp: {business.whatsappNumber}
                    </a>
                  </div>
                )}

                {business.socialMedia && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Social Media
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {business.socialMedia.facebook && (
                        <a
                          href={business.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Facebook
                        </a>
                      )}
                      {business.socialMedia.instagram && (
                        <a
                          href={business.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline text-sm"
                        >
                          Instagram
                        </a>
                      )}
                      {business.socialMedia.twitter && (
                        <a
                          href={business.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Twitter
                        </a>
                      )}
                      {business.socialMedia.linkedin && (
                        <a
                          href={business.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => handleCall(business.contactInfo.primaryPhone)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p>{business.address.street}</p>
                    <p>
                      {business.address.area}, {business.address.city}
                    </p>
                    <p>
                      {business.address.state} - {business.address.pincode}
                    </p>
                    {business.address.landmark && (
                      <p>Near {business.address.landmark}</p>
                    )}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Rating & Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-2">
                    {business.ratings.average.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(business.ratings.average)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {business.ratings.totalReviews} reviews
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-lg">
                      {business.analytics.totalViews}
                    </div>
                    <div className="text-muted-foreground">Total Views</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      {business.analytics.totalCalls}
                    </div>
                    <div className="text-muted-foreground">Total Calls</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formatBusinessHours(business.businessHours)}
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.businessType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Type</span>
                    <span className="font-medium">{business.businessType}</span>
                  </div>
                )}

                {business.establishedYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Established</span>
                    <span className="font-medium">
                      {business.establishedYear}
                    </span>
                  </div>
                )}

                {business.employeeCount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Size</span>
                    <span className="font-medium">
                      {business.employeeCount} employees
                    </span>
                  </div>
                )}

                {business.verification && business.verification.trustScore && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trust Score</span>
                    <span className="font-medium">
                      {business.verification.trustScore}/100
                    </span>
                  </div>
                )}

                {business.subCategory && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Specialty</span>
                    <span className="font-medium">{business.subCategory}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
