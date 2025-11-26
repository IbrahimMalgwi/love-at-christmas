import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ItemsNeededPage from './pages/ItemsNeededPage';
import DonationPage from './pages/DonationPage';
import RegistrationPage from './pages/RegistrationPage';
import FAQPage from './pages/FAQPage';
import GalleryPage from './pages/GalleryPage'; // Add this import
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import GalleryManager from './pages/admin/GalleryManager'; // Add this import

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    {/* Don't show navbar on admin login page */}
                    <Routes>
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="*" element={
                            <>
                                <Navbar />
                                <main className="flex-grow">
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/items" element={<ItemsNeededPage />} />
                                        <Route path="/donate" element={<DonationPage />} />
                                        <Route path="/register" element={<RegistrationPage />} />
                                        <Route path="/faq" element={<FAQPage />} />
                                        <Route path="/gallery" element={<GalleryPage />} /> {/* Add this route */}
                                        <Route
                                            path="/admin/dashboard"
                                            element={
                                                <ProtectedRoute>
                                                    <AdminDashboard />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/admin/gallery"
                                            element={
                                                <ProtectedRoute>
                                                    <GalleryManager />
                                                </ProtectedRoute>
                                            }
                                        />
                                        {/* Redirect to home for unknown routes */}
                                        <Route path="*" element={<HomePage />} />
                                    </Routes>
                                </main>
                                <Footer />
                            </>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;