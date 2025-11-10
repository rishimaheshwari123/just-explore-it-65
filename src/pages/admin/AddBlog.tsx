import { useEffect, useState } from "react";
import { createBlogAPI } from "@/service/operations/blog";
import { imageUpload } from "@/service/operations/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slug: "",
    description: "",
    images: [],
    tagsText: "",
    keywordsText: "",
  });

  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Auto-generate slug from title if slug not manually edited
  useEffect(() => {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (formData.title && (!formData.slug || formData.slug === "")) {
      setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title]);

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
      console.error("Image upload failed:", error);
      toast.error("Failed to upload images");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      if (formData.subtitle) data.append("subtitle", formData.subtitle);
      if (formData.slug) data.append("slug", formData.slug);
      data.append("desc", formData.description);

      // ✅ images array ko JSON.stringify karke bhejna zaroori hai
      data.append("images", JSON.stringify(formData.images));

      // Tags and Keywords as arrays (comma-separated input)
      const tagsArray = formData.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const keywordsArray = formData.keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      data.append("tags", JSON.stringify(tagsArray));
      data.append("keywords", JSON.stringify(keywordsArray));

      await createBlogAPI(data);

      setFormData({
        title: "",
        subtitle: "",
        slug: "",
        description: "",
        images: [],
        tagsText: "",
        keywordsText: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-16">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Create New Blog
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-8 border border-gray-200"
      >
      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-xl font-semibold text-gray-800">
          Blog Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Enter blog title..."
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <label className="text-xl font-semibold text-gray-800">Subtitle</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Optional subtitle..."
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="text-xl font-semibold text-gray-800">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="auto-generated-from-title, editable"
        />
        <p className="text-xs text-gray-500">Example: my-blog-post</p>
      </div>

        {/* Description (React Quill) */}
        <div className="space-y-2">
          <label className="text-xl font-semibold text-gray-800">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              className="h-44"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <Camera className="h-5 w-5 text-gray-600" />
            Upload Blog Images (Max 10)
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

          {/* Image preview grid */}
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

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xl font-semibold text-gray-800">Tags</label>
          <input
            type="text"
            name="tagsText"
            value={formData.tagsText}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="comma-separated: travel, hotel, booking"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="text-xl font-semibold text-gray-800">Keywords</label>
          <input
            type="text"
            name="keywordsText"
            value={formData.keywordsText}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="comma-separated: best hotels, cheap flights"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg shadow-md transition"
          >
            Create Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
