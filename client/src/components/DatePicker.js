import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DateRange } from "react-date-range";
import { de } from "date-fns/locale";
import "react-date-range/dist/styles.css";       // Basis-Styles des DatePickers
import "react-date-range/dist/theme/default.css"; // Default Theme
import "./styles.css";                            // Deine eigenen Overrides

function DatePicker({ selectedDates, setSelectedDates, initiallyOpen = false, readOnly = false }) {
    // Steuert, ob der Kalender sichtbar ist
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    const { t } = useTranslation();

    /* ------------------------------------------------------------------
       Interner State für das DateRange-Picker-Objekt
       - Initialwert: Entweder übergebene Daten oder "heute"
       - dateRange ist ein Array, weil react-date-range so arbeitet
       ------------------------------------------------------------------ */
    const [dateRange, setDateRange] = useState([
        {
            startDate: selectedDates?.startDate || new Date(),
            endDate: selectedDates?.endDate || new Date(),
            key: "selection",
        },
    ]);

    /* ------------------------------------------------------------------
       Anpassung, wenn die übergebenen Props sich ändern:
       - Falls im Parent neue Daten gesetzt werden (z.B. Reset),
         wird das DateRange-Objekt aktualisiert.
       ------------------------------------------------------------------ */
    useEffect(() => {
        if (selectedDates) {
            setDateRange([
                {
                    startDate: selectedDates.startDate,
                    endDate: selectedDates.endDate,
                    key: "selection",
                },
            ]);
        }
    }, [selectedDates]);

    // Öffnet oder schließt den DatePicker
    const toggleOpen = () => setIsOpen(!isOpen);

    /* ------------------------------------------------------------------
       Wird aufgerufen, wenn der User einen Zeitraum auswählt:
       - readOnly-Modus verhindert Änderungen
       - ansonsten: Datum im lokalen State + Parent-Komponente setzen
       ------------------------------------------------------------------ */
    const handleSelect = (ranges) => {
        if (!readOnly) {
            setDateRange([ranges.selection]);
            setSelectedDates(ranges.selection);
        }
    };

    /* ------------------------------------------------------------------
       Mindestdatum:
       Heute → keine Buchungen in der Vergangenheit
       Stunden werden nullgesetzt, um korrekte Vergleiche zu sichern
       ------------------------------------------------------------------ */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div>
            {/* ----------------------------------------------------------
                Header / "Trigger-Bereich"
                - zeigt aktuellen Zeitraum
                - klickbar zum Ein-/Ausklappen des Kalenders
               ---------------------------------------------------------- */}
            <div
                style={{
                    backgroundColor: "#f4f4f4",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    marginBottom: "10px",
                }}
                onClick={toggleOpen}
            >
                <strong>{t("booking.general.datePicker.bookingPeriod")}</strong>{" "}
                {selectedDates?.startDate && selectedDates?.endDate && (
                    <span>
                        {`(${selectedDates.startDate.toLocaleDateString("de-DE")} - ${selectedDates.endDate.toLocaleDateString("de-DE")})`}
                    </span>
                )}
            </div>

            {/* ----------------------------------------------------------
                Der eigentliche DatePicker
                - wird nur angezeigt, wenn isOpen === true
                - readOnly blockiert die Datumsauswahl (z.B. in Zusammenfassung)
               ---------------------------------------------------------- */}
            {isOpen && !readOnly && (
                <DateRange
                    editableDateInputs={true}
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    locale={de}
                    minDate={today}
                />
            )}
        </div>
    );
}

export default DatePicker;
