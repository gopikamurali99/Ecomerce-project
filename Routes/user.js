const express = require('express');
const verifyRole = require('../MiddleWare/verifyRole'); // Import the verifyRole middleware
const router = express.Router();

// Admin Route
router.get('/admin', verifyRole(['admin']), (req, res) => {
    res.send('Welcome Admin');
});

// Seller Route
router.get('/seller', verifyRole(['seller']), (req, res) => {
    res.send('Welcome Seller');
});

// Customer Route
router.get('/customer', verifyRole(['customer']), (req, res) => {
    res.send('Welcome Customer');
});

module.exports = router;