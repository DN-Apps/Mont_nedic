import React, { useState } from "react";
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
        message: "",
        captcha: "",
    });

    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaCorrect, setCaptchaCorrect] = useState(false);

    const captchaCode = "1234"; // Beispiel-Captcha-Code

    const handleContactFormChange = (field, value) => {
        setContactForm({ ...contactForm, [field]: value });
    };

    const handleCaptchaChange = (value) => {
        setCaptchaInput(value);
        setCaptchaCorrect(value === captchaCode);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!captchaCorrect) {
            alert("Bitte lösen Sie das Captcha korrekt.");
            return;
        }
        console.log("Formular abgeschickt:", contactForm);
        alert("Vielen Dank! Ihr Formular wurde abgeschickt.");
        setContactForm({
            salutation: "",
            firstName: "",
            lastName: "",
            street: "",
            postalCode: "",
            city: "",
            country: "",
            phone: "",
            message: "",
            captcha: "",
        });
        setCaptchaInput("");
        setCaptchaCorrect(false);
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
                    Nachricht:
                    <textarea
                        maxLength="500"
                        value={contactForm.message}
                        onChange={(e) => handleContactFormChange("message", e.target.value)}
                    />
                    <small>{500 - contactForm.message.length} Zeichen verbleibend</small>
                </label>
                <label>
                    Captcha (Code: 1234):
                    <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => handleCaptchaChange(e.target.value)}
                    />
                </label>
                <button type="submit" disabled={!captchaCorrect}>
                    Abschicken
                </button>
            </form>

            <div className="faq-section">
                <h3>Häufig gestellte Fragen</h3>
                <details>
                    <summary>Wie erreiche ich den Kundenservice?</summary>
                    <p>Sie können uns telefonisch oder per E-Mail kontaktieren. Unsere Kontaktdaten finden Sie oben im Formular.</p>
                </details>
                <details>
                    <summary>Welche Öffnungszeiten hat unser Büro?</summary>
                    <p>Unser Büro ist von Montag bis Freitag von 9:00 bis 17:00 Uhr geöffnet.</p>
                </details>
                <details>
                    <summary>Wie kann ich meine Buchung ändern?</summary>
                    <p>Bitte kontaktieren Sie uns per E-Mail mit Ihrer Buchungsnummer, und wir helfen Ihnen weiter.</p>
                </details>
            </div>
        </div>
    );
}

export default Kontakt;
