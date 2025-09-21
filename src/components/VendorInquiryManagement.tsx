import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  Eye,
  Reply,
  Filter,
  Search,
  Calendar,
  Star
} from "lucide-react";
import { format } from "date-fns";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
  priority: string;
  status: string;
  preferredContact: string;
  bestTimeToContact: string;
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
  business: {
    _id: string;
    businessName: string;
    category: string;
    images?: Array<{
      url: string;
      isPrimary: boolean;
    }>;
  };
  vendorResponse?: {
    message: string;
    respondedAt: string;
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

interface VendorInquiryManagementProps {
  vendorId: string;
}

const VendorInquiryManagement: React.FC<VendorInquiryManagementProps> = ({ vendorId }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: ""
  });
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchInquiries();
  }, [vendorId, filters]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status !== "all") queryParams.append("status", filters.status);
      if (filters.priority !== "all") queryParams.append("priority", filters.priority);
      
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(
        `${BASE_URL}/inquiry/vendor/${vendorId}?${queryParams}`
      );
      const data = await response.json();
      
      if (data.success) {
        let filteredInquiries = data.inquiries;
        
        // Apply search filter
        if (filters.search) {
          filteredInquiries = filteredInquiries.filter((inquiry: Inquiry) =>
            inquiry.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            inquiry.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
            inquiry.business.businessName.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setInquiries(filteredInquiries);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (inquiryId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setReplyLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(
        `${BASE_URL}/inquiry/reply/${inquiryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: replyMessage,
            vendorId: vendorId,
            status: "replied"
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Reply sent successfully!");
        setReplyMessage("");
        setSelectedInquiry(null);
        fetchInquiries(); // Refresh the list
      } else {
        toast.error(data.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(
        `${BASE_URL}/inquiry/status/${inquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            vendorId: vendorId
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Status updated successfully!");
        fetchInquiries();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "read": return "bg-yellow-500";
      case "replied": return "bg-green-500";
      case "in_progress": return "bg-orange-500";
      case "resolved": return "bg-purple-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getBusinessImage = (inquiry: Inquiry) => {
    return inquiry.business.images?.find(img => img.isPrimary)?.url || 
           inquiry.business.images?.[0]?.url || 
           "/placeholder-business.jpg";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inquiries</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-blue-600">
                  {inquiries.filter(i => i.status === 'new').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Replied</p>
                <p className="text-2xl font-bold text-green-600">
                  {inquiries.filter(i => i.status === 'replied').length}
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
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-purple-600">
                  {inquiries.filter(i => i.status === 'resolved').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
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
            </div>
            
            <div>
              <Label>Priority</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({ status: "all", priority: "all", search: "" })}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inquiries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={getBusinessImage(inquiry)}
                          alt={inquiry.business.businessName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{inquiry.name}</h3>
                            <Badge className={`${getStatusColor(inquiry.status)} text-white`}>
                              {inquiry.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={`${getPriorityColor(inquiry.priority)} text-white`}>
                              {inquiry.priority}
                            </Badge>
                            <Badge variant="outline">
                              {inquiry.business.businessName}
                            </Badge>
                          </div>
                          
                          <p className="font-medium text-sm">{inquiry.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {inquiry.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {inquiry.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {inquiry.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(inquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                            {inquiry.customerLocation?.city && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {inquiry.customerLocation.city}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedInquiry(inquiry)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                                        <Label className="text-sm font-medium">Name</Label>
                                        <p>{selectedInquiry.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p>{selectedInquiry.phone}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p>{selectedInquiry.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Preferred Contact</Label>
                                        <p className="capitalize">{selectedInquiry.preferredContact}</p>
                                      </div>
                                    </div>
                                    
                                    {selectedInquiry.customerLocation?.city && (
                                      <div>
                                        <Label className="text-sm font-medium">Location</Label>
                                        <p>
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
                                      <Label className="text-sm font-medium">Subject</Label>
                                      <p>{selectedInquiry.subject}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Message</Label>
                                      <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Type</Label>
                                        <p className="capitalize">{selectedInquiry.inquiryType.replace('_', ' ')}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Priority</Label>
                                        <Badge className={`${getPriorityColor(selectedInquiry.priority)} text-white`}>
                                          {selectedInquiry.priority}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Best Time</Label>
                                        <p className="capitalize">{selectedInquiry.bestTimeToContact}</p>
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
                                          <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                            <span>{service.serviceName}</span>
                                            <span className="text-sm text-muted-foreground">
                                              ₹{service.budget.min} - ₹{service.budget.max}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Previous Response */}
                                {selectedInquiry.vendorResponse && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Your Response</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="whitespace-pre-wrap">{selectedInquiry.vendorResponse.message}</p>
                                      <p className="text-sm text-muted-foreground mt-2">
                                        Sent on {format(new Date(selectedInquiry.vendorResponse.respondedAt), 'MMM dd, yyyy HH:mm')}
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Reply Section */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Send Reply</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <Label>Status</Label>
                                      <Select
                                        value={selectedInquiry.status}
                                        onValueChange={(value) => updateInquiryStatus(selectedInquiry._id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="read">Read</SelectItem>
                                          <SelectItem value="in_progress">In Progress</SelectItem>
                                          <SelectItem value="replied">Replied</SelectItem>
                                          <SelectItem value="resolved">Resolved</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div>
                                      <Label>Reply Message</Label>
                                      <Textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your reply to the customer..."
                                        rows={4}
                                      />
                                    </div>
                                    
                                    <Button
                                      onClick={() => handleReply(selectedInquiry._id)}
                                      disabled={replyLoading || !replyMessage.trim()}
                                      className="w-full"
                                    >
                                      {replyLoading ? (
                                        <div className="flex items-center gap-2">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                          Sending Reply...
                                        </div>
                                      ) : (
                                        <>
                                          <Reply className="h-4 w-4 mr-2" />
                                          Send Reply
                                        </>
                                      )}
                                    </Button>
                                  </CardContent>
                                </Card>
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

export default VendorInquiryManagement;