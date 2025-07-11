const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from main Portfolio folder

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../contact.html')); // Serve contact.html from main folder
});

app.post('/contact', async (req, res) => {
  const { name, email, message, 'g-recaptcha-response': token } = req.body;

  if (!name || !email || !message || !token) {
    return res.status(400).send('All fields and CAPTCHA are required.');
  }

  // Verify reCAPTCHA
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`;
  try {
    const captchaRes = await axios.post(verifyURL);
    if (!captchaRes.data.success) {
      return res.status(403).send('reCAPTCHA failed. Please try again.');
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.redirect('/thank-you.html');

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Server error. Please try again later.');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
