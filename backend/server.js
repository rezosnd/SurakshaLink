
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'safewords-whatsapp-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://silent-signal-words-alert.vercel.app',
  credentials: true
}));

app.use(express.json());

// Create sessions directory if it doesn't exist
const sessionsDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

// Store active WhatsApp clients
const clients = {};

// WhatsApp client setup
const setupWhatsAppClient = (userId) => {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    }
  });

  // QR code event
  let qrCode = null;
  client.on('qr', (qr) => {
    console.log(`QR code generated for user ${userId}`);
    qrCode = qr;
  });

  // Ready event
  client.on('ready', () => {
    console.log(`WhatsApp client ready for user ${userId}`);
  });

  // Disconnected event
  client.on('disconnected', (reason) => {
    console.log(`WhatsApp client disconnected for user ${userId}: ${reason}`);
    delete clients[userId];
  });

  client.initialize();

  return {
    client,
    getQR: () => qrCode,
    resetQR: () => { qrCode = null; }
  };
};

// API endpoints
app.get('/api/whatsapp/status', async (req, res) => {
  const userId = req.session.userId || 'default-user'; // Provide default user ID
  if (!userId) {
    return res.status(401).json({ connected: false, message: 'Not authenticated' });
  }

  if (!clients[userId]) {
    return res.json({ connected: false });
  }

  try {
    const state = await clients[userId].client.getState();
    return res.json({ connected: state === 'CONNECTED' });
  } catch (error) {
    console.error('Error checking client state:', error);
    return res.json({ connected: false });
  }
});

app.get('/api/whatsapp/qr', async (req, res) => {
  // Use a default user ID if not provided
  const userId = req.session.userId || req.query.userId || 'default-user';
  
  console.log(`QR requested for user: ${userId}`);

  // Create or retrieve the client for this user
  if (!clients[userId]) {
    console.log(`Creating new WhatsApp client for user: ${userId}`);
    clients[userId] = setupWhatsAppClient(userId);
  }

  // Wait for QR code generation (max 30 seconds)
  let attempts = 0;
  const waitForQr = () => {
    return new Promise((resolve, reject) => {
      const checkQr = () => {
        const qr = clients[userId].getQR();
        if (qr) {
          console.log(`QR code successfully generated for ${userId}`);
          resolve(qr);
        } else if (attempts >= 15) { // 15 attempts * 2 seconds = 30 seconds
          console.log(`QR code generation timeout for ${userId}`);
          reject(new Error('QR code generation timeout'));
        } else {
          attempts++;
          console.log(`Waiting for QR (attempt ${attempts}/15)...`);
          setTimeout(checkQr, 2000);
        }
      };
      checkQr();
    });
  };

  try {
    const qr = await waitForQr();
    const qrImage = await qrcode.toDataURL(qr);
    res.json({ success: true, qrCode: qrImage.split(',')[1] });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ success: false, message: 'Failed to generate QR code' });
  }
});

app.post('/api/whatsapp/send', async (req, res) => {
  const userId = req.session.userId || req.body.userId || 'default-user';
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const { contact, message, location, mediaUrl } = req.body;
  if (!contact) {
    return res.status(400).json({ success: false, message: 'Contact number required' });
  }

  // Format the phone number (add @c.us suffix if not present)
  const chatId = contact.includes('@c.us') ? contact : `${contact}@c.us`;

  // Check if client exists and is ready
  if (!clients[userId]) {
    return res.status(400).json({ success: false, message: 'WhatsApp not connected. Please scan the QR code first.' });
  }

  try {
    // Get client state
    const state = await clients[userId].client.getState();
    if (state !== 'CONNECTED') {
      return res.status(400).json({ success: false, message: 'WhatsApp client not connected' });
    }

    // Send location if provided
    if (location && location.lat && location.lng) {
      await clients[userId].client.sendLocation(chatId, location.lat, location.lng, {
        caption: 'Emergency Location'
      });
    }

    // Send media if provided
    if (mediaUrl) {
      const media = await MessageMedia.fromUrl(mediaUrl);
      await clients[userId].client.sendMessage(chatId, media, {
        caption: message || 'Emergency Alert'
      });
    } 
    // Send text message
    else if (message) {
      await clients[userId].client.sendMessage(chatId, message);
    }

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, message: `Failed to send message: ${error.message}` });
  }
});

app.post('/api/whatsapp/logout', async (req, res) => {
  const userId = req.session.userId || req.body.userId || 'default-user';
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  if (clients[userId]) {
    try {
      await clients[userId].client.logout();
      await clients[userId].client.destroy();
      delete clients[userId];
      res.json({ success: true, message: 'WhatsApp disconnected successfully' });
    } catch (error) {
      console.error('Error logging out of WhatsApp:', error);
      res.status(500).json({ success: false, message: `Failed to disconnect: ${error.message}` });
    }
  } else {
    res.json({ success: true, message: 'No active WhatsApp session found' });
  }
});

// Authentication endpoint (simplified - replace with your actual auth system)
app.post('/api/auth/session', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID required' });
  }
  
  req.session.userId = userId;
  res.json({ success: true, message: 'Session created' });
});

// Add a simple root route handler to respond to the base URL
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SafeWords WhatsApp Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #111;
            color: #00ff9d;
            line-height: 1.6;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: #1e1e1e;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 255, 157, 0.2);
            border: 1px solid #00ff9d;
          }
          h1 {
            color: #00ff9d;
            text-align: center;
          }
          .status {
            background: #2a2a2a;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #00ff9d;
          }
          .endpoint {
            background: #2a2a2a;
            padding: 10px;
            border-radius: 3px;
            margin: 5px 0;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SafeWords WhatsApp Backend</h1>
          <div class="status">
            Server is running! This is the backend server for the SafeWords WhatsApp integration.
          </div>
          <p>Available endpoints:</p>
          <div class="endpoint">GET /api/whatsapp/status</div>
          <div class="endpoint">GET /api/whatsapp/qr</div>
          <div class="endpoint">POST /api/whatsapp/send</div>
          <div class="endpoint">POST /api/whatsapp/logout</div>
          <div class="endpoint">GET /health</div>
          
          <p>Frontend URL: ${process.env.FRONTEND_URL || 'https://silent-signal-words-alert.vercel.app'}</p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
