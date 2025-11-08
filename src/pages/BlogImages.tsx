// components/BlogImages.jsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // I'm using lucide-react for icons, you can replace these with simple characters if needed.

const BlogImages = ({ images = [], alt = "Blog Image" }) => {
  // Use state to track the currently visible image index for the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- No Images (Placeholder) ---
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 overflow-hidden">
        <img
          src="/placeholder.svg?height=400&width=800"
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // --- Handle Navigation (Next/Previous) ---
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // --- Single Image ---
  if (images.length === 1) {
    return (
      <div className="w-full h-96 overflow-hidden">
        <img
          src={images[0]}
          alt={`${alt} 1`}
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
    );
  }

  // --- Two Images (Side-by-Side - No Carousel needed) ---
  if (images.length === 2) {
    return (
      <div className="w-full h-96 flex gap-3">
        {images.map((img, index) => (
          <div key={index} className="w-1/2 h-full relative">
            <img
              src={img}
              alt={`${alt} ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    );
  }

  // --- Multiple Images (3 or more - Carousel) ---
  // Note: For this to work, you need to have a library like 'lucide-react' installed for the icons,
  // or replace <ChevronLeft> and <ChevronRight> with simple HTML/SVG icons.
  return (
    <div className="w-full h-96 relative overflow-hidden rounded-lg shadow-xl group">
      {/* Image Display */}
      <img
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* --- Previous Button --- */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* --- Next Button --- */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image Index Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex
                ? "bg-white ring-2 ring-blue-500"
                : "bg-gray-400 bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogImages;
