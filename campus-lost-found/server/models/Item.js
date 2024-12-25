const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    foundLocation: {
        type: String,
        required: true,
        trim: true
    },
    handoverLocation: {
        type: String,
        required: true,
        trim: true
    },
    reporterRollNo: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'claimed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);