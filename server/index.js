const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json()); // body-parser middleware für POST-Daten

// Registrierungs-Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [userExists] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: "Benutzer existiert bereits" });
        }

        // Neuen Benutzer hinzufügen
        await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        res.json({ success: true, message: "Benutzer registriert!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Fehler bei der Registrierung" });
    }
});

// Login-Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Benutzer nicht gefunden" });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Falsches Passwort" });
        }

        // Login erfolgreich (keine JWT oder MFA nötig)
        res.json({ success: true, message: "Login erfolgreich!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login-Fehler" });
    }
});

// Server starten
app.listen(5000, () => {
    console.log("✅ Server läuft auf http://localhost:5000");
});
