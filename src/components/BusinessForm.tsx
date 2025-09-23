import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Upload,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";

interface BusinessFormProps {
  businessId?: string;
  mode: "add" | "edit";
}

interface BusinessFormData {
  businessName: string;
  description: string;
  category: string;
  subCategory: string;
  businessType: string;
  establishedYear: number;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    primaryPhone: string;
    secondaryPhone: string;
    email: string;
    website: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  services: Array<{
    name: string;
    description: string;
    price: {
      min: number;
      max: number;
      currency: string;
    };
  }>;
  features: string[];
  tags: string[];
  keywords: string[];
  paymentMethods: string[];
  amenities: string[];
  images: string[];
}

const BUSINESS_CATEGORIES = [
  "Food & Dining",
  "Shopping & Retail",
  "Health & Medical",
  "Beauty & Spa",
  "Automotive",
  "Home & Garden",
  "Professional Services",
  "Entertainment",
  "Education & Training",
  "Travel & Tourism",
  "Sports & Recreation",
  "Financial Services",
  "Government & Community",
];

const SUBCATEGORIES: { [key: string]: string[] } = {
  "Food & Dining": [
    "Restaurant",
    "Fast Food",
    "Cafe",
    "Bakery",
    "Sweet Shop",
    "Ice Cream",
    "Catering",
  ],
  "Shopping & Retail": [
    "Clothing",
    "Electronics",
    "Grocery",
    "Pharmacy",
    "Books",
    "Gifts",
    "Jewelry",
  ],
  "Health & Medical": [
    "Hospital",
    "Clinic",
    "Dental",
    "Eye Care",
    "Physiotherapy",
    "Laboratory",
    "Veterinary",
  ],
  "Beauty & Spa": [
    "Salon",
    "Spa",
    "Massage",
    "Nail Art",
    "Makeup Artist",
    "Tattoo",
    "Piercing",
  ],
  Automotive: [
    "Car Repair",
    "Bike Repair",
    "Car Wash",
    "Fuel Station",
    "Spare Parts",
    "Towing",
  ],
  "Professional Services": [
    "Legal Services",
    "Accounting",
    "Consulting",
    "IT Services",
    "Marketing",
    "Photography",
  ],
  "Home & Garden": [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Pest Control",
    "AC Repair",
    "Appliance Repair",
  ],
  Entertainment: [
    "Cinema",
    "Gaming Zone",
    "Event Management",
    "DJ Services",
    "Party Hall",
  ],
  "Sports & Recreation": [
    "Sports Club",
    "Cricket Academy",
    "Swimming Pool",
    "Badminton Court",
  ],
  "Government & Community": [
    "Government Office",
    "Community Center",
    "Public Services",
    "NGO",
  ],
};

const BUSINESS_TYPES = [
  "Individual",
  "Partnership",
  "Private Limited",
  "Public Limited",
  "LLP",
  "Proprietorship",
];

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Wallet",
  "Cheque",
];

const AMENITIES = [
  "Parking Available",
  "WiFi",
  "Air Conditioning",
  "Wheelchair Accessible",
  "Home Delivery",
  "Online Booking",
  "24/7 Service",
  "Emergency Service",
  "Free Consultation",
  "Certified Staff",
];

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// City data with state, pincode and coordinates
// Removed CITY_DATA - now using GooglePlacesAutocomplete for dynamic city selection

