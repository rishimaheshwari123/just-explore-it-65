import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

import {
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
  Briefcase,
  Smartphone,
  Camera,
  MapPin,
  PawPrint,
  Building,
  School,
  ShieldCheck,
  Plane,
  Coffee,
  PaintRoller,
  Lamp,
  Guitar,
  Apple,
  ShoppingCart,
  Printer,
  Tent,
  University,
  Battery,
  Monitor,
  X,
  Droplet,
  Aperture,
  Video,
  Pencil,
  Sun,
  Activity,
  Cpu,
  CloudSnow,
} from "lucide-react";
import { BiCube, BiHeart } from "react-icons/bi";

export const categoryIcons = {
  "Advertising Agencies": { icon: Megaphone, color: "text-red-500" },
  "Agriculture Equipment & Seeds": { icon: Tractor, color: "text-green-600" },
  "Apparels / Garments": { icon: Shirt, color: "text-blue-500" },
  "Automobiles (Car, Bike, Showroom, Service)": {
    icon: Car,
    color: "text-gray-600",
  },
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
  "Doctors (All Specializations)": { icon: Stethoscope, color: "text-red-600" },
  "Dry Cleaners & Laundry Services": {
    icon: CloudSnow,
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
  "Job Placement Agencies": { icon: Briefcase, color: "text-gray-500" },
  "Mobile Phone Dealers & Repair": { icon: Smartphone, color: "text-gray-800" },
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
  "Yoga Centres": { icon: Flower, color: "text-green-400" }, // lotus replaced by Flower

  // ----- Fixed / Missing Categories -----
  "Garment Shops": { icon: Shirt, color: "text-blue-400" },
  "Industrial Suppliers": { icon: Building2, color: "text-gray-500" },
  "Juice Centres": { icon: Coffee, color: "text-orange-400" },
  "Kids Wear & Toy Shops": { icon: BiCube, color: "text-pink-400" },
  "Kitchen Appliances Dealers": { icon: Cpu, color: "text-red-500" },
  "Laboratories (Medical/Industrial)": {
    icon: Microscope,
    color: "text-teal-400",
  },
  "Lawyers & Legal Services": { icon: Hammer, color: "text-purple-700" },
  Libraries: { icon: BookOpen, color: "text-blue-600" },
  "Lighting Shops": { icon: Lamp, color: "text-yellow-400" },
  "Marriage Gardens": { icon: Flower, color: "text-pink-500" },
  "Modular Kitchen Dealers": { icon: Coffee, color: "text-red-600" },
  "Movers & Packers": { icon: Truck, color: "text-gray-700" },
  "Music Instrument Shops": { icon: Guitar, color: "text-purple-500" },
  "Nutritionists & Dieticians": { icon: Apple, color: "text-green-400" },
  "Online Shopping / E-commerce Support": {
    icon: ShoppingCart,
    color: "text-blue-500",
  },
  "Orthopedic Clinics": { icon: Activity, color: "text-red-400" },
  "Painters & Contractors": { icon: PaintRoller, color: "text-orange-500" },
  "Petrol Pumps": { icon: Fuel, color: "text-red-600" },
  "Printing Press & Xerox": { icon: Printer, color: "text-gray-600" },
  "Quick Service Restaurants": { icon: Utensils, color: "text-yellow-500" },
  "Quilts & Bedding Dealers": { icon: Bed, color: "text-purple-400" },
  "Restaurants & Cafes": { icon: Coffee, color: "text-brown-500" },
  "Repair Services (AC, Fridge, Washing Machine)": {
    icon: Wrench,
    color: "text-gray-700",
  },
  "Resorts & Holiday Homes": { icon: Home, color: "text-blue-500" },
  "Solar Dealers (Water Heater, Rooftop)": {
    icon: Sun,
    color: "text-yellow-600",
  },
  "Sports Shops & Academies": { icon: Dumbbell, color: "text-red-400" },
  "Stationery & Xerox Shops": { icon: Pencil, color: "text-blue-400" },
  "Tiffin Centres": { icon: Package, color: "text-orange-400" },
  "Tent House & Decorators": { icon: Tent, color: "text-purple-500" },
  Universities: { icon: University, color: "text-blue-700" },
  "UPS & Inverter Dealers": { icon: Battery, color: "text-yellow-500" },
  "Uniform Suppliers": { icon: Shirt, color: "text-green-500" },
  "Vegetable & Fruit Vendors": { icon: Store, color: "text-green-600" },
  "Veterinary Doctors": { icon: Stethoscope, color: "text-red-500" },
  "Video Shooting & Editing Services": { icon: Video, color: "text-cyan-500" },
  "Vehicle Repair Garages": { icon: Wrench, color: "text-gray-600" },
  "Water Suppliers (20L Jar, Tanker)": {
    icon: Droplet,
    color: "text-blue-400",
  },
  "Wellness & Spa Centres": { icon: BiHeart, color: "text-pink-500" },
  "Website Designers & IT Services": { icon: Monitor, color: "text-blue-600" },
  "Xerox & Printing Services": { icon: Printer, color: "text-gray-500" },
  "X-Ray & Radiology Centres": { icon: X, color: "text-red-600" },
  "Yellow Pages / Directory Services": {
    icon: BookOpen,
    color: "text-yellow-500",
  },
  "Zari & Embroidery Shops": { icon: Aperture, color: "text-pink-400" },
  "Zoological & Pet Services": { icon: PawPrint, color: "text-orange-500" },
};

const BusinessCategories = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  // Dynamic categories hook
  const { categories: dynamicCategories, loading } = useCategories();

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to properties page with category filter
    navigate(`/business-listing?category=${encodeURIComponent(categoryName)}`);
  };

  const categories = dynamicCategories.map((category) => ({
    name: category.name,
    image: category.image,
    icon:
      categoryIcons[category.name as keyof typeof categoryIcons]?.icon ||
      Briefcase,
    color:
      categoryIcons[category.name as keyof typeof categoryIcons]?.color ||
      "text-gray-500",
  }));

  const visibleCategories = showAll ? categories : categories.slice(0, 12);

  if (loading) {
    return (
      <section className=" bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between p-3 md:p-4 min-h-[100px] md:min-h-[120px] bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl shadow-md animate-pulse"
              >
                <div className="w-7 h-7 md:w-10 md:h-10 bg-gray-300 rounded-full"></div>
                <div className="mt-2 w-full h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className=" bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        {/* <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Browse by Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of business categories and find
            exactly what you're looking for
          </p>
        </div> */}
        <br />
        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {visibleCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant="category"
                className="group flex flex-col items-center justify-between 
p-3 md:p-4 
hover:scale-105 hover:shadow-lg transition-all duration-300 
[&_svg]:!size-7 md:[&_svg]:!size-10
min-h-[100px] md:min-h-[120px]
bg-white/60 backdrop-blur-sm border border-white/30
hover:bg-white/90 hover:border-purple-300
rounded-xl shadow-md hover:shadow-xl"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* ✅ IMAGE OR ICON */}
                <div className="p-2 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-sm group-hover:shadow-md transition-all duration-300">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-7 h-7 md:w-10 md:h-10 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <IconComponent
                      className={`${category.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                  )}
                </div>

                {/* ✅ CATEGORY NAME */}
                <div className="mt-2 flex items-center justify-center h-[34px] w-full text-center px-2">
                  <p className="text-[11px] md:text-[12px] font-medium leading-tight text-gray-700 text-center break-words line-clamp-2">
                    {category.name}
                  </p>
                </div>
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
