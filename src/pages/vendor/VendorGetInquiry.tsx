import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import VendorInquiryManagement from "@/components/VendorInquiryManagement";
const VendorGetInquiry = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user?._id) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please log in to view inquiries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Customer Inquiries</h1>
        <p className="text-muted-foreground">Manage and respond to customer inquiries for your businesses</p>
      </div>

      {/* Inquiry Management Component */}
      <VendorInquiryManagement vendorId={user._id} />
    </div>
  );
};

export default VendorGetInquiry;
