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


// Wrapper-Komponente, um BrowserRouter von App zu trennen.
// Dies ermöglicht u.a. Testing der App ohne Router-Kontext oder das Einbetten mehrerer Router falls nötig.
function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

function App() {
    // Steuert die Sichtbarkeit des mobilen Burger-Menüs
    const [menuOpen, setMenuOpen] = useState(false);

    // Steuert die Sichtbarkeit des Impressum-Popups
    const [impressumVisible, setImpressumVisible] = useState(false);

    // i18n Hook zum Abrufen von Übersetzungen
    const { t } = useTranslation();

    return (
        <div className="App">
            <header className="header">

                {/* Burger-Icon (mobil). Wechselt zwischen Menü öffnen/schließen */}
                <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} color="white" /> : <FaBars size={24} color="white" />}
                </div>

                {/* Seitentitel, der über i18n gesteuert wird */}
                <div className="site-title">{t("site.title")}</div>

                {/* Navigationsmenü, das bei mobiler Ansicht ein-/ausklappt */}
                <nav className={`menu ${menuOpen ? "open" : ""}`}>

                    {/* Jede NavLink-Komponente schließt das Menü nach dem Anklicken */}
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

                {/* Sprachumschalter (DE/EN/...) */}
                <LanguageSelector />
            </header>

            <main className="main-content">
                {/* React Router Routen definieren die Seitenstruktur */}
                <Routes>
                    <Route path="/" element={<Startseite />} />
                    <Route path="/zimmer" element={<Zimmer />} />
                    <Route path="/buchung" element={<Buchung />} />
                    <Route path="/kontakt" element={<Kontakt />} />
                </Routes>
            </main>

            {/* Hinweis bzgl. Datenschutz (Cookie/Privacy Notice) */}
            <PrivacyNotice />

            <footer className="footer">
                {/* Öffnet das Impressum-Popup */}
                <button className="impressum-link" onClick={() => setImpressumVisible(true)}>
                    {t("site.imprint")}
                </button>
            </footer>

            {/* Popup für Impressum, sichtbar je nach State */}
            <ImpressumPopup
                visible={impressumVisible}
                onClose={() => setImpressumVisible(false)}
            />
        </div>
    );
}

export default AppWrapper;
