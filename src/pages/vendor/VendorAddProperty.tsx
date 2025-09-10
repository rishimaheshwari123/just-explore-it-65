import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { createPropertyAPI } from "@/service/operations/property";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Top bar */}

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
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium"
                >
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
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-gray-700 font-medium"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium"
              >
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleSelectChange("category", e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
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
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter property description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Add Property
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorAddProperty;
