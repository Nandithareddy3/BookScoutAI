
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Review = require('../models/Review'); 
const User = require('../models/User');    

router.post('/', auth, async (req, res) => {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating || !comment) {
        return res.status(400).json({ msg: 'Please provide a bookId, rating, and comment.' });
    }

    try {

        const user = await User.findById(req.userId).select('name');
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const existingReview = await Review.findOne({ bookId: bookId, user: req.userId });
        if (existingReview) {
            return res.status(400).json({ msg: 'You have already reviewed this book.' });
        }

        const newReview = new Review({
            bookId: bookId,
            user: req.userId,
            userName: user.name, 
            rating: rating,
            comment: comment
        });
        const review = await newReview.save();
        
        res.status(201).json(review); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId })
            .sort({ createdAt: -1 }); 
            
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;