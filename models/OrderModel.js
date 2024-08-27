const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        size: {
            type: String, // Size of the product (if applicable)
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] // Example sizes; adjust as needed
        },
        color: {
            type: String // Color of the product (if applicable)
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    payment: {
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'upi', 'net_banking'], // Add other payment methods as needed
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: {
            type: String,
            unique: true // Unique identifier from the payment gateway
        }
    },
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;