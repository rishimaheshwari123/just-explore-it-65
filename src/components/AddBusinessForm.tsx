import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, X, Upload, MapPin, Clock, Phone, Mail, Globe, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { imageUpload } from '@/service/operations/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

interface BusinessFormData {
  businessName: string;
  description: string;
  category: string;
  subCategory: string;
  businessType: string;
  establishedYear: string;
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
    website?: string;
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
  'Food & Dining',
  'Healthcare',
  'Education',
  'Shopping',
  'Hotels & Travel',
  'Fitness & Wellness',
  'Beauty & Spa',
  'Electronics & Technology',
  'Automotive',
  'Real Estate',
  'Financial Services',
  'Professional Services',
  'Home & Garden',
  'Entertainment',
  'Sports & Recreation',
  'Government & Community'
];

const SUBCATEGORIES: { [key: string]: string[] } = {
  'Food & Dining': ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Fast Food', 'Bakery', 'Cafe', 'Bar & Grill'],
  'Healthcare': ['General Physician', 'Dentist', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'Pharmacy'],
  'Education': ['Schools', 'Colleges', 'Coaching Centers', 'Skill Development', 'Language Classes', 'Music Classes'],
  'Shopping': ['Clothing', 'Electronics', 'Grocery', 'Books', 'Jewelry', 'Mobile Phones'],
  'Hotels & Travel': ['Travel Agency', 'Hotel', 'Resort', 'Tour Guide', 'Car Rental'],
  'Fitness & Wellness': ['Gym', 'Yoga Center', 'Sports Club', 'Cricket Academy', 'Swimming Pool', 'Badminton Court'],
  'Beauty & Spa': ['Salon', 'Spa', 'Beauty Parlor', 'Massage Center'],
  'Electronics & Technology': ['Software Development', 'Web Design', 'Mobile Apps', 'Digital Marketing', 'Computer Store'],
  'Automotive': ['Car Service', 'Bike Service', 'Car Wash', 'Spare Parts', 'Tyre Shop', 'Auto Repair'],
  'Real Estate': ['Property Dealer', 'Builder', 'Interior Designer', 'Architecture'],
  'Financial Services': ['Bank', 'Insurance', 'Loan Services', 'Investment Advisory'],
  'Professional Services': ['Legal Services', 'Accounting', 'Consulting', 'IT Services', 'Marketing', 'Photography'],
  'Home & Garden': ['Plumbing', 'Electrical', 'Cleaning', 'Pest Control', 'AC Repair', 'Appliance Repair'],
  'Entertainment': ['Cinema', 'Gaming Zone', 'Event Management', 'DJ Services', 'Party Hall'],
  'Sports & Recreation': ['Sports Club', 'Cricket Academy', 'Swimming Pool', 'Badminton Court'],
  'Government & Community': ['Government Office', 'Community Center', 'Public Services', 'NGO']
};

const BUSINESS_TYPES = [
  'Individual',
  'Partnership',
  'Private Limited',
  'Public Limited',
  'LLP',
  'Proprietorship'
];

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Wallet',
  'Cheque'
];

const AMENITIES = [
  'Parking Available',
  'WiFi',
  'Air Conditioning',
  'Wheelchair Accessible',
  'Home Delivery',
  'Online Booking',
  '24/7 Service',
  'Emergency Service',
  'Free Consultation',
  'Certified Staff'
];

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

