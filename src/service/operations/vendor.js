import { toast } from "react-toastify";
import { setUser, setToken } from "../../redux/authSlice";
import { apiConnector } from "../apiConnector";
import { vendor } from "../apis";
import Swal from "sweetalert2";
const {
  LOGIN_API,
  SIGNUP_API,
  GET_ALL_VENDOR,
  UPDATE_VENDOR,
  GET_VENDOR,
  UPDATE_VENDOR_PROFILE,
  UPDATE_VENDOR_PERSANTAGE,
  SEND_OTP_API,
  VERIFY_OTP_API,
} = vendor;

export async function login(email, password, dispatch) {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", LOGIN_API, {
      email,
      password,
    });
    Swal.close();
    if (!response?.data?.success) {
      await Swal.fire({
        title: "Login Failed",
        text: response.data.message,
        icon: "error",
      });
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `Login Successfully!`,
      text: `Have a nice day!`,
      icon: "success",
    });
    dispatch(setToken(response?.data?.token));
    dispatch(setUser(response.data.user));
  } catch (error) {
    console.log("LOGIN API ERROR............", error);
    Swal.fire({
      title: "Login Failed",
      text:
        error.response?.data?.message ||
        "Something went wrong, please try again later",
      icon: "error",
    });
  }
}

export async function signUp(formData,) {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", SIGNUP_API, formData);

    console.log("SIGNUP API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `User Register Succesfull!`,
      text: `Have a nice day!`,
      icon: "success",
    });

    // dispatch(setToken(response?.data?.token));
    // dispatch(setUser(response?.data?.user));



    return response?.data?.success;
  } catch (error) {
    console.log("SIGNUP API ERROR............", error);

    // toast.error(error.response?.data?.message)
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  // Close the loading alert after completion
  // Swal.close();
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Swal.fire({
      title: `User Logout Succesfull!`,
      text: `Have a nice day!`,
      icon: "success",
    });
    navigate("/");
  };
}


export async function sendOtp(email, navigate) {
  const toastId = toast.loading("Loading...")

  let result = []

  try {
    const response = await apiConnector("POST", SEND_OTP_API, { email })

    result = response.data.success
    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP Sent Successfully")
    navigate("/verify-email")
  } catch (error) {
    console.log("SENDOTP API ERROR............", error)
    toast.error("Could Not Send OTP")
    return result
  } finally {
    toast.dismiss(toastId)
  }

  return result
}




export function compareOtp(otp, email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    let result = true
    try {
      const response = await apiConnector("POST", VERIFY_OTP_API, {
        otp, email
      })
      console.log("Compare API RESPONSE............", response)


      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      if (response?.data?.userFind) {
        console.log(response.data.token)
        dispatch(setToken(response.data.token))
        dispatch(setUser(response.data.existingUser))
        localStorage.setItem("user", JSON.stringify(response.data.existingUser))

        localStorage.setItem("token", JSON.stringify(response.data.token))
        navigate("/profile")


        toast.success("Login Succesfully")
        toast.dismiss(toastId)

        return
      }
      result = response?.data?.userFind

      Swal.fire({
        title: "Login Failed",
        text:
          "Your Not Admin Please Contact To SuperAdmin",
      });


      // navigate("/verify-email")
    } catch (error) {
      console.log("COMPARE API ERROR............", error)
      // toast.error(error?.response?.data?.message)

      Swal.fire({
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong, please try again later",
        icon: "error",
      });
    }
    toast.dismiss(toastId)
    return result
  }
}

export const getAllVendorAPI = async () => {

  try {
    const response = await apiConnector("GET", GET_ALL_VENDOR,)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.vendors || [];
  } catch (error) {
    console.error("GET vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get vendor!");
    return [];
  }

};
export const getVendorByIdAPI = async (id) => {

  try {
    const response = await apiConnector("GET", `${GET_VENDOR}/${id}`,)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.vendor || [];
  } catch (error) {
    console.error("GET vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get vendor!");
    return [];
  }

};


export const updateVendorStatusAPI = async (id, action) => {

  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("PUT", `${UPDATE_VENDOR}/${id}`, { status: action });


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message)
    return response?.data;
  } catch (error) {
    console.error("UPDATE Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to vendor product!");
    return [];
  } finally {
    toast.dismiss(toastId);
  }

};
export const updateVendorPersentageAPI = async (id, action) => {

  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("PUT", `${UPDATE_VENDOR_PERSANTAGE}/${id}`, { percentage: action });


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message)
    return response?.data;
  } catch (error) {
    console.error("UPDATE Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to vendor percentage!");
    return [];
  } finally {
    toast.dismiss(toastId);
  }

};
export const updateVendorProfileAPI = async (id, data) => {

  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("PUT", `${UPDATE_VENDOR_PROFILE}/${id}`, data);


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message)
    return response?.data;
  } catch (error) {
    console.error("UPDATE Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to vendor product!");
    return [];
  } finally {
    toast.dismiss(toastId);
  }

};