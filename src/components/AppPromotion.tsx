import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Download, Star, Shield, Users, Zap } from "lucide-react";

const AppPromotion = () => {
  const appFeatures = [
    {
      icon: Zap,
      title: "Instant Search",
      description: "Find businesses instantly with our advanced search",
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read authentic reviews from real customers",
    },
    {
      icon: Shield,
      title: "Trusted Listings",
      description: "All businesses are verified and authentic",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community",
    },
  ];

  return (
    <section className="py-5 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Get the Business Gurujee App
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover local businesses on the go! Download our mobile app for a
              seamless experience with exclusive features and real-time updates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download for Android</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download for iOS</span>
              </Button>
            </div>

            <div className="flex items-center space-x-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 Rating</span>
              </div>
              <div>10M+ Downloads</div>
              <div>Free to Use</div>
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl">
              <div className="bg-background rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <span className="text-background font-bold text-sm">
                        BG
                      </span>
                    </div>
                    <span className="font-semibold">Business Gurujee</span>
                  </div>
                  <Smartphone className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-2 bg-muted/60 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-secondary/20 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-2 bg-muted/60 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-2 bg-muted/60 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="bg-gradient-to-r from-primary to-secondary text-background px-4 py-2 rounded-lg font-medium">
                    Search & Discover
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Join Thousands of Happy Users
              </h3>
              <p className="text-muted-foreground mb-6">
                Experience the best way to discover local businesses. Available
                for free on all devices.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppPromotion;
