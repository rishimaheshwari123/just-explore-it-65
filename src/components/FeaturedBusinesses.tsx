import { getAllPropertyAPI } from "@/service/operations/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllPropertyAPI();
      setProperties(response ?? []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Card
              key={property._id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={property.images?.[0]?.url || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {property.category}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  {property.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {property.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {property.location}
                </div>

                <div className="mt-4">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/property/${property._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
