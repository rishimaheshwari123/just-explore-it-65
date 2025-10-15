const crypto = require("crypto");
const { razorpayInstance } = require("../config/razorpay");
const { BusinessSubscription, SubscriptionPlan } = require("../models/subscriptionModel");


const createRazorpayOrderCtrl = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${Math.floor(Math.random() * 100000)}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating order"
        });
    }
};



const verifyPaymentCtrl = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            business,
            vendor,
            subscriptionPlan,
            planName,
            price,
            startDate,
            endDate,
            paymentMethod,
            autoRenewal,
            features,
            priority
        } = req.body;

        // ✅ Validate required fields
        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !business ||
            !vendor ||
            !subscriptionPlan
        ) {
            return res.status(400).json({ message: "Missing payment or subscription details." });
        }

        // ✅ Verify Razorpay signature
        const secret = process.env.RAZORPAY_SECRET;
        if (!secret) {
            console.error("RAZORPAY_SECRET is not set.");
            return res.status(500).json({ message: "Payment configuration error." });
        }

        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed." });
        }

        // ✅ Fetch subscription plan details
        const plan = await SubscriptionPlan.findById(subscriptionPlan);
        if (!plan) return res.status(404).json({ message: "Subscription plan not found." });

        // ✅ Calculate endDate if not provided
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date(start.getTime() + plan.duration * 24 * 60 * 60 * 1000);

        // ✅ Save subscription
        const newSubscription = new BusinessSubscription({
            business,
            vendor,
            subscriptionPlan,
            plan: subscriptionPlan,
            planName: planName || plan.name,
            startDate: start,
            endDate: end,
            price: price || plan.price,
            status: "active",
            paymentDetails: {
                transactionId: razorpay_payment_id,
                paymentMethod: paymentMethod || "Razorpay",
                paymentDate: new Date(),
                paymentStatus: "completed",
            },
            autoRenewal: autoRenewal || false,
            features: features?.length ? features : plan.features,
            priority: priority || plan.priority || 1,
        });

        await newSubscription.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified and subscription activated successfully.",
            subscription: newSubscription,
        });

    } catch (error) {
        console.error("Error in verifyPaymentCtrl:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



module.exports = { createRazorpayOrderCtrl, verifyPaymentCtrl }
