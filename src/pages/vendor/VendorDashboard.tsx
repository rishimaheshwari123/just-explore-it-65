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
// Property API import removed
import { toast } from 'sonner';

const VendorDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [thisMonthProperties, setThisMonthProperties] = useState(0);
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
      // Property API call removed - focusing on business only
      setProperties(response || []);

      // Calculate actual stats
      const calculatedTotalProperties = response?.length || 0;
      // Property calculations removed - focusing on business metrics only
      const calculatedTotalViews = 0;
      const calculatedActiveListings = 0;
      const calculatedThisMonthProperties = 0;
      
      // Update state variables
      setTotalProperties(calculatedTotalProperties);
      setTotalViews(calculatedTotalViews);
      setActiveListings(calculatedActiveListings);
      setThisMonthProperties(calculatedThisMonthProperties);
      
      setStats([
        {
          title: "My Properties",
          value: calculatedTotalProperties.toString(),
          change: `+${calculatedThisMonthProperties} this month`,
          icon: Building2,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Total Views",
          value: calculatedTotalViews > 999 ? `${(calculatedTotalViews/1000).toFixed(1)}K` : calculatedTotalViews.toString(),
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
          value: calculatedActiveListings.toString(),
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
    // Property quick actions removed
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
    // Property activities removed
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
    totalViews: totalViews,
    totalProperties: totalProperties,
    activeListings: activeListings,
    thisMonthProperties: thisMonthProperties,
    averageViews: totalProperties > 0 ? Math.round(totalViews / totalProperties) : 0,
    topProperty: null // Property analytics removed
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

      {/* Business Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Business Analytics</p>
              <p className="text-sm text-gray-500">Focus on business listings and performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
