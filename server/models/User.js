const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    favorites: [{ 
        bookId: { type: String, required: true }, 
        title: { type: String, required: true },
        author: { type: String },
        thumbnail: { type: String }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', UserSchema);