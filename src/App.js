import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Use Link instead of useNavigate
import { PackageProvider } from './context/PackageContext';
import PackageSelector from './components/PackageSelector';
import ScheduleCalendar from './components/ScheduleCalendar';
import SignInPage from './components/SignInPage';
import SignupPage from './components/SignupPage'; // Import the SignupPage component
import './styles/App.css';
import { Car } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state
  const [isSignUpMode, setIsSignUpMode] = useState(true); // Track button mode (Sign Up or Sign In)

  const handleToggleAuth = () => {
    setIsSignUpMode(!isSignUpMode); // Toggle button state
  };

  return (
    <Router>
      <PackageProvider>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          {/* Header */}
          <header className="bg-blue-600 text-white py-6 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8" />
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
                  onClick={() => setIsAuthenticated(false)} // Log out
                  className="bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-100"
                >
                  Sign Out
                </button>
              )}
            </div>
          </header>

          {/* Hero Section */}
          <section className="bg-blue-100 py-12">
            <div className="container mx-auto text-center space-y-4">
              <h2 className="text-4xl font-bold text-blue-800">Schedule Your Car Wash Effortlessly</h2>
              <p className="text-lg text-blue-600">
                Choose a package and pick convenient dates for your car wash with ease.
              </p>
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg shadow hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto py-12 space-y-12">
            <Routes>
              <Route path="/signin" element={<SignInPage onSignIn={() => setIsAuthenticated(true)} />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Your Package</h2>
                        <PackageSelector />
                      </section>

                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Schedule Your Washes</h2>
                        <ScheduleCalendar />
                      </section>
                    </>
                  ) : (
                    <SignInPage onSignIn={() => setIsAuthenticated(true)} />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Your Package</h2>
                        <PackageSelector />
                      </section>

                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Schedule Your Washes</h2>
                        <ScheduleCalendar />
                      </section>
                    </>
                  ) : (
                    <SignInPage onSignIn={() => setIsAuthenticated(true)} />
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