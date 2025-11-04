const mongoose = require("mongoose");

const heroCarouselSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    buttonText: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    gradient: { type: String, default: "from-purple-900/40 via-blue-900/30 to-black/20" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroCarousel", heroCarouselSchema);