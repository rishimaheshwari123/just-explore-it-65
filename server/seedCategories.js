const mongoose = require('mongoose');
const Category = require('./models/categoryModel');
const SubCategory = require('./models/subCategoryModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const BUSINESS_CATEGORIES = [
    "Advertising Agencies", "Agriculture Equipment & Seeds", "Apparels / Garments", 
    "Automobiles (Car, Bike, Showroom, Service)", "Automobile Spare Parts", "Baby Care & Kids Stores",
    "Banks & ATMs", "Banquet Halls", "Beauty Parlours & Salons", "Boutiques & Tailors",
    "Book Shops & Stationery", "Builders & Developers", "Car Rentals & Taxi Services",
    "Catering Services", "Chemists & Medical Stores", "Coaching Classes & Tuition",
    "Computer Sales & Services", "Courier & Cargo Services", "Dairy Products & Milk Suppliers",
    "Dance & Music Classes", "Diagnostic Centres & Pathology Labs", "Doctors (All Specializations)",
    "Dry Cleaners & Laundry Services", "Education Institutes", "Electricians",
    "Electronics & Home Appliances", "Event Organisers", "Eye Clinics & Opticians",
    "Fast Food & Restaurants", "Fitness Centres & Gyms", "Florists", "Furniture Dealers & Home Decor",
    "Financial Services (Loans, Insurance, CA)", "Garment Shops", "Gas Agencies", "Gift Shops",
    "Grocery Stores & Kirana", "Gynecologists", "Hardware & Sanitary Shops", "Hospitals & Nursing Homes",
    "Hostels / PG Accommodation", "Hotels & Resorts", "House Cleaning & Pest Control",
    "Ice Cream Parlours", "Interior Designers", "Internet Service Providers", "Insurance Agents",
    "Industrial Suppliers", "Jewellery Shops", "Job Placement Agencies", "Juice Centres",
    "Kids Wear & Toy Shops", "Kitchen Appliances Dealers", "Laboratories (Medical/Industrial)",
    "Laundry Services", "Lawyers & Legal Services", "Libraries", "Lighting Shops", "Marriage Gardens",
    "Mobile Phone Dealers & Repair", "Modular Kitchen Dealers", "Movers & Packers",
    "Music Instrument Shops", "Nursing Homes", "Nutritionists & Dieticians", "Opticians",
    "Online Shopping / E-commerce Support", "Orthopedic Clinics", "Painters & Contractors",
    "Pet Shops & Veterinary Clinics", "Petrol Pumps", "Photographers & Videographers",
    "Printing Press & Xerox", "Property Dealers", "Quick Service Restaurants",
    "Quilts & Bedding Dealers", "Real Estate Agents", "Restaurants & Cafes",
    "Repair Services (AC, Fridge, Washing Machine)", "Resorts & Holiday Homes", "Schools & Colleges",
    "Security Services & Guards", "Solar Dealers (Water Heater, Rooftop)", "Sports Shops & Academies",
    "Stationery & Xerox Shops", "Tailors & Boutiques", "Taxi Services & Car Rentals",
    "Tiffin Centres", "Tour & Travel Agents", "Tent House & Decorators", "Universities",
    "UPS & Inverter Dealers", "Uniform Suppliers", "Vegetable & Fruit Vendors", "Veterinary Doctors",
    "Video Shooting & Editing Services", "Vehicle Repair Garages", "Water Suppliers (20L Jar, Tanker)",
    "Wedding Planners", "Watch & Clock Dealers", "Wellness & Spa Centres",
    "Website Designers & IT Services", "Xerox & Printing Services", "X-Ray & Radiology Centres",
    "Yoga Centres", "Yellow Pages / Directory Services", "Zari & Embroidery Shops",
    "Zoological & Pet Services"
];

