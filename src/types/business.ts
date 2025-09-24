// Shared Business type definitions to resolve type conflicts

export interface BusinessBase {
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
  pricing?: Array<{
    serviceName: string;
    price: number;
    unit: string;
    description?: string;
  }>;
  services?: Array<{
    name: string;
    description?: string;
    price?: number;
  }>;
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  verification?: {
    isVerified: boolean;
    trustScore: number;
  };
  premiumFeatures?: {
    featuredListing: boolean;
    prioritySupport: boolean;
    analyticsAccess: boolean;
    customBranding: boolean;
  };
  isPremium?: boolean;
  analytics?: {
    totalViews: number;
    totalCalls: number;
    views: number;
    calls: number;
  };
  priceRange?: string;
  features?: string[];
  area?: string;
  status?: string | {
    isOpen: boolean;
    message: string;
  };
}

export type Business = BusinessBase;

// Location interface for Google Maps
export interface Location {
  lat: number;
  lng: number;
}

// User location interface
export interface UserLocation {
  lat: number;
  lng: number;
}