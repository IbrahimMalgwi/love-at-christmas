import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import FormInput from '../../components/forms/FormInput';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { login, user, isAdmin, loading } = useAuth();
    const { state } = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (user && !loading) {
        const requestedPath = state?.from;
        const destination = requestedPath === '/register' || (isAdmin && requestedPath === '/admin/gallery')
            ? requestedPath : '/dashboard';
        return <Navigate to={destination} replace />;
    }

    async function submit(event) {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setError('');
        try {
            await login(email.trim(), password);
        } catch (failure) {
            setError(failure.code ? 'Could not sign in. Check your email and password and try again.' : failure.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="portal-sign-in">
            <div className="surface campaign-editor">
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" width="56" height="56" />
                <h1>Sign in to Love at Christmas</h1>
                <p>Use your account to access registration and the dashboard.</p>
                <form onSubmit={submit}>
                    <FormInput id="email" label="Email address" name="email" type="email" autoComplete="username"
                        value={email} onChange={event => setEmail(event.target.value)} required />
                    <FormInput id="password" label="Password" name="password" type="password" autoComplete="current-password"
                        value={password} onChange={event => setPassword(event.target.value)} required />
                    {error && <p role="alert">{error}</p>}
                    <button className="button" disabled={submitting || loading}>{submitting || loading ? 'Signing in…' : 'Sign in'}</button>
                </form>
            </div>
        </main>
    );
}