const SUBCATEGORIES = {
    "Advertising Agencies": ["Advertising Agencies"],
    "Agriculture Equipment & Seeds": ["Agriculture Equipment & Seeds"],
    "Apparels / Garments": ["Men's Wear", "Women's Wear", "Kids Wear", "Accessories"],
    "Automobiles (Car, Bike, Showroom, Service)": ["Car Showroom", "Bike Showroom", "Car Service", "Bike Service"],
    "Automobile Spare Parts": ["Car Parts", "Bike Parts", "Tyres", "Batteries"],
    "Baby Care & Kids Stores": ["Toys", "Clothing", "Feeding Supplies", "Baby Care Products"],
    "Banks & ATMs": ["Bank Branches", "ATMs", "Loan Services", "Investment Services"],
    "Banquet Halls": ["Wedding Halls", "Party Halls", "Corporate Events"],
    "Beauty Parlours & Salons": ["Salon", "Haircut", "Spa", "Bridal Makeup"],
    "Boutiques & Tailors": ["Boutique", "Tailoring", "Custom Clothing"],
    "Book Shops & Stationery": ["Books", "Stationery", "Magazines", "School Supplies"],
    "Builders & Developers": ["Residential Builders", "Commercial Builders", "Developers"],
    "Car Rentals & Taxi Services": ["Car Rental", "Taxi Service", "Airport Pickup"],
    "Catering Services": ["Wedding Catering", "Corporate Catering", "Event Catering"],
    "Chemists & Medical Stores": ["Pharmacy", "Medicines", "Healthcare Products"],
    "Coaching Classes & Tuition": ["School Coaching", "Competitive Exams", "Skill Development"],
    "Computer Sales & Services": ["Computer Store", "Laptop Sales", "Computer Repair", "Networking Services"],
    "Courier & Cargo Services": ["Courier Service", "Cargo Service", "Parcel Pickup"],
    "Dairy Products & Milk Suppliers": ["Milk", "Butter", "Cheese", "Ghee"],
    "Dance & Music Classes": ["Dance Classes", "Music Classes", "Instrument Training"],
    "Diagnostic Centres & Pathology Labs": ["Blood Tests", "X-Ray", "MRI", "Ultrasound"],
    "Doctors (All Specializations)": ["General Physician", "Dentist", "Cardiologist", "Gynecologist", "Pediatrician", "Dermatologist"],
    "Dry Cleaners & Laundry Services": ["Laundry", "Dry Cleaning", "Ironing"],
    "Education Institutes": ["Schools", "Colleges", "Skill Development", "Vocational Courses"],
    "Electricians": ["Residential Electrical", "Commercial Electrical", "Wiring Services"],
    "Electronics & Home Appliances": ["TV", "Fridge", "Washing Machine", "AC", "Mobile Devices"],
    "Event Organisers": ["Wedding Planning", "Corporate Events", "Birthday Parties"],
    "Eye Clinics & Opticians": ["Eye Checkup", "Spectacles", "Contact Lenses", "Optical Store"],
    "Fast Food & Restaurants": ["Fast Food", "Restaurant", "Cafe", "Beverages"],
    "Fitness Centres & Gyms": ["Gym", "Yoga", "Aerobics", "Zumba"],
    "Florists": ["Flower Shops", "Bouquets", "Event Decoration"],
    "Furniture Dealers & Home Decor": ["Furniture Store", "Home Decor", "Modular Kitchen"],
    "Financial Services (Loans, Insurance, CA)": ["Banking", "Loans", "Insurance", "Accounting"],
    "Garment Shops": ["Men's Wear", "Women's Wear", "Kids Wear", "Accessories"],
    "Gas Agencies": ["Domestic Gas", "Commercial Gas", "Cylinder Delivery"],
    "Gift Shops": ["Gifts", "Greeting Cards", "Toys", "Souvenirs"],
    "Grocery Stores & Kirana": ["Grocery Store", "Kirana Shop", "Daily Essentials"],
    "Gynecologists": ["Gynecologist"],
    "Hardware & Sanitary Shops": ["Hardware Store", "Sanitary Products", "Tools"],
    "Hospitals & Nursing Homes": ["Hospital", "Nursing Home", "Emergency Services"],
    "Hostels / PG Accommodation": ["Hostel", "PG Accommodation", "Shared Apartments"],
    "Hotels & Resorts": ["Hotel", "Resort", "Guest House"],
    "House Cleaning & Pest Control": ["House Cleaning", "Pest Control", "Sanitization"],
    "Ice Cream Parlours": ["Ice Cream", "Desserts", "Frozen Yogurt"],
    "Interior Designers": ["Interior Design", "Home Decor", "Modular Furniture"],
    "Internet Service Providers": ["Broadband", "Fiber Internet", "Wi-Fi Services"],
    "Insurance Agents": ["Life Insurance", "Health Insurance", "Vehicle Insurance"],
    "Industrial Suppliers": ["Industrial Equipment", "Raw Materials", "Tools"],
    "Jewellery Shops": ["Gold", "Silver", "Diamond", "Custom Jewellery"],
    "Job Placement Agencies": ["Recruitment", "Staffing", "Career Guidance"],
    "Juice Centres": ["Fresh Juice", "Smoothies", "Cold Pressed Juice"],
    "Kids Wear & Toy Shops": ["Kids Clothing", "Toys", "School Supplies"],
    "Kitchen Appliances Dealers": ["Microwave", "Oven", "Refrigerator", "Blender"],
    "Laboratories (Medical/Industrial)": ["Medical Lab", "Industrial Lab", "Testing Services"],
    "Laundry Services": ["Laundry", "Dry Cleaning", "Ironing"],
    "Lawyers & Legal Services": ["Lawyer", "Legal Consultation", "Documentation"],
    "Libraries": ["Public Library", "School Library", "College Library"],
    "Lighting Shops": ["LED Lights", "Bulbs", "Lamps", "Chandeliers"],
    "Marriage Gardens": ["Wedding Venue", "Banquet Hall", "Event Garden"],
    "Mobile Phone Dealers & Repair": ["Mobile Store", "Repair Services", "Accessories"],
    "Modular Kitchen Dealers": ["Modular Kitchen", "Cabinets", "Kitchen Accessories"],
    "Movers & Packers": ["House Moving", "Office Relocation", "Packing Services"],
    "Music Instrument Shops": ["Guitar", "Piano", "Drums", "Other Instruments"],
    "Nursing Homes": ["Nursing Home", "Elderly Care", "Medical Assistance"],
    "Nutritionists & Dieticians": ["Diet Consultation", "Weight Management", "Health Plans"],
    "Opticians": ["Spectacles", "Contact Lenses", "Eye Checkup"],
    "Online Shopping / E-commerce Support": ["E-commerce", "Online Store", "Delivery Support"],
    "Orthopedic Clinics": ["Orthopedic Consultation", "Surgery", "Physiotherapy"],
    "Painters & Contractors": ["Painting", "Renovation", "Construction"],
    "Pet Shops & Veterinary Clinics": ["Pet Shop", "Veterinary Clinic", "Pet Care"],
    "Petrol Pumps": ["Petrol Station", "Diesel Station", "CNG Station"],
    "Photographers & Videographers": ["Photography", "Videography", "Drone Services"],
    "Printing Press & Xerox": ["Printing", "Xerox", "Photocopy"],
    "Property Dealers": ["Real Estate", "Property Sale", "Property Rent"],
    "Quick Service Restaurants": ["Fast Food", "Burger", "Pizza", "Sandwich"],
    "Quilts & Bedding Dealers": ["Quilts", "Bedsheets", "Pillows", "Blankets"],
    "Real Estate Agents": ["Property Dealer", "Builder", "Brokerage"],
    "Restaurants & Cafes": ["Restaurant", "Cafe", "Bakery", "Beverages"],
    "Repair Services (AC, Fridge, Washing Machine)": ["AC Repair", "Fridge Repair", "Washing Machine Repair"],
    "Resorts & Holiday Homes": ["Resort", "Holiday Home", "Villa Rental"],
    "Schools & Colleges": ["School", "College", "Coaching Center"],
    "Security Services & Guards": ["Security Guard", "CCTV Installation", "Event Security"],
    "Solar Dealers (Water Heater, Rooftop)": ["Solar Panels", "Water Heater", "Rooftop Installation"],
    "Sports Shops & Academies": ["Sports Shop", "Academy", "Coaching Classes"],
    "Stationery & Xerox Shops": ["Stationery", "Xerox", "Printing Services"],
    "Tailors & Boutiques": ["Tailor", "Boutique", "Custom Clothing"],
    "Taxi Services & Car Rentals": ["Taxi Service", "Car Rental", "Airport Pickup"],
    "Tiffin Centres": ["Tiffin Service", "Home Delivery", "Meal Subscription"],
    "Tour & Travel Agents": ["Travel Agency", "Tour Guide", "Holiday Packages"],
    "Tent House & Decorators": ["Tent Rental", "Decorators", "Event Setup"],
    "Universities": ["University", "Courses", "Hostel", "Research Centers"],
    "UPS & Inverter Dealers": ["UPS", "Inverters", "Electrical Equipment"],
    "Uniform Suppliers": ["School Uniforms", "Corporate Uniforms", "Safety Wear"],
    "Vegetable & Fruit Vendors": ["Vegetables", "Fruits", "Organic Produce"],
    "Veterinary Doctors": ["Veterinary Consultation", "Pet Care", "Animal Surgery"],
    "Video Shooting & Editing Services": ["Video Shooting", "Editing", "Drone Services"],
    "Vehicle Repair Garages": ["Car Repair", "Bike Repair", "Service Center"],
    "Water Suppliers (20L Jar, Tanker)": ["Water Delivery", "Jar Supply", "Tanker Supply"],
    "Wedding Planners": ["Wedding Planning", "Event Management", "Decor"],
    "Watch & Clock Dealers": ["Watches", "Clocks", "Repair Services"],
    "Wellness & Spa Centres": ["Spa", "Wellness Center", "Massage Therapy"],
    "Website Designers & IT Services": ["Web Design", "IT Services", "Digital Marketing"],
    "Xerox & Printing Services": ["Xerox", "Printing", "Photocopy"],
    "X-Ray & Radiology Centres": ["X-Ray", "MRI", "CT Scan", "Ultrasound"],
    "Yoga Centres": ["Yoga Classes", "Meditation", "Fitness"],
    "Yellow Pages / Directory Services": ["Business Directory", "Listing Services"],
    "Zari & Embroidery Shops": ["Zari Work", "Embroidery", "Custom Clothing"],
    "Zoological & Pet Services": ["Zoo Services", "Pet Care", "Animal Feeding"]
};

