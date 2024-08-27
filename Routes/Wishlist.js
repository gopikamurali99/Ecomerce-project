const express = require('express');
const Wishlist = require('../models/wishListmodel'); // Adjust the path as necessary
const Product = require('../models/productModel'); // Adjust the path as necessary
const authenticateCustomer = require('../MiddleWare/authenticateCustomer'); // Your customer authentication middleware

const router = express.Router();

// Get the customer's wishlist (accessible by authenticated customers only)
router.get('/wishlist', authenticateCustomer, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.customerId }).populate('items.product');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json({ wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add an item to the wishlist (accessible by authenticated customers only)
router.post('/wishlist', authenticateCustomer, async (req, res) => {
    const { productId } = req.body;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create the wishlist for the user
        let wishlist = await Wishlist.findOne({ user: req.customerId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.customerId, items: [] });
        }

        // Check if the item is already in the wishlist
        const existingItemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add new item to the wishlist
        wishlist.items.push({
            product: productId,
            addedAt: Date.now()
        });

        await wishlist.save();
        res.status(201).json({ message: 'Item added to wishlist successfully', wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove an item from the wishlist (accessible by authenticated customers only)
router.delete('/wishlist/:productId', authenticateCustomer, async (req, res) => {
    const { productId } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ user: req.customerId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Remove the item from the wishlist
        wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);

        await wishlist.save();
        res.status(200).json({ message: 'Item removed from wishlist successfully', wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear the wishlist (accessible by authenticated customers only)
router.delete('/wishlist', authenticateCustomer, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOneAndDelete({ user: req.customerId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;