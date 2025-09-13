"use client";

import { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updatePropertyAPI } from "@/service/operations/property";
import { imageUpload } from "@/service/operations/image";
import { BUSINESS_CATEGORIES } from "@/constants/categories";

interface Image {
  public_id: string;
  url: string;
}

interface Property {
  _id: string;
  title: string;
  location: string;
  latitude?: string;
  longitude?: string;
  category: string;
  image?: string | File;
  images?: Image[];
  description?: string;
  tags?: string;
  keywords?: string;
}

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
}

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSave: (updatedProperty: Property) => void;
  fetchProperties: () => void;
}

export const EditPropertyModal = ({
  isOpen,
  onClose,
  property,
  onSave,
  fetchProperties,
}: EditPropertyModalProps) => {
  const [formData, setFormData] = useState<Property>({
    _id: "",
    title: "",
    location: "",
    latitude: "",
    longitude: "",
    category: "",
    image: "",
    images: [],
    description: "",
    tags: "",
    keywords: "",
  });
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Pre-populate form when property changes
  useEffect(() => {
    if (property) {
      setFormData({
        _id: property._id,
        title: property.title || "",
        location: property.location || "",
        latitude: property.latitude || "",
        longitude: property.longitude || "",
        category: property.category || "",
        image: property.image || "",
        description: property.description || "",
        tags: property.tags || "",
        keywords: property.keywords || "",
      });

      // Initialize images if they exist in the property
      if (property.images && Array.isArray(property.images)) {
        setImages(property.images);
      } else {
        setImages([]);
      }
    }
  }, [property]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASz6Gqa5Oa3WialPx7Z6ebZTj02Liw-Gk&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  const handleInputChange = (
    field: keyof Property,
    value: string | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Handle location search
    if (field === 'location' && typeof value === 'string' && isGoogleMapsLoaded) {
      handleLocationSearch(value);
    }
  };

  const handleLocationSearch = (query: string) => {
    if (!query.trim() || !isGoogleMapsLoaded) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: query,
        types: ['(cities)'],
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const suggestions = predictions.slice(0, 5).map((prediction) => ({
            name: prediction.description,
            lat: 0,
            lng: 0,
            placeId: prediction.place_id,
          }));
          setLocationSuggestions(suggestions as any);
          setShowSuggestions(true);
        } else {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleLocationSelect = (suggestion: LocationSuggestion & { placeId?: string }) => {
    console.log('Selected city:', suggestion.name);
    
    if (!isGoogleMapsLoaded) {
      console.log('Google Maps not loaded');
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    console.log('Places service available:', !!service);

    if (suggestion.placeId) {
      const request = {
        placeId: suggestion.placeId,
        fields: ['geometry', 'name'],
      };
      
      console.log('Place details request:', request);

      service.getDetails(request, (place, status) => {
        console.log('Place details response:', { place, status });
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          console.log('Coordinates found:', { lat, lng });
          
          setFormData(prev => ({
            ...prev,
            location: suggestion.name,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
        } else {
          console.log('Using fallback coordinates');
          setFormData(prev => ({
            ...prev,
            location: suggestion.name,
            latitude: '0',
            longitude: '0',
          }));
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        location: suggestion.name,
        latitude: suggestion.lat.toString(),
        longitude: suggestion.lng.toString(),
      }));
    }

    setShowSuggestions(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleInputChange("image", file);
      toast.success("Featured image selected successfully!");
    }
  };

  // Upload multiple images
  const uploadImages = async (acceptedFiles: File[]) => {
    try {
      const response = await imageUpload(acceptedFiles);

      if (response) {
        const uploadedImages = response.map((image: any) => ({
          public_id: image.asset_id,
          url: image.url,
        }));

        setImages((prevImages) => [...prevImages, ...uploadedImages]);
        toast.success("Additional images uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload additional images");
    }
  };

  // Remove an image
  const removeImage = (publicId: string) => {
    const updatedImages = images.filter(
      (image) => image.public_id !== publicId
    );
    setImages(updatedImages);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = new FormData();

      // Append basic fields
      dataToSend.append("title", formData.title);
      dataToSend.append("location", formData.location);
      dataToSend.append("latitude", formData.latitude || "0");
      dataToSend.append("longitude", formData.longitude || "0");
      dataToSend.append("category", formData.category);

      // Append optional fields only if they have values
      if (formData.description) {
        dataToSend.append("description", formData.description);
      }

      // Append tags and keywords
      if (formData.tags) {
        dataToSend.append("tags", formData.tags);
      }
      if (formData.keywords) {
        dataToSend.append("keywords", formData.keywords);
      }

      // Handle single image file or existing URL
      if (formData.image instanceof File) {
        dataToSend.append("image", formData.image);
      } else if (typeof formData.image === "string" && formData.image) {
        dataToSend.append("image", formData.image);
      }

      // Add multiple images
      if (images.length > 0) {
        dataToSend.append("images", JSON.stringify(images));
      }

      const response = await updatePropertyAPI(property._id, dataToSend);

      if (response?.success) {
        const updatedProperty = {
          ...formData,
          images: images,
        };

        onSave(response.updatedProperty || updatedProperty);
        toast.success("Property updated successfully!");
        fetchProperties();
        onClose();
      } else {
        toast.error(response?.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (property) {
      setFormData({
        _id: property._id,
        title: property.title || "",
        location: property.location || "",
        latitude: property.latitude || "",
        longitude: property.longitude || "",
        category: property.category || "",
        image: property.image || "",
        description: property.description || "",
        tags: property.tags || "",
        keywords: property.keywords || "",
      });

      if (property.images && Array.isArray(property.images)) {
        setImages(property.images);
      } else {
        setImages([]);
      }
    }
    setLocationSuggestions([]);
    setShowSuggestions(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter property title"
              />
            </div>

            {/* Location */}
            <div className="grid gap-2 relative">
              <Label htmlFor="location">Location *</Label>
              <Input
                ref={locationInputRef}
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                onFocus={() => formData.location && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Enter city name"
              />
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto top-full mt-1">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleLocationSelect(suggestion as any)}
                    >
                      <div className="font-medium text-gray-900">{suggestion.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coordinates Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  readOnly
                  placeholder="Auto-filled"
                  className="bg-gray-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  readOnly
                  placeholder="Auto-filled"
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="category">Business Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Multiple Images Upload Section */}
            <div className="grid gap-2 mt-4">
              <Label>Property Images</Label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center mb-4 bg-blue-50">
                <Dropzone
                  onDrop={(acceptedFiles) => uploadImages(acceptedFiles)}
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                  }}
                  multiple={true}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <p className="text-blue-500">
                        Drag 'n' drop multiple images here, or click to select
                        files
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload high-quality property images
                      </p>
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* Multiple Images Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div className="relative" key={index}>
                      <button
                        type="button"
                        onClick={() => removeImage(image.public_id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.svg?height=128&width=128";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter detailed property description"
                rows={3}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* SEO Fields */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">SEO Settings</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">
                  Tags <span className="text-sm text-gray-500">(comma separated)</span>
                </Label>
                <Input
                  id="tags"
                  value={formData.tags || ""}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="e.g., luxury, spacious, modern, furnished"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">Add relevant tags to help users find your property</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="keywords">
                  Keywords <span className="text-sm text-gray-500">(comma separated)</span>
                </Label>
                <Input
                  id="keywords"
                  value={formData.keywords || ""}
                  onChange={(e) => handleInputChange("keywords", e.target.value)}
                  placeholder="e.g., apartment for rent, 2bhk, near metro, parking"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">Add keywords for better search visibility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
