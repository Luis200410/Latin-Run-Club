import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/join.css';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const STATIC_TESTIMONIALS = [
    {
        id: 1,
        quote: "Running with the club transformed my city from a map of streets to a web of connections.",
        name: "Elena",
        location: "Mexico City",
        color: "pink",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClbUKIE_9Y6iNu7E2xoqjWtOqEYmUbqeN_GMOCOqPqeLgl9hihlIIJV4xWYq_4raCfsRE0aOG-BpKdzFKwc4UyIM_ZhTugt1L6iJM02ciedhms99ba0t3nnV0x9ppHEgQiT_RvplOsrjziC6v-2uLK6XU6NtknUSwEkx3V3R0eBavTsSEORXth3pi23fRSN8zAXnsXAixGf0pJAz3VwmhSNswUgLT1AiEMlmDC2m2NzG_txAUk7BeJ_G-vG3pAg2MNt6mVsxb3xdw"
    },
    {
        id: 2,
        quote: "It's about visibility. We take up space, we breathe the same air, we claim our right to the pavement.",
        name: "Mateo",
        location: "Bogotá",
        color: "teal",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaKr-ZnphiKChOgga515YzTH76EZC-umEVSAj9rmHdJ8P_63hnOLXdIQZee7eZFkzS4pyZ0VItxfcfx_uk6QjOMKNtK-2q8bJzvaTtj9JBq0Z3VR6kxHEv3pehThZqyMv10-PTk2jg73vAs7M6fFTbalAHdbGCVFZ8kXnx8gtoZdezf7Zu_LxxcykslH0xBajzOP1uIlomBIn49pj37ZVhuyHNOV2uS9AsRUssQxWn12lw9Z7I8Dl_KqnWiyS1j8XXHPSOoFjlS-g"
    },
    {
        id: 3,
        quote: "Every Tuesday night feels like a celebration of where we come from and where we are going.",
        name: "Sofia",
        location: "Miami",
        color: "purple",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClbUKIE_9Y6iNu7E2xoqjWtOqEYmUbqeN_GMOCOqPqeLgl9hihlIIJV4xWYq_4raCfsRE0aOG-BpKdzFKwc4UyIM_ZhTugt1L6iJM02ciedhms99ba0t3nnV0x9ppHEgQiT_RvplOsrjziC6v-2uLK6XU6NtknUSwEkx3V3R0eBavTsSEORXth3pi23fRSN8zAXnsXAixGf0pJAz3VwmhSNswUgLT1AiEMlmDC2m2NzG_txAUk7BeJ_G-vG3pAg2MNt6mVsxb3xdw"
    },
    {
        id: 4,
        quote: "Finding my pace was easy; finding my people was the real victory.",
        name: "Carlos",
        location: "Lima",
        color: "orange",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaKr-ZnphiKChOgga515YzTH76EZC-umEVSAj9rmHdJ8P_63hnOLXdIQZee7eZFkzS4pyZ0VItxfcfx_uk6QjOMKNtK-2q8bJzvaTtj9JBq0Z3VR6kxHEv3pehThZqyMv10-PTk2jg73vAs7M6fFTbalAHdbGCVFZ8kXnx8gtoZdezf7Zu_LxxcykslH0xBajzOP1uIlomBIn49pj37ZVhuyHNOV2uS9AsRUssQxWn12lw9Z7I8Dl_KqnWiyS1j8XXHPSOoFjlS-g"
    }
];

