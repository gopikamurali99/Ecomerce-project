const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    storeName: {
        type: String,
        required: true,
        trim: true
    },
    storeDescription: {
        type: String,
        trim: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Reference to the Product model
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    bankAccount: {
        accountHolderName: {
            type: String,
            required: true,
            trim: true
        },
        accountNumber: {
            type: String,
            required: true,
            trim: true
        },
        routingNumber: {
            type: String,
            required: true,
            trim: true
        },
        bankName: {
            type: String,
            required: true,
            trim: true
        }
    },
    gstDetails: {
        gstin: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        pan: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;