import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [signOutFailed, setSignOutFailed] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    async function signOut() {
        setSignOutFailed(false);
        try {
            await logout();
        } catch {
            setSignOutFailed(true);
        }
    }

    return (
        <header className="site-header">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <div className="site-wrap header-layout">
                <Link to="/" className="brand" onClick={closeMenu}>
                    <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" width="44" height="44" />
                    <span>Love at Christmas<small>Foursquare Gospel Church Sabo</small></span>
                </Link>
                <nav id="site-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
                    <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                    <NavLink to="/gallery" onClick={closeMenu}>Gallery</NavLink>
                    <NavLink to="/faq" onClick={closeMenu}>FAQ</NavLink>
                    <NavLink to="/donate" onClick={closeMenu}>Donate</NavLink>
                    {user && <>
                        <NavLink to="/register" onClick={closeMenu}>Registration</NavLink>
                        <NavLink to={isAdmin ? '/admin/dashboard' : '/dashboard'} onClick={closeMenu}>Dashboard</NavLink>
                    </>}
                </nav>
                <div className="header-actions">
                    {user ? <button className="button button-outline" type="button" onClick={signOut}>Sign out</button>
                        : <Link className="button" to="/login" onClick={closeMenu}>Sign in</Link>}
                    <button className="menu-toggle button button-outline" type="button" aria-expanded={menuOpen}
                        aria-controls="site-navigation" onClick={() => setMenuOpen(current => !current)}>
                        {menuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
                {signOutFailed && <p role="alert">Could not sign out. Try again.</p>}
            </div>
        </header>
    );
}
