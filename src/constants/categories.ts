// Business Categories for filtering and display
export const BUSINESS_CATEGORIES = [
  // A
  "Advertising Agencies",
  "Agriculture Equipment & Seeds",
  "Apparels / Garments",
  "Automobiles (Car, Bike, Showroom, Service)",
  "Automobile Spare Parts",
  
  // B
  "Baby Care & Kids Stores",
  "Banks & ATMs",
  "Banquet Halls",
  "Beauty Parlours & Salons",
  "Boutiques & Tailors",
  "Book Shops & Stationery",
  "Builders & Developers",
  
  // C
  "Car Rentals & Taxi Services",
  "Catering Services",
  "Chemists & Medical Stores",
  "Coaching Classes & Tuition",
  "Computer Sales & Services",
  "Courier & Cargo Services",
  
  // D
  "Dairy Products & Milk Suppliers",
  "Dance & Music Classes",
  "Diagnostic Centres & Pathology Labs",
  "Doctors (All Specializations)",
  "Dry Cleaners & Laundry Services",
  
  // E
  "Education Institutes",
  "Electricians",
  "Electronics & Home Appliances",
  "Event Organisers",
  "Eye Clinics & Opticians",
  
  // F
  "Fast Food & Restaurants",
  "Fitness Centres & Gyms",
  "Florists",
  "Furniture Dealers & Home Decor",
  "Financial Services (Loans, Insurance, CA)",
  
  // G
  "Garment Shops",
  "Gas Agencies",
  "Gift Shops",
  "Grocery Stores & Kirana",
  "Gynecologists",
  
  // H
  "Hardware & Sanitary Shops",
  "Hospitals & Nursing Homes",
  "Hostels / PG Accommodation",
  "Hotels & Resorts",
  "House Cleaning & Pest Control",
  
  // I
  "Ice Cream Parlours",
  "Interior Designers",
  "Internet Service Providers",
  "Insurance Agents",
  "Industrial Suppliers",
  
  // J
  "Jewellery Shops",
  "Job Placement Agencies",
  "Juice Centres",
  
  // K
  "Kids Wear & Toy Shops",
  "Kitchen Appliances Dealers",
  
  // L
  "Laboratories (Medical/Industrial)",
  "Laundry Services",
  "Lawyers & Legal Services",
  "Libraries",
  "Lighting Shops",
  
  // M
  "Marriage Gardens",
  "Mobile Phone Dealers & Repair",
  "Modular Kitchen Dealers",
  "Movers & Packers",
  "Music Instrument Shops",
  
  // N
  "Nursing Homes",
  "Nutritionists & Dieticians",
  
  // O
  "Opticians",
  "Online Shopping / E-commerce Support",
  "Orthopedic Clinics",
  
  // P
  "Painters & Contractors",
  "Pet Shops & Veterinary Clinics",
  "Petrol Pumps",
  "Photographers & Videographers",
  "Printing Press & Xerox",
  "Property Dealers",
  
  // Q
  "Quick Service Restaurants",
  "Quilts & Bedding Dealers",
  
  // R
  "Real Estate Agents",
  "Restaurants & Cafes",
  "Repair Services (AC, Fridge, Washing Machine)",
  "Resorts & Holiday Homes",
  
  // S
  "Schools & Colleges",
  "Security Services & Guards",
  "Solar Dealers (Water Heater, Rooftop)",
  "Sports Shops & Academies",
  "Stationery & Xerox Shops",
  
  // T
  "Tailors & Boutiques",
  "Taxi Services & Car Rentals",
  "Tiffin Centres",
  "Tour & Travel Agents",
  "Tent House & Decorators",
  
  // U
  "Universities",
  "UPS & Inverter Dealers",
  "Uniform Suppliers",
  
  // V
  "Vegetable & Fruit Vendors",
  "Veterinary Doctors",
  "Video Shooting & Editing Services",
  "Vehicle Repair Garages",
  
  // W
  "Water Suppliers (20L Jar, Tanker)",
  "Wedding Planners",
  "Watch & Clock Dealers",
  "Wellness & Spa Centres",
  "Website Designers & IT Services",
  
  // X
  "Xerox & Printing Services",
  "X-Ray & Radiology Centres",
  
  // Y
  "Yoga Centres",
  "Yellow Pages / Directory Services",
  
  // Z
  "Zari & Embroidery Shops",
  "Zoological & Pet Services"
];

// Grouped categories for better organization
export const CATEGORY_GROUPS = {
  'A': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('A')),
  'B': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('B')),
  'C': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('C')),
  'D': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('D')),
  'E': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('E')),
  'F': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('F')),
  'G': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('G')),
  'H': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('H')),
  'I': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('I')),
  'J': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('J')),
  'K': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('K')),
  'L': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('L')),
  'M': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('M')),
  'N': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('N')),
  'O': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('O')),
  'P': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('P')),
  'Q': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('Q')),
  'R': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('R')),
  'S': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('S')),
  'T': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('T')),
  'U': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('U')),
  'V': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('V')),
  'W': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('W')),
  'X': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('X')),
  'Y': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('Y')),
  'Z': BUSINESS_CATEGORIES.filter(cat => cat.startsWith('Z'))
};