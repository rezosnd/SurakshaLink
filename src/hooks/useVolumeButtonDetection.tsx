
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseVolumeButtonDetectionProps {
  volumeUp: boolean;
  isListening: boolean;
  onVolumeButtonPress: () => void;
}

const useVolumeButtonDetection = ({ 
  volumeUp, 
  isListening, 
  onVolumeButtonPress 
}: UseVolumeButtonDetectionProps) => {
  const isMobile = useIsMobile();
  const [volumeEvents, setVolumeEvents] = useState(0);
  const [lastVolumeEvent, setLastVolumeEvent] = useState(0);
  
  // Volume button detection for desktop
  useEffect(() => {
    if (!volumeUp) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.keyCode === 175 || e.key === "AudioVolumeUp") {
        onVolumeButtonPress();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isListening, volumeUp, onVolumeButtonPress]);
  
  // Mobile volume button detection using device orientation/motion events
  useEffect(() => {
    if (!isMobile || !volumeUp) return;
    
    // We'll use device motion as a proxy for detecting volume button presses
    // This won't directly detect volume button presses, but can help identify
    // when the device is handled in a way that might indicate volume button usage
    
    const handleDeviceMotion = () => {
      const now = Date.now();
      
      // Ignore events that happen too close together (debounce)
      if (now - lastVolumeEvent < 500) return;
      
      setLastVolumeEvent(now);
      setVolumeEvents(prev => prev + 1);
      
      // If we detect 3 motion events in short succession, consider it a potential volume button press
      if (volumeEvents >= 2) {
        onVolumeButtonPress();
        setVolumeEvents(0);
      }
    };
    
    window.addEventListener('devicemotion', handleDeviceMotion);
    
    // For iOS, we need to request permission first (this won't work on older iOS versions)
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion);
          }
        })
        .catch(console.error);
    }
    
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isMobile, volumeUp, volumeEvents, lastVolumeEvent, isListening, onVolumeButtonPress]);
};

export default useVolumeButtonDetection;
