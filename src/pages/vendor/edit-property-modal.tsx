"use client";

import { useState, useEffect } from "react";
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

interface Image {
  public_id: string;
  url: string;
}

interface Property {
  _id: string;
  title: string;
  location: string;
  category: string;
  image?: string | File;
  images?: Image[];
  description?: string;
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
    category: "",
    image: "",
    images: [],
    description: "",
  });
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate form when property changes
  useEffect(() => {
    if (property) {
      setFormData({
        _id: property._id,
        title: property.title || "",
        location: property.location || "",
        category: property.category || "",
        image: property.image || "",
        description: property.description || "",
      });

      // Initialize images if they exist in the property
      if (property.images && Array.isArray(property.images)) {
        setImages(property.images);
      } else {
        setImages([]);
      }
    }
  }, [property]);

  const handleInputChange = (
    field: keyof Property,
    value: string | number | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      dataToSend.append("category", formData.category);

      // Append optional fields only if they have values
      if (formData.description) {
        dataToSend.append("description", formData.description);
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
        category: property.category || "",
        image: property.image || "",
        description: property.description || "",
      });

      if (property.images && Array.isArray(property.images)) {
        setImages(property.images);
      } else {
        setImages([]);
      }
    }
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

            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter property location"
              />
            </div>

            {/* Category Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="vehicles">Vehicles</option>
                <option value="jobs">Jobs</option>
                <option value="property">Property</option>
                <option value="services">Services</option>
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
                placeholder="Enter property description"
                rows={3}
              />
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
