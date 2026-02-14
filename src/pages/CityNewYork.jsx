import '../style/city-new-york.css';

export default function CityNewYork() {
    return (
        <div className="city-spotlight-container">
            {/* Background Element */}
            <div className="city-bg-text">NYC</div>

            <div className="city-content-wrapper">

                {/* Header Text Section (Image 2) */}
                <section className="city-header">
                    <span className="city-subtitle">City Spotlight</span>
                    <h1 className="city-title">New York City</h1>
                    <p className="city-description">
                        Experience the raw energy of the concrete jungle through our high-fashion editorial lens.
                        This is where style meets the pavement.
                    </p>
                    <div className="city-actions">
                        <button className="city-btn btn-primary">View Gallery</button>
                        <button className="city-btn btn-secondary">Route Map</button>
                    </div>
                </section>

                {/* Collage Section (Image 3 Layout) */}
                <section className="city-collage">
                    <div className="collage-item collage-1">
                        <img src="https://images.unsplash.com/photo-1545129139-1ebac996d9f7?q=80&w=2675&auto=format&fit=crop" alt="NYC Bridge Run" />
                        <div className="collage-caption">Lower East Side Sprints</div>
                    </div>
                    <div className="collage-item collage-2">
                        <img src="https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?q=80&w=2670&auto=format&fit=crop" alt="Running Shoes" />
                        <div className="collage-caption">Concrete Cadence</div>
                    </div>
                    <div className="collage-item collage-3">
                        <img src="https://images.unsplash.com/photo-1496871455396-14e56815f1f4?q=80&w=2570&auto=format&fit=crop" alt="Urban Texture" />
                        <div className="collage-caption">Williamsburg Social</div>
                    </div>
                </section>

                {/* Stats Section (Image 2 Footer) */}
                <section className="city-stats">
                    <div className="stat-item">
                        <span className="stat-label">Active Members</span>
                        <div className="stat-value">1,200+</div>
                        <span className="stat-sub">NYC Chapter</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Next Run</span>
                        <div className="stat-value">Sun, 8:00 AM</div>
                        <span className="stat-sub">Central Park Loop</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Top Route</span>
                        <div className="stat-value">West Side</div>
                        <span className="stat-sub">5.2 Miles • High Elev</span>
                    </div>
                </section>

            </div>
        </div>
    );
}
