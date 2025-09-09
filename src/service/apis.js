
const BASE_URL = "http://localhost:8000/api/v1"
// const BASE_URL = "https://propcorn-marketplace-hub.onrender.com/api/v1"
// const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

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
}
export const property = {
  CREATE_PROPERTY_API: BASE_URL + "/property/create",
  GET_VENDOR_PROPERTY_API: BASE_URL + "/property/get-vendor-property",
  GET_ALL_PROPERTY_API: BASE_URL + "/property/getAll",
  UPDATE_PROPERTY_API: BASE_URL + "/property/update",
  DELETE_PROPERTY_API: BASE_URL + "/property/delete",
  GET_PROPERTY_BY_ID_API: BASE_URL + "/property/get",
}
export const contact = {
  CREATE_CONTACT_API: BASE_URL + "/contact/create",
  GET_CONTACT_API: BASE_URL + "/contact/getAll",
}
export const inquiry = {
  CREATE_INQUIRY_API: BASE_URL + "/inquiry/create",
  GET_INQUIRY_API: BASE_URL + "/inquiry/getAll",
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
