"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  createBusinessAPI,
  getBusinessByIdAPI,
  updateBusinessAPI,
} from "../service/operations/business";
import {
  Plus,
  X,
  Upload,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { imageUpload } from "@/service/operations/image";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import { getAllVendorAPI } from "@/service/operations/vendor";

interface BusinessFormData {
  businessName: string;
  description: string;
  category: string;
  subCategory: string;
  businessType: string;
  establishedYear: string;
  employeeCount: string;
  selectedVendor?: string; // Add vendor selection field for admin
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

const BUSINESS_CATEGORIES = [
  "Advertising Agencies",
  "Agriculture Equipment & Seeds",
  "Apparels / Garments",
  "Automobiles (Car, Bike, Showroom, Service)",
  "Automobile Spare Parts",
  "Baby Care & Kids Stores",
  "Banks & ATMs",
  "Banquet Halls",
  "Beauty Parlours & Salons",
  "Boutiques & Tailors",
  "Book Shops & Stationery",
  "Builders & Developers",
  "Car Rentals & Taxi Services",
  "Catering Services",
  "Chemists & Medical Stores",
  "Coaching Classes & Tuition",
  "Computer Sales & Services",
  "Courier & Cargo Services",
  "Dairy Products & Milk Suppliers",
  "Dance & Music Classes",
  "Diagnostic Centres & Pathology Labs",
  "Doctors (All Specializations)",
  "Dry Cleaners & Laundry Services",
  "Education Institutes",
  "Electricians",
  "Electronics & Home Appliances",
  "Event Organisers",
  "Eye Clinics & Opticians",
  "Fast Food & Restaurants",
  "Fitness Centres & Gyms",
  "Florists",
  "Furniture Dealers & Home Decor",
  "Financial Services (Loans, Insurance, CA)",
  "Garment Shops",
  "Gas Agencies",
  "Gift Shops",
  "Grocery Stores & Kirana",
  "Gynecologists",
  "Hardware & Sanitary Shops",
  "Hospitals & Nursing Homes",
  "Hostels / PG Accommodation",
  "Hotels & Resorts",
  "House Cleaning & Pest Control",
  "Ice Cream Parlours",
  "Interior Designers",
  "Internet Service Providers",
  "Insurance Agents",
  "Industrial Suppliers",
  "Jewellery Shops",
  "Job Placement Agencies",
  "Juice Centres",
  "Kids Wear & Toy Shops",
  "Kitchen Appliances Dealers",
  "Laboratories (Medical/Industrial)",
  "Laundry Services",
  "Lawyers & Legal Services",
  "Libraries",
  "Lighting Shops",
  "Marriage Gardens",
  "Mobile Phone Dealers & Repair",
  "Modular Kitchen Dealers",
  "Movers & Packers",
  "Music Instrument Shops",
  "Nursing Homes",
  "Nutritionists & Dieticians",
  "Opticians",
  "Online Shopping / E-commerce Support",
  "Orthopedic Clinics",
  "Painters & Contractors",
  "Pet Shops & Veterinary Clinics",
  "Petrol Pumps",
  "Photographers & Videographers",
  "Printing Press & Xerox",
  "Property Dealers",
  "Quick Service Restaurants",
  "Quilts & Bedding Dealers",
  "Real Estate Agents",
  "Restaurants & Cafes",
  "Repair Services (AC, Fridge, Washing Machine)",
  "Resorts & Holiday Homes",
  "Schools & Colleges",
  "Security Services & Guards",
  "Solar Dealers (Water Heater, Rooftop)",
  "Sports Shops & Academies",
  "Stationery & Xerox Shops",
  "Tailors & Boutiques",
  "Taxi Services & Car Rentals",
  "Tiffin Centres",
  "Tour & Travel Agents",
  "Tent House & Decorators",
  "Universities",
  "UPS & Inverter Dealers",
  "Uniform Suppliers",
  "Vegetable & Fruit Vendors",
  "Veterinary Doctors",
  "Video Shooting & Editing Services",
  "Vehicle Repair Garages",
  "Water Suppliers (20L Jar, Tanker)",
  "Wedding Planners",
  "Watch & Clock Dealers",
  "Wellness & Spa Centres",
  "Website Designers & IT Services",
  "Xerox & Printing Services",
  "X-Ray & Radiology Centres",
  "Yoga Centres",
  "Yellow Pages / Directory Services",
  "Zari & Embroidery Shops",
  "Zoological & Pet Services",
];

const SUBCATEGORIES: { [key: string]: string[] } = {
  "Advertising Agencies": ["Advertising Agencies"],
  "Agriculture Equipment & Seeds": ["Agriculture Equipment & Seeds"],
  "Apparels / Garments": [
    "Men's Wear",
    "Women's Wear",
    "Kids Wear",
    "Accessories",
  ],
  "Automobiles (Car, Bike, Showroom, Service)": [
    "Car Showroom",
    "Bike Showroom",
    "Car Service",
    "Bike Service",
  ],
  "Automobile Spare Parts": ["Car Parts", "Bike Parts", "Tyres", "Batteries"],
  "Baby Care & Kids Stores": [
    "Toys",
    "Clothing",
    "Feeding Supplies",
    "Baby Care Products",
  ],
  "Banks & ATMs": [
    "Bank Branches",
    "ATMs",
    "Loan Services",
    "Investment Services",
  ],
  "Banquet Halls": ["Wedding Halls", "Party Halls", "Corporate Events"],
  "Beauty Parlours & Salons": ["Salon", "Haircut", "Spa", "Bridal Makeup"],
  "Boutiques & Tailors": ["Boutique", "Tailoring", "Custom Clothing"],
  "Book Shops & Stationery": [
    "Books",
    "Stationery",
    "Magazines",
    "School Supplies",
  ],
  "Builders & Developers": [
    "Residential Builders",
    "Commercial Builders",
    "Developers",
  ],
  "Car Rentals & Taxi Services": [
    "Car Rental",
    "Taxi Service",
    "Airport Pickup",
  ],
  "Catering Services": [
    "Wedding Catering",
    "Corporate Catering",
    "Event Catering",
  ],
  "Chemists & Medical Stores": ["Pharmacy", "Medicines", "Healthcare Products"],
  "Coaching Classes & Tuition": [
    "School Coaching",
    "Competitive Exams",
    "Skill Development",
  ],
  "Computer Sales & Services": [
    "Computer Store",
    "Laptop Sales",
    "Computer Repair",
    "Networking Services",
  ],
  "Courier & Cargo Services": [
    "Courier Service",
    "Cargo Service",
    "Parcel Pickup",
  ],
  "Dairy Products & Milk Suppliers": ["Milk", "Butter", "Cheese", "Ghee"],
  "Dance & Music Classes": [
    "Dance Classes",
    "Music Classes",
    "Instrument Training",
  ],
  "Diagnostic Centres & Pathology Labs": [
    "Blood Tests",
    "X-Ray",
    "MRI",
    "Ultrasound",
  ],
  "Doctors (All Specializations)": [
    "General Physician",
    "Dentist",
    "Cardiologist",
    "Gynecologist",
    "Pediatrician",
    "Dermatologist",
  ],
  "Dry Cleaners & Laundry Services": ["Laundry", "Dry Cleaning", "Ironing"],
  "Education Institutes": [
    "Schools",
    "Colleges",
    "Skill Development",
    "Vocational Courses",
  ],
  Electricians: [
    "Residential Electrical",
    "Commercial Electrical",
    "Wiring Services",
  ],
  "Electronics & Home Appliances": [
    "TV",
    "Fridge",
    "Washing Machine",
    "AC",
    "Mobile Devices",
  ],
  "Event Organisers": [
    "Wedding Planning",
    "Corporate Events",
    "Birthday Parties",
  ],
  "Eye Clinics & Opticians": [
    "Eye Checkup",
    "Spectacles",
    "Contact Lenses",
    "Optical Store",
  ],
  "Fast Food & Restaurants": ["Fast Food", "Restaurant", "Cafe", "Beverages"],
  "Fitness Centres & Gyms": ["Gym", "Yoga", "Aerobics", "Zumba"],
  Florists: ["Flower Shops", "Bouquets", "Event Decoration"],
  "Furniture Dealers & Home Decor": [
    "Furniture Store",
    "Home Decor",
    "Modular Kitchen",
  ],
  "Financial Services (Loans, Insurance, CA)": [
    "Banking",
    "Loans",
    "Insurance",
    "Accounting",
  ],
  "Garment Shops": ["Men's Wear", "Women's Wear", "Kids Wear", "Accessories"],
  "Gas Agencies": ["Domestic Gas", "Commercial Gas", "Cylinder Delivery"],
  "Gift Shops": ["Gifts", "Greeting Cards", "Toys", "Souvenirs"],
  "Grocery Stores & Kirana": [
    "Grocery Store",
    "Kirana Shop",
    "Daily Essentials",
  ],
  Gynecologists: ["Gynecologist"],
  "Hardware & Sanitary Shops": ["Hardware Store", "Sanitary Products", "Tools"],
  "Hospitals & Nursing Homes": [
    "Hospital",
    "Nursing Home",
    "Emergency Services",
  ],
  "Hostels / PG Accommodation": [
    "Hostel",
    "PG Accommodation",
    "Shared Apartments",
  ],
  "Hotels & Resorts": ["Hotel", "Resort", "Guest House"],
  "House Cleaning & Pest Control": [
    "House Cleaning",
    "Pest Control",
    "Sanitization",
  ],
  "Ice Cream Parlours": ["Ice Cream", "Desserts", "Frozen Yogurt"],
  "Interior Designers": ["Interior Design", "Home Decor", "Modular Furniture"],
  "Internet Service Providers": [
    "Broadband",
    "Fiber Internet",
    "Wi-Fi Services",
  ],
  "Insurance Agents": [
    "Life Insurance",
    "Health Insurance",
    "Vehicle Insurance",
  ],
  "Industrial Suppliers": ["Industrial Equipment", "Raw Materials", "Tools"],
  "Jewellery Shops": ["Gold", "Silver", "Diamond", "Custom Jewellery"],
  "Job Placement Agencies": ["Recruitment", "Staffing", "Career Guidance"],
  "Juice Centres": ["Fresh Juice", "Smoothies", "Cold Pressed Juice"],
  "Kids Wear & Toy Shops": ["Kids Clothing", "Toys", "School Supplies"],
  "Kitchen Appliances Dealers": [
    "Microwave",
    "Oven",
    "Refrigerator",
    "Blender",
  ],
  "Laboratories (Medical/Industrial)": [
    "Medical Lab",
    "Industrial Lab",
    "Testing Services",
  ],
  "Laundry Services": ["Laundry", "Dry Cleaning", "Ironing"],
  "Lawyers & Legal Services": ["Lawyer", "Legal Consultation", "Documentation"],
  Libraries: ["Public Library", "School Library", "College Library"],
  "Lighting Shops": ["LED Lights", "Bulbs", "Lamps", "Chandeliers"],
  "Marriage Gardens": ["Wedding Venue", "Banquet Hall", "Event Garden"],
  "Mobile Phone Dealers & Repair": [
    "Mobile Store",
    "Repair Services",
    "Accessories",
  ],
  "Modular Kitchen Dealers": [
    "Modular Kitchen",
    "Cabinets",
    "Kitchen Accessories",
  ],
  "Movers & Packers": ["House Moving", "Office Relocation", "Packing Services"],
  "Music Instrument Shops": ["Guitar", "Piano", "Drums", "Other Instruments"],
  "Nursing Homes": ["Nursing Home", "Elderly Care", "Medical Assistance"],
  "Nutritionists & Dieticians": [
    "Diet Consultation",
    "Weight Management",
    "Health Plans",
  ],
  Opticians: ["Spectacles", "Contact Lenses", "Eye Checkup"],
  "Online Shopping / E-commerce Support": [
    "E-commerce",
    "Online Store",
    "Delivery Support",
  ],
  "Orthopedic Clinics": ["Orthopedic Consultation", "Surgery", "Physiotherapy"],
  "Painters & Contractors": ["Painting", "Renovation", "Construction"],
  "Pet Shops & Veterinary Clinics": [
    "Pet Shop",
    "Veterinary Clinic",
    "Pet Care",
  ],
  "Petrol Pumps": ["Petrol Station", "Diesel Station", "CNG Station"],
  "Photographers & Videographers": [
    "Photography",
    "Videography",
    "Drone Services",
  ],
  "Printing Press & Xerox": ["Printing", "Xerox", "Photocopy"],
  "Property Dealers": ["Real Estate", "Property Sale", "Property Rent"],
  "Quick Service Restaurants": ["Fast Food", "Burger", "Pizza", "Sandwich"],
  "Quilts & Bedding Dealers": ["Quilts", "Bedsheets", "Pillows", "Blankets"],
  "Real Estate Agents": ["Property Dealer", "Builder", "Brokerage"],
  "Restaurants & Cafes": ["Restaurant", "Cafe", "Bakery", "Beverages"],
  "Repair Services (AC, Fridge, Washing Machine)": [
    "AC Repair",
    "Fridge Repair",
    "Washing Machine Repair",
  ],
  "Resorts & Holiday Homes": ["Resort", "Holiday Home", "Villa Rental"],
  "Schools & Colleges": ["School", "College", "Coaching Center"],
  "Security Services & Guards": [
    "Security Guard",
    "CCTV Installation",
    "Event Security",
  ],
  "Solar Dealers (Water Heater, Rooftop)": [
    "Solar Panels",
    "Water Heater",
    "Rooftop Installation",
  ],
  "Sports Shops & Academies": ["Sports Shop", "Academy", "Coaching Classes"],
  "Stationery & Xerox Shops": ["Stationery", "Xerox", "Printing Services"],
  "Tailors & Boutiques": ["Tailor", "Boutique", "Custom Clothing"],
  "Taxi Services & Car Rentals": [
    "Taxi Service",
    "Car Rental",
    "Airport Pickup",
  ],
  "Tiffin Centres": ["Tiffin Service", "Home Delivery", "Meal Subscription"],
  "Tour & Travel Agents": ["Travel Agency", "Tour Guide", "Holiday Packages"],
  "Tent House & Decorators": ["Tent Rental", "Decorators", "Event Setup"],
  Universities: ["University", "Courses", "Hostel", "Research Centers"],
  "UPS & Inverter Dealers": ["UPS", "Inverters", "Electrical Equipment"],
  "Uniform Suppliers": ["School Uniforms", "Corporate Uniforms", "Safety Wear"],
  "Vegetable & Fruit Vendors": ["Vegetables", "Fruits", "Organic Produce"],
  "Veterinary Doctors": [
    "Veterinary Consultation",
    "Pet Care",
    "Animal Surgery",
  ],
  "Video Shooting & Editing Services": [
    "Video Shooting",
    "Editing",
    "Drone Services",
  ],
  "Vehicle Repair Garages": ["Car Repair", "Bike Repair", "Service Center"],
  "Water Suppliers (20L Jar, Tanker)": [
    "Water Delivery",
    "Jar Supply",
    "Tanker Supply",
  ],
  "Wedding Planners": ["Wedding Planning", "Event Management", "Decor"],
  "Watch & Clock Dealers": ["Watches", "Clocks", "Repair Services"],
  "Wellness & Spa Centres": ["Spa", "Wellness Center", "Massage Therapy"],
  "Website Designers & IT Services": [
    "Web Design",
    "IT Services",
    "Digital Marketing",
  ],
  "Xerox & Printing Services": ["Xerox", "Printing", "Photocopy"],
  "X-Ray & Radiology Centres": ["X-Ray", "MRI", "CT Scan", "Ultrasound"],
  "Yoga Centres": ["Yoga Classes", "Meditation", "Fitness"],
  "Yellow Pages / Directory Services": [
    "Business Directory",
    "Listing Services",
  ],
  "Zari & Embroidery Shops": ["Zari Work", "Embroidery", "Custom Clothing"],
  "Zoological & Pet Services": ["Zoo Services", "Pet Care", "Animal Feeding"],
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
const CITY_DATA = {
  Mumbai: {
    state: "Maharashtra",
    pincode: "400001",
    lat: 19.076,
    lng: 72.8777,
  },
  Delhi: { state: "Delhi", pincode: "110001", lat: 28.7041, lng: 77.1025 },
  Bangalore: {
    state: "Karnataka",
    pincode: "560001",
    lat: 12.9716,
    lng: 77.5946,
  },
  Hyderabad: {
    state: "Telangana",
    pincode: "500001",
    lat: 17.385,
    lng: 78.4867,
  },
  Chennai: {
    state: "Tamil Nadu",
    pincode: "600001",
    lat: 13.0827,
    lng: 80.2707,
  },
  Kolkata: {
    state: "West Bengal",
    pincode: "700001",
    lat: 22.5726,
    lng: 88.3639,
  },
  Pune: { state: "Maharashtra", pincode: "411001", lat: 18.5204, lng: 73.8567 },
  Ahmedabad: {
    state: "Gujarat",
    pincode: "380001",
    lat: 23.0225,
    lng: 72.5714,
  },
  Jaipur: { state: "Rajasthan", pincode: "302001", lat: 26.9124, lng: 75.7873 },
  Surat: { state: "Gujarat", pincode: "395001", lat: 21.1702, lng: 72.8311 },
  Lucknow: {
    state: "Uttar Pradesh",
    pincode: "226001",
    lat: 26.8467,
    lng: 80.9462,
  },
  Kanpur: {
    state: "Uttar Pradesh",
    pincode: "208001",
    lat: 26.4499,
    lng: 80.3319,
  },
  Nagpur: {
    state: "Maharashtra",
    pincode: "440001",
    lat: 21.1458,
    lng: 79.0882,
  },
  Indore: {
    state: "Madhya Pradesh",
    pincode: "452001",
    lat: 22.7196,
    lng: 75.8577,
  },
  Thane: {
    state: "Maharashtra",
    pincode: "400601",
    lat: 19.2183,
    lng: 72.9781,
  },
  Bhopal: {
    state: "Madhya Pradesh",
    pincode: "462001",
    lat: 23.2599,
    lng: 77.4126,
  },
  Visakhapatnam: {
    state: "Andhra Pradesh",
    pincode: "530001",
    lat: 17.6868,
    lng: 83.2185,
  },
  Pimpri: {
    state: "Maharashtra",
    pincode: "411017",
    lat: 18.6298,
    lng: 73.8131,
  },
  Patna: { state: "Bihar", pincode: "800001", lat: 25.5941, lng: 85.1376 },
  Vadodara: { state: "Gujarat", pincode: "390001", lat: 22.3072, lng: 73.1812 },
};

interface AddBusinessFormProps {
  mode?: "add" | "edit";
  businessId?: string;
}

const AddBusinessForm: React.FC<AddBusinessFormProps> = ({
  mode = "add",
  businessId,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);

  // Removed unused state variables for hardcoded city suggestions

  // Fetch vendors for admin dropdown
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "super_admin") {
      const fetchVendors = async () => {
        try {
          const vendorList = await getAllVendorAPI();
          setVendors(vendorList);
        } catch (error) {
          console.error("Error fetching vendors:", error);
        }
      };
      fetchVendors();
    }
  }, [user?.role]);

  // Load business data for edit mode
  useEffect(() => {
    if (mode === "edit" && businessId) {
      const loadBusinessData = async () => {
        try {
          setLoading(true);
          const response = await getBusinessByIdAPI(businessId);
          if (response?.success && response?.business) {
            const business = response.business;
            setFormData({
              businessName: business.businessName || "",
              description: business.description || "",
              category: business.category || "",
              subCategory: business.subCategory || "",
              businessType: business.businessType || "",
              establishedYear: business.establishedYear || "",
              employeeCount: business.employeeCount || "",
              address: business.address || {
                street: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
              },
              coordinates: business.coordinates || {
                latitude: 0,
                longitude: 0,
              },
              contactInfo: business.contactInfo || {
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
              businessHours: business.businessHours || {
                monday: { open: "09:00", close: "18:00", isClosed: false },
                tuesday: { open: "09:00", close: "18:00", isClosed: false },
                wednesday: { open: "09:00", close: "18:00", isClosed: false },
                thursday: { open: "09:00", close: "18:00", isClosed: false },
                friday: { open: "09:00", close: "18:00", isClosed: false },
                saturday: { open: "09:00", close: "18:00", isClosed: false },
                sunday: { open: "09:00", close: "18:00", isClosed: true },
              },
              services: business.services || [],
              features: business.features || [],
              tags: business.tags || [],
              keywords: business.keywords || [],
              images: business.images || [],
              paymentMethods: business.paymentMethods || [],
              amenities: business.amenities || [],
              priceRange: business.priceRange || "",
            });
            toast.success("Business data loaded successfully!");
          }
        } catch (error) {
          console.error("Error loading business data:", error);
          toast.error("Failed to load business data");
        } finally {
          setLoading(false);
        }
      };
      loadBusinessData();
    }
  }, [mode, businessId]);

  // Handle Google Places selection
  const handlePlaceSelect = (placeDetails: any) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        street: placeDetails.street,
        area: placeDetails.area,
        city: placeDetails.city,
        state: placeDetails.state,
        pincode: placeDetails.pincode,
        landmark: prev.address.landmark, // Keep existing landmark
      },
      coordinates: {
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
      },
    }));

    // Hide city suggestions when place is selected
    setShowSuggestions(false);

    toast.success("Address details filled automatically!");
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === "root") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof BusinessFormData],
          [field]: value,
        },
      }));
    }

    // Auto-set coordinates when city is changed
    if (section === "address" && field === "city") {
      const cityData = CITY_DATA[value as keyof typeof CITY_DATA];
      if (cityData) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            state: cityData.state,
            pincode: cityData.pincode,
          },
          coordinates: {
            latitude: cityData.lat,
            longitude: cityData.lng,
          },
        }));
      }
    }
  };

  // Removed handleCityChange function - now using GooglePlacesAutocomplete

  // Removed handleAddressSearch function - now using GooglePlacesAutocomplete for city selection

  // Get coordinates from address
  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const coordinates = {
          latitude: Number.parseFloat(data[0].lat),
          longitude: Number.parseFloat(data[0].lon),
        };

        setFormData((prev) => ({
          ...prev,
          coordinates: coordinates,
        }));
        return coordinates;
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }

    // Fallback to mock coordinates
    const mockCoordinates = {
      latitude: 19.076 + Math.random() * 0.1,
      longitude: 72.8777 + Math.random() * 0.1,
    };

    setFormData((prev) => ({
      ...prev,
      coordinates: mockCoordinates,
    }));
    return mockCoordinates;
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

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
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
        : prev.paymentMethods.filter((f) => f !== method),
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (
          !formData.businessName ||
          !formData.description ||
          !formData.category ||
          !formData.businessType
        ) {
          toast.error("Please fill all required fields in Step 1");
          return false;
        }
        if (formData.businessName.length < 3) {
          toast.error("Business name must be at least 3 characters long");
          return false;
        }
        if (formData.description.length < 10) {
          toast.error(
            "Business description must be at least 10 characters long"
          );
          return false;
        }
        break;
      case 2:
        // Step 2 has both contact info and address, so validate both
        if (!formData.contactInfo.primaryPhone || !formData.contactInfo.email) {
          toast.error("Please fill required contact information in Step 2");
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contactInfo.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        // Phone validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.contactInfo.primaryPhone)) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        if (
          !formData.address.street ||
          !formData.address.area ||
          !formData.address.city ||
          !formData.address.state ||
          !formData.address.pincode
        ) {
          toast.error("Please fill all required address fields in Step 2");
          return false;
        }
        // Pincode validation
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(formData.address.pincode)) {
          toast.error("Please enter a valid 6-digit pincode");
          return false;
        }
        break;
      case 3:
        // Business hours validation - at least one day should be open
        const hasOpenDay = Object.values(formData.businessHours).some(
          (day) => !day.isClosed
        );
        if (!hasOpenDay) {
          toast.error(
            "Please set business hours for at least one day in Step 3"
          );
          return false;
        }
        break;
      case 4:
        // Services validation - at least one service should be added
        if (formData.services.length === 0) {
          toast.error("Please add at least one service in Step 4");
          return false;
        }
        break;
      case 5:
        if (formData.tags.length === 0) {
          toast.error(
            "Please add at least one tag to help customers find your business"
          );
          return false;
        }
        if (formData.keywords.length === 0) {
          toast.error(
            "Please add at least one keyword for better search visibility"
          );
          return false;
        }
        if (formData.images.length === 0) {
          toast.error("Please upload at least one image of your business");
          return false;
        }
        // Validate coordinates before final submission
        if (
          !formData.coordinates.latitude ||
          !formData.coordinates.longitude ||
          formData.coordinates.latitude === 0 ||
          formData.coordinates.longitude === 0
        ) {
          toast.error("Please select a valid city to set coordinates");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < 6 ? prev + 1 : prev));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateStep(5)) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      const businessData = {
        businessName: formData.businessName,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        businessType: formData.businessType,
        establishedYear: formData.establishedYear,
        employeeCount: formData.employeeCount,
        address: {
          street: formData.address.street,
          area: formData.address.area,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
          landmark: formData.address.landmark,
        },
        area: formData.address.area,
        coordinates: {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude,
        },
        phone: formData.contactInfo.primaryPhone,
        alternatePhone: formData.contactInfo.secondaryPhone,
        whatsappNumber: formData.contactInfo.whatsappNumber,
        email: formData.contactInfo.email,
        website: formData.contactInfo.website,
        socialMedia: formData.contactInfo.socialMedia,
        businessHours: formData.businessHours,
        services: formData.services,
        features: formData.features,
        tags: formData.tags,
        keywords: formData.keywords,
        paymentMethods: formData.paymentMethods,
        amenities: formData.amenities,
        priceRange: formData.priceRange,
        vendor: formData.vendor,
      };

      // Add business data
      submitData.append("businessData", JSON.stringify(businessData));

      // Add images as JSON string since they are now URLs
      submitData.append("images", JSON.stringify(formData.images));

      // New flow: For vendor add-mode, do NOT create business first. Initiate payment first.
      if (mode !== "edit" && user?.role === "vendor") {
        try {
          toast.info("Initiating payment to proceed with listing...");
          await initiateRequiredSubscriptionPayment(submitData);
        } catch (payErr) {
          console.error("Payment initiation error:", payErr);
          toast.error(
            "Payment step failed or cancelled. Business not created."
          );
        }
      } else {
        // For edit-mode or non-vendor roles, keep existing create/update behavior
        let response;
        if (mode === "edit" && businessId) {
          response = await updateBusinessAPI(businessId, submitData);
        } else {
          response = await createBusinessAPI(submitData);
        }

        if (response && response.success) {
          toast.success(
            mode === "edit"
              ? "Business updated successfully!"
              : "Business created successfully!"
          );
          navigate("/vendor/dashboard");
        } else {
          toast.error(
            response?.message ||
              (mode === "edit"
                ? "Failed to update business"
                : "Failed to list business")
          );
        }
      }
    } catch (error) {
      console.error("Error submitting business:", error);
      toast.error("Failed to list business");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.selectedVendor) {
      // If user is super_admin or admin, set vendor as selectedVendor
      if (user?.role === "admin" || user?.role === "super_admin") {
        setFormData((prev) => ({
          ...prev,
          vendor: formData.selectedVendor,
        }));
      } else {
        // Otherwise, keep vendor as current user ID
        setFormData((prev) => ({
          ...prev,
          vendor: user?._id,
        }));
      }
    }
  }, [formData.selectedVendor, user?.role, user?._id]);
  // Required subscription plan (must be purchased before listing)
  const REQUIRED_PLAN_ID = "68d82c963b1b20fc6809a54a";

  // Initiate Razorpay flow for required subscription plan
  const initiateRequiredSubscriptionPayment = async (submitData: FormData) => {
    // Fetch required plan details (price, name, duration)
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
    const planResp = await axios.get(
      `${baseUrl}/subscription/plans/${REQUIRED_PLAN_ID}`
    );
    const plan = planResp?.data?.data;
    if (!plan?._id) {
      throw new Error("Required plan not found");
    }

    // Create Razorpay order with 18% GST applied by backend
    const orderResp = await axios.post(
      `${baseUrl}/razorpay/capturePayment`,
      { amount: plan.price },
      { headers: { "Content-Type": "application/json" } }
    );
    const order = orderResp?.data?.order;
    if (!order?.id) {
      throw new Error("Failed to initiate payment order");
    }

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + (plan.duration || 365) * 24 * 60 * 60 * 1000
    );

    const options: any = {
      key: "rzp_live_RXNNi6vqWQruCx",
      amount: order.amount,
      currency: order.currency,
      name: "Business Gurujee",
      description: `${plan.name} Subscription Payment (incl. 18% GST)`,
      order_id: order.id,
      handler: async (response: any) => {
        try {
          // 1) Payment successful -> create business now (ensures no creation without payment)
          toast.loading("Creating business after payment...");
          const createResp = await createBusinessAPI(submitData);

          if (!createResp?.success || !createResp?.business?._id) {
            toast.dismiss();
            throw new Error(
              createResp?.message || "Business creation failed after payment"
            );
          }

          const createdBusinessId = createResp.business._id;

          // 2) Verify payment and attach subscription + activate listing
          const verifyResp = await axios.post(
            `${baseUrl}/razorpay/verifyPayment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              business: createdBusinessId,
              vendor: user?._id,
              subscriptionPlan: REQUIRED_PLAN_ID,
              planName: plan.name,
              price: plan.price,
              startDate,
              endDate,
              paymentMethod: "Razorpay",
              autoRenewal: false,
              features: plan.features || [],
              priority: plan.priority || 1,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          toast.dismiss();

          if (verifyResp?.data?.success) {
            toast.success(
              verifyResp?.data?.message ||
                "Payment successful! Listing activated."
            );
            navigate("/vendor/dashboard");
          } else {
            toast.error(
              verifyResp?.data?.message || "Payment verification failed"
            );
          }
        } catch (err) {
          toast.dismiss();
          console.error("Verify payment error:", err);
          toast.error("Payment verification failed.");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      theme: { color: "#f63b60" },
      modal: {
        ondismiss: () => {
          toast.info(
            "Payment cancelled. Complete payment to activate listing."
          );
        },
      },
    };

    // Open Razorpay checkout
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");

  // Filter options based on input
  const filteredCategories = BUSINESS_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSubCategories = formData.category
    ? SUBCATEGORIES[formData.category]?.filter((sub) =>
        sub.toLowerCase().includes(subCategorySearch.toLowerCase())
      )
    : [];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Business Information
              </h3>
              <p className="text-muted-foreground">
                Tell us about your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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

              {/* Vendor Selection for Admin */}
              {(user?.role === "admin" || user?.role === "super_admin") && (
                <div>
                  <Label htmlFor="selectedVendor">Select Vendor *</Label>
                  <Select
                    value={formData.selectedVendor || ""}
                    onValueChange={(value) =>
                      handleInputChange("root", "selectedVendor", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor for this business" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor._id} value={vendor._id}>
                          {vendor.name} - {vendor.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="category">Business Category *</Label>
                <div className="space-y-2">
                  <Input
                    id="categorySearch"
                    placeholder="Search category..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                  {categorySearch.trim().length > 0 && (
                    <div className="border rounded bg-white shadow max-h-40 overflow-y-auto">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.slice(0, 20).map((category) => (
                          <button
                            type="button"
                            key={category}
                            className="w-full text-left px-2 py-1 hover:bg-gray-100"
                            onClick={() => {
                              handleInputChange("root", "category", category);
                              handleInputChange("root", "subCategory", "");
                              setCategorySearch("");
                            }}
                          >
                            {category}
                          </button>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-gray-400">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                  <select
                    id="category"
                    className="w-full border rounded px-2 py-2"
                    value={formData.category}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("root", "category", value);
                      handleInputChange("root", "subCategory", "");
                      setCategorySearch("");
                    }}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No results found
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Subcategory */}
              <div>
                <Label htmlFor="subCategory">Specialty/Subcategory</Label>
                <div className="space-y-2">
                  <Input
                    id="subCategorySearch"
                    placeholder="Search subcategory..."
                    value={subCategorySearch}
                    onChange={(e) => setSubCategorySearch(e.target.value)}
                    disabled={!formData.category}
                  />
                  {formData.category && subCategorySearch.trim().length > 0 && (
                    <div className="border rounded bg-white shadow max-h-40 overflow-y-auto">
                      {filteredSubCategories.length > 0 ? (
                        filteredSubCategories
                          .slice(0, 20)
                          .map((subCategory) => (
                            <button
                              type="button"
                              key={subCategory}
                              className="w-full text-left px-2 py-1 hover:bg-gray-100"
                              onClick={() => {
                                handleInputChange(
                                  "root",
                                  "subCategory",
                                  subCategory
                                );
                                setSubCategorySearch("");
                              }}
                            >
                              {subCategory}
                            </button>
                          ))
                      ) : (
                        <div className="px-2 py-1 text-gray-400">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                  <select
                    id="subCategory"
                    className="w-full border rounded px-2 py-2"
                    value={formData.subCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("root", "subCategory", value);
                      setSubCategorySearch("");
                    }}
                    disabled={!formData.category}
                  >
                    <option value="" disabled>
                      {formData.category
                        ? "Select specialty"
                        : "Select category first"}
                    </option>
                    {filteredSubCategories.length > 0 ? (
                      filteredSubCategories.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {formData.category
                          ? "No results found"
                          : "Select category first"}
                      </option>
                    )}
                  </select>
                </div>
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
                <Label htmlFor="establishedYear">Year Established</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) =>
                    handleInputChange("root", "establishedYear", e.target.value)
                  }
                  placeholder="2020"
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
                    <SelectValue placeholder="Select employee count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="font-medium">Social Media (Optional)</h4>
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

            <div>
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("root", "description", e.target.value)
                }
                placeholder="Describe your business, services, and what makes you unique..."
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Contact & Location</h3>
              <p className="text-muted-foreground">
                How can customers reach you?
              </p>
            </div>

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
                    className="pl-10"
                    required
                  />
                </div>
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) =>
                      handleInputChange("contactInfo", "email", e.target.value)
                    }
                    placeholder="business@example.com"
                    className="pl-10"
                  />
                </div>
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
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address
              </h4>

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
                  <Label htmlFor="addressArea">Area/Locality</Label>
                  <Input
                    id="addressArea"
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
                    mode="city"
                    onPlaceSelect={(placeDetails) => {
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          city: placeDetails.city,
                          state: placeDetails.state,
                          pincode: placeDetails.pincode,
                        },
                        coordinates: {
                          latitude: placeDetails.latitude,
                          longitude: placeDetails.longitude,
                        },
                      }));
                      toast.success("City details filled automatically!");
                    }}
                    placeholder="Search for city..."
                    value={formData.address.city}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Search and select a city using Google Maps
                  </p>
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    placeholder="State (auto-filled)"
                    readOnly
                    className="bg-muted"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.address.pincode}
                    placeholder="Enter 6-digit pincode"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          pincode: value,
                        },
                      }));
                    }}
                    maxLength={6}
                    className={
                      formData.address.pincode
                        ? "bg-green-50 border-green-200"
                        : ""
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.address.pincode
                      ? "✓ Pincode entered"
                      : "Enter manually if not auto-filled"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.address.landmark}
                    onChange={(e) =>
                      handleInputChange("address", "landmark", e.target.value)
                    }
                    placeholder="Near famous landmark"
                  />
                </div>

                {/* Google Places Address Search */}
                <div className="md:col-span-2">
                  <Label>Search Address (Google Places)</Label>
                  <div className="mt-2">
                    <GooglePlacesAutocomplete
                      onPlaceSelect={handlePlaceSelect}
                      placeholder="Type to search for address using Google Places..."
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search and select an address to auto-fill street, area,
                    city, state, and pincode
                  </p>
                </div>

                {/* Coordinates Display */}
                <div className="md:col-span-2">
                  <Label>Location Coordinates</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label
                        htmlFor="latitude"
                        className="text-sm text-muted-foreground"
                      >
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.coordinates.latitude}
                        readOnly
                        className="bg-muted"
                        placeholder="19.0760"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="longitude"
                        className="text-sm text-muted-foreground"
                      >
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.coordinates.longitude}
                        readOnly
                        className="bg-muted text-sm"
                        placeholder="72.8777"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setFormData((prev) => ({
                                ...prev,
                                coordinates: {
                                  latitude: position.coords.latitude,
                                  longitude: position.coords.longitude,
                                },
                              }));
                              toast.success("Current location detected!");
                            },
                            (error) => {
                              toast.error("Unable to get current location");
                            }
                          );
                        } else {
                          toast.error(
                            "Geolocation is not supported by this browser"
                          );
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Use Current Location
                    </Button>
                    {(formData.coordinates.latitude !== 0 ||
                      formData.coordinates.longitude !== 0) && (
                      <Badge variant="secondary" className="text-xs">
                        📍 Location Set
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
              <p className="text-muted-foreground">
                When are you open for business?
              </p>
            </div>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="w-24">
                    <Label className="capitalize font-medium">{day}</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!formData.businessHours[day].isClosed}
                      onCheckedChange={(checked) =>
                        handleBusinessHoursChange(day, "isClosed", !checked)
                      }
                    />
                    <Label className="text-sm">Open</Label>
                  </div>

                  {!formData.businessHours[day].isClosed && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={formData.businessHours[day].open}
                          onChange={(e) =>
                            handleBusinessHoursChange(
                              day,
                              "open",
                              e.target.value
                            )
                          }
                          className="w-32"
                        />
                      </div>
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={formData.businessHours[day].close}
                        onChange={(e) =>
                          handleBusinessHoursChange(
                            day,
                            "close",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                    </div>
                  )}

                  {formData.businessHours[day].isClosed && (
                    <Badge variant="secondary">Closed</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Services, Pricing & Media
              </h3>
              <p className="text-muted-foreground">
                What services do you offer and upload photos
              </p>
            </div>

            {/* Services Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Services Offered</h4>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
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
                          {service.price.currency !== "INR" &&
                            ` ${service.price.currency}`}
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
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h4 className="font-medium">Price Range</h4>
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
                    Budget Friendly (₹0 - ₹500)
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderate (₹500 - ₹2000)
                  </SelectItem>
                  <SelectItem value="premium">
                    Premium (₹2000 - ₹5000)
                  </SelectItem>
                  <SelectItem value="luxury">Luxury (₹5000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h4 className="font-medium">Tags</h4>

              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1.5">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-4">
              <h4 className="font-medium">Keywords</h4>

              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add specialization"
                  className="flex-1"
                />
                <Button type="button" onClick={addKeyword} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeKeyword(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image Upload */}
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
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
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
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Features & Amenities
              </h3>
              <p className="text-muted-foreground">
                Add amenities and payment methods
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h4 className="font-medium">Amenities & Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity, checked as boolean)
                      }
                    />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h4 className="font-medium">Payment Methods Accepted</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method} className="flex items-center gap-2">
                    <Checkbox
                      id={method}
                      checked={formData.paymentMethods.includes(method)}
                      onCheckedChange={(checked) =>
                        handlePaymentMethodChange(method, checked as boolean)
                      }
                    />
                    <Label htmlFor={method}>{method}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
              <p className="text-muted-foreground">
                Please review your business information before submitting
              </p>
            </div>

            <div className="space-y-4">
              {/* Business Info Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>Name:</strong> {formData.businessName}
                  </div>
                  <div>
                    <strong>Category:</strong> {formData.category}
                  </div>
                  <div>
                    <strong>Type:</strong> {formData.businessType}
                  </div>
                  <div>
                    <strong>Description:</strong>{" "}
                    {formData.description.substring(0, 100)}...
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>Phone:</strong> {formData.contactInfo.primaryPhone}
                  </div>
                  <div>
                    <strong>Email:</strong> {formData.contactInfo.email}
                  </div>
                  <div>
                    <strong>Address:</strong> {formData.address.street},{" "}
                    {formData.address.area}, {formData.address.city}
                  </div>
                </CardContent>
              </Card>

              {/* Services Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Services ({formData.services.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {formData.services.slice(0, 3).map((service, index) => (
                    <div key={index}>
                      <strong>{service.name}:</strong> ₹{service.price.min} - ₹
                      {service.price.max}
                    </div>
                  ))}
                  {formData.services.length > 3 && (
                    <div>...and {formData.services.length - 3} more</div>
                  )}
                </CardContent>
              </Card>

              {/* Tags & Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags & Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>Tags:</strong> {formData.tags.join(", ")}
                  </div>
                  <div>
                    <strong>Keywords:</strong> {formData.keywords.join(", ")}
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
                    {mode === "edit"
                      ? "Updating Business..."
                      : "Creating Business..."}
                  </div>
                ) : mode === "edit" ? (
                  "Update Business"
                ) : (
                  "Create Business"
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Your Business" : "List Your Business"} - Step{" "}
          {currentStep} of 6
        </CardTitle>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 6 ? (
              <Button type="button" onClick={nextStep}>
                {currentStep === 5 ? "Review & Submit" : "Next"}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddBusinessForm;
