const express = require('express');
const Payment = require('../models/paymentModel'); // Adjust the path as necessary
const Order = require('../models/OrderModel'); // Adjust the path as necessary
const authenticateCustomer = require('../MiddleWare/authenticateCustomer'); // Your customer authentication middleware

const router = express.Router();

// Create a new payment (accessible by authenticated customers only)
router.post('/payments', authenticateCustomer, async (req, res) => {
    const { orderId, amount, paymentMethod, transactionId } = req.body;

    try {
        // Find the order to ensure it belongs to the authenticated user
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.user.toString() !== req.customerId) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this order' });
        }

        // Create a new payment
        const payment = new Payment({
            orderId,
            userId: req.customerId,
            amount,
            paymentMethod,
            transactionId,
            paymentStatus: 'completed' // Assuming payment is successful
        });

        await payment.save();

        res.status(201).json({ message: 'Payment processed successfully', payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment details (accessible by authenticated customers only)
router.get('/payments/:paymentId', authenticateCustomer, async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId).populate('orderId').populate('userId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Ensure the payment belongs to the authenticated user
        if (payment.userId.toString() !== req.customerId) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this payment' });
        }

        res.status(200).json({ payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment history for the authenticated customer (accessible by authenticated customers only)
router.get('/payments', authenticateCustomer, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.customerId }).populate('orderId');
        res.status(200).json({ payments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;