// City data with state, pincode and coordinates
const CITY_DATA = {
  'Mumbai': { state: 'Maharashtra', pincode: '400001', lat: 19.0760, lng: 72.8777 },
  'Delhi': { state: 'Delhi', pincode: '110001', lat: 28.7041, lng: 77.1025 },
  'Bangalore': { state: 'Karnataka', pincode: '560001', lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { state: 'Telangana', pincode: '500001', lat: 17.3850, lng: 78.4867 },
  'Chennai': { state: 'Tamil Nadu', pincode: '600001', lat: 13.0827, lng: 80.2707 },
  'Kolkata': { state: 'West Bengal', pincode: '700001', lat: 22.5726, lng: 88.3639 },
  'Pune': { state: 'Maharashtra', pincode: '411001', lat: 18.5204, lng: 73.8567 },
  'Ahmedabad': { state: 'Gujarat', pincode: '380001', lat: 23.0225, lng: 72.5714 },
  'Jaipur': { state: 'Rajasthan', pincode: '302001', lat: 26.9124, lng: 75.7873 },
  'Surat': { state: 'Gujarat', pincode: '395001', lat: 21.1702, lng: 72.8311 },
  'Lucknow': { state: 'Uttar Pradesh', pincode: '226001', lat: 26.8467, lng: 80.9462 },
  'Kanpur': { state: 'Uttar Pradesh', pincode: '208001', lat: 26.4499, lng: 80.3319 },
  'Nagpur': { state: 'Maharashtra', pincode: '440001', lat: 21.1458, lng: 79.0882 },
  'Indore': { state: 'Madhya Pradesh', pincode: '452001', lat: 22.7196, lng: 75.8577 },
  'Thane': { state: 'Maharashtra', pincode: '400601', lat: 19.2183, lng: 72.9781 },
  'Bhopal': { state: 'Madhya Pradesh', pincode: '462001', lat: 23.2599, lng: 77.4126 },
  'Visakhapatnam': { state: 'Andhra Pradesh', pincode: '530001', lat: 17.6868, lng: 83.2185 },
  'Pimpri': { state: 'Maharashtra', pincode: '411017', lat: 18.6298, lng: 73.8131 },
  'Patna': { state: 'Bihar', pincode: '800001', lat: 25.5941, lng: 85.1376 },
  'Vadodara': { state: 'Gujarat', pincode: '390001', lat: 22.3072, lng: 73.1812 }
};

const AddBusinessForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    description: '',
    category: '',
    subCategory: '',
    businessType: '',
    establishedYear: '',
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    contactInfo: {
      primaryPhone: '',
      secondaryPhone: '',
      email: '',
      website: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', isClosed: false },
      tuesday: { open: '09:00', close: '18:00', isClosed: false },
      wednesday: { open: '09:00', close: '18:00', isClosed: false },
      thursday: { open: '09:00', close: '18:00', isClosed: false },
      friday: { open: '09:00', close: '18:00', isClosed: false },
      saturday: { open: '09:00', close: '18:00', isClosed: false },
      sunday: { open: '09:00', close: '18:00', isClosed: true }
    },
    services: [],
    features: [],
    tags: [],
    keywords: [],
    images: [],
    paymentMethods: [],
    amenities: [],
    priceRange: ''
  });

  const [newService, setNewService] = useState({ 
    name: '', 
    description: '', 
    price: {
      min: 0,
      max: 0,
      currency: 'INR'
    }
  });

  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle Google Places selection
  const handlePlaceSelect = (placeDetails: any) => {
    setFormData(prev => ({
      ...prev,
      address: {
        street: placeDetails.street,
        area: placeDetails.area,
        city: placeDetails.city,
        state: placeDetails.state,
        pincode: placeDetails.pincode,
        landmark: prev.address.landmark // Keep existing landmark
      },
      coordinates: {
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude
      }
    }));
    
    // Hide city suggestions when place is selected
    setShowSuggestions(false);
    
    toast.success('Address details filled automatically!');
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'root') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof BusinessFormData],
          [field]: value
        }
      }));
    }

    // Auto-set coordinates when city is changed
    if (section === 'address' && field === 'city') {
      const cityData = CITY_DATA[value as keyof typeof CITY_DATA];
      if (cityData) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            state: cityData.state,
            pincode: cityData.pincode
          },
          coordinates: {
            latitude: cityData.lat,
            longitude: cityData.lng
          }
        }));
      }
    }
  };

  // Handle city selection with coordinates
  const handleCityChange = (cityName: string) => {
    const cityData = CITY_DATA[cityName as keyof typeof CITY_DATA];
    if (cityData) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          city: cityName,
          state: cityData.state,
          pincode: cityData.pincode
        },
        coordinates: {
          latitude: cityData.lat,
          longitude: cityData.lng
        }
      }));
    }
  };

  // Address autocomplete function
  const handleAddressSearch = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Using OpenStreetMap Nominatim API for address autocomplete
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      const suggestions = data.map((item: any) => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.address || {}
      }));
      
      setAddressSuggestions(suggestions.map(s => s.display_name));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      // Fallback to mock suggestions
      const mockSuggestions = [
        `${query}, Mumbai, Maharashtra`,
        `${query}, Delhi, Delhi`,
        `${query}, Bangalore, Karnataka`,
        `${query}, Hyderabad, Telangana`,
        `${query}, Chennai, Tamil Nadu`
      ];
      setAddressSuggestions(mockSuggestions);
      setShowSuggestions(true);
    }
  };

  // Get coordinates from address
  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const coordinates = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
        
        setFormData(prev => ({
          ...prev,
          coordinates: coordinates
        }));
        return coordinates;
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
    
    // Fallback to mock coordinates
    const mockCoordinates = {
      latitude: 19.0760 + Math.random() * 0.1,
      longitude: 72.8777 + Math.random() * 0.1
    };
    
    setFormData(prev => ({
      ...prev,
      coordinates: mockCoordinates
    }));
    return mockCoordinates;
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const addService = () => {
    if (newService.name.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService({ 
        name: '', 
        description: '', 
        price: {
          min: 0,
          max: 0,
          currency: 'INR'
        }
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

 

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(f => f !== amenity)
    }));
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: checked
        ? [...prev.paymentMethods, method]
        : prev.paymentMethods.filter(f => f !== method)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      // Upload images and get URLs
      const uploadedUrls = await imageUpload(files);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 10) // Max 10 images
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate coordinates before submitting
    if (!formData.coordinates.latitude || !formData.coordinates.longitude || 
        formData.coordinates.latitude === 0 || formData.coordinates.longitude === 0) {
      toast.error('Please select a valid city to set coordinates');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      
      // Add business data
      submitData.append('businessData', JSON.stringify({
        businessName: formData.businessName,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        businessType: formData.businessType,
        establishedYear: formData.establishedYear,
        address: {
          street: formData.address.street,
          area: formData.address.area,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
          landmark: formData.address.landmark
        },
        area: formData.address.area,
        coordinates: {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude
        },
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
        vendor: user?._id
      }));

      // Add images as JSON string since they are now URLs
      submitData.append('images', JSON.stringify(formData.images));

      const response = await fetch('http://localhost:8002/api/v1/property/create-business', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Business listed successfully!');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to list business');
      }
    } catch (error) {
      console.error('Error submitting business:', error);
      toast.error('Failed to list business');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.businessName || !formData.description || !formData.category || !formData.businessType) {
          toast.error('Please fill all required fields in Step 1');
          return false;
        }
        break;
      case 2:
        // Step 2 has both contact info and address, so validate both
        if (!formData.contactInfo.primaryPhone || !formData.contactInfo.email) {
          toast.error('Please fill required contact information in Step 2');
          return false;
        }
        if (!formData.address.street || !formData.address.area || !formData.address.city || 
            !formData.address.state || !formData.address.pincode) {
          toast.error('Please fill all required address fields in Step 2');
          return false;
        }
        break;
      case 3:
        // Business hours validation - at least one day should be open
        const hasOpenDay = Object.values(formData.businessHours).some(day => !day.isClosed);
        if (!hasOpenDay) {
          toast.error('Please set business hours for at least one day in Step 3');
          return false;
        }
        break;
      case 4:
        // Services validation - optional but if provided should be valid
        // No strict validation needed for step 4
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Business Information</h3>
              <p className="text-muted-foreground">Tell us about your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('root', 'businessName', e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    handleInputChange('root', 'category', value);
                    // Reset subcategory when category changes
                    handleInputChange('root', 'subCategory', '');
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
                <Label htmlFor="subCategory">Specialty/Subcategory</Label>
                <Select
                  value={formData.subCategory}
                  onValueChange={(value) => handleInputChange('root', 'subCategory', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.category ? "Select specialty" : "Select category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && SUBCATEGORIES[formData.category]?.map((subCategory) => (
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
                  onValueChange={(value) => handleInputChange('root', 'businessType', value)}
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
                  onChange={(e) => handleInputChange('root', 'establishedYear', e.target.value)}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('root', 'description', e.target.value)}
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
              <p className="text-muted-foreground">How can customers reach you?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryPhone">Primary Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="primaryPhone"
                    value={formData.contactInfo.primaryPhone}
                    onChange={(e) => handleInputChange('contactInfo', 'primaryPhone', e.target.value)}
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
                    onChange={(e) => handleInputChange('contactInfo', 'secondaryPhone', e.target.value)}
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
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
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
                    onChange={(e) => handleInputChange('contactInfo', 'website', e.target.value)}
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
                    onChange={(e) => handleInputChange('address', 'street', e.target.value)}
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
                    onChange={(e) => handleInputChange('address', 'area', e.target.value)}
                    placeholder="Area or locality"
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('address', 'city', value);
                      
                      // Show suggestions if value matches any city
                      const suggestions = Object.keys(CITY_DATA).filter(city => 
                        city.toLowerCase().includes(value.toLowerCase())
                      );
                      
                      if (suggestions.length > 0 && value.length > 0) {
                        setShowSuggestions(true);
                        setAddressSuggestions(suggestions);
                      } else {
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Type city name..."
                    required
                  />
                  
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {addressSuggestions.map((city, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            handleCityChange(city);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{city}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    placeholder="Pincode (auto-filled)"
                    readOnly
                    className="bg-muted"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.address.landmark}
                    onChange={(e) => handleInputChange('address', 'landmark', e.target.value)}
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
                    Search and select an address to auto-fill street, area, city, state, and pincode
                  </p>
                </div>

                {/* Coordinates Display */}
                <div className="md:col-span-2">
                  <Label>Location Coordinates</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="latitude" className="text-sm text-muted-foreground">Latitude</Label>
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
                      <Label htmlFor="longitude" className="text-sm text-muted-foreground">Longitude</Label>
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
                              setFormData(prev => ({
                                ...prev,
                                coordinates: {
                                  latitude: position.coords.latitude,
                                  longitude: position.coords.longitude
                                }
                              }));
                              toast.success('Current location detected!');
                            },
                            (error) => {
                              toast.error('Unable to get current location');
                            }
                          );
                        } else {
                          toast.error('Geolocation is not supported by this browser');
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Use Current Location
                    </Button>
                    {(formData.coordinates.latitude !== 0 || formData.coordinates.longitude !== 0) && (
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
              <p className="text-muted-foreground">When are you open for business?</p>
            </div>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <Label className="capitalize font-medium">{day}</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!formData.businessHours[day].isClosed}
                      onCheckedChange={(checked) => 
                        handleBusinessHoursChange(day, 'isClosed', !checked)
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
                          onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={formData.businessHours[day].close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
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
              <h3 className="text-xl font-semibold mb-2">Services & Pricing</h3>
              <p className="text-muted-foreground">What services do you offer?</p>
            </div>

            {/* Services Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Services Offered</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                <Input
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Service name"
                  className="md:col-span-2"
                />
                <Input
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="md:col-span-2"
                />
                <Input
                  type="number"
                  value={newService.price.min}
                  onChange={(e) => setNewService(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, min: Number(e.target.value) } 
                  }))}
                  placeholder="Min Price"
                />
                <div className="flex gap-1">
                  <Input
                    type="number"
                    value={newService.price.max}
                    onChange={(e) => setNewService(prev => ({ 
                      ...prev, 
                      price: { ...prev.price, max: Number(e.target.value) } 
                    }))}
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
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      )}
                      {(service.price.min > 0 || service.price.max > 0) && (
                        <p className="text-sm font-medium text-green-600">
                          ₹{service.price.min}
                          {service.price.max > service.price.min && ` - ₹${service.price.max}`}
                          {service.price.currency !== 'INR' && ` ${service.price.currency}`}
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
                onValueChange={(value) => handleInputChange('root', 'priceRange', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget Friendly (₹0 - ₹500)</SelectItem>
                  <SelectItem value="moderate">Moderate (₹500 - ₹2000)</SelectItem>
                  <SelectItem value="premium">Premium (₹2000 - ₹5000)</SelectItem>
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
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
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
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {spec}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeKeyword(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Features & Media</h3>
              <p className="text-muted-foreground">Add amenities and photos</p>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h4 className="font-medium">Amenities & Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h4 className="font-medium">Payment Methods Accepted</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.paymentMethods.includes(method)}
                      onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean)}
                    />
                    <Label className="text-sm">{method}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Business Photos (Max 10)
              </h4>
              
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload business photos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 5MB each
                  </p>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Business photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              List Your Business - Step {currentStep} of 5
            </CardTitle>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
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

                {currentStep < 5 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'List My Business'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBusinessForm;