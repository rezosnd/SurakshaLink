
import { Mic, Volume2, MessageSquareMore } from "lucide-react";
import { useEffect, useState } from "react";

interface StatusIndicatorProps {
  isListening: boolean;
  volumeButtonEnabled?: boolean;
  whatsappConnected?: boolean;
}

const StatusIndicator = ({ isListening, volumeButtonEnabled = false, whatsappConnected = false }: StatusIndicatorProps) => {
  const [pulseEffect, setPulseEffect] = useState(false);
  
  // Create a more dynamic pulse effect when active
  useEffect(() => {
    if (!isListening) return;
    
    const interval = setInterval(() => {
      setPulseEffect(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isListening]);
  
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="segment-topbar py-2">
        <div>
          <div 
            className={`
              flex items-center gap-2 px-3 py-2 border rounded-md ${
                isListening 
                  ? 'border-active--500 text-active--500 neon-glow-active' 
                  : 'border-primary--500 text-primary--500'
              }`
            }
            data-augmented-ui={isListening ? "tr-clip bl-clip border" : "tl-clip br-clip border"}
          >
            <Mic className={`w-5 h-5 ${pulseEffect ? 'animate-ping' : 'animate-pulse'}`} />
            <span className="text-sm uppercase font-medium">
              {isListening ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      
      {volumeButtonEnabled && (
        <div className="flex items-center gap-1 text-tertiary--500 text-xs mt-2 bg-colors-bg--500 p-2 rounded border border-primary--800" data-augmented-ui="tr-clip border">
          <Volume2 className="w-3 h-3" />
          <span>Volume button activation enabled</span>
        </div>
      )}

      {/* WhatsApp connection status */}
      <div className={`flex items-center gap-1 text-xs mt-2 p-2 rounded border ${
        whatsappConnected 
          ? 'text-secondary--500 bg-colors-bg--500 border-secondary--800' 
          : 'text-primary--300 bg-colors-bg--500 border-primary--800'
      }`} data-augmented-ui="tr-clip border">
        <MessageSquareMore className="w-3 h-3" />
        <span>
          WhatsApp: {whatsappConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
      
      {/* Add a status matrix visualization */}
      {isListening && (
        <div className="mt-4 grid grid-cols-5 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className={`h-1 ${
                Math.random() > 0.5 
                  ? 'bg-active--500' 
                  : i % 3 === 0 
                    ? 'bg-secondary--500' 
                    : 'bg-primary--500'
              }`}
              style={{
                opacity: Math.random() * 0.8 + 0.2,
                height: `${Math.random() * 4 + 2}px`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
