// frontend/src/router.jsx

import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
// 1. Import the new page component
import BookDetailPage from './pages/BookDetailPage.jsx'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      
      // 2. Add the new dynamic route. :bookId is a URL parameter
      { path: '/book/:bookId', element: <BookDetailPage /> }, 

      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/profile', element: <Profile /> },
        ]
      },
    ],
  },
]);

export default router;