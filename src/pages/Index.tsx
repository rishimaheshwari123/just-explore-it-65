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
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  List,
  TrendingUp,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdSlider from "@/components/AdSlider";
import FloatingAd from "@/components/FloatingAd";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "businesses">("all");
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalReviews: 0,
    totalUsers: 0,
    featuredBusinesses: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dynamic data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const BASE_URL =
          import.meta.env.VITE_API_BASE_URL ||
          "http://localhost:8001/api/v1";

        // Fetch businesses for stats
        const businessResponse = await fetch(`${BASE_URL}/property/get-all`);
        const businessData = await businessResponse.json();

        if (businessData.success) {
          const businesses = businessData.properties || [];
          const featured = businesses.filter(
            (b: any) => b.premiumFeatures?.featuredListing
          );

          setStats({
            totalBusinesses: businesses.length,
            totalReviews: businesses.reduce(
              (acc: number, b: any) => acc + (b.ratings?.totalReviews || 0),
              0
            ),
            totalUsers: Math.floor(businesses.length * 2.5), // Estimated users
            featuredBusinesses: featured.length,
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

      <AdSlider />
      <HeroBanner />
      <SearchSection />

      <FloatingAd />

      {/* Enhanced Business Categories with Animation */}
      <section className="py-2 bg-gradient-to-b from-muted/30 to-background ">
        <BusinessCategories />
      </section>
      <AdSlider />

      {/* Content Sections with Improved Spacing */}
      {/* {(activeFilter === "all" || activeFilter === "businesses") && (
        <section className="py-3 animate-fade-in">
          <FeaturedBusinesses />
        </section>
      )} */}

      {(activeFilter === "all" || activeFilter === "businesses") && (
        <section className=" bg-muted/20 animate-fade-in">
          <BusinessListing />
        </section>
      )}

      {/* Enhanced Sections with Better Spacing */}
      <section className="py- bg-gradient-to-br from-background to-muted/30">
        <TrendingSection />
      </section>

      <section className="py-">
        <LocationServices />
      </section>

      {/* <section className="py-5 bg-muted/40">
        <ReviewsSection />
      </section> */}

      <section className=" bg-gradient-to-t from-card to-background">
        <ConnectSection />
      </section>

      <section className=" bg-gradient-to-br from-muted/20 to-background">
        <CustomerReviews />
      </section>

      <section className="py-0">
        <PopularSearches />
      </section>
      {/* Enhanced Stats Section with Animations */}
      <section className="relative py-6 lg:py-10 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />

        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Platform Statistics
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
              Growing Together
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses and customers who trust our platform
              every day
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Total Businesses */}
            <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  {loading ? (
                    <div className="animate-pulse bg-primary/20 rounded h-8 w-16 mx-auto" />
                  ) : (
                    <span className="tabular-nums">
                      {stats.totalBusinesses}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Total Businesses
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 animate-fade-in [animation-delay:100ms]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-6 w-6" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  {loading ? (
                    <div className="animate-pulse bg-primary/20 rounded h-8 w-16 mx-auto" />
                  ) : (
                    <span className="tabular-nums">{stats.totalReviews}</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Customer Reviews
                </div>
              </CardContent>
            </Card>

            {/* Happy Users */}
            <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 animate-fade-in [animation-delay:200ms]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  {loading ? (
                    <div className="animate-pulse bg-primary/20 rounded h-8 w-16 mx-auto" />
                  ) : (
                    <span className="tabular-nums">{stats.totalUsers}+</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Happy Users
                </div>
              </CardContent>
            </Card>

            {/* Featured Listings */}
            <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 animate-fade-in [animation-delay:300ms]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  {loading ? (
                    <div className="animate-pulse bg-primary/20 rounded h-8 w-16 mx-auto" />
                  ) : (
                    <span className="tabular-nums">
                      {stats.featuredBusinesses}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Featured Listings
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-0 bg-gradient-to-t from-primary/5 to-background">
        <AppPromotion />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
