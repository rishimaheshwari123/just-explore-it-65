import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  const maxWords = 3000;
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
    "align",
  ];

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slug: "",
    desc: "",
    keywords: "",
    tags: "",
    image: "",
    images: [] as File[],
  });

  const maxWords = 3000;

  // Fetch single blog
  const getSingleBlog = async (id) => {
    try {
      const response = await getSingleBlogAPI(id);
      if (response) {
        setFormData({
          title: blog.title || "",
          subtitle: blog.subtitle || "",
          slug: blog.slug || "",
          desc: blog.desc || "",
          keywords: (blog.keywords || []).join(", "),
          tags: (blog.tags || []).join(", "),
          image: blog.image || "",
          images: [],
        });
      } else {
        throw new Error(response);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      image: files[0],
      images: files as File[],
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle || "");
      formDataToSend.append("slug", formData.slug || "");
      formDataToSend.append("desc", formData.desc);
      if (formData.keywords) formDataToSend.append("keywords", formData.keywords);
      if (formData.tags) formDataToSend.append("tags", formData.tags);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.images && formData.images.length) {
        formData.images.forEach((file) => formDataToSend.append("images", file));
      }

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

          <div className="space-y-2 col-span-2">
            <label
              htmlFor="desc"
              className="block text-gray-700 text-lg md:text-xl font-bold mb-2"
            >
              Description *
            </label>
            <ReactQuill
              theme="snow"
              value={formData.desc}
              onChange={(value) => {
                const plain = value.replace(/<[^>]*>/g, " ");
                const wordCount = plain.trim().split(/\s+/).length;
                if (wordCount > maxWords) {
                  alert(`You cannot exceed ${maxWords} words.`);
                  return;
                }
                setFormData({ ...formData, desc: value });
              }}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white"
            />
          </div>

          {/* Subtitle */}
          <div className="mb-4">
            <label className="block text-gray-700 text-lg md:text-xl font-bold mb-2" htmlFor="subtitle">
              Subtitle
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              name="subtitle"
              id="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-gray-700 text-lg md:text-xl font-bold mb-2" htmlFor="slug">
              Slug
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              name="slug"
              id="slug"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <label className="block text-gray-700 text-lg md:text-xl font-bold mb-2" htmlFor="keywords">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              name="keywords"
              id="keywords"
              value={formData.keywords}
              onChange={handleChange}
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-gray-700 text-lg md:text-xl font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              name="tags"
              id="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg md:text-xl font-bold mb-2"
              htmlFor="image"
            >
              Image:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              id="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
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
