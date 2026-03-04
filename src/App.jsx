import React from 'react';
import { useAntiInspect } from './hooks/useAntiInspect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventDetails from './pages/EventDetails';
import Members from './pages/Members';
import Streaming from './pages/Streaming';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

import CursorAnimation from './components/CursorAnimation';

function AntiInspectWrapper() {
  useAntiInspect();
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AntiInspectWrapper />
      <CursorAnimation />
      <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#020810', color: '#f5e6c8' }}>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<EventDetails />} />
            <Route path="/members" element={<Members />} />
            <Route path="/streaming" element={<Streaming />} />
            <Route path="/managemen-web-nobar" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
