// frontend/src/router.jsx

import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/book/:bookId', element: <BookDetailPage /> }, 
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