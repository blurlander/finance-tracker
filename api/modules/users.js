const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    expenses: {
        type: [Object],
        required: true
    },
    income: {
        type: [Object],
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    categories: {
        type: [Object],
        required: true
    },
    // Define your schema fields here
});

module.exports  = mongoose.model('User', userSchema);