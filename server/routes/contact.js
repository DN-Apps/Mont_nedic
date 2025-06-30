// routes/contact.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
    const {
        salutation,
        firstName,
        lastName,
        street,
        postalCode,
        city,
        country,
        phone,
        message,
        email
    } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "Neue Kontaktanfrage",
        text: `
Neue Kontaktanfrage:

Von: ${salutation} ${firstName} ${lastName}
Adresse: ${street}, ${postalCode} ${city}, ${country}
Telefon: ${phone}
E-Mail: ${email}

Nachricht:
${message}
        `,
        replyTo: email,
        cc: email // Absender erhält Kopie
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "E-Mail erfolgreich gesendet." });
    } catch (error) {
        console.error("Fehler beim Mailversand:", error);
        res.status(500).json({ success: false, message: "Fehler beim Versenden der E-Mail." });
    }
});

module.exports = router;
