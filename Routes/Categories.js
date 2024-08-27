const express = require('express');
const Category = require('../models/CategoryModel'); // Adjust the path as necessary
const authenticateAdmin = require('../MiddleWare/authenticteAdmin'); // Your admin authentication middleware

const router = express.Router();

// Create a new category (accessible by admins only)
router.post('/categories', authenticateAdmin, async (req, res) => {
    const { name, slug, description, parent, image } = req.body;

    try {
        const newCategory = new Category({
            name,
            slug,
            description,
            parent,
            image
        });

        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing category (accessible by admins only)
router.put('/categories/:categoryId', authenticateAdmin, async (req, res) => {
    const { categoryId } = req.params;
    const { name, slug, description, parent, image } = req.body;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update category fields
        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.description = description || category.description;
        category.parent = parent || category.parent;
        category.image = image || category.image;

        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a category (accessible by admins only)
router.delete('/categories/:categoryId', authenticateAdmin, async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.remove();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single category by ID
router.get('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;