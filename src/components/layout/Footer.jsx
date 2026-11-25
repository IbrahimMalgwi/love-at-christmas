import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-wrap footer-layout">
                <div>
                    <Link to="/" className="brand">
                        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Foursquare Gospel Church" width="44" height="44" />
                        <span>Love at Christmas<small>Foursquare Gospel Church Sabo</small></span>
                    </Link>
                    <p>Sharing the love of Christ with families in our community.</p>
                </div>
                <nav aria-label="Footer navigation">
                    <h2>Explore</h2>
                    <Link to="/donate">Donate</Link><Link to="/register">Register</Link>
                    <Link to="/gallery">Gallery</Link><Link to="/faq">FAQ</Link>
                </nav>
                <address>
                    <h2>Contact</h2>
                    <a href="mailto:foursquaresabo@yahoo.com">foursquaresabo@yahoo.com</a>
                    <a href="tel:+2348032126739">+234 803 212 6739</a>
                    <a href="tel:+2348104657320">+234 81 0465 7320</a>
                    <p>32A Commercial Avenue Sabo Yaba, Lagos, Nigeria</p>
                </address>
            </div>
            <div className="site-wrap footer-bottom"><span>© {new Date().getFullYear()} Love at Christmas</span><Link to="/admin/login">Admin sign-in</Link></div>
        </footer>
    );
}
