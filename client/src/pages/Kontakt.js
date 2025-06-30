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

    // Zufälliger 4-stelliger Zahlencode
    const generateCaptcha = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    useEffect(() => {
        setCaptchaCode(generateCaptcha());
    }, []);

    const handleContactFormChange = (field, value) => {
        setContactForm({ ...contactForm, [field]: value });
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
            <form onSubmit={handleSubmit} className="contact-form">
                <label>
                    Anrede:
                    <select
                        value={contactForm.salutation}
                        onChange={(e) => handleContactFormChange("salutation", e.target.value)}
                    >
                        <option value="">Bitte auswählen</option>
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Sonstige">Sonstige</option>
                    </select>
                </label>
                <label>
                    Vorname:
                    <input
                        type="text"
                        value={contactForm.firstName}
                        onChange={(e) => handleContactFormChange("firstName", e.target.value)}
                    />
                </label>
                <label>
                    Nachname:
                    <input
                        type="text"
                        value={contactForm.lastName}
                        onChange={(e) => handleContactFormChange("lastName", e.target.value)}
                    />
                </label>
                <label>
                    Straße:
                    <input
                        type="text"
                        value={contactForm.street}
                        onChange={(e) => handleContactFormChange("street", e.target.value)}
                    />
                </label>
                <label>
                    Postleitzahl:
                    <input
                        type="text"
                        value={contactForm.postalCode}
                        onChange={(e) => handleContactFormChange("postalCode", e.target.value)}
                    />
                </label>
                <label>
                    Stadt:
                    <input
                        type="text"
                        value={contactForm.city}
                        onChange={(e) => handleContactFormChange("city", e.target.value)}
                    />
                </label>
                <label>
                    Land:
                    <select
                        value={contactForm.country}
                        onChange={(e) => handleContactFormChange("country", e.target.value)}
                    >
                        <option value="">Bitte auswählen</option>
                        <option value="Deutschland">Deutschland</option>
                        <option value="Frankreich">Frankreich</option>
                        <option value="Italien">Italien</option>
                        <option value="Spanien">Spanien</option>
                        <option value="Österreich">Österreich</option>
                        <option value="Schweiz">Schweiz</option>
                    </select>
                </label>
                <label>
                    Tel./Mobil:
                    <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => handleContactFormChange("phone", e.target.value)}
                    />
                </label>
                <label>
                    E-Mail:
                    <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => handleContactFormChange("email", e.target.value)}
                        required
                    />
                </label>
                <label>
                    Nachricht:
                    <textarea
                        maxLength="500"
                        value={contactForm.message}
                        onChange={(e) => handleContactFormChange("message", e.target.value)}
                    />
                    <small>{500 - contactForm.message.length} Zeichen verbleibend</small>
                </label>
                <label>
                    Captcha (Code: <strong>{captchaCode}</strong>):
                    <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => handleCaptchaChange(e.target.value)}
                        placeholder="Geben Sie den Code ein"
                    />
                </label>
                <button type="submit" disabled={!captchaCorrect}>
                    Abschicken
                </button>
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
