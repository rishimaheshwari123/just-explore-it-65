import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Search, Filter, Eye, Reply, Clock, User, Phone, MapPin, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface BusinessInquiry {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  businessId: string;
  subject: string;
  message: string;
  inquiryType: 'service' | 'pricing' | 'booking' | 'general';
  status: 'new' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  repliedAt?: string;
  reply?: string;
}

const VendorBusinessInquiry = () => {
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<BusinessInquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockInquiries: BusinessInquiry[] = [
      {
        _id: '1',
        customerName: 'Rahul Kumar',
        customerEmail: 'rahul@email.com',
        customerPhone: '+91 9876543210',
        businessName: 'Sharma Electronics',
        businessId: '1',
        subject: 'Mobile Repair Service',
        message: 'Hi, I need to repair my iPhone 12. The screen is cracked and touch is not working properly. Can you please let me know the cost and time required?',
        inquiryType: 'service',
        status: 'new',
        priority: 'high',
        createdAt: '2024-01-20T10:30:00Z'
      },
      {
        _id: '2',
        customerName: 'Priya Sharma',
        customerEmail: 'priya@email.com',
        customerPhone: '+91 9876543211',
        businessName: 'Gupta Restaurant',
        businessId: '2',
        subject: 'Catering Service Inquiry',
        message: 'Hello, I am planning a birthday party for 50 people. Can you provide catering services? Please share the menu and pricing details.',
        inquiryType: 'pricing',
        status: 'replied',
        priority: 'medium',
        createdAt: '2024-01-19T14:15:00Z',
        repliedAt: '2024-01-19T16:30:00Z',
        reply: 'Thank you for your inquiry. We do provide catering services for parties. Our party menu starts from ₹300 per person. I will send you the detailed menu via email.'
      },
      {
        _id: '3',
        customerName: 'Amit Patel',
        customerEmail: 'amit@email.com',
        customerPhone: '+91 9876543212',
        businessName: 'Sharma Electronics',
        businessId: '1',
        subject: 'Laptop Service Booking',
        message: 'I want to book a service for my Dell laptop. It is running very slow and heating up. When can I bring it to your store?',
        inquiryType: 'booking',
        status: 'closed',
        priority: 'low',
        createdAt: '2024-01-18T09:45:00Z',
        repliedAt: '2024-01-18T11:20:00Z',
        reply: 'You can bring your laptop anytime between 10 AM to 7 PM. Our technician will diagnose the issue and provide you with a quote.'
      }
    ];
    
    setTimeout(() => {
      setInquiries(mockInquiries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesType = filterType === 'all' || inquiry.inquiryType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
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
      case 'general': return <Mail className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const handleReply = (inquiry: BusinessInquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    setIsReplyDialogOpen(true);
  };

  const submitReply = () => {
    if (selectedInquiry && replyMessage.trim()) {
      // Update inquiry status to replied
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === selectedInquiry._id 
          ? { ...inquiry, status: 'replied', reply: replyMessage, repliedAt: new Date().toISOString() }
          : inquiry
      ));
      setIsReplyDialogOpen(false);
      setReplyMessage('');
      setSelectedInquiry(null);
    }
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
                      {inquiries.filter(i => i.status === 'replied').length}
                    </p>
                    <p className="text-sm text-gray-600">Replied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-gray-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {inquiries.filter(i => i.status === 'closed').length}
                    </p>
                    <p className="text-sm text-gray-600">Closed</p>
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
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="general">General</SelectItem>
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
              <Card key={inquiry._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(inquiry.inquiryType)}
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {inquiry.subject}
                        </CardTitle>
                        <Badge className={getPriorityColor(inquiry.priority)}>
                          {inquiry.priority}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-600">
                        Business: {inquiry.businessName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status}
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
                        <span>{inquiry.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{inquiry.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{inquiry.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{inquiry.message}</p>
                    </div>
                    
                    {/* Reply if exists */}
                    {inquiry.reply && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Reply className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Your Reply</span>
                          <span className="text-xs text-blue-600">
                            {inquiry.repliedAt && formatDate(inquiry.repliedAt)}
                          </span>
                        </div>
                        <p className="text-blue-700">{inquiry.reply}</p>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Dialog open={isReplyDialogOpen && selectedInquiry?._id === inquiry._id} onOpenChange={setIsReplyDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReply(inquiry)}
                            disabled={inquiry.status === 'closed'}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            {inquiry.status === 'new' ? 'Reply' : 'Update Reply'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Reply to Inquiry</DialogTitle>
                            <DialogDescription>
                              Replying to: {inquiry.subject} from {inquiry.customerName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Original Message:</p>
                              <p className="text-gray-600">{inquiry.message}</p>
                            </div>
                            <Textarea
                              placeholder="Type your reply here..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              rows={6}
                            />
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={submitReply} disabled={!replyMessage.trim()}>
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      
                      {inquiry.status !== 'closed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setInquiries(prev => prev.map(i => 
                              i._id === inquiry._id ? { ...i, status: 'closed' } : i
                            ));
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Close
                        </Button>
                      )}
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