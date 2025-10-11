import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PopularSearches = () => {
  const navigate = useNavigate();
  const trendingSearches = [
    {
      term: "Restaurants near me",
      count: "2.5K searches",
      trending: true,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR5z4-xluIMhopKjRILVR6_QNQGP8wQrUQug&s",
    },
    {
      term: "Best hospitals in Bhopal",
      count: "1.8K searches",
      trending: true,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBi2h9jTUaApaFPVlFXIkunL3WinBsSjtZxA&s",
    },
    {
      term: "Beauty salons",
      count: "1.2K searches",
      trending: false,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS865D0XxWFRu-nB1bZEjLlXPNmTXB2kh6IXA&s",
    },
    {
      term: "IT services",
      count: "980 searches",
      trending: true,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnuQ0BuLGW2v5Btxe7f6W0JZrkJBA6dX-GmQ&s",
    },
    {
      term: "Car repair shops",
      count: "756 searches",
      trending: false,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKGwM51CUxh2qbBD4_iRxoqZys9O2KgXQfcg&s",
    },
    {
      term: "Wedding venues",
      count: "645 searches",
      trending: true,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX9-FT5va4ZAjG9kb8PqNvhYzmRuThEJKN9Q&s",
    },
  ];

  const recentSearches = [
    {
      term: "Pizza delivery Bhopal",
      img: "https://curlytales.com/wp-content/uploads/2025/03/Dominos-10-min-delivery-430x242.jpg",
    },
    {
      term: "Dentist near MP Nagar",
      img: "https://content.jdmagicbox.com/comp/bhopal/x7/0755px755.x755.140222175010.f8x7/catalogue/dr-neeta-marwaha-dental-clinic-shakti-nagar-bhopal-dentists-ba8ol9p82f.jpg",
    },
    {
      term: "Ladies tailor Arera Colony",
      img: "https://content3.jdmagicbox.com/v2/comp/bhopal/g1/0755px755.x755.110208183218.s3g1/catalogue/pushp-matching-centre-and-ladies-tailors-arera-colony-bhopal-tailors-xtw7nsitnd.jpg",
    },
    {
      term: "Car washing service",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1UgopIssiaq-jun8hPPqdZPAJlUDcmMuhpA&s",
    },
  ];

  const handleSearchClick = (searchTerm: string) => {
    const params = new URLSearchParams();
    params.set("search", searchTerm);
    navigate(`/business-listing?${params.toString()}`);
  };

  const cityStats = [
    { label: "Total Businesses", value: "25,000+", icon: "🏢" },
    { label: "Cities Covered", value: "50+", icon: "🌍" },
    { label: "Happy Customers", value: "1M+", icon: "😊" },
    { label: "Reviews & Ratings", value: "500K+", icon: "⭐" },
  ];

  return (
    <section className="py-5 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {cityStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-muted-foreground mb-6">
            Let us know and we'll help you discover the best businesses in your
            area
          </p>
          <Button size="lg" className="mr-4">
            Request a Business
          </Button>
          <Button variant="outline" size="lg">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
