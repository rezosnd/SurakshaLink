import { Mic, MapPin } from "lucide-react";
import React from "react";

interface MonitorTabProps {
  codeWords: string[];
  isListening: boolean;
  transcript: string;
  locationName: string | null;
  toggleListening: () => void;
}

const MonitorTab = ({ 
  codeWords, 
  isListening, 
  transcript, 
  locationName,
  toggleListening 
}: MonitorTabProps) => {
  // Create a style element for animations
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes pulseSlow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.4; }
      }
      
      @keyframes pulseMedium {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.3; }
      }
      
      @keyframes pulseFast {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.2; }
      }
      
      @keyframes scan {
        0% { top: -5%; }
        100% { top: 105%; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Ambient light effect */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute w-full h-full bg-gradient-radial from-cyan-500/5 to-transparent opacity-30" style={{ animation: "pulseSlow 3s ease-in-out infinite" }}></div>
        <div className="absolute w-full h-full bg-gradient-radial from-fuchsia-500/5 to-transparent opacity-20" style={{ top: '20%', left: '30%', animation: "pulseMedium 5s ease-in-out infinite" }}></div>
      </div>
      
      <div className="mt-6 flex flex-col items-center relative">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6"></div>
        
        <p className="mb-6 text-lg text-cyan-400">
          {isListening 
            ? "SurakshaLink is actively listening for your code words" 
            : "SurakshaLink is currently not listening"}
        </p>
        
        <button 
          onClick={toggleListening} 
          className={`w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative ${
            isListening 
              ? 'border-2 border-red-600 bg-red-900/10' 
              : 'border-2 border-cyan-500/80 bg-[#0c0a14]/80'
          }`}
          style={{
            boxShadow: isListening 
              ? "0 0 15px rgba(255, 0, 0, 0.5), inset 0 0 10px rgba(255, 0, 0, 0.3)" 
              : "0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)"
          }}
        >
          {/* Button ripple effect */}
          <div className={`absolute inset-0 rounded-full ${
            isListening ? 'bg-red-500/5' : 'bg-cyan-500/5'
          }`}></div>
          
          <Mic className={`w-20 h-20 ${
            isListening ? 'text-red-500' : 'text-cyan-400'
          }`} style={isListening ? { animation: "pulse 2s infinite" } : {}} />
          
          <span className={`uppercase mt-4 font-bold tracking-wider ${
            isListening ? 'text-red-500' : 'text-cyan-400'
          }`}>
            {isListening ? "Stop Listening" : "Start Listening"}
          </span>
          
          {/* Scanning animation when active */}
          {isListening && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="h-px bg-red-500 opacity-50 w-full absolute" 
                   style={{ animation: "scan 2s linear infinite" }}></div>
            </div>
          )}
        </button>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-6"></div>
      </div>
      
      {isListening && (
        <div 
          className="mt-10 p-6 border-2 border-cyan-500/80 bg-[#0f0b1c]/80 relative overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0% 15%)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1)"
          }}
        >
          {/* Glitch effect */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              background: "repeating-linear-gradient(transparent, rgba(0, 255, 255, 0.05) 2px, transparent 4px)",
              pointerEvents: "none"
            }}
          ></div>
          
          <h4 className="text-fuchsia-400 mb-2 text-sm font-bold tracking-wider uppercase">VOICE TRANSCRIPT:</h4>
          <p className="italic text-cyan-300">{transcript || "Listening for your voice..."}</p>
          
          {/* Location display if available */}
          {locationName && (
            <div className="mt-4 flex items-center text-cyan-400/80">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{locationName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonitorTab;

