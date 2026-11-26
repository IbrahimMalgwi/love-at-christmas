import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('react-router-dom', () => ({
    Navigate: ({ to }) => to,
    Link: ({ children }) => children,
    useLocation: () => ({ pathname: '/register' })
}), { virtual: true });

test('denies access to a signed-in account without the admin claim', () => {
    useAuth.mockReturnValue({ user: { uid: 'member' }, admin: false, loading: false });
    render(<ProtectedRoute><div>Admin data</div></ProtectedRoute>);
    expect(screen.getByText('Access Denied')).toBeTruthy();
    expect(screen.queryByText('Admin data')).toBeNull();
});

test('shows the admin page for a signed-in administrator', () => {
    useAuth.mockReturnValue({ user: { uid: 'admin' }, admin: true, loading: false });
    render(<ProtectedRoute><div>Admin data</div></ProtectedRoute>);
    expect(screen.getByText('Admin data')).toBeTruthy();
});

test('redirects signed-out visitors to sign-in', () => {
    useAuth.mockReturnValue({ user: null, admin: false, loading: false });
    render(<ProtectedRoute requireAdmin={false}><div>Registration</div></ProtectedRoute>);
    expect(screen.getByText('/login')).toBeTruthy();
    expect(screen.queryByText('Registration')).toBeNull();
});

test('allows an ordinary signed-in user to access registration', () => {
    useAuth.mockReturnValue({ user: { uid: 'member' }, admin: false, loading: false });
    render(<ProtectedRoute requireAdmin={false}><div>Registration</div></ProtectedRoute>);
    expect(screen.getByText('Registration')).toBeTruthy();
});
