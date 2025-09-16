import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, User, Calendar, CheckCircle, Camera, MoreHorizontal } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  businessName: string;
  reviewText: string;
  helpful: number;
  images?: string[];
  isVerified: boolean;
  response?: {
    text: string;
    date: string;
    ownerName: string;
  };
}

const ReviewsSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Priya Sharma',
      rating: 5,
      date: '2 days ago',
      businessName: 'Royal Restaurant & Banquet',
      reviewText: 'Excellent food quality and amazing ambiance! The staff was very courteous and the service was prompt. Highly recommended for family dinners and special occasions. The biryani was absolutely delicious.',
      helpful: 24,
      images: [
        '/placeholder.svg',
        '/placeholder.svg'
      ],
      isVerified: true,
      response: {
        text: 'Thank you so much for your wonderful review! We\'re delighted that you enjoyed your dining experience with us.',
        date: '1 day ago',
        ownerName: 'Royal Restaurant Team'
      }
    },
    {
      id: '2',
      userName: 'Rajesh Kumar',
      rating: 4,
      date: '5 days ago',
      businessName: 'TechFix Computer Solutions',
      reviewText: 'Great service for laptop repair. They fixed my laptop screen within 2 hours and the price was very reasonable. Professional staff and clean workspace.',
      helpful: 18,
      isVerified: true
    },
    {
      id: '3',
      userName: 'Anita Gupta',
      rating: 5,
      date: '1 week ago',
      businessName: 'Green Valley Spa & Wellness',
      reviewText: 'Amazing spa experience! The massage therapy was so relaxing and the staff was very professional. The ambiance is perfect for unwinding after a stressful week.',
      helpful: 31,
      images: [
        '/placeholder.svg'
      ],
      isVerified: true
    },
    {
      id: '4',
      userName: 'Vikram Singh',
      rating: 3,
      date: '2 weeks ago',
      businessName: 'AutoCare Service Center',
      reviewText: 'Decent service but took longer than expected. The work quality was good but communication could be better. Overall satisfied with the car servicing.',
      helpful: 12,
      isVerified: false
    },
    {
      id: '5',
      userName: 'Meera Patel',
      rating: 5,
      date: '3 weeks ago',
      businessName: 'Fashion Hub Boutique',
      reviewText: 'Love their collection! Found the perfect outfit for my friend\'s wedding. The staff helped me choose the right accessories too. Great shopping experience.',
      helpful: 27,
      isVerified: true
    },
    {
      id: '6',
      userName: 'Arjun Reddy',
      rating: 4,
      date: '1 month ago',
      businessName: 'EduTech Learning Center',
      reviewText: 'Excellent coaching for competitive exams. The faculty is knowledgeable and the study material is comprehensive. Helped me crack my entrance exam.',
      helpful: 45,
      isVerified: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : index < rating
            ? 'text-yellow-400 fill-yellow-400/50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === '5') return review.rating === 5;
    if (selectedFilter === '4') return review.rating === 4;
    if (selectedFilter === '3') return review.rating <= 3;
    if (selectedFilter === 'verified') return review.isVerified;
    if (selectedFilter === 'photos') return review.images && review.images.length > 0;
    return true;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Customer Reviews & Ratings
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real reviews from verified customers. Read what people are saying about local businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(averageRating)}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {reviews.length} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 mb-6">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center text-sm">
                      <span className="w-3">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mx-1" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Filter Options */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">Filter Reviews</h4>
                {[
                  { key: 'all', label: 'All Reviews', count: reviews.length },
                  { key: '5', label: '5 Stars', count: ratingDistribution[5] },
                  { key: '4', label: '4 Stars', count: ratingDistribution[4] },
                  { key: '3', label: '3 Stars & Below', count: ratingDistribution[3] + ratingDistribution[2] + ratingDistribution[1] },
                  { key: 'verified', label: 'Verified Only', count: reviews.filter(r => r.isVerified).length },
                  { key: 'photos', label: 'With Photos', count: reviews.filter(r => r.images && r.images.length > 0).length }
                ].map(filter => (
                  <Button
                    key={filter.key}
                    variant={selectedFilter === filter.key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`w-full justify-between text-left ${
                      selectedFilter === filter.key 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-gray-900 mr-2">{review.userName}</h4>
                          {review.isVerified && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">• {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Business Name */}
                  <div className="mb-3">
                    <Badge variant="outline" className="text-purple-700 border-purple-200">
                      {review.businessName}
                    </Badge>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed mb-4">{review.reviewText}</p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
                            <Camera className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Business Response */}
                  {review.response && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-100 rounded-full p-1 mr-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-blue-900 text-sm">
                          Response from {review.response.ownerName}
                        </span>
                        <span className="text-xs text-blue-600 ml-2">• {review.response.date}</span>
                      </div>
                      <p className="text-blue-800 text-sm">{review.response.text}</p>
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-700">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {review.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Button 
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
              >
                Load More Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;