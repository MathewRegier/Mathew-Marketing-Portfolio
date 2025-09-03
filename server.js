const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00f5ff; border-bottom: 2px solid #00f5ff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00f5ff; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; color: #666;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
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

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other routes without .html extension
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const fs = require('fs');
  const filePath = path.join(__dirname, 'public', `${page}.html`);
  
  console.log(`🔍 Looking for page: ${page}`);
  console.log(`📁 File path: ${filePath}`);
  
  // Check if the HTML file exists synchronously for better reliability
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`✅ File found, serving: ${filePath}`);
    // File exists, serve it
    res.sendFile(filePath);
  } catch (err) {
    console.log(`❌ File not found: ${filePath}`);
    // File doesn't exist, continue to next middleware (404)
    next();
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head><title>404 - Page Not Found</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px; background: #0a0a0f; color: white;">
        <h1 style="color: #00f5ff;">404 - Page Not Found</h1>
        <p>The page <strong>${req.url}</strong> was not found.</p>
        <p><a href="/" style="color: #00f5ff;">← Back to Portfolio</a></p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
  console.log(`📱 Ready to showcase Mathew's marketing expertise!`);
  console.log(`📧 Contact form configured with email: ${process.env.EMAIL_FROM || 'Not configured'}`);
});
