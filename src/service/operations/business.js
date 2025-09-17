import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { business } from "../apis";

const {
  CREATE_BUSINESS_API,
  GET_ALL_BUSINESS_API,
  GET_BUSINESS_BY_ID_API,
  UPDATE_BUSINESS_API,
  DELETE_BUSINESS_API,
  GET_VENDOR_BUSINESS_API,
  GET_FEATURED_BUSINESS_API,
  GET_TRENDING_BUSINESS_API,
  TRACK_BUSINESS_INTERACTION_API
} = business;

export const createBusinessAPI = async (formData) => {
  const toastId = toast.loading("Creating business...");

  try {
    const response = await apiConnector("POST", CREATE_BUSINESS_API, formData);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
    
    toast.success(response?.data?.message || "Business created successfully!");
    return response?.data;
  } catch (error) {
    console.error("CREATE BUSINESS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to create business!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const getVendorBusinessAPI = async (vendorId) => {
  try {
    const response = await apiConnector("GET", `${GET_VENDOR_BUSINESS_API}/${vendorId}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.businesses || [];
  } catch (error) {
    console.error("GET VENDOR BUSINESS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get vendor businesses!");
    return [];
  }
};

export const getAllBusinessAPI = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${GET_ALL_BUSINESS_API}?${queryParams}` : GET_ALL_BUSINESS_API;
    
    const response = await apiConnector("GET", url);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.businesses || [];
  } catch (error) {
    console.error("GET ALL BUSINESS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get businesses!");
    return [];
  }
};

export const getBusinessByIdAPI = async (id) => {
  try {
    const response = await apiConnector("GET", `${GET_BUSINESS_BY_ID_API}/${id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.business || null;
  } catch (error) {
    console.error("GET BUSINESS BY ID API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get business!");
    return null;
  }
};

export const updateBusinessAPI = async (id, formData) => {
  const toastId = toast.loading("Updating business...");

  try {
    const response = await apiConnector("PUT", `${UPDATE_BUSINESS_API}/${id}`, formData);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
    
    toast.success(response?.data?.message || "Business updated successfully!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE BUSINESS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update business!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const deleteBusinessAPI = async (id) => {
  const toastId = toast.loading("Deleting business...");

  try {
    const response = await apiConnector("DELETE", `${DELETE_BUSINESS_API}/${id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
    
    toast.success(response?.data?.message || "Business deleted successfully!");
    return response?.data;
  } catch (error) {
    console.error("DELETE BUSINESS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to delete business!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const getFeaturedBusinessAPI = async () => {
  try {
    const response = await apiConnector("GET", GET_FEATURED_BUSINESS_API);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.businesses || [];
  } catch (error) {
    console.error("GET FEATURED BUSINESS API ERROR:", error);
    return [];
  }
};

export const getTrendingBusinessAPI = async () => {
  try {
    const response = await apiConnector("GET", GET_TRENDING_BUSINESS_API);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.businesses || [];
  } catch (error) {
    console.error("GET TRENDING BUSINESS API ERROR:", error);
    return [];
  }
};

export const trackBusinessInteractionAPI = async (id, interactionType) => {
  try {
    const response = await apiConnector("POST", `${TRACK_BUSINESS_INTERACTION_API}/${id}/track-interaction`, {
      interactionType
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data;
  } catch (error) {
    console.error("TRACK BUSINESS INTERACTION API ERROR:", error);
    return null;
  }
};