import { toast } from "react-toastify";
import { setUser, setToken } from "../../redux/authSlice";
import { apiConnector } from "../apiConnector";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// User API endpoints
const USER_ENDPOINTS = {
  REGISTER_API: BASE_URL + "/auth/user/register",
  LOGIN_API: BASE_URL + "/auth/user/login",
  PROFILE_API: BASE_URL + "/auth/user/profile",
  UPDATE_PROFILE_API: BASE_URL + "/auth/user/profile/update",
  GET_ALL_USERS_API: BASE_URL + "/auth/user/getAll",
  UPDATE_USER_STATUS_API: BASE_URL + "/auth/user/status/update",
};

// User Registration
export async function userRegister(formData) {
  const toastId = toast.loading("Creating account...");
  
  try {
    const response = await apiConnector("POST", USER_ENDPOINTS.REGISTER_API, formData);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Registration failed");
    }
    
    toast.success("Account created successfully! Please login to continue.");
    return response?.data;
  } catch (error) {
    console.error("USER REGISTER API ERROR:", error);
    toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}

// User Login
export async function userLogin(email, password, dispatch) {
  const toastId = toast.loading("Logging in...");
  
  try {
    const response = await apiConnector("POST", USER_ENDPOINTS.LOGIN_API, {
      email,
      password,
    });
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Login failed");
    }
    
    // Store token and user data
    dispatch(setToken(response?.data?.token));
    dispatch(setUser(response?.data?.user));
    
    // Store in localStorage for persistence
    localStorage.setItem("token", response?.data?.token);
    localStorage.setItem("user", JSON.stringify(response?.data?.user));
    
    toast.success("Login successful! Welcome back.");
    return response?.data;
  } catch (error) {
    console.error("USER LOGIN API ERROR:", error);
    toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}

// Get User Profile
export async function getUserProfile(userId) {
  try {
    const response = await apiConnector("GET", `${USER_ENDPOINTS.PROFILE_API}/${userId}`);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch profile");
    }
    
    return response?.data?.user;
  } catch (error) {
    console.error("GET USER PROFILE API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to fetch profile");
    throw error;
  }
}

// Update User Profile
export async function updateUserProfile(userId, updateData) {
  const toastId = toast.loading("Updating profile...");
  
  try {
    const response = await apiConnector("PUT", `${USER_ENDPOINTS.UPDATE_PROFILE_API}/${userId}`, updateData);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update profile");
    }
    
    toast.success("Profile updated successfully!");
    return response?.data?.user;
  } catch (error) {
    console.error("UPDATE USER PROFILE API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update profile");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}

// Get All Users (Admin only)
export async function getAllUsers() {
  try {
    const response = await apiConnector("GET", USER_ENDPOINTS.GET_ALL_USERS_API);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch users");
    }
    
    return response?.data?.users || [];
  } catch (error) {
    console.error("GET ALL USERS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to fetch users");
    return [];
  }
}

// Update User Status (Admin only)
export async function updateUserStatus(userId, status) {
  const toastId = toast.loading("Updating user status...");
  
  try {
    const response = await apiConnector("PUT", `${USER_ENDPOINTS.UPDATE_USER_STATUS_API}/${userId}`, { status });
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update user status");
    }
    
    toast.success("User status updated successfully!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE USER STATUS API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update user status");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}

// User Logout
export function userLogout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    toast.success("Logged out successfully!");
    navigate("/");
  };
}