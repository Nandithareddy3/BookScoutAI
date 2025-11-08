const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
router.post('/add', auth, async (req, res) => {
  const { bookId, title, author, thumbnail } = req.body;

  if (!bookId || !title) {
    return res.status(400).json({ msg: 'Missing book ID or title' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const exists = user.favorites.some((b) => b.bookId.toString() === bookId.toString());
    if (exists) {
      return res.status(400).json({ msg: 'Book already in favorites' });
    }

    user.favorites.unshift({ bookId, title, author, thumbnail });
    await user.save();

    return res.json(user.favorites);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('favorites');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    return res.json(user.favorites);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
