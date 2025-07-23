import React, { useState } from 'react';
import './RoomDetails.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const rooms = [
  {
    id: 1,
    name: 'Zimmer 1',
    status: 'frei',
    details: '2 Einzelbetten, Schreibtisch, Kleiderschrank',
  },
  {
    id: 2,
    name: 'Zimmer 2',
    status: 'belegt',
    details: '1 Einzelbett, Schreibtisch, Kleiderschrank',
  },
  {
    id: 3,
    name: 'Zimmer 3',
    status: 'frei',
    details: '1 Einzelbett, Schreibtisch, Kleiderschrank',
  },
];

function RoomDetails() {
  const [openRoomIds, setOpenRoomIds] = useState([]);

  const toggleDetails = (id) => {
    if (openRoomIds.includes(id)) {
      // ID entfernen → schließt die Anzeige
      setOpenRoomIds(openRoomIds.filter((roomId) => roomId !== id));
    } else {
      // ID hinzufügen → öffnet die Anzeige
      setOpenRoomIds([...openRoomIds, id]);
    }
  };

  return (
    <div className="room-wrapper">
      <div className="pricing-box">
        <div className="price-item">
          <span className="label">1 Nacht</span>
          <span className="value">20 €</span>
        </div>
        <div className="price-item">
          <span className="label">7 Nächte</span>
          <span className="value">100 €</span>
        </div>
        <div className="price-item">
          <span className="label">1 Monat</span>
          <span className="value">400 €</span>
        </div>
      </div>

      <div className="room-container">
        {rooms.map((room) => {
          const isOpen = openRoomIds.includes(room.id);

          return (
            <div key={room.id} className="room-card">
              <div className="room-header" onClick={() => toggleDetails(room.id)}>
                <h3>{room.name}</h3>
                <div className="status-row">
                  <span className={`status ${room.status}`}>{room.status}</span>
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              {isOpen && (
                <div className="room-details">
                  <p>{room.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomDetails;
