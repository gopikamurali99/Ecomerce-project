const Customer = require('../models/CustomerModel'); 
const bcrypt = require('bcryptjs');// Assuming you have a Customer model

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        // Populate the auth field to get authentication details
        const customers = await Customer.find().populate('auth', 'name email role'); // Populate auth details
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId).populate('auth', 'name email role'); // Populate auth details
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a specific customer by ID
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.customerId, req.body, { new: true }).populate('auth', 'name email role'); // Populate auth details
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a specific customer by ID
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};