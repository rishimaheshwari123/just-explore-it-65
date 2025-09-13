import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find What You're Looking For",
      subtitle: "Explore thousands of listings in one place",
      description: "Connect with verified businesses and discover amazing deals near you",
      image: heroBanner,
      gradient: "from-purple-900/80 via-blue-900/70 to-black/60",
      stats: [
        { icon: Users, label: "Active Users", value: "50K+" },
        { icon: Star, label: "Verified Listings", value: "10K+" },
        { icon: TrendingUp, label: "Success Rate", value: "95%" }
      ]
    },
    {
      title: "Buy • Sell • Rent",
      subtitle: "The easiest way to list and discover products & services",
      description: "Browse verified listings across multiple categories and connect instantly with trusted sellers.",
      specs: {
        class: "Trusted Platform",
        year: "Since 2024",
      },
      image: heroBanner,
      gradient: "from-indigo-900/80 via-purple-900/70 to-pink-900/60",
      stats: [
        { icon: Users, label: "Happy Customers", value: "25K+" },
        { icon: Star, label: "Average Rating", value: "4.8" },
        { icon: TrendingUp, label: "Growth Rate", value: "200%" }
      ]
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-white/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
      </div>

      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 transform ${
              index === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
              />
              
              {/* Overlay Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-30"></div>

              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-3xl text-white">
                    {/* Animated Title */}
                    <h2 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight transform transition-all duration-1000 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                        {slide.title}
                      </span>
                    </h2>
                    
                    {/* Animated Subtitle */}
                    <p className={`text-xl md:text-3xl mb-4 font-medium transform transition-all duration-1000 delay-200 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.subtitle}
                    </p>
                    
                    {/* Animated Description */}
                    {slide.description && (
                      <p className={`text-base md:text-lg mb-8 opacity-90 max-w-2xl transform transition-all duration-1000 delay-300 ${
                        index === currentSlide ? 'translate-y-0 opacity-90' : 'translate-y-8 opacity-0'
                      }`}>
                        {slide.description}
                      </p>
                    )}
                    
                    {/* Stats or Specs */}
                    <div className={`mb-8 transform transition-all duration-1000 delay-400 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.stats ? (
                        <div className="grid grid-cols-3 gap-6 max-w-lg">
                          {slide.stats.map((stat, statIndex) => {
                            const IconComponent = stat.icon;
                            return (
                              <div key={statIndex} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <IconComponent className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                                <div className="text-lg font-bold">{stat.value}</div>
                                <div className="text-xs opacity-80">{stat.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : slide.specs ? (
                        <div className="flex gap-8 text-sm md:text-base">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <span className="block opacity-70 text-xs">Category</span>
                            <span className="font-semibold text-lg">
                              {slide.specs.class}
                            </span>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <span className="block opacity-70 text-xs">Active Since</span>
                            <span className="font-semibold text-lg">
                              {slide.specs.year}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Animated CTA Button */}
                    <div className={`transform transition-all duration-1000 delay-500 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm"
                      >
                        Start Exploring
                        <TrendingUp className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full border-2 ${
              index === currentSlide 
                ? "w-8 h-3 bg-white border-white shadow-lg" 
                : "w-3 h-3 bg-white/50 border-white/50 hover:bg-white/70 hover:border-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
