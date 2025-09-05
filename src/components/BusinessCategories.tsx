import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  Building2,
  Trophy,
  Home,
  GraduationCap,
  Hospital,
  ShoppingBag,
  Car,
  Scissors,
  Dumbbell,
  Camera,
  Wrench,
} from "lucide-react";

const BusinessCategories = () => {
  const categories = [
    { name: "Restaurants", icon: UtensilsCrossed, color: "text-red-500" },
    { name: "Hotels", icon: Building2, color: "text-blue-500" },
    { name: "Beauty & Spa", icon: Scissors, color: "text-pink-500" },
    { name: "Home Services", icon: Home, color: "text-green-500" },
    { name: "Education", icon: GraduationCap, color: "text-purple-500" },
    { name: "Hospitals", icon: Hospital, color: "text-red-600" },
    { name: "Pet Shops", icon: Trophy, color: "text-orange-500" },
    { name: "Automobiles", icon: Car, color: "text-gray-600" },
    { name: "Fitness", icon: Dumbbell, color: "text-yellow-600" },
    { name: "Shopping", icon: ShoppingBag, color: "text-indigo-500" },
    { name: "Photography", icon: Camera, color: "text-cyan-500" },
    { name: "Repair Services", icon: Wrench, color: "text-amber-600" },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center md:text-4xl font-bold text-foreground mb-6">
          Our Categories
        </h2>

        {/* First row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant="category"
                className="flex flex-col items-center justify-center 
                           space-y-3 p-16 
                           hover:scale-105 transition-transform duration-200 
                           [&_svg]:!size-12 md:[&_svg]:!size-14"
              >
                <IconComponent className={category.color} />
                <span className="text-sm md:text-base font-medium text-center">
                  {category.name}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Duplicate row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
          {categories.slice(0, 9).map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={`duplicate-${index}`}
                variant="category"
                className="flex flex-col items-center justify-center 
                           space-y-3 p-16
                           hover:scale-105 transition-transform duration-200 
                           [&_svg]:!size-12 md:[&_svg]:!size-14"
              >
                <IconComponent className={category.color} />
                <span className="text-sm md:text-base font-medium text-center">
                  {category.name}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessCategories;
