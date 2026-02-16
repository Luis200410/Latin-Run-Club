// Components
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './src/context/LanguageContext';
import Layout from './src/layouts/Layout';
import Home from './src/pages/Home';
import About from './src/pages/About';
import Gallery from './src/pages/Gallery';
import Join from './src/pages/Join';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import CityNewYork from './src/pages/CityNewYork';
import ProtectedRoute from './src/components/ProtectedRoute';
import AdminLayout from './src/pages/admin/AdminLayout';
import Dashboard from './src/pages/admin/Dashboard';
import TestimonialManager from './src/pages/admin/TestimonialManager';
import EventsManager from './src/pages/admin/EventsManager';

// styles
import './src/style/Header.css';
import './src/style/footer.css';
import './src/style/index.css';

import { AuthProvider } from './src/context/AuthContext';

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <LanguageProvider>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="join" element={<Join />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route path="signup" element={<SignUp />} />
                        <Route path="cities/new-york" element={<CityNewYork />} />
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
            </AuthProvider>
        </LanguageProvider>
    </BrowserRouter>
);
