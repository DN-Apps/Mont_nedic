// src/components/PrivacyNotice.jsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./PrivacyNotice.css";

export default function PrivacyNotice() {
    // Speichert, ob der Nutzer den Hinweis akzeptiert hat
    const [accepted, setAccepted] = useState(false);

    const { t } = useTranslation();

    /* ------------------------------------------------------------------
       Beim Laden der Komponente überprüfen:
       - Ob der Nutzer die Datenschutzhinweise bereits akzeptiert hat.
       - Die Information wird in localStorage persistiert, damit
         das Popup bei erneuten Seitenaufrufen nicht erneut erscheint.
       ------------------------------------------------------------------ */
    useEffect(() => {
        const stored = localStorage.getItem("privacyAccepted");
        if (stored === "true") setAccepted(true);
    }, []);

    /* ------------------------------------------------------------------
       Nutzer akzeptiert Datenschutzhinweis
       - Speichern im localStorage: bleibt zwischen Sitzungen erhalten
       - Verstecken des Popups
       ------------------------------------------------------------------ */
    const accept = () => {
        localStorage.setItem("privacyAccepted", "true");
        setAccepted(true);
    };

    // Falls akzeptiert → Komponente ausblenden / nichts rendern
    if (accepted) return null;

    /* ------------------------------------------------------------------
       UI: Einfaches Datenschutz-Popup
       - Transparenter Hintergrund, damit kein Blur entsteht
       - Inhalte werden über CSS positioniert und gestylt
       ------------------------------------------------------------------ */
    return (
        <div
            className="popup-overlay"
            style={{
                backgroundColor: "transparent",
                backdropFilter: "none",
                filter: "none",
            }}
        >
            <div className="popup-content">
                <h2>{t("site.privacyNoticeTitle")}</h2>

                <p>{t("site.privacyNoticeContent")}</p>

                <button onClick={accept}>
                    {t("site.privacyNoticeAccept")}
                </button>
            </div>
        </div>
    );
}
