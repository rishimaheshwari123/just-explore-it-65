import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import HeroBanner from "@/components/HeroBanner";
import BusinessCategories from "@/components/BusinessCategories";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import BusinessListing from "@/components/BusinessListing";
import TrendingSection from "@/components/TrendingSection";
import ReviewsSection from "@/components/ReviewsSection";
import LocationServices from "@/components/LocationServices";
import CustomerReviews from "@/components/CustomerReviews";
import PopularSearches from "@/components/PopularSearches";
import AppPromotion from "@/components/AppPromotion";
import Footer from "@/components/Footer";
import ConnectSection from "@/components/ConnectSection";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, List, TrendingUp, Users, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "businesses">("all");
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalReviews: 0,
    totalUsers: 0,
    featuredBusinesses: 0
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dynamic data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
        
        // Fetch businesses for stats
        const businessResponse = await fetch(`${BASE_URL}/property/get-all`);
        const businessData = await businessResponse.json();
        
        if (businessData.success) {
          const businesses = businessData.properties || [];
          const featured = businesses.filter((b: any) => b.premiumFeatures?.featuredListing);
          
          setStats({
            totalBusinesses: businesses.length,
            totalReviews: businesses.reduce((acc: number, b: any) => acc + (b.ratings?.totalReviews || 0), 0),
            totalUsers: Math.floor(businesses.length * 2.5), // Estimated users
            featuredBusinesses: featured.length
          });
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <HeroBanner />
      <SearchSection />

      {/* Dynamic Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : stats.totalBusinesses}
              </div>
              <div className="text-sm text-gray-600">Total Businesses</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : stats.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Customer Reviews</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? "..." : stats.featuredBusinesses}
              </div>
              <div className="text-sm text-gray-600">Featured Listings</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className="flex items-center space-x-2"
            >
              <span>All Businesses</span>
            </Button>
            <Button
              variant={activeFilter === "businesses" ? "default" : "outline"}
              onClick={() => setActiveFilter("businesses")}
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Featured Businesses</span>
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate("/business-listing")}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>View All</span>
            </Button>
            {/* <Button
              onClick={() => navigate('/add-business')}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Business</span>
            </Button> */}
          </div>
        </div>
      </div>

      <BusinessCategories />

      {/* Conditional rendering based on filter */}
      {(activeFilter === "all" || activeFilter === "businesses") && (
        <FeaturedBusinesses />
      )}
      {(activeFilter === "all" || activeFilter === "businesses") && (
        <BusinessListing />
      )}

      <TrendingSection />
      <LocationServices />
      <ReviewsSection />
      <ConnectSection />
      <CustomerReviews />
      <PopularSearches />
      <AppPromotion />
      <Footer />
    </div>
  );
};

export default Index;
