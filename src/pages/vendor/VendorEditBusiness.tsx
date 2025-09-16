import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { business } from '../../service/apis';
import { BUSINESS_CATEGORIES } from '../../constants/categories';
// import { CITY_DATA } from '../../constants/cities';

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
}

const VendorEditBusiness = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const vendorId = user?._id;
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
    employeeCount: '1-10'
  });

  // Fetch business data
  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${business.GET_BUSINESS_BY_ID_API}/${businessId}`);
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
          employeeCount: businessData.employeeCount || '1-10'
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
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="500+">500+</SelectItem>
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
                <Select
                  value={formData.address.city}
                  onValueChange={(value) => {
                    const cityData = CITY_DATA.find(city => city.name === value);
                    handleInputChange('address.city', value);
                    if (cityData) {
                      handleInputChange('address.state', cityData.state);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_DATA.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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