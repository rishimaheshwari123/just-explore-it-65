import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Search, Flame, Clock, ArrowRight } from "lucide-react";

const TrendingSection: React.FC = () => {
  const trendingSearches = [
    { term: "Restaurants near me", count: "2.5K searches", trend: "+15%" },
    { term: "Mobile repair shop", count: "1.8K searches", trend: "+22%" },
    { term: "Beauty salon", count: "1.6K searches", trend: "+8%" },
    { term: "Gym and fitness", count: "1.4K searches", trend: "+12%" },
    { term: "Car service center", count: "1.2K searches", trend: "+18%" },
    // { term: 'Home cleaning service', count: '1.1K searches', trend: '+25%' },
    // { term: 'Plumber near me', count: '980 searches', trend: '+10%' },
    // { term: 'Electrician service', count: '850 searches', trend: '+14%' }
  ];

  const popularCategories = [
    {
      name: "Food & Dining",
      businesses: "12,500+",
      icon: "🍽️",
      color: "bg-orange-100 text-orange-700",
    },
    {
      name: "Healthcare",
      businesses: "8,200+",
      icon: "🏥",
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Education",
      businesses: "6,800+",
      icon: "📚",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Automotive",
      businesses: "5,400+",
      icon: "🚗",
      color: "bg-gray-100 text-gray-700",
    },
    {
      name: "Beauty & Spa",
      businesses: "4,900+",
      icon: "💄",
      color: "bg-pink-100 text-pink-700",
    },
    {
      name: "Home Services",
      businesses: "7,600+",
      icon: "🏠",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Shopping",
      businesses: "9,300+",
      icon: "🛍️",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Travel & Hotels",
      businesses: "3,200+",
      icon: "✈️",
      color: "bg-indigo-100 text-indigo-700",
    },
  ];

  const handleSearchClick = (term: string) => {
    const params = new URLSearchParams();
    params.set("search", term);
    window.location.href = `/businesses?${params.toString()}`;
  };

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams();
    params.set("category", category.toLowerCase().replace(/[^a-z0-9]/g, "-"));
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Trending Searches */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-3 flex items-center justify-center lg:justify-start">
                <Flame className="h-6 w-6 mr-2 text-red-500" />
                Trending Searches
              </h2>
              <p className="text-gray-600 leading-relaxed">
                What people are searching for right now
              </p>
            </div>

            <div className="space-y-3">
              {trendingSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => handleSearchClick(search.term)}
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                        <Search className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {search.term}
                        </h3>
                        <p className="text-sm text-gray-500">{search.count}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {search.trend}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center lg:text-left mt-6">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
              >
                View All Trending Searches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 flex items-center justify-center lg:justify-start">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
                Popular Categories
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Explore businesses by popular categories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.businesses} businesses
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Badge className={`${category.color} border-0`}>
                        Popular
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center lg:text-left mt-6">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Why Choose Our Platform?
            </h3>
            <p className="text-purple-100">
              Trusted by millions of users across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm text-purple-100">Verified Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">2M+</div>
              <div className="text-sm text-purple-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-purple-100">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-purple-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
