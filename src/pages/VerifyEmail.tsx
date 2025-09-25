import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "react-toastify";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) navigate("/vendor/register");
  }, []);

  const signUp = async () => {
    if (!signupData) return;

    const { name, email, phone, password, company, address, description } =
      signupData;
    const toastId = toast.info("Registering...", { autoClose: false });
    dispatch(setLoading(true));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/register`,
        {
          name,
          email,
          phone,
          password,
          company,
          address,
          description,
          otp,
        }
      );

      if (!response.data.success) throw new Error(response.data.message);

      toast.update(toastId, {
        render: "Signup Successful",
        type: "success",
        autoClose: 3000,
      });
      navigate("/vendor/login");
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Signup Failed",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resendOtp = async () => {
    if (!signupData?.email) return;
    const toastId = toast.info("Sending OTP...", { autoClose: false });
    dispatch(setLoading(true));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/sendotp`,
        {
          email: signupData.email,
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
    } catch (error: any) {
      console.error(error);
      toast.update(toastId, {
        render:
          error?.response?.data?.message ||
          error?.message ||
          "Could not send OTP",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyAndSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signUp();
  };

  return (
    <div className="min-h-screen grid place-items-center bg-white p-4">
      {loading ? (
        <div className="text-center font-semibold">Loading...</div>
      ) : (
        <div className="max-w-[500px] w-full p-6 lg:p-10 bg-white rounded-lg shadow-lg">
          <h1 className="text-black font-semibold text-2xl mb-2">
            Verify Email
          </h1>
          <p className="text-gray-700 mb-6">
            A verification code has been sent to {signupData?.email}. Enter the
            code below.
          </p>

          <form
            onSubmit={handleVerifyAndSignup}
            className="flex flex-col gap-4"
          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="w-12 md:w-14 lg:w-16 h-12 md:h-14 lg:h-16 border border-gray-300 rounded text-center text-lg md:text-xl"
                  style={{ boxShadow: "inset 0 0 2px rgba(0,0,0,0.1)" }}
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 8px",
              }}
              inputStyle={{}}
            />

            <button
              type="submit"
              className="w-full bg-blue-500 py-3 rounded-lg font-medium text-white hover:bg-blue-600 transition"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/vendor/register">
              <p className="text-blue-500 flex items-center gap-2 hover:underline">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>

            <button
              className="flex items-center text-blue-500 gap-2 hover:underline"
              type="button"
              onClick={resendOtp}
            >
              <RxCountdownTimer /> Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
