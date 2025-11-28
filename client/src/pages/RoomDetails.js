import React, { useEffect, useState } from 'react';
import './RoomDetails.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function RoomDetails() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [openRoomIds, setOpenRoomIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_ROOMS_API_BASE || 'http://localhost:5001';

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

        const mapped = data.map((room) => {
          const isAvailable = !!room.available;
          const statusRaw = room.statusRaw || (isAvailable ? 'available' : 'occupied');

          // Übersetzter Name: booking.general.rooms.<room.name>
          const translationKey = room.name
            ? `booking.general.rooms.${room.name}`
            : null;

          const translatedName =
            translationKey && t(translationKey) !== translationKey
              ? t(translationKey)
              : room.name || '';

          return {
            ...room,
            statusRaw,
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
  }, [t]);

  const toggleDetails = (id) => {
    setOpenRoomIds((prev) =>
      prev.includes(id) ? prev.filter((roomId) => roomId !== id) : [...prev, id]
    );
  };

  const priceSource = rooms[0] || {
    priceNight: 0,
    priceWeek: 0,
    priceMonth: 0,
  };

  if (loading) {
    return <div className="room-wrapper">{t('common.loading') || 'Lade Zimmer...'}</div>;
  }

  if (error) {
    return (
      <div className="room-wrapper">
        {t('common.error') || 'Fehler beim Laden der Zimmer:'} {error}
      </div>
    );
  }

  return (
    <div className="room-wrapper">
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

      <div className="room-container">
        {rooms.map((room) => {
          const isOpen = openRoomIds.includes(room.id);

          return (
            <div key={room.id} className="room-card">
              <div className="room-header" onClick={() => toggleDetails(room.id)}>
                <h3>{room.displayName}</h3>
                <div className="status-row">
                  <span className={`status ${room.statusRaw}`}>
                    {room.status}
                  </span>

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
