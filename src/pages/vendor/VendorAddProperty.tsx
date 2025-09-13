import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { createPropertyAPI } from "@/service/operations/property";
import { imageUpload } from "@/service/operations/image";
import { BUSINESS_CATEGORIES } from "@/constants/categories";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

const VendorAddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    latitude: "",
    longitude: "",
    category: "",
    description: "",
    vendor: "",
    tags: "",
    keywords: "",
  });
  const [images, setImages] = useState<{ public_id: string; url: string }[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<{
    name: string;
    lat: string;
    lng: string;
    placeId?: string;
  }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  // Google Places API integration
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);

  // Initialize Google Places API
  useEffect(() => {
    const initializeGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const autocomplete = new window.google.maps.places.AutocompleteService();
        setPlacesService(service);
        setAutocompleteService(autocomplete);
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASz6Gqa5Oa3WialPx7Z6ebZTj02Liw-Gk&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeGooglePlaces;
      document.head.appendChild(script);
    } else {
      initializeGooglePlaces();
    }
  }, []);

  // Fallback cities for when Google API is not available
  const fallbackCities = [
    { name: "Mumbai, Maharashtra", lat: "19.0760", lng: "72.8777" },
    { name: "Delhi, Delhi", lat: "28.7041", lng: "77.1025" },
    { name: "Bangalore, Karnataka", lat: "12.9716", lng: "77.5946" },
    { name: "Hyderabad, Telangana", lat: "17.3850", lng: "78.4867" },
    { name: "Chennai, Tamil Nadu", lat: "13.0827", lng: "80.2707" },
    { name: "Kolkata, West Bengal", lat: "22.5726", lng: "88.3639" },
    { name: "Pune, Maharashtra", lat: "18.5204", lng: "73.8567" },
    { name: "Jaipur, Rajasthan", lat: "26.9124", lng: "75.7873" },
    { name: "Bhopal, Madhya Pradesh", lat: "23.2599", lng: "77.4126" },
    { name: "Indore, Madhya Pradesh", lat: "22.7196", lng: "75.8577" }
  ];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Set vendor ID when user is available
  useEffect(() => {
    if (user?._id && formData.vendor === "") {
      setFormData((prev) => ({ ...prev, vendor: user._id }));
    }
  }, [user, formData.vendor]);

  const uploadImage = async (acceptedFiles: File[]) => {
    const response = await imageUpload(acceptedFiles);
    const uploadedImages = response?.map((image: any) => ({
      public_id: image.asset_id,
      url: image.url,
    }));
    setImages((prev) => [...prev, ...uploadedImages]);
  };

  const removeImage = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Location search function using Google Places API
  const searchLocations = (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (autocompleteService) {
      // Use Google Places API for suggestions
      const request = {
        input: query,
        componentRestrictions: { country: 'in' }, // Restrict to India
        types: ['(cities)'] // Only get city suggestions
      };

      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const suggestions = predictions.slice(0, 5).map(prediction => ({
            name: prediction.description,
            placeId: prediction.place_id,
            lat: "", // Will be filled when selected
            lng: "" // Will be filled when selected
          }));
          setLocationSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          // Fallback to hardcoded cities if API fails
          const filteredCities = fallbackCities.filter(city =>
            city.name.toLowerCase().includes(query.toLowerCase())
          );
          setLocationSuggestions(filteredCities);
          setShowSuggestions(filteredCities.length > 0);
        }
      });
    } else {
      // Fallback to hardcoded cities if Google API not loaded
      const filteredCities = fallbackCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setLocationSuggestions(filteredCities);
      setShowSuggestions(filteredCities.length > 0);
    }
  };

  // Handle location selection
  const handleLocationSelect = (city: any) => {
    console.log('Selected city:', city);
    console.log('Places service available:', !!placesService);
    
    if (city.placeId && placesService) {
      // Get detailed place information including coordinates
      const request = {
        placeId: city.placeId,
        fields: ['geometry', 'name', 'formatted_address']
      };

      console.log('Making place details request:', request);
      placesService.getDetails(request, (place, status) => {
        console.log('Place details response:', { place, status });
        
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          console.log('Coordinates found:', { lat, lng });
          
          setFormData(prev => ({
            ...prev,
            location: city.name,
            latitude: lat.toString(),
            longitude: lng.toString()
          }));
        } else {
          console.log('Place details failed, using fallback');
          // Fallback if place details fail
          setFormData(prev => ({
            ...prev,
            location: city.name,
            latitude: city.lat || "",
            longitude: city.lng || ""
          }));
        }
      });
    } else {
      console.log('Using fallback cities');
      // Handle fallback cities
      setFormData(prev => ({
        ...prev,
        location: city.name,
        latitude: city.lat.toString(),
        longitude: city.lng.toString()
      }));
    }
    setShowSuggestions(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, location: value }));
    searchLocations(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      images: JSON.stringify(images),
    };

    try {
      const response = await createPropertyAPI(dataToSend);
      if (response?.data?.success) {
        toast.success("Property added successfully!");

        // Reset form data
        setFormData({
          title: "",
          location: "",
          latitude: "",
          longitude: "",
          category: "",
          description: "",
          vendor: user?._id || "",
        });

        setImages([]);
      } else {
        toast.error(response?.data?.message || "Failed to add property.");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("An error occurred while adding the property.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar example */}
      {sidebarOpen && (
        <div className="w-64 bg-white shadow-md p-4 absolute top-16 left-0 h-full z-10">
          <p className="font-bold">Sidebar Content</p>
          <ul className="mt-2">
            <li>Dashboard</li>
            <li>Properties</li>
            <li>Settings</li>
          </ul>
        </div>
      )}

      {/* Page header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Property
            </h1>
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="px-4 py-2 border rounded-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-gray-700 font-medium">
                  Property Title
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Enter property title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="location" className="block text-gray-700 font-medium">
                  Location
                </label>
                <input
                  ref={locationInputRef}
                  id="location"
                  name="location"
                  placeholder="Type location (e.g., Bhopal, Mumbai)"
                  value={formData.location}
                  onChange={handleLocationChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                  autoComplete="off"
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {locationSuggestions.map((city, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleLocationSelect(city);
                        }}
                      >
                        <div className="font-medium text-sm">{city.name}</div>
                        <div className="text-xs text-gray-600">Lat: {city.lat}, Lng: {city.lng}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="latitude" className="block text-gray-700 font-medium">
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  value={formData.latitude}
                  readOnly
                  className="w-full border px-3 py-2 rounded-md bg-gray-100"
                  placeholder="Auto-filled from location"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="longitude" className="block text-gray-700 font-medium">
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  value={formData.longitude}
                  readOnly
                  className="w-full border px-3 py-2 rounded-md bg-gray-100"
                  placeholder="Auto-filled from location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-gray-700 font-medium">
                Business Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleSelectChange("category", e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Business Category</option>
                {BUSINESS_CATEGORIES.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Property Images
              </label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center mb-4 bg-blue-50">
                <Dropzone onDrop={(files) => uploadImage(files)}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <p className="text-blue-500">
                        Drag 'n' drop images here, or click to select files
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload high-quality property images
                      </p>
                    </div>
                  )}
                </Dropzone>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div className="relative" key={index}>
                      <button
                        type="button"
                        onClick={() => removeImage(image.public_id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md"
                      >
                        ✕
                      </button>
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-gray-700 font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter detailed property description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* SEO Fields */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">SEO Settings</h3>
              
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-gray-700 font-medium">
                  Tags <span className="text-sm text-gray-500">(comma separated)</span>
                </label>
                <input
                  id="tags"
                  name="tags"
                  placeholder="e.g., luxury, spacious, modern, furnished"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">Add relevant tags to help users find your property</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="keywords" className="block text-gray-700 font-medium">
                  Keywords <span className="text-sm text-gray-500">(comma separated)</span>
                </label>
                <input
                  id="keywords"
                  name="keywords"
                  placeholder="e.g., apartment for rent, 2bhk, near metro, parking"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">Add keywords for better search visibility</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              🏠 Add Property
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorAddProperty;
