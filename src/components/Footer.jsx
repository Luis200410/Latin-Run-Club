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
        <footer>
            <div className="section-1">
                <div className="s1c1">
                    <div className="c1-top">
                        <h1>{t('start')}</h1>
                        <h1 className="red">{t('running')}</h1>
                        <p>{t('footer_text')}</p>
                    </div>
                    <div className="s1c2">
                        <form className="email" onSubmit={handleSubscribe}>
                            <input
                                id="email"
                                type="email"
                                placeholder={t('email_placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={status.loading}>
                                {status.loading ? '...' : t('subscribe')}
                            </button>
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
                <div className="s2c2">
                    <div className="colors">
                        <div className="city-1"></div>
                        <div className="city-2"></div>
                        <div className="city-3"></div>
                        <div className="city-4"></div>
                        <div className="city-5"></div>
                    </div>
                    <div className="social-container">
                        <ul className="social">
                            <li><a><i className="fa-brands fa-whatsapp"></i></a></li>
                            <li><a><i className="fa-brands fa-instagram"></i></a></li>
                            <li><a><i className="fa-brands fa-strava"></i></a></li>
                        </ul>
                    </div>
                    <div className="bottom">
                        <p>LATIN RUN CLUB</p>
                        <small>{t('based_in')}</small>
                        <small>{t('copyright')}</small>
                    </div>
                </div>
            </div>
            <div className="section-2">
                <div>
                    <ul className="inside-links">
                        <li><Link to="/about">{t('about_us')}</Link></li>
                        <li><Link to="/donate">{t('donate')}</Link></li>
                        <li><Link to="/terms">{t('terms')}</Link></li>
                    </ul>
                </div>
                <div className="translate">
                    <p>
                        <span
                            onClick={() => toggleLanguage('en')}
                            className={`lang-option ${language === 'en' ? 'active' : ''}`}
                        >ENGLISH</span>
                        {' / '}
                        <span
                            onClick={() => toggleLanguage('es')}
                            className={`lang-option ${language === 'es' ? 'active' : ''}`}
                        >ESPAÑOL</span>
                    </p>
                    <p><i className="fa-solid fa-globe"></i></p>
                </div>
            </div>
        </footer>

    )
}