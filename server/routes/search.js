
const express = require('express');
const router = express.Router();
const axios = require('axios');
async function searchGoogleBooks(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;

    try {
        const response = await axios.get(url);
        
        if (!response.data.items) {
            return []; 
        }
        const books = response.data.items.map(item => {
            const volumeInfo = item.volumeInfo;
            return {
                bookId: item.id,
                title: volumeInfo.title,
                author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'N/A',
                description: volumeInfo.description || 'No description available.',
                thumbnail: volumeInfo.imageLinks?.thumbnail || null,
            };
        });
        return books;

    } catch (error) {
        console.error("Error fetching from Google Books API:", error.message);
    }
    return []; 
}

router.post('/', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ msg: 'Please provide a search query.' });
    }

    try {
        const books = await searchGoogleBooks(query);
        res.json(books); 

    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).send('Error searching for books');
    }
});

module.exports = router;