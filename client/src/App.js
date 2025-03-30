import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBed, FaCalendarCheck, FaEnvelope, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import Startseite from "./pages/Startseite";
import Zimmer from "./pages/Zimmer";
import Buchung from "./pages/Buchung";
import Kontakt from "./pages/Kontakt";
import Admin from "./pages/Admin";
import "./App.css"; // Für Styling

function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // Steuert das Burger-Menü
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLoggedIn(true);
        navigate("/admin");
        setMenuOpen(false); // Menü schließen nach Login
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/");
        setMenuOpen(false); // Menü schließen nach Logout
    };

    return (
        <div className="App">
            <header className="header">
                {/* Burger-Button für Mobile Ansicht */}
                <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={24} color="white" /> : <FaBars size={24} color="white" />}
                </div>

                {/* Navigationsmenü */}
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

                {/* Anmeldebereich */}
                <div className="auth-section">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="auth-button">
                            <FaSignOutAlt /> <span>Abmelden</span>
                        </button>
                    ) : (
                        <NavLink to="/login" className="auth-button" onClick={() => setMenuOpen(false)}>
                            <FaUser /> <span>Anmelden</span>
                        </NavLink>
                    )}
                </div>
            </header>

            <Routes>
                <Route path="/" element={<Startseite />} />
                <Route path="/zimmer" element={<Zimmer />} />
                <Route path="/buchung" element={<Buchung />} />
                <Route path="/kontakt" element={<Kontakt />} />
                <Route path="/admin" element={isLoggedIn ? <Admin /> : <Login onLogin={handleLogin} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
        </div>
    );
}

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "password") {
            onLogin();
        } else {
            alert("Ungültige Anmeldedaten");
        }
    };

    return (
        <div className="login-container">
            <h2>Anmelden</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Benutzername:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Passwort:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="login-button">
                    Anmelden
                </button>
            </form>
            <button className="register-button">Registrieren</button>
        </div>
    );
}

export default AppWrapper;
