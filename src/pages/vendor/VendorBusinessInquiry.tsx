import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
  Mail,
  Search,
  Filter,
  Clock,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface BusinessInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType:
    | "general"
    | "service"
    | "pricing"
    | "booking"
    | "complaint"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "new"
    | "read"
    | "replied"
    | "in_progress"
    | "resolved"
    | "closed";
  preferredContact: string;
  bestTimeToContact: string;
  createdAt: string;
  business?: {
    _id?: string;
    businessName?: string;
    category?: string;
    images?: Array<{ url?: string; isPrimary?: boolean }>;
    subscriptions?: Array<{
      subscriptionId?: string;
      planName?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      price?: number;
    }>;
  } | null;
  customerLocation?: {
    city?: string;
    area?: string;
    pincode?: string;
  };
}

const VendorBusinessInquiry = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (user?._id) fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "https://server.businessgurujee.com/api/v1";
      const res = await fetch(`${BASE_URL}/inquiry/vendor/${user?._id}`);
      const data = await res.json();

      if (data?.success) {
        const sorted = data?.inquiries?.sort(
          (a: BusinessInquiry, b: BusinessInquiry) => {
            if (a?.status === "new" && b?.status !== "new") return -1;
            if (b?.status === "new" && a?.status !== "new") return 1;
            return (
              new Date(b?.createdAt).getTime() -
              new Date(a?.createdAt).getTime()
            );
          }
        );
        setInquiries(sorted || []);
      } else toast.error("Failed to fetch inquiries");
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      toast.error("Something went wrong while fetching inquiries");
    } finally {
      setLoading(false);
    }
  };

  const getBusinessImage = (inq: BusinessInquiry) => {
    const img = inq?.business?.images;
    if (!img?.length)
      return "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=60";
    const primary = img.find((i) => i?.isPrimary);
    return primary?.url || img?.[0]?.url;
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const filtered = inquiries?.filter((inq) => {
    const matchSearch =
      inq?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      inq?.subject?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      inq?.business?.businessName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      inq?.email?.toLowerCase()?.includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || inq?.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-6 animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Inquiries
            </h1>
            <p className="text-gray-600">
              Manage customer inquiries for your businesses
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inquiry List */}
        {filtered?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-600">
                Customer inquiries will appear here when they contact your
                businesses.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered?.map((inquiry) => {
              const hasActiveSubscription =
                inquiry?.business?.subscriptions?.some(
                  (sub) => sub?.status === "active"
                );

              return (
                <Card
                  key={inquiry?._id}
                  className={`hover:shadow-md transition-shadow ${
                    inquiry?.status === "new"
                      ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={getBusinessImage(inquiry)}
                          alt={inquiry?.business?.businessName || "Business"}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {inquiry?.business?.businessName || "Unknown Business"}
                            </CardTitle>
                            {hasActiveSubscription ? (
                              <Badge className="bg-green-100 text-green-800">
                                Active Plan
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                No Active Plan
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm text-gray-600">
                            Category: {inquiry?.business?.category || "N/A"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {hasActiveSubscription ? (
                      <>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <User className="h-4 w-4" /> {inquiry?.name}
                          <Mail className="h-4 w-4 ml-3" /> {inquiry?.email}
                          <Phone className="h-4 w-4 ml-3" /> {inquiry?.phone}
                          <Clock className="h-4 w-4 ml-3" />{" "}
                          {formatDate(inquiry?.createdAt)}
                          {inquiry?.customerLocation?.city && (
                            <>
                              <MapPin className="h-4 w-4 ml-3" />{" "}
                              {inquiry?.customerLocation?.city}
                            </>
                          )}
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-gray-700 line-clamp-3">
                            {inquiry?.message || "No message provided."}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-yellow-800">
                        Please upgrade your plan to view inquiry details.
                        <div className="mt-3">
                          <Button
                            onClick={() =>
                              (window.location.href = `/subscription/${inquiry?.business?._id}`)
                            }
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                          >
                            Upgrade Plan
                          </Button>
                        </div>
                      </div>
                    )}
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

export default VendorBusinessInquiry;
