import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  Eye, 
  Phone, 
  Star, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Business {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  subCategory?: string;
  contactInfo: {
    primaryPhone: string;
    email?: string;
  };
  address: {
    area: string;
    city: string;
    state: string;
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
  analytics: {
    totalViews: number;
    totalCalls: number;
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  isPremium: boolean;
  currentSubscription?: {
    planName: string;
    status: string;
    endDate: string;
    priority: number;
  };
  createdAt: string;
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}

interface VendorBusinessStatsProps {
  vendorId: string;
}

const VendorBusinessStats: React.FC<VendorBusinessStatsProps> = ({ vendorId }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (vendorId) {
      fetchVendorBusinesses();
    }
  }, [vendorId]);

  const fetchVendorBusinesses = async () => {
    try {
      setLoading(true);
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${BASE_URL}/property/businesses/vendor/${vendorId}`);
      const data = await response.json();
      
      if (data.success) {
        setBusinesses(data.businesses || []);
      } else {
        toast.error('Failed to fetch businesses');
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: any) => {
    if (!subscription) {
      return <Badge className="bg-gray-100 text-gray-800">No Plan</Badge>;
    }

    const isExpiringSoon = () => {
      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    };

    const isExpired = () => {
      const endDate = new Date(subscription.endDate);
      const now = new Date();
      return endDate < now;
    };

    if (isExpired()) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    }

    if (isExpiringSoon()) {
      return <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>;
    }

    switch (subscription.priority) {
      case 3:
        return <Badge className="bg-purple-100 text-purple-800">Enterprise Elite</Badge>;
      case 2:
        return <Badge className="bg-blue-100 text-blue-800">Business Pro</Badge>;
      case 1:
        return <Badge className="bg-orange-100 text-orange-800">Basic Premium</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  const getBusinessImage = (business: Business) => {
    return business.images?.find(img => img.isPrimary)?.url || 
           business.images?.[0]?.url || 
           '/placeholder-business.jpg';
  };

  const totalViews = businesses.reduce((sum, business) => sum + business.analytics.totalViews, 0);
  const totalCalls = businesses.reduce((sum, business) => sum + business.analytics.totalCalls, 0);
  const activeBusinesses = businesses.filter(b => b.status === 'active').length;
  const premiumBusinesses = businesses.filter(b => b.isPremium).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">{businesses.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeBusinesses}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <p className="text-2xl font-bold text-purple-600">{totalCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Your Businesses ({businesses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No businesses found</p>
              <p className="text-sm">Start by adding your first business</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses.map((business) => (
                <Card key={business._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={getBusinessImage(business)}
                          alt={business.businessName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{business.businessName}</h3>
                            {getStatusBadge(business.status)}
                            {business.isPremium && (
                              <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                            )}
                            {getSubscriptionBadge(business.currentSubscription)}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {business.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {business.category}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {business.address.city}, {business.address.state}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(business.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-4 mb-2 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">
                              {business.analytics.totalViews}
                            </div>
                            <div className="text-xs text-gray-500">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">
                              {business.analytics.totalCalls}
                            </div>
                            <div className="text-xs text-gray-500">Calls</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-yellow-600 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              {business.ratings.average.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({business.ratings.totalReviews})
                            </div>
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedBusiness(business)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Business Details</DialogTitle>
                              <DialogDescription>
                                Complete information about {business.businessName}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedBusiness && (
                              <div className="space-y-6">
                                {/* Business Info */}
                                <div className="flex items-start gap-4">
                                  <img
                                    src={getBusinessImage(selectedBusiness)}
                                    alt={selectedBusiness.businessName}
                                    className="w-20 h-20 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">
                                      {selectedBusiness.businessName}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                      {getStatusBadge(selectedBusiness.status)}
                                      {selectedBusiness.isPremium && (
                                        <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                                      )}
                                      {getSubscriptionBadge(selectedBusiness.currentSubscription)}
                                    </div>
                                    <p className="text-gray-600">{selectedBusiness.description}</p>
                                  </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {selectedBusiness.analytics.totalViews}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Views</div>
                                  </div>
                                  <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                      {selectedBusiness.analytics.totalCalls}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Calls</div>
                                  </div>
                                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                      {selectedBusiness.ratings.average.toFixed(1)}
                                    </div>
                                    <div className="text-sm text-gray-600">Rating</div>
                                  </div>
                                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                      {selectedBusiness.ratings.totalReviews}
                                    </div>
                                    <div className="text-sm text-gray-600">Reviews</div>
                                  </div>
                                </div>

                                {/* Contact & Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Contact Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{selectedBusiness.contactInfo.primaryPhone}</span>
                                      </div>
                                      {selectedBusiness.contactInfo.email && (
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4 text-gray-400" />
                                          <span>{selectedBusiness.contactInfo.email}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-3">Location</h4>
                                    <div className="text-sm text-gray-600">
                                      <p>{selectedBusiness.address.area}</p>
                                      <p>{selectedBusiness.address.city}, {selectedBusiness.address.state}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Category & Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Category</h4>
                                    <div className="space-y-1">
                                      <Badge variant="outline">{selectedBusiness.category}</Badge>
                                      {selectedBusiness.subCategory && (
                                        <Badge variant="outline" className="ml-2">
                                          {selectedBusiness.subCategory}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-3">Timeline</h4>
                                    <div className="text-sm text-gray-600">
                                      <p>Created: {format(new Date(selectedBusiness.createdAt), 'PPP')}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorBusinessStats;