import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, ThumbsUp } from "lucide-react";

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      customerName: "Priya Sharma",
      businessName: "Royal Palace Restaurant",
      rating: 5,
      review:
        "Absolutely amazing food and service! The ambiance is perfect for family dining. Highly recommended for anyone looking for authentic Indian cuisine.",
      date: "2 days ago",
      helpful: 24,
      avatar: "PS",
    },
    {
      id: 2,
      customerName: "Rahul Gupta",
      businessName: "City Center Hospital",
      rating: 5,
      review:
        "Excellent healthcare facility with modern equipment and caring staff. Dr. Kumar was very professional and explained everything clearly.",
      date: "1 week ago",
      helpful: 18,
      avatar: "RG",
    },
    {
      id: 3,
      customerName: "Anjali Verma",
      businessName: "Glamour Beauty Salon",
      rating: 4,
      review:
        "Great service and reasonable prices. The staff is skilled and the salon is clean. My hair treatment turned out perfectly!",
      date: "3 days ago",
      helpful: 12,
      avatar: "AV",
    },
  ];

  return (
    <section className="py-5 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real reviews from real customers about their experiences with local
            businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {review.customerName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {review.businessName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {review.date}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{review.review}"
                </p>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                  <span className="text-muted-foreground">Verified Review</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Read More Reviews
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
