import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";
import { getSingleBlogAPI, getAllBlogsAPI } from "@/service/operations/blog";
import BlogImages from "./BlogImages";

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const isObjectId = (val) => /^[a-fA-F0-9]{24}$/.test(val || "");

  const getSingleBlog = async (slugOrId) => {
    try {
      setLoading(true);
      let blogData = null;

      if (isObjectId(slugOrId)) {
        const byId = await getSingleBlogAPI(slugOrId);
        blogData = byId || null;
      }

      if (!blogData) {
        const all = await getAllBlogsAPI();
        blogData = all.find((b) => (b.slug || "") === (slugOrId || "")) || null;
      }

      if (!blogData) throw new Error("Blog not found");

      setBlog(blogData);
      getRelatedBlogs(blogData.type, blogData._id);
    } catch (error) {
      setError("Failed to load blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRelatedBlogs = async (blogType, currentBlogId) => {
    try {
      const response = await getAllBlogsAPI();
      if (response) {
        const related = response
          .filter((b) => b.type === blogType && b._id !== currentBlogId)
          .slice(0, 3);
        setRelatedBlogs(related);
      }
    } catch {}
  };

  useEffect(() => {
    if (slug) getSingleBlog(slug);
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.desc,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleRelatedBlogClick = (b) => {
    const slugOrId = b.slug || b._id;
    navigate(`/blogs/${slugOrId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">{error || "Blog not found"}</p>
          <Button onClick={() => navigate("/blogs")}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-8 gradient-gold text-white">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="outline"
            className="mb-6 text-black border-white hover:bg-white hover:text-amber-600"
            onClick={() => navigate("/blogs")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
          </Button>

          <Badge className="bg-white text-amber-600 mb-4">{blog.type}</Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center space-x-6 text-sm text-black">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(blog.createdAt)}
            </span>

            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {calculateReadingTime(blog.desc)}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="text-black border-white hover:bg-white hover:text-amber-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Main Image */}
          <div className="w-full h-96">
            <BlogImages images={blog.images} alt={blog.title} />
          </div>

          {/* Description */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-img:w-full prose-img:h-auto">
              <div dangerouslySetInnerHTML={{ __html: blog.desc }} />
            </div>

            {/* Author */}
            <div className="border-t pt-6 mt-8">
              <div className="flex items-center">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold">Real Expert</p>
                  <p className="text-gray-600">
                    Published on {formatDate(blog.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Card
                  key={relatedBlog._id}
                  className="overflow-hidden hover:shadow-lg cursor-pointer"
                  onClick={() => handleRelatedBlogClick(relatedBlog)}
                >
                  <img
                    src={relatedBlog.images[0]}
                    className="w-full h-48 object-cover"
                    alt={relatedBlog.title}
                  />

                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {relatedBlog.desc}
                    </p>

                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(relatedBlog.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleBlog;
