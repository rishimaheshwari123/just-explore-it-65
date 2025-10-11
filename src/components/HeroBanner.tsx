import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBanner2 from "@/assets/5.png";
import heroBanner3 from "@/assets/2.png";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find What You Need",
      subtitle: "All listings in one place",
      description: "Connect with trusted businesses near you.",
      image: heroBanner,
      gradient: "from-purple-900/40 via-blue-900/30 to-black/20",
      stats: [
        { icon: Users, label: "Users", value: "50K+" },
        { icon: Star, label: "Listings", value: "10K+" },
        { icon: TrendingUp, label: "Success", value: "95%" },
      ],
    },
    {
      title: "Buy • Sell • Rent",
      subtitle: "Post & discover instantly",
      description: "Browse verified listings and contact sellers fast.",
      specs: {
        class: "Marketplace",
        year: "2024",
      },
      image: heroBanner2,
      gradient: "from-indigo-900/40 via-purple-900/30 to-pink-900/20",
      stats: [
        { icon: Users, label: "Customers", value: "25K+" },
        { icon: Star, label: "Rating", value: "4.8" },
        { icon: TrendingUp, label: "Growth", value: "200%" },
      ],
    },
    {
      title: "Connect & Grow",
      subtitle: "Start your journey here",
      description: "Join thousands of successful businesses.",
      specs: {
        class: "Growth Hub",
        year: "2024",
      },
      image: heroBanner3,
      gradient: "from-emerald-900/40 via-teal-900/30 to-cyan-900/20",
      stats: [
        { icon: Users, label: "Partners", value: "15K+" },
        { icon: Star, label: "Stories", value: "8K+" },
        { icon: TrendingUp, label: "Revenue", value: "150%" },
      ],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[50vh] md:h-[75vh] overflow-hidden">
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-15"></div>

              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl text-white">
                    <h2
                      className={`text-2xl md:text-5xl font-bold mb-4 leading-tight transition-all duration-1000 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg">
                        {slide.title}
                      </span>
                    </h2>

                    <p
                      className={`text-lg md:text-2xl mb-3 font-medium transition-all duration-1000 delay-200 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.subtitle}
                    </p>

                    {slide.description && (
                      <p
                        className={`text-sm md:text-base mb-6 opacity-90 max-w-md transition-all duration-1000 delay-300 ${
                          index === currentSlide
                            ? "translate-y-0 opacity-90"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        {slide.description}
                      </p>
                    )}

                    <div
                      className={`mb-6 transition-all duration-1000 delay-400 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.stats ? (
                        <div className="grid grid-cols-3 gap-4 max-w-md">
                          {slide.stats.map((stat, statIndex) => {
                            const Icon = stat.icon;
                            return (
                              <div
                                key={statIndex}
                                className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                              >
                                <Icon className="h-5 w-5 mx-auto mb-1 text-blue-200" />
                                <div className="text-base font-bold">
                                  {stat.value}
                                </div>
                                <div className="text-xs opacity-80">
                                  {stat.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : slide.specs ? (
                        <div className="flex gap-6 text-sm md:text-base">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <span className="block opacity-70 text-xs">
                              Type
                            </span>
                            <span className="font-semibold text-base">
                              {slide.specs.class}
                            </span>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <span className="block opacity-70 text-xs">
                              Since
                            </span>
                            <span className="font-semibold text-base">
                              {slide.specs.year}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div
                      className={`transition-all duration-1000 delay-500 ${
                        index === currentSlide
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-6 py-3 text-base shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm"
                      >
                        Explore Now
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

      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 rounded-full w-10 h-10 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 rounded-full w-10 h-10 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full border-2 ${
              index === currentSlide
                ? "w-6 h-2 bg-white border-white"
                : "w-2.5 h-2.5 bg-white/50 border-white/50 hover:bg-white/70 hover:border-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
