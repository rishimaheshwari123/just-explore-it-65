import fs from "fs/promises";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// Load env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Base site URL where the frontend is served
const SITE_URL = process.env.SITE_URL || "https://businessgurujee.com";

// Backend API base to fetch business listings
const API_BASE = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || "https://server.businessgurujee.com/api/v1";

// Resolve output path inside public
const OUTPUT_PATH = path.resolve(process.cwd(), "public", "sitemap.xml");

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlTag(loc, lastmod = new Date(), changefreq = "weekly", priority = 0.7) {
  const iso = new Date(lastmod).toISOString();
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${iso}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function fetchBusinesses() {
  // Try to get a large page to cover most listings
  const url = `${API_BASE}/property/businesses?limit=5000`;
  const { data } = await axios.get(url);

  // Support both {success, data} and direct array forms
  const list = Array.isArray(data) ? data : (data?.data || data?.businesses || []);
  return list;
}

async function fetchBlogs() {
  const url = `${API_BASE}/blog/getAll`;
  const { data } = await axios.get(url);
  // API returns something like { success, data: [...] } or direct array
  const list = Array.isArray(data) ? data : (data?.data || data?.blogs || []);
  return list;
}

async function generate() {
  console.log("[sitemap] Generating sitemap.xml from frontend...");
  const staticRoutes = [
    "/",
    "/business-listing",
    "/blogs",
    "/contact",
    "/add-business",
    "/user/login",
    "/user/register",
  ];

  let urls = [];

  // Add static routes
  urls.push(...staticRoutes.map((r) => urlTag(`${SITE_URL}${r}`, new Date(), "weekly", 0.8)));

  // Fetch businesses and add dynamic detail pages
  try {
    const businesses = await fetchBusinesses();
    console.log(`[sitemap] Businesses fetched: ${businesses.length}`);

    businesses.forEach((b) => {
      const id = b?._id || b?.id;
      if (!id) return;
      const createdAt = b?.createdAt || new Date();
      const loc = `${SITE_URL}/business/${id}`;
      urls.push(urlTag(loc, createdAt, "daily", 0.9));
    });
  } catch (err) {
    console.error("[sitemap] Failed to fetch businesses:", err?.message || err);
  }

  // Fetch blogs and add dynamic blog detail pages
  try {
    const blogs = await fetchBlogs();
    console.log(`[sitemap] Blogs fetched: ${blogs.length}`);

    blogs.forEach((b) => {
      const id = b?._id || b?.id;
      if (!id) return;
      const updatedAt = b?.updatedAt || b?.createdAt || new Date();
      const loc = `${SITE_URL}/blog/${id}`;
      urls.push(urlTag(loc, updatedAt, "weekly", 0.7));
    });
  } catch (err) {
    console.error("[sitemap] Failed to fetch blogs:", err?.message || err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join("\n") +
    "\n</urlset>\n";

  await fs.writeFile(OUTPUT_PATH, xml, "utf-8");
  console.log(`[sitemap] Written: ${OUTPUT_PATH}`);
}

generate().catch((e) => {
  console.error("[sitemap] Unhandled error:", e);
  process.exitCode = 1;
});