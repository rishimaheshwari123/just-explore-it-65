const { uploadImageToCloudinary } = require("../config/imageUploader");
const HeroCarousel = require("../models/heroCarouselModel");

// Create a new hero carousel item
exports.createHeroItem = async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink, gradient, order } = req.body;
    const imageFile = req.files?.image;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Ensure at least some text is provided; otherwise do not allow creation
    if (!title && !subtitle && !description) {
      return res.status(400).json({ success: false, message: "Provide at least one text field (title/subtitle/description)" });
    }

    const uploaded = await uploadImageToCloudinary(imageFile, process.env.FOLDER_NAME);

    const item = await HeroCarousel.create({
      image: uploaded.secure_url,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      gradient,
      order: order ?? 0,
      isActive: true,
    });

    return res.status(201).json({ success: true, message: "Hero carousel item created", item });
  } catch (error) {
    console.error("createHeroItem error", error);
    return res.status(500).json({ success: false, message: "Failed to create hero item" });
  }
};

// Get all items (optionally only active)
exports.getHeroItems = async (req, res) => {
  try {
    const { onlyActive } = req.query;
    const query = onlyActive === "true" ? { isActive: true } : {};
    const items = await HeroCarousel.find(query).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("getHeroItems error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch hero items" });
  }
};

// Update an item (replace image optional)
exports.updateHeroItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, buttonText, buttonLink, gradient, order } = req.body;
    const imageFile = req.files?.image;

    const update = { title, subtitle, description, buttonText, buttonLink, gradient };
    if (order !== undefined) update.order = order;

    if (imageFile) {
      const uploaded = await uploadImageToCloudinary(imageFile, process.env.FOLDER_NAME);
      update.image = uploaded.secure_url;
    }

    // If all text fields are empty, mark inactive
    if (!title && !subtitle && !description) {
      update.isActive = false;
    }

    const item = await HeroCarousel.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, message: "Hero item updated", item });
  } catch (error) {
    console.error("updateHeroItem error", error);
    return res.status(500).json({ success: false, message: "Failed to update hero item" });
  }
};

// Toggle active state
exports.toggleHeroItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await HeroCarousel.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    item.isActive = !item.isActive;
    await item.save();
    return res.status(200).json({ success: true, message: "Toggled active state", item });
  } catch (error) {
    console.error("toggleHeroItem error", error);
    return res.status(500).json({ success: false, message: "Failed to toggle hero item" });
  }
};

// Delete
exports.deleteHeroItem = async (req, res) => {
  try {
    const { id } = req.params;
    await HeroCarousel.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Hero item deleted" });
  } catch (error) {
    console.error("deleteHeroItem error", error);
    return res.status(500).json({ success: false, message: "Failed to delete hero item" });
  }
};