import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Check, 
  Star, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  BarChart3,
  Headphones,
  Globe,
  Camera,
  MessageSquare,
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  description: string;
  isActive: boolean;
  priority: number;
}

interface Business {
  _id: string;
  businessName: string;
  category: string;
  description: string;
  fullAddress: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  images: string[];
  ratings: {
    average: number;
    totalReviews: number;
  };
  isPremium: boolean;
  currentSubscription?: {
    planName: string;
    endDate: string;
    status: string;
  };
}

const SubscriptionPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth?.user ?? null);

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription plans
      const plansResponse = await axios.get('http://localhost:8000/api/v1/subscriptions/plans');
      setPlans(plansResponse.data.data || []);
console.log(plansResponse)
      // Fetch business details if businessId is provided
      if (businessId) {
        const businessResponse = await axios.get(`http://localhost:8000/api/v1/property/business/${businessId}`);
        setBusiness(businessResponse.data.business);
        console.log(businessResponse.data.business)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string, planName: string, price: number) => {
    if (!businessId) {
      toast.error('Business ID is required');
      return;
    }

    try {
      setPurchasing(planId);
      
      const response = await axios.post('http://localhost:8000/api/v1/subscriptions/purchase', {
        businessId,
        planId,
        vendorId:user._id
      });

      if (response.data.success) {
        toast.success(`Successfully purchased ${planName} plan!`);
        // Refresh business data
        await fetchData();
        // Navigate back to business page after a delay
        setTimeout(() => {
          navigate(`/business/${businessId}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to purchase subscription';
      toast.error(errorMessage);
    } finally {
      setPurchasing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic premium':
        return <Star className="h-8 w-8 text-blue-500" />;
      case 'business pro':
        return <TrendingUp className="h-8 w-8 text-purple-500" />;
      case 'enterprise elite':
        return <Crown className="h-8 w-8 text-yellow-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-500" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic premium':
        return 'from-blue-500 to-blue-600';
      case 'business pro':
        return 'from-purple-500 to-purple-600';
      case 'enterprise elite':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
                {business && (
                  <p className="text-gray-600">Upgrade {business.businessName} to premium</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details Section */}
     {business && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {/* First image (logo/banner) */}
          {business.images?.[0] && (
            <img
              src={business.images[0].url}
              alt={business.businessName}
              className="h-16 w-16 object-cover rounded-lg"
            />
          )}

          {/* Business name + category */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {business.businessName}
            </h2>
            <p className="text-gray-600">
              {business.category} {business.subCategory && `- ${business.subCategory}`}
            </p>
          </div>

          {/* Premium badge */}
          {business.isPremium && (
            <Badge className="bg-purple-100 text-purple-800 ml-auto">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Details */}
          <div className="space-y-4">
            <p className="text-gray-700">{business.description}</p>

            {/* Address */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {business.address?.street}, {business.address?.area}, {business.address?.city},{" "}
                {business.address?.state} - {business.address?.pincode}
              </span>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{business.contactInfo?.primaryPhone}</span>
            </div>

            {/* Website */}
            {business.contactInfo?.website && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <a
                  href={business.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {business.contactInfo.website}
                </a>
              </div>
            )}
          </div>

          {/* Right Side - Ratings & More Images */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{business.ratings?.average || 0}</span>
              <span className="text-gray-600">
                ({business.ratings?.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Image thumbnails */}
            {business.images && business.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {business.images.slice(0, 3).map((image, index) => (
                  <img
                    key={image._id || index}
                    src={image.url}
                    alt={`${business.businessName} ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}


      {/* Current Subscription Status */}
      {business?.currentSubscription && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Current Plan: {business.currentSubscription.planName}
                  </h3>
                  <p className="text-sm text-green-600">
                    Active until {new Date(business.currentSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Boost your business visibility and get more customers with our premium subscription plans
          </p>
          
          {/* Sorting Advantage Highlight */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900">🎯 Premium Search Advantage</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Premium businesses automatically appear <strong>first in all search results</strong>, 
              giving you maximum visibility and more customer inquiries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Top position in location searches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Priority in category listings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Featured in map results</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan._id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.priority === 2 ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.priority === 2 && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.priority === 2 ? 'pt-12' : 'pt-6'}`}>
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                  <span className="text-gray-600 ml-2">/year</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(plan._id, plan.name, plan.price)}
                  disabled={purchasing === plan._id || (business?.currentSubscription?.status === 'active')}
                  className={`w-full bg-gradient-to-r ${getPlanColor(plan.name)} hover:opacity-90 text-white font-semibold py-3`}
                >
                  {purchasing === plan._id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : business?.currentSubscription?.status === 'active' ? (
                    'Current Plan'
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Purchase Plan
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Why Choose Premium?
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Premium businesses get up to 5x more visibility and 3x more customer inquiries. 
            Join thousands of successful businesses already using our premium features.
          </p>
          
          {/* Main Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">🚀 Top Search Rankings</h4>
              <p className="text-gray-600 text-sm">Appear first in search results and get 5x more visibility than free listings</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">📈 More Customers</h4>
              <p className="text-gray-600 text-sm">Premium businesses receive 3x more customer inquiries and calls</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <BarChart3 className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">📊 Advanced Analytics</h4>
              <p className="text-gray-600 text-sm">Track performance, customer behavior, and optimize your business strategy</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <Headphones className="h-10 w-10 text-yellow-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">⚡ Priority Support</h4>
              <p className="text-gray-600 text-sm">Get instant help from our dedicated support team whenever you need it</p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
            <h4 className="text-2xl font-bold text-center text-gray-900 mb-8">
              🎯 Premium Features That Drive Results
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Featured Business Badge</h5>
                  <p className="text-sm text-gray-600">Stand out with premium badges and verification marks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Priority in All Searches</h5>
                  <p className="text-sm text-gray-600">Always appear before free listings in search results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Enhanced Business Profile</h5>
                  <p className="text-sm text-gray-600">Showcase unlimited photos, videos, and detailed information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Customer Review Management</h5>
                  <p className="text-sm text-gray-600">Tools to manage and respond to customer reviews</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Social Media Integration</h5>
                  <p className="text-sm text-gray-600">Connect your social profiles and WhatsApp business</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Lead Generation Tools</h5>
                  <p className="text-sm text-gray-600">Advanced tools to capture and convert more leads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Stats */}
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h4 className="text-2xl font-bold text-center mb-8">
              📊 Premium Business Success Stats
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">5x</div>
                <p className="text-gray-300">More visibility than free listings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">3x</div>
                <p className="text-gray-300">More customer inquiries</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">85%</div>
                <p className="text-gray-300">Of premium businesses report increased revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;