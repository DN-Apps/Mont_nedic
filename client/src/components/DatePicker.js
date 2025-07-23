import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { de } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./styles.css"

function DatePicker({ selectedDates, setSelectedDates, initiallyOpen = false, readOnly = false }) {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    const [dateRange, setDateRange] = useState([
        {
            startDate: selectedDates?.startDate || new Date(),
            endDate: selectedDates?.endDate || new Date(),
            key: "selection",
        },
    ]);

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

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSelect = (ranges) => {
        if (!readOnly) {
            setDateRange([ranges.selection]);
            setSelectedDates(ranges.selection);
        }
    };

    // Heute als Mindestdatum
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Auf Mitternacht setzen für korrekte Vergleiche

    return (
        <div>
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
                <strong>Buchungszeitraum</strong>{" "}
                {selectedDates?.startDate && selectedDates?.endDate && (
                    <span>
                        {`(${selectedDates.startDate.toLocaleDateString("de-DE")} - ${selectedDates.endDate.toLocaleDateString("de-DE")})`}
                    </span>
                )}
            </div>
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