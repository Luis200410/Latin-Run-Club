import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { language, toggleLanguage, t } = useLanguage();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', type: '' }); // type: 'success' | 'error'

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus({ loading: true, message: '', type: '' });

        try {
            await addDoc(collection(db, 'newsletter'), {
                email,
                createdAt: serverTimestamp(),
                lang: language
            });
            setStatus({ loading: false, message: language === 'es' ? '¡Gracias por suscribirte!' : 'Thanks for subscribing!', type: 'success' });
            setEmail('');
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus({ loading: false, message: language === 'es' ? 'Error. Intenta de nuevo.' : 'Error. Please try again.', type: 'error' });
        }
    };

    return (
        <footer className="new-footer">
            <div className="footer-container">
                {/* Left Column: Logo */}
                <div className="footer-column footer-logo-col">
                    <Link to="/">
                        <img
                            src="/src/images/logo.png"
                            alt="Latin Run Club Logo"
                            className="footer-logo"
                        />
                    </Link>
                </div>

                {/* Middle Column: Nav Links */}
                <div className="footer-column footer-links-col">
                    <ul className="footer-nav-links">
                        <li><Link to="/about">{t('about_us_clean')}</Link></li>
                        <li><Link to="/join">{t('become_member')}</Link></li>
                        <li><Link to="/join">{t('become_partner')}</Link></li>
                        <li><Link to="/join">{t('apply_leadership')}</Link></li>
                        <li><Link to="/">{t('join_next_run')}</Link></li>
                    </ul>
                </div>

                {/* Right Column: Cities & Newsletter/Socials */}
                <div className="footer-column footer-right-col">
                    <div className="footer-cities-and-sub">
                        <div className="footer-cities-list">
                            <ul className="footer-nav-links">
                                <li><Link to="/gallery">{t('nyc')}</Link></li>
                                <li><Link to="/gallery">{t('boston_clean')}</Link></li>
                                <li><Link to="/gallery">{t('atlanta_clean')}</Link></li>
                                <li><Link to="/gallery">{t('washington_clean')}</Link></li>
                                <li><Link to="/gallery">{t('london_clean')}</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-social-newsletter">
                            {/* Black container with social icons */}
                            <div className="footer-social-black-box">
                                <a href="https://wa.me/message/LRC" target="_blank" rel="noreferrer" className="social-icon-btn">
                                    <i className="fa-brands fa-whatsapp"></i>
                                </a>
                                <a href="https://instagram.com/latinrunclub" target="_blank" rel="noreferrer" className="social-icon-btn">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="https://www.strava.com/clubs/latin-run-club" target="_blank" rel="noreferrer" className="social-icon-btn">
                                    <i className="fa-brands fa-strava"></i>
                                </a>
                            </div>

                            {/* Newsletter Subscription */}
                            <div className="footer-newsletter-section">
                                <h3 className="footer-newsletter-title">{t('join_newsletter')}</h3>
                                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                                    <div className="footer-input-wrapper">
                                        <input
                                            type="email"
                                            placeholder={t('email_dots')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <button type="submit" disabled={status.loading} className="footer-arrow-btn">
                                            {status.loading ? '...' : (
                                                <span className="footer-arrow-symbol">&mdash;&mdash;&gt;</span>
                                            )}
                                        </button>
                                    </div>
                                    {status.message && (
                                        <p style={{
                                            color: status.type === 'success' ? '#4ade80' : '#f87171',
                                            fontSize: '0.8rem',
                                            marginTop: '0.5rem'
                                        }}>
                                            {status.message}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Copyright and Language Toggle */}
            <div className="footer-bottom-bar">
                <div className="footer-copyright">
                    {t('copyright')}
                </div>
                <div className="footer-lang-selector">
                    <span
                        onClick={() => toggleLanguage('en')}
                        className={`footer-lang-btn ${language === 'en' ? 'active' : ''}`}
                    >ENGLISH</span>
                    <span className="divider">/</span>
                    <span
                        onClick={() => toggleLanguage('es')}
                        className={`footer-lang-btn ${language === 'es' ? 'active' : ''}`}
                    >ESPAÑOL</span>
                </div>
            </div>
        </footer>
    );
}