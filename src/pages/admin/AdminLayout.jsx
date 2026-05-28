import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

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
                    <NavLink to="/admin" end className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}>Dashboard</NavLink>
                    <NavLink to="/admin/races" className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}>Races</NavLink>
                    <NavLink to="/admin/attendance" className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}>Attendance</NavLink>
                    <NavLink to="/admin/events" className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}>Events</NavLink>
                    <NavLink to="/admin/testimonials" className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}>Testimonials</NavLink>
                </nav>
                <button onClick={handleLogout} className="admin-logout">Log Out</button>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
