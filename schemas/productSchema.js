const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    start: {
        latitude: {
            type: Number,
            required: [true, 'Please provide starting latitude'],
        },
        longitude: {
            type: Number,
            required: [true, 'Please provide starting longitude'],
        },
    },
    end: {
        latitude: {
            type: Number,
            required: [true, 'Please provide ending latitude'],
        },
        longitude: {
            type: Number,
            required: [true, 'Please provide ending longitude'],
        },
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
    },
    distance: {
        type: Number,
        required: [true, 'Please provide distance'],
    },
    rider: {
        type: String,
        required: [true, 'Please provide rider name'],
        enum: ['ola', 'uber', 'rapido', 'local'],
    }

});

module.exports = mongoose.model('Product', productSchema);
