// Global type definitions to resolve build errors

// Google Maps type definitions
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: any;
          PlacesServiceStatus: any;
        };
      };
    };
  }
}

// Business type for compatibility across components
export interface BusinessTypes {
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
    phone?: string; // Legacy support
    alternatePhone?: string; // Legacy support
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
    lat?: number;
    lng?: number;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
      isOpen?: boolean;
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
  // Legacy properties for compatibility
  location?: {
    lat: number;
    lng: number;
    latitude: number;
    longitude: number;
  };
  businessInfo?: any;
  media?: any;
}

// User location type
export interface UserLocation {
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
}

// Date formatting fix
declare namespace Intl {
  interface DateTimeFormatOptions {
    weekday?: "narrow" | "short" | "long";
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
    day?: "numeric" | "2-digit";
  }
}

// Utility types for spread operations
export type SpreadableObject = Record<string, any>;
export type FormData = SpreadableObject;

export {};