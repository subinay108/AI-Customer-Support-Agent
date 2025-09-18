import { createBrowserRouter, redirect } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/Dashboard';
import HomePage from './pages/HomePage';

// Loader function to protect routes
const protectedLoader = async () => {
  const { user } = useAuthStore.getState();
  if (!user) {
    // If the user is not authenticated, redirect to the login page.
    return redirect('/login');
  }
  // Otherwise, allow the navigation.
  return null;
};

// Loader to redirect logged-in users away from the login page
const publicLoader = async () => {
  const { user } = useAuthStore.getState();
  if (user) {
    // If the user is already authenticated, redirect to the dashboard.
    return redirect('/dashboard');
  }
  // Otherwise, allow navigation to the login page.
  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    index: true,
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: publicLoader,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    loader: protectedLoader,
  },
]);

export default router;
