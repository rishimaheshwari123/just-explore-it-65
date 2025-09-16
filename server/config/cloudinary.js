const cloudinary = require("cloudinary").v2;

const cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
	} catch (error) {
		console.log(error);
	}
};

// Export both the connection function and cloudinary instance
module.exports = {
	cloudinaryConnect,
	cloudinary
};
