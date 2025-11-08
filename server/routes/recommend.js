const express = require('express');
const router = express.Router();
const axios = require('axios');
async function searchGoogleBooks(title, author) {
    const query = `intitle:"${title}"+inauthor:"${author}"`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;

    try {
        const response = await axios.get(url);
        const item = response.data.items?.[0];

        if (item) {
            const volumeInfo = item.volumeInfo;
            return {
                bookId: item.id,
                title: volumeInfo.title,
                author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'N/A',
                description: volumeInfo.description || 'No description available.',
                thumbnail: volumeInfo.imageLinks?.thumbnail || null,
                previewLink: volumeInfo.previewLink
            };
        }
    } catch (error) {
        console.error("Error fetching from Google Books API:", error.message);
    }
    return null;
}

router.post('/', async (req, res) => {
    const { userPrompt } = req.body;

    if (!userPrompt) {
        return res.status(400).json({ msg: 'Please provide a prompt.' });
    }

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiPrompt = `
        You are an expert book recommender. Based on the user's preference: "${userPrompt}",
        suggest a list of 5 book recommendations.

        Your response must be ONLY valid JSON.
        Do NOT include code fences, backticks, or explanation.

        The JSON must have a single key "recommendations" which contains an array of 5 book objects.
        {
            "recommendations": [
                {
                    "title": "Book Title 1",
                    "author": "Author Name 1",
                    "reasoning": "1-2 sentences explaining why it matches."
                },
                {
                    "title": "Book Title 2",
                    "author": "Author Name 2",
                    "reasoning": "1-2 sentences explaining why it matches."
                },
                {
                    "title": "Book Title 3",
                    "author": "Author Name 3",
                    "reasoning": "1-2 sentences explaining why it matches."
                },
                {
                    "title": "Book Title 4",
                    "author": "Author Name 4",
                    "reasoning": "1-2 sentences explaining why it matches."
                },
                {
                    "title": "Book Title 5",
                    "author": "Author Name 5",
                    "reasoning": "1-2 sentences explaining why it matches."
                }
            ]
        }
        `;

        const result = await model.generateContent(aiPrompt);
        let rawText = result.response.text().trim();
        rawText = rawText.replace(/```json|```/g, "").trim();

        console.log("CLEANED AI OUTPUT:", rawText);

        const aiJson = JSON.parse(rawText);
   
        const aiRecommendations = aiJson.recommendations;
     
        const bookDetailsPromises = aiRecommendations.map(book => 
            searchGoogleBooks(book.title, book.author)
        );

        const bookDetailsResults = await Promise.all(bookDetailsPromises);

        const finalResults = bookDetailsResults.map((bookDetails, index) => {

            if (!bookDetails) {
                return null;
            }

            return {
                ...bookDetails,
                reasoning: aiRecommendations[index].reasoning 
            };
        }).filter(book => book !== null); 
        res.json(finalResults);

    } catch (error) {
        console.error("AI or Book API Error:", error);
        res.status(500).send('Error generating recommendation');
    }
});

module.exports = router;