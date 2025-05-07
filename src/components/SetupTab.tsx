
import { Volume2 } from "lucide-react";
import CodeWordInput from "./CodeWordInput";
import ContactsManager from "./ContactsManager";
import MobileNumberUpdate from "./MobileNumberUpdate";
import React from "react";

interface SetupTabProps {
  codeWords: string[];
  setCodeWords: React.Dispatch<React.SetStateAction<string[]>>;
  contacts: {name: string, phone: string, email: string}[];
  setContacts: React.Dispatch<React.SetStateAction<{name: string, phone: string, email: string}[]>>;
  volumeUp: boolean;
  setVolumeUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetupTab = ({
  codeWords,
  setCodeWords,
  contacts,
  setContacts,
  volumeUp,
  setVolumeUp
}: SetupTabProps) => {
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
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="space-y-6 py-4 relative">
      {/* Ambient light effect */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute w-full h-full bg-gradient-radial from-cyan-500/5 to-transparent opacity-30" style={{ animation: "pulseSlow 3s ease-in-out infinite" }}></div>
        <div className="absolute w-full h-full bg-gradient-radial from-fuchsia-500/5 to-transparent opacity-20" style={{ top: '20%', left: '30%', animation: "pulseMedium 5s ease-in-out infinite" }}></div>
      </div>
      
      <div className="mb-8">
        <div className="mb-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-2"></div>
          <h3 className="text-cyan-400 text-lg font-bold tracking-wider uppercase">Code Words Configuration</h3>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent mt-2"></div>
        </div>
        <div className="border-2 border-cyan-500/50 bg-[#0f0b1c]/80 p-4"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%, 0% 10%)",
            boxShadow: "0 0 12px rgba(0, 255, 255, 0.2), inset 0 0 8px rgba(0, 255, 255, 0.1)"
          }}>
          <CodeWordInput
            codeWords={codeWords}
            setCodeWords={setCodeWords}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <div className="mb-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-2"></div>
          <h3 className="text-cyan-400 text-lg font-bold tracking-wider uppercase">Emergency Contacts</h3>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent mt-2"></div>
        </div>
        <div className="border-2 border-cyan-500/50 bg-[#0f0b1c]/80 p-4"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%, 0% 10%)",
            boxShadow: "0 0 12px rgba(0, 255, 255, 0.2), inset 0 0 8px rgba(0, 255, 255, 0.1)"
          }}>
          <ContactsManager
            contacts={contacts}
            setContacts={setContacts}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <div className="mb-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-2"></div>
          <h3 className="text-cyan-400 text-lg font-bold tracking-wider uppercase">Personal Emergency Information</h3>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent mt-2"></div>
        </div>
        <div className="border-2 border-cyan-500/50 bg-[#0f0b1c]/80 p-4"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%, 0% 10%)",
            boxShadow: "0 0 12px rgba(0, 255, 255, 0.2), inset 0 0 8px rgba(0, 255, 255, 0.1)"
          }}>
          <MobileNumberUpdate />
        </div>
      </div>
      
      <div className="border-2 border-cyan-500/80 bg-[#0f0b1c]/80 p-6 relative overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0% 15%)",
          boxShadow: "0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1)"
        }}>
        {/* Glitch effect */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: "repeating-linear-gradient(transparent, rgba(0, 255, 255, 0.05) 2px, transparent 4px)",
            pointerEvents: "none"
          }}
        ></div>
        
        <h3 className="text-fuchsia-400 mb-3 flex items-center gap-2 font-bold tracking-wider uppercase">
          <Volume2 className="w-5 h-5" />
          Volume Button Activation
        </h3>
        <div className="flex items-center">
          <div className="relative">
            <input 
              type="checkbox" 
              id="volume-toggle" 
              checked={volumeUp} 
              onChange={() => setVolumeUp(!volumeUp)} 
              className="sr-only"
            />
            <label 
              htmlFor="volume-toggle" 
              className={`block w-12 h-6 rounded-full transition-colors duration-300 ${volumeUp ? 'bg-cyan-700' : 'bg-[#1a1525]'} cursor-pointer`}
              style={{
                boxShadow: volumeUp ? "0 0 10px rgba(0, 255, 255, 0.5)" : "inset 0 0 4px rgba(0, 255, 255, 0.2)"
              }}
            >
              <span 
                className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ${volumeUp ? 'bg-cyan-400 translate-x-6' : 'bg-gray-400'}`}
              ></span>
            </label>
          </div>
          <label htmlFor="volume-toggle" className="text-sm ml-2 text-cyan-300 cursor-pointer">
            Enable starting SafeWords with volume up button
          </label>
        </div>
        <p className="mt-2 text-xs text-cyan-400/60">
          When enabled, pressing the volume up button on your device will start SafeWords listening
        </p>
      </div>
    </div>
  );
};

export default SetupTab;
