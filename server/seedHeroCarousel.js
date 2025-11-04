const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { cloudinaryConnect } = require("./config/cloudinary");
const cloudinary = require("cloudinary").v2;
const HeroCarousel = require("./models/heroCarouselModel");

dotenv.config();

async function seedHeroCarousel() {
  try {
    await connectDB();
    cloudinaryConnect();

    const existing = await HeroCarousel.find({});
    if (existing && existing.length > 0) {
      console.log(`Hero carousel already has ${existing.length} items. Skipping seeding.`);
      process.exit(0);
    }

    const assets = [
      {
        file: path.join(__dirname, "../src/assets/hero-banner.jpg"),
        title: "Find What You Need",
        subtitle: "All listings in one place",
        description: "Connect with trusted businesses near you.",
        gradient: "from-purple-900/40 via-blue-900/30 to-black/20",
        buttonText: "Explore Now",
        buttonLink: "/business-listing",
        order: 1,
      },
      {
        file: path.join(__dirname, "../src/assets/5.png"),
        title: "Buy • Sell • Rent",
        subtitle: "Post & discover instantly",
        description: "Browse verified listings and contact sellers fast.",
        gradient: "from-indigo-900/40 via-purple-900/30 to-pink-900/20",
        buttonText: "Start Browsing",
        buttonLink: "/business-listing",
        order: 2,
      },
      {
        file: path.join(__dirname, "../src/assets/2.png"),
        title: "Connect & Grow",
        subtitle: "Start your journey here",
        description: "Join thousands of successful businesses.",
        gradient: "from-emerald-900/40 via-teal-900/30 to-cyan-900/20",
        buttonText: "Join Now",
        buttonLink: "/vendor/register",
        order: 3,
      },
    ];

    const created = [];
    for (const item of assets) {
      try {
        const upload = await cloudinary.uploader.upload(item.file, {
          folder: "hero-carousel",
          height: 700,
          quality: 80,
          resource_type: "image",
        });
        const doc = await HeroCarousel.create({
          image: upload?.secure_url || upload?.url,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          buttonText: item.buttonText,
          buttonLink: item.buttonLink,
          gradient: item.gradient,
          order: item.order,
          isActive: true,
        });
        created.push(doc);
        console.log(`Created hero item: ${doc.title} (${doc._id})`);
      } catch (e) {
        console.error("Failed to create hero item", e);
      }
    }

    console.log(`Seeding complete. Created ${created.length} items.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedHeroCarousel();