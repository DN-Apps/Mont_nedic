// src/components/ImpressumPopup.jsx
import React from "react";
import "./ImpressumPopup.css";

export default function ImpressumPopup({ visible, onClose }) {
    if (!visible) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <h2>Impressum</h2>
                <p>
                    Monteurzimmer Nedic<br />
                    Daniel Nedic<br />
                    Kirchgasse 8<br />
                    74831 Gundelsheim<br />
                    Mobil: +49 170 1071715<br />
                    E-Mail: daniel-nedic@hotmail.de
                </p>
                <button onClick={onClose}>Schließen</button>
            </div>
        </div>
    );
}
