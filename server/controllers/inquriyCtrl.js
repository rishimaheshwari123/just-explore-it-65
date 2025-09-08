const Inquiry = require("../models/InquiryModel");

const createInquiryCtrl = async (req, res) => {
    try {
        const { name, email, phone, subject, message, propertyType } = req.body;

        if (!name || !email || !phone || !subject || !message || !propertyType) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newInquiry = new Inquiry({
            name,
            email,
            phone,
            subject,
            message,
            propertyType,
        });

        await newInquiry.save();

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully",
            newInquiry,
        });
    } catch (error) {
        console.error("Inquiry submission error:", error);
        res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
    }
};

const getInquriyCtrl = async (req, res) => {
    try {


        const inquiry = await Inquiry.find()

        res.status(200).json({
            success: true,
            inquiry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createInquiryCtrl, getInquriyCtrl };
