import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { FaHome, FaBed, FaCalendarCheck, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import Startseite from "./pages/Startseite";
import Zimmer from "./pages/Zimmer";
import Buchung from "./pages/Buchung";
import Kontakt from "./pages/Kontakt";
import "./App.css";

import PrivacyNotice from "./components/PrivacyNotice";
import ImpressumPopup from "./components/ImpressumPopup";

function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [impressumVisible, setImpressumVisible] = useState(false);

    return (
        <div className="App">
            <header className="header">
                <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} color="white" /> : <FaBars size={24} color="white" />}
                </div>
                <nav className={`menu ${menuOpen ? "open" : ""}`}>
                    <NavLink to="/" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaHome /> <span>Home</span>
                    </NavLink>
                    <NavLink to="/zimmer" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaBed /> <span>Zimmer</span>
                    </NavLink>
                    <NavLink to="/buchung" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaCalendarCheck /> <span>Buchung</span>
                    </NavLink>
                    <NavLink to="/kontakt" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaEnvelope /> <span>Kontakt</span>
                    </NavLink>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Startseite />} />
                <Route path="/zimmer" element={<Zimmer />} />
                <Route path="/buchung" element={<Buchung />} />
                <Route path="/kontakt" element={<Kontakt />} />
            </Routes>

            <PrivacyNotice />

            <footer className="footer">
                <button className="impressum-link" onClick={() => setImpressumVisible(true)}>
                    Impressum
                </button>
            </footer>

            <ImpressumPopup visible={impressumVisible} onClose={() => setImpressumVisible(false)} />
        </div>
    );
}

export default AppWrapper;