const BusinessForm: React.FC<BusinessFormProps> = ({ businessId, mode }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    description: "",
    category: "",
    subCategory: "",
    businessType: "Individual",
    establishedYear: new Date().getFullYear(),
    address: {
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    contactInfo: {
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      website: "",
    },
    businessHours: {
      monday: { open: "09:00", close: "18:00", isOpen: true },
      tuesday: { open: "09:00", close: "18:00", isOpen: true },
      wednesday: { open: "09:00", close: "18:00", isOpen: true },
      thursday: { open: "09:00", close: "18:00", isOpen: true },
      friday: { open: "09:00", close: "18:00", isOpen: true },
      saturday: { open: "09:00", close: "18:00", isOpen: true },
      sunday: { open: "09:00", close: "18:00", isOpen: false },
    },
    services: [],
    features: [],
    tags: [],
    keywords: [],
    paymentMethods: [],
    amenities: [],
    images: [],
  });

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: {
      min: 0,
      max: 0,
      currency: "INR",
    },
  });

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    if (mode === "edit" && businessId) {
      fetchBusinessData();
    }
  }, [businessId, mode]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://just-explore-it-65.onrender.com/api/v1/property/businesses/${businessId}`
      );
      const data = await response.json();

      if (data.success) {
        const business = data.business;
        setFormData({
          businessName: business.businessName || "",
          description: business.description || "",
          category: business.category || "",
          subCategory: business.subCategory || "",
          businessType: business.businessType || "Individual",
          establishedYear: business.establishedYear || new Date().getFullYear(),
          address: {
            street: business.address?.street || business.fullAddress || "",
            area: business.address?.area || business.area || "",
            city: business.address?.city || "",
            state: business.address?.state || "",
            pincode: business.address?.pincode || "",
            landmark: business.address?.landmark || "",
          },
          coordinates: {
            latitude:
              business.coordinates?.latitude ||
              business.location?.coordinates?.[1] ||
              0,
            longitude:
              business.coordinates?.longitude ||
              business.location?.coordinates?.[0] ||
              0,
          },
          contactInfo: {
            primaryPhone: business.contactInfo?.phone || business.phone || "",
            secondaryPhone:
              business.contactInfo?.alternatePhone ||
              business.alternatePhone ||
              "",
            email: business.contactInfo?.email || business.email || "",
            website: business.contactInfo?.website || business.website || "",
          },
          businessHours: business.businessHours || formData.businessHours,
          services: business.services || [],
          features: business.features || [],
          tags: business.tags || [],
          keywords: business.keywords || [],
          paymentMethods: business.paymentMethods || [],
          amenities: business.amenities || [],
          images: business.images || [],
        });
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === "root") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof BusinessFormData],
          [field]: value,
        },
      }));
    }
  };

  const handlePlaceSelect = (place: any) => {
    if (place && place.address_components) {
      const addressComponents = place.address_components;
      let city = "";
      let state = "";
      let pincode = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (
          types.includes("locality") ||
          types.includes("administrative_area_level_2")
        ) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (types.includes("postal_code")) {
          pincode = component.long_name;
        }
      });

      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          city,
          state,
          pincode,
        },
        coordinates: {
          latitude: lat,
          longitude: lng,
        },
      }));
    }
  };

  const handleBusinessHoursChange = (
    day: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }));
  };

  const addService = () => {
    if (newService.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }));
      setNewService({
        name: "",
        description: "",
        price: {
          min: 0,
          max: 0,
          currency: "INR",
        },
      });
    }
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((f) => f !== amenity),
    }));
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: checked
        ? [...prev.paymentMethods, method]
        : prev.paymentMethods.filter((m) => m !== method),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, event.target!.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate coordinates before submitting
    if (
      !formData.coordinates.latitude ||
      !formData.coordinates.longitude ||
      formData.coordinates.latitude === 0 ||
      formData.coordinates.longitude === 0
    ) {
      toast.error("Please select a valid city to set coordinates");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        businessName: formData.businessName,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        businessType: formData.businessType,
        establishedYear: formData.establishedYear,
        address: formData.address,
        area: formData.address.area,
        coordinates: formData.coordinates,
        phone: formData.contactInfo.primaryPhone,
        alternatePhone: formData.contactInfo.secondaryPhone,
        email: formData.contactInfo.email,
        website: formData.contactInfo.website,
        businessHours: formData.businessHours,
        services: formData.services,
        features: formData.features,
        tags: formData.tags,
        keywords: formData.keywords,
        paymentMethods: formData.paymentMethods,
        amenities: formData.amenities,
        images: formData.images,
        vendor: user?._id || "68c10c881b9aff6e9b853fd5",
      };

      const url =
        mode === "add"
          ? "https://just-explore-it-65.onrender.com/api/v1/property/create-business"
          : `https://just-explore-it-65.onrender.com/api/v1/property/businesses/${businessId}`;

      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Business ${mode === "add" ? "created" : "updated"} successfully!`
        );
        navigate("/business-listing");
      } else {
        toast.error(data.message || `Failed to ${mode} business`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing business:`, error);
      toast.error(`Failed to ${mode} business`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === "edit") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading business data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">
            {mode === "add" ? "Add New Business" : "Edit Business"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("root", "businessName", e.target.value)
                    }
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      handleInputChange("root", "category", value);
                      handleInputChange("root", "subCategory", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subCategory">Sub Category *</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) =>
                      handleInputChange("root", "subCategory", value)
                    }
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category &&
                        SUBCATEGORIES[formData.category]?.map((subCategory) => (
                          <SelectItem key={subCategory} value={subCategory}>
                            {subCategory}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) =>
                      handleInputChange("root", "businessType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) =>
                      handleInputChange(
                        "root",
                        "establishedYear",
                        parseInt(e.target.value)
                      )
                    }
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("root", "description", e.target.value)
                    }
                    placeholder="Describe your business..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryPhone">Primary Phone *</Label>
                  <Input
                    id="primaryPhone"
                    value={formData.contactInfo.primaryPhone}
                    onChange={(e) =>
                      handleInputChange(
                        "contactInfo",
                        "primaryPhone",
                        e.target.value
                      )
                    }
                    placeholder="Primary phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input
                    id="secondaryPhone"
                    value={formData.contactInfo.secondaryPhone}
                    onChange={(e) =>
                      handleInputChange(
                        "contactInfo",
                        "secondaryPhone",
                        e.target.value
                      )
                    }
                    placeholder="Secondary phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) =>
                      handleInputChange("contactInfo", "email", e.target.value)
                    }
                    placeholder="business@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.contactInfo.website}
                    onChange={(e) =>
                      handleInputChange(
                        "contactInfo",
                        "website",
                        e.target.value
                      )
                    }
                    placeholder="https://www.yourbusiness.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Textarea
                    id="street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleInputChange("address", "street", e.target.value)
                    }
                    placeholder="Enter complete street address"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="area">Area/Locality</Label>
                  <Input
                    id="area"
                    value={formData.address.area}
                    onChange={(e) =>
                      handleInputChange("address", "area", e.target.value)
                    }
                    placeholder="Area or locality"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <GooglePlacesAutocomplete
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Search for city..."
                    value={formData.address.city}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleInputChange("address", "state", e.target.value)
                    }
                    placeholder="State"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.address.pincode}
                    onChange={(e) =>
                      handleInputChange("address", "pincode", e.target.value)
                    }
                    placeholder="Pincode"
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.address.landmark}
                    onChange={(e) =>
                      handleInputChange("address", "landmark", e.target.value)
                    }
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <Checkbox
                      checked={formData.businessHours[day]?.isOpen || false}
                      onCheckedChange={(checked) =>
                        handleBusinessHoursChange(day, "isOpen", checked)
                      }
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={formData.businessHours[day]?.open || "09:00"}
                        onChange={(e) =>
                          handleBusinessHoursChange(day, "open", e.target.value)
                        }
                        disabled={!formData.businessHours[day]?.isOpen}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={formData.businessHours[day]?.close || "18:00"}
                        onChange={(e) =>
                          handleBusinessHoursChange(
                            day,
                            "close",
                            e.target.value
                          )
                        }
                        disabled={!formData.businessHours[day]?.isOpen}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  value={newService.name}
                  onChange={(e) =>
                    setNewService((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Service name"
                  className="md:col-span-2"
                />
                <Input
                  value={newService.description}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description"
                  className="md:col-span-2"
                />
                <Input
                  type="number"
                  value={newService.price.min}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      price: { ...prev.price, min: Number(e.target.value) },
                    }))
                  }
                  placeholder="Min Price"
                />
                <div className="flex gap-1">
                  <Input
                    type="number"
                    value={newService.price.max}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        price: { ...prev.price, max: Number(e.target.value) },
                      }))
                    }
                    placeholder="Max Price"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addService} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      )}
                      {(service.price.min > 0 || service.price.max > 0) && (
                        <p className="text-sm font-medium text-green-600">
                          ₹{service.price.min}
                          {service.price.max > service.price.min &&
                            ` - ₹${service.price.max}`}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags & Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Tags & Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Keywords</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                  />
                  <Button type="button" onClick={addKeyword} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeKeyword(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.paymentMethods.includes(method)}
                      onCheckedChange={(checked) =>
                        handlePaymentMethodChange(method, checked as boolean)
                      }
                    />
                    <Label htmlFor={method} className="text-sm">
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity, checked as boolean)
                      }
                    />
                    <Label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Business Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2"
                />
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Business ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === "add" ? "Create Business" : "Update Business"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
