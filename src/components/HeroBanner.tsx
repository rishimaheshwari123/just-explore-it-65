import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Rough it with rock rider",
      subtitle: "Adventure awaits you",
      image: heroBanner,
      gradient: "from-accent/80 to-primary/80",
    },
    {
      title: "Scoti Cycle RC Pro DP263-4",
      subtitle: "2 Hydrelic Break",
      description:
        "It is Scoti's first best-selling model with 14,220 build throughout its production run.",
      specs: {
        class: "Mountain",
        year: "2020",
      },
      image: heroBanner,
      gradient: "from-primary/80 to-secondary/80",
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
    <section className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
              />

              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-background">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl mb-6 opacity-90">
                      {slide.subtitle}
                    </p>
                    {slide.description && (
                      <p className="text-base md:text-lg mb-6 opacity-80">
                        {slide.description}
                      </p>
                    )}
                    {slide.specs && (
                      <div className="flex gap-6 mb-6">
                        <div>
                          <span className="block text-sm opacity-70">
                            Class
                          </span>
                          <span className="text-lg font-semibold">
                            {slide.specs.class}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm opacity-70">Year</span>
                          <span className="text-lg font-semibold">
                            {slide.specs.year}
                          </span>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="hero"
                      size="lg"
                      className="bg-background text-white hover:bg-background/90"
                    >
                      Explore Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/20 text-background hover:bg-background/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/20 text-background hover:bg-background/30"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-background" : "bg-background/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
