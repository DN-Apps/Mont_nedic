import React, { useState, useEffect } from "react";
import "./Kontakt.css";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const API_URL = process.env.REACT_APP_API_URL;

    const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

    useEffect(() => {
        setCaptchaCode(generateCaptcha());
    }, []);

    const handleContactFormChange = (field, value) => {
        setContactForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCountryChange = (value) => {
        handleContactFormChange("country", value);
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
            alert(t('contact.errors.captcha'));
            setCaptchaCode(generateCaptcha());
            setCaptchaInput("");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactForm),
            });

            const result = await response.json();
            if (result.success) {
                alert(t('contact.success'));
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
                alert(t('contact.errors.send') + result.message);
            }
        } catch (err) {
            console.error("Fehler beim Senden:", err);
            alert(t('contact.errors.generic'));
        }
    };

    return (
        <div className="kontakt-container">
            <h2>{t('contact.heading')}</h2>
            <form onSubmit={handleSubmit} className="kontakt-form">
                <div className="kontakt-form-group">
                    <label>
                        {t('contact.salutation')}:
                        <select value={contactForm.salutation} onChange={e => handleContactFormChange("salutation", e.target.value)}>
                            <option value="">{t('contact.salutationOptions.pleaseSelect')}</option>
                            <option value="Herr">{t('contact.salutationOptions.mr')}</option>
                            <option value="Frau">{t('contact.salutationOptions.ms')}</option>
                            <option value="Sonstige">{t('contact.salutationOptions.other')}</option>
                        </select>
                    </label>

                    <div className="kontakt-grid">
                        <label>
                            {t('contact.firstName')}:
                            <input type="text" value={contactForm.firstName} onChange={e => handleContactFormChange("firstName", e.target.value)} />
                        </label>
                        <label>
                            {t('contact.lastName')}:
                            <input type="text" value={contactForm.lastName} onChange={e => handleContactFormChange("lastName", e.target.value)} />
                        </label>

                        <label>
                            {t('contact.country')}:
                            <select value={contactForm.country} onChange={e => handleCountryChange(e.target.value)}>
                                <option value="">{t('contact.salutationOptions.pleaseSelect')}</option>
                                <option>Deutschland</option>
                                <option>Österreich</option>
                                <option>Schweiz</option>
                                <option>Frankreich</option>
                            </select>
                        </label>

                        <label>
                            {t('contact.postalCode')}:
                            <input
                                type="text"
                                value={contactForm.postalCode}
                                onChange={e => handlePostalCodeChange(e.target.value)}
                                maxLength="5"
                                className={cityFound ? "input-success" : ""}
                            />
                            {isLoadingCity && <small className="kontakt-info">{t('contact.loadingCity')}</small>}
                            {cityFound && !isLoadingCity && <small className="kontakt-success">{t('contact.cityFound')}</small>}
                        </label>

                        <label>
                            {t('contact.city')}:
                            <input
                                type="text"
                                value={contactForm.city}
                                readOnly={contactForm.country === "Deutschland"}
                                placeholder={contactForm.country === "Deutschland" ? t('contact.placeholder.cityAuto') : t('contact.placeholder.cityManual')}
                                onChange={e => handleContactFormChange("city", e.target.value)}
                                className={contactForm.country === "Deutschland" ? "readonly-input" : ""}
                            />
                        </label>
                    </div>

                    <label>
                        {t('contact.street')}:
                        <input type="text" value={contactForm.street} onChange={e => handleContactFormChange("street", e.target.value)} />
                    </label>

                    <label>
                        {t('contact.phone')}:
                        <input type="tel" value={contactForm.phone} onChange={e => handleContactFormChange("phone", e.target.value)} />
                    </label>

                    <label>
                        {t('contact.email')}:
                        <input type="email" value={contactForm.email} onChange={e => handleContactFormChange("email", e.target.value)} required />
                    </label>

                    <label>
                        {t('contact.message')}:
                        <textarea maxLength="500" value={contactForm.message} onChange={e => handleContactFormChange("message", e.target.value)} />
                        <small className="kontakt-info">
                            {t('contact.remainingCharacters', { count: 500 - contactForm.message.length })}
                        </small>
                    </label>

                    <label>
                        {t('contact.captchaLabel')}: <span className="kontakt-captcha-code">{captchaCode}
                            <input
                                type="text"
                                placeholder={t('contact.placeholder.captcha')}
                                value={captchaInput}
                                onChange={e => handleCaptchaChange(e.target.value)}
                                maxLength={4}
                            />
                            {captchaInput.length === 4 && !captchaCorrect && (
                                <small className="kontakt-error">{t('contact.captchaIncorrect')}</small>
                            )}
                            {captchaInput.length === 4 && captchaCorrect && (
                                <small className="kontakt-success">{t('contact.captchaCorrect')}</small>
                            )}
                        </span>
                    </label>

                    <button type="submit" className="kontakt-button" disabled={!captchaCorrect}>
                        {t('contact.submit')}
                    </button>
                </div>
            </form>

            <div className="faq-section">
                <h3>{t('contact.faqTitle')}</h3>
                <details>
                    <summary>{t('contact.faq.rooms.q')}</summary>
                    <p>{t('contact.faq.rooms.a')}</p>
                </details>
                <details>
                    <summary>{t('contact.faq.included.q')}</summary>
                    <p>{t('contact.faq.included.a')}</p>
                </details>
                <details>
                    <summary>{t('contact.faq.contact.q')}</summary>
                    <p>{t('contact.faq.contact.a')}</p>
                </details>
            </div>
        </div>
    );
}

export default Kontakt;
