import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Search, Clock } from "lucide-react";

const PopularSearches = () => {
  const trendingSearches = [
    { term: "Restaurants near me", count: "2.5K searches", trending: true },
    { term: "Best hospitals in Bhopal", count: "1.8K searches", trending: true },
    { term: "Beauty salons", count: "1.2K searches", trending: false },
    { term: "IT services", count: "980 searches", trending: true },
    { term: "Car repair shops", count: "756 searches", trending: false },
    { term: "Wedding venues", count: "645 searches", trending: true },
    { term: "Fitness centers", count: "523 searches", trending: false },
    { term: "Mobile repair", count: "445 searches", trending: true }
  ];

  const recentSearches = [
    "Pizza delivery Bhopal",
    "Dentist near MP Nagar",
    "Ladies tailor Arera Colony",
    "Car washing service",
    "Home cleaning services",
    "Photography studio"
  ];

  const cityStats = [
    { label: "Total Businesses", value: "25,000+", icon: "🏢" },
    { label: "Cities Covered", value: "50+", icon: "🌍" },
    { label: "Happy Customers", value: "1M+", icon: "😊" },
    { label: "Reviews & Ratings", value: "500K+", icon: "⭐" }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {cityStats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Searches */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Trending Searches</h3>
              </div>
              
              <div className="space-y-3">
                {trendingSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-muted-foreground mr-3" />
                      <div>
                        <span className="font-medium text-foreground">{search.term}</span>
                        {search.trending && (
                          <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{search.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Recent Searches</h3>
              </div>
              
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Search className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-foreground">{search}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-foreground mb-3">Quick Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {["Restaurants", "Hospitals", "Shopping", "Education", "Beauty", "Automotive"].map((category) => (
                    <Button key={category} variant="outline" size="sm" className="text-xs">
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-muted-foreground mb-6">
            Let us know and we'll help you discover the best businesses in your area
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