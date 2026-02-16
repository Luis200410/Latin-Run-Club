// Components
import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import ProtectedRoute from './src/components/ProtectedRoute';

// Styles
import './src/style/app-header.css';
import './src/style/footer.css';
import './src/style/index.css';

// Lazy Load Pages
const Layout = lazy(() => import('./src/layouts/Layout'));
const Home = lazy(() => import('./src/pages/Home'));
const About = lazy(() => import('./src/pages/About'));
const Gallery = lazy(() => import('./src/pages/Gallery'));
const Join = lazy(() => import('./src/pages/Join'));
const SignIn = lazy(() => import('./src/pages/SignIn'));
const SignUp = lazy(() => import('./src/pages/SignUp'));

// Lazy Load Admin Pages
const AdminLayout = lazy(() => import('./src/pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./src/pages/admin/Dashboard'));
const TestimonialManager = lazy(() => import('./src/pages/admin/TestimonialManager'));
const EventsManager = lazy(() => import('./src/pages/admin/EventsManager'));

// Loading Fallback
const LoadingScreen = () => (
    <div className="flex items-center justify-center p-20 bg-[#F5F5F0]">
        <div className="animate-pulse text-lg font-black uppercase tracking-widest text-[#E85D36]">
            Loading...
        </div>
    </div>
);

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <LanguageProvider>
            <AuthProvider>
                <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="gallery" element={<Gallery />} />
                            <Route path="join" element={<Join />} />
                            <Route path="signin" element={<SignIn />} />
                            <Route path="signup" element={<SignUp />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="testimonials" element={<TestimonialManager />} />
                            <Route path="events" element={<EventsManager />} />
                        </Route>
                    </Routes>
                </Suspense>
            </AuthProvider>
        </LanguageProvider>
    </BrowserRouter>
);
