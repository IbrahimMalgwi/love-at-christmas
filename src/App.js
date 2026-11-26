import React from 'react';
import { BrowserRouter as Router, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import FAQPage from './pages/FAQPage';
import DonationPage from './pages/DonationPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import GalleryManager from './pages/admin/GalleryManager';

function SiteLayout({ showFooter = false }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow site-main" id="main-content" tabIndex={-1}>
                <Outlet />
            </main>
            {showFooter && <Footer />}
        </div>
    );
}

function Dashboard() {
    const { isAdmin } = useAuth();
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

    return (
        <section className="site-wrap section-spacing">
            <header className="page-heading">
                <p className="eyebrow">Love at Christmas</p>
                <h1>Dashboard</h1>
                <p>Register a participant or sign up as a volunteer when registration is open.</p>
            </header>
            <Link className="button" to="/register">Open registration</Link>
        </section>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                    <Route element={<SiteLayout showFooter />}>
                        <Route index element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/donate" element={<DonationPage />} />
                    </Route>
                    <Route element={<ProtectedRoute requireAdmin={false}><SiteLayout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/gallery" element={<ProtectedRoute><GalleryManager /></ProtectedRoute>} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
