import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Download,
  User,
  Globe,
  Shield,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Business {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  subCategory?: string;
  businessType: string;
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    email?: string;
    website?: string;
  };
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  vendor: {
    _id: string;
    name: string;
    email: string;
    company: string;
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
  verification: {
    isVerified: boolean;
    trustScore: number;
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
  updatedAt: string;
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}

const BusinessManagement: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    business: null as Business | null,
    action: '',
  });

  // Fetch all businesses
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://server.businessgurujee.com/api/v1";
      const response = await fetch(`${BASE_URL}/property/businesses?limit=1000`);
      const data = await response.json();
      
      if (data.success) {
        setBusinesses(data.businesses || []);
        toast.success(`Loaded ${data.businesses?.length || 0} businesses successfully`);
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

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Filter businesses
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Update business status
  const updateBusinessStatus = async (businessId: string, status: string) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://server.businessgurujee.com/api/v1";
      const response = await fetch(`${BASE_URL}/property/business/update/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (data.success) {
        setBusinesses(prev => 
          prev.map(business => 
            business._id === businessId ? { ...business, status } : business
          )
        );
        toast.success(`Business ${status} successfully`);
      } else {
        toast.error('Failed to update business status');
      }
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error('Failed to update business status');
    } finally {
      setAlertDialog({ open: false, business: null, action: '' });
    }
  };

  // Export businesses to PDF
  const exportBusinessesToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Business Management Report', 14, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);
    
    // Summary
    doc.text(`Total Businesses: ${filteredBusinesses.length}`, 14, 40);
    doc.text(`Active: ${filteredBusinesses.filter(b => b.status === 'active').length}`, 14, 50);
    doc.text(`Pending: ${filteredBusinesses.filter(b => b.status === 'pending').length}`, 14, 60);
    
    // Table data
    const tableColumn = [
      'Business Name', 
      'Vendor', 
      'Category', 
      'Location', 
      'Status', 
      'Views', 
      'Rating'
    ];
    
    const tableRows = filteredBusinesses.map((business) => [
      business.businessName,
      business.vendor.name,
      business.category,
      `${business.address.city}, ${business.address.state}`,
      business.status,
      business.analytics.totalViews.toString(),
      `${business.ratings.average.toFixed(1)} (${business.ratings.totalReviews})`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`business-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('Business report exported successfully!');
  };

  // Get status badge
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

  // Get business image
  const getBusinessImage = (business: Business) => {
    return business.images?.find(img => img.isPrimary)?.url || 
           business.images?.[0]?.url || 
           '/placeholder-business.jpg';
  };

  // Categories for filter
  const categories = [
    'Food & Dining', 'Healthcare', 'Education', 'Shopping',
    'Hotels & Travel', 'Fitness & Wellness', 'Beauty & Spa',
    'Electronics & Technology', 'Automotive', 'Real Estate',
    'Financial Services', 'Professional Services', 'Home & Garden',
    'Entertainment', 'Sports & Recreation', 'Government & Community'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Business Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all business listings and their status
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchBusinesses}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportBusinessesToPDF}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
                <p className="text-2xl font-bold text-green-600">
                  {businesses.filter(b => b.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {businesses.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="text-2xl font-bold text-purple-600">
                  {businesses.filter(b => b.isPremium).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search businesses, vendors, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            All Businesses ({filteredBusinesses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No businesses found</p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search criteria</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Analytics</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow
                      key={business._id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSelectedBusiness(business);
                        setIsDetailsDialogOpen(true);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={getBusinessImage(business)}
                            alt={business.businessName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {business.businessName}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {business.contactInfo.primaryPhone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {business.vendor.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {business.vendor.company}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">{business.category}</Badge>
                        {business.isPremium && (
                          <Badge className="ml-1 bg-purple-100 text-purple-800">
                            Premium
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {business.address.city}, {business.address.state}
                        </div>
                      </TableCell>
                      
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      
                      <TableCell>{getSubscriptionBadge(business)}</TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {business.analytics.totalViews} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {business.analytics.totalCalls} calls
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(business.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBusiness(business);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            
                            {business.status === 'pending' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  setAlertDialog({
                                    open: true,
                                    business,
                                    action: 'active',
                                  })
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            
                            {business.status === 'active' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  setAlertDialog({
                                    open: true,
                                    business,
                                    action: 'suspended',
                                  })
                                }
                                className="text-red-600"
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            
                            {business.status === 'suspended' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  setAlertDialog({
                                    open: true,
                                    business,
                                    action: 'active',
                                  })
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Reactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Business Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the business
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <div className="space-y-6">
              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={getBusinessImage(selectedBusiness)}
                        alt={selectedBusiness.businessName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedBusiness.businessName}</h3>
                        <p className="text-sm text-gray-600">{selectedBusiness.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(selectedBusiness.status)}
                          {selectedBusiness.isPremium && (
                            <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                          )}
                          {selectedBusiness.verification.isVerified && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {selectedBusiness.businessType}</p>
                      <p><span className="font-medium">Description:</span> {selectedBusiness.description}</p>
                      {selectedBusiness.subCategory && (
                        <p><span className="font-medium">Sub-category:</span> {selectedBusiness.subCategory}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Vendor Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold">{selectedBusiness.vendor.name}</p>
                      <p className="text-sm text-gray-600">{selectedBusiness.vendor.company}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedBusiness.vendor.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedBusiness.contactInfo.primaryPhone}</span>
                      </div>
                      {selectedBusiness.contactInfo.secondaryPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedBusiness.contactInfo.secondaryPhone}</span>
                        </div>
                      )}
                      {selectedBusiness.contactInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedBusiness.contactInfo.email}</span>
                        </div>
                      )}
                      {selectedBusiness.contactInfo.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a 
                            href={selectedBusiness.contactInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedBusiness.contactInfo.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p>{selectedBusiness.address.street}</p>
                      <p>{selectedBusiness.address.area}</p>
                      <p>{selectedBusiness.address.city}, {selectedBusiness.address.state}</p>
                      <p>PIN: {selectedBusiness.address.pincode}</p>
                      {selectedBusiness.address.landmark && (
                        <p className="text-gray-600">Near: {selectedBusiness.address.landmark}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics & Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedBusiness.analytics.totalViews}
                        </div>
                        <div className="text-gray-600">Total Views</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedBusiness.analytics.totalCalls}
                        </div>
                        <div className="text-gray-600">Total Calls</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Ratings & Trust
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{selectedBusiness.ratings.average.toFixed(1)}</span>
                        <span className="text-sm text-gray-600">
                          ({selectedBusiness.ratings.totalReviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">
                          Trust Score: {selectedBusiness.verification.trustScore}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timestamps */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-gray-600">
                        {format(new Date(selectedBusiness.createdAt), 'PPP p')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-gray-600">
                        {format(new Date(selectedBusiness.updatedAt), 'PPP p')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Alert Dialog */}
      <AlertDialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of "{alertDialog.business?.businessName}" to {alertDialog.action}?
              This action will affect the business visibility and vendor access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (alertDialog.business) {
                  updateBusinessStatus(alertDialog.business._id, alertDialog.action);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Helper function to get subscription badge
const getSubscriptionBadge = (business: Business) => {
  if (!business.currentSubscription || business.currentSubscription.status !== 'active') {
    return (
      <Badge variant="outline" className="text-gray-600 border-gray-300">
        Free Plan
      </Badge>
    );
  }

  const { planName, priority, endDate } = business.currentSubscription;
  const isExpiringSoon = new Date(endDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  let badgeClass = "bg-blue-100 text-blue-800";
  let icon = "💼";
  
  if (priority >= 3) {
    badgeClass = "bg-purple-100 text-purple-800";
    icon = "👑";
  } else if (priority >= 2) {
    badgeClass = "bg-yellow-100 text-yellow-800";
    icon = "⭐";
  }

  return (
    <div className="flex flex-col gap-1">
      <Badge className={badgeClass}>
        {icon} {planName}
      </Badge>
      {isExpiringSoon && (
        <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">
          Expires Soon
        </Badge>
      )}
    </div>
  );
};

export default BusinessManagement;