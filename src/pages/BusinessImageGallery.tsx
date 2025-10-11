import React, { useState } from "react";

// Assuming you are using an icon library like 'lucide-react' or similar
// For this example, I'll use simple text for controls, but you can replace them with actual icons.

interface BusinessImageGalleryProps {
  images: { url: string; isPrimary?: boolean }[];
  placeholder?: string;
}

const BusinessImageGallery: React.FC<BusinessImageGalleryProps> = ({
  images,
  placeholder = "/placeholder-business.jpg",
}) => {
  // If no images, show the placeholder image
  if (!images || images.length === 0) {
    return (
      <img
        src={placeholder}
        alt="Placeholder"
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />
    );
  }

  // Primary image ko first display karo (Sorting the images)
  const sortedImages = [
    ...images.filter((img) => img.isPrimary),
    ...images.filter((img) => !img.isPrimary),
  ];

  // State to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = sortedImages.length;

  // Function to move to the previous image
  const goToPrevious = () => {
    // If current index is 0, wrap around to the last image, otherwise go to the previous
    const newIndex = (currentIndex - 1 + totalImages) % totalImages;
    setCurrentIndex(newIndex);
  };

  // Function to move to the next image
  const goToNext = () => {
    // If current index is the last image, wrap around to the first, otherwise go to the next
    const newIndex = (currentIndex + 1) % totalImages;
    setCurrentIndex(newIndex);
  };

  // The current image to display
  const currentImage = sortedImages[currentIndex];

  return (
    // Relative positioning for controls to overlay the image
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl">
      {/* --- Image Display --- */}
      <div className="flex transition-transform duration-500 ease-in-out">
        {/* Only the current image is shown. The 'transform' part is conceptually what a slider does,
            but here we just render the single current image for simplicity and performance. */}
        <img
          key={currentIndex} // Using key to force re-render/transition if desired
          src={currentImage.url || placeholder}
          alt={`Business Image ${currentIndex + 1}`}
          // Adjust height as needed, e.g., 'h-96' for a large display
          className="w-full h-96 object-cover"
        />
      </div>

      {/* --- Left Control (Previous Button) --- */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-r-lg hover:bg-opacity-75 transition-all focus:outline-none z-10"
        aria-label="Previous image"
      >
        {"<"} {/* Replace with a proper Left Arrow Icon */}
      </button>

      {/* --- Right Control (Next Button) --- */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-l-lg hover:bg-opacity-75 transition-all focus:outline-none z-10"
        aria-label="Next image"
      >
        {">"} {/* Replace with a proper Right Arrow Icon */}
      </button>

      {/* --- Optional: Dot Indicators --- */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sortedImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-white" // Active dot is white
                : "bg-gray-400 bg-opacity-50 hover:bg-opacity-100" // Inactive dots
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BusinessImageGallery;