const seedCategories = async () => {
    try {
        console.log('Starting category seeding...');
        
        // Clear existing data
        await Category.deleteMany({});
        await SubCategory.deleteMany({});
        console.log('Cleared existing categories and subcategories');

        for (let i = 0; i < BUSINESS_CATEGORIES.length; i++) {
            const categoryName = BUSINESS_CATEGORIES[i];
            
            // Create category
            const category = new Category({
                name: categoryName,
                description: `${categoryName} related businesses and services`,
                sortOrder: i
            });

            await category.save();
            console.log(`Created category: ${category.name}`);

            // Create subcategories
            const subCats = SUBCATEGORIES[categoryName];
            if (subCats && subCats.length > 0) {
                for (let j = 0; j < subCats.length; j++) {
                    const subCatName = subCats[j];
                    
                    const subCategory = new SubCategory({
                        name: subCatName,
                        description: `${subCatName} services and businesses`,
                        category: category._id,
                        sortOrder: j
                    });

                    await subCategory.save();
                    console.log(`  Created subcategory: ${subCategory.name}`);
                }
            }
        }

        console.log('Category seeding completed successfully!');
        
        // Display summary
        const totalCategories = await Category.countDocuments();
        const totalSubCategories = await SubCategory.countDocuments();
        
        console.log(`\nSummary:`);
        console.log(`Total Categories: ${totalCategories}`);
        console.log(`Total SubCategories: ${totalSubCategories}`);
        
    } catch (error) {
        console.error('Error seeding categories:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeder
connectDB().then(() => {
    seedCategories();
});

module.exports = { seedCategories };