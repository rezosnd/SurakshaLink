import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    
    // Animate out before hiding
    handleDismiss();
  };

  const handleDismiss = () => {
    setAnimateOut(true);
    // Remove from DOM after animation completes
    setTimeout(() => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      setAnimateOut(false);
    }, 500); // Match animation duration
  };

  if (!showPrompt) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 ${
        animateOut ? "animate-slide-out-right" : "animate-slide-in-right"
      } transition-all duration-500 md:bottom-8 md:right-8`}
    >
      <div className="backdrop-blur-lg bg-black/30 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.3)]">
        <div className="relative">
          {/* Glowing top border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"></div>
          
          {/* Content */}
          <div className="p-4 md:p-5">
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4 relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl md:text-3xl">📱</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-base md:text-lg text-white/90 mb-1.5">Install Web App</h3>
                <p className="text-xs md:text-sm text-white/70 mb-3">Add to home screen for better experience</p>
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Install Now</span>
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="m8 17 4 4 4-4"/>
                    <path d="M12 12v9"/>
                    <path d="m20 16-4-4-4 4"/>
                    <path d="M8 8H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-2"/>
                    <path d="M12 2v10"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Animated glow effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -inset-[100%] opacity-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt
