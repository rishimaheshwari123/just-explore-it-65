import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Search, Filter, Eye, Clock, User, Phone, MapPin, Calendar, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'service' | 'pricing' | 'booking' | 'complaint' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'read' | 'replied' | 'in_progress' | 'resolved' | 'closed';
  preferredContact: string;
  bestTimeToContact: string;
  createdAt: string;
  readAt?: string;
  business: {
    _id: string;
    businessName: string;
    category: string;
    images?: Array<{
      url: string;
      isPrimary: boolean;
    }>;
  };
  customerLocation?: {
    city: string;
    area: string;
    pincode: string;
  };
  serviceInterest?: Array<{
    serviceName: string;
    budget: {
      min: number;
      max: number;
    };
  }>;
}

const VendorBusinessInquiry = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<BusinessInquiry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch actual inquiries from API
  useEffect(() => {
    if (user?._id) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://server.businessgurujee.com/api/v1";
      const response = await fetch(`${BASE_URL}/inquiry/vendor/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        // Sort by new inquiries first, then by creation date (newest first)
        const sortedInquiries = data.inquiries.sort((a: BusinessInquiry, b: BusinessInquiry) => {
          // First priority: new status
          if (a.status === 'new' && b.status !== 'new') return -1;
          if (b.status === 'new' && a.status !== 'new') return 1;
          
          // Second priority: creation date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setInquiries(sortedInquiries);
      } else {
        toast.error('Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesType = filterType === 'all' || inquiry.inquiryType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <MessageSquare className="h-4 w-4" />;
      case 'pricing': return <Phone className="h-4 w-4" />;
      case 'booking': return <Calendar className="h-4 w-4" />;
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'general': return <Mail className="h-4 w-4" />;
      case 'other': return <Mail className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const handleViewInquiry = (inquiry: BusinessInquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewDialogOpen(true);
  };

  const getBusinessImage = (inquiry: BusinessInquiry) => {
    return inquiry.business.images?.find(img => img.isPrimary)?.url || 
           inquiry.business.images?.[0]?.url || 
           '/placeholder-business.jpg';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Inquiries</h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries for your businesses</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
                    <p className="text-sm text-gray-600">Total Inquiries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">!</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.status === 'new').length}
                    </p>
                    <p className="text-sm text-gray-600">New</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.status === 'replied' || i.status === 'resolved').length}
                    </p>
                    <p className="text-sm text-gray-600">Processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.priority === 'high' || i.priority === 'urgent').length}
                    </p>
                    <p className="text-sm text-gray-600">High Priority</p>
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
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
              <p className="text-gray-600">Customer inquiries will appear here when they contact your businesses.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <Card key={inquiry._id} className={`hover:shadow-md transition-shadow ${inquiry.status === 'new' ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <img
                        src={getBusinessImage(inquiry)}
                        alt={inquiry.business.businessName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(inquiry.inquiryType)}
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {inquiry.subject}
                          </CardTitle>
                          <Badge className={getPriorityColor(inquiry.priority)}>
                            {inquiry.priority}
                          </Badge>
                          {inquiry.status === 'new' && (
                            <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm text-gray-600">
                          Business: {inquiry.business.businessName} • Category: {inquiry.business.category}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{inquiry.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                      {inquiry.customerLocation?.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{inquiry.customerLocation.city}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 line-clamp-3">{inquiry.message}</p>
                      {inquiry.message.length > 150 && (
                        <button 
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-blue-600 text-sm mt-2 hover:underline"
                        >
                          Read more...
                        </button>
                      )}
                    </div>
                    
                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Preferred Contact: {inquiry.preferredContact}</span>
                      <span>•</span>
                      <span>Best Time: {inquiry.bestTimeToContact}</span>
                      {inquiry.serviceInterest && inquiry.serviceInterest.length > 0 && (
                        <>
                          <span>•</span>
                          <span>Services: {inquiry.serviceInterest.length} interested</span>
                        </>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Dialog open={isViewDialogOpen && selectedInquiry?._id === inquiry._id} onOpenChange={setIsViewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewInquiry(inquiry)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Inquiry Details</DialogTitle>
                            <DialogDescription>
                              From {inquiry.name} for {inquiry.business.businessName}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedInquiry && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Name:</span>
                                      <p className="font-medium">{selectedInquiry.name}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                                      <p className="font-medium">{selectedInquiry.phone}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Email:</span>
                                      <p className="font-medium">{selectedInquiry.email}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Preferred Contact:</span>
                                      <p className="font-medium capitalize">{selectedInquiry.preferredContact}</p>
                                    </div>
                                  </div>
                                  
                                  {selectedInquiry.customerLocation?.city && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Location:</span>
                                      <p className="font-medium">
                                        {selectedInquiry.customerLocation.area && `${selectedInquiry.customerLocation.area}, `}
                                        {selectedInquiry.customerLocation.city}
                                        {selectedInquiry.customerLocation.pincode && ` - ${selectedInquiry.customerLocation.pincode}`}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Inquiry Details */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Inquiry Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Subject:</span>
                                    <p className="font-medium">{selectedInquiry.subject}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Message:</span>
                                    <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">{selectedInquiry.message}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Type:</span>
                                      <p className="font-medium capitalize">{selectedInquiry.inquiryType.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Priority:</span>
                                      <Badge className={getPriorityColor(selectedInquiry.priority)}>
                                        {selectedInquiry.priority}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">Best Time:</span>
                                      <p className="font-medium capitalize">{selectedInquiry.bestTimeToContact}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Service Interest */}
                              {selectedInquiry.serviceInterest && selectedInquiry.serviceInterest.length > 0 && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Service Interest</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      {selectedInquiry.serviceInterest.map((service, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                          <span className="font-medium">{service.serviceName}</span>
                                          <span className="text-sm text-gray-600">
                                            Budget: ₹{service.budget.min} - ₹{service.budget.max}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Contact Actions */}
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => window.open(`tel:${selectedInquiry.phone}`, '_self')}
                                  className="flex-1"
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call Customer
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(`mailto:${selectedInquiry.email}`, '_self')}
                                  className="flex-1"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${inquiry.phone}`, '_self')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${inquiry.email}`, '_self')}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
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

export default VendorBusinessInquiry;