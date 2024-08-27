const express = require('express');
const Order = require('../models/OrderModel'); // Adjust the path as necessary
const Cart = require('../models/cartmodel'); // Adjust the path as necessary
const authenticateCustomer = require('../MiddleWare/authenticateCustomer'); // Your customer authentication middleware

const router = express.Router();

// Get the customer's order history (accessible by authenticated customers only)
router.get('/orders', authenticateCustomer, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.customerId }).populate('items.product');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new order (accessible by authenticated customers only)
router.post('/orders', authenticateCustomer, async (req, res) => {
    const { paymentMethod, shippingAddress } = req.body;

    try {
        // Find the customer's cart
        const cart = await Cart.findOne({ user: req.customerId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new order
        const order = new Order({
            user: req.customerId,
            items: cart.items,
            totalAmount: cart.totalPrice,
            payment: {
                paymentMethod
            },
            shippingAddress
        });

        await order.save();

        // Clear the customer's cart
        await Cart.findOneAndUpdate({ user: req.customerId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order details (accessible by authenticated customers only)
router.get('/orders/:orderId', authenticateCustomer, async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;