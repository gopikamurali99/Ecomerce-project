const express = require('express');
const router = express.Router();

const Product=require('../models/productModel')
const authenticateSellerOrAdmin=require('../MiddleWare/authenticateSellerOrAdmin')
const authenticateCustomer= require('../MiddleWare/authenticateCustomer')

// Create a new product (accessible by both sellers and admins)
 
router.post('/products', [authenticateSellerOrAdmin], async (req, res) => {
    const { name, description, sku, slug, price, category, brand, stock, size, color, images } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            sku,
            slug,
            price,
            category,
            brand,
            stock,
            size,
            color,
            images,
            seller: req.role === 'seller' ? req.userId : null // Set seller ID only if the user is a seller
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing product (accessible by both sellers and admins)
router.put('/products/:productId', [authenticateSellerOrAdmin], async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, size, color, images } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.size = size || product.size;
        product.color = color || product.color;
        product.images = images || product.images;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/products/:productId', [authenticateSellerOrAdmin], async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single product by ID
router.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId).populate('category').populate('brand');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('brand');
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get products by category
router.get('/products/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.find({ category: categoryId }).populate('category').populate('brand');
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a review to a product (accessible by authenticated customers only)
router.post('/products/:productId/reviews', authenticateCustomer, async (req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    try {
        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a review object
        const review = {
            user: req.customerId, // Assuming customerId is set in the request after authentication
            rating,
            comment,
            createdAt: Date.now()
        };

        // Push the review to the product's reviews array
        product.reviews.push(review);

        // Calculate the new average rating
        const totalRatings = product.reviews.length;
        const sumRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        product.averageRating = sumRatings / totalRatings;

        // Save the updated product
        await product.save();

        res.status(201).json({ message: 'Review added successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;