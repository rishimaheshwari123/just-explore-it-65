import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { getSingleBlogAPI, updateBlogApi } from "@/service/operations/blog";

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

  const getSingleBlog = async (id) => {
    try {
      const response = await getSingleBlogAPI(id);
      if (response) {
        const blog = response;
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
      toast.error(error);
    }
  };

  useEffect(() => {
    if (blogId && isOpen) {
      getSingleBlog(blogId);
    }
  }, [isOpen, blogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "desc") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > maxWords) {
        alert(`You cannot exceed ${maxWords} words.`);
        return;
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      image: files[0],
      images: files as File[],
    });
  };

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

      const response = await updateBlogApi(blogId, formDataToSend);

      if (response?.success) {
        getAllBlogs();

        onClose();
      }
    } catch (error) {
      toast.error("Oops, something went wrong!");
    }
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center`}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full md:w-3/4 lg:w-1/2 h-[95%] overflow-scroll py-6">
        <h6 className="text-blue-600 text-center text-2xl md:text-3xl border-b-2 border-blue-600 pb-2">
          {blogId ? "Edit Blog" : "Add Blog"}
        </h6>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg md:text-xl font-bold mb-2"
              htmlFor="title"
            >
              Title: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
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

          <div className="flex items-center justify-center md:justify-start">
            <button
              className="px-6 py-2 bg-black text-white rounded-md text-base md:text-lg hover:bg-gray-800 transition"
              type="submit"
            >
              {blogId ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
        <button
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md text-base hover:bg-gray-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BlogPopup;
