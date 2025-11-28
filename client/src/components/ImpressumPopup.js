// src/components/ImpressumPopup.jsx

import React from "react";
import "./ImpressumPopup.css";

export default function ImpressumPopup({ visible, onClose }) {

    /* ------------------------------------------------------------------
       Wenn das Popup nicht sichtbar sein soll, rendert die Komponente
       schlichtweg nichts. Dadurch bleibt sie komplett aus dem DOM,
       was Performance und Accessibility verbessert.
       ------------------------------------------------------------------ */
    if (!visible) return null;

    /* ------------------------------------------------------------------
       Popup-Overlay + Popup-Inhalt:
       - Der Overlay wird genutzt, um klick außerhalb des Popups
         zu erkennen → Popup schließen.
       - event.stopPropagation() verhindert, dass Klicks im Popup
         ebenfalls den Overlay-Click-Handler auslösen.
       ------------------------------------------------------------------ */
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup-content"
                onClick={e => e.stopPropagation()} /* verhindert ungewolltes Schließen */
            >
                <h2>Impressum</h2>

                {/* Statischer Impressum-Text gemäß gesetzlicher Anforderungen */}
                <p>
                    Monteurzimmer Nedic<br />
                    Daniel Nedic<br />
                    Kirchgasse 8<br />
                    74831 Gundelsheim<br />
                    Mobil: +49 170 1071715<br />
                    E-Mail: daniel-nedic@hotmail.de
                </p>

                {/* Schließen-Button → ruft Callback aus dem Parent auf */}
                <button onClick={onClose}>Schließen</button>
            </div>
        </div>
    );
}
