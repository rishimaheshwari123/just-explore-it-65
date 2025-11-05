import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Phone,
  Clock,
  Users,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { business } from "../../service/apis";

interface Business {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  businessType: string;
  fullAddress: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
  status: {
    isOpen: boolean;
    message: string;
  };
  verified: boolean;
  createdAt: string;
  images: { url: string }[];
  features: string[];
  services: {
    name: string;
    price: number;
    description: string;
  }[];
  isPremium?: boolean;
  currentSubscription?: {
    planName: string;
    startDate: string;
    endDate: string;
    status: string;
    price: number;
  };
}

const VendorBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { user } = useSelector((state: RootState) => state.auth);
  const vendorId = user?._id;

  const fetchVendorBusinesses = async () => {
    if (!vendorId) {
      toast.error("Vendor ID not found");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${business.GET_VENDOR_BUSINESS_API}/${vendorId}`
      );
      const data = await response.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
      } else {
        toast.error("Failed to load businesses");
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchVendorBusinesses();
  }, [vendorId]);

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm("Delete this business permanently?")) return;
    try {
      const response = await fetch(
        `${business.DELETE_BUSINESS_API}/${businessId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      if (data.success) {
        setBusinesses((prev) => prev.filter((b) => b._id !== businessId));
        toast.success("Business deleted!");
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting business");
    }
  };

  const handleEditBusiness = (id: string) => {
    window.location.href = `/vendor/edit-business/${id}`;
  };

  const getStatusColor = (status: { isOpen: boolean }) =>
    status.isOpen
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredBusinesses = businesses.filter((b) => {
    const matchSearch =
      b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "all" || b.category === filterCategory;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && b.status.isOpen) ||
      (filterStatus === "pending" && !b.status.isOpen);
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Businesses</h1>
              <p className="text-gray-600">
                Manage your businesses and subscriptions.
              </p>
            </div>
          </div>
          <Link to="/vendor/add-business">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Food & Dining">Food & Dining</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Business Cards */}
        {filteredBusinesses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No businesses yet</h3>
              <p className="text-gray-600 mb-4">
                Add your first business to get started.
              </p>
              <Link to="/vendor/add-business">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((b) => {
              const hasSubscription = b.currentSubscription;
              const isExpired =
                hasSubscription &&
                new Date(b.currentSubscription!.endDate) < new Date();

              return (
                <Card key={b._id} className="hover:shadow-lg transition">
                  <CardHeader>
                    {b.images?.length > 0 && (
                      <img
                        src={b.images[0].url}
                        alt={b.businessName}
                        className="w-full h-44 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {b.isPremium && (
                            <Crown
                              className="h-4 w-4 text-yellow-500"
                              title="Premium Business"
                            />
                          )}
                          <CardTitle className="text-lg font-semibold">
                            {b.businessName}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-gray-600">
                          {b.category} • {b.businessType}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(b.status)}>
                        {b.status.isOpen ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {b.description}
                    </p>
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {b.fullAddress}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" /> {b.contactInfo.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {b.ratings?.average || 0} ({b.ratings?.totalReviews || 0} reviews)
                      </div>
                    </div>

                    {/* ✅ Subscription Section */}
                    <div className="mt-4">
                      {hasSubscription ? (
                        <div
                          className={`rounded-lg border p-2 text-center ${
                            isExpired
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-green-50 border-green-200 text-green-700"
                          }`}
                        >
                          <p className="text-sm font-semibold flex items-center justify-center gap-1">
                            <Crown className="h-4 w-4" />
                            {b.currentSubscription?.planName}
                          </p>
                          <p className="text-xs">
                            {isExpired
                              ? "Expired on"
                              : "Expires on"}{" "}
                            {new Date(
                              b.currentSubscription!.endDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <Link to={`/subscription/${b._id}`} className="block">
                          <Button
                            size="sm"
                            className="w-full mt-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          >
                            <Crown className="h-4 w-4 mr-1" />
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* If expired, show renew */}
                    {isExpired && (
                      <Link to={`/subscription/${b._id}`} className="block mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-orange-600 border-orange-400"
                        >
                          Renew Plan
                        </Button>
                      </Link>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Link to={`/business/${b._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleEditBusiness(b._id)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteBusiness(b._id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorBusinesses;
