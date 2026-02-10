import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
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
                <ul className="list">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/events">Events</Link></li>
                    <li><Link to="/gallery">Gallery</Link></li>
                    <li><Link to="/join">Join</Link></li>
                </ul>
                <Link to="/signin"><button className="log"><i></i>Sign In</button></Link>
            </div>
        </header>
    )
}