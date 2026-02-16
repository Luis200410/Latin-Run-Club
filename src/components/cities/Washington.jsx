import React, { forwardRef } from 'react';
import '../../style/city-washington.css';

const Washington = forwardRef(({ city, onClose }, ref) => {
    return (
        <div ref={ref} className="washington-container">
            {/* Close/Back Button can be added if needed, or rely on scroll/UI */}

            <main className="washington-main relative overflow-hidden">
                <div className="wa-header-section px-6 lg:px-12 pt-12 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="wa-chapter-label text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
                                Chapter 04 — The Altitude
                            </span>
                            <h1 className="wa-city-title text-[12vw] leading-[0.8] font-black uppercase tracking-tighter">
                                {city.name}
                            </h1>
                        </div>
                        <div className="max-w-md pb-4">
                            <p className="wa-intro-text text-lg font-medium leading-tight uppercase italic">
                                Gritty. High-Energy. Modern. <br />The skyline is our stadium.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="wa-gallery-scroll w-full overflow-x-auto hide-scrollbar flex gap-4 px-6 lg:px-12 py-10">
                    <div className="wa-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="wa-gallery-img wa-filter-grayscale absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1617581629397-a72507c3de9e?q=80&w=2670&auto=format&fit=crop')` }}>
                        </div>
                        <div className="wa-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="wa-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                Rise Up
                            </h3>
                        </div>
                    </div>

                    <div className="wa-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="wa-gallery-img absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599557672200-e22830f7bdf7?q=80&w=2574&auto=format&fit=crop')` }}>
                        </div>
                        <div className="wa-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="wa-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                Monuments
                            </h3>
                        </div>
                    </div>

                    <div className="wa-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="wa-gallery-img wa-filter-grayscale absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557160854-e1e11f691d84?q=80&w=2574&auto=format&fit=crop')` }}>
                        </div>
                        <div className="wa-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="wa-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                History
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="px-6 lg:px-12 py-24 border-t-2 border-black/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <h2 className="text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                The <br />Capital <br />Chapter
                            </h2>
                            <div className="h-2 w-32 bg-black mb-8"></div>
                            <p className="text-2xl font-bold uppercase leading-tight max-w-lg">
                                {city.description}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between items-start">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black italic">01</span>
                                    <p className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">Monumental Miles</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black italic">02</span>
                                    <p className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">Capital Energy</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black italic">03</span>
                                    <p className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">Potomac Paths</p>
                                </div>
                            </div>
                            <button className="group mt-16 bg-black text-white flex items-center justify-between w-full md:w-64 px-6 py-10 transition-transform active:scale-95 wa-load-more">
                                <span className="text-xl font-black uppercase tracking-tighter">Load More</span>
                                <span className="material-symbols-outlined text-4xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <section className="bg-black text-white py-20 px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="border-l border-white/20 pl-6">
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-white/40 block mb-4">Runners</span>
                        <p className="text-6xl font-black italic">{city.stats.runners}</p>
                    </div>
                    <div className="border-l border-white/20 pl-6">
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-white/40 block mb-4">Routes</span>
                        <p className="text-6xl font-black italic">{city.stats.routes}</p>
                    </div>
                    <div className="border-l border-white/20 pl-6">
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-white/40 block mb-4">Events</span>
                        <p className="text-6xl font-black italic">{city.stats.events}</p>
                    </div>
                </div>
            </section>
        </div>
    );
});

export default Washington;
