import { Link } from 'react-router-dom';
import '../style/join.css';

export default function Join() {
    return (
        <div className="join-container">
            <section className="join-hero">
                <h1>Join the Movement</h1>
                <p>
                    We are cultural engine fueled by sweat, heritage, and the collective heartbeat of our community.
                    Take your place on the starting line.
                </p>
            </section>

            <div className="join-options">
                <div className="join-card highlight">
                    <h2>Register</h2>
                    <p>Join our official roster for access to training plans, exclusive events, and community perks.</p>
                    <Link to="/signup" className="join-btn">Sign Up Now</Link>
                </div>

                <div className="join-card">
                    <h2>Log In</h2>
                    <p>Access your dashboard, check your stats, and connect with your local chapter.</p>
                    <Link to="/signin" className="join-btn">Member Login</Link>
                </div>

                <div className="join-card">
                    <h2>Newsletter</h2>
                    <p>Manifesto updates, route drops, and community stories delivered weekly to your inbox.</p>
                    <button className="join-btn" onClick={() => alert("Newsletter subscription coming soon!")}>Subscribe</button>
                </div>
            </div>
        </div>
    );
}
