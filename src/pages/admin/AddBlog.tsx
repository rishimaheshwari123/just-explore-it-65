import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createBlogAPI } from "@/service/operations/blog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AddBlog = () => {
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
    descriptionHtml: "",
    keywords: "",
    tags: "",
    images: [] as File[],
  });

  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Auto-generate slug from title, but allow manual edits
  useEffect(() => {
    if (!formData.slug && formData.title) {
      const s = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, slug: s }));
    }
  }, [formData.title]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      images: files as File[],
    });
  };

  // React Quill editor value handled via formData.descriptionHtml

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle || "");
      formDataToSend.append("slug", formData.slug || "");
      // Send HTML from React Quill editor
      formDataToSend.append("desc", formData.descriptionHtml || "");

      // Keywords & tags as comma-separated strings
      if (formData.keywords) formDataToSend.append("keywords", formData.keywords);
      if (formData.tags) formDataToSend.append("tags", formData.tags);

      // Images: append multiple; also append first as `image` for compatibility
      if (formData.images && formData.images.length > 0) {
        formDataToSend.append("image", formData.images[0]);
        formData.images.forEach((file) => formDataToSend.append("images", file));
      }

      const response = await createBlogAPI(formDataToSend);

      if (response) {
        setFormData({
          title: "",
          subtitle: "",
          slug: "",
          descriptionHtml: "",
          keywords: "",
          tags: "",
          images: [],
        });
        // Reset editor value
        // ReactQuill is controlled via state; already cleared above
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h6 className="text-blue-600 text-center text-3xl border-b-2 border-blue-600 pb-2">
        Add Blogs
      </h6>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 mt-10 max-w-3xl mx-auto"
      >
        {/* Title */}
        <div>
          <label
            className="block text-gray-600 text-xl font-bold mb-2"
            htmlFor="title"
          >
            Title: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline text-xl"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-gray-600 text-xl font-bold mb-2" htmlFor="subtitle">
            Subtitle
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline text-xl"
            name="subtitle"
            id="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-gray-600 text-xl font-bold mb-2" htmlFor="slug">
            Slug
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline text-xl"
            name="slug"
            id="slug"
            value={formData.slug}
            onChange={handleChange}
          />
        </div>

        {/* Description (React Quill Editor) */}
        <div>
          <label htmlFor="descriptionHtml" className="block font-medium text-gray-700 text-xl mb-2">
            Description (HTML): <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            theme="snow"
            value={formData.descriptionHtml}
            onChange={(value) => setFormData({ ...formData, descriptionHtml: value })}
            modules={quillModules}
            formats={quillFormats}
            className="bg-white"
          />
          <p className="text-sm text-gray-500 mt-2">Rich text supported: headings, lists, links, images, and code.</p>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-gray-600 text-xl font-bold mb-2" htmlFor="keywords">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline text-xl"
            name="keywords"
            id="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="e.g., real estate, homes, property"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-600 text-xl font-bold mb-2" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline text-xl"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., market, trends, tips"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-600 text-xl font-bold mb-2" htmlFor="images">
            Images
          </label>
          <input
            className="appearance-none border rounded w-full py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline text-xl"
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />
          {formData.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {formData.images.map((file, idx) => (
                <div key={idx} className="border rounded p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-32 object-cover"
                  />
                  <p className="text-xs mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md text-xl hover:bg-blue-700 transition"
            type="submit"
          >
            Create Blog
          </button>
        </div>
      </form>
    </>
  );
};

export default AddBlog;
