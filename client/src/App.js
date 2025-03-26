import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBed, FaCalendarCheck, FaEnvelope, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Startseite from './pages/Startseite';
import Zimmer from './pages/Zimmer';
import Buchung from './pages/Buchung';
import Kontakt from './pages/Kontakt';
import Admin from './pages/Admin';
import './App.css'; // Für Styling

// Hauptkomponente, die den Router enthält
function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

// App-Komponente
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für Anmeldung
    const navigate = useNavigate(); // useNavigate innerhalb des Router-Kontexts

    // Funktion zum Anmelden
    const handleLogin = () => {
        setIsLoggedIn(true);
        navigate('/admin'); // Weiterleitung zum Adminbereich nach der Anmeldung
    };

    // Funktion zum Abmelden
    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/'); // Weiterleitung zur Startseite nach der Abmeldung
    };

    return (
        <div className="App">
            <header className="header">
                <nav className="menu">
                    <NavLink to="/" className="menu-item">
                        <FaHome /> <span>Home</span>
                    </NavLink>
                    <NavLink to="/zimmer" className="menu-item">
                        <FaBed /> <span>Zimmer</span>
                    </NavLink>
                    <NavLink to="/buchung" className="menu-item">
                        <FaCalendarCheck /> <span>Buchung</span>
                    </NavLink>
                    <NavLink to="/kontakt" className="menu-item">
                        <FaEnvelope /> <span>Kontakt</span>
                    </NavLink>
                </nav>
                <div className="auth-section">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="auth-button">
                            <FaSignOutAlt /> <span>Abmelden</span>
                        </button>
                    ) : (
                        <NavLink to="/login" className="auth-button">
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

// Login-Komponente
function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hier könntest du eine echte Authentifizierungslogik implementieren
        if (username === 'admin' && password === 'password') {
            onLogin(); // Anmelden
        } else {
            alert('Ungültige Anmeldedaten');
        }
    };

    return (
        <div className="login-container">
            <h2>Anmelden</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Benutzername:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Passwort:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Anmelden
                </button>
            </form>
            <button className="register-button">Registrieren</button>
        </div>
    );
}

export default AppWrapper; // Exportiere AppWrapper statt App