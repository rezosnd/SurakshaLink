import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWhatsAppQR, checkWhatsAppStatus } from "@/services/whatsappService";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, QrCode, X } from "lucide-react";
import { toast } from "sonner";
import ComingSoonOverlay from "@/components/ComingSoonOverlay";

const WhatsAppConnect = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const navigate = useNavigate();
  
  // Function to fetch QR code
  const fetchQRCode = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching WhatsApp QR code...");
      const code = await getWhatsAppQR();
      console.log("QR code fetch result:", code ? "Success" : "Failed");
      setQrCode(code);
      if (code) {
        setShowQrCode(true);
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      toast.error("Failed to generate QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to check WhatsApp connection status
  const checkStatus = async () => {
    if (isCheckingStatus) return;
    
    setIsCheckingStatus(true);
    try {
      console.log("Checking WhatsApp connection status...");
      const isConnected = await checkWhatsAppStatus();
      console.log("WhatsApp connection status:", isConnected ? "Connected" : "Not connected");
      
      if (isConnected) {
        toast.success("WhatsApp connected successfully!");
        
        // Clear interval if it exists
        if (statusCheckInterval) {
          window.clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        // Navigate back to main app
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  useEffect(() => {

    const userId = localStorage.getItem("userId") || "default-user";
    if (userId === "default-user") {

      localStorage.setItem("userId", "default-user");
    }

    fetchQRCode();

    const interval = window.setInterval(checkStatus, 5000);
    setStatusCheckInterval(interval);

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    const createLightning = () => {
      const lightning = document.createElement('div');
      lightning.className = 'lightning';
      

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
    <div className="min-h-screen relative overflow-hidden bg-[#05040B] text-white flex flex-col">
      {/* Lightning container */}
      <div className="lightning-container absolute inset-0 z-0 pointer-events-none" />
      
      {/* Parallax Background */}
      <div id="container" className="container absolute inset-0 z-0 overflow-hidden">
        {/* Simplified background for parallax effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-800 opacity-20"></div>
      </div>

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

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-4">
        <div 
          className="p-6 w-full max-w-md border-2 border-cyan-500/80 bg-[#0f0b1c]/80 backdrop-blur-sm relative overflow-hidden login-container-glow"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0% 50%)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)"
          }}
        >
          {/* Glitch effect */}
          <div className="absolute inset-0 glitch-overlay opacity-10"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyan-400 glitch-text cyberpunk-header animate-text-glow">
              WHATSAPP <span className="text-fuchsia-400">CONNECT</span>
            </h1>
            <div className="text-cyan-300/80 mt-2 tracking-wider text-sm">CONNECT YOUR WHATSAPP</div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-4"></div>
          </div>

          <div className="space-y-6">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="mb-4 text-primary--300 hover:text-primary--100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to App
            </Button>
            
            <p className="text-center">
              Scan the QR code with your WhatsApp app to connect SafeWords with your WhatsApp account.
              This will allow the app to send emergency alerts through WhatsApp.
            </p>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-secondary--500" />
                <p className="mt-4 text-tertiary--500">Generating QR Code...</p>
              </div>
            ) : (
              <>
                {/* QR Code Popup */}
                {showQrCode && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg relative" data-augmented-ui="tl-clip br-clip border">
                      <button
                        onClick={() => setShowQrCode(false)}
                        className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200"
                      >
                        <X className="h-6 w-6" />
                      </button>
                      <img
                        src={`data:image/png;base64,${qrCode}`}
                        alt="WhatsApp QR Code"
                        className="w-64 h-64"
                      />
                      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="h-px bg-secondary--500 opacity-50 w-full absolute animate-scan"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!showQrCode && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <QrCode className="h-16 w-16 text-primary--500" />
                    <p className="mt-4 text-primary--300">
                      Click below to generate QR code
                    </p>
                    <Button
                      onClick={() => {
                        if (qrCode) {
                          setShowQrCode(true);
                        } else {
                          fetchQRCode();
                        }
                      }}
                      className="mt-4 bg-secondary--500 text-colors-bg--300 hover:bg-secondary--900"
                    >
                      {qrCode ? "Show QR Code" : "Generate QR Code"}
                    </Button>
                  </div>
                )}
              </>
            )}

            <div className="text-sm text-primary--300 mt-4 p-3 rounded border border-primary--800 bg-gradient-to-r from-colors-bg--500 to-colors-bg--300">
              <span className="text-tertiary--500">NOTE:</span> This QR code expires after a few minutes. If it expires, click the retry button to generate a new one.
            </div>
            
            {isCheckingStatus && (
              <div className="flex items-center text-tertiary--500">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Checking connection status...
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Coming Soon Overlay */}
      <ComingSoonOverlay 
        message="WhatsApp integration is coming soon! Check back later for full functionality." 
      />
    </div>
  );
};

export default WhatsAppConnect;



