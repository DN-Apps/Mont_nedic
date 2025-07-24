// src/components/PrivacyNotice.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./PrivacyNotice.css";

export default function PrivacyNotice() {
    const [accepted, setAccepted] = useState(false);
    const { t } = useTranslation();

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
        <div className="popup-overlay" style={{ backgroundColor: "transparent", backdropFilter: "none", filter: "none" }}>
            <div className="popup-content">
                <h2>{t("site.privacyNoticeTitle")}</h2>
                <p>
                    {t("site.privacyNoticeContent")}
                </p>
                <button onClick={accept}>{t("site.privacyNoticeAccept")}</button>
            </div>
        </div>
    );
}
