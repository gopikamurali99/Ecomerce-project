
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    SKU: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    image_url: { 
        type: String, 
        required: true 
    },
    sizes: { 
        type: [String], 
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});



module.exports =mongoose.model('product',productSchema);