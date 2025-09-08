const Property = require('../models/propertyModel');
const { uploadImageToCloudinary } = require("../config/imageUploader");

const createPropertyCtrl = async (req, res) => {
    try {
        const {
            title,
            price,
            location,
            type,
            bedrooms,
            bathrooms,
            area,
            description,
            vendor,
            images,
            floors,
            parking,
            furnished,
            plotType
        } = req.body;
        const imagesArray = JSON.parse(images);

        if (
            !title ||
            !price ||
            !location ||
            !type ||

            !description ||
            !imagesArray ||
            !vendor
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields',
            });
        }


        const property = await Property.create({
            title,
            price,
            location,
            type,
            bedrooms,
            bathrooms,
            area,
            description,
            images: imagesArray,
            vendor,
            floors,
            parking,
            furnished,
            plotType
        });

        return res.status(201).json({
            success: true,
            message: 'Property Created Successfully!',
            property,
        });
    } catch (error) {
        console.error('Error creating property:', error);
        return res.status(500).json({
            success: false,
            message: 'Error in creating property API!',
        });
    }
};


const getPropertiesByVendor = async (req, res) => {
    try {
        const { vendor } = req.body;

        if (!vendor) {
            return res.status(400).json({ message: 'Vendor ID is required' });
        }

        const properties = await Property.find({ vendor }).populate('vendor');

        res.status(200).json({
            success: true,
            properties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


const updatePropertyCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            price,
            location,
            type,
            bedrooms,
            bathrooms,
            area,
            description,
            vendor,
            images,
            floors,
            parking,
            furnished,
            plotType
        } = req.body;
        const imagesArray = JSON.parse(images);
        // Find property
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found',
            });
        }


        // Update fields
        property.title = title || property.title;
        property.price = price || property.price;
        property.location = location || property.location;
        property.type = type || property.type;
        property.bedrooms = bedrooms || property.bedrooms;
        property.bathrooms = bathrooms || property.bathrooms;
        property.area = area || property.area;
        property.description = description || property.description;
        property.images = imagesArray || property.images;
        property.vendor = vendor || property.vendor;
        property.floors = floors || property.floors;
        property.parking = parking || property.parking;
        property.furnished = furnished || property.furnished;
        property.plotType = plotType || property.plotType;

        await property.save();

        return res.status(200).json({
            success: true,
            message: 'Property updated successfully!',
            property,
        });

    } catch (error) {
        console.error('Error updating property:', error);
        return res.status(500).json({
            success: false,
            message: 'Error in updating property API!',
        });
    }
};


const getPropertiesCtrl = async (req, res) => {
    try {


        const properties = await Property.find().populate('vendor');

        res.status(200).json({
            success: true,
            properties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


const getPropertiesByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id).populate({
            path: "vendor", // or whatever the referenced field is
            select: "name company"
        });

        res.status(200).json({
            success: true,
            property
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const deletePropertyCtrl = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully',
            property: deletedProperty,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};
module.exports = { createPropertyCtrl, getPropertiesByVendor, updatePropertyCtrl, getPropertiesCtrl, getPropertiesByIdCtrl, deletePropertyCtrl };
