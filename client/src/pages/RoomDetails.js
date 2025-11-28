import React, { useEffect, useState } from 'react';
import './RoomDetails.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function RoomDetails() {
  const { t } = useTranslation();

  // Liste aller Zimmer aus der API
  const [rooms, setRooms] = useState([]);

  // IDs der Zimmer, deren Detailbereich ausgeklappt ist
  const [openRoomIds, setOpenRoomIds] = useState([]);

  // UI-Status für Ladeanzeige & Fehlermeldungen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API-URL aus ENV → ermöglicht flexiblen Backendwechsel
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  /* --------------------------------------------------------------
     BEI LADEN DER KOMPONENTE → Zimmerliste vom Backend abrufen
     - Fehlerbehandlung
     - i18n-Übersetzung der Zimmernamen
     - Status-Mapping (available/occupied)
     -------------------------------------------------------------- */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/rooms`);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Rooms API data:", data);

        /* ----------------------------------------------------------
           Daten in strukturierte Frontend-Objekte umwandeln:
           - Übersetzte Zimmernamen (falls vorhanden)
           - Verfügbarkeit (available/occupied)
           - fallback, falls API nicht alle Felder liefert
           ---------------------------------------------------------- */
        const mapped = data.map((room) => {
          const isAvailable = !!room.available;
          const statusRaw = room.statusRaw || (isAvailable ? 'available' : 'occupied');

          // Übersetzter Name: booking.general.rooms.<room.name>
          const translationKey = room.name
            ? `booking.general.rooms.${room.name}`
            : null;

          // Prüft, ob die Übersetzung existiert: wenn nicht → Originalname
          const translatedName =
            translationKey && t(translationKey) !== translationKey
              ? t(translationKey)
              : room.name || '';

          return {
            ...room,
            statusRaw, // für CSS-Klassen (z. B. .available / .occupied)
            status:
              statusRaw === 'available'
                ? t('booking.general.availability.available')
                : t('booking.general.availability.occupied'),
            displayName: translatedName,
          };
        });

        setRooms(mapped);
      } catch (err) {
        console.error('Fehler beim Laden der Zimmer:', err);
        setError(err.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [t]); // i18n-Wechsel → Zimmernamen neu übersetzen

  /* --------------------------------------------------------------
     Öffnet oder schließt den Detailbereich eines Zimmers
     - nutzt ID, um mehrere Räume unabhängig zu togglen
     -------------------------------------------------------------- */
  const toggleDetails = (id) => {
    setOpenRoomIds((prev) =>
      prev.includes(id)
        ? prev.filter((roomId) => roomId !== id)
        : [...prev, id]
    );
  };

  /* --------------------------------------------------------------
     Preisberechnung:
     - nimmt die Preise aus dem ERSTEN Eintrag der API
     - falls API keine Daten liefert → fallback-Werte
     -------------------------------------------------------------- */
  const priceSource = rooms[0] || {
    priceNight: 0,
    priceWeek: 0,
    priceMonth: 0,
  };

  /* --------------------------------------------------------------
     UI: Ladeindikator
     -------------------------------------------------------------- */
  if (loading) {
    return <div className="room-wrapper">{t('common.loading') || 'Lade Zimmer...'}</div>;
  }

  /* --------------------------------------------------------------
     UI: Fehlermeldung
     -------------------------------------------------------------- */
  if (error) {
    return (
      <div className="room-wrapper">
        {t('common.error') || 'Fehler beim Laden der Zimmer:'} {error}
      </div>
    );
  }

  /* --------------------------------------------------------------
     HAUPT-UI: Zimmerliste + Preise
     -------------------------------------------------------------- */
  return (
    <div className="room-wrapper">

      {/* Preisbox oben */}
      <div className="pricing-box">
        <div className="price-item">
          <span className="label">{t('booking.general.pricing.1night')}</span>
          <span className="value">{priceSource.priceNight} €</span>
        </div>
        <div className="price-item">
          <span className="label">{t('booking.general.pricing.1week')}</span>
          <span className="value">{priceSource.priceWeek} €</span>
        </div>
        <div className="price-item">
          <span className="label">{t('booking.general.pricing.1month')}</span>
          <span className="value">{priceSource.priceMonth} €</span>
        </div>
      </div>

      {/* Die Liste aller Zimmer */}
      <div className="room-container">
        {rooms.map((room) => {
          const isOpen = openRoomIds.includes(room.id);

          return (
            <div key={room.id} className="room-card">

              {/* Kopfbereich eines Zimmers: Name + Status + Pfeil */}
              <div className="room-header" onClick={() => toggleDetails(room.id)}>
                <h3>{room.displayName}</h3>

                <div className="status-row">
                  <span className={`status ${room.statusRaw}`}>
                    {room.status}
                  </span>

                  {/* Pfeil zeigt an, ob Details geöffnet sind */}
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* Detailbereich → nur sichtbar, wenn geöffnet */}
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
