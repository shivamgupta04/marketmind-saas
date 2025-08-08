import dotenv from 'dotenv';
dotenv.config();

import Razorpay from 'razorpay';
import User from '../models/userModel.js';
import crypto from 'crypto';

// Validate Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Missing Razorpay credentials in environment variables');
}

console.log('Initializing Razorpay with key_id:', process.env.RAZORPAY_KEY_ID);

// Validate Razorpay credentials before initializing
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured properly');
}

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const CREDIT_PACKS = {
    '50': { priceInPaise: 49900, name: '50 Credits Pack', credits: 50 }, // ₹499
    '150': { priceInPaise: 119900, name: '150 Credits Pack', credits: 150 }, // ₹1199
};

export const createRazorpayOrder = async (req, res) => {
    try {
        // Validate Razorpay instance
        if (!instance.key_id || !instance.key_secret) {
            console.error('Razorpay instance not properly initialized');
            return res.status(500).json({
                success: false,
                message: 'Payment system not properly configured'
            });
        }

        // Log initial request details
        console.log('Request body:', req.body);
        console.log('Creating Razorpay order with packId:', req.body.packId);
        console.log('Razorpay Config:', {
            key_id: process.env.RAZORPAY_KEY_ID,
            instanceKeyId: instance.key_id // This should match
        });

        const { packId } = req.body;
        if (!packId) {
            return res.status(400).json({ 
                success: false,
                message: 'Pack ID is required'
            });
        }

        const pack = CREDIT_PACKS[packId];
        if (!pack) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credit pack selected.',
                availablePacks: Object.keys(CREDIT_PACKS)
            });
        }

        const receipt = `receipt_order_${new Date().getTime()}`;
        const options = {
            amount: pack.priceInPaise,
            currency: "INR",
            receipt: receipt,
            notes: {
                packId: packId,
                packName: pack.name
            }
        };

        console.log('Creating order with options:', options);

        try {
            const order = await instance.orders.create(options);
            console.log('Razorpay order created:', order);

            // Validate order object
            if (!order.id) {
                throw new Error('Invalid order response from Razorpay');
            }

            return res.json({
                success: true,
                ...order,
                key_id: process.env.RAZORPAY_KEY_ID,
                pack_details: pack
            });
        } catch (orderError) {
            console.error('Error in Razorpay order creation:', orderError);
            throw new Error(`Razorpay order creation failed: ${orderError.message}`);
        }

        if (!order) {
            return res.status(500).json({
                success: false,
                message: "Failed to create order"
            });
        }

        res.json({
            success: true,
            ...order,
            key_id: process.env.RAZORPAY_KEY_ID,
            pack_details: pack
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        console.error('Error stack:', error.stack);
        
        // Check if it's a Razorpay API error
        if (error.errorResponse) {
            console.error('Razorpay API Error:', error.errorResponse);
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message || 'Unknown error occurred',
            details: error.errorResponse || error.stack
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { order_id, razorpay_payment_id, razorpay_signature, packId } = req.body;
        
        if (!order_id || !razorpay_payment_id || !razorpay_signature || !packId) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required payment parameters" 
            });
        }

        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const pack = CREDIT_PACKS[packId];
        if (!pack) {
        return res.status(400).json({ message: 'Invalid credit pack.' });
    }

    // Create a signature to verify the payment
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment is successful and verified
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $inc: { credits: pack.credits } },
                { new: true } // Return the updated document
            );

            res.status(200).json({ 
                success: true, 
                message: "Payment verified successfully",
                newCredits: updatedUser.credits
            });
        } catch (err) {
            res.status(500).json({ success: false, message: "Could not update user credits." });
        }
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed." });
    }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error during payment verification",
            error: error.message 
        });
    }
};
