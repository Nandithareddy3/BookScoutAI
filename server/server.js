
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); 
    }
};

connectDB();


app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', require('./routes/auth')); 
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/search', require('./routes/search'));
app.get('/', (req, res) => res.send('Server Running'));


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});