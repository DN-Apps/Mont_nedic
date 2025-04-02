import React, { useState, useEffect } from "react";
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

    const [activeImage, setActiveImage] = useState(null);

    const points = [
        { id: 1, x: 180, y: 450, label: "Treppe", image: Treppe },
        { id: 2, x: 220, y: 250, label: "Flur", image: Flur1 },
        { id: 3, x: 290, y: 250, label: "Flur", image: Flur2 },
        { id: 4, x: 250, y: 100, label: "Bad", image: Bad },
        { id: 5, x: 20, y: 350, label: "Zimmer", image: Zimmer2 },
        { id: 6, x: 450, y: 100, label: "Küche", image: Kueche },
        { id: 7, x: 650, y: 100, label: "Zimmer", image: Zimmer1 },
    ];

    const handlePointClick = (point) => {
        setActiveImage(point.image);
    };

    return (
        <div className="zimmer-container">
            {/* Linke Seite: Grundriss */}
            <div className="grundriss-container">
                <h2>Wohnungsgrundriss</h2>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="-100 -50 900 600"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Rechtecke und Beschriftungen */}
                    <rect x="-80" y="10" width="200" height="210" fill="#e8f5e9" stroke="#81c784" />
                    <text x="10" y="30" fontSize="12" fill="#1565c0">Zimmer</text>

                    <rect x="130" y="10" width="240" height="140" fill="#e3f2fd" stroke="#90caf9" />
                    <text x="230" y="30" fontSize="12" fill="#1565c0">Bad</text>

                    <rect x="380" y="10" width="160" height="140" fill="#e3f2fd" stroke="#90caf9" />
                    <text x="450" y="30" fontSize="12" fill="#2e7d32">Küche</text>

                    <rect x="550" y="10" width="230" height="230" fill="#e8f5e9" stroke="#81c784" />
                    <text x="570" y="30" fontSize="12" fill="#2e7d32">Zimmer</text>

                    <rect x="-80" y="230" width="200" height="260" fill="#e8f5e9" stroke="#81c784" />
                    <text x="-70" y="320" fontSize="12" fill="#1565c0">Zimmer</text>

                    <rect x="130" y="310" width="100" height="180" fill="#fff3e0" stroke="#ffcc80" />
                    <text x="140" y="330" fontSize="12" fill="#ef6c00">Treppenhaus</text>

                    <rect x="380" y="250" width="400" height="240" fill="#fbe9e7" stroke="#ffab91" />
                    <text x="550" y="270" fontSize="12" fill="#d84315">Wohnzimmer</text>

                    {/* Interaktive Punkte */}
                    {points.map((point) => (
                        <circle
                            key={point.id}
                            cx={point.x}
                            cy={point.y}
                            r="20"
                            fill="red"
                            onClick={() => handlePointClick(point)}
                            style={{ cursor: "pointer" }}
                        />
                    ))}
                </svg>
            </div>


            {/* Rechte Seite */}
            <div className="rechte-seite">
                {/* Permanentes Bild */}
                <div className="permanentes-bild">
                    <img src={Front} alt="Front" />
                </div>

                {/* Galerie */}
                <div className="galerie-container">
                    <h2>Galerie</h2>
                    <div className="galerie-grid">
                        {points.map((point) => (
                            <img
                                key={point.id}
                                src={point.image}
                                alt={point.label}
                                onClick={() => setActiveImage(point.image)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {activeImage && (
                <div className="overlay" onClick={() => setActiveImage(null)}>
                    <img src={activeImage} alt="Vergrößertes Bild" />
                </div>
            )}
        </div>
    );
}

export default Zimmer;
