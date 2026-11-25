import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { isAdmin, logout } = useAuth();
    const close = () => setOpen(false);

    return (
        <header className="site-header">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <div className="site-wrap header-layout">
                <Link to="/" className="brand" onClick={close}>
                    <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Foursquare Gospel Church" width="44" height="44" />
                    <span>Love at Christmas<small>Foursquare Gospel Church Sabo</small></span>
                </Link>
                <button className="menu-toggle button button-outline" type="button" aria-expanded={open}
                    aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
                <nav id="site-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
                    <NavLink to="/" end onClick={close}>Home</NavLink>
                    <NavLink to="/register" onClick={close}>Register</NavLink>
                    <NavLink to="/gallery" onClick={close}>Gallery</NavLink>
                    <NavLink to="/faq" onClick={close}>FAQ</NavLink>
                    {isAdmin && <>
                        <NavLink to="/items" onClick={close}>Items needed</NavLink>
                        <NavLink to="/admin/dashboard" onClick={close}>Dashboard</NavLink>
                        <button type="button" onClick={() => logout().catch(console.error)}>Sign out</button>
                    </>}
                    <NavLink to="/donate" className="button" onClick={close}>Donate</NavLink>
                </nav>
            </div>
        </header>
    );
}
