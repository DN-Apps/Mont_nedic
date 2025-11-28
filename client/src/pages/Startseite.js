import React from "react";
import { useTranslation } from "react-i18next";

// Bilder der Unterkunft
import Home from "../assets/home_new.jpeg";
import Flur from "../assets/flur.jpeg";
import Flur2 from "../assets/flurRechts.jpeg";
import Zimmer1 from "../assets/Zimmer1.jpg";
import Zimmer2 from "../assets/zimmer2.jpeg";
import Portrait from "../assets/portrait_transparent.png";

import "./Home.css";

function Startseite() {
    // i18n Hook für Textübersetzungen
    const { t } = useTranslation();

    return (
        <div className="home-container">

            {/* ========================================================
               LINKER OBERER BEREICH: Begrüßungstext + Ausstattung
               ======================================================== */}
            <div className="home-section top-left">
                <h1>{t('home.welcome.title')}</h1>
                <h4>{t('home.welcome.text')}</h4>

                {/* Liste der Ausstattungsmerkmale (Icons + Übersetzungstexte) */}
                <div className="amenities">
                    <div className="amenity">
                        <i className="fas fa-briefcase"></i> {t('home.amenities.desk')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-bed"></i> {t('home.amenities.bedLinen')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-user-friends"></i> {t('home.amenities.separateBeds')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-tshirt"></i> {t('home.amenities.towels')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-wifi"></i> {t('home.amenities.wifi')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-coffee"></i> {t('home.amenities.coffeeMachine')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-utensils"></i> {t('home.amenities.dishwasher')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-snowflake"></i> {t('home.amenities.fridge')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-fire"></i> {t('home.amenities.cookingFacilities')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-microchip"></i> {t('home.amenities.microwave')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-bath"></i> {t('home.amenities.sharedBathroom')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-shower"></i> {t('home.amenities.shower')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-mug-hot"></i> {t('home.amenities.kettle')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-toilet"></i> {t('home.amenities.toilet')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-tshirt"></i> {t('home.amenities.washingMachine')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-store"></i> {t('home.amenities.nearbyShops')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-peace"></i> {t('home.amenities.quietLocation')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-smoking"></i> {t('home.amenities.smokingAllowed')}
                    </div>
                    <div className="amenity">
                        <i className="fas fa-road"></i> {t('home.amenities.goodTransport')}
                    </div>
                </div>
            </div>

            {/* ========================================================
               RECHTS OBEN: Diashow (statische Bildrotation in CSS)
               ======================================================== */}
            <div className="home-section top-right">
                <div className="slideshow">
                    {/* Die Slideshow wird rein über CSS animiert */}
                    <img src={Home} alt="Frontansicht" />
                    <img src={Flur} alt="Flur" />
                    <img src={Flur2} alt="Flur 2" />
                    <img src={Zimmer1} alt="Zimmer 1" />
                    <img src={Zimmer2} alt="Zimmer 2" />
                </div>
            </div>

            {/* ========================================================
               UNTEN LINKS: Eingebettete Google-Maps Karte
               - gestureHandling=cooperative → bessere Mobilnutzung
               ======================================================== */}
            <div className="home-section bottom-left">
                <iframe
                    title="Google Maps Gundelsheim"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d650.6341572740376!2d9.157402269658187!3d49.28517687300742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDnCsDE3JzA2LjYiTiA5wrAwOScyOS4wIkU!5e0!3m2!1sde!2sde!4v1736963839363!5m2!1sde!2sde&gestureHandling=cooperative"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy" // bessere Performance
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* ========================================================
               UNTEN RECHTS: Kontaktdaten & Portrait
               ======================================================== */}
            <div className="home-section bottom-right">
                {/* Portraitfoto (rund dargestellt via CSS) */}
                <img src={Portrait} width={150} alt="Daniel Nedic" border-radius="50%" />

                <h2>Kontaktdaten</h2>
                <p>
                    Daniel Nedic<br />
                    Kirchgasse 8<br />
                    74831 Gundelsheim<br />
                    <a href="mailto:Daniel-nedic@hotmail.de">Daniel-nedic@hotmail.de</a><br />
                    <a href="tel:01701071715">+49 170 1071715</a>
                </p>
            </div>
        </div>
    );
}

export default Startseite;
