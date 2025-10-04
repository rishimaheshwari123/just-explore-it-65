const bcrypt = require("bcryptjs");
const vendorModel = require("../models/vendorModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/otpModel")
const otpGenerator = require("otp-generator")



const vendorRegisterCtrl = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      otp,
      company,
      address,
      description
    } = req.body

    // Check required fields
    if (!name || !email || !phone || !password || !otp || !company || !address) {
      return res.status(403).json({
        success: false,
        message: "All required fields (name, email, phone, password, otp, company, address) must be provided",
      })
    }

    // Check if user already exists
    const existingUser = await vendorModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const response = await OTPModel.find({ email }).sort({ createdAt: -1 }).limit(1)
    if (response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await vendorModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      company,
      address,
      description,
      status: "pending", // default
    })

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Register error:", error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
};



const vendorLoginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await vendorModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Vendor is not Registered with Us Please SignUp to Continue`,
      });
    }
    // if (user.status !== "approved") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Your account is not active till now`,
    //   });
    // }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      user.token = token;
      user.password = undefined;
      const options = {
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `Vendor Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};



const getAllVendorCtrl = async (req, res) => {
  try {
    const vendors = await vendorModel.find();
    return res.status(200).json({
      success: true,
      vendors
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting all vendor api"
    })
  }
}

const updateVendorStatusCtrl = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }



    const updatedVendor = await vendorModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor status updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateVendorPercentageCtrl = async (req, res) => {
  try {
    const { percentage } = req.body;
    const { id } = req.params;
    if (!percentage) {
      return res.status(400).json({
        success: false,
        message: "percentage is required",
      });
    }



    const updatedVendor = await vendorModel.findByIdAndUpdate(
      id,
      { percentage },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor percentage updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getVendorByIDCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorModel.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting vendor by ID",
    });
  }
};


const updateVendorProfileCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedVendor = await vendorModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating vendor profile",
    });
  }
};


const sendotpCtrl = async (req, res) => {
  try {
    const { email } = req.body
    const checkUserPresent = await vendorModel.findOne({ email })

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTPModel.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTPModel.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}








module.exports = {
  vendorRegisterCtrl,
  vendorLoginCtrl,
  getAllVendorCtrl,
  updateVendorStatusCtrl,
  getVendorByIDCtrl,
  updateVendorProfileCtrl,
  updateVendorPercentageCtrl,
  sendotpCtrl
};
