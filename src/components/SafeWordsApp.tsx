
import { useState, useEffect } from "react";
import { Mic, Volume2, MapPin, Settings, MessageSquare, AlertTriangle, LogOut, MessageSquareMore } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import StatusIndicator from "./StatusIndicator";
import AlertModal from "./AlertModal";
import useGeolocation from "@/hooks/useGeolocation";
import { loadCodeWords, loadContacts } from "@/utils/storageService";
import useAlert from "@/hooks/useAlert";
import useVolumeButtonDetection from "@/hooks/useVolumeButtonDetection";
import useSafeWordsMonitoring from "@/hooks/useSafeWordsMonitoring";
import MonitorTab from "./MonitorTab";
import SetupTab from "./SetupTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { checkWhatsAppStatus } from "@/services/whatsappService";
import { logoutUser } from "@/services/firebaseService";
import { Button } from "./ui/button";

const SafeWordsApp = () => {
  // ... keep existing code (state variables and hooks)
  const [codeWords, setCodeWords] = useState<string[]>([]);
  const [contacts, setContacts] = useState<{name: string, phone: string, email: string}[]>([]);
  const [volumeUp, setVolumeUp] = useState(false);
  const [activeTab, setActiveTab] = useState<"setup" | "monitor">("monitor");
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const { location, locationName } = useGeolocation();
  
  const { 
    isListening, 
    transcript, 
    resetTranscript, 
    toggleListening, 
    stopListening 
  } = useSafeWordsMonitoring({ 
    codeWords, 
    contacts, 
    onTriggerAlert: (word) => alert.triggerAlert(word) 
  });

  const alert = useAlert({ 
    onStopListening: stopListening,
    whatsappConnected: whatsappConnected
  });
  
  const handleVolumeButtonPress = () => {
    if (!isListening && volumeUp) {
      toggleListening();
    }
  };
  
  useVolumeButtonDetection({
    volumeUp,
    isListening,
    onVolumeButtonPress: handleVolumeButtonPress
  });
  
  // ... keep existing code (useEffect hook for loading data)
  useEffect(() => {
    const savedCodeWords = loadCodeWords();
    if (savedCodeWords.length) {
      setCodeWords(savedCodeWords);
    }
    
    const savedContacts = loadContacts();
    if (savedContacts.length) {
      setContacts(savedContacts);
    }
    
    // Check WhatsApp connection status
    checkWhatsAppStatus()
      .then(connected => {
        setWhatsappConnected(connected);
      })
      .catch(err => {
        console.error("Error checking WhatsApp status:", err);
      });
  }, []);
  
  const handleLogout = async () => {
    try {
      // Logout user
      await logoutUser();
      
      toast.success("Logged out successfully", {
        style: {
          backgroundColor: "var(--colors-bg--300)",
          color: "var(--colors-secondary--500)",
          border: "1px solid var(--colors-primary--600)"
        }
      });
      
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const username = localStorage.getItem("username") || "User";
  const userPhoto = localStorage.getItem("userPhoto");

  // Lightning effect
  useEffect(() => {
    const createLightning = () => {
      const lightning = document.createElement('div');
      lightning.className = 'lightning';
      
      // Random position
      const left = Math.random() * 100;
      lightning.style.left = `${left}%`;
      
      document.querySelector('.lightning-container')?.appendChild(lightning);
      
      // Remove after animation
      setTimeout(() => {
        if (lightning.parentNode) {
          lightning.parentNode.removeChild(lightning);
        }
      }, 1000);
    };
    
    // Create lightning at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.94) {
        createLightning();
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05040B] text-white">
      {/* Lightning container */}
      <div className="lightning-container absolute inset-0 z-0 pointer-events-none" />
      
      {/* Ambient light overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-radial from-cyan-500/10 to-transparent opacity-30 animate-pulse-slow"></div>
        <div className="absolute w-full h-full bg-gradient-radial from-fuchsia-500/10 to-transparent opacity-20 animate-pulse-medium" style={{ top: '20%', left: '30%' }}></div>
        <div className="absolute w-full h-full bg-gradient-radial from-blue-500/5 to-transparent opacity-15 animate-pulse-fast" style={{ top: '50%', left: '60%' }}></div>
      </div>

      {/* Cyberpunk overlay effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#05040B]/90"></div>
        <div className="absolute inset-0 bg-[#05040B]/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute inset-0 scanline"></div>
      </div>
      
      <div className="app-skeleton px-4 md:px-6 pb-8 relative z-10">
        <header className="app-header flex-col md:flex-row gap-4 md:gap-0">
          <div className="app-header__anchor">
            <span className="cyberpunk-header text-xl md:text-2xl text-cyan-400 animate-text-glow">
              Suraksha<span className="text-fuchsia-400">Link</span>
            </span>
          </div>
          <nav className="w-full md:w-auto overflow-x-auto">
            <ul className={`flex ${isMobile ? 'space-x-4' : 'space-x-8'}`}>
              <li>
                <a 
                  onClick={() => setActiveTab("setup")}
                  className={`flex items-center gap-2 text-base md:text-lg uppercase ${activeTab === "setup" ? "text-cyan-400" : "text-cyan-500/50"} cursor-pointer hover:text-cyan-300 transition-colors`}
                >
                  <Settings size={isMobile ? 16 : 18} />
                  <span>Setup</span>
                </a>
              </li>
              <li>
                <a 
                  onClick={() => setActiveTab("monitor")}
                  className={`flex items-center gap-2 text-base md:text-lg uppercase ${activeTab === "monitor" ? "text-cyan-400" : "text-cyan-500/50"} cursor-pointer hover:text-cyan-300 transition-colors`}
                >
                  <AlertTriangle size={isMobile ? 16 : 18} />
                  <span>Monitor</span>
                </a>
              </li>
              <li>
                <Link to="/whatsapp-connect" className="flex items-center gap-2 text-base md:text-lg uppercase text-cyan-500/50 hover:text-fuchsia-400 transition-colors">
                  <MessageSquareMore size={isMobile ? 16 : 18} />
                  <span>WhatsApp</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-2 text-base md:text-lg uppercase text-cyan-500/50 hover:text-fuchsia-400 transition-colors">
                  <MessageSquare size={isMobile ? 16 : 18} />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <a 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-base md:text-lg uppercase text-cyan-500/50 hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  <LogOut size={isMobile ? 16 : 18} />
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            {userPhoto && (
              <img 
                src={userPhoto} 
                alt="User" 
                className="w-6 h-6 rounded-full border border-cyan-500/40"
              />
            )}
            <div className="text-cyan-400 text-sm">Welcome, {username}</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
          <div className="col-span-1 order-2 md:order-1">
            <div className="cyberpunk-card p-4">
              <div className="segment-topbar border-cyan-500/30">
                <div className="py-2">
                  <h3 className="cyberpunk-header text-cyan-400">Status</h3>
                </div>
              </div>
              
              <StatusIndicator 
                isListening={isListening} 
                volumeButtonEnabled={volumeUp} 
                whatsappConnected={whatsappConnected}
              />
              
              {!whatsappConnected && (
                <div className="mt-4">
                  <Button
                    onClick={() => navigate("/whatsapp-connect1")}
                    className="w-full bg-fuchsia-500/80 text-white hover:bg-fuchsia-500/60 transition-colors"
                    style={{
                      clipPath: "polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)"
                    }}
                  >
                    <MessageSquareMore className="mr-2 h-4 w-4" />
                    Connect WhatsApp
                  </Button>
                </div>
              )}
              
              {locationName && (
                <div className="mt-6 mb-4 flex flex-col gap-1">
                  <div className="text-xs text-fuchsia-400">CURRENT LOCATION</div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{locationName}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <div className="mb-4 text-xs text-fuchsia-400">ACTIVE CODE WORDS</div>
                {codeWords.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {codeWords.map((word) => (
                      <div key={word} className="px-3 py-1.5 bg-[#0f0b1c]/80 border border-cyan-500/40 text-cyan-400">
                        {word}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-cyan-100/90">No code words added</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-4 cyberpunk-card p-4 order-1 md:order-2">
            <div className="segment-topbar border-cyan-500/30 mb-6">
              <div>
                <div className="text-xs text-fuchsia-400">SurakshaLink v1.0</div>
                <h3 className="cyberpunk-header text-xl text-cyan-400">
                  {activeTab === "setup" ? "System Setup" : "Monitor Mode"}
                </h3>
              </div>
            </div>
            
            {activeTab === "setup" ? (
              <SetupTab
                codeWords={codeWords}
                setCodeWords={setCodeWords}
                contacts={contacts}
                setContacts={setContacts}
                volumeUp={volumeUp}
                setVolumeUp={setVolumeUp}
              />
            ) : (
              <MonitorTab
                codeWords={codeWords}
                isListening={isListening}
                transcript={transcript}
                locationName={locationName}
                toggleListening={toggleListening}
              />
            )}
          </div>
        </div>
        
        {alert.alertTriggered && (
          <AlertModal
            codeWord={alert.triggeredWord}
            location={location}
            locationName={locationName}
            onCancel={() => {
              alert.cancelAlert();
              resetTranscript();
            }}
            onSend={alert.sendAlert}
            whatsappConnected={whatsappConnected}
            isSending={alert.isSending}
            onUpdateMedia={alert.updateMediaCapture}
          />
        )}
      </div>
    </div>
  );
};

export default SafeWordsApp;
