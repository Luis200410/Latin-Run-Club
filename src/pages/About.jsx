import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Founders from "../components/Founders";
import founders from '../info/founders.js';
import '../style/about.css';

export default function About() {

    useEffect(() => {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const founderList = founders.map((founder, index) => {
        return <Founders
            key={index}
            {...founder}
        />
    });

    return (
        <div className="about-page">

            {/* 1. Split Hero Section */}
            {/* 1. New Typographic Hero Section */}
            <section className="about-hero-section">
                <div className="max-w-7xl">
                    <div className="hero-title-container reveal-on-scroll">
                        <h1 className="hero-title-big">
                            OUR STORY<br />& HISTORY
                        </h1>
                    </div>
                    <div className="hero-intro-grid reveal-on-scroll">
                        <p className="hero-intro-text">
                            What started as a casual weekend run between friends has evolved into a movement of cultural identity, endurance, and community.
                        </p>
                        <div className="hero-established">
                            <div className="est-bar"></div>
                            <div className="est-content">
                                <span className="est-label">ESTABLISHED</span>
                                <span className="est-year">2018</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Evolution Timeline */}
            <section className="evolution-section">
                <div className="bg-text-layer">LEGACY</div>

                <div className="evolution-header reveal-on-scroll">
                    <span className="evolution-label">THE EVOLUTION</span>
                    <div className="hero-bar" style={{ margin: '0.5rem auto 0', width: '2rem' }}></div>
                </div>

                <div className="timeline-container">
                    <div className="timeline-line"></div>

                    {/* 2018 */}
                    <div className="timeline-item reveal-on-scroll">
                        <div className="timeline-content">
                            <h3 className="year-title" style={{ color: '#EF4444' }}>2018</h3>
                            <span className="year-subtitle">THE FIR<span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#333', borderRadius: '50%' }}></span> MILE</span>
                            <p className="year-desc">
                                A small group of five friends gathered in the local park. No branding, no timing, just the shared rhythm of feet hitting the pavement and the Spanish language bridging the gaps.
                            </p>
                        </div>
                        <div className="timeline-visual">
                            <img src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?q=80&w=2669&auto=format&fit=crop" alt="The First Mile" className="timeline-img" />
                        </div>
                    </div>

                    {/* 2020 */}
                    <div className="timeline-item reveal-on-scroll">
                        <div className="timeline-content">
                            <h3 className="year-title" style={{ color: '#3B82F6' }}>2020</h3>
                            <span className="year-subtitle">RESILI<span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#333', borderRadius: '50%' }}></span>NCE IN MOTION</span>
                            <p className="year-desc">
                                When the world slowed down, we picked up the pace. Virtual runs became our lifeline, keeping our community connected across borders during the most isolating times.
                            </p>
                        </div>
                        <div className="timeline-visual">
                            <img src="https://images.unsplash.com/photo-1552674605-469523170d9e?q=80&w=2680&auto=format&fit=crop" alt="Virtual Run Community" className="timeline-img" />
                        </div>
                    </div>

                    {/* 2023 */}
                    <div className="timeline-item reveal-on-scroll">
                        <div className="timeline-content">
                            <h3 className="year-title" style={{ color: '#10B981' }}>2023</h3>
                            <span className="year-subtitle">GLOBAL<span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#333', borderRadius: '50%' }}></span>EACH</span>
                            <p className="year-desc">
                                Expansion beyond our home city. Latin Run Club chapters began appearing in major hubs, proving that the desire for heritage-driven athleticism is universal.
                            </p>
                        </div>
                        <div className="timeline-visual">
                            <img src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=2670&auto=format&fit=crop" alt="Global Community" className="timeline-img" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Restored Founders Section with "We Believe" Text */}
            <section className="founders-list-section">
                <h2 className="founders-title-main reveal-on-scroll">The Founders</h2>

                <div className="founders-flex-connected reveal-on-scroll">
                    {founderList}
                </div>

                <div className="founders-belief-text reveal-on-scroll">
                    <h2>WE BELIEVE IN THE POWER OF SUPPORT, FRIENDSHIPS, AND VALUABLE EXPERIENCE.</h2>
                    <div className="banner-bar"></div>
                </div>
            </section>

            {/* 5. Mission & Vision */}
            <section className="mission-vision-section">
                <div className="max-w-7xl">
                    <div className="mission-grid">
                        <div className="mv-card reveal-on-scroll">
                            <span className="mv-label">OUR MISSION</span>
                            <p className="mv-text">
                                To create a safe, celebratory space for Latin athletes to connect,
                                reclaim their narrative, and run with pride in every city across the globe.
                            </p>
                        </div>
                        <div className="mv-card reveal-on-scroll" style={{ borderLeftColor: '#7C3AED' }}>
                            <span className="mv-label" style={{ color: '#7C3AED' }}>OUR VISION</span>
                            <p className="mv-text">
                                A world where our culture is not just seen at the finish line,
                                but is the driving force behind the starting gun. Limitless. Fearless. United.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA "Writes the Next Chapter" (Dark Mode) */}
            <section className="cta-next-chapter">
                <div className="cta-flex reveal-on-scroll">
                    <div className="cta-text-side">
                        <h2 className="cta-heading">WRITE THE NEXT<br />CHAPTER WITH US.</h2>
                        <p className="cta-sub">
                            Whether you're a seasoned marathoner or putting on your first pair of shoes, there's a place for you here.
                        </p>
                    </div>
                    <div className="cta-buttons">
                        <Link to="/join" className="btn-cta-red">JOIN US</Link>
                        <Link to="/events" className="btn-cta-outline">UPCOMING EVENTS</Link>
                    </div>
                </div>

                <div className="newsletter-minimal reveal-on-scroll">
                    <div className="stay-updated-label">STAY UPDATED</div>
                    <div className="input-minimal-container">
                        <input type="email" placeholder="YOUR EMAIL" className="input-minimal" />
                        <span className="material-symbols-outlined input-arrow">arrow_forward</span>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#888', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Follow us on social and join our community. Real-time updates, marathon prep, and local run announcements.
                    </p>
                </div>
            </section>

        </div>
    );
}
