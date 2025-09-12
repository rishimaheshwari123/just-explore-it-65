import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createContactAPI } from "@/service/operations/contact";

const InquiryModal = ({ isOpen, onClose, property }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "", message: "" });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!property || !property.vendor) {
      toast.error("Property or vendor information is missing");
      return;
    }

    try {
      setIsSubmitting(true);
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property,
      };

      const response = await createContactAPI(contactData);

      if (response) {
        handleClose();
      } else {
        toast.error("Failed to send inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const firstImage = property?.images?.[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative border-2 border-black max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
          <Send className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Inquire About This Property
          </h3>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Property Info */}
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
            {firstImage && (
              <img
                src={firstImage}
                alt={property.title}
                className="w-24 h-24 object-cover rounded-md"
              />
            )}
            <div>
              <h4 className="text-xl font-semibold text-gray-700">
                {property.title}
              </h4>
              <p className="text-gray-500 text-sm">{property.location}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm h-28 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                </span>
              ) : (
                "Send Inquiry"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
