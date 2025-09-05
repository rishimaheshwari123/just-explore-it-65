import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find What You’re Looking For",
      subtitle: "Explore thousands of listings in one place",
      image: heroBanner,
      gradient: "from-black/70 to-black/40",
    },
    {
      title: "Buy • Sell • Rent",
      subtitle: "The easiest way to list and discover products & services",
      description:
        "Browse verified listings across multiple categories and connect instantly.",
      specs: {
        class: "Trusted Platform",
        year: "Since 2024",
      },
      image: heroBanner,
      gradient: "from-black/70 to-black/40",
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
    <section className="relative h-[450px] md:h-[550px] overflow-hidden">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
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
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl text-white drop-shadow-lg">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-2xl mb-6 opacity-95">
                      {slide.subtitle}
                    </p>
                    {slide.description && (
                      <p className="text-base md:text-lg mb-6 opacity-90">
                        {slide.description}
                      </p>
                    )}
                    {slide.specs && (
                      <div className="flex gap-8 mb-6 text-sm md:text-base">
                        <div>
                          <span className="block opacity-70">Category</span>
                          <span className="font-semibold">
                            {slide.specs.class}
                          </span>
                        </div>
                        <div>
                          <span className="block opacity-70">Active Since</span>
                          <span className="font-semibold">
                            {slide.specs.year}
                          </span>
                        </div>
                      </div>
                    )}
                    <Button
                      size="lg"
                      className="bg-primary text-white font-semibold rounded-xl px-6 py-3 shadow-md hover:bg-primary/90"
                    >
                      Start Exploring
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
      >
        <ChevronLeft className="h-7 w-7" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
      >
        <ChevronRight className="h-7 w-7" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
