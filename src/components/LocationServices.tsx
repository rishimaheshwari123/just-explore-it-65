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

  return <div></div>;
};

export default LocationServices;
