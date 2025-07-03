import React, { useState, useEffect } from "react";
import "./Kontakt.css";

function Kontakt() {
    const [contactForm, setContactForm] = useState({
        salutation: "",
        firstName: "",
        lastName: "",
        street: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
        email: "",
        message: "",
    });

    const [captchaCode, setCaptchaCode] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaCorrect, setCaptchaCorrect] = useState(false);
    const [isLoadingCity, setIsLoadingCity] = useState(false);
    const [cityFound, setCityFound] = useState(false);

    // Zufälliger 4-stelliger Zahlencode
    const generateCaptcha = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    useEffect(() => {
        setCaptchaCode(generateCaptcha());
    }, []);

    const handleContactFormChange = (field, value) => {
        setContactForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCountryChange = (value) => {
        handleContactFormChange("country", value);

        // Stadt & PLZ zurücksetzen, wenn NICHT Deutschland
        if (value !== "Deutschland") {
            handleContactFormChange("postalCode", "");
            handleContactFormChange("city", "");
            setCityFound(false);
        }
    };

    const searchCityByPostalCode = async (postalCode) => {
        try {
            setIsLoadingCity(true);
            const resp = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&countrycodes=de&postalcode=${postalCode}&limit=5`,
                { headers: { 'User-Agent': 'Monteurzimmer Gundelsheim' } }
            );
            const data = await resp.json();
            if (data?.length > 0) {
                const parts = data[0].display_name.split(",").map(p => p.trim());
                return parts.length >= 3 ? parts[2] : "";
            }
            return "";
        } catch (e) {
            console.error("Fehler bei der Stadtsuche:", e);
            return "";
        } finally {
            setIsLoadingCity(false);
        }
    };

    const handlePostalCodeChange = async (value) => {
        handleContactFormChange("postalCode", value);
        handleContactFormChange("city", "");
        setCityFound(false);

        const cleaned = value.replace(/\s/g, "");
        const isGermanPLZ = /^\d{5}$/.test(cleaned);

        if (contactForm.country === "Deutschland" && isGermanPLZ) {
            const city = await searchCityByPostalCode(cleaned);
            if (city) {
                handleContactFormChange("city", city);
                setCityFound(true);
            }
        }
    };

    const handleCaptchaChange = (value) => {
        setCaptchaInput(value);
        setCaptchaCorrect(value === captchaCode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaCorrect) {
            alert("❌ Bitte lösen Sie das CAPTCHA korrekt.");
            setCaptchaCode(generateCaptcha()); // neues CAPTCHA
            setCaptchaInput("");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactForm),
            });

            const result = await response.json();
            if (result.success) {
                alert("✅ Vielen Dank! Ihre Nachricht wurde gesendet.");
                setContactForm({
                    salutation: "",
                    firstName: "",
                    lastName: "",
                    street: "",
                    postalCode: "",
                    city: "",
                    country: "",
                    phone: "",
                    email: "",
                    message: "",
                });
                setCaptchaCode(generateCaptcha());
                setCaptchaInput("");
                setCaptchaCorrect(false);
            } else {
                alert("❌ Fehler beim Senden: " + result.message);
            }
        } catch (err) {
            console.error("Fehler beim Senden:", err);
            alert("❌ Es gab ein Problem beim Versenden der Nachricht.");
        }
    };

    return (
        <div className="kontakt-container">
            <h2>Kontakt</h2>
            <form onSubmit={handleSubmit} className="kontakt-form">
                <div className="kontakt-form-group">
                    <label>
                        Anrede:
                        <select value={contactForm.salutation} onChange={e => handleContactFormChange("salutation", e.target.value)}>
                            <option value="">Bitte wählen</option>
                            <option value="Herr">Herr</option>
                            <option value="Frau">Frau</option>
                            <option value="Sonstige">Sonstige</option>
                        </select>
                    </label>

                    <div className="kontakt-grid">
                        <label>
                            Vorname:
                            <input type="text" value={contactForm.firstName} onChange={e => handleContactFormChange("firstName", e.target.value)} />
                        </label>
                        <label>
                            Nachname:
                            <input type="text" value={contactForm.lastName} onChange={e => handleContactFormChange("lastName", e.target.value)} />
                        </label>

                        <label>
                            Land:
                            <select value={contactForm.country} onChange={e => handleCountryChange(e.target.value)}>
                                <option value="">Bitte wählen</option>
                                <option>Deutschland</option>
                                <option>Österreich</option>
                                <option>Schweiz</option>
                                <option>Frankreich</option>
                            </select>
                        </label>

                        <label>
                            Postleitzahl:
                            <input
                                type="text"
                                value={contactForm.postalCode}
                                onChange={e => handlePostalCodeChange(e.target.value)}
                                maxLength="5"
                                className={cityFound ? "input-success" : ""}
                            />
                            {isLoadingCity && <small className="kontakt-info">🔍 Stadt wird gesucht…</small>}
                            {cityFound && !isLoadingCity && <small className="kontakt-success">✓ Stadt gefunden</small>}
                        </label>

                        <label>
                            Stadt:
                            <input
                                type="text"
                                value={contactForm.city}
                                readOnly={contactForm.country === "Deutschland"}
                                placeholder={contactForm.country === "Deutschland" ? "Automatisch ausgefüllt" : "Bitte manuell eingeben"}
                                onChange={e => handleContactFormChange("city", e.target.value)}
                                className={contactForm.country === "Deutschland" ? "readonly-input" : ""}
                            />
                        </label>
                    </div>

                    <label>
                        Straße:
                        <input type="text" value={contactForm.street} onChange={e => handleContactFormChange("street", e.target.value)} />
                    </label>

                    <div className="kontakt-grid">

                    </div>

                    <label>
                        Telefon:
                        <input type="tel" value={contactForm.phone} onChange={e => handleContactFormChange("phone", e.target.value)} />
                    </label>

                    <label>
                        E-Mail:
                        <input type="email" value={contactForm.email} onChange={e => handleContactFormChange("email", e.target.value)} required />
                    </label>

                    <label>
                        Nachricht:
                        <textarea maxLength="500" value={contactForm.message} onChange={e => handleContactFormChange("message", e.target.value)} />
                        <small className="kontakt-info">{500 - contactForm.message.length} Zeichen verbleibend</small>
                    </label>

                    <label>
                        Captcha-Code: <span className="kontakt-captcha-code">{captchaCode}
                            <input
                                type="text"
                                placeholder="Captcha eingeben"
                                value={captchaInput}
                                onChange={e => handleCaptchaChange(e.target.value)}
                                maxLength={4}
                            />
                            {captchaInput.length === 4 && !captchaCorrect && (
                                <small className="kontakt-error">Captcha inkorrekt</small>
                            )}
                            {captchaInput.length === 4 && captchaCorrect && (
                                <small className="kontakt-success">✓ Captcha korrekt</small>
                            )}
                        </span>
                    </label>

                    <button type="submit" className="kontakt-button" disabled={!captchaCorrect}>
                        Absenden
                    </button>
                </div>
            </form>

            <div className="faq-section">
                <h3>Häufig gestellte Fragen</h3>
                <details>
                    <summary>Wie viele Zimmer gibt es?</summary>
                    <p>Wir bieten 3 Zimmer an:<br />2 Einbettzimmer, 1 Doppelbettzimmer.</p>
                </details>
                <details>
                    <summary>Sind Internet und Parkmöglichkeiten im Preis inbegriffen?</summary>
                    <p>Ja, es handelt sich um den Gesamtpreis für die Zimmer. Es entstehen keine weiteren Kosten für W-LAN oder Parkmöglichkeiten.</p>
                </details>
                <details>
                    <summary>Wie kann ich Sie bei Fragen kontaktieren?</summary>
                    <p>Bitte kontaktieren Sie uns unter:</p>
                    <p>Mobil: +43 1701071715</p>
                    <p>Mail: daniel-nedic@hotmail.de</p>
                    <p>Daniel Nedic</p>
                </details>
            </div>
        </div>
    );
}

export default Kontakt;
