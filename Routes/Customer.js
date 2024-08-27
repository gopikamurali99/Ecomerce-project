const express = require('express');
const Customer = require('../models/CustomerModel'); // Adjust the path as necessary
const authenticateCustomer = require('../MiddleWare/authenticateCustomer'); // Your customer authentication middleware

const router = express.Router();

// Get customer profile (accessible by authenticated customers only)
router.get('/customers/profile', authenticateCustomer, async (req, res) => {
    try {
        const customer = await Customer.findById(req.customerId); // Assuming customerId is set in the request after authentication
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update customer profile (accessible by authenticated customers only)
router.put('/customers/profile', authenticateCustomer, async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        const customer = await Customer.findById(req.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update customer fields
        customer.name = name || customer.name;
        customer.phone = phone || customer.phone;
        customer.address = address || customer.address;

        await customer.save();
        res.status(200).json({ message: 'Profile updated successfully', customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete customer account (accessible by authenticated customers only)
router.delete('/customers/profile', authenticateCustomer, async (req, res) => {
    try {
        const customer = await Customer.findById(req.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.remove();
        res.status(200).json({ message: 'Customer account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add additional routes as needed, such as managing addresses or orders

module.exports = router;