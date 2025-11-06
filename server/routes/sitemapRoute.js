const express = require("express");
const router = express.Router();
const Business = require("../models/businessModel");
const Blog = require("../models/blogModel");

const SITE_URL = process.env.SITE_URL || "https://businessgurujee.com"; // Frontend base URL

function formatDateISO(date) {
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find({}).select("_id updatedAt").lean();
    const blogs = await Blog.find({}).select("_id updatedAt createdAt").lean();

    const staticUrls = [
      { loc: `${SITE_URL}/`, changefreq: "weekly", priority: 1.0, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/business-listing`, changefreq: "daily", priority: 0.9, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/properties`, changefreq: "weekly", priority: 0.7, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/blogs`, changefreq: "daily", priority: 0.8, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/contact`, changefreq: "monthly", priority: 0.5, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/add-business`, changefreq: "monthly", priority: 0.6, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/user/login`, changefreq: "monthly", priority: 0.4, lastmod: formatDateISO(new Date()) },
      { loc: `${SITE_URL}/user/register`, changefreq: "monthly", priority: 0.4, lastmod: formatDateISO(new Date()) },
    ];

    const businessUrls = businesses.map((b) => ({
      loc: `${SITE_URL}/business/${b._id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: formatDateISO(b.updatedAt || new Date()),
    }));

    // Exclude admin/vendor pages by not including any /admin or /vendor URLs.

    const blogUrls = blogs.map((b) => ({
      loc: `${SITE_URL}/blog/${b._id}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: formatDateISO(b.updatedAt || b.createdAt || new Date()),
    }));

    const urls = [...staticUrls, ...businessUrls, ...blogUrls];
    const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    return res.status(200).send(urlset);
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return res.status(500).send("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Failed to generate sitemap</error>");
  }
});

module.exports = router;