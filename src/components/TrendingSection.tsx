import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Search, Flame, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrendingSection: React.FC = () => {
  const navigate = useNavigate();

  const trendingSearches = [
    { term: "Restaurants near me", count: "2.5K searches", trend: "+15%" },
    { term: "Mobile repair shop", count: "1.8K searches", trend: "+22%" },
    { term: "Beauty salon", count: "1.6K searches", trend: "+8%" },
  ];

  const handleSearchClick = (searchTerm: string) => {
    const params = new URLSearchParams();
    params.set("search", searchTerm);
    navigate(`/business-listing?${params.toString()}`);
  };

  return (
    <section className="py-6 bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 gap-10">
          {/* Trending Searches */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center justify-center">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-red-500" />
                Trending Searches
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                What people are searching for right now
              </p>
            </div>

            <div className="space-y-3">
              {trendingSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => handleSearchClick(search.term)}
                  className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                        <Search className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate group-hover:text-purple-700 transition-colors">
                          {search.term}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {search.count}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm hover:bg-green-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {search.trend}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-2xl font-bold mb-2">
              Why Choose Our Platform?
            </h3>
            <p className="text-purple-100 text-sm sm:text-base">
              Trusted by millions of users across India
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold mb-1">50K+</div>
              <div className="text-xs sm:text-sm text-purple-100">
                Verified Businesses
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold mb-1">2M+</div>
              <div className="text-xs sm:text-sm text-purple-100">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold mb-1">500+</div>
              <div className="text-xs sm:text-sm text-purple-100">
                Cities Covered
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-purple-100">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
