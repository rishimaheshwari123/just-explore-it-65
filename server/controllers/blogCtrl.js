const { uploadImageToCloudinary } = require("../config/imageUploader");
const blogModel = require("../models/blogModel")

const createBlogsCtrl = async (req, res) => {
  try {
    const { title, subtitle, slug, desc, keywords, tags } = req.body;

    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    // Normalize keywords and tags (accept comma-separated strings or arrays)
    const normalizeList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
      return String(val)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    };
    const keywordsList = normalizeList(keywords);
    const tagsList = normalizeList(tags);

    // Handle images: support `image` (single) and `images` (multiple)
    let uploadedImages = [];
    const files = req.files || {};
    let imageField = files.image || null;
    const imagesField = files.images || null;

    // If multiple images are provided
    if (imagesField) {
      const imagesArray = Array.isArray(imagesField) ? imagesField : [imagesField];
      for (const img of imagesArray) {
        const uploaded = await uploadImageToCloudinary(img, process.env.FOLDER_NAME);
        uploadedImages.push(uploaded.secure_url);
      }
    }

    // If only single image is provided
    if (imageField && uploadedImages.length === 0) {
      const uploaded = await uploadImageToCloudinary(imageField, process.env.FOLDER_NAME);
      uploadedImages.push(uploaded.secure_url);
    }

    const blog = await blogModel.create({
      title,
      subtitle,
      slug,
      desc,
      keywords: keywordsList,
      tags: tagsList,
      image: uploadedImages[0] || undefined,
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in create blog api!",
    });
  }
};

const updateBlogCtrl = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, subtitle, slug, desc, keywords, tags } = req.body;

    // Validate required fields
    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Normalize keywords and tags
    const normalizeList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
      return String(val)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    };
    const keywordsList = normalizeList(keywords);
    const tagsList = normalizeList(tags);

    // Handle images update
    const files = req.files || {};
    let newImages = [];
    const imageField = files.image || null;
    const imagesField = files.images || null;

    if (imagesField) {
      const imagesArray = Array.isArray(imagesField) ? imagesField : [imagesField];
      for (const img of imagesArray) {
        const uploaded = await uploadImageToCloudinary(img, process.env.FOLDER_NAME);
        newImages.push(uploaded.secure_url);
      }
    }

    if (imageField && newImages.length === 0) {
      const uploaded = await uploadImageToCloudinary(imageField, process.env.FOLDER_NAME);
      newImages.push(uploaded.secure_url);
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        title,
        subtitle,
        slug,
        desc,
        keywords: keywordsList,
        tags: tagsList,
        image: newImages.length ? newImages[0] : blog.image,
        images: newImages.length ? newImages : blog.images,
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
    return res.status(500).send({
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