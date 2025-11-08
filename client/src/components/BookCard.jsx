import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

function BookCard({ book }) {
  const { token, isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState(null);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to save favorites.');
      return;
    }
    setError(null);

    try {
      await axios.post(
        'http://localhost:5000/api/favorites/add',
        {
          bookId: book.bookId,
          title: book.title,
          author: book.author,
          thumbnail: book.thumbnail,
        },
        {
             headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorited(true); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Could not add to favorites.');
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* 2. Wrap the image and top part of the card in a Link */}
      <Link to={`/book/${book.bookId}`} className="flex flex-col flex-grow">
        <img
          src={book.thumbnail || 'https://via.placeholder.com/150x220?text=No+Image'}
          alt={`Cover of ${book.title}`}
          className="w-full h-64 object-cover"
        />
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2">{book.title}</h3>
          <p className="text-zinc-400 text-sm mb-3">{book.author || 'Unknown Author'}</p>
          
          {/* AI Reasoning (if it exists) */}
          {book.reasoning && (
            <p className="text-sm text-blue-300 bg-blue-900/50 p-3 rounded-md mb-4 italic">
              "{book.reasoning}"
            </p>
          )}

          <p className="text-zinc-300 text-sm mb-4 flex-grow line-clamp-4">
            {book.description || 'No description available.'}
          </p>
        </div>
      </Link>
      
      {/* 3. Keep the "Favorite" button and error outside the Link */}
      <div className="p-5 pt-0">
        {/* Error message (e.g., "Must be logged in") */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isFavorited}
          className={`w-full mt-auto px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
            ${isFavorited
              ? 'bg-pink-700 text-white cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
        >
          <Heart size={18} fill={isFavorited ? 'white' : 'none'} />
          {isFavorited ? 'Saved!' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}
export default BookCard;