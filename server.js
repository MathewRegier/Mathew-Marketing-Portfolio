const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Contact form route
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #18181B;">
          <h2 style="color: #2563EB; border-bottom: 1px solid #E4E4E7; padding-bottom: 12px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #F4F4F5; padding: 18px; border-left: 4px solid #2563EB; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #18181B;">Message:</h3>
            <p style="white-space: pre-wrap; color: #52525B;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 30px 0;">
          <p style="color: #71717A; font-size: 12px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other routes without .html extension
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const fs = require('fs');
  const filePath = path.join(__dirname, 'public', `${page}.html`);
  
  console.log(`Looking for page: ${page}`);
  console.log(`File path: ${filePath}`);
  
  // Check if the HTML file exists synchronously for better reliability
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`File found, serving: ${filePath}`);
    // File exists, serve it
    res.sendFile(filePath);
  } catch (err) {
    console.log(`File not found: ${filePath}`);
    // File doesn't exist, continue to next middleware (404)
    next();
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
      </head>
      <body style="font-family: Inter, Arial, sans-serif; min-height: 100vh; display: grid; place-items: center; margin: 0; background: #FAFAFA; color: #18181B;">
        <main style="max-width: 560px; padding: 32px; text-align: center;">
          <p style="color: #2563EB; font-weight: 800; letter-spacing: .14em; text-transform: uppercase;">404</p>
          <h1 style="font-size: clamp(40px, 8vw, 72px); line-height: .95; letter-spacing: -.06em; margin: 0 0 16px;">Page not found</h1>
          <p style="color: #52525B;">The page <strong>${req.url}</strong> was not found.</p>
          <p><a href="/" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; border-radius: 999px; padding: 12px 18px; font-weight: 700;">Back to portfolio</a></p>
        </main>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  console.log("Ready to showcase Mathew's marketing expertise.");
  console.log(`Contact form configured with email: ${process.env.EMAIL_FROM || 'Not configured'}`);
});
