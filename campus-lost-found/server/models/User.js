const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    rewards: {
        points: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('User', userSchema);