import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import BlogPopup from "./BlogGroup";
import { getAllBlogsAPI, deleteBlogAPI } from "@/service/operations/blog";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const GetBlog = () => {
  const [blog, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  // Open modal
  const openModal = (blogId) => {
    setSelectedBlogId(blogId);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlogId(null);
  };

  // Fetch all blogs
  const getAllBlogs = async () => {
    try {
      const response = await getAllBlogsAPI();
      if (response) setBlogs(response);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await deleteBlogAPI(id);
      setBlogs(blog.filter((b) => b._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">All Blogs</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {blog.length > 0 ? (
              blog.map((event, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          Array.isArray(event.images) && event.images.length > 0
                            ? event.images[0]
                            : event.images || "/placeholder.png"
                        }
                        alt={event.title || "Blog Image"}
                        className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 whitespace-normal max-w-xs">
                    <div className="text-sm font-semibold text-gray-900">
                      {event.title}
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 whitespace-normal max-w-sm">
                    <div
                      className="text-sm text-gray-700 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: event.desc }}
                    />
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(event.createdAt)}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                      <button
                        onClick={() => openModal(event._id)}
                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <FaEdit size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-6 py-4 whitespace-nowrap text-center"
                  colSpan="5"
                >
                  <p className="text-sm text-gray-500">No Blogs available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Blog Popup */}
        {isModalOpen && (
          <BlogPopup
            isOpen={isModalOpen}
            blogId={selectedBlogId}
            onClose={closeModal}
            getAllBlogs={getAllBlogs}
          />
        )}
      </div>
    </div>
  );
};

export default GetBlog;
