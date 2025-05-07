import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

declare global {
  interface Window {
    Parallax: any;
  }
}

const NotFound = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const scene = document.getElementById('scene');
    if (scene && window.Parallax) {
     const parallaxInstance = new window.Parallax(scene, {
  relativeInput: !isMobile, 
  hoverOnly: false,
  calibrateX: true,
  calibrateY: true,
  invertX: false,
  invertY: false,
  limitX: false,
  limitY: false,
  scalarX: isMobile ? 5 : 2,  
  scalarY: isMobile ? 10 : 8,
  frictionX: 0.1,
  frictionY: 0.1
});

if (isMobile) {
  parallaxInstance.enable(); 
}


      return () => {
        parallaxInstance.disable();
        if (parallaxInstance.destroy) parallaxInstance.destroy();
      };
    }
  }, [isMobile]);

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

    const interval = setInterval(() => {
      if (Math.random() > 0.94) {
        createLightning();
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05040B] text-white flex flex-col">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />
      
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
      
      {/* Lightning container */}
      <div className="lightning-container absolute inset-0 z-0 pointer-events-none" />
      
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

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-4 py-8">
        {/* FOLDER UI */}
        <div className="folder-container-neon">
          <div className="doc-sheet sheet-1"></div>
          <div className="doc-sheet sheet-2"></div>
          <div className="doc-sheet sheet-3"></div>
          <div className="folder-card-neon">
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 folder-icon-neon mb-2 sm:mb-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-base sm:text-xl font-semibold folder-title-neon">COMING SOON</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Message + Button */}
        <div className="text-center text-gray-300 mt-4 sm:mt-8">
          <p className="text-xs sm:text-sm md:text-base mb-3">Page not found. Click below to return to main page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 sm:px-6 sm:py-2 mt-1 bg-[#00ffff] text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform text-sm sm:text-base"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
