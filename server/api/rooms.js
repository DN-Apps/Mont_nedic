// api/rooms.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/rooms  → liefert alle Zimmer aus der Rooms-Tabelle
router.get('/', async (_req, res) => {
    try {
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

        const mapped = rows.map((r) => {
            const isAvailable = !!r.available;
            const statusRaw = isAvailable ? 'available' : 'occupied';

            return {
                id: r.id,
                name: r.name,
                available: isAvailable,
                priceNight: r.priceNight,
                priceWeek: r.priceWeek,
                priceMonth: r.priceMonth,
                details: r.details,
                statusRaw,
            };
        });

        res.json(mapped);
    } catch (err) {
        console.error('[ROOMS][LIST]', err);
        res.status(500).json({
            error: 'Failed to load rooms',
            details: err.message || 'Unknown database error',
        });
    }
});

module.exports = router;
