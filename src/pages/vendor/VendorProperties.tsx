import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Home, Building, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  getVendorPropertyAPI,
  deletePropertyAPI,
} from "@/service/operations/property";
import { toast } from "sonner";
import { EditPropertyModal } from "./edit-property-modal";

interface Property {
  _id: string;
  title: string;
  location: string;
  category: string;
  images: Array<{ url: string }>;

  description?: string;
}

const VendorProperties = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const fetchProperties = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const vendorProperties = await getVendorPropertyAPI({ vendor: user._id });
      console.log(vendorProperties);
      setProperties(vendorProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const handleDelete = async (propertyId: string) => {
    setProperties(properties.filter((p) => p._id !== propertyId));
    await deletePropertyAPI(propertyId);
    toast.success("Property deleted successfully!");
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  const handleSaveProperty = (updatedProperty: Property) => {
    setProperties(
      properties.map((p) =>
        p._id === updatedProperty._id ? updatedProperty : p
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600">Loading your properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Button
          onClick={() => navigate("/vendor/add-property")}
          className="gradient-gold text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <Home className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  No properties yet
                </h3>
                <p className="text-gray-500">
                  Start by adding your first property listing
                </p>
              </div>
              <Button
                onClick={() => navigate("/vendor/add-property")}
                className="gradient-gold text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden">
              {property.images && property.images.length > 0 && (
                <div className="aspect-video relative">
                  <img
                    src={property.images[0]?.url || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <div className="flex items-center justify-between">
                  {property.category}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">{property.location}</p>

                  {property.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(property._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditPropertyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        property={selectedProperty}
        onSave={handleSaveProperty}
        fetchProperties={fetchProperties}
      />
    </div>
  );
};

export default VendorProperties;
