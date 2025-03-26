import React from "react";
import BookingForm from "../components/BookingForm";
import "./Buchung.css"

function Buchung() {
    return (
        <div className="buchung">
            <h5 className="pageBuchung">Buchung</h5>
            <BookingForm />
        </div>
    );
}

export default Buchung;
