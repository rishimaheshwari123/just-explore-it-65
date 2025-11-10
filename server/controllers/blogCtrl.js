const { uploadImageToCloudinary } = require("../config/imageUploader");
const blogModel = require("../models/blogModel")

const createBlogsCtrl = async (req, res) => {
  try {
    const { title, desc, images } = req.body;

    if (!title || !desc || !images) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // parse stringified array
    const parsedImages = JSON.parse(images);

    if (!parsedImages.length) {
      return res.status(400).json({ success: false, message: "Please upload images" });
    }

    const blog = await blogModel.create({
      title,
      desc,
      images: parsedImages // direct array of URLs
    });

    return res.status(201).json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    console.log("Blog Create Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


const updateBlogCtrl = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, desc, type } = req.body;
    let images = req.body.images ? JSON.parse(req.body.images) : []; // images array from frontend
    console.log(req.body)
    // Validate required fields
    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Find existing blog
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Handle newly uploaded files if any
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) =>
          uploadImageToCloudinary(file, process.env.FOLDER_NAME)
        )
      );

      const uploadedUrls = uploadedImages.map((img) => img.secure_url);
      // Merge existing images with new uploads
      images = [...blog.images || [], ...uploadedUrls].slice(0, 10); // max 10 images
    } else if (!images.length) {
      // If no images provided and no existing images, fallback to empty array
      images = blog.images || [];
    }

    // Update blog
    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        title,
        desc,
        type,
        images,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully!",
      blog: updatedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in update blog API!",
    });
  }
};



const getAllBlogsCtrl = async (req, res) => {
  try {

    const blogs = await blogModel.find({});
    if (!blogs) {
      return res.status(400).json({
        success: false,
        message: "No blog found"
      })
    }
    return res.status(200).json({
      success: true,
      totalBlogs: blogs.length,
      blogs
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting blog api!"
    })
  }
}
const getSingleBlogsCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(400).json({
        success: false,
        message: "No blog found"
      })
    }
    return res.status(200).json({
      success: true,

      blog
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting single  blog api!"
    })
  }
}
const deleteBlogCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    await blogModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Blog delete successfully!"
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in deleting blog api!"
    })
  }
}
module.exports = { createBlogsCtrl, getAllBlogsCtrl, deleteBlogCtrl, getSingleBlogsCtrl, updateBlogCtrl };