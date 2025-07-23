import React, { useState } from "react";
import DatePicker from "./DatePicker";
import "./styles.css";
import RoomDetails from "../pages/RoomDetails";

function BookingForm() {
    const [step, setStep] = useState(1);
    const [bookingDates, setBookingDates] = useState(null);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [isPeriodVisible, setIsPeriodVisible] = useState(false);
    const [isRoomsVisible, setIsRoomsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;


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
        email: "", // NEU: E-Mail-Feld hinzugefügt
    });

    const isContactFormValid = () => {
        return (
            contactForm.firstName.trim() &&
            contactForm.lastName.trim() &&
            contactForm.street.trim() &&
            contactForm.postalCode.trim() &&
            contactForm.city.trim() &&
            contactForm.country.trim() &&
            contactForm.phone.trim() &&
            contactForm.email.trim() && // NEU: E-Mail-Validierung
            contactForm.email.includes('@') // Einfache E-Mail-Validierung
        );
    };

    const isNextDisabled =
        (step === 1 && !bookingDates) ||
        (step === 2 && selectedRooms.length === 0) ||
        (step === 3 && !isContactFormValid());

    const goToNextStep = () => {
        if (!isNextDisabled) setStep((prev) => prev + 1);
    };

    const goToPreviousStep = () => setStep((prev) => prev - 1);

    const addRoom = () => {
        if (selectedRooms.length < 3) {
            setSelectedRooms((prev) => [...prev, { id: prev.length + 1, type: "Einbettzimmer", pricePerDay: 20 }]);
        }
    };

    const removeRoom = (id) => {
        setSelectedRooms((prev) => prev.filter((room) => room.id !== id));
    };

    const calculateRoomTotal = (room, nights) => {
        let remainingNights = nights;
        let roomTotal = 0;

        while (remainingNights > 0) {
            const nightsToCharge = Math.min(5, remainingNights);
            roomTotal += nightsToCharge * room.pricePerDay;
            remainingNights -= 7;
        }

        return Math.min(roomTotal, 400); // Maximal 400€ pro Zimmer
    };

    const calculateTotal = () => {
        if (!bookingDates) return 0;

        const nights = calculateDateDifference();
        return selectedRooms.reduce((total, room) => total + calculateRoomTotal(room, nights), 0);
    };

    const handleContactFormChange = (field, value) => {
        setContactForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const calculateDateDifference = () => {
        if (!bookingDates) return 0;

        const startDate = new Date(bookingDates.startDate);
        const endDate = new Date(bookingDates.endDate);
        const differenceInTime = endDate - startDate;

        return differenceInTime / (1000 * 3600 * 24);
    };

    // NEU: Funktion zum Absenden der Buchung
    const submitBooking = async () => {
        setIsSubmitting(true);

        const bookingData = {
            bookingDates,
            selectedRooms,
            contactForm
        };

        try {
            // In der submitBooking-Funktion (Zeile 109)
            //lokal muss da 'http://localhost:5001/api/booking' hin
            const response = await fetch(`${API_URL}/api/booking`, { // Geändert von 3001 auf 5001
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (result.success) {
                alert("Buchungsanfrage erfolgreich versendet! Sie erhalten eine Bestätigungsmail.");
                // Optional: Formular zurücksetzen oder zu einer Erfolgsseite weiterleiten
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
                alert("Fehler beim Versenden: " + result.message);
            }
        } catch (error) {
            console.error("Fehler:", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = ["Buchungsdatum", "Zimmerauswahl", "Kontaktdaten", "Zusammenfassung"];

    return (
        <div>
            <RoomDetails></RoomDetails>
            <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", marginBottom: "15vh" }} className="bookingform">
                <div className="progress-bar" style={{ display: "flex", marginBottom: "20px" }}>
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

                <h2>Schritt {step} von 4</h2>

                {step === 1 && (
                    <div>
                        <h3>Buchungsdatum</h3>
                        <DatePicker
                            selectedDates={bookingDates}
                            setSelectedDates={setBookingDates}
                            initiallyOpen={true}
                            readOnly={false}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} disabled={step === 1} style={buttonStyle}>Zurück</button>
                            <button
                                onClick={goToNextStep}
                                disabled={isNextDisabled}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: isNextDisabled ? "#ccc" : "#007BFF",
                                    cursor: isNextDisabled ? "not-allowed" : "pointer",
                                }}
                            >Weiter</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3>Zimmerauswahl</h3>
                        <DatePicker
                            selectedDates={bookingDates}
                            setSelectedDates={setBookingDates}
                            initiallyOpen={false}
                            readOnly={true}
                        />
                        <p>Zeitraum: {`${bookingDates.startDate.toLocaleDateString("de-DE")} - ${bookingDates.endDate.toLocaleDateString("de-DE")}`}</p>

                        <div style={{ margin: "20px 0" }}>
                            <h4>Gewählte Zimmer:</h4>
                            {selectedRooms.length === 0 && <p>Keine Zimmer ausgewählt.</p>}
                            {selectedRooms.map((room) => (
                                <div key={room.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                                    <span>{room.type} - {room.pricePerDay}€/Tag</span>
                                    <button onClick={() => removeRoom(room.id)} style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "5px" }}>Entfernen</button>
                                </div>
                            ))}
                        </div>

                        {selectedRooms.length < 3 && (
                            <button onClick={addRoom} style={{ ...buttonStyle, backgroundColor: "#28a745" }}>Zimmer hinzufügen</button>
                        )}

                        <h4>Gesamtkosten: {calculateTotal()}€</h4>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} style={buttonStyle}>Zurück</button>
                            <button onClick={goToNextStep} disabled={isNextDisabled} style={{ ...buttonStyle, backgroundColor: selectedRooms.length > 0 ? "#007BFF" : "#ccc", cursor: selectedRooms.length > 0 ? "pointer" : "not-allowed" }}>Weiter</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3>Kontaktdaten</h3>

                        <div className="summary">
                            <h4 onClick={() => setIsPeriodVisible(!isPeriodVisible)} style={{ cursor: "pointer" }}>
                                Buchungszeitraum {isPeriodVisible ? "▲" : "▼"}
                            </h4>
                            {isPeriodVisible && (
                                <p>
                                    Zeitraum: {`${bookingDates.startDate.toLocaleDateString("de-DE")} - ${bookingDates.endDate.toLocaleDateString("de-DE")}`}<br />
                                    Dauer: {calculateDateDifference()} Nächte
                                </p>
                            )}
                        </div>

                        <div className="summary">
                            <h4 onClick={() => setIsRoomsVisible(!isRoomsVisible)} style={{ cursor: "pointer" }}>
                                Gewählte Zimmer {isRoomsVisible ? "▲" : "▼"}
                            </h4>
                            {isRoomsVisible &&
                                selectedRooms.map((room) => (
                                    <div key={room.id}>
                                        {room.type} - {room.pricePerDay}€/Tag <br />
                                        Gesamtkosten für {calculateDateDifference()} Nächte: {calculateRoomTotal(room, calculateDateDifference())}€
                                    </div>
                                ))}
                        </div>

                        <div className="step-3-form">
                            <label>
                                Anrede:
                                <select value={contactForm.salutation} onChange={(e) => handleContactFormChange("salutation", e.target.value)}>
                                    <option value="">Bitte auswählen</option>
                                    <option value="Herr">Herr</option>
                                    <option value="Frau">Frau</option>
                                    <option value="Sonstige">Sonstige</option>
                                </select>
                            </label>
                            <label>Vorname:<input type="text" value={contactForm.firstName} onChange={(e) => handleContactFormChange("firstName", e.target.value)} /></label>
                            <label>Nachname:<input type="text" value={contactForm.lastName} onChange={(e) => handleContactFormChange("lastName", e.target.value)} /></label>
                            <label>Firma (optional):<input type="text" value={contactForm.company} onChange={(e) => handleContactFormChange("company", e.target.value)} /></label>
                            <label>Straße:<input type="text" value={contactForm.street} onChange={(e) => handleContactFormChange("street", e.target.value)} /></label>
                            <label>Postleitzahl:<input type="text" value={contactForm.postalCode} onChange={(e) => handleContactFormChange("postalCode", e.target.value)} /></label>
                            <label>Stadt:<input type="text" value={contactForm.city} onChange={(e) => handleContactFormChange("city", e.target.value)} /></label>
                            <label>
                                Land:
                                <select value={contactForm.country} onChange={(e) => handleContactFormChange("country", e.target.value)}>
                                    <option value="">Bitte auswählen</option>
                                    <option value="Deutschland">Deutschland</option>
                                    <option value="Frankreich">Frankreich</option>
                                    <option value="Italien">Italien</option>
                                    <option value="Spanien">Spanien</option>
                                    <option value="Österreich">Österreich</option>
                                    <option value="Schweiz">Schweiz</option>
                                </select>
                            </label>
                            <label>Tel./Mobil:<input type="tel" value={contactForm.phone} onChange={(e) => handleContactFormChange("phone", e.target.value)} /></label>
                            <label>E-Mail:<input type="email" value={contactForm.email} onChange={(e) => handleContactFormChange("email", e.target.value)} required /></label>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} style={buttonStyle}>Zurück</button>
                            <button onClick={goToNextStep} disabled={isNextDisabled} style={{ ...buttonStyle, backgroundColor: isNextDisabled ? "#ccc" : "#007BFF", cursor: isNextDisabled ? "not-allowed" : "pointer" }}>Weiter</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3>Zusammenfassung</h3>
                        <div className="summary">
                            <h4>Buchungszeitraum</h4>
                            <p>
                                Zeitraum: {`${bookingDates.startDate.toLocaleDateString("de-DE")} - ${bookingDates.endDate.toLocaleDateString("de-DE")}`}<br />
                                Dauer: {calculateDateDifference()} Nächte
                            </p>
                        </div>

                        <div className="summary">
                            <h4>Gewählte Zimmer</h4>
                            {selectedRooms.map((room) => (
                                <div key={room.id}>
                                    {room.type} - {room.pricePerDay}€/Tag <br />
                                    Gesamtkosten für {calculateDateDifference()} Nächte: {calculateRoomTotal(room, calculateDateDifference())}€
                                </div>
                            ))}
                            <h4>Gesamtkosten: {calculateTotal()}€</h4>
                        </div>

                        <div className="summary">
                            <h4>Kontaktdaten</h4>
                            <p>
                                Anrede: {contactForm.salutation} <br />
                                Vorname: {contactForm.firstName} <br />
                                Nachname: {contactForm.lastName} <br />
                                {contactForm.company && <>Firma: {contactForm.company} <br /></>}
                                Straße: {contactForm.street} <br />
                                Postleitzahl: {contactForm.postalCode} <br />
                                Stadt: {contactForm.city} <br />
                                Land: {contactForm.country} <br />
                                Tel./Mobil: {contactForm.phone} <br />
                                E-Mail: {contactForm.email}
                            </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <button onClick={goToPreviousStep} style={buttonStyle}>Zurück</button>
                            <button
                                onClick={submitBooking}
                                disabled={isSubmitting}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: isSubmitting ? "#ccc" : "#28a745",
                                    cursor: isSubmitting ? "not-allowed" : "pointer"
                                }}
                            >
                                {isSubmitting ? "Wird versendet..." : "Buchung abschließen"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

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