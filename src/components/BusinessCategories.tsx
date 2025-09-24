import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BUSINESS_CATEGORIES } from "@/constants/categories";
import {
  Briefcase,
  Megaphone,
  Tractor,
  Shirt,
  Car,
  Settings,
  Baby,
  CreditCard,
  PartyPopper,
  Scissors,
  Palette,
  BookOpen,
  Hammer,
  Truck,
  ChefHat,
  Pill,
  Users,
  Computer,
  Package,
  Milk,
  Music,
  Microscope,
  Stethoscope,
  Shirt as Laundry,
  GraduationCap,
  Zap,
  Tv,
  Calendar,
  Eye,
  Utensils,
  Dumbbell,
  Flower,
  Sofa,
  DollarSign,
  Fuel,
  Gift,
  Store,
  Heart,
  Wrench,
  Hospital,
  Bed,
  Building2,
  Home,
  IceCream,
  PaintBucket,
  Wifi,
  Shield,
  Gem,
  Briefcase as Job,
  Smartphone,
  Camera,
  MapPin,
  PawPrint,
  Building,
  School,
  ShieldCheck,
  Plane,
  Flower2 as Lotus,
} from "lucide-react";

const BusinessCategories = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to properties page with category filter
    navigate(`/properties?category=${encodeURIComponent(categoryName)}`);
  };

  const categoryIcons = {
    "Advertising Agencies": { icon: Megaphone, color: "text-red-500" },
    "Agriculture Equipment & Seeds": { icon: Tractor, color: "text-green-600" },
    "Apparels / Garments": { icon: Shirt, color: "text-blue-500" },
    Automobiles: { icon: Car, color: "text-gray-600" },
    "Automobile Spare Parts": { icon: Settings, color: "text-orange-500" },
    "Baby Care & Kids Stores": { icon: Baby, color: "text-pink-400" },
    "Banks & ATMs": { icon: CreditCard, color: "text-blue-600" },
    "Banquet Halls": { icon: PartyPopper, color: "text-purple-500" },
    "Beauty Parlours & Salons": { icon: Scissors, color: "text-pink-500" },
    "Boutiques & Tailors": { icon: Palette, color: "text-indigo-500" },
    "Book Shops & Stationery": { icon: BookOpen, color: "text-amber-600" },
    "Builders & Developers": { icon: Hammer, color: "text-yellow-700" },
    "Car Rentals & Taxi Services": { icon: Truck, color: "text-blue-400" },
    "Catering Services": { icon: ChefHat, color: "text-red-400" },
    "Chemists & Medical Stores": { icon: Pill, color: "text-green-500" },
    "Coaching Classes & Tuition": { icon: Users, color: "text-purple-600" },
    "Computer Sales & Services": { icon: Computer, color: "text-gray-500" },
    "Courier & Cargo Services": { icon: Package, color: "text-brown-500" },
    "Dairy Products & Milk Suppliers": { icon: Milk, color: "text-white" },
    "Dance & Music Classes": { icon: Music, color: "text-purple-400" },
    "Diagnostic Centres & Pathology Labs": {
      icon: Microscope,
      color: "text-teal-500",
    },
    "Doctors (All Specializations)": {
      icon: Stethoscope,
      color: "text-red-600",
    },
    "Dry Cleaners & Laundry Services": {
      icon: Laundry,
      color: "text-blue-300",
    },
    "Education Institutes": { icon: GraduationCap, color: "text-purple-500" },
    Electricians: { icon: Zap, color: "text-yellow-500" },
    "Electronics & Home Appliances": { icon: Tv, color: "text-gray-700" },
    "Event Organisers": { icon: Calendar, color: "text-orange-400" },
    "Eye Clinics & Opticians": { icon: Eye, color: "text-blue-700" },
    "Fast Food & Restaurants": { icon: Utensils, color: "text-red-500" },
    "Fitness Centres & Gyms": { icon: Dumbbell, color: "text-yellow-600" },
    Florists: { icon: Flower, color: "text-pink-600" },
    "Furniture Dealers & Home Decor": { icon: Sofa, color: "text-brown-600" },
    "Financial Services": { icon: DollarSign, color: "text-green-600" },
    "Gas Agencies": { icon: Fuel, color: "text-orange-600" },
    "Gift Shops": { icon: Gift, color: "text-red-400" },
    "Grocery Stores & Kirana": { icon: Store, color: "text-green-500" },
    Gynecologists: { icon: Heart, color: "text-pink-500" },
    "Hardware & Sanitary Shops": { icon: Wrench, color: "text-gray-600" },
    "Hospitals & Nursing Homes": { icon: Hospital, color: "text-red-600" },
    "Hostels / PG Accommodation": { icon: Bed, color: "text-blue-500" },
    "Hotels & Resorts": { icon: Building2, color: "text-blue-500" },
    "House Cleaning & Pest Control": { icon: Home, color: "text-green-500" },
    "Ice Cream Parlours": { icon: IceCream, color: "text-cyan-400" },
    "Interior Designers": { icon: PaintBucket, color: "text-purple-400" },
    "Internet Service Providers": { icon: Wifi, color: "text-blue-600" },
    "Insurance Agents": { icon: Shield, color: "text-green-700" },
    "Jewellery Shops": { icon: Gem, color: "text-yellow-400" },
    "Job Placement Agencies": { icon: Job, color: "text-gray-500" },
    "Mobile Phone Dealers & Repair": {
      icon: Smartphone,
      color: "text-gray-800",
    },
    "Photographers & Videographers": { icon: Camera, color: "text-cyan-500" },
    "Property Dealers": { icon: MapPin, color: "text-red-700" },
    "Pet Shops & Veterinary Clinics": {
      icon: PawPrint,
      color: "text-orange-500",
    },
    "Real Estate Agents": { icon: Building, color: "text-blue-800" },
    "Schools & Colleges": { icon: School, color: "text-purple-600" },
    "Security Services & Guards": { icon: ShieldCheck, color: "text-red-800" },
    "Tour & Travel Agents": { icon: Plane, color: "text-sky-500" },
    "Wedding Planners": { icon: Heart, color: "text-pink-600" },
    "Yoga Centres": { icon: Lotus, color: "text-green-400" },
  };

  const categories = BUSINESS_CATEGORIES.map((categoryName) => ({
    name: categoryName,
    icon:
      categoryIcons[categoryName as keyof typeof categoryIcons]?.icon ||
      Briefcase,
    color:
      categoryIcons[categoryName as keyof typeof categoryIcons]?.color ||
      "text-gray-500",
  }));

  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  return (
    <section className=" bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Browse by Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of business categories and find
            exactly what you're looking for
          </p>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {visibleCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant="category"
                className="group flex flex-col items-center justify-center 
                           space-y-3 p-4 md:p-6 lg:p-8 
                           hover:scale-105 hover:shadow-xl transition-all duration-300 
                           [&_svg]:!size-6 md:[&_svg]:!size-7 lg:[&_svg]:!size-8
                           min-h-[120px] md:min-h-[140px] lg:min-h-[160px]
                           bg-white/60 backdrop-blur-sm border border-white/30
                           hover:bg-white/90 hover:border-purple-300
                           rounded-2xl shadow-lg hover:shadow-2xl"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <IconComponent
                    className={`${category.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>
                <span className="text-xs md:text-sm lg:text-base font-medium text-center w-full overflow-hidden relative">
                  <span className="inline-block whitespace-nowrap animate-marquee">
                    {category.name}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>

        {/* Enhanced More Button */}
        {!showAll && categories.length > 10 && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={() => setShowAll(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All Categories
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessCategories;
