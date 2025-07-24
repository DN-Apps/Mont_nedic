import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { FaHome, FaBed, FaCalendarCheck, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import Startseite from "./pages/Startseite";
import { useTranslation } from "react-i18next";
import Zimmer from "./pages/Zimmer";
import Buchung from "./pages/Buchung";
import Kontakt from "./pages/Kontakt";
import LanguageSelector from "./components/LanguageSelector"
import './i18n.js';
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
    const { t } = useTranslation();

    return (
        <div className="App">
            <header className="header">
                <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} color="white" /> : <FaBars size={24} color="white" />}
                </div>

                <div className="site-title">{t("site.title")}</div>

                <nav className={`menu ${menuOpen ? "open" : ""}`}>
                    <NavLink to="/" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaHome /> <span>{t("menu.home")}</span>
                    </NavLink>
                    <NavLink to="/zimmer" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaBed /> <span>{t("menu.rooms")}</span>
                    </NavLink>
                    <NavLink to="/buchung" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaCalendarCheck /> <span>{t("menu.booking")}</span>
                    </NavLink>
                    <NavLink to="/kontakt" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaEnvelope /> <span>{t("menu.contact")}</span>
                    </NavLink>
                </nav>
                <LanguageSelector></LanguageSelector>

            </header>


            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Startseite />} />
                    <Route path="/zimmer" element={<Zimmer />} />
                    <Route path="/buchung" element={<Buchung />} />
                    <Route path="/kontakt" element={<Kontakt />} />
                </Routes>
            </main>



            <PrivacyNotice />

            <footer className="footer">
                <button className="impressum-link" onClick={() => setImpressumVisible(true)}>
                    {t("site.imprint")}
                </button>
            </footer>

            <ImpressumPopup visible={impressumVisible} onClose={() => setImpressumVisible(false)} />
        </div>
    );
}

export default AppWrapper;
