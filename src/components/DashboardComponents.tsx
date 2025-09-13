import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  TrendingUp,
  Eye,
  Calendar,
  Users,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";

interface RecentActivity {
  id: string;
  type: 'property_listed' | 'property_viewed' | 'inquiry_received';
  title: string;
  date: string;
  status?: string;
}

interface PropertyPerformance {
  propertyId: string;
  title: string;
  views: number;
  inquiries: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

const RecentActivityCard = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'property_listed',
      title: 'Urban Oasis',
      date: '9/12/2025',
      status: 'Active'
    },
    {
      id: '2',
      type: 'property_listed',
      title: 'Indian Karun Kuruvai Rice, PP Bag, Organic',
      date: '9/13/2025',
      status: 'Active'
    },
    {
      id: '3',
      type: 'property_listed',
      title: 'Metabolic Powder Supplement, Prescription',
      date: '9/13/2025',
      status: 'Active'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property_listed':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'property_viewed':
        return <Eye className="h-4 w-4 text-green-600" />;
      case 'inquiry_received':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'property_listed':
        return 'bg-blue-50';
      case 'property_viewed':
        return 'bg-green-50';
      case 'inquiry_received':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className={`p-2 rounded-full ${getActivityBg(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Property Listed
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  {activity.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1 truncate">
                {activity.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{activity.date}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const PropertyPerformanceCard = () => {
  const [performance, setPerformance] = useState<PropertyPerformance[]>([
    {
      propertyId: '1',
      title: 'Urban Oasis',
      views: 1250,
      inquiries: 23,
      trend: 'up',
      changePercent: 15.2
    },
    {
      propertyId: '2',
      title: 'Organic Rice Collection',
      views: 890,
      inquiries: 12,
      trend: 'up',
      changePercent: 8.7
    },
    {
      propertyId: '3',
      title: 'Health Supplements',
      views: 654,
      inquiries: 8,
      trend: 'down',
      changePercent: -3.2
    }
  ]);

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Property Performance
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
            Analytics
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Track your property views and inquiries
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {performance.map((property) => (
          <div
            key={property.propertyId}
            className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 truncate flex-1 mr-2">
                {property.title}
              </h4>
              <div className={`flex items-center gap-1 ${getTrendColor(property.trend)}`}>
                {getTrendIcon(property.trend)}
                <span className="text-sm font-medium">
                  {property.changePercent > 0 ? '+' : ''}{property.changePercent}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Eye className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {property.views.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Users className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Inquiries</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {property.inquiries}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export { RecentActivityCard, PropertyPerformanceCard };