import { useState } from "react";
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
import { Building2, Plus, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'businesses'>('all');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <HeroBanner />
      <SearchSection />
      
      {/* Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className="flex items-center space-x-2"
            >
              <span>All Businesses</span>
            </Button>
            <Button
              variant={activeFilter === 'businesses' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('businesses')}
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Featured Businesses</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/business-listing')}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>View All</span>
            </Button>
            <Button
              onClick={() => navigate('/add-business')}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Business</span>
            </Button>
          </div>
        </div>
      </div>

      <BusinessCategories />
      
      {/* Conditional rendering based on filter */}
      {(activeFilter === 'all' || activeFilter === 'businesses') && <FeaturedBusinesses />}
      {(activeFilter === 'all' || activeFilter === 'businesses') && <BusinessListing />}
      
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
