// src/components/PrivacyNotice.jsx
import React, { useState, useEffect } from "react";
import "./PrivacyNotice.css";

export default function PrivacyNotice() {
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("privacyAccepted");
        if (stored === "true") setAccepted(true);
    }, []);

    const accept = () => {
        localStorage.setItem("privacyAccepted", "true");
        setAccepted(true);
    };

    if (accepted) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Datenschutzhinweis</h2>
                <p>
                    Wir verwenden Cookies und andere Technologien, um Ihre Erfahrung zu verbessern. Bitte akzeptieren Sie unseren Datenschutzhinweis.
                </p>
                <button onClick={accept}>Akzeptieren</button>
            </div>
        </div>
    );
}
