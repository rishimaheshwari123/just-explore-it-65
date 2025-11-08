import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSingleBlogAPI, updateBlogApi } from "@/service/operations/blog";
import { imageUpload } from "@/service/operations/image";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogPopup = ({ isOpen, blogId, onClose, getAllBlogs }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
  });

  const maxWords = 3000;

  // Fetch single blog
  const getSingleBlog = async (id) => {
    try {
      const response = await getSingleBlogAPI(id);
      if (response) {
        setFormData({
          title: response.title,
          description: response.desc,
          images: Array.isArray(response.images)
            ? response.images
            : response.image
            ? [response.image]
            : [],
        });
      }
    } catch (error) {
      toast.error("Failed to load blog data");
    }
  };

  useEffect(() => {
    if (blogId && isOpen) getSingleBlog(blogId);
  }, [blogId, isOpen]);

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > maxWords) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  // Handle ReactQuill
  const handleQuillChange = (value) => {
    const wordCount = value
      .replace(/<[^>]+>/g, " ")
      .trim()
      .split(/\s+/).length;
    if (wordCount > maxWords) return;
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // Image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadedUrls = await imageUpload(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 10),
      }));
    } catch (error) {
      toast.error("Failed to upload images");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("desc", formData.description);
      data.append("images", JSON.stringify(formData.images));

      await updateBlogApi(blogId, data);
      getAllBlogs();
      onClose();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center`}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full md:w-3/4 lg:w-1/2 max-h-[95vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center text-blue-600 border-b-2 border-blue-600 pb-3">
          Edit Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Title *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Description *</Label>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleQuillChange}
                className="h-44"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-gray-600" /> Upload Images (Max
              10)
            </h4>

            <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-center">
              <Label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload images
                </p>
                <span className="text-xs text-gray-500">
                  JPG, PNG up to 5MB each
                </span>
              </Label>
              <Input
                type="file"
                id="imageUpload"
                className="hidden"
                multiple
                onChange={handleImageUpload}
                accept="image/png, image/jpeg"
              />
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
                  >
                    <img
                      src={img}
                      alt="Blog"
                      className="w-full h-28 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white border hover:bg-red-500 hover:text-white rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition"
            >
              Update Blog
            </Button>
            <Button
              type="button"
              className="px-10 py-3 bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold rounded-lg transition"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPopup;
