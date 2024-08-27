const express = require('express');
const router = express.Router();
const Admin = require('../models/AdminModel');
const Category = require('../models/CategoryModel');
const Product = require('../models/productModel');
const Customer = require('../models/CustomerModel');
const Seller = require('../models/SellerModel');
const authMiddleware = require('../MiddleWare/authMiddleware');
const adminMiddleware = require('../MiddleWare/authenticteAdmin');

// Middleware to verify admin
router.use(authMiddleware, adminMiddleware);

// Get all customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all sellers
router.get('/sellers', async (req, res) => {
    try {
        const sellers = await Seller.find({});
        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manage categories (Create, Update, Delete already covered in the Category routes)
router.post('/category', async (req, res) => {
    const { name, slug, description, parent, image } = req.body;
    try {
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({
            name,
            slug,
            description,
            parent: parent || null,
            image
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manage products (Create, Update, Delete already covered in the Product routes)
router.post('/product', async (req, res) => {
    const { name, description, sku, slug, price, category, brand, stock, size, color, images } = req.body;
    try {
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

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
            images
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a customer
router.delete('/customer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a seller
router.delete('/seller/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findByIdAndDelete(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a category
router.delete('/category/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a product
router.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
