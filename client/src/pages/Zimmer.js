import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Bad from "../assets/Bad.jpg";
import Kueche from "../assets/Kueche.jpg";
import Zimmer1 from "../assets/zimmer2.jpeg";
import Zimmer2 from "../assets/Zimmer1.jpg";
import Flur1 from "../assets/flur.jpeg";
import Flur2 from "../assets/flurRechts.jpeg";
import Treppe from "../assets/entry.jpeg";
import Front from "../assets/home_new.jpeg";
import "./Zimmer.css";

function Zimmer() {
    const [activeIndex, setActiveIndex] = useState(null);
    const { t } = useTranslation();

    // Rohdaten (sprachneutral)
    const rawPoints = [
        { id: 1, x: 180, y: 450, labelKey: "rooms.stairs", image: Treppe },
        { id: 2, x: 220, y: 250, labelKey: "rooms.hallway", image: Flur1 },
        { id: 3, x: 290, y: 250, labelKey: "rooms.hallway", image: Flur2 },
        { id: 4, x: 250, y: 100, labelKey: "rooms.bath", image: Bad },
        { id: 5, x: 20, y: 350, labelKey: "rooms.room", image: Zimmer2 },
        { id: 6, x: 450, y: 100, labelKey: "rooms.kitchen", image: Kueche },
        { id: 7, x: 650, y: 100, labelKey: "rooms.room", image: Zimmer1 },
    ];

    // Sprachabhängige Daten generieren
    const points = rawPoints.map((p) => ({
        ...p,
        label: t(p.labelKey),
    }));

    const handlePointClick = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeIndex === null) return;

            if (e.key === "ArrowRight") {
                setActiveIndex((prev) => (prev + 1) % points.length);
            } else if (e.key === "ArrowLeft") {
                setActiveIndex((prev) => (prev - 1 + points.length) % points.length);
            } else if (e.key === "Escape") {
                setActiveIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, points.length]);

    return (
        <div className="zimmer-container">
            {/* Linke Seite: Grundriss */}
            <div className="grundriss-container">
                <h2>{t("rooms.floorPlan")}</h2>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="-100 -50 900 600"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Räume als Rechtecke */}
                    <rect x="-80" y="10" width="200" height="210" fill="#e8f5e9" stroke="#81c784" />
                    <text x="10" y="30" fontSize="12" fill="#1565c0">{t("rooms.room")}</text>

                    <rect x="130" y="10" width="240" height="140" fill="#e3f2fd" stroke="#90caf9" />
                    <text x="230" y="30" fontSize="12" fill="#1565c0">{t("rooms.bath")}</text>

                    <rect x="380" y="10" width="160" height="140" fill="#e3f2fd" stroke="#90caf9" />
                    <text x="450" y="30" fontSize="12" fill="#2e7d32">{t("rooms.kitchen")}</text>

                    <rect x="550" y="10" width="230" height="230" fill="#e8f5e9" stroke="#81c784" />
                    <text x="570" y="30" fontSize="12" fill="#2e7d32">{t("rooms.room")}</text>

                    <rect x="-80" y="230" width="200" height="260" fill="#e8f5e9" stroke="#81c784" />
                    <text x="-70" y="320" fontSize="12" fill="#1565c0">{t("rooms.room")}</text>

                    <rect x="130" y="310" width="100" height="180" fill="#fff3e0" stroke="#ffcc80" />
                    <text x="140" y="330" fontSize="12" fill="#ef6c00">{t("rooms.stairs")}</text>

                    <rect x="380" y="250" width="400" height="240" fill="#fbe9e7" stroke="#ffab91" />
                    <text x="550" y="270" fontSize="12" fill="#d84315">{t("rooms.livingroom")}</text>

                    {/* Interaktive Punkte */}
                    {points.map((point, index) => (
                        <circle
                            key={point.id}
                            cx={point.x}
                            cy={point.y}
                            r="20"
                            fill="red"
                            onClick={() => handlePointClick(index)}
                            style={{ cursor: "pointer" }}
                        />
                    ))}
                </svg>
            </div>

            {/* Rechte Seite */}
            <div className="rechte-seite">
                {/* Bild */}
                <div className="permanentes-bild">
                    <img src={Front} alt="Front" />
                </div>

                {/* Galerie */}
                <div className="galerie-container">
                    <h2>{t("rooms.gallery")}</h2>
                    <div className="galerie-grid">
                        {points.map((point, index) => (
                            <img
                                key={point.id}
                                src={point.image}
                                alt={point.label}
                                onClick={() => handlePointClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay mit großem Bild */}
            {activeIndex !== null && (
                <div className="overlay">
                    <button className="close-button" onClick={() => setActiveIndex(null)}>
                        &#10005;
                    </button>
                    <button
                        className="arrow-button left"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex((prev) => (prev - 1 + points.length) % points.length);
                        }}
                    >
                        &#8592;
                    </button>
                    <img src={points[activeIndex].image} alt={points[activeIndex].label} />
                    <button
                        className="arrow-button right"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex((prev) => (prev + 1) % points.length);
                        }}
                    >
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );
}

export default Zimmer;
