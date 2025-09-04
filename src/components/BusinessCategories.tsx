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
  Wrench
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
    { name: "Repair Services", icon: Wrench, color: "text-amber-600" }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={index}
                variant="category"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform duration-200"
              >
                <IconComponent className={`h-8 w-8 ${category.color}`} />
                <span className="text-sm font-medium text-center">{category.name}</span>
              </Button>
            );
          })}
        </div>
        
        {/* Duplicate row for visual effect */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
          {categories.slice(0, 9).map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={`duplicate-${index}`}
                variant="category"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform duration-200"
              >
                <IconComponent className={`h-8 w-8 ${category.color}`} />
                <span className="text-sm font-medium text-center">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessCategories;