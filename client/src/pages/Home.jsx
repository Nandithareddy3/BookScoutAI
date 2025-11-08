
import React, { useState } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';

function Home() {
  const [searchMode, setSearchMode] = useState('ai');
  
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      let res;
      if (searchMode === 'ai') {
        res = await axios.post('http://localhost:5000/api/recommend', {
          userPrompt: prompt,
        });
      } else {
        res = await axios.post('http://localhost:5000/api/search', {
          query: prompt,
        });
      }
      setResults(res.data);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center mb-4">Find Your Next Read</h1>
        
        {/* --- NEW: TABS --- */}
        <div className="flex justify-center mb-4 rounded-lg bg-zinc-800 p-1 w-fit mx-auto">
          <button
            onClick={() => setSearchMode('ai')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors
              ${searchMode === 'ai' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}
            `}
          >
            AI Recommender
          </button>
          <button
            onClick={() => setSearchMode('title')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors
              ${searchMode === 'title' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}
            `}
          >
            Search by Title
          </button>
        </div>
        <p className="text-zinc-400 text-center mb-6">
          {searchMode === 'ai'
            ? 'Tell our AI what you\'re in the mood for.'
            : 'Enter a book title or author.'
          }
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              searchMode === 'ai' 
                ? 'e.g., A sci-fi mystery with a robot...'
                : 'e.g., Dune'
            }
            className="flex-grow px-4 py-3 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-zinc-500"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      <div>
        {isLoading && <p className="text-center">Getting results...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">
              {searchMode === 'ai' ? 'Our Top Picks For You' : 'Search Results'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((book) => (
                <BookCard key={book.bookId} book={book} />
              ))}
            </div>
          </div>
        )}
        {!isLoading && results.length === 0 && prompt.length > 0 && (
          <p className="text-center text-zinc-400">No books found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;