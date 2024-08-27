const express = require('express');
const router = express.Router();
const Seller=require('../models/SellerModel')
const Product=require('../models/productModel')
const authenticateSeller=require('../MiddleWare/authenticateSeller')


router.put('/seller/complete-profile', authenticateSeller, async (req, res) => {
    const { address, storeName, storeDescription, bankAccount, gstDetails } = req.body;
    try {
        const seller = await Seller.findById(req.sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Update additional fields
        seller.address = address;
        seller.storeName = storeName;
        seller.storeDescription = storeDescription;
        seller.bankAccount = bankAccount;
        seller.gstDetails = gstDetails;

        await seller.save();
        res.status(200).json({ message: 'Profile completed successfully', seller });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/seller/products', authenticateSeller, async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
        const product = new Product({ name, description, price, stock, seller: req.sellerId });
        await product.save();

        const seller = await Seller.findById(req.sellerId);
        seller.products.push(product._id);
        await seller.save();

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/seller/products/:productId', authenticateSeller, async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product || product.seller.toString() !== req.sellerId) {
            return res.status(404).json({ message: 'Product not found or not authorized' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/seller/products/:productId', authenticateSeller, async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product || product.seller.toString() !== req.sellerId) {
            return res.status(404).json({ message: 'Product not found or not authorized' });
        }

        await product.remove();

        const seller = await Seller.findById(req.sellerId);
        seller.products.pull(productId);
        await seller.save();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/seller/profile', authenticateSeller, async (req, res) => {
    try {
        const seller = await Seller.findById(req.sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ seller });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;