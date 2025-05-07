// whatsapp.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client;
let qrCodeData = '';
let isClientReady = false;

const initWhatsApp = () => {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox'], // for environments like render.com
    }
  });

  client.on('qr', async (qr) => {
    qrCodeData = await qrcode.toDataURL(qr);
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    isClientReady = true;
  });

  client.initialize();
};

const getQR = () => qrCodeData;
const getStatus = () => isClientReady;
const sendMessage = async (number, message) => {
  const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
  await client.sendMessage(chatId, message);
};

const logout = async () => {
  await client.logout();
  isClientReady = false;
  qrCodeData = '';
};

module.exports = { initWhatsApp, getQR, getStatus, sendMessage, logout };
