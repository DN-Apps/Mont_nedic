// api/rooms.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/* ---------------------------------------------------------------------------
   GET /api/rooms
   - Liefert alle Zimmer aus der Datenbanktabelle "Rooms"
   - Formatiert die Daten für das Frontend (z. B. statusRaw, available-Boolean)
   - Wird von RoomDetails.jsx verwendet
--------------------------------------------------------------------------- */
router.get('/', async (_req, res) => {
    try {
        /* -------------------------------------------------------------------
           Datenbankabfrage:
           - SELECT nur benötigte Felder
           - ORDER BY id → stabile Reihenfolge für Frontend
        ------------------------------------------------------------------- */
        const [rows] = await db.query(
            `SELECT
                id,
                name,
                available,
                priceNight,
                priceWeek,
                priceMonth,
                details
             FROM Rooms
             ORDER BY id`
        );

        /* -------------------------------------------------------------------
           Datentransformation:
           - available: aus DB (0/1) → Boolean
           - statusRaw: einfacher Statusstring für Logik/Styling
        ------------------------------------------------------------------- */
        const mapped = rows.map((r) => {
            const isAvailable = !!r.available;       // Umwandlung in echtes Boolean
            const statusRaw = isAvailable ? 'available' : 'occupied';

            return {
                id: r.id,
                name: r.name,
                available: isAvailable,
                priceNight: r.priceNight,
                priceWeek: r.priceWeek,
                priceMonth: r.priceMonth,
                details: r.details,
                statusRaw, // Wird im Frontend für CSS/Statusanzeige genutzt
            };
        });

        // Erfolgreiche Antwort
        res.json(mapped);

    } catch (err) {
        /* -------------------------------------------------------------------
           Fehlerbehandlung:
           - Ausdruck der DB-Fehlermeldung im Backend
           - Ausliefern eines generischen Fehlers an das Frontend
        ------------------------------------------------------------------- */
        console.error('[ROOMS][LIST]', err);
        res.status(500).json({
            error: 'Failed to load rooms',
            details: err.message || 'Unknown database error',
        });
    }
});

module.exports = router;
