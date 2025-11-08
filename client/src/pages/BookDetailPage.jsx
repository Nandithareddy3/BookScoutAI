
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react'; // For star ratings

// --- 1. Star Rating Component (Helper) ---
function StarRating({ rating }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={20}
          className={i < rating ? 'text-yellow-400' : 'text-gray-600'}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

function BookDetailPage() {
  const { bookId } = useParams(); 
  const { isAuthenticated, token } = useAuth();

  const [bookDetails, setBookDetails] = useState(null);

  const [reviews, setReviews] = useState([]);
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // Fetch all data when the page loads (or bookId changes)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- Fetch 1: Book Details from Google Books ---
        const detailsPromise = axios.get(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        
        // --- Fetch 2: Reviews from our Backend ---
        const reviewsPromise = axios.get(
          `http://localhost:5000/api/reviews/${bookId}`
        );

        // Wait for both requests to finish
        const [detailsRes, reviewsRes] = await Promise.all([
          detailsPromise,
          reviewsPromise,
        ]);

        setBookDetails(detailsRes.data.volumeInfo);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Could not load book details or reviews.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  // --- 3. Handle Review Form Submission ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    try {
      // Send the new review to our backend
      const res = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          bookId: bookId,
          rating: newRating,
          comment: newComment,
        },
        {
          headers: { 'x-auth-token': token }, // Authenticate the request
        }
      );

      // Add new review to the top of the list
      setReviews([res.data, ...reviews]);
      setReviewSuccess('Your review has been posted!');
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error('Error posting review:', err);
      setReviewError(err.response?.data?.msg || 'Failed to post review.');
    }
  };

  // --- 4. Render Logic ---
  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error || !bookDetails) {
    return <div className="text-center mt-20 text-red-500">{error || 'Book not found.'}</div>;
  }

  return (
    <div className="container mx-auto p-8">

      <div className="flex flex-col md:flex-row gap-8 mb-12">
       <img
        src={bookDetails.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220?text=No+Image'}
        alt={`Cover of ${bookDetails.title}`}
        className="w-2/3 mx-auto md:w-1/3 lg:w-1/4 h-auto object-contain rounded-lg shadow-lg"
      />
        
        {/* --- Text Details --- */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{bookDetails.title}</h1>
          <h2 className="text-2xl text-zinc-400 mb-4">
            by {bookDetails.authors?.join(', ') || 'Unknown Author'}
          </h2>
          <p className="text-zinc-300 mb-4">
            Published: {bookDetails.publishedDate || 'N/A'}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Summary</h3>
          <div 
            className="text-zinc-300 prose prose-invert max-w-none max-h-80 overflow-y-auto pr-4"
            dangerouslySetInnerHTML={{ __html: bookDetails.description }}
          />
        </div>
      </div>

      <hr className="border-zinc-700 mb-12" />

      {/* --- Reviews Section --- */}
      {/* Increased the gap for better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
        
        {/* --- Column 1: Write a Review --- */}
        {/*
          * NEW: Added 'md:sticky' and 'md:top-24'
          * This makes the review form stick to the top (with 6rem padding)
          * as you scroll, but only on medium screens and up.
        */}
        <div className="md:col-span-1 md:sticky md:top-24 h-fit">
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-700">
              {reviewError && <p className="text-red-500 mb-4">{reviewError}</p>}
              {reviewSuccess && (
                <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-center">
                  {reviewSuccess}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-zinc-300 mb-2">Your Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full p-2 bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐</option>
                  <option value={4}>⭐⭐⭐⭐</option>
                  <option value={3}>⭐⭐⭐</option>
                  <option value={2}>⭐⭐</option>
                  <option value={1}>⭐</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-zinc-300 mb-2">Your Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-2 bg-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you think of the book?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-lg text-center">
              <p className="text-zinc-400">
                <Link to="/login" className="text-blue-400 hover:underline">Log in</Link> to leave a review.
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-zinc-400">Be the first to review this book!</p>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
          
                <div key={review._id} className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 overflow-hidden transition-all duration-300 hover:shadow-blue-500/20 hover:scale-[1.02]">
                  <div className="bg-zinc-700 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{review.userName}</h3>
                    <StarRating rating={review.rating} />
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-400 text-sm mb-4">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
        
                    <p className="text-zinc-200 text-base italic border-l-4 border-blue-400 pl-4">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default BookDetailPage;