import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signInWithGoogle } from "@/services/firebaseService";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const scene = document.getElementById('scene');
    if (scene && window.Parallax) {
      const parallaxInstance = new window.Parallax(scene, {
        relativeInput: true,
        hoverOnly: false,
        calibrateX: true,
        calibrateY: true,
        invertX: false,
        invertY: false,
        limitX: false,
        limitY: false,
        scalarX: 2,
        scalarY: 8,
        frictionX: 0.1,
        frictionY: 0.1
      });

      return () => {
        parallaxInstance.disable();
        if (parallaxInstance.destroy) parallaxInstance.destroy();
      };
    }
  }, []);


  useEffect(() => {
    const createLightning = () => {
      const lightning = document.createElement('div');
      lightning.className = 'lightning';

      const left = Math.random() * 100;
      lightning.style.left = `${left}%`;
      
      document.querySelector('.lightning-container')?.appendChild(lightning);
      

      setTimeout(() => {
        if (lightning.parentNode) {
          lightning.parentNode.removeChild(lightning);
        }
      }, 1000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.94) {
        createLightning();
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05040B] text-white flex flex-col">
      {/* Lightning container */}
      <div className="lightning-container absolute inset-0 z-0 pointer-events-none" />
       <style>
        {`
        .lightning {
          position: absolute;
          top: 0;
          height: 100%;
          width: 2px;
          background-color: white;
          z-index: 10;
          opacity: 0.6;
          filter: blur(1px);
          animation: lightning 0.5s linear;
        }

        @keyframes lightning {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5);
          }
          20% {
            opacity: 0;
          }
          30% {
            opacity: 0.6;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.4);
          }
          100% {
            opacity: 0;
          }
        }

        .scene {
          position: absolute;
          width: 100%;
          height: 100%;
          list-style: none;
          padding: 0;
          margin: 0;
        }

       .layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: -1;
}

.layer img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image covers the screen without distortion */
  object-position: center; /* Keeps the image centered */
  opacity: 1;
  display: block; /* Ensures the image is rendered correctly */
}

        .glow-effect {
          filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes pulse-medium {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes pulse-fast {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }

        .animate-pulse-medium {
          animation: pulse-medium 4s ease-in-out infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 3s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .scanline {
          background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.03), transparent);
          background-size: 100% 3px;
          animation: scanline 1.5s linear infinite;
        }

        @keyframes scanline {
          0% {
            background-position: 0 -100vh;
          }
          100% {
            background-position: 0 100vh;
          }
        }

        /* Folder UI Animations */
        @keyframes line-pulse-extend-1 {
          0% { height: 30px; opacity: 0.6; box-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
          50% { height: 95px; opacity: 1; box-shadow: 0 0 20px currentColor, 0 0 30px currentColor, 0 0 50px currentColor; }
          100% { height: 90px; opacity: 0.9; box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
        }
        @keyframes line-pulse-extend-2 {
          0% { height: 35px; opacity: 0.7; box-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
          50% { height: 105px; opacity: 1; box-shadow: 0 0 20px currentColor, 0 0 30px currentColor, 0 0 50px currentColor; }
          100% { height: 100px; opacity: 0.9; box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
        }
        @keyframes line-pulse-extend-3 {
          0% { height: 28px; opacity: 0.5; box-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
          50% { height: 90px; opacity: 0.9; box-shadow: 0 0 20px currentColor, 0 0 30px currentColor, 0 0 45px currentColor; }
          100% { height: 85px; opacity: 0.8; box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
        }
        @keyframes folder-glow {
          0%, 100% {
            box-shadow:
                0 0 10px rgba(0, 255, 255, 0.5),
                0 0 15px rgba(255, 0, 255, 0.4),
                0 0 20px rgba(0, 255, 0, 0.3),
                inset 0 0 8px rgba(0,0,0,0.4);
          }
          50% {
            box-shadow:
                0 0 15px rgba(0, 255, 255, 0.7),
                0 0 25px rgba(255, 0, 255, 0.6),
                0 0 35px rgba(0, 255, 0, 0.5),
                inset 0 0 12px rgba(0,0,0,0.5);
          }
        }

        .folder-container-neon {
          position: relative;
          width: 280px;
          height: 300px;
          transition: transform 0.6s ease-out;
          perspective: 1500px;
          transform-style: preserve-3d;
        }
        
        @media (max-width: 640px) {
          .folder-container-neon {
            width: 230px;
            height: 250px;
          }
        }
        
        .doc-sheet {
          position: absolute;
          bottom: 115px;
          left: 50%;
          width: 80px;
          background-color: rgba(10, 10, 30, 0.6);
          border-radius: 4px 4px 0 0;
          transform-origin: bottom center;
          opacity: 0.7;
          transition: height 0.5s ease-out, opacity 0.5s ease-out, box-shadow 0.5s ease-out, transform 0.6s ease-out;
          border: 1px solid currentColor;
          border-bottom: none;
          box-shadow: 0 0 10px currentColor, 0 0 15px currentColor;
          color: white;
        }
        
        @media (max-width: 640px) {
          .doc-sheet {
            bottom: 95px;
            width: 65px;
          }
        }
        
        .sheet-1 {
          color: #00ffff;
          height: 30px;
          transform: translateX(calc(-50% - 55px)) rotate(-12deg);
          z-index: 1; opacity: 0.6;
        }
        .sheet-2 {
          color: #ff00ff;
          height: 35px;
          transform: translateX(-50%) rotate(0deg);
          z-index: 2; opacity: 0.7;
          width: 90px;
        }
        .sheet-3 {
          color: #00ff00;
          height: 28px;
          transform: translateX(calc(-50% + 55px)) rotate(12deg);
          z-index: 1; opacity: 0.5;
        }
        
        @media (max-width: 640px) {
          .sheet-1 {
            transform: translateX(calc(-50% - 45px)) rotate(-12deg);
          }
          .sheet-2 {
            width: 75px;
          }
          .sheet-3 {
            transform: translateX(calc(-50% + 45px)) rotate(12deg);
          }
        }
        
        .folder-container-neon:hover {
          transform: rotateY(5deg) rotateX(3deg);
        }
        .folder-container-neon:hover .sheet-1 {
          animation: line-pulse-extend-1 0.7s ease-in-out forwards;
          transform: translateX(calc(-50% - 60px)) rotate(-15deg) translateZ(10px);
        }
        .folder-container-neon:hover .sheet-2 {
          animation: line-pulse-extend-2 0.7s 0.1s ease-in-out forwards;
          transform: translateX(-50%) rotate(0deg) translateZ(15px);
        }
        .folder-container-neon:hover .sheet-3 {
          animation: line-pulse-extend-3 0.7s 0.05s ease-in-out forwards;
          transform: translateX(calc(-50% + 60px)) rotate(15deg) translateZ(10px);
        }
        .folder-container-neon:hover .folder-card-neon {
          transform: translateY(-10px) scale(1.03) translateZ(20px);
          animation: folder-glow 2s infinite alternate ease-in-out;
        }
        
        @media (max-width: 640px) {
          .folder-container-neon:hover .sheet-1 {
            transform: translateX(calc(-50% - 50px)) rotate(-15deg) translateZ(10px);
          }
          .folder-container-neon:hover .sheet-3 {
            transform: translateX(calc(-50% + 50px)) rotate(15deg) translateZ(10px);
          }
        }
        
        .folder-card-neon {
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          height: 120px;
          background-color: rgba(20, 20, 50, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 255, 255, 0.4);
          border-radius: 0 8px 16px 16px;
          box-shadow:
            0 0 10px rgba(0, 255, 255, 0.4),
            0 0 15px rgba(255, 0, 255, 0.3),
            inset 0 0 6px rgba(0,0,0,0.4);
          padding: 1.5rem 2rem;
          z-index: 5;
          transition: transform 0.6s ease-out, box-shadow 0.6s ease-out;
          font-family: 'Orbitron', sans-serif;
          border-top: none;
          transform-style: preserve-3d;
        }
        
        @media (max-width: 640px) {
          .folder-card-neon {
            bottom: 30px;
            height: 100px;
            padding: 1rem 1.5rem;
          }
        }
        
        .folder-card-neon::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -1px;
          height: 20px;
          width: 120px;
          background-color: rgba(20, 20, 50, 0.95);
          border: 1px solid rgba(0, 255, 255, 0.4);
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 -3px 8px rgba(0, 255, 255, 0.3);
          z-index: 4;
        }
        
        @media (max-width: 640px) {
          .folder-card-neon::before {
            width: 100px;
          }
        }
        
        .folder-icon-neon {
          color: #00ffff;
          filter: drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 12px #00ffff);
          transition: transform 0.4s ease-in-out;
        }
        .folder-title-neon {
          color: #e0e0e0;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-shadow:
            0 0 4px #00ffff,
            0 0 8px #ff00ff,
            0 0 12px #00ff00;
        }
        .folder-container-neon:hover .folder-icon-neon {
          transform: scale(1.2) translateZ(5px);
        }
        .folder-card-neon > * {
          position: relative;
          z-index: 6;
          transform-style: preserve-3d;
        }
        `}
      </style>
      
      {/* Parallax Background */}
      <div id="container" className="container absolute inset-0 z-0 overflow-hidden">
        <ul id="scene" className="scene">    
          <li className="layer" data-depth="0.05"><img className="glow-effect layer-1 animate-float-slow" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-01-01_cleaned.svg" alt="layer-1" /></li>
          <li className="layer" data-depth="0.10"><img className="glow-effect layer-2 animate-float-medium" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-11_cleaned.svg" alt="layer-2" /></li>     
          <li className="layer" data-depth="0.10"><img className="glow-effect layer-3 animate-float-fast" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-10_cleaned.svg" alt="layer-3" /></li>
          <li className="layer" data-depth="0.10"><img className="glow-effect layer-4 animate-float-medium" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-09_cleaned.svg" alt="layer-4" /></li>
          <li className="layer" data-depth="0.05"><img className="glow-effect layer-5 animate-float-slow" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-04_cleaned.svg" alt="layer-5" /></li>
          <li className="layer" data-depth="0.05"><img className="glow-effect layer-6 animate-float-medium" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-03_cleaned.svg" alt="layer-6" /></li>
          <li className="layer" data-depth="0.05"><img className="glow-effect layer-7 animate-float-fast" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-02_cleaned.svg" alt="layer-7" /></li>     
          <li className="layer" data-depth="0.15"><img className="glow-effect layer-8 animate-float-medium" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-06_cleaned.svg" alt="layer-8" /></li>
          <li className="layer" data-depth="0.15"><img className="glow-effect layer-9 animate-float-slow" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-05_cleaned.svg" alt="layer-9" /></li>    
          <li className="layer" data-depth="0.15"><img className="glow-effect layer-10 animate-float-fast" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-08_cleaned.svg" alt="layer-10" /></li>
          <li className="layer" data-depth="0.15"><img className="glow-effect layer-11 animate-float-medium" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/73058/manHuntDown005-1-psd-07_cleaned.svg" alt="layer-11" /></li>  
        </ul>
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

      {/* Login Container */}
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
              SURAKSHA <span className="text-fuchsia-400">LINK</span>
            </h1>
            <div className="text-cyan-300/80 mt-2 tracking-wider text-sm">PERSONAL SAFETY APPLICATION</div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-4"></div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-6 border border-cyan-500/60 bg-[#0c0a14]/80 hover:bg-[#151029]/80 text-white flex items-center justify-center gap-2 relative overflow-hidden group transition-all duration-300"
                style={{
                  clipPath: "polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)"
                }}
              >
                {/* Button hover effect */}
                <span className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300"></span>
                
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CONNECTING...
                  </span>
                ) : (
                  <>
                    <svg className="h-5 w-5 text-cyan-300" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="tracking-wider cyberpunk-text">SIGN IN WITH GOOGLE</span>
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-cyan-300/60">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-4"></div>
              <p className="mt-4 text-fuchsia-400/80">
                SurakshaLink - Inspired by the bond of protection, with a modern twist 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



