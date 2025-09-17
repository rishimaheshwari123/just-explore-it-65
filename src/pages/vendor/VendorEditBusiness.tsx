import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Save, Loader2, Plus, X, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { business } from '../../service/apis';
import { BUSINESS_CATEGORIES } from '../../constants/categories';

const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
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
import GooglePlacesAutocomplete from '../../components/GooglePlacesAutocomplete';

interface BusinessFormData {
  businessName: string;
  businessType: string;
  category: string;
  subCategory: string;
  description: string;
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    whatsappNumber?: string;
    email: string;
    website?: string;
  };
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
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
      amount: number;
      currency: string;
      priceType: string;
    };
  }>;
  establishedYear: number;
  employeeCount: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const VendorEditBusiness = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const vendorId = user?._id;
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: {
      amount: 0,
      currency: 'INR',
      priceType: 'fixed'
    }
  });
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    businessType: '',
    category: '',
    subCategory: '',
    description: '',
    contactInfo: {
      primaryPhone: '',
      secondaryPhone: '',
      whatsappNumber: '',
      email: '',
      website: ''
    },
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', isClosed: false },
      tuesday: { open: '09:00', close: '18:00', isClosed: false },
      wednesday: { open: '09:00', close: '18:00', isClosed: false },
      thursday: { open: '09:00', close: '18:00', isClosed: false },
      friday: { open: '09:00', close: '18:00', isClosed: false },
      saturday: { open: '09:00', close: '18:00', isClosed: false },
      sunday: { open: '10:00', close: '17:00', isClosed: false }
    },
    services: [],
    establishedYear: new Date().getFullYear(),
    employeeCount: '1-10',
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  });

  // Fetch business data
  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${business.GET_BUSINESS_BY_ID_API.replace('/businesses', '/business')}/${businessId}`);
      const data = await response.json();

      if (data.success) {
        const businessData = data.business;
        setFormData({
          businessName: businessData.businessName || '',
          businessType: businessData.businessType || '',
          category: businessData.category || '',
          subCategory: businessData.subCategory || '',
          description: businessData.description || '',
          contactInfo: {
            primaryPhone: businessData.contactInfo?.primaryPhone || '',
            secondaryPhone: businessData.contactInfo?.secondaryPhone || '',
            whatsappNumber: businessData.contactInfo?.whatsappNumber || '',
            email: businessData.contactInfo?.email || '',
            website: businessData.contactInfo?.website || ''
          },
          address: {
            street: businessData.address?.street || '',
            area: businessData.address?.area || '',
            city: businessData.address?.city || '',
            state: businessData.address?.state || '',
            pincode: businessData.address?.pincode || '',
            landmark: businessData.address?.landmark || ''
          },
          businessHours: businessData.businessHours || {
            monday: { open: '09:00', close: '18:00', isClosed: false },
            tuesday: { open: '09:00', close: '18:00', isClosed: false },
            wednesday: { open: '09:00', close: '18:00', isClosed: false },
            thursday: { open: '09:00', close: '18:00', isClosed: false },
            friday: { open: '09:00', close: '18:00', isClosed: false },
            saturday: { open: '09:00', close: '18:00', isClosed: false },
            sunday: { open: '10:00', close: '17:00', isClosed: false }
          },
          services: businessData.services || [],
          establishedYear: businessData.establishedYear || new Date().getFullYear(),
          employeeCount: businessData.employeeCount || '1-10',
          coordinates: {
            latitude: businessData.coordinates?.latitude || 0,
            longitude: businessData.coordinates?.longitude || 0
          }
        });
      } else {
        toast.error('Business not found');
        navigate('/vendor/businesses');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      toast.error('Failed to load business data');
      navigate('/vendor/businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BusinessFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePlaceSelect = (place: any) => {
    if (place && place.address_components) {
      const addressComponents = place.address_components;
      let city = '';
      let state = '';
      let pincode = '';
      
      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes('locality') || types.includes('administrative_area_level_2')) {
          city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (types.includes('postal_code')) {
          pincode = component.long_name;
        }
      });
      
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;
      
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          city,
          state,
          pincode
        },
        coordinates: {
          latitude: lat,
          longitude: lng
        }
      }));
     }
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
          amount: 0,
          currency: 'INR',
          priceType: 'fixed'
        }
      });
    }
  };

  const removeService = (index: number) => {
     setFormData(prev => ({
       ...prev,
       services: prev.services.filter((_, i) => i !== index)
     }));
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

   const handlePaymentMethodChange = (method: string, checked: boolean) => {
     setFormData(prev => ({
       ...prev,
       paymentMethods: checked
         ? [...prev.paymentMethods, method]
         : prev.paymentMethods.filter(m => m !== method)
     }));
   };

   const handleAmenityChange = (amenity: string, checked: boolean) => {
     setFormData(prev => ({
       ...prev,
       amenities: checked
         ? [...prev.amenities, amenity]
         : prev.amenities.filter(a => a !== amenity)
     }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch(`${business.UPDATE_BUSINESS_API}/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vendor: vendorId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Business updated successfully!');
        navigate('/vendor/businesses');
      } else {
        toast.error(data.message || 'Failed to update business');
      }
    } catch (error) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/vendor/businesses')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Businesses
        </Button>
        <h1 className="text-3xl font-bold">Edit Business</h1>
        <p className="text-gray-600 mt-2">Update your business information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_CATEGORIES.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subCategory">Sub Category</Label>
                <Input
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Select
                  value={formData.employeeCount}
                  onValueChange={(value) => handleInputChange('employeeCount', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="1-10" value="1-10">1-10</SelectItem>
                    <SelectItem key="11-50" value="11-50">11-50</SelectItem>
                    <SelectItem key="51-200" value="51-200">51-200</SelectItem>
                    <SelectItem key="201-500" value="201-500">201-500</SelectItem>
                    <SelectItem key="500+" value="500+">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryPhone">Primary Phone *</Label>
                <Input
                  id="primaryPhone"
                  value={formData.contactInfo.primaryPhone}
                  onChange={(e) => handleInputChange('contactInfo.primaryPhone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                <Input
                  id="secondaryPhone"
                  value={formData.contactInfo.secondaryPhone}
                  onChange={(e) => handleInputChange('contactInfo.secondaryPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={formData.contactInfo.whatsappNumber}
                  onChange={(e) => handleInputChange('contactInfo.whatsappNumber', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.contactInfo.website}
                onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Area *</Label>
                <Input
                  id="area"
                  value={formData.address.area}
                  onChange={(e) => handleInputChange('address.area', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.address.landmark}
                  onChange={(e) => handleInputChange('address.landmark', e.target.value)}
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
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  required
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>Services & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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
                className="md:col-span-1"
              />
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={newService.price.amount}
                  onChange={(e) => setNewService(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, amount: Number(e.target.value) } 
                  }))}
                  placeholder="Price"
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
                    {service.price.amount > 0 && (
                      <p className="text-sm font-medium text-green-600">
                        ₹{service.price.amount}
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
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <Checkbox
                    checked={!formData.businessHours[day]?.isClosed}
                    onCheckedChange={(checked) => 
                      handleBusinessHoursChange(day, 'isClosed', !checked)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formData.businessHours[day]?.open || '09:00'}
                      onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                      disabled={formData.businessHours[day]?.isClosed}
                      className="w-32"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={formData.businessHours[day]?.close || '18:00'}
                      onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                      disabled={formData.businessHours[day]?.isClosed}
                      className="w-32"
                    />
                  </div>
                </div>
              ))}
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
              {PAYMENT_METHODS.map(method => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={formData.paymentMethods.includes(method)}
                    onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean)}
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
              {AMENITIES.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
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

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/vendor/businesses')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
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
        </div>
      </form>
    </div>
  );
};

export default VendorEditBusiness;