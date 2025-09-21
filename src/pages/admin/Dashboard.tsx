import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  Eye,
  Plus,
  BarChart3,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPropertyAPI } from "@/service/operations/property";
import { getAllVendorAPI } from "@/service/operations/vendor";
import { toast } from "sonner";
import {
  RecentActivityCard,
  PropertyPerformanceCard,
} from "@/components/DashboardComponents";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [properties, setProperties] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total Properties",
      value: "0",
      change: "+0%",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Vendors",
      value: "0",
      change: "+0%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Blog Posts",
      value: "0",
      change: "+0%",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Monthly Views",
      value: "0",
      change: "+0%",
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [propertiesResponse, vendorsResponse] = await Promise.all([
        getAllPropertyAPI(),
        getAllVendorAPI(),
      ]);

      setProperties(propertiesResponse || []);
      setVendors(vendorsResponse || []);

      // Calculate actual stats
      const totalProperties = propertiesResponse?.length || 0;
      const activeVendors =
        vendorsResponse?.filter((vendor: any) => vendor?.status === "approved")
          ?.length || 0;
      const totalViews =
        propertiesResponse?.reduce(
          (sum: number, property: any) => sum + (property?.views || 0),
          0
        ) || 0;

      const thisMonthProperties =
        propertiesResponse?.filter((property: any) => {
          const createdDate = property?.createdAt
            ? new Date(property.createdAt)
            : null;
          const currentDate = new Date();
          return (
            createdDate &&
            createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear()
          );
        })?.length || 0;

      const lastMonthProperties =
        propertiesResponse?.filter((property: any) => {
          const createdDate = property?.createdAt
            ? new Date(property.createdAt)
            : null;
          const currentDate = new Date();
          const lastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1
          );
          return (
            createdDate &&
            createdDate.getMonth() === lastMonth.getMonth() &&
            createdDate.getFullYear() === lastMonth.getFullYear()
          );
        })?.length || 0;

      const propertyGrowth =
        lastMonthProperties > 0
          ? Math.round(
              ((thisMonthProperties - lastMonthProperties) /
                lastMonthProperties) *
                100
            )
          : 0;

      setStats([
        {
          title: "Total Properties",
          value: totalProperties.toString(),
          change: `+${propertyGrowth}%`,
          icon: Building2,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Active Vendors",
          value: activeVendors.toString(),
          change: "+0%",
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Blog Posts",
          value: "0",
          change: "+0%",
          icon: FileText,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Monthly Views",
          value:
            totalViews > 999
              ? `${(totalViews / 1000).toFixed(1)}K`
              : totalViews.toString(),
          change: "+0%",
          icon: Eye,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Manage Vendors",
      description: "View and manage vendor accounts",
      icon: Users,
      link: "/admin/vendors",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Manage Businesses",
      description: "View and manage business listings",
      icon: Building2,
      link: "/admin/businesses",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Add New Blog",
      description: "Create and publish new blog posts",
      icon: Plus,
      link: "/admin/add-blog",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back,{" "}
              {user?.name
                ? user?.name.charAt(0).toUpperCase() + user?.name.slice(1)
                : "User"}
              ! 👋
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your platform today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat?.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat?.title}
                    </p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-1"></div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {stat?.value}
                      </p>
                    )}
                    <p className="text-sm text-green-600 mt-1">
                      {stat?.change} from last month
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${stat?.bgColor} transition-all duration-300`}
                  >
                    {IconComponent && (
                      <IconComponent className={`h-6 w-6 ${stat?.color}`} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action?.icon;
              return (
                <Link key={index} to={action?.link || "#"}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg ${action?.color} text-white`}
                        >
                          {Icon && <Icon className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {action?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action?.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <PropertyPerformanceCard />
      </div>
    </div>
  );
};

export default Dashboard;
