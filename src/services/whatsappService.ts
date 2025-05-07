
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://silent-signal-words-alert.onrender.com/api';

// Check WhatsApp connection status
export const checkWhatsAppStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/whatsapp/status`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check WhatsApp status');
    }

    const data = await response.json();
    return data.connected;
  } catch (error) {
    console.error('Error checking WhatsApp status:', error);
    toast.error("Failed to check WhatsApp status");
    return false;
  }
};

// Get QR code for WhatsApp Web login
export const getWhatsAppQR = async (): Promise<string | null> => {
  try {
    const userId = localStorage.getItem("userId") || "default-user";
    
    const response = await fetch(`${API_BASE_URL}/whatsapp/qr?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get WhatsApp QR');
    }

    const data = await response.json();
    return data.qrCode;
  } catch (error) {
    console.error('Error getting WhatsApp QR:', error);
    toast.error("Failed to generate WhatsApp QR code");
    return null;
  }
};

// Send WhatsApp alert
export const sendWhatsAppAlert = async (
  contact: string,
  message: string,
  location: { lat: number; lng: number } | null = null,
  mediaUrl?: string
): Promise<boolean> => {
  try {
    const userId = localStorage.getItem("userId") || "default-user";
    
    const payload: any = {
      userId,
      contact,
      message,
    };

    if (location) {
      payload.location = location;
    }

    if (mediaUrl) {
      payload.mediaUrl = mediaUrl;
    }

    const response = await fetch(`${API_BASE_URL}/whatsapp/send`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    toast.error("Failed to send WhatsApp message");
    return false;
  }
};

// Disconnect WhatsApp session
export const disconnectWhatsApp = async (): Promise<boolean> => {
  try {
    const userId = localStorage.getItem("userId") || "default-user";
    
    const response = await fetch(`${API_BASE_URL}/whatsapp/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect WhatsApp');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    toast.error("Failed to disconnect WhatsApp");
    return false;
  }
};

