import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/refined-auth.css';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to sign in: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page-container">
            {/* LEFT SIDEBAR */}
            <aside className="auth-sidebar" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
                <div className="auth-brand-tag">LATIN RUN CLUB</div>
                <div className="sidebar-content">
                    <h1 className="hero-title">
                        WELCOME<br />BACK
                    </h1>
                    <div className="hero-footer">
                        VELOCITY • CULTURE • COMMUNITY
                    </div>
                </div>
            </aside>

            {/* RIGHT FORM */}
            <main className="auth-form-container">
                <header className="form-header">
                    <span className="subtitle">MEMBER ACCESS</span>
                    <h2 className="main-title">
                        Lace up.<br />
                        Let's run.
                    </h2>
                </header>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@domain.com"
                            required
                        />
                    </div>

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

                    <button type="submit" className="submit-btn" disabled={loading} style={{ background: '#1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        LOG IN <span className="submit-arrow">→</span>
                    </button>

                    <p className="legal-text">
                        Don't have an account? <Link to="/signup" style={{ color: '#1a1a1a', fontWeight: 'bold' }}>Sign Up</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}