function TestimonialMarquee({ items }) {
    return (
        <div className="process-wrapper">
            <div className="marquee">
                <div className="marquee-content">
                    {[...items, ...items].map((item, index) => (
                        <div key={`${item.id}-${index}`} className="testimonial-card">
                            <div className="editorial-img-container mb-8 grainy-filter">
                                <img alt="Member Portrait" className="testimonial-img" src={item.img} />
                            </div>
                            <p className="testimonial-quote">"{item.quote}"</p>
                            <div className="testimonial-author">
                                <div className={`author-bar bg-${item.color}`}></div>
                                <span className={`author-name text-${item.color}`}>{item.name} • {item.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default function Join() {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();
    // Initialize with static data, update with Firestore data if available
    const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);
    const [newsletterEmail, setNewsletterEmail] = useState('');

    // Fetch testimonials from Firestore
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "testimonials"));
                const fetchedData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                if (fetchedData.length > 0) {
                    setTestimonials(fetchedData);
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error);
                // Fallback is already set
            }
        };

        fetchTestimonials();
    }, []);
    const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, message: '', type: '' });

    const handleGoogleSignUp = async () => {
        try {
            await googleSignIn();
            navigate('/'); // Redirect to home/dashboard after sign up
        } catch (error) {
            console.error("Google Sign Up Error:", error);
        }
    };

    const handleNewsletterSubscribe = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterStatus({ loading: true, message: '', type: '' });
        try {
            await addDoc(collection(db, 'newsletter'), {
                email: newsletterEmail,
                createdAt: serverTimestamp(),
                source: 'join_page'
            });
            setNewsletterStatus({ loading: false, message: 'Welcome to the pack!', type: 'success' });
            setNewsletterEmail('');
        } catch (error) {
            console.error("Newsletter Error:", error);
            setNewsletterStatus({ loading: false, message: 'Something went wrong.', type: 'error' });
        }
    };

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="join-page-container">
            {/* Header / Hero */}
            <header className="join-header">
                <div className="max-w-7xl">
                    <h1 className="join-title">
                        Join the<br />Movement
                    </h1>
                    <div className="join-header-grid">
                        <p className="join-lead">
                            We are more than a club. We are a cultural engine fueled by sweat, heritage, and the collective heartbeat of our community.
                        </p>
                        <div className="editorial-img-container grainy-filter">
                            <img alt="Runner in motion" className="editorial-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaKr-ZnphiKChOgga515YzTH76EZC-umEVSAj9rmHdJ8P_63hnOLXdIQZee7eZFkzS4pyZ0VItxfcfx_uk6QjOMKNtK-2q8bJzvaTtj9JBq0Z3VR6kxHEv3pehThZqyMv10-PTk2jg73vAs7M6fFTbalAHdbGCVFZ8kXnx8gtoZdezf7Zu_LxxcykslH0xBajzOP1uIlomBIn49pj37ZVhuyHNOV2uS9AsRUssQxWn12lw9Z7I8Dl_KqnWiyS1j8XXHPSOoFjlS-g" />
                            <div className="img-tag">
                                <span>Find your pace</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Values Section */}
            <section className="values-section">
                <div className="max-w-7xl">
                    <div className="mb-24">
                        <h2 className="section-label text-teal">Our Values</h2>
                        <div className="bar-separator bg-teal"></div>
                    </div>
                    <div className="values-grid">
                        <div className="reveal-on-scroll">
                            <div className="value-bar bg-teal"></div>
                            <h3 className="value-title">Comunidad</h3>
                            <p className="value-desc font-serif-italic">
                                No one runs alone. We build bridges between neighborhoods, generations, and skill levels.
                            </p>
                        </div>
                        <div className="reveal-on-scroll">
                            <div className="value-bar bg-orange"></div>
                            <h3 className="value-title">Cultura</h3>
                            <p className="value-desc">
                                Every step honors those who came before us. We carry our heritage in our stride and our music in our ears.
                            </p>
                        </div>
                        <div className="reveal-on-scroll">
                            <div className="value-bar bg-purple"></div>
                            <h3 className="value-title">Resiliencia</h3>
                            <p className="value-desc font-serif-italic">
                                The finish line is just the beginning. We find strength in the struggle and joy in the endurance.
                            </p>
                        </div>
                        <div className="reveal-on-scroll">
                            <div className="value-bar bg-olive"></div>
                            <h3 className="value-title">Legado</h3>
                            <p className="value-desc">
                                We run for the future. Inspiring the next generation of Latin athletes to take up space and break records.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="max-w-7xl">
                    <div className="testimonials-header">
                        <h2 className="section-label text-orange" style={{ marginBottom: '1rem' }}>Voice of the Community</h2>
                        <p className="testimonials-title">Why We Run</p>
                    </div>
                </div>
                <TestimonialMarquee items={testimonials} />
            </section>

            {/* CTAs */}
            <section className="cta-section">
                <div className="max-w-7xl">
                    <div className="cta-grid">
                        {/* New Members */}
                        <div className="cta-card">
                            <div className="space-y-6">
                                <span className="cta-label text-teal">New Members</span>
                                <h4 className="cta-title">Register</h4>
                                <p className="cta-desc">Join our official roster for access to training plans and exclusive events.</p>
                            </div>
                            <Link to="/signup" className="cta-button btn-outline">
                                Get Started
                            </Link>
                        </div>

                        {/* Already Running */}
                        <div className="cta-card">
                            <div className="space-y-6">
                                <span className="cta-label text-purple">Already Running</span>
                                <h4 className="cta-title">Log In</h4>
                                <p className="cta-desc">Access your dashboard, check your stats, and connect with your local chapter.</p>
                            </div>
                            <Link to="/signin" className="cta-button btn-outline">
                                Member Portal
                            </Link>
                        </div>

                        {/* Newsletter */}
                        <div className="cta-card">
                            <div className="space-y-6 w-full">
                                <span className="cta-label text-pink">Stay Connected</span>
                                <h4 className="cta-title">Newsletter</h4>
                                <p className="cta-desc">Manifesto updates, route drops, and community stories delivered weekly.</p>
                                <form className="newsletter-form" onSubmit={handleNewsletterSubscribe}>
                                    <div className="newsletter-input-group">
                                        <input
                                            className="newsletter-input"
                                            placeholder="EMAIL ADDRESS"
                                            type="email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            required
                                        />
                                        <button className="newsletter-submit" type="submit" disabled={newsletterStatus.loading}>
                                            <span className="material-symbols-outlined font-bold">north_east</span>
                                        </button>
                                    </div>
                                    {newsletterStatus.message && (
                                        <p style={{ color: newsletterStatus.type === 'success' ? '#DB2777' : 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                            {newsletterStatus.message}
                                        </p>
                                    )}
                                </form>
                                <div className="w-full">
                                    <div className="or-divider">
                                        <div className="divider-line"></div>
                                        <span className="divider-text">Or</span>
                                        <div className="divider-line"></div>
                                    </div>
                                    <button className="google-signup-btn group" type="button" onClick={handleGoogleSignUp}>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                                            <path className="group-hover:fill-white text-purple" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                                            <path className="group-hover:fill-white text-teal" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                                            <path className="group-hover:fill-white text-orange" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                                            <path className="group-hover:fill-white text-pink" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                                        </svg>
                                        <span className="google-signup-text">Sign up with Google</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Hero */}
            <section className="final-hero">
                <div className="overlay-color"></div>
                <img alt="Night run" className="final-hero-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClbUKIE_9Y6iNu7E2xoqjWtOqEYmUbqeN_GMOCOqPqeLgl9hihlIIJV4xWYq_4raCfsRE0aOG-BpKdzFKwc4UyIM_ZhTugt1L6iJM02ciedhms99ba0t3nnV0x9ppHEgQiT_RvplOsrjziC6v-2uLK6XU6NtknUSwEkx3V3R0eBavTsSEORXth3pi23fRSN8zAXnsXAixGf0pJAz3VwmhSNswUgLT1AiEMlmDC2m2NzG_txAUk7BeJ_G-vG3pAg2MNt6mVsxb3xdw" />
                <div className="final-hero-content">
                    <h2 className="final-hero-title">
                        Your journey<br />starts here.
                    </h2>
                    <div className="final-bar"></div>
                </div>
            </section>
        </div>
    );
}
