const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendorModel');

const router = express.Router();

// Register Vendor
router.post('/register', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            alternatePhone,
            ownerDetails,
            company,
            businessRegistrationNumber,
            gstNumber,
            address,
            description
        } = req.body;

        // Check if vendor already exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({
                success: false,
                message: 'Vendor with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create vendor
        const vendor = await Vendor.create({
            name,
            email,
            password: hashedPassword,
            phone,
            alternatePhone,
            ownerDetails,
            company,
            businessRegistrationNumber,
            gstNumber,
            address,
            description
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: vendor._id, email: vendor.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        // Remove password from response
        const vendorResponse = vendor.toObject();
        delete vendorResponse.password;

        res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            vendor: vendorResponse,
            token
        });
    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in vendor registration',
            error: error.message
        });
    }
});

// Login Vendor
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if vendor exists
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update login info
        await Vendor.findByIdAndUpdate(vendor._id, {
            lastLogin: new Date(),
            $inc: { loginCount: 1 }
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: vendor._id, email: vendor.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        // Remove password from response
        const vendorResponse = vendor.toObject();
        delete vendorResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            vendor: vendorResponse,
            token
        });
    } catch (error) {
        console.error('Vendor login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in vendor login',
            error: error.message
        });
    }
});

// Get Vendor Profile
router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findById(id).select('-password');
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.status(200).json({
            success: true,
            vendor
        });
    } catch (error) {
        console.error('Get vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor profile',
            error: error.message
        });
    }
});

// Update Vendor Profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove password from update data if present
        delete updateData.password;

        const vendor = await Vendor.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vendor profile updated successfully',
            vendor
        });
    } catch (error) {
        console.error('Update vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vendor profile',
            error: error.message
        });
    }
});

// Get All Vendors (Admin)
router.get('/all', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, verificationLevel } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (verificationLevel) filter['verification.verificationLevel'] = verificationLevel;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const vendors = await Vendor.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Vendor.countDocuments(filter);

        res.status(200).json({
            success: true,
            vendors,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalVendors: total
            }
        });
    } catch (error) {
        console.error('Get all vendors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendors',
            error: error.message
        });
    }
});

module.exports = router;