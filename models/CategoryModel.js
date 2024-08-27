const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true // Ensure category names are unique
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true // URL-friendly version of the category name
    },
    description: {
        type: String,
        trim: true // Optional description of the category
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to another Category for nested categories
        default: null // Allows for subcategories
    },
    image: {
        type: String, // URL or path to the category image
        required: true // Make it required if every category must have an image
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to current date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set to current date
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;