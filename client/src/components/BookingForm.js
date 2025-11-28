import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "./DatePicker";
import "./styles.css";
import RoomDetails from "../pages/RoomDetails";

function BookingForm() {

    /* ---------------------------------------------------------------
       🌐 i18n Hook für Mehrsprachigkeit
    --------------------------------------------------------------- */
    const { t } = useTranslation();

    /* ---------------------------------------------------------------
       🔄 Buchungsprozess-Statusverwaltung
       - step: aktueller Schritt (1–4)
       - bookingDates: vom DatePicker gewählte Daten
       - selectedRooms: dynamische Liste der ausgewählten Zimmer
    --------------------------------------------------------------- */
    const [step, setStep] = useState(1);
    const [bookingDates, setBookingDates] = useState(null);
    const [selectedRooms, setSelectedRooms] = useState([]);

    /* ---------------------------------------------------------------
       🔽 UI-Zustände für Zusammenklappbereiche (Akkordeons)
    --------------------------------------------------------------- */
    const [isPeriodVisible, setIsPeriodVisible] = useState(false);
    const [isRoomsVisible, setIsRoomsVisible] = useState(false);

    /* ---------------------------------------------------------------
       📤 Absende-Status (um Button zu sperren)
    --------------------------------------------------------------- */
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ---------------------------------------------------------------
       🌍 API-URL aus .env Datei
    --------------------------------------------------------------- */
    const API_URL = process.env.REACT_APP_API_URL;

    /* ---------------------------------------------------------------
       🧾 Kontaktformular-Status
    --------------------------------------------------------------- */
    const [contactForm, setContactForm] = useState({
        salutation: "",
        firstName: "",
        lastName: "",
        company: "",
        street: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
        email: "",
    });

    /* ---------------------------------------------------------------
       📌 Validierung des Kontaktformulars
       - prüft, ob alle Pflichtfelder logisch befüllt sind
       - Basisprüfung der E-Mail
    --------------------------------------------------------------- */
    const isContactFormValid = () => {
        return (
            contactForm.firstName.trim() &&
            contactForm.lastName.trim() &&
            contactForm.street.trim() &&
            contactForm.postalCode.trim() &&
            contactForm.city.trim() &&
            contactForm.country.trim() &&
            contactForm.phone.trim() &&
            contactForm.email.trim() &&
            contactForm.email.includes('@')
        );
    };

    /* ---------------------------------------------------------------
       🔒 Regeln zum Deaktivieren des Weiter-Buttons
    --------------------------------------------------------------- */
    const isNextDisabled =
        (step === 1 && !bookingDates) ||
        (step === 2 && selectedRooms.length === 0) ||
        (step === 3 && !isContactFormValid());

    /* ---------------------------------------------------------------
       ➡️ Schritt wechseln (nur wenn gültig)
    --------------------------------------------------------------- */
    const goToNextStep = () => {
        if (!isNextDisabled) setStep((prev) => prev + 1);
    };

    /* ---------------------------------------------------------------
       ⬅️ Zurück navigieren
    --------------------------------------------------------------- */
    const goToPreviousStep = () => setStep((prev) => prev - 1);

    /* ---------------------------------------------------------------
       🛏️ Zimmer hinzufügen (maximal 3)
       - einfache Beispiel-Struktur
    --------------------------------------------------------------- */
    const addRoom = () => {
        if (selectedRooms.length < 3) {
            setSelectedRooms((prev) => [
                ...prev,
                { id: prev.length + 1, type: "Einbettzimmer", pricePerDay: 20 }
            ]);
        }
    };

    /* ---------------------------------------------------------------
       ❌ Zimmer entfernen
    --------------------------------------------------------------- */
    const removeRoom = (id) => {
        setSelectedRooms((prev) => prev.filter((room) => room.id !== id));
    };

    /* ---------------------------------------------------------------
       💶 Preislogik pro Zimmer
       - z.B. Wochenpreisregel: 5 Nächte zahlen, 7 Nächte bleiben
       - maximal 400€ pro Zimmer
    --------------------------------------------------------------- */
    const calculateRoomTotal = (room, nights) => {
        let remainingNights = nights;
        let roomTotal = 0;

        while (remainingNights > 0) {
            const nightsToCharge = Math.min(5, remainingNights);
            roomTotal += nightsToCharge * room.pricePerDay;
            remainingNights -= 7;
        }

        return Math.min(roomTotal, 400);
    };

    /* ---------------------------------------------------------------
       💶 Gesamtpreis aller Zimmer
    --------------------------------------------------------------- */
    const calculateTotal = () => {
        if (!bookingDates) return 0;
        const nights = calculateDateDifference();
        return selectedRooms.reduce((total, room) =>
            total + calculateRoomTotal(room, nights), 0
        );
    };

    /* ---------------------------------------------------------------
       🔄 Kontaktformular aktualisieren
    --------------------------------------------------------------- */
    const handleContactFormChange = (field, value) => {
        setContactForm((prev) => ({ ...prev, [field]: value }));
    };

    /* ---------------------------------------------------------------
       📍 Wenn Land geändert → PLZ/Ort zurücksetzen (nur DE hat auto-Suche)
    --------------------------------------------------------------- */
    const handleCountryChange = (value) => {
        handleContactFormChange("country", value);

        if (value !== "Deutschland") {
            handleContactFormChange("postalCode", "");
            handleContactFormChange("city", "");
            setCityFound(false);
        }
    };

    /* ---------------------------------------------------------------
       🛰️ PLZ → Stadt Autovervollständigung über OpenStreetMap
    --------------------------------------------------------------- */
    const [isLoadingCity, setIsLoadingCity] = useState(false);
    const [cityFound, setCityFound] = useState(false);

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

    /* ---------------------------------------------------------------
       🏙️ PLZ-Eingabe → automatische Städtelogik
    --------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------
       📅 Anzahl Nächte berechnen
    --------------------------------------------------------------- */
    const calculateDateDifference = () => {
        if (!bookingDates) return 0;

        const startDate = new Date(bookingDates.startDate);
        const endDate = new Date(bookingDates.endDate);
        return (endDate - startDate) / (1000 * 3600 * 24);
    };

    /* ---------------------------------------------------------------
       📤 Buchungsdaten an Server schicken
       – inkl. Fehlerbehandlung und UI-Feedback
    --------------------------------------------------------------- */
    const submitBooking = async () => {
        setIsSubmitting(true);

        const bookingData = {
            bookingDates,
            selectedRooms,
            contactForm
        };

        try {
            const response = await fetch(`${API_URL}/api/booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (result.success) {
                alert(t('booking.general.sending.success'));

                // Formular zurücksetzen
                setStep(1);
                setBookingDates(null);
                setSelectedRooms([]);
                setContactForm({
                    salutation: "",
                    firstName: "",
                    lastName: "",
                    company: "",
                    street: "",
                    postalCode: "",
                    city: "",
                    country: "",
                    phone: "",
                    email: "",
                });

            } else {
                alert(`${t('booking.general.sending.errorTitle')} ${result.message || t('booking.general.sending.error')}`);
            }
        } catch (error) {
            console.error(t("booking.general.sending.errorTitle"), error);
            alert(t("booking.general.sending.error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------------------------------------------------------------
       🌐 Texte für Fortschrittsanzeige
    --------------------------------------------------------------- */
    const steps = [
        t('booking.step1.bookingDate'),
        t('booking.step2.roomSelection'),
        t('booking.step3.contactInformation'),
        t('booking.step4.summary')
    ];

    /* =================================================================
       =========================== RENDER ===============================
       ================================================================= */
    return (
        <div>

            {/* --------------------------
                Zimmer-Übersicht-Komponente
            --------------------------- */}
            <RoomDetails />

            {/* Hauptformular-Container */}
            <div
                style={{ padding: "20px", maxWidth: "800px", margin: "auto", marginBottom: "15vh" }}
                className="bookingform"
            >

                {/* -----------------------------------------------------
                    📊 Fortschrittsleiste
                ----------------------------------------------------- */}
                <div className="progress-bar">
                    {steps.map((label, index) => (
                        <div
                            key={index}
                            style={{
                                flex: 1,
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: step === index + 1 ? "#007BFF" : "#e9ecef",
                                color: step === index + 1 ? "white" : "black",
                                borderRight: index < steps.length - 1 ? "2px solid white" : "none",
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <h2>{t('booking.step1.step')} {step} {t('booking.step1.of')} 4</h2>

                {/* ======================================================
                   STEP 1: Datumsauswahl
                   ====================================================== */}
                {step === 1 && (
                    <div>
                        <h3>{t('booking.step1.bookingDate')}</h3>

                        <DatePicker
                            selectedDates={bookingDates}
                            setSelectedDates={setBookingDates}
                            initiallyOpen={true}
                            readOnly={false}
                        />

                        {/* Navigation */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} disabled={step === 1} style={buttonStyle}>
                                {t('booking.general.buttons.buttonBack')}
                            </button>

                            <button
                                onClick={goToNextStep}
                                disabled={isNextDisabled}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: isNextDisabled ? "#ccc" : "#007BFF",
                                    cursor: isNextDisabled ? "not-allowed" : "pointer",
                                }}
                            >
                                {t('booking.general.buttons.buttonContinue')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ======================================================
                   STEP 2: Zimmerauswahl
                   ====================================================== */}
                {step === 2 && (
                    <div>
                        <h3>{t('booking.step2.roomSelection')}</h3>

                        {/* Datum anzeigen, aber nicht editierbar */}
                        <DatePicker
                            selectedDates={bookingDates}
                            setSelectedDates={setBookingDates}
                            initiallyOpen={false}
                            readOnly={true}
                        />

                        <p>
                            {t('booking.step2.period')}: {bookingDates.startDate.toLocaleDateString("de-DE")}
                            {" - "}
                            {bookingDates.endDate.toLocaleDateString("de-DE")}
                        </p>

                        {/* Zimmerliste */}
                        <div style={{ margin: "20px 0" }}>
                            <h4>{t('booking.step2.selectedRooms')}:</h4>

                            {selectedRooms.length === 0 && (
                                <p>{t('booking.step2.noSelection')}.</p>
                            )}

                            {selectedRooms.map((room) => (
                                <div
                                    key={room.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px",
                                        marginBottom: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px"
                                    }}
                                >
                                    <span>
                                        {room.type} - {room.pricePerDay}€/{t('booking.step2.night')}
                                    </span>

                                    <button
                                        onClick={() => removeRoom(room.id)}
                                        style={{
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            cursor: "pointer",
                                            borderRadius: "5px"
                                        }}
                                    >
                                        {t('booking.step2.delete')}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Zimmer hinzufügen */}
                        {selectedRooms.length < 3 && (
                            <button
                                onClick={addRoom}
                                style={{ ...buttonStyle, backgroundColor: "#28a745" }}
                            >
                                {t('booking.step2.add')}
                            </button>
                        )}

                        <h4>
                            {t('booking.step2.totalCosts')}: {calculateTotal()}€
                        </h4>

                        {/* Navigation */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} style={buttonStyle}>
                                {t('booking.general.buttons.buttonBack')}
                            </button>

                            <button
                                onClick={goToNextStep}
                                disabled={isNextDisabled}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: selectedRooms.length > 0 ? "#007BFF" : "#ccc",
                                    cursor: selectedRooms.length > 0 ? "pointer" : "not-allowed"
                                }}
                            >
                                {t('booking.general.buttons.buttonContinue')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ======================================================
                   STEP 3: Kontaktinformationen
                   ====================================================== */}
                {step === 3 && (
                    <div>
                        <h3>{t('booking.step3.contactInformation')}</h3>

                        {/* --- Buchungszeitraum (ausklappbar) --- */}
                        <div className="summary">
                            <h4 onClick={() => setIsPeriodVisible(!isPeriodVisible)}>
                                {t('booking.step3.bookingPeriod')} {isPeriodVisible ? "▲" : "▼"}
                            </h4>

                            {isPeriodVisible && (
                                <p>
                                    {t('booking.step3.period')}:{" "}
                                    {bookingDates.startDate.toLocaleDateString("de-DE")} -{" "}
                                    {bookingDates.endDate.toLocaleDateString("de-DE")}<br />
                                    {t('booking.step3.duration')}: {calculateDateDifference()}{" "}
                                    {t('booking.step3.nights')}
                                </p>
                            )}
                        </div>

                        {/* --- Zimmerübersicht (ausklappbar) --- */}
                        <div className="summary">
                            <h4 onClick={() => setIsRoomsVisible(!isRoomsVisible)}>
                                {t('booking.step3.selectedRooms')} {isRoomsVisible ? "▲" : "▼"}
                            </h4>

                            {isRoomsVisible &&
                                selectedRooms.map((room) => (
                                    <div key={room.id}>
                                        {room.type} - {room.pricePerDay}€/{t('booking.step3.night')}<br />
                                        {t('booking.step3.totalCostsFor')}{" "}
                                        {calculateDateDifference()} {t('booking.step3.nights')}:{" "}
                                        {calculateRoomTotal(room, calculateDateDifference())}€
                                    </div>
                                ))}
                        </div>

                        {/* --- Kontaktformular --- */}
                        <div className="step-3-form">
                            <label>
                                {t('booking.step3.salutation')}:
                                <select
                                    value={contactForm.salutation}
                                    onChange={(e) => handleContactFormChange("salutation", e.target.value)}
                                >
                                    <option value="">{t('booking.step3.selectSalutation')}</option>
                                    <option value="Herr">{t('booking.step3.mr')}</option>
                                    <option value="Frau">{t('booking.step3.ms')}</option>
                                    <option value="Sonstige">{t('booking.step3.other')}</option>
                                </select>
                            </label>

                            <label>
                                {t('booking.step3.firstName')}:
                                <input
                                    type="text"
                                    value={contactForm.firstName}
                                    onChange={(e) => handleContactFormChange("firstName", e.target.value)}
                                />
                            </label>

                            <label>
                                {t('booking.step3.lastName')}:
                                <input
                                    type="text"
                                    value={contactForm.lastName}
                                    onChange={(e) => handleContactFormChange("lastName", e.target.value)}
                                />
                            </label>

                            <label>
                                {t('booking.step3.companyOpt')}:
                                <input
                                    type="text"
                                    value={contactForm.company}
                                    onChange={(e) => handleContactFormChange("company", e.target.value)}
                                />
                            </label>

                            <label>
                                {t('booking.step3.country')}:
                                <select
                                    value={contactForm.country}
                                    onChange={e => handleCountryChange(e.target.value)}
                                >
                                    <option value="">{t('booking.step3.selectCountry')}</option>
                                    <option value="Deutschland">Deutschland</option>
                                    <option value="Frankreich">Frankreich</option>
                                    <option value="Italien">Italien</option>
                                    <option value="Spanien">Spanien</option>
                                    <option value="Österreich">Österreich</option>
                                    <option value="Schweiz">Schweiz</option>
                                </select>
                            </label>

                            <label>
                                {t('booking.step3.postalCode')}:
                                <input
                                    type="text"
                                    value={contactForm.postalCode}
                                    maxLength="5"
                                    onChange={(e) => handlePostalCodeChange(e.target.value)}
                                />
                                {isLoadingCity && (
                                    <small className="kontakt-info">🔍 {t('booking.step3.searchingForCity')}</small>
                                )}
                                {cityFound && !isLoadingCity && (
                                    <small className="kontakt-success">✓ {t('booking.step3.cityFound')}</small>
                                )}
                            </label>

                            <label>
                                {t('booking.step3.city')}:
                                <input
                                    type="text"
                                    value={contactForm.city}
                                    readOnly={contactForm.country === "Deutschland"}
                                    placeholder={
                                        contactForm.country === "Deutschland"
                                            ? t('booking.step3.autoFilled')
                                            : t('booking.step3.manuallyFilled')
                                    }
                                    onChange={(e) => handleContactFormChange("city", e.target.value)}
                                />
                            </label>

                            <label>
                                {t('booking.step3.street')}:
                                <input
                                    type="text"
                                    value={contactForm.street}
                                    onChange={(e) => handleContactFormChange("street", e.target.value)}
                                />
                            </label>

                            <label>
                                {t('booking.step3.mobile')}:
                                <input
                                    type="tel"
                                    value={contactForm.phone}
                                    onChange={(e) => handleContactFormChange("phone", e.target.value)}
                                />
                            </label>

                            <label>
                                {t('booking.step3.mail')}:
                                <input
                                    type="email"
                                    value={contactForm.email}
                                    required
                                    onChange={(e) => handleContactFormChange("email", e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Navigation */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} style={buttonStyle}>
                                {t('booking.general.buttons.buttonBack')}
                            </button>

                            <button
                                onClick={goToNextStep}
                                disabled={isNextDisabled}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: isNextDisabled ? "#ccc" : "#007BFF",
                                    cursor: isNextDisabled ? "not-allowed" : "pointer"
                                }}
                            >
                                {t('booking.general.buttons.buttonContinue')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ======================================================
                   STEP 4: Zusammenfassung + Absenden
                   ====================================================== */}
                {step === 4 && (
                    <div>
                        <h3>{t("booking.step4.summary")}</h3>

                        {/* Buchungszeitraum */}
                        <div className="summary">
                            <h4>{t("booking.step4.bookingPeriod")}</h4>
                            <p>
                                {t("booking.step4.period")}:{" "}
                                {bookingDates.startDate.toLocaleDateString("de-DE")} -{" "}
                                {bookingDates.endDate.toLocaleDateString("de-DE")}
                                <br />
                                {t("booking.step4.duration")}: {calculateDateDifference()} Nächte
                            </p>
                        </div>

                        {/* Zimmerdetails */}
                        <div className="summary">
                            <h4>{t("booking.step4.selectedRooms")}</h4>

                            {selectedRooms.map((room) => (
                                <div key={room.id}>
                                    {room.type} - {room.pricePerDay}€/{t("booking.step4.night")}
                                    <br />
                                    {t("booking.step4.totalCostsFor")}
                                    {" "}
                                    {calculateDateDifference()} {t("booking.step4.nights")}:{" "}
                                    {calculateRoomTotal(room, calculateDateDifference())}€
                                </div>
                            ))}

                            <h4>{t("booking.step4.totalCosts")}: {calculateTotal()}€</h4>
                        </div>

                        {/* Kontaktinfos */}
                        <div className="summary">
                            <h4>{t("booking.step4.contactInformation")}</h4>
                            <p>
                                {t("booking.step4.salutation")}: {contactForm.salutation} <br />
                                {t("booking.step4.firstName")}: {contactForm.firstName} <br />
                                {t("booking.step4.lastName")}: {contactForm.lastName} <br />
                                {contactForm.company && (
                                    <>
                                        {t("booking.step4.company")}: {contactForm.company}
                                        <br />
                                    </>
                                )}
                                {t("booking.step4.street")}: {contactForm.street} <br />
                                {t("booking.step4.postalCode")}: {contactForm.postalCode} <br />
                                {t("booking.step4.city")}: {contactForm.city} <br />
                                {t("booking.step4.country")}: {contactForm.country} <br />
                                {t("booking.step4.mobile")}: {contactForm.phone} <br />
                                {t("booking.step4.mail")}: {contactForm.email}
                            </p>
                        </div>

                        {/* Absende-Buttons */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} style={buttonStyle}>
                                {t("booking.general.buttons.buttonBack")}
                            </button>

                            <button
                                onClick={submitBooking}
                                disabled={isSubmitting}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: isSubmitting ? "#ccc" : "#28a745",
                                    cursor: isSubmitting ? "not-allowed" : "pointer"
                                }}
                            >
                                {isSubmitting
                                    ? t("booking.step4.pendingSending")
                                    : t("booking.step4.requestBooking")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------
   Einheitliches Button-Styling
--------------------------------------------------------------- */
const buttonStyle = {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
};

export default BookingForm;
