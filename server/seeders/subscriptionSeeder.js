const mongoose = require('mongoose');
const SubscriptionPlan = require('../models/subscriptionModel').SubscriptionPlan;
require('dotenv').config();

const subscriptionPlans = [
    {
        name: "Basic Premium",
        price: 2999,
        duration: 365, // 1 year in days
        features: [
            "Priority listing in search results",
            "Basic analytics dashboard",
            "Customer inquiry management",
            "Business profile verification badge",
            "Email support"
        ],
        description: "Perfect for small businesses looking to increase their visibility",
        isActive: true,
        priority: 1
    },
    {
        name: "Business Pro",
        price: 4999,
        duration: 365, // 1 year in days
        features: [
            "Top priority in search results",
            "Advanced analytics and insights",
            "Featured business listing",
            "Premium customer support",
            "Social media integration",
            "Multiple business photos",
            "Customer review management",
            "WhatsApp business integration"
        ],
        description: "Ideal for growing businesses that want maximum exposure",
        isActive: true,
        priority: 2
    },
    {
        name: "Enterprise Elite",
        price: 8999,
        duration: 365, // 1 year in days
        features: [
            "Highest priority in all searches",
            "Premium featured listing",
            "Comprehensive business analytics",
            "24/7 priority customer support",
            "Custom business profile design",
            "Unlimited business photos and videos",
            "Advanced SEO optimization",
            "Lead generation tools",
            "Marketing campaign support",
            "Dedicated account manager",
            "API access for business data",
            "Custom integrations"
        ],
        description: "Complete solution for large enterprises and established businesses",
        isActive: true,
        priority: 3
    }
];

const seedSubscriptionPlans = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('🔗 Connected to MongoDB for seeding subscription plans');

        // Clear existing subscription plans
        await SubscriptionPlan.deleteMany({});
        console.log('🗑️ Cleared existing subscription plans');

        // Insert new subscription plans
        const createdPlans = await SubscriptionPlan.insertMany(subscriptionPlans);
        console.log('✅ Subscription plans seeded successfully!');
        
        createdPlans.forEach(plan => {
            console.log(`📦 ${plan.name} - ₹${plan.price} - Priority: ${plan.priority}`);
        });

        console.log('\n🎯 Subscription Plans Summary:');
        console.log('1. Basic Premium (₹2,999) - Priority listing + basic features');
        console.log('2. Business Pro (₹4,999) - Featured listing + advanced features');
        console.log('3. Enterprise Elite (₹8,999) - Highest priority + premium features');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding subscription plans:', error);
        process.exit(1);
    }
};

// Run seeder if called directly
if (require.main === module) {
    seedSubscriptionPlans();
}

module.exports = { seedSubscriptionPlans, subscriptionPlans };