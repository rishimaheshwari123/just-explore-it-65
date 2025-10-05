"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { business } from "../../service/apis";
import GooglePlacesAutocomplete from "../../components/GooglePlacesAutocomplete";
import { Camera, Globe, Mail, Phone, Share2, Upload } from "lucide-react";
import { imageUpload } from "@/service/operations/image";

const BUSINESS_CATEGORIES = [
  "Food & Dining",
  "Healthcare",
  "Education",
  "Shopping",
  "Hotels & Travel",
  "Fitness & Wellness",
  "Beauty & Spa",
  "Electronics & Technology",
  "Automotive",
  "Real Estate",
  "Financial Services",
  "Professional Services",
  "Home & Garden",
  "Entertainment",
  "Sports & Recreation",
  "Government & Community",
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

interface BusinessFormData {
  businessName: string;
  description: string;
  category: string;
  subCategory: string;
  businessType: string;
  establishedYear: string;
  employeeCount: string;
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
    whatsappNumber: string;
    email: string;
    website?: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
      linkedin: string;
    };
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
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
  images: string[];
  paymentMethods: string[];
  amenities: string[];
  priceRange: string;
}

const VendorEditBusiness = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const vendorId = user?._id;
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    description: "",
    category: "",
    subCategory: "",
    businessType: "",
    establishedYear: "",
    employeeCount: "",
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
      whatsappNumber: "",
      email: "",
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
      },
    },
    businessHours: {
      monday: { open: "09:00", close: "18:00", isClosed: false },
      tuesday: { open: "09:00", close: "18:00", isClosed: false },
      wednesday: { open: "09:00", close: "18:00", isClosed: false },
      thursday: { open: "09:00", close: "18:00", isClosed: false },
      friday: { open: "09:00", close: "18:00", isClosed: false },
      saturday: { open: "09:00", close: "18:00", isClosed: false },
      sunday: { open: "09:00", close: "18:00", isClosed: true },
    },
    services: [],
    features: [],
    tags: [],
    keywords: [],
    images: [],
    paymentMethods: [],
    amenities: [],
    priceRange: "",
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
  const [newFeature, setNewFeature] = useState("");

  // Fetch business data
  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${business.GET_BUSINESS_BY_ID_API.replace(
          "/businesses",
          "/business"
        )}/${businessId}`
      );
      const data = await response.json();
      console.log(data, "single bussiness data");
      if (data.success) {
        const businessData = data.business;
        setFormData({
          businessName: businessData.businessName || "",
          description: businessData.description || "",
          category: businessData.category || "",
          subCategory: businessData.subCategory || "",
          businessType: businessData.businessType || "",
          establishedYear: businessData.establishedYear || "",
          employeeCount: businessData.employeeCount || "",
          address: {
            street: businessData.address?.street || "",
            area: businessData.address?.area || "",
            city: businessData.address?.city || "",
            state: businessData.address?.state || "",
            pincode: businessData.address?.pincode || "",
            landmark: businessData.address?.landmark || "",
          },
          coordinates: {
            latitude: businessData.coordinates?.latitude || 0,
            longitude: businessData.coordinates?.longitude || 0,
          },
          contactInfo: {
            primaryPhone: businessData.contactInfo?.primaryPhone || "",
            secondaryPhone: businessData.contactInfo?.secondaryPhone || "",
            whatsappNumber: businessData.contactInfo?.whatsappNumber || "",
            email: businessData.contactInfo?.email || "",
            website: businessData.contactInfo?.website || "",
            socialMedia: {
              facebook: businessData.contactInfo?.socialMedia?.facebook || "",
              instagram: businessData.contactInfo?.socialMedia?.instagram || "",
              twitter: businessData.contactInfo?.socialMedia?.twitter || "",
              linkedin: businessData.contactInfo?.socialMedia?.linkedin || "",
            },
          },
          businessHours: businessData.businessHours || {
            monday: { open: "09:00", close: "18:00", isClosed: false },
            tuesday: { open: "09:00", close: "18:00", isClosed: false },
            wednesday: { open: "09:00", close: "18:00", isClosed: false },
            thursday: { open: "09:00", close: "18:00", isClosed: false },
            friday: { open: "09:00", close: "18:00", isClosed: false },
            saturday: { open: "09:00", close: "18:00", isClosed: false },
            sunday: { open: "09:00", close: "18:00", isClosed: true },
          },
          services: businessData.services || [],
          features: businessData.features || [],
          tags: businessData.tags || [],
          keywords: businessData.keywords || [],
          images: businessData.images || [],
          paymentMethods: businessData.paymentMethods || [],
          amenities: businessData.amenities || [],
          priceRange: businessData.priceRange || "",
        });
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);

  const handleInputChange = (parent: string, child: string, value: any) => {
    setFormData((prev) => {
      if (parent === "root") {
        return { ...prev, [child]: value };
      }
      return {
        ...prev,
        [parent]: {
          ...prev[parent as keyof BusinessFormData],
          [child]: value,
        },
      };
    });
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
      toast.success("Service added successfully!");
    }
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
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

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: checked
        ? [...(prev.paymentMethods ?? []), method]
        : (prev.paymentMethods ?? []).filter((m) => m !== method),
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...(prev.amenities ?? []), amenity]
        : (prev.amenities ?? []).filter((a) => a !== amenity),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      // Upload images and get URLs
      const uploadedUrls = await imageUpload(files);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 10), // Max 10 images
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload images");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !(formData.tags ?? []).includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags ?? []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags ?? []).filter((_, i) => i !== index),
    }));
  };

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      !(formData.keywords ?? []).includes(newKeyword.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...(prev.keywords ?? []), newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: (prev.keywords ?? []).filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Business Information
        if (!formData.businessName.trim())
          newErrors.businessName = "Business name is required";
        if (!formData.businessType.trim())
          newErrors.businessType = "Business type is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.description.trim())
          newErrors.description = "Description is required";
        break;

      case 2: // Contact Information
        if (!formData.contactInfo.primaryPhone.trim()) {
          newErrors.primaryPhone = "Primary phone is required";
        } else if (
          !/^\d{10}$/.test(formData.contactInfo.primaryPhone.replace(/\D/g, ""))
        ) {
          newErrors.primaryPhone = "Please enter a valid 10-digit phone number";
        }

        if (!formData.contactInfo.email.trim()) {
          newErrors.email = "Email is required";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)
        ) {
          newErrors.email = "Please enter a valid email address";
        }

        if (
          formData.contactInfo.website &&
          !/^https?:\/\/.+/.test(formData.contactInfo.website)
        ) {
          newErrors.website =
            "Please enter a valid website URL (starting with http:// or https://)";
        }
        break;

      case 3: // Address Information
        if (!formData.address.street.trim())
          newErrors.street = "Street address is required";
        if (!formData.address.area.trim()) newErrors.area = "Area is required";
        if (!formData.address.city.trim()) newErrors.city = "City is required";
        if (!formData.address.state.trim())
          newErrors.state = "State is required";
        if (!formData.address.pincode.trim()) {
          newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.address.pincode)) {
          newErrors.pincode = "Please enter a valid 6-digit pincode";
        }
        break;

      case 4: // Services & Business Hours
        if (formData.services.length === 0) {
          newErrors.services = "Please add at least one service";
        }
        break;

      case 5: // Payment & Amenities
        if (formData.paymentMethods.length === 0) {
          newErrors.paymentMethods =
            "Please select at least one payment method";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    try {
      setSaving(true);
      const response = await fetch(
        `${business.UPDATE_BUSINESS_API}/${businessId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            vendor: vendorId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Business updated successfully!");
        navigate("/vendor/businesses");
      } else {
        toast.error(data.message || "Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? "bg-blue-600 text-white"
                : step < currentStep
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < 6 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step < currentStep ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information";
      case 2:
        return "Contact Information";
      case 3:
        return "Address Information";
      case 4:
        return "Services & Business Hours";
      case 5:
        return "Features, Images & Additional Info";
      case 6:
        return "Review & Update";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/vendor/businesses")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Businesses
        </Button>
        <h1 className="text-3xl font-bold">Edit Business</h1>
      </div>

      <StepIndicator />

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Step {currentStep} of 6: {getStepTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div onKeyDown={handleKeyPress}>
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) =>
                          handleInputChange(
                            "root",
                            "businessName",
                            e.target.value
                          )
                        }
                        className={errors.businessName ? "border-red-500" : ""}
                      />
                      {errors.businessName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.businessName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Input
                        id="businessType"
                        value={formData.businessType}
                        onChange={(e) =>
                          handleInputChange(
                            "root",
                            "businessType",
                            e.target.value
                          )
                        }
                        className={errors.businessType ? "border-red-500" : ""}
                      />
                      {errors.businessType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.businessType}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("root", "category", value)
                        }
                      >
                        <SelectTrigger
                          className={`text-black bg-white border ${
                            errors.category ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select category">
                            {formData.category || "Select category"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white border">
                          {BUSINESS_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="text-black hover:bg-gray-100 cursor-pointer"
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subCategory">Sub Category</Label>
                      <Input
                        id="subCategory"
                        className="text-black bg-white border"
                        value={formData.subCategory}
                        onChange={(e) =>
                          handleInputChange(
                            "root",
                            "subCategory",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("root", "description", e.target.value)
                      }
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            e.target.value
                          )
                        }
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) =>
                          handleInputChange("root", "employeeCount", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryPhone">Primary Phone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          placeholder="+91 9876543210"
                          className={`pl-10 ${
                            errors.primaryPhone ? "border-red-500" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.primaryPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.primaryPhone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          placeholder="+91 9876543210"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="whatsappNumber"
                          value={formData.contactInfo.whatsappNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "contactInfo",
                              "whatsappNumber",
                              e.target.value
                            )
                          }
                          placeholder="+91 9876543210"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) =>
                            handleInputChange(
                              "contactInfo",
                              "email",
                              e.target.value
                            )
                          }
                          placeholder="business@example.com"
                          className={`pl-10 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          className={`pl-10 ${
                            errors.website ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.website}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Social Media Links
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.contactInfo.socialMedia.facebook}
                          onChange={(e) =>
                            handleInputChange("contactInfo", "socialMedia", {
                              ...formData.contactInfo.socialMedia,
                              facebook: e.target.value,
                            })
                          }
                          placeholder="https://facebook.com/yourbusiness"
                        />
                      </div>

                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={formData.contactInfo.socialMedia.instagram}
                          onChange={(e) =>
                            handleInputChange("contactInfo", "socialMedia", {
                              ...formData.contactInfo.socialMedia,
                              instagram: e.target.value,
                            })
                          }
                          placeholder="https://instagram.com/yourbusiness"
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={formData.contactInfo.socialMedia.twitter}
                          onChange={(e) =>
                            handleInputChange("contactInfo", "socialMedia", {
                              ...formData.contactInfo.socialMedia,
                              twitter: e.target.value,
                            })
                          }
                          placeholder="https://twitter.com/yourbusiness"
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={formData.contactInfo.socialMedia.linkedin}
                          onChange={(e) =>
                            handleInputChange("contactInfo", "socialMedia", {
                              ...formData.contactInfo.socialMedia,
                              linkedin: e.target.value,
                            })
                          }
                          placeholder="https://linkedin.com/company/yourbusiness"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Address Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) =>
                        handleInputChange("address", "street", e.target.value)
                      }
                      className={errors.street ? "border-red-500" : ""}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="area">Area *</Label>
                      <Input
                        id="area"
                        value={formData.address.area}
                        onChange={(e) =>
                          handleInputChange("address", "area", e.target.value)
                        }
                        className={errors.area ? "border-red-500" : ""}
                      />
                      {errors.area && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.area}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={formData.address.landmark}
                        onChange={(e) =>
                          handleInputChange(
                            "address",
                            "landmark",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <GooglePlacesAutocomplete
                        onPlaceSelect={handlePlaceSelect}
                        placeholder="Search for city..."
                        value={formData.address.city}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleInputChange("address", "state", e.target.value)
                        }
                        className={errors.state ? "border-red-500" : ""}
                        readOnly
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.address.pincode}
                        onChange={(e) =>
                          handleInputChange(
                            "address",
                            "pincode",
                            e.target.value
                          )
                        }
                        className={errors.pincode ? "border-red-500" : ""}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Services & Business Hours */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Services Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Services & Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={newService.name}
                        onChange={(e) =>
                          setNewService((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
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
                        className="md:col-span-1"
                      />
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          value={newService.price.min}
                          onChange={(e) =>
                            setNewService((prev) => ({
                              ...prev,
                              price: {
                                ...prev.price,
                                min: Number(e.target.value),
                              },
                            }))
                          }
                          placeholder="Min Price"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={newService.price.max}
                          onChange={(e) =>
                            setNewService((prev) => ({
                              ...prev,
                              price: {
                                ...prev.price,
                                max: Number(e.target.value),
                              },
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

                    <div className="space-y-2 mt-4">
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
                            {service.price.min > 0 && service.price.max > 0 && (
                              <p className="text-sm font-medium text-green-600">
                                ₹{service.price.min} - ₹{service.price.max}
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
                    {errors.services && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.services}
                      </p>
                    )}
                  </div>

                  {/* Business Hours */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Business Hours
                    </h3>
                    <div className="space-y-4">
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-24">
                            <Label className="capitalize">{day}</Label>
                          </div>
                          <Checkbox
                            checked={!formData.businessHours[day]?.isClosed}
                            onCheckedChange={(checked) =>
                              handleBusinessHoursChange(
                                day,
                                "isClosed",
                                !checked
                              )
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={
                                formData.businessHours[day]?.open || "09:00"
                              }
                              onChange={(e) =>
                                handleBusinessHoursChange(
                                  day,
                                  "open",
                                  e.target.value
                                )
                              }
                              disabled={formData.businessHours[day]?.isClosed}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={
                                formData.businessHours[day]?.close || "18:00"
                              }
                              onChange={(e) =>
                                handleBusinessHoursChange(
                                  day,
                                  "close",
                                  e.target.value
                                )
                              }
                              disabled={formData.businessHours[day]?.isClosed}
                              className="w-32"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Features, Images & Additional Info */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Business Features
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a business feature"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={addFeature} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {feature}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Business Photos (Max 10)
                    </h4>

                    <div className="border rounded-lg p-4 bg-muted/50">
                      <Label
                        htmlFor="imageUpload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Click to upload business photos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG up to 5MB each
                        </p>
                      </Label>
                      <Input
                        type="file"
                        id="imageUpload"
                        className="hidden"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/png, image/jpeg"
                      />
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => {
                          // अगर object आया तो image.url लो, वरना string
                          const imageUrl =
                            typeof image === "string" ? image : image.url;
                          return (
                            <div key={index} className="relative">
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`Business photo ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1 bg-background hover:bg-secondary rounded-full"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Select
                      value={formData.priceRange}
                      onValueChange={(value) =>
                        handleInputChange("root", "priceRange", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">
                          Budget Friendly (₹)
                        </SelectItem>
                        <SelectItem value="moderate">Moderate (₹₹)</SelectItem>
                        <SelectItem value="premium">Premium (₹₹₹)</SelectItem>
                        <SelectItem value="luxury">Luxury (₹₹₹₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Methods
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {PAYMENT_METHODS.map((method) => (
                        <div
                          key={method}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={method}
                            checked={
                              formData.paymentMethods?.includes(method) ?? false
                            }
                            onCheckedChange={(checked) =>
                              handlePaymentMethodChange(
                                method,
                                checked as boolean
                              )
                            }
                          />
                          <Label htmlFor={method} className="text-sm">
                            {method}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.paymentMethods && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.paymentMethods}
                      </p>
                    )}
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Amenities & Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {AMENITIES.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={amenity}
                            checked={
                              formData.amenities?.includes(amenity) ?? false
                            }
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
                  </div>

                  {/* Tags & Keywords */}
                  <div className="space-y-4">
                    <div>
                      <Label>Tags</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags?.map((tag, index) => (
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
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addKeyword();
                            }
                          }}
                        />
                        <Button type="button" onClick={addKeyword} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.keywords?.map((keyword, index) => (
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
                  </div>
                </div>
              )}

              {/* Step 6: Review & Update */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Review Your Business Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>Business Name:</strong>{" "}
                          {formData.businessName}
                        </div>
                        <div>
                          <strong>Category:</strong> {formData.category}
                        </div>
                        <div>
                          <strong>Business Type:</strong>{" "}
                          {formData.businessType}
                        </div>
                        <div>
                          <strong>Established:</strong>{" "}
                          {formData.establishedYear}
                        </div>
                        <div>
                          <strong>Employees:</strong> {formData.employeeCount}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>Email:</strong> {formData.contactInfo.email}
                        </div>
                        <div>
                          <strong>Phone:</strong>{" "}
                          {formData.contactInfo.primaryPhone}
                        </div>
                        {formData.contactInfo.website && (
                          <div>
                            <strong>Website:</strong>{" "}
                            {formData.contactInfo.website}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          {formData.address.street}, {formData.address.area}
                          <br />
                          {formData.address.city}, {formData.address.state} -{" "}
                          {formData.address.pincode}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Services & Features */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Services & Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <strong>Services:</strong> {formData.services.length}{" "}
                          services
                        </div>
                        <div>
                          <strong>Features:</strong>{" "}
                          {formData.features.join(", ")}
                        </div>
                        <div>
                          <strong>Tags:</strong> {formData.tags.join(", ")}
                        </div>
                        <div>
                          <strong>Keywords:</strong>{" "}
                          {formData.keywords.join(", ")}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Images ({formData.images.length})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {formData.images.slice(0, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Business ${index}`}
                              className="w-full h-20 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end">
                    <Button disabled={loading} onClick={handleSubmit}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating Business...
                        </div>
                      ) : (
                        "Update Business"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/vendor/businesses")}
            >
              Cancel
            </Button>

            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Business
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorEditBusiness;
