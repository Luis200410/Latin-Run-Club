import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <header>
            <div className="logo-container">
                <Link to="/"><img src="/src/images/logo.png" alt="Latin Run Club Logo" className="logo" /></Link>
                <button className="burger-menu" onClick={toggleMenu}>
                    ☰
                </button>
            </div>
            <div className={`nav-container ${isOpen ? 'open' : ''}`}>
                <div className='btn-link'>
                    <ul className="list">
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                        <li><Link to="/join">Join</Link></li>
                    </ul>
                    {currentUser ? (
                        <button className="log" onClick={handleLogout}><i></i>Log Out</button>
                    ) : (
                        <Link to="/signin"><button className="log"><i></i>Sign In</button></Link>
                    )}
                </div>
            </div>

        </header>
    )
}