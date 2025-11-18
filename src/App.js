import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { NotificationProvider } from './hooks/useNotifications'
import Layout from './components/layout/Layout'
import SupportChat from './components/chat/SupportChat'
import NotificationToast from './components/notifications/NotificationToast'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import ItemsNeeded from './pages/ItemsNeeded'
import Register from './pages/Register'
import Gallery from './pages/Gallery'
import Donate from './pages/Donate'
import FAQ from './pages/FAQ'
import AdminDashboard from './pages/AdminDashboard'
import Events from './pages/Events'
import Profile from './pages/Profile'
import Auth from './pages/Auth'

function App() {
    return (
        <NotificationProvider>
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/items-needed" element={<ItemsNeeded />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/donate" element={<Donate />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>

                        {/* Global Components */}
                        <SupportChat />
                        <NotificationToast />
                    </Layout>
                </Router>
            </AuthProvider>
        </NotificationProvider>
    )
}

export default App
