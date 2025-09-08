import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import HeroBanner from "@/components/HeroBanner";
import BusinessCategories from "@/components/BusinessCategories";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import CustomerReviews from "@/components/CustomerReviews";
import PopularSearches from "@/components/PopularSearches";
import AppPromotion from "@/components/AppPromotion";
import Footer from "@/components/Footer";
import ConnectSection from "@/components/ConnectSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <SearchSection />
      <BusinessCategories />
      <FeaturedBusinesses />
      <ConnectSection />
      <CustomerReviews />
      <PopularSearches />
      <AppPromotion />
      <Footer />
    </div>
  );
};

export default Index;
