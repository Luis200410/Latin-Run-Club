// Components
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './src/layouts/Layout';
import Home from './src/pages/Home';
import About from './src/pages/About';
import Gallery from './src/pages/Gallery';
import Join from './src/pages/Join';
import SignIn from './src/pages/SignIn';

// styles
import './src/style/Header.css';
import './src/style/footer.css';
import './src/style/index.css';

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="join" element={<Join />} />
                <Route path="signin" element={<SignIn />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
