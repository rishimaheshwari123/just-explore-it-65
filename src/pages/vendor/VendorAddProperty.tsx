import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { createPropertyAPI } from "@/service/operations/property";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { imageUpload } from "@/service/operations/image";

const VendorAddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    description: "",
    vendor: "",
  });
  const [images, setImages] = useState<{ public_id: string; url: string }[]>(
    []
  );

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

  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  if (user?._id && formData.vendor === "") {
    setFormData((prev) => ({ ...prev, vendor: user._id }));
  }

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        // navigate("/vendor/dashboard");
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
      <div className="flex h-16 items-center border-b px-6">
        <SidebarTrigger />
        <h1 className="ml-4 text-lg font-semibold">Vendor Dashboard</h1>
      </div>

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Property
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/vendor/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter property title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Property Images
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center mb-4 bg-blue-50">
                  <Dropzone
                    onDrop={(acceptedFiles) => uploadImage(acceptedFiles)}
                  >
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
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md focus:outline-none"
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter property description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full gradient-gold text-white">
                Add Property
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorAddProperty;
