import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/refined-auth.css';
import { useAuth } from '../context/AuthContext';

const RUNNING_LEVELS = [
    { value: 0, label: 'Novice', color: '#22d3ee' },
    { value: 25, label: 'Casual', color: '#facc15' },
    { value: 50, label: 'Active', color: '#fb923c' },
    { value: 75, label: 'Advanced', color: '#a855f7' },
    { value: 100, label: 'Elite', color: '#ec4899' }
];

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        levelValue: 50 // Slider value 0-100
    });
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e) => {
        setFormData({ ...formData, levelValue: Number(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signup(formData.email, password, formData.name);
            navigate('/');
        } catch (err) {
            setError('Failed: ' + err.message);
        }
        setLoading(false);
    };

    // Find closest level for styling
    const getActiveLevelIndex = (val) => {
        if (val < 12.5) return 0;
        if (val < 37.5) return 1;
        if (val < 62.5) return 2;
        if (val < 87.5) return 3;
        return 4;
    };
    const activeIndex = getActiveLevelIndex(formData.levelValue);

    return (
        <div className="auth-page-container">
            {/* SIDEBAR */}
            <aside className="auth-sidebar">
                <div className="auth-brand-tag">LATIN RUN CLUB</div>
                <div className="sidebar-content">
                    <h1 className="hero-title">
                        JOIN<br />THE
                    </h1>
                </div>
                <div className="hero-footer">
                    VELOCITY • CULTURE • COMMUNITY
                </div>
            </aside>

            {/* FORM AREA */}
            <main className="auth-form-container">
                <header className="form-header">
                    <span className="subtitle">ATHLETE PROFILE</span>
                    <h2 className="main-title">
                        Define your pace.<br />
                        Claim your spot in the pack.
                    </h2>
                </header>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>FULL NAME</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="input-row">
                        <div className="form-group">
                            <label>EMAIL ADDRESS</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@domain.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>LOCATION / CITY</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Mexico City"
                            />
                        </div>
                    </div>

                    {/* Hidden Password for functional Auth */}
                    <div className="form-group" style={{ display: password ? 'flex' : 'none' }}>
                        {/* We hide it or show it depending on user flow, but for now lets keep it visible or add it as a required field that looks like the others if user forgot */}
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    {/* Add password field properly since it's required for firebase */}
                    <div className="form-group">
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* SLIDER */}
                    <div className="level-selector">
                        <div className="level-header">
                            <span className="level-title">RUNNING LEVEL</span>
                            <span className="pro-badge">PRO STATUS</span>
                        </div>

                        <div className="slider-wrapper">
                            {/* Visual Track */}
                            <div className="visual-track">
                                {/* Thumb */}
                                <div
                                    className="visual-thumb"
                                    style={{ left: `${formData.levelValue}%` }}
                                ></div>
                            </div>

                            {/* Input */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.levelValue}
                                onChange={handleSliderChange}
                                className="real-slider"
                            />

                            {/* Labels */}
                            <div className="slider-labels">
                                {RUNNING_LEVELS.map((lvl, index) => (
                                    <div
                                        key={lvl.value}
                                        className={`slider-label-item ${index === activeIndex ? 'active' : ''}`}
                                        style={{ flex: 1 }}
                                    >
                                        <div
                                            className="slider-dot"
                                            style={{ backgroundColor: lvl.color }}
                                        ></div>
                                        <span className="slider-text">{lvl.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        CREATE PROFILE <span style={{ marginLeft: '10px' }}>→</span>
                    </button>

                    <p className="legal-text">
                        BY JOINING, YOU REPRESENT THE SPIRIT OF THE LATIN RUN CLUB COMMUNITY.
                    </p>
                </form>
            </main>
        </div>
    );
}
