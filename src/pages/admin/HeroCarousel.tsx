import React, { useEffect, useState } from "react";
import { apiConnector } from "@/service/apiConnector";
import { heroCarousel } from "@/service/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

type HeroItem = {
  _id: string;
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  gradient?: string;
  order?: number;
  isActive: boolean;
};

const initialForm = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  gradient: "from-purple-900/40 via-blue-900/30 to-black/20",
  order: 1,
};

const HeroCarousel: React.FC = () => {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", heroCarousel.LIST);
      if (res?.data?.success) {
        setItems(res.data.items || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load hero carousel items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Image is required");
      return;
    }
    if (!form.title && !form.subtitle && !form.description) {
      toast.error("At least one text field is required");
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("description", form.description);
      fd.append("buttonText", form.buttonText);
      fd.append("buttonLink", form.buttonLink);
      fd.append("gradient", form.gradient);
      fd.append("order", String(form.order || 1));

      const res = await apiConnector("POST", heroCarousel.CREATE, fd, {
        "Content-Type": "multipart/form-data",
      });
      if (res?.data?.success) {
        toast.success("Banner added");
        setForm(initialForm);
        setImageFile(null);
        fetchItems();
      } else {
        toast.error(res?.data?.message || "Failed to add banner");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to add banner");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await apiConnector("PATCH", heroCarousel.TOGGLE(id), {
        isActive: !isActive,
      });
      if (res?.data?.success) {
        toast.success("Status updated");
        setItems((prev) => prev.map((it) => (it._id === id ? { ...it, isActive: !isActive } : it)));
      } else {
        toast.error(res?.data?.message || "Failed to update status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await apiConnector("DELETE", heroCarousel.DELETE(id));
      if (res?.data?.success) {
        toast.success("Banner deleted");
        setItems((prev) => prev.filter((it) => it._id !== id));
      } else {
        toast.error(res?.data?.message || "Failed to delete banner");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-1">Hero Carousel</h2>
        <p className="text-sm text-gray-600 mb-6">
          Recommended image size: <strong>1920 x 700</strong> (JPG/PNG, under 500KB). Without image or text, banners are not shown.
        </p>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Main heading"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Secondary heading"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description"
              className="min-h-24"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Button Text</label>
            <Input
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Button Link</label>
            <Input
              value={form.buttonLink}
              onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
              placeholder="https://... (optional)"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Order</label>
            <Input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Gradient (Tailwind)</label>
            <Input
              value={form.gradient}
              onChange={(e) => setForm({ ...form, gradient: e.target.value })}
              placeholder="from-purple-900/40 via-blue-900/30 to-black/20"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-500 mt-1">Only JPG/PNG. Ideal 1920x700. Smaller images are auto-fit.</p>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end">
            <Button type="submit" disabled={creating}>
              {creating ? "Adding..." : "Add Banner"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Existing Banners</h3>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">No banners added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item) => (
                <div key={item._id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-[16/6] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title || "Banner"} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.title || item.subtitle || "Untitled"}</div>
                        <div className="text-xs text-gray-500">Order: {item.order || 0}</div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" onClick={() => toggleActive(item._id, item.isActive)}>
                        {item.isActive ? "Mark Inactive" : "Mark Active"}
                      </Button>
                      <Button variant="destructive" onClick={() => deleteItem(item._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;