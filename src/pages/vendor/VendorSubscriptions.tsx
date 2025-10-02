import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Crown, Calendar, DollarSign, CheckCircle, XCircle, Clock, Star, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Subscription {
  _id: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  status: 'active' | 'expired' | 'cancelled';
  features: string[];
  priority: number;
}

interface Business {
  _id: string;
  businessName: string;
  category: string;
  isPremium: boolean;
  subscriptions: Subscription[];
  currentSubscription?: {
    planName: string;
    status: string;
    endDate: string;
    priority: number;
  };
}

const VendorSubscriptions = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchVendorBusinesses();
  }, []);

  const fetchVendorBusinesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://server.businessgurujee.com/api/v1/property/businesses/vendor/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBusinesses(response.data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 3:
        return <Badge className="bg-purple-100 text-purple-800"><Star className="w-3 h-3 mr-1" />Enterprise Elite</Badge>;
      case 2:
        return <Badge className="bg-blue-100 text-blue-800"><Star className="w-3 h-3 mr-1" />Business Pro</Badge>;
      case 1:
        return <Badge className="bg-orange-100 text-orange-800"><Star className="w-3 h-3 mr-1" />Basic Premium</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">No Plan</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isSubscriptionExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-8 h-8 text-purple-600" />
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your business subscriptions and upgrade plans</p>
        </div>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Businesses Found</h3>
            <p className="text-gray-600 text-center mb-4">
              You don't have any businesses yet. Add a business to start managing subscriptions.
            </p>
            <Button onClick={() => window.location.href = '/vendor/add-business'}>
              Add Your First Business
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {businesses.map((business) => (
            <Card key={business._id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      {business.businessName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{business.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {business.isPremium && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {business.currentSubscription && getPriorityBadge(business.currentSubscription.priority)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {business.currentSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h4 className="font-semibold text-green-800">Current Subscription</h4>
                        <p className="text-sm text-green-600">{business.currentSubscription.planName}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(business.currentSubscription.status)}
                        <p className="text-sm text-gray-600 mt-1">
                          Expires: {formatDate(business.currentSubscription.endDate)}
                        </p>
                        {isSubscriptionExpiringSoon(business.currentSubscription.endDate) && (
                          <p className="text-xs text-orange-600 mt-1">⚠️ Expiring soon!</p>
                        )}
                      </div>
                    </div>

                    {business.subscriptions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Subscription History</h4>
                        <div className="space-y-2">
                          {business.subscriptions.slice(0, 3).map((subscription, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{subscription.planName}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                                </p>
                              </div>
                              <div className="text-right">
                                {getStatusBadge(subscription.status)}
                                <p className="text-sm text-gray-600 mt-1">₹{subscription.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h4>
                    <p className="text-gray-600 mb-4">
                      Upgrade your business to premium to get more visibility and features.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={() => window.location.href = `/subscription/${business._id}`}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {business.currentSubscription ? 'Upgrade Plan' : 'Get Premium'}
                  </Button>
                  
                  {business?.subscriptions?.length > 3 && (
                    <Button variant="outline">
                      View All History
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorSubscriptions;