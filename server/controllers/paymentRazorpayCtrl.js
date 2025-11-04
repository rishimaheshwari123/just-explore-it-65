const crypto = require("crypto");
const { razorpayInstance } = require("../config/razorpay");
const { BusinessSubscription, SubscriptionPlan } = require("../models/subscriptionModel");
const Business = require("../models/businessModel");
const SubscriptionLog = require("../models/subscriptionLogModel");


const createRazorpayOrderCtrl = async (req, res) => {
    try {
        const { amount } = req.body; // base amount (subtotal)

        // Compute GST 18% and total
        const baseAmount = Number(amount);
        const taxRate = 0.18;
        const gstAmount = Number((baseAmount * taxRate).toFixed(2));
        const totalAmount = Number((baseAmount + gstAmount).toFixed(2));

        const options = {
            amount: Math.round(totalAmount * 100), // Razorpay expects paise
            currency: "INR",
            receipt: `order_rcptid_${Math.floor(Math.random() * 100000)}`,
            notes: {
                subtotal: baseAmount.toString(),
                taxRate: "18%",
                taxAmount: gstAmount.toString(),
                total: totalAmount.toString()
            }
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({ order, breakdown: { subtotal: baseAmount, taxRate, taxAmount: gstAmount, total: totalAmount } });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating order"
        });
    }
};



// Listing activation: after any successful payment, activate pending business

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

        // ✅ Fetch additional payment details from Razorpay (method, status, fee, tax, contact, email)
        let paymentInfo = null;
        let orderInfo = null;
        try {
            paymentInfo = await razorpayInstance.payments.fetch(razorpay_payment_id);
        } catch (e) {
            console.warn("Razorpay payments.fetch failed:", e?.message || e);
        }
        try {
            orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        } catch (e) {
            console.warn("Razorpay orders.fetch failed:", e?.message || e);
        }

        // ✅ Compute GST 18%
        const baseAmount = price || plan.price;
        const taxRate = 0.18;
        const gstAmount = Number((baseAmount * taxRate).toFixed(2));
        const totalAmount = Number((baseAmount + gstAmount).toFixed(2));

        // ✅ Save subscription
        const newSubscription = new BusinessSubscription({
            business,
            vendor,
            subscriptionPlan,
            plan: subscriptionPlan,
            planName: planName || plan.name,
            startDate: start,
            endDate: end,
            price: totalAmount,
            status: "active",
            paymentDetails: {
                // Core identifiers
                transactionId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,

                // Amount & currency (with GST)
                amount: totalAmount,
                currency: orderInfo?.currency || "INR",
                taxRate,
                taxAmount: gstAmount,
                subtotal: baseAmount,
                total: totalAmount,

                // Method and gateway
                paymentMethod: paymentInfo?.method || paymentMethod || "Razorpay",
                processor: {
                    name: "Razorpay",
                    fee: paymentInfo?.fee || 0,
                    tax: paymentInfo?.tax || 0,
                },

                // Payer info
                email: paymentInfo?.email || undefined,
                contact: paymentInfo?.contact || undefined,

                // Status info
                processorStatus: paymentInfo?.status || "captured",
                captured: Boolean(paymentInfo?.captured ?? true),

                // Timestamps
                paymentDate: new Date(),
                paymentStatus: "completed",
            },
            autoRenewal: autoRenewal || false,
            features: features?.length ? features : plan.features,
            priority: priority || plan.priority || 1,
        });

        await newSubscription.save();

        // ✅ Update Business document to reflect active subscription
        try {
            const businessDoc = await Business.findById(business);
            if (businessDoc) {
                const subscriptionData = {
                    subscriptionId: newSubscription._id,
                    planName: plan.name,
                    startDate: start,
                    endDate: end,
                    price: totalAmount,
                    status: 'active',
                    features: plan.features,
                    priority: plan.priority
                };

                businessDoc.subscriptions = businessDoc.subscriptions || [];
                businessDoc.subscriptions.push(subscriptionData);
                businessDoc.currentSubscription = subscriptionData;
                businessDoc.isPremium = true;

                // Premium features toggles based on plan features
                businessDoc.premiumFeatures = businessDoc.premiumFeatures || {};
                businessDoc.premiumFeatures.featuredListing = plan.features?.includes('Featured Listing') || false;
                businessDoc.premiumFeatures.prioritySupport = plan.features?.includes('Priority Support') || false;
                businessDoc.premiumFeatures.analyticsAccess = plan.features?.includes('Advanced Analytics') || false;
                businessDoc.premiumFeatures.customBranding = plan.features?.includes('Custom Branding') || false;

                // Activate listing after successful subscription purchase
                if (businessDoc.status === 'pending') {
                    businessDoc.status = 'active';
                }

                await businessDoc.save();
            }
        } catch (bizErr) {
            console.warn('Failed to update business with subscription:', bizErr?.message || bizErr);
        }

        // ✅ Log subscription activity with GST-inclusive amount
        try {
            await SubscriptionLog.logActivity({
                business,
                vendor,
                subscription: newSubscription._id,
                plan: subscriptionPlan,
                action: 'purchased',
                amount: totalAmount,
                paymentDetails: {
                    transactionId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    signature: razorpay_signature,
                    amount: totalAmount,
                    currency: orderInfo?.currency || 'INR',
                    taxRate,
                    taxAmount: gstAmount,
                    subtotal: baseAmount,
                    paymentMethod: paymentInfo?.method || paymentMethod || 'Razorpay',
                    processorStatus: paymentInfo?.status || 'captured',
                    paymentDate: new Date(),
                    paymentStatus: 'completed'
                },
                metadata: {
                    userAgent: req.headers['user-agent'] || '',
                    ipAddress: req.ip || req.connection?.remoteAddress || '',
                    source: 'web'
                },
                notes: `Subscription purchased via Razorpay: ${plan.name}`
            });
        } catch (logErr) {
            console.warn('Failed to log subscription activity:', logErr?.message || logErr);
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified. Subscription activated and business listed.",
            subscription: newSubscription,
            receiptContext: {
                order: {
                    id: razorpay_order_id,
                    currency: orderInfo?.currency || "INR",
                    amount: totalAmount,
                    receipt: orderInfo?.receipt,
                },
                payment: {
                    id: razorpay_payment_id,
                    signature: razorpay_signature,
                    method: paymentInfo?.method,
                    status: paymentInfo?.status,
                }
            }
        });

    } catch (error) {
        console.error("Error in verifyPaymentCtrl:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



module.exports = { createRazorpayOrderCtrl, verifyPaymentCtrl }
