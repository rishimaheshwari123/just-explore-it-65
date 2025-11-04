
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const endpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  SIGNUP_API_API: BASE_URL + "/auth/register",
  GET_ALL_USER_API: BASE_URL + "/auth/getAll",
  EDIT_USER_PERMISSION_API: BASE_URL + "/auth/update",
  DELETE_USER: BASE_URL + "/auth/delete",
}

export const image = {
  IMAGE_UPLOAD: BASE_URL + "/image/multi",
}
export const vendor = {
  LOGIN_API: BASE_URL + "/vendor/login",
  SIGNUP_API: BASE_URL + "/vendor/register",
  GET_ALL_VENDOR: BASE_URL + "/vendor/getAll",
  GET_VENDOR: BASE_URL + "/vendor/get",
  UPDATE_VENDOR: BASE_URL + "/vendor/update",
  UPDATE_VENDOR_PROFILE: BASE_URL + "/vendor/update-profile",
  UPDATE_VENDOR_PERSANTAGE: BASE_URL + "/vendor/update-percentage",
  SEND_OTP_API: BASE_URL + "/vendor/sentotp",
  VERIFY_OTP_API: BASE_URL + "/vendor/verifyotp",
}
export const property = {
  CREATE_PROPERTY_API: BASE_URL + "/property/create",
  GET_VENDOR_PROPERTY_API: BASE_URL + "/property/get-vendor-property",
  GET_ALL_PROPERTY_API: BASE_URL + "/property/getAll",
  UPDATE_PROPERTY_API: BASE_URL + "/property/update",
  DELETE_PROPERTY_API: BASE_URL + "/property/delete",
  GET_PROPERTY_BY_ID_API: BASE_URL + "/property/get",
  INCREMENT_PROPERTY_VIEW_API: BASE_URL + "/property/increment-view",
}
export const business = {
  CREATE_BUSINESS_API: BASE_URL + "/property/create-business",
  GET_ALL_BUSINESS_API: BASE_URL + "/property/businesses",
  GET_BUSINESS_BY_ID_API: BASE_URL + "/property/business",
  UPDATE_BUSINESS_API: BASE_URL + "/property/business/update",
  DELETE_BUSINESS_API: BASE_URL + "/property/business/delete",
  GET_VENDOR_BUSINESS_API: BASE_URL + "/property/businesses/vendor",
  GET_FEATURED_BUSINESS_API: BASE_URL + "/property/businesses/featured",
  GET_TRENDING_BUSINESS_API: BASE_URL + "/property/businesses/trending",
  TRACK_BUSINESS_INTERACTION_API: BASE_URL + "/property/business",
}
export const contact = {
  CREATE_CONTACT_API: BASE_URL + "/contact/create",
  GET_CONTACT_API: BASE_URL + "/contact/getAll",
}
export const inquiry = {
  CREATE_INQUIRY_API: BASE_URL + "/inquiry/create",
  GET_INQUIRY_API: BASE_URL + "/inquiry/getAll",
}

export const inquiryEndpoints = {
  // Business Inquiry APIs
  CREATE_BUSINESS_INQUIRY_API: BASE_URL + "/inquiry/business/create",
  GET_BUSINESS_INQUIRIES_API: BASE_URL + "/inquiry/business/:businessId",

  // Vendor Inquiry Management APIs
  GET_VENDOR_INQUIRIES_API: BASE_URL + "/inquiry/vendor/:vendorId",
  GET_INQUIRY_DETAILS_API: BASE_URL + "/inquiry/details/:inquiryId",
  REPLY_TO_INQUIRY_API: BASE_URL + "/inquiry/reply/:inquiryId",
  UPDATE_INQUIRY_STATUS_API: BASE_URL + "/inquiry/status/:inquiryId",

  // Admin APIs
  GET_ALL_INQUIRIES_API: BASE_URL + "/inquiry/admin/all",
}
export const blog = {
  CREATE_BLOG_API: BASE_URL + "/blog/create",
  GET_ALL_BLOG_API: BASE_URL + "/blog/getAll",
  GET_SINGLE_BLOG_API: BASE_URL + "/blog/get",
  DELETE_BLOG_API: BASE_URL + "/blog/delete",
  UPDATE_BLOG_API: BASE_URL + "/blog",
}
export const career = {
  CREATE_CAREER_API: BASE_URL + "/career/create",
  GET_ALL_CAREER_API: BASE_URL + "/career/getAll",

}
export const job = {
  CREATE_JOB_API: BASE_URL + "/job/create",
  GET_ALL_JOB_API: BASE_URL + "/job/getAll",
  GET_JOB_BY_ID_API: BASE_URL + "/job/get",

}
export const customerSupport = {
  CREATE_CUSTOMER_SUPPORT_API: BASE_URL + "/customer-support/create",
  GET_ALL_CUSTOMER_SUPPORT_API: BASE_URL + "/customer-support/getAll",


}

// Hero Carousel endpoints
export const heroCarousel = {
  CREATE: BASE_URL + "/hero-carousel/create",
  LIST: BASE_URL + "/hero-carousel/list",
  UPDATE: (id) => BASE_URL + `/hero-carousel/${id}`,
  TOGGLE: (id) => BASE_URL + `/hero-carousel/${id}/toggle`,
  DELETE: (id) => BASE_URL + `/hero-carousel/${id}`,
};
