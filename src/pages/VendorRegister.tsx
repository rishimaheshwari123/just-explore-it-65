import { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setSignupData, setLoading } from "@/redux/authSlice";
import axios from "axios";

function VendorRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    company: "",
    address: "",
    description: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    name,
    email,
    phone,
    password,
    confirmPassword,
    company,
    address,
    description,
  } = formData;

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Send OTP API call
  const sendOtp = async (email: string) => {
    const toastId = toast.info("Sending OTP...", { autoClose: false });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/sendotp`,
        {
          email,
          checkUserPresent: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data?.message || "Could not send OTP");
      }

      toast.update(toastId, {
        render: "OTP Sent Successfully",
        type: "success",
        autoClose: 3000,
      });

      navigate("/vendor/verify-email");
    } catch (error: any) {
      console.log(error);
      toast.update(toastId, {
        render:
          error?.response?.data?.message ||
          error?.message ||
          "Could not send OTP",
        type: "error",
        autoClose: 3000,
      });
    }
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    dispatch(setSignupData({ ...formData }));
    await sendOtp(email);

    // reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      company: "",
      address: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleOnSubmit}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 p-10 rounded-lg shadow-lg bg-white"
      >
        {/* Heading */}
        <div className="md:col-span-2 text-center mb-6">
          <h1 className="text-3xl font-bold text-black">Vendor Register</h1>
          <p className="text-gray-600 mt-1">
            Fill the form below to create your vendor account
          </p>
        </div>

        {/* Name */}
        <label className="flex flex-col">
          <p className="mb-1 text-sm font-semibold text-black">
            Name <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type="text"
            name="name"
            value={name}
            onChange={handleOnChange}
            placeholder="Enter name"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
          />
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <p className="mb-1 text-sm font-semibold text-black">
            Email Address <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
          />
        </label>

        {/* Phone */}
        <label className="flex flex-col">
          <p className="mb-1 text-sm font-semibold text-black">
            Phone <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type="text"
            name="phone"
            value={phone}
            onChange={handleOnChange}
            placeholder="Enter phone number"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
          />
        </label>

        {/* Company */}
        <label className="flex flex-col">
          <p className="mb-1 text-sm font-semibold text-black">
            Company <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type="text"
            name="company"
            value={company}
            onChange={handleOnChange}
            placeholder="Enter company name"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
          />
        </label>

        {/* Address */}
        <label className="flex flex-col md:col-span-2">
          <p className="mb-1 text-sm font-semibold text-black">
            Address <sup className="text-pink-500">*</sup>
          </p>
          <textarea
            required
            name="address"
            value={address}
            onChange={handleOnChange}
            placeholder="Enter address"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
            rows={3}
          />
        </label>

        {/* Description */}
        <label className="flex flex-col md:col-span-2">
          <p className="mb-1 text-sm font-semibold text-black">Description</p>
          <textarea
            name="description"
            value={description}
            onChange={handleOnChange}
            placeholder="Enter description"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
            rows={3}
          />
        </label>

        {/* Password */}
        <label className="relative flex flex-col">
          <p className="mb-1 text-sm font-semibold text-black">
            Create Password <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            className="px-4 py-2 rounded-lg border border-gray-300 pr-12 text-black bg-white"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 cursor-pointer text-black"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} />
            ) : (
              <AiOutlineEye fontSize={24} />
            )}
          </span>
        </label>

        {/* Confirm Password */}
        <label className="relative flex flex-col">
          <p className="mb-1 text-sm font-semibold text-black">
            Confirm Password <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder="Confirm Password"
            className="px-4 py-2 rounded-lg border border-gray-300 pr-12 text-black bg-white"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-9 cursor-pointer text-black"
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible fontSize={24} />
            ) : (
              <AiOutlineEye fontSize={24} />
            )}
          </span>
        </label>

        {/* Bottom Row */}
        <div className="md:col-span-2 flex justify-between items-center mt-2">
          <Link to="/vendor/login">
            <p style={{ color: "#007bff", fontSize: "0.8rem" }}>
              Already have an account? Login
            </p>
          </Link>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-semibold"
            style={{
              backgroundColor: "#007bff", // blue button
              color: "#ffffff", // white text
            }}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default VendorRegister;
