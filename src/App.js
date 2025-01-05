import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { PackageProvider } from './context/PackageContext';
import PackageSelector from './components/PackageSelector';
import ScheduleCalendar from './components/ScheduleCalendar';
import SignInPage from './components/SignInPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/DashboardPage'; // New Dashboard component
import './styles/App.css';
import { Car } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(true);

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleToggleAuth = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleUserAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <PackageProvider>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          {/* Header */}
          <header className="bg-blue-600 text-white py-6 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold">Car Wash Scheduler</h1>
              </div>
              {!isAuthenticated ? (
                <Link
                  to={isSignUpMode ? '/signup' : '/signin'}
                  onClick={handleToggleAuth}
                  className="bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-100"
                >
                  {isSignUpMode ? 'Sign Up' : 'Sign In'}
                </Link>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-100"
                >
                  Sign Out
                </button>
              )}
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left md:w-1/2 space-y-6">
                <h2 className="text-5xl font-extrabold">
                  Schedule Your Car Wash <br /> With Ease
                </h2>
                <p className="text-lg">
                  Choose your package, pick a date, and let us handle the rest. Effortless car wash scheduling for a busy life.
                </p>
                <p></p>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-200"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
                <img
                  src="/Logo.png"
                  alt="Car Wash Illustration"
                  className="w-3/4 md:w-full max-w-md"
                />
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto py-12 space-y-12">
            <Routes>
              {/* Redirect to SignInPage */}
              <Route
                path="/"
                element={<SignInPage onSignIn={handleUserAuthenticated} />} // Always show SignInPage
              />

              {/* Sign In Route */}
              <Route
                path="/signin"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" /> // Redirect to dashboard if already signed in
                  ) : (
                    <SignInPage onSignIn={handleUserAuthenticated} />
                  )
                }
              />

              {/* Sign Up Route */}
              <Route
                path="/signup"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" /> // Redirect to dashboard if already signed in
                  ) : (
                    <SignupPage />
                  )
                }
              />

              {/* Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard /> // Dashboard component for authenticated users
                  ) : (
                    <Navigate to="/signin" /> // Redirect to sign in if not authenticated
                  )
                }
              />

              {/* Home Route (Authenticated User Only) */}
              <Route
                path="/schedule"
                element={
                  isAuthenticated ? (
                    <>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Select Your Package
                        </h2>
                        <PackageSelector />
                      </section>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Schedule Your Washes
                        </h2>
                        <ScheduleCalendar />
                      </section>
                    </>
                  ) : (
                    <Navigate to="/signin" /> // Redirect to SignInPage if not authenticated
                  )
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-blue-600 text-white py-6">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Car Wash Scheduler. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </PackageProvider>
    </Router>
  );
}

export default App;