
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { sendEmergencyAlert } from "@/services/emergencyService";
import { sendWhatsAppAlert } from "@/services/whatsappService";
import { getUserMobile } from "@/services/firebaseService";
import { loadContacts } from "@/utils/storageService";

interface UseAlertProps {
  onStopListening?: () => void;
  whatsappConnected?: boolean;
}

const useAlert = ({ onStopListening, whatsappConnected = false }: UseAlertProps) => {
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [triggeredWord, setTriggeredWord] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mediaCapture, setMediaCapture] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  const [sendAttempts, setSendAttempts] = useState(0);

  const triggerAlert = (codeWord: string) => {
    if (onStopListening) onStopListening();
    setAlertTriggered(true);
    setTriggeredWord(codeWord);
    
    // Log alert event
    console.log("Alert triggered for codeword:", codeWord);
  };

  const cancelAlert = () => {
    setAlertTriggered(false);
    setTriggeredWord("");
    setMediaCapture(null);
    setSendAttempts(0);
    console.log("Alert canceled");
  };
  
  const updateMediaCapture = (url: string, type: 'image' | 'video') => {
    setMediaCapture({ url, type });
    console.log(`Media captured: ${type}`, url.substring(0, 50) + "...");
    
    // Also save to localStorage as backup
    if (type === 'image') {
      localStorage.setItem("emergencyImage", url);
    } else if (type === 'video') {
      localStorage.setItem("emergencyVideo", url);
    }
  };

  const sendAlert = async () => {
    setIsSending(true);
    setSendAttempts(prev => prev + 1);
    
    try {
      const locationData = localStorage.getItem("lastLocation");
      const userMobile = getUserMobile() || 'Unknown';
      const username = localStorage.getItem("username") || "User";
      const contacts = loadContacts();
      
      if (!contacts || contacts.length === 0) {
        toast.error("No emergency contacts found. Add contacts in the Settings.");
        setIsSending(false);
        return;
      }
      
      // Get media from state first or localStorage backup
      let mediaUrl = null;
      let mediaType = null;
      
      if (mediaCapture) {
        mediaUrl = mediaCapture.url;
        mediaType = mediaCapture.type;
      } else {
        // Fallback to localStorage
        const emergencyImage = localStorage.getItem("emergencyImage");
        const emergencyVideo = localStorage.getItem("emergencyVideo");
        
        if (emergencyImage) {
          mediaUrl = emergencyImage;
          mediaType = 'image';
        } else if (emergencyVideo) {
          mediaUrl = emergencyVideo;
          mediaType = 'video';
        }
      }
      
      let location = null;
      try {
        if (locationData) {
          location = JSON.parse(locationData);
        }
      } catch (error) {
        console.error("Error parsing location data:", error);
      }
      
      console.log("Sending emergency alert with:");
      console.log("- Contacts:", contacts.length);
      console.log("- Location:", location ? "Available" : "Not available");
      console.log("- Triggered word:", triggeredWord);
      console.log("- Media type:", mediaType);
      console.log("- Media URL available:", mediaUrl ? "Yes" : "No");
      
      // Send email alert
      const emailResult = await sendEmergencyAlert({
        contacts,
        message: `Emergency alert! The code word "${triggeredWord}" was detected.`,
        location,
        triggeredWord,
        userId: username,
        userName: username,
        userMobile,
        mediaUrl: mediaUrl,
        mediaType: mediaType as 'image' | 'video' | null
      });
      
      // Show details of email result
      console.log("Email result:", emailResult);
      
      // Send WhatsApp alert if connected
      if (whatsappConnected) {
        try {
          const mediaUrlToSend = mediaType === 'image' ? mediaUrl : null;
          
          await sendWhatsAppAlert({
            contact: contacts[0]?.phone || "",
            message: `🚨 EMERGENCY ALERT: Code word "${triggeredWord}" detected! Help needed immediately. Location: ${
              location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : "Unknown"
            }`,
            mediaUrl: mediaUrlToSend,
            location
          });
          
          console.log("WhatsApp alert sent");
        } catch (err) {
          console.error("Error sending WhatsApp alert:", err);
          toast.error("Failed to send WhatsApp alert");
        }
      }
      
      toast.success("Emergency alert sent successfully");
      cancelAlert();
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast.error(`Failed to send emergency alert: ${(error as Error).message}`);
      
      // If failed multiple times, give user option to try without media
      if (sendAttempts >= 2 && mediaCapture) {
        toast("Retry without media?", {
          action: {
            label: "Try without media",
            onClick: () => {
              setMediaCapture(null);
              localStorage.removeItem("emergencyImage");
              localStorage.removeItem("emergencyVideo");
              setTimeout(() => sendAlert(), 500);
            }
          }
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (!alertTriggered) {
        localStorage.removeItem("emergencyImage");
        localStorage.removeItem("emergencyVideo");
      }
    };
  }, [alertTriggered]);

  return {
    alertTriggered,
    triggeredWord,
    triggerAlert,
    cancelAlert,
    sendAlert,
    isSending,
    updateMediaCapture,
    mediaCapture,
    sendAttempts
  };
};

export default useAlert;
