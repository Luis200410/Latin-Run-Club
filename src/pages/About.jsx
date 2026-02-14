import Founders from "../components/Founders";
import founders from '../info/founders.js';
import '../style/about.css';

export default function About() {
    const founderList = founders.map((founder, index) => {
        return <Founders
            key={index}
            {...founder}
        />
    });

    return (
        <div className="about-container">
            <section className="about-hero">
                <h1>Our Story</h1>
                <p>We run for culture, community, and legacy.</p>
            </section>

            <section className="about-mission">
                <h2>Join the Movement</h2>
                <p>
                    We are more than a club. We are a cultural engine fueled by sweat,
                    heritage, and the collective heartbeat of our community.
                </p>
            </section>

            <section className="values-section">
                <div className="values-grid">
                    <div className="value-card">
                        <h3>Comunidad</h3>
                        <p>No one runs alone. We build bridges between neighborhoods, generations, and skill levels.</p>
                    </div>
                    <div className="value-card">
                        <h3>Cultura</h3>
                        <p>Every step honors those who came before us. We carry our heritage in our stride and our music in our ears.</p>
                    </div>
                    <div className="value-card">
                        <h3>Resiliencia</h3>
                        <p>The finish line is just the beginning. We find strength in the struggle and joy in the endurance.</p>
                    </div>
                    <div className="value-card">
                        <h3>Legado</h3>
                        <p>We run for the future. Inspiring the next generation of Latin athletes to take up space and break records.</p>
                    </div>
                </div>
            </section>

            <section className="founders-section">
                <h2>Founders</h2>
                <div className='founders'>
                    {founderList}
                </div>
            </section>

            <section className="voice-section">
                <h2>Voice of the Community</h2>
                <div className="voice-grid">
                    <div className="testimonial-card">
                        <p>"Running with the club transformed my city from a map of streets to a web of connections."</p>
                    </div>
                    <div className="testimonial-card">
                        <p>"It's about visibility. We take up space, we breathe the same air, we claim our right to the pavement."</p>
                    </div>
                    <div className="testimonial-card">
                        <p>"Every Tuesday night feels like a celebration of where we come from and where we are going."</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
