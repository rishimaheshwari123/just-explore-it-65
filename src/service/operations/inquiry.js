import { apiConnector } from "../apiConnector";
import { inquiryEndpoints } from "../apis";
import { toast } from "sonner";

const {
  CREATE_BUSINESS_INQUIRY_API,
  GET_VENDOR_INQUIRIES_API,
  GET_INQUIRY_DETAILS_API,
  REPLY_TO_INQUIRY_API,
  UPDATE_INQUIRY_STATUS_API,
  GET_BUSINESS_INQUIRIES_API,
  GET_ALL_INQUIRIES_API
} = inquiryEndpoints;

// Create Business Inquiry
export const createBusinessInquiryAPI = async (inquiryData) => {
  try {
    const response = await apiConnector("POST", CREATE_BUSINESS_INQUIRY_API, inquiryData);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to submit inquiry");
    }
    
    return response.data;
  } catch (error) {
    console.error("CREATE_BUSINESS_INQUIRY_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to submit inquiry");
    throw error;
  }
};

// Get Vendor Inquiries
export const getVendorInquiriesAPI = async (vendorId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.priority) queryParams.append("priority", filters.priority);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);
    
    const url = `${GET_VENDOR_INQUIRIES_API.replace(":vendorId", vendorId)}?${queryParams}`;
    const response = await apiConnector("GET", url);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch inquiries");
    }
    
    return response.data;
  } catch (error) {
    console.error("GET_VENDOR_INQUIRIES_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to fetch inquiries");
    throw error;
  }
};

// Get Inquiry Details
export const getInquiryDetailsAPI = async (inquiryId) => {
  try {
    const response = await apiConnector("GET", GET_INQUIRY_DETAILS_API.replace(":inquiryId", inquiryId));
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch inquiry details");
    }
    
    return response.data;
  } catch (error) {
    console.error("GET_INQUIRY_DETAILS_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to fetch inquiry details");
    throw error;
  }
};

// Reply to Inquiry
export const replyToInquiryAPI = async (inquiryId, replyData) => {
  try {
    const response = await apiConnector("POST", REPLY_TO_INQUIRY_API.replace(":inquiryId", inquiryId), replyData);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to send reply");
    }
    
    return response.data;
  } catch (error) {
    console.error("REPLY_TO_INQUIRY_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to send reply");
    throw error;
  }
};

// Update Inquiry Status
export const updateInquiryStatusAPI = async (inquiryId, statusData) => {
  try {
    const response = await apiConnector("PUT", UPDATE_INQUIRY_STATUS_API.replace(":inquiryId", inquiryId), statusData);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update status");
    }
    
    return response.data;
  } catch (error) {
    console.error("UPDATE_INQUIRY_STATUS_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to update status");
    throw error;
  }
};

// Get Business Inquiries
export const getBusinessInquiriesAPI = async (businessId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);
    
    const url = `${GET_BUSINESS_INQUIRIES_API.replace(":businessId", businessId)}?${queryParams}`;
    const response = await apiConnector("GET", url);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch business inquiries");
    }
    
    return response.data;
  } catch (error) {
    console.error("GET_BUSINESS_INQUIRIES_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to fetch business inquiries");
    throw error;
  }
};

// Get All Inquiries (Admin)
export const getAllInquiriesAPI = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.priority) queryParams.append("priority", filters.priority);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);
    
    const url = `${GET_ALL_INQUIRIES_API}?${queryParams}`;
    const response = await apiConnector("GET", url);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch all inquiries");
    }
    
    return response.data;
  } catch (error) {
    console.error("GET_ALL_INQUIRIES_API ERROR:", error);
    toast.error(error?.response?.data?.message || error.message || "Failed to fetch all inquiries");
    throw error;
  }
};