import React from "react";
import Home from "../assets/home_new.jpeg";
import Flur from "../assets/flur.jpeg";
import Flur2 from "../assets/flurRechts.jpeg"
import Zimmer1 from "../assets/Zimmer1.jpg";
import Zimmer2 from "../assets/zimmer2.jpeg";
import Portrait from "../assets/portrait_transparent.png"
import "./Home.css";

function Startseite() {
    return (
        <div className="home-container">
            {/* Links oben: Begrüßungstext */}
            <div className="home-section top-left">
                <h1>Herzlich Willkommen - Monteurzimmer Nedic</h1>
                <h4>
                    Unsere Unterkunft befindet sich in der malerischen Altstadt Gundelsheims.<br></br>
                    Aufgrund der zentralen Lage erfreuen sich die Monteurzimmer Nedic sehr großer Beliebtheit.
                </h4>
                <div className="amenities">
                    <div className="amenity">
                        <i className="fas fa-briefcase"></i> Arbeitstisch
                    </div>
                    <div className="amenity">
                        <i className="fas fa-bed"></i> Bettwäsche inklusive
                    </div>
                    <div className="amenity">
                        <i className="fas fa-user-friends"></i> Getrennte Betten
                    </div>
                    <div className="amenity">
                        <i className="fas fa-tshirt"></i> Handtücher inklusive
                    </div>
                    <div className="amenity">
                        <i className="fas fa-wifi"></i> W-LAN
                    </div>
                    <div className="amenity">
                        <i className="fas fa-coffee"></i> Kaffeemaschine
                    </div>
                    <div className="amenity">
                        <i className="fas fa-utensils"></i> Spülmaschine
                    </div>
                    <div className="amenity">
                        <i className="fas fa-snowflake"></i> Kühlschrank
                    </div>
                    <div className="amenity">
                        <i className="fas fa-fire"></i> Kochmöglichkeit
                    </div>
                    <div className="amenity">
                        <i className="fas fa-microchip"></i> Mikrowelle
                    </div>
                    <div className="amenity">
                        <i className="fas fa-bath"></i> Gemeinschaftsbad
                    </div>
                    <div className="amenity">
                        <i className="fas fa-shower"></i> Dusche
                    </div>
                    <div className="amenity">
                        <i className="fas fa-mug-hot"></i> Wasserkocher
                    </div>
                    <div className="amenity">
                        <i className="fas fa-toilet"></i> WC
                    </div>
                    <div className="amenity">
                        <i className="fas fa-tshirt"></i> Waschmaschine
                    </div>
                    <div className="amenity">
                        <i className="fas fa-store"></i> Geschäfte in der Nähe
                    </div>
                    <div className="amenity">
                        <i className="fas fa-peace"></i> Ruhige Lage
                    </div>
                    <div className="amenity">
                        <i className="fas fa-smoking"></i> Raucher
                    </div>
                    <div className="amenity">
                        <i className="fas fa-road"></i> Gute Verkehrsanbindung
                    </div>
                </div>
            </div>


            {/* Rechts oben: Diashow */}
            <div className="home-section top-right">
                <div className="slideshow">
                    <img src={Home} alt="Frontansicht" />
                    <img src={Flur} alt="Flur" />
                    <img src={Flur2} alt="Flur2" />
                    <img src={Zimmer1} alt="Zimmer 1" />
                    <img src={Zimmer2} alt="BZimmer 2" />
                </div>
            </div>

            {/* Links unten: Google Maps */}
            <div className="home-section bottom-left">
                <iframe
                    title="Google Maps Gundelsheim"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d650.6341572740376!2d9.157402269658187!3d49.28517687300742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDnCsDE3JzA2LjYiTiA5wrAwOScyOS4wIkU!5e0!3m2!1sde!2sde!4v1736963839363!5m2!1sde!2sde&gestureHandling=cooperative"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* Rechts unten: Kontaktdaten */}
            <div className="home-section bottom-right">
                <img src={Portrait} width={150} alt="Daniel Nedic" border-radius="50%"></img>
                <h2>Kontaktdaten</h2>
                <p>
                    Daniel Nedic<br />
                    Kirchgasse 8<br />
                    74831 Gundelsheim<br />
                    <a href="mailto:Daniel-nedic@hotmail.de">Daniel-nedic@hotmail.de</a><br />
                    <a href="tel:01701071715">+49170 1071715</a>
                </p>
            </div>
        </div>
    );
}

export default Startseite;
