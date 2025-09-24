import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, Phone, Mail, Clock, Star, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Business {
  _id: string;
  businessName: string;
  category: string;
  contactInfo: {
    primaryPhone: string;
    email?: string;
  };
  address: {
    area: string;
    city: string;
  };
  ratings: {
    average: number;
    totalReviews: number;
  };
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}

interface BusinessInquiryModalProps {
  business: Business;
  trigger?: React.ReactNode;
}

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
  priority: string;
  preferredContact: string;
  bestTimeToContact: string;
  customerLocation: {
    city: string;
    area: string;
    pincode: string;
  };
  serviceInterest: Array<{
    serviceName: string;
    budget: {
      min: number;
      max: number;
    };
  }>;
}

const BusinessInquiryModal: React.FC<BusinessInquiryModalProps> = ({ 
  business, 
  trigger 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
    priority: "medium",
    preferredContact: "any",
    bestTimeToContact: "anytime",
    customerLocation: {
      city: "",
      area: "",
      pincode: ""
    },
    serviceInterest: []
  });

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "service", label: "Service Information" },
    { value: "pricing", label: "Pricing Details" },
    { value: "booking", label: "Booking/Appointment" },
    { value: "complaint", label: "Complaint" },
    { value: "other", label: "Other" }
  ];

  const priorityLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  const contactMethods = [
    { value: "any", label: "Any Method" },
    { value: "phone", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "WhatsApp" }
  ];

  const contactTimes = [
    { value: "anytime", label: "Anytime" },
    { value: "morning", label: "Morning (9 AM - 12 PM)" },
    { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
    { value: "evening", label: "Evening (5 PM - 9 PM)" }
  ];

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent as keyof InquiryFormData] === 'object' && prev[parent as keyof InquiryFormData] !== null ? prev[parent as keyof InquiryFormData] as Record<string, any> : {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(
        `${BASE_URL}/inquiry/business/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            businessId: business._id,
            userId: JSON.parse(localStorage.getItem('user') || 'null')?._id || null
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Inquiry submitted successfully! The business owner will contact you soon.");
        setOpen(false);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiryType: "general",
          priority: "medium",
          preferredContact: "any",
          bestTimeToContact: "anytime",
          customerLocation: {
            city: "",
            area: "",
            pincode: ""
          },
          serviceInterest: []
        });
      } else {
        toast.error(data.error || "Failed to submit inquiry");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessImage = business.images?.find(img => img.isPrimary)?.url || 
                       business.images?.[0]?.url || 
                       "/placeholder-business.jpg";

  const defaultTrigger = (
    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
      <MessageSquare className="h-4 w-4 mr-2" />
      Send Inquiry
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Send Inquiry</DialogTitle>
          <DialogDescription>
            Get in touch with {business.businessName} for your requirements
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <img
                  src={businessImage}
                  alt={business.businessName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{business.businessName}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {business.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{business.ratings.average.toFixed(1)}</span>
                    <span>({business.ratings.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{business.address.area}, {business.address.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{business.contactInfo.primaryPhone}</span>
                </div>
                {business.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{business.contactInfo.email}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Your inquiry will be sent directly to the business owner. 
                  They typically respond within 2-4 hours during business hours.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Inquiry Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => handleInputChange('inquiryType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief subject of your inquiry"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Describe your requirements in detail..."
                    rows={4}
                    required
                  />
                </div>

                {/* Contact Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                    <Select
                      value={formData.preferredContact}
                      onValueChange={(value) => handleInputChange('preferredContact', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bestTimeToContact">Best Time to Contact</Label>
                    <Select
                      value={formData.bestTimeToContact}
                      onValueChange={(value) => handleInputChange('bestTimeToContact', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select best time" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Your City</Label>
                    <Input
                      id="city"
                      value={formData.customerLocation.city}
                      onChange={(e) => handleInputChange('customerLocation.city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={formData.customerLocation.area}
                      onChange={(e) => handleInputChange('customerLocation.area', e.target.value)}
                      placeholder="Area/Locality"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.customerLocation.pincode}
                      onChange={(e) => handleInputChange('customerLocation.pincode', e.target.value)}
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessInquiryModal;