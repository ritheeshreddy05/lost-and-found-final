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
    image: {
        url: String,
        public_id: String
    },
    foundLocation: {
        type: String,
        required: true,
        trim: true
    },
    handoverLocation: {
        type: String,
        default: 'Security Office',
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