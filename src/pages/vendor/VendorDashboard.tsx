import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
  Calendar,
  Bell,
  Users,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getVendorPropertyAPI } from "@/service/operations/property";
import { toast } from "sonner";

const VendorDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "My Properties",
      value: "0",
      change: "+0 this month",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: "0",
      change: "+0% this week",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Inquiries",
      value: "0",
      change: "+0 new",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Listings",
      value: "0",
      change: "Currently live",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]);

  const fetchVendorProperties = async () => {
    try {
      setLoading(true);
      const response = await getVendorPropertyAPI({ vendor: user?._id });
      setProperties(response || []);

      // Calculate actual stats
      const totalProperties = response?.length || 0;
      const totalViews =
        response?.reduce((sum, property) => sum + (property.views || 0), 0) ||
        0;
      const activeListings =
        response?.filter((property: any) => property.status !== "inactive")
          ?.length || 0;
      const thisMonthProperties =
        response?.filter((property: any) => {
          if (!property?.createdAt) return false;
          const createdDate = new Date(property.createdAt);
          const currentDate = new Date();
          return (
            createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear()
          );
        })?.length || 0;

      setStats([
        {
          title: "My Properties",
          value: totalProperties.toString(),
          change: `+${thisMonthProperties} this month`,
          icon: Building2,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Total Views",
          value:
            totalViews > 999
              ? `${(totalViews / 1000).toFixed(1)}K`
              : totalViews.toString(),
          change: "+0% this week",
          icon: Eye,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Inquiries",
          value: "0",
          change: "+0 new",
          icon: MessageSquare,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Active Listings",
          value: activeListings.toString(),
          change: "Currently live",
          icon: Users,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ]);
    } catch (error) {
      console.error("Error fetching vendor properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchVendorProperties();
    }
  }, [user]);

  const quickActions = [
    {
      title: "Add New Property",
      description: "List a new property for rent or sale",
      icon: Plus,
      link: "/vendor/add-property",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Properties",
      description: "Manage your existing property listings",
      icon: Building2,
      link: "/vendor/properties",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Check Inquiries",
      description: "Respond to customer inquiries",
      icon: MessageSquare,
      link: "/vendor/inquiries",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  // Recent Activities
  const recentActivities = [
    ...properties.slice(0, 2).map((property: any) => ({
      id: property._id,
      title: "Property Listed",
      description: property.title,
      time: new Date(property.createdAt).toLocaleDateString(),
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      views: property.views || 0,
      type: "listing",
    })),
    ...properties
      .filter((p: any) => p.views > 0)
      .slice(0, 1)
      .map((property: any) => ({
        id: `view-${property._id}`,
        title: "Property Viewed",
        description: `${property.title} - ${property.views} views`,
        time: "Today",
        icon: Eye,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        views: property.views,
        type: "view",
      })),
  ].slice(0, 3);

  // Performance data (calculated safely from state)
  const totalProperties = properties?.length || 0;
  const totalViews =
    properties?.reduce((sum, property) => sum + (property?.views || 0), 0) || 0;
  const activeListings =
    properties?.filter((property) => property?.status !== "inactive")?.length ||
    0;
  const thisMonthProperties =
    properties?.filter((property) => {
      if (!property?.createdAt) return false;
      const createdDate = new Date(property.createdAt);
      const currentDate = new Date();
      return (
        createdDate.getMonth() === currentDate.getMonth() &&
        createdDate.getFullYear() === currentDate.getFullYear()
      );
    })?.length || 0;

  const performanceData = {
    totalViews,
    totalProperties,
    activeListings,
    thisMonthProperties,
    averageViews:
      totalProperties > 0 ? Math.round(totalViews / totalProperties) : 0,
    topProperty: properties.reduce(
      (prev, current) =>
        (prev?.views || 0) > (current?.views || 0) ? prev : current,
      properties[0] || {}
    ),
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back,{" "}
              {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)}! 👋
            </h1>
            <p className="text-green-100">
              Manage your properties and grow your business with us.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    )}
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${stat.bgColor} transition-all duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
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
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg ${action.color} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action.description}
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`p-2 ${activity.bgColor} rounded-full`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Property Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Property Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Average Views
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        {performanceData.averageViews}
                      </p>
                      <p className="text-xs text-blue-600">per property</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        Total Views
                      </p>
                      <p className="text-2xl font-bold text-green-800">
                        {performanceData.totalViews}
                      </p>
                      <p className="text-xs text-green-600">all properties</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">
                        Active Listings
                      </p>
                      <p className="text-2xl font-bold text-purple-800">
                        {performanceData.activeListings}
                      </p>
                      <p className="text-xs text-purple-600">currently live</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Top Performing Property */}
              {performanceData.topProperty?.title && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Top Performing Property
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {performanceData.topProperty.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {performanceData.topProperty.views || 0} views
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Best Performer
                    </Badge>
                  </div>
                </div>
              )}

              {/* Recent Properties Performance */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Recent Properties Performance
                </h4>
                <div className="space-y-2">
                  {properties.slice(0, 5).map((property: any) => (
                    <div
                      key={property._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {property.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Listed on{" "}
                          {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {property.views || 0} views
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  ((property.views || 0) /
                                    Math.max(performanceData.totalViews, 1)) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Performance Analytics
                </p>
                <p className="text-sm text-gray-500">
                  Add properties to see performance data
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
