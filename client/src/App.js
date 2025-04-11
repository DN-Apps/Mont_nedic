import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBed, FaCalendarCheck, FaEnvelope, FaUser, FaBars, FaTimes, FaHandshake } from "react-icons/fa";
import Startseite from "./pages/Startseite";
import Zimmer from "./pages/Zimmer";
import Buchung from "./pages/Buchung";
import Kontakt from "./pages/Kontakt";
import Admin from "./pages/Admin";
import "./App.css"; // Für Styling
import Login from "./pages/Login";
import Register from "./pages/Register";

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

    useEffect(() => {
        const token = localStorage.getItem("sessionToken");
        const expires = localStorage.getItem("sessionExpires");

        if (token && expires && new Date().getTime() < parseInt(expires)) {
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("sessionExpires");
            setIsLoggedIn(false);
        }
    }, []);


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
                    {/* <NavLink to="/admin" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaUser /> <span>Login</span>
                    </NavLink>
                    <NavLink to="/register" className="menu-item" onClick={() => setMenuOpen(false)}>
                        <FaHandshake />
                        <div>Register</div>
                    </NavLink> */}
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Startseite />} />
                <Route path="/zimmer" element={<Zimmer />} />
                <Route path="/buchung" element={<Buchung />} />
                <Route path="/kontakt" element={<Kontakt />} />
                {/* <Route path="/admin" element={isLoggedIn ? <Admin /> : <Login onLogin={handleLogin} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> */}
            </Routes>
        </div>
    );
}


export default AppWrapper;
