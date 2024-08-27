const express = require('express');
const Cart = require('../models/cartmodel'); // Adjust the path as necessary
const Product = require('../models/productModel'); // Adjust the path as necessary
const authenticateCustomer = require('../MiddleWare/authenticateCustomer'); // Your customer authentication middleware

const router = express.Router();

// Get the customer's cart (accessible by authenticated customers only)
router.get('/cart', authenticateCustomer, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.customerId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add an item to the cart (accessible by authenticated customers only)
router.post('/cart', authenticateCustomer, async (req, res) => {
    const { productId, quantity, size, color } = req.body;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create the cart for the user
        let cart = await Cart.findOne({ user: req.customerId });
        if (!cart) {
            cart = new Cart({ user: req.customerId, items: [] });
        }

        // Check if the item is already in the cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            // Update quantity if the item already exists in the cart
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].price = product.price * cart.items[existingItemIndex].quantity; // Update price
        } else {
            // Add new item to the cart
            cart.items.push({
                product: productId,
                quantity,
                price: product.price * quantity,
                size,
                color
            });
        }

        // Update total price and total items
        cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

        await cart.save();
        res.status(201).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update item quantity in the cart (accessible by authenticated customers only)
router.put('/cart/items/:itemId', authenticateCustomer, async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.customerId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update quantity and price
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = cart.items[itemIndex].price / cart.items[itemIndex].quantity * quantity; // Update price

        // Update total price and total items
        cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

        await cart.save();
        res.status(200).json({ message: 'Item quantity updated successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove an item from the cart (accessible by authenticated customers only)
router.delete('/cart/items/:itemId', authenticateCustomer, async (req, res) => {
    const { itemId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.customerId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        // Update total price and total items
        cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;