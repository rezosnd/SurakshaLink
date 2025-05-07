

import { toast } from "sonner";

interface AlertOptions {
  recipient: {
    name: string;
    phone?: string;
    email?: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  message?: string;
}

export const sendAlert = async (options: AlertOptions): Promise<boolean> => {

  
  console.log('Sending alert to:', options.recipient);
  console.log('Alert location:', options.location);
  console.log('Alert message:', options.message || 'Emergency alert triggered');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`Alert sent to ${options.recipient.name}`);
      resolve(true);
    }, 1000);
  });
};

export const startAudioRecording = (): { stop: () => Promise<Blob> } => {

  console.log('Audio recording started');
  
  return {
    stop: () => {
      console.log('Audio recording stopped');

      return Promise.resolve(new Blob([]));
    }
  };
};
