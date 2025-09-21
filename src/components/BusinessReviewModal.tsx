import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, MessageSquare, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Business {
  _id: string;
  businessName: string;
  category: string;
  contactInfo: {
    primaryPhone: string;
    email?: string;
  };
  address: {
    area: string;
    city: string;
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}

interface BusinessReviewModalProps {
  business: Business;
  trigger?: React.ReactNode;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  name: string;
  email: string;
}

const BusinessReviewModal: React.FC<BusinessReviewModalProps> = ({ 
  business, 
  trigger 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (!user && (!formData.name || !formData.email)) {
      toast.error("Please fill in your name and email");
      return;
    }

    setLoading(true);
    
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://just-explore-it-65.onrender.com/api/v1";
      const response = await fetch(
        `${BASE_URL}/reviews/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId: business._id,
            rating: formData.rating,
            comment: formData.comment,
            name: formData.name,
            email: formData.email,
            userId: user?._id || null
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted successfully! Thank you for your feedback.");
        setOpen(false);
        // Reset form
        setFormData({
          rating: 0,
          comment: '',
          name: user?.name || '',
          email: user?.email || ''
        });
        // Refresh page to show new review
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessImage = business.images?.find(img => img.isPrimary)?.url || 
                       business.images?.[0]?.url || 
                       '/placeholder-business.jpg';

  const defaultTrigger = (
    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
      <Star className="h-4 w-4 mr-2" />
      Write Review
    </Button>
  );

  const handleLoginPrompt = () => {
    toast.info("Login to save your reviews to your profile");
    navigate('/user/login');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {business.businessName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Business Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={businessImage}
                  alt={business.businessName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{business.businessName}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {business.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{business.ratings.average.toFixed(1)}</span>
                    <span>({business.ratings.totalReviews} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {business.address.area}, {business.address.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Prompt for Non-logged Users */}
          {!user && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      Want to save your reviews and track your activity?
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoginPrompt}
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Your Rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingClick(star)}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || formData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating > 0 && (
                    <>
                      {formData.rating} star{formData.rating > 1 ? 's' : ''}
                      {formData.rating === 1 && ' - Poor'}
                      {formData.rating === 2 && ' - Fair'}
                      {formData.rating === 3 && ' - Good'}
                      {formData.rating === 4 && ' - Very Good'}
                      {formData.rating === 5 && ' - Excellent'}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-base font-medium">
                Your Review *
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Share your experience with this business..."
                rows={4}
                required
              />
            </div>

            {/* Name and Email for non-logged users */}
            {!user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            )}

            {/* Logged in user info */}
            {user && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{user.name}</p>
                      <p className="text-sm text-green-600">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessReviewModal;