import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { inquiry } from "../apis";


const {
  CREATE_INQUIRY_API, GET_INQUIRY_API } = inquiry;

export const createInquiryAPI = async (formData) => {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", CREATE_INQUIRY_API, formData);


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.newInquiry;
  } catch (error) {
    console.error("contact API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to create inquiry!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }

};



export const getInquiryAPI = async () => {

  try {
    const response = await apiConnector("GET", GET_INQUIRY_API)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.inquiry || [];
  } catch (error) {
    console.error("GET inquiry API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get inquiry !");
    return [];
  }
};