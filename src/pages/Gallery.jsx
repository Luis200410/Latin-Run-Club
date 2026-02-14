import { useState, useEffect, useRef } from 'react';
import '../style/gallery.css';
import '../style/city-new-york.css'; // Reusing the detail styles
import Washington from '../components/cities/Washington';

// City Data
const cities = [
    {
        id: 'new-york',
        name: 'New York',
        color: 'rgb(0, 151, 178)', // Teal
        bgId: 'bg-teal',
        image: 'https://images.unsplash.com/photo-1496871455396-14e56815f1f4?q=80&w=2570&auto=format&fit=crop',
        subtitle: 'The Concrete Jungle',
        description: 'Run through the veins of the city that never sleeps. From Central Park loops to the West Side Highway, experience the energy of the world\'s greatest metropolis.',
        stats: { runners: '12.5k', routes: '42', events: '150+' }
    },
    {
        id: 'washington',
        name: 'Washington',
        color: 'rgb(253, 132, 74)', // Orange
        bgId: 'bg-orange',
        image: 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?q=80&w=2670&auto=format&fit=crop',
        subtitle: 'Capital Strides',
        description: 'History in motion. Navigate the monuments, the Mall, and the hidden trails of Rock Creek Park. A running experience monumental in scale.',
        stats: { runners: '8.2k', routes: '28', events: '95' }
    },
    {
        id: 'boston',
        name: 'Boston',
        color: 'rgb(24, 34, 51)', // Navy
        bgId: 'bg-navy',
        image: 'https://images.unsplash.com/photo-1506199326888-0f305f2424b9?q=80&w=2670&auto=format&fit=crop',
        subtitle: 'The Marathon City',
        description: 'Where running is religion. Trace the Charles River, conquer Heartbreak Hill, and feel the spirit of the world\'s oldest annual marathon.',
        stats: { runners: '10.1k', routes: '35', events: '112' }
    },
    {
        id: 'atlanta',
        name: 'Atlanta',
        color: 'rgb(66, 78, 52)', // Olive
        bgId: 'bg-olive',
        image: 'https://images.unsplash.com/photo-1575913251780-6bc150426555?q=80&w=2670&auto=format&fit=crop',
        subtitle: 'The Running City',
        description: 'Southern hospitality meets urban endurance. From loop of the BeltLine to the hills of Buckhead, find your pace in the city in a forest.',
        stats: { runners: '7.8k', routes: '24', events: '88' }
    },
    {
        id: 'london',
        name: 'London',
        color: 'rgb(140, 119, 171)', // Purple
        bgId: 'bg-purple',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop',
        subtitle: 'Royal Parks & River Runs',
        description: 'Timeless routes through historic streets. Dash along the Thames, weave through Royal Parks, and sprint past landmarks that have stood for centuries.',
        stats: { runners: '15.2k', routes: '55', events: '200+' }
    }
];

export default function Gallery() {
    const [activeCityColor, setActiveCityColor] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const detailsRef = useRef(null);

    // Entrance animation trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            const bars = document.querySelectorAll('.logo-bar');
            bars.forEach((bar, index) => {
                bar.classList.add('animate-entrance');
                setTimeout(() => {
                    bar.style.opacity = '1';
                    bar.style.transform = 'translateX(0)';
                }, 500 + (index * 120));
            });
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const showGallery = (cityId) => {
        setActiveCityColor(cityId);
    };

    const hideGallery = () => {
        setActiveCityColor(null);
    };

    const handleCityClick = (city) => {
        setSelectedCity(city);
        // Initial scroll or focus could go here if desired, 
        // e.g. setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        // But user said "appear bellow", imply interaction flows naturally.
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="gallery-container">
            {/* Background Images Layer */}
            <div className="bg-container">
                {cities.map((city) => (
                    <div
                        key={city.bgId}
                        className={`gallery-bg ${activeCityColor === city.id ? 'active' : ''}`}
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${city.image}')` }}
                    ></div>
                ))}
            </div>

            <main className="gallery-main relative z-40 flex items-center justify-center p-8 min-h-screen">
                <div className="content-wrapper flex items-center gap-0 lg:gap-12 max-w-screen-xl w-full justify-center">

                    {/* SVG Line Section */}
                    <div className="svg-section w-[220px] lg:w-[400px] flex justify-end">
                        <svg className="w-full h-auto text-gray-900 fill-none city-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 800">
                            <path
                                className="line-logo-path"
                                d="M20,40 C140,80 180,120 200,200 C220,280 180,320 220,380 C260,440 320,480 280,560 C240,640 220,700 240,760"
                                stroke="#1a1a1a"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeWidth="24"
                            ></path>
                        </svg>
                    </div>

                    {/* Bars Section */}
                    <div className="bars-section flex flex-col gap-6 lg:gap-8 flex-1 max-w-2xl ml-[-20px] lg:ml-[-60px]">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                className="group relative flex items-center cursor-pointer city-bar-row"
                                onMouseEnter={() => showGallery(city.id)}
                                onMouseLeave={hideGallery}
                                onClick={() => handleCityClick(city)}
                            >
                                <div
                                    className={`logo-bar bar-${city.id}`}
                                    style={{
                                        backgroundColor: city.color,
                                        height: '3.5rem', /* approx h-14 */
                                        '--city-color': city.color // Pass color for CSS hover shadow
                                    }}
                                ></div>
                                <span
                                    className="city-label"
                                    style={{ color: city.color }}
                                >
                                    {city.name}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </main>

            {/* DETAIL SECTION (Inline) */}
            {/* DETAIL SECTION (Conditional) */}
            {selectedCity && selectedCity.id === 'washington' ? (
                <Washington city={selectedCity} ref={detailsRef} />
            ) : selectedCity ? (
                <div ref={detailsRef} className="city-detail-section" style={{ backgroundColor: selectedCity.color }}>
                    <div className="city-content-wrapper fade-in-up">
                        <div className="city-header">
                            <span className="city-subtitle">LATIN RUN CLUB</span>
                            <h1 className="city-title">{selectedCity.name}</h1>
                            <p className="city-description">{selectedCity.description}</p>

                            <div className="city-actions">
                                <button className="city-btn btn-primary">Join Run</button>
                                <button className="city-btn btn-secondary">Explore Routes</button>
                            </div>
                        </div>

                        {/* Collage - Simplified for dynamic rendering */}
                        <div className="city-collage">
                            {/* Using same image for collage slots for now, or could have array in data */}
                            <div className="collage-item collage-1">
                                <img src={selectedCity.image} alt="Detail 1" />
                            </div>
                            <div className="collage-item collage-2">
                                <img src={selectedCity.image} alt="Detail 2" style={{ transform: 'scale(1.2)' }} />
                            </div>
                            <div className="collage-item collage-3">
                                <img src={selectedCity.image} alt="Detail 3" style={{ opacity: 0.8 }} />
                                <div className="collage-caption">CITY SQUAD</div>
                            </div>
                        </div>

                        <div className="city-stats">
                            <div className="stat-item">
                                <span className="stat-label">RUNNERS</span>
                                <div className="stat-value">{selectedCity.stats.runners}</div>
                                <span className="stat-sub">ACTIVE MEMBERS</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">ROUTES</span>
                                <div className="stat-value">{selectedCity.stats.routes}</div>
                                <span className="stat-sub">CURATED PATHS</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">EVENTS</span>
                                <div className="stat-value">{selectedCity.stats.events}</div>
                                <span className="stat-sub">ANNUAL MEETUPS</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
