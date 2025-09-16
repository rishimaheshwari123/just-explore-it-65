import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Plus, Search, Filter, Eye, Edit, Trash2, Star, MapPin, Phone, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { business } from '../../service/apis';

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
    website?: string;
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
    breakdown?: {
      five: number;
      four: number;
      three: number;
      two: number;
      one: number;
    };
  };
  status: {
    isOpen: boolean;
    message: string;
  };
  verified: boolean;
  createdAt: string;
  images: string[];
  features: string[];
  services: {
    name: string;
    price: number;
    description: string;
  }[];
}

const VendorBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Get vendor ID from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const vendorId = user?._id;

  // Fetch vendor businesses from API
  const fetchVendorBusinesses = async () => {
    if (!vendorId) {
      toast.error('Vendor ID not found');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${business.GET_VENDOR_BUSINESS_API}/${vendorId}`);
      const data = await response.json();

      if (data.success) {
        setBusinesses(data.businesses || []);
      } else {
        console.error('Failed to fetch businesses:', data.message);
        toast.error('Failed to load businesses');
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch businesses on component mount
  useEffect(() => {
    if (vendorId) {
      fetchVendorBusinesses();
    }
  }, [vendorId]);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || business.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && business.status.isOpen) || (filterStatus === 'pending' && !business.status.isOpen);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${business.DELETE_BUSINESS_API}/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBusinesses(prev => prev.filter(b => b._id !== businessId));
        toast.success('Business deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete business');
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    }
  };

  const handleEditBusiness = (businessId: string) => {
    // Navigate to edit business page
    window.location.href = `/vendor/edit-business/${businessId}`;
  };

  const getStatusColor = (status: { isOpen: boolean; message: string }) => {
    if (status.isOpen) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
                <p className="text-gray-600 mt-1">Manage all your registered businesses</p>
              </div>
            </div>
            <Link to="/vendor/add-business">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Business
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
                    <p className="text-sm text-gray-600">Total Businesses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {businesses.filter(b => b.status.isOpen).length}
                    </p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {businesses.filter(b => !b.status.isOpen).length}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {businesses.reduce((sum, b) => sum + (b.ratings?.totalReviews || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search businesses..."
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
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business Cards */}
        {filteredBusinesses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first business to the platform.</p>
              <Link to="/vendor/add-business">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {business.businessName}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {business.category} • {business.businessType}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(business.status)}>
                        {business.status.isOpen ? 'Active' : 'Pending'}
                      </Badge>
                      {business.verified && (
                        <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{business.fullAddress}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{business.contactInfo.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{business.ratings?.average || 0} ({business.ratings?.totalReviews || 0} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Services: {business.services.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Link to={`/business/${business._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-600 hover:text-blue-700"
                      onClick={() => handleEditBusiness(business._id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteBusiness(business._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorBusinesses;