const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

/**
 * ✅ Health-Endpoint (für Docker-Healthcheck)
 * - liefert IMMER 200
 * - prüft DB kurz und meldet { db: true/false }
 * - env: NODE_ENV (fällt auf 'qa' zurück)
 */
app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  try {
    await db.query('SELECT 1');
    dbOk = true;
  } catch (e) {
    console.warn('DB ping failed:', e.message);
  }
  res.status(200).json({ status: 'ok', env: process.env.NODE_ENV || 'qa', db: dbOk });
});

// 📩 Kontaktformular-Route
app.post('/contact', async (req, res) => {
  const {
    salutation,
    firstName,
    lastName,
    street,
    postalCode,
    city,
    country,
    phone,
    email,
    message
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true
  });

  const mailOptions = {
    from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Rent.ned-it.de: Neue Kontaktanfrage",
    text: `
Du hast eine neue Nachricht

Von: ${salutation} ${firstName} ${lastName}
E-Mail: ${email}
Telefon: ${phone}
Adresse: ${street}, ${postalCode} ${city}, ${country}

Nachricht:
${message}
    `,
    replyTo: email,
    cc: email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "E-Mail wurde versendet." });
  } catch (err) {
    console.error("Fehler beim Mailversand (Kontaktformular):", err);
    res.status(500).json({ success: false, message: "E-Mail-Versand fehlgeschlagen." });
  }
});

// 📋 Buchungsformular-Route
app.post('/api/booking', async (req, res) => {
  const {
    bookingDates,
    selectedRooms,
    contactForm
  } = req.body;

  const calculateDateDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end - start;
    return differenceInTime / (1000 * 3600 * 24);
  };

  const calculateRoomTotal = (room, nights) => {
    let remainingNights = nights;
    let roomTotal = 0;

    while (remainingNights > 0) {
      const nightsToCharge = Math.min(5, remainingNights);
      roomTotal += nightsToCharge * room.pricePerDay;
      remainingNights -= 7;
    }

    return Math.min(roomTotal, 400);
  };

  const nights = calculateDateDifference(bookingDates.startDate, bookingDates.endDate);
  const totalCost = selectedRooms.reduce((total, room) => total + calculateRoomTotal(room, nights), 0);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.BOOKING_EMAIL_USER,
      pass: process.env.BOOKING_EMAIL_PASS
    },
    logger: true,
    debug: true
  });

  const ownerMailOptions = {
    from: `"Buchungsformular" <${process.env.BOOKING_EMAIL_USER}>`,
    to: process.env.BOOKING_EMAIL_USER,
    subject: "Neue Buchungsanfrage - Monteurzimmer",
    html: `
      <h2>Neue Buchungsanfrage</h2>
      <h3>Buchungszeitraum</h3>
      <p><strong>Von:</strong> ${new Date(bookingDates.startDate).toLocaleDateString('de-DE')}</p>
      <p><strong>Bis:</strong> ${new Date(bookingDates.endDate).toLocaleDateString('de-DE')}</p>
      <p><strong>Anzahl Nächte:</strong> ${nights}</p>
      <h3>Gewählte Zimmer</h3>
      ${selectedRooms.map(room => `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
          <p><strong>Zimmertyp:</strong> ${room.type}</p>
          <p><strong>Preis pro Tag:</strong> ${room.pricePerDay}€</p>
          <p><strong>Gesamtkosten für ${nights} Nächte:</strong> ${calculateRoomTotal(room, nights)}€</p>
        </div>
      `).join('')}
      <h3>Gesamtkosten: ${totalCost}€</h3>
      <h3>Kontaktdaten</h3>
      <p><strong>Anrede:</strong> ${contactForm.salutation}</p>
      <p><strong>Name:</strong> ${contactForm.firstName} ${contactForm.lastName}</p>
      <p><strong>Firma:</strong> ${contactForm.company || 'Nicht angegeben'}</p>
      <p><strong>Adresse:</strong> ${contactForm.street}, ${contactForm.postalCode} ${contactForm.city}</p>
      <p><strong>Land:</strong> ${contactForm.country}</p>
      <p><strong>Telefon:</strong> ${contactForm.phone}</p>
    `
  };

  const customerMailOptions = {
    from: `"Monteurzimmer Buchung" <${process.env.BOOKING_EMAIL_USER}>`,
    to: contactForm.email,
    subject: "Buchungsanfrage - Monteurzimmer",
    html: `
      <h2>Vielen Dank für Ihre Buchungsanfrage!</h2>
      <p>Liebe/r ${contactForm.salutation} ${contactForm.lastName},</p>
      <p>wir haben Ihre Buchungsanfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>
      <h3>Ihre Buchungsdetails:</h3>
      <h4>Buchungszeitraum</h4>
      <p><strong>Von:</strong> ${new Date(bookingDates.startDate).toLocaleDateString('de-DE')}</p>
      <p><strong>Bis:</strong> ${new Date(bookingDates.endDate).toLocaleDateString('de-DE')}</p>
      <p><strong>Anzahl Nächte:</strong> ${nights}</p>
      <h4>Gewählte Zimmer</h4>
      ${selectedRooms.map(room => `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
          <p><strong>Zimmertyp:</strong> ${room.type}</p>
          <p><strong>Preis pro Tag:</strong> ${room.pricePerDay}€</p>
          <p><strong>Gesamtkosten für ${nights} Nächte:</strong> ${calculateRoomTotal(room, nights)}€</p>
        </div>
      `).join('')}
      <h4>Gesamtkosten: ${totalCost}€</h4>
      <p>Bei Fragen können Sie uns gerne unter der Telefonnummer +49 1701071715 erreichen.</p>
      <p>Mit freundlichen Grüßen<br>Ihr Monteurzimmer-Team</p>
    `
  };

  try {
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);
    res.status(200).json({
      success: true,
      message: "Buchungsanfrage wurde erfolgreich versendet!"
    });
  } catch (err) {
    console.error("Fehler beim Mailversand (Buchungsformular):", err);
    res.status(500).json({
      success: false,
      message: "Fehler beim Versenden der Buchungsanfrage."
    });
  }
});

// 🧑‍💻 Registrierungs-Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [userExists] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }

    await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
    res.json({ success: true, message: "Benutzer registriert!" });
  } catch (err) {
    console.error("Fehler bei der Registrierung:", err);
    res.status(500).json({ message: "Fehler bei der Registrierung" });
  }
});

// 🔐 Login-Route
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

    res.json({ success: true, message: "Login erfolgreich!" });
  } catch (err) {
    console.error("Fehler beim Login:", err);
    res.status(500).json({ message: "Login-Fehler" });
  }
});

// 🖥️ Server starten
const PORT = process.env.PORT || 5000; // ⬅️ auf 5000 geändert (Compose erwartet 5000)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
