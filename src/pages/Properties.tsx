import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Tag } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getAllPropertyAPI } from "@/service/operations/property";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

interface Property {
  _id: string;
  title: string;
  location: string;
  category: string;
  images: { url: string }[];
  description?: string;
}

const Properties = () => {
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <p className="text-lg text-gray-600">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      <TopBar />
      <Header />
      <div className="mx-auto max-w-7xl">
        {properties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <Home className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  No properties available yet
                </h3>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card
                key={property._id}
                className="cursor-pointer overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                {property.images && property.images.length > 0 && (
                  <div className="relative aspect-video">
                    <img
                      src={property.images[0]?.url || "/placeholder.svg"}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold">
                    {property.title}
                  </CardTitle>
                  <Badge className="flex w-fit items-center space-x-1 bg-blue-100 text-blue-800">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span>{property.category}</span>
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                  {property.description && (
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {property.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Properties;
