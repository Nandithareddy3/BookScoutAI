import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
function Profile() {
  const { token, userName } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
         setFavorites([]);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Matches backend
        });

        setFavorites(res.data);
      } catch (err) {
      console.error("Error fetching favorites:", err.response?.data || err);
      setError(null);   
      setFavorites([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (isLoading) return <div className="text-center mt-20 text-xl">Loading...</div>;

  if (error) return <div className="text-center mt-20 text-xl text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, <span className="text-blue-400">{userName}</span> 👋
      </h1>

      <h2 className="text-2xl font-semibold mb-4">Your Favorite Books</h2>

      {favorites.length === 0 ? (
        <p className="text-zinc-400">You haven't saved any favorites yet.</p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((book) => (
            // 2. Wrap the card in a Link component
            <Link 
              to={`/book/${book.bookId}`} 
              key={book.bookId} 
              className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow"
            >
              <img
                src={book.thumbnail || 'https://via.placeholder.com/150x220?text=No+Image'}
                alt={`Cover of ${book.title}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                <p className="text-zinc-400 text-sm mb-4 flex-grow">
                  {book.author || 'Unknown Author'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;