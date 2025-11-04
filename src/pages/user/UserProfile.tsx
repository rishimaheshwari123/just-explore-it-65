import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { setToken, setUser } from '@/redux/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Star, 
  Calendar, 
  LogOut, 
  Edit,
  Eye,
  Building2,
  MapPin,
  Clock,
  Reply,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface UserInquiry {
  _id: string;
  subject: string;
  message: string;
  inquiryType: string;
  priority: string;
  status: string;
  createdAt: string;
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
}

interface UserReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  business: {
    _id: string;
    businessName: string;
    category: string;
  };
}

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<UserInquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
      
      // Fetch user inquiries
      const inquiriesResponse = await fetch(`${BASE_URL}/inquiry/user/${user._id}`);
      const inquiriesData = await inquiriesResponse.json();
      
      if (inquiriesData.success) {
        setInquiries(inquiriesData.inquiries || []);
      }

      // Fetch user reviews
      const reviewsResponse = await fetch(`${BASE_URL}/reviews/user/${user._id}`);
      const reviewsData = await reviewsResponse.json();
      
      if (reviewsData.success) {
        setReviews(reviewsData.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(setToken(null));
    dispatch(setUser(null));
    navigate('/');
    toast.success('Logged out successfully');
  };

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

  const getBusinessImage = (inquiry: UserInquiry) => {
    return inquiry.business.images?.find(img => img.isPrimary)?.url || 
           inquiry.business.images?.[0]?.url || 
           '/placeholder-business.jpg';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleReplyToInquiry = async () => {
    if (!selectedInquiry || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
      const response = await fetch(`${BASE_URL}/inquiry/user-reply/${selectedInquiry._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage,
          userId: user._id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Reply sent successfully!');
        setReplyMessage('');
        setIsReplyDialogOpen(false);
        fetchUserData(); // Refresh data
      } else {
        toast.error('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
          <Button onClick={() => navigate('/user/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}!
              </h1>
              <p className="text-gray-600">Manage your inquiries and reviews</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Building2 className="w-4 h-4 mr-2" />
              Browse Businesses
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              My Inquiries ({inquiries.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              My Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Your Business Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No inquiries found</p>
                    <p className="text-sm">Start exploring businesses and send inquiries</p>
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
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{inquiry.subject}</h3>
                                  <Badge className={getStatusColor(inquiry.status)}>
                                    {inquiry.status.replace('_', ' ')}
                                  </Badge>
                                  <Badge className={getPriorityColor(inquiry.priority)}>
                                    {inquiry.priority}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-2">
                                  Business: {inquiry.business.businessName}
                                </p>
                                
                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                  {inquiry.message}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {inquiry.business.category}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Inquiry Details</DialogTitle>
                                    <DialogDescription>
                                      Your inquiry to {inquiry.business.businessName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-6">
                                    {/* Inquiry Info */}
                                    <div className="flex items-start gap-4">
                                      <img
                                        src={getBusinessImage(inquiry)}
                                        alt={inquiry.business.businessName}
                                        className="w-20 h-20 rounded-lg object-cover"
                                      />
                                      <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">
                                          {inquiry.subject}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge className={getStatusColor(inquiry.status)}>
                                            {inquiry.status.replace('_', ' ')}
                                          </Badge>
                                          <Badge className={getPriorityColor(inquiry.priority)}>
                                            {inquiry.priority}
                                          </Badge>
                                        </div>
                                        <p className="text-gray-600">
                                          To: {inquiry.business.businessName}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                      <h4 className="font-semibold mb-2">Your Message</h4>
                                      <p className="bg-gray-50 p-3 rounded-lg">
                                        {inquiry.message}
                                      </p>
                                    </div>

                                    {/* Vendor Response */}
                                    {inquiry.vendorResponse && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Vendor Response</h4>
                                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                          <p className="text-blue-800">
                                            {inquiry.vendorResponse.message}
                                          </p>
                                          <p className="text-xs text-blue-600 mt-2">
                                            Replied on {format(new Date(inquiry.vendorResponse.respondedAt), 'PPP p')}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Reply Section */}
                                    {inquiry.vendorResponse && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Send Follow-up</h4>
                                        <div className="space-y-3">
                                          <Textarea
                                            placeholder="Type your follow-up message..."
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            rows={3}
                                          />
                                          <Button
                                            onClick={() => {
                                              setSelectedInquiry(inquiry);
                                              handleReplyToInquiry();
                                            }}
                                            disabled={!replyMessage.trim()}
                                            className="w-full"
                                          >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Follow-up
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
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
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Your Business Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reviews found</p>
                    <p className="text-sm">Start reviewing businesses you've visited</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {review.business.businessName}
                                </h3>
                                <Badge variant="outline">
                                  {review.business.category}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {review.rating}/5 stars
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-3">
                                {review.comment}
                              </p>
                              
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;