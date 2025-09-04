import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Phone } from "lucide-react";

const FeaturedBusinesses = () => {
  const businesses = [
    {
      id: 1,
      name: "Royal Palace Restaurant",
      category: "Restaurant",
      rating: 4.5,
      reviews: 1250,
      address: "MP Nagar, Bhopal",
      timing: "9:00 AM - 11:00 PM",
      phone: "+91 98765 43210",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
      verified: true,
      offers: "20% Off on Orders Above ₹500"
    },
    {
      id: 2,
      name: "City Center Hospital",
      category: "Healthcare",
      rating: 4.8,
      reviews: 890,
      address: "Arera Colony, Bhopal",
      timing: "24 Hours",
      phone: "+91 98765 43211",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=200&fit=crop",
      verified: true,
      offers: "Free Health Checkup"
    },
    {
      id: 3,
      name: "Tech Solutions Hub",
      category: "IT Services",
      rating: 4.6,
      reviews: 567,
      address: "New Market, Bhopal",
      timing: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43212",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
      verified: true,
      offers: "Free Consultation"
    },
    {
      id: 4,
      name: "Glamour Beauty Salon",
      category: "Beauty & Spa",
      rating: 4.4,
      reviews: 423,
      address: "Hamidia Road, Bhopal",
      timing: "10:00 AM - 8:00 PM",
      phone: "+91 98765 43213",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
      verified: true,
      offers: "Special Bridal Package"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated businesses in your area with verified reviews and exclusive offers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {business.verified && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    Verified
                  </Badge>
                )}
                {business.offers && (
                  <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
                    Offer
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {business.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {business.category}
                  </Badge>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(business.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">{business.rating}</span>
                  <span className="ml-1 text-sm text-muted-foreground">({business.reviews})</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {business.address}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {business.timing}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {business.phone}
                  </div>
                </div>

                {business.offers && (
                  <div className="bg-accent/20 p-2 rounded-md mb-3">
                    <p className="text-sm font-medium text-accent-foreground">
                      🎉 {business.offers}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Featured Businesses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;