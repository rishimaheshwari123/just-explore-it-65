const Property = require('../models/propertyModel');

const updatePropertyCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, latitude, longitude, category, description, tags, keywords, vendor, images } = req.body;
console.log("images", req.body);
        let imagesArray = [];
        if (images) {
            try {
                imagesArray = JSON.parse(images); // if coming as string
            } catch {
                imagesArray = images; // if already array
            }
        }

        // Find property
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // Update fields
        property.title = title || property.title;
        property.location = location || property.location;
        property.latitude = latitude || property.latitude;
        property.longitude = longitude || property.longitude;
        property.category = category || property.category;
        property.description = description || property.description;
        property.tags = tags || property.tags;
        property.keywords = keywords || property.keywords;
        property.images = imagesArray.length ? imagesArray : property.images;
        property.vendor = vendor || property.vendor;

        await property.save();

        return res.status(200).json({
            success: true,
            message: "Property updated successfully!",
            property,
        });
    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating property API!",
        });
    }
};

const createPropertyCtrl = async (req, res) => {
    try {
        const { title, location, latitude, longitude, category, description, tags, keywords, vendor, images } = req.body;

        let imagesArray = [];
        if (images) {
            try {
                imagesArray = JSON.parse(images); // if coming as string
            } catch {
                imagesArray = images; // if already array
            }
        }

        if (!title || !location || !category || !description || !imagesArray.length || !vendor) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const property = await Property.create({
            title,
            location,
            latitude,
            longitude,
            category,
            description,
            tags,
            keywords,
            images: imagesArray,
            vendor,
        });

        return res.status(201).json({
            success: true,
            message: "Property created successfully!",
            property,
        });
    } catch (error) {
        console.error("Error creating property:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating property API!",
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

        const property = await Property.findById(id).populate("vendor");


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

const incrementPropertyViewCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('vendor');

        if (!property) {
            return res.status(404).json({ 
                success: false, 
                message: 'Property not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Property view incremented successfully',
            property
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong' 
        });
    }
};
module.exports = { createPropertyCtrl, getPropertiesByVendor, updatePropertyCtrl, getPropertiesCtrl, getPropertiesByIdCtrl, deletePropertyCtrl, incrementPropertyViewCtrl };
