import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './admin.css'; // We'll create this

export default function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signin');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">LRC Admin</div>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-link">Dashboard</Link>
                    <Link to="/admin/testimonials" className="admin-link">Testimonials</Link>
                    <Link to="/admin/events" className="admin-link">Events</Link>
                    {/* Add more links here later */}
                </nav>
                <button onClick={handleLogout} className="admin-logout">Log Out</button>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
