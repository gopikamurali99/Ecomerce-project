const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the User model
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now // Automatically set to current date
        }
    }],
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

// Create the Wishlist model
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;