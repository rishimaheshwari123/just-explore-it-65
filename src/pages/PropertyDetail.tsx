import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  MapPin,
  Tag,
  Home,
  User,
  Mail,
  Phone,
  Bed,
  Bath,
  Layout,
} from "lucide-react";
import { getPropertyBYIDAPI, incrementPropertyViewAPI } from "@/service/operations/property";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, A11y } from "swiper/modules";

// Modal
import InquiryModal from "./InquiryModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await getPropertyBYIDAPI(id!);
      setProperty(response);
      
      // Increment view count
      await incrementPropertyViewAPI(id!);
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Failed to fetch property");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading property...</p>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Property not found</p>
      </div>
    );

  return (
    <>
      <TopBar />
      <Header />
      <div className="bg-gray-50 min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {property.images?.length ? (
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {property.images.map((img: any, idx: number) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={`${property.title} image ${idx + 1}`}
                        className="w-full h-[500px] object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="p-16 text-center text-gray-400">
                  <Home className="w-20 h-20 mx-auto" />
                  <p className="mt-4 text-lg">No images available</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  {property.title}
                </h1>
                <span className="bg-blue-100 text-blue-800 flex items-center space-x-2 px-4 py-2 rounded-full text-base font-semibold mt-2 md:mt-0">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <span>{property.category}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 font-medium">
                {property.price && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{property.price}
                    </span>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center space-x-2">
                    <Bath className="w-5 h-5" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center space-x-2">
                    <Layout className="w-5 h-5" />
                    <span>{property.area} sqft</span>
                  </div>
                )}
              </div>

              <hr className="my-6 border-gray-200" />

              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {property.description ||
                    "This property offers a comfortable living experience with all essential amenities. Perfect for families or individuals looking for a modern space."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Vendor Info Box */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-7 h-7 text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Vendor Info
                  </h3>
                </div>

                <div className="space-y-2 text-gray-700 text-lg">
                  <p>
                    <span className="font-semibold">Name: </span>
                    {property.vendor?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Company: </span>
                    {property.vendor?.company || "N/A"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span>{property.vendor?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{property.vendor?.phone || "N/A"}</span>
                  </div>
                  {property.vendor?.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span>{property.vendor.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Send Inquiry Button Below Vendor Box */}
              {/* Sidebar Vendor Card */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-8">
                  <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 flex flex-col items-center">
                    {/* Vendor Image or Icon */}
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                      {property.vendor?.name?.[0] || "V"}
                    </div>

                    {/* Vendor Name */}
                    <h3 className="text-xl font-bold text-gray-800">
                      {property.vendor?.name || "N/A"}
                    </h3>
                    <p className="text-gray-600">
                      {property.vendor?.company || "Company info not available"}
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4 mt-2">
                      <a
                        href={property.vendor?.facebook || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                      <a
                        href={property.vendor?.instagram || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-6 h-6 text-pink-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 011.77 1.154 4.92 4.92 0 011.154 1.77c.163.46.349 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.902 4.902 0 01-1.154 1.77 4.902 4.902 0 01-1.77 1.154c-.46.163-1.26.349-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.902 4.902 0 01-1.77-1.154 4.902 4.902 0 01-1.154-1.77c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.92 4.92 0 011.154-1.77 4.92 4.92 0 011.77-1.154c.46-.163 1.26-.349 2.43-.403C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.736 0 8.332.013 7.052.072 5.78.131 4.835.327 4.042.64c-.81.314-1.5.733-2.184 1.417a6.918 6.918 0 00-1.417 2.184c-.313.793-.509 1.738-.568 3.01C.013 8.332 0 8.736 0 12c0 3.264.013 3.668.072 4.948.059 1.272.255 2.217.568 3.01.314.81.733 1.5 1.417 2.184a6.918 6.918 0 002.184 1.417c.793.313 1.738.509 3.01.568C8.332 23.987 8.736 24 12 24s3.668-.013 4.948-.072c1.272-.059 2.217-.255 3.01-.568a6.918 6.918 0 002.184-1.417 6.918 6.918 0 001.417-2.184c.313-.793.509-1.738.568-3.01.059-1.28.072-1.684.072-4.948s-.013-3.668-.072-4.948c-.059-1.272-.255-2.217-.568-3.01a6.918 6.918 0 00-1.417-2.184A6.918 6.918 0 0019.958.64c-.793-.313-1.738-.509-3.01-.568C15.668.013 15.264 0 12 0z" />
                          <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zM18.406 4.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                        </svg>
                      </a>
                    </div>

                    {/* Vendor Description */}
                    <p className="text-center text-gray-600 text-sm mt-2">
                      {property.vendor?.description ||
                        "Reliable vendor providing top-quality properties. Reach out to inquire about this property."}
                    </p>

                    {/* Send Inquiry Button */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full mt-4 py-3 px-4 border border-transparent rounded-md shadow-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <InquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={property}
        />
      </div>
      <Footer />
    </>
  );
};

export default PropertyDetail;
