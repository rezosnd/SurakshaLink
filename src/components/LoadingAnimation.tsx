
import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";

const LoadingAnimation = () => {
  const animationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const rotateCircles = () => {
      if (!animationRef.current) return;
      
      const circles = animationRef.current.querySelectorAll('div[class*="circle"]');
      
      circles.forEach((circle) => {
        const direction = Math.random() > 0.5 ? "-" : "+";
        const speed = Math.floor(Math.random() * 250 + 100);
        let rotation = 0;
        
        const animate = () => {
          rotation += direction === "+" ? 1 : -1;
          circle.setAttribute("style", `transform: rotate(${rotation}deg)`);
          requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
      });
    };
    
    rotateCircles();
    
    // Add scanner animation
    const scanner = document.createElement("div");
    scanner.className = "scanner-line";
    if (animationRef.current) {
      animationRef.current.appendChild(scanner);
    }
    
    // Add pulsing effect to the circles
    const circles = animationRef.current?.querySelectorAll('div[class*="circle"]');
    circles?.forEach((circle) => {
      circle.classList.add("pulse-glow");
    });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center flex-col relative overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Add digital noise background */}
      <div className="absolute inset-0 noise-overlay"></div>
      
      {/* Add scan lines */}
      <div className="absolute inset-0 scan-lines"></div>
      
      <div className="main relative w-[410px] h-[410px] max-w-[90vw] max-h-[90vw] bg-transparent mx-auto scale-[0.6] z-10" ref={animationRef}>
        <div className="circle1 prop"></div>
        <div className="void__1 prop_Void"></div>
        <div className="circle2 prop"></div>
        <div className="void__2 prop_Void"></div>
        <div className="circle3 prop"></div>
        <div className="void__3 prop_Void"></div>
        <div className="circle3_1 prop"></div>
        <div className="void__3_1 prop_Void"></div>
        <div className="circle3_2 prop"></div>
        <div className="void__3_2 prop_Void"></div>
        <div className="circle4 prop"></div>
        <div className="void__4 prop_Void"></div>
        <div className="circle5 prop"></div>
        <div className="void__5 prop_Void"></div>
        <div className="circle6 prop"></div>
        <div className="void__6 prop_Void"></div>
        <div className="circle7 prop"></div>
        <div className="void__7 prop_Void"></div>
        <div className="circle7_1 prop"></div>
        <div className="void__7_1 prop_Void"></div>
        <div className="circle7_2 prop"></div>
        <div className="void__7_2 prop_Void"></div>
        <div className="circle8 prop"></div>
        <div className="void__8 prop_Void"></div>
        <div className="circle9 prop"></div>
        <div className="void__9 prop_Void"></div>
        <div className="circle10 prop"></div>
        <div className="circle11 prop"></div>
        <div className="void__11 prop_Void"></div>
        <div className="circle12 prop"></div>
        <div className="void__12 prop_Void"></div>
        <div className="circle13 prop"></div>
        <div className="void__13 prop_Void"></div>
        <div className="circle14 prop"></div>
        <div className="void__14 prop_Void"></div>
      </div>
      
      <div className="mt-8 flex items-center justify-center flex-col z-10">
        <LoaderCircle className="h-10 w-10 text-secondary--500 animate-spin" />
        <h2 className="cyberpunk-header text-xl md:text-2xl text-secondary--500 mt-4 glitch-text" data-text="Initializing SafeWords">Initializing SafeWords</h2>
        <p className="text-primary--300 mt-2">Loading security protocols...</p>
        
        <div className="mt-6 flex flex-col gap-2 max-w-xs w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-tertiary--500">Connecting to network</span>
            <span className="text-xs text-secondary--500">COMPLETE</span>
          </div>
          <div className="h-1 w-full bg-colors-bg--300 overflow-hidden">
            <div className="h-full bg-secondary--500 w-full"></div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-tertiary--500">Loading system modules</span>
            <span className="text-xs text-secondary--500">COMPLETE</span>
          </div>
          <div className="h-1 w-full bg-colors-bg--300 overflow-hidden">
            <div className="h-full bg-secondary--500 w-full"></div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-tertiary--500">Initializing security</span>
            <span className="text-xs text-tertiary--500 animate-pulse">IN PROGRESS</span>
          </div>
          <div className="h-1 w-full bg-colors-bg--300 overflow-hidden">
            <div className="h-full bg-tertiary--500 animate-pulse" style={{width: "75%"}}></div>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-tertiary--500 terminal-text">
          <div className="typing-effect">{'> Scanning for potential threats...'}</div>
          <div className="typing-effect" style={{animationDelay: "2s"}}>{'> Establishing secure connection...'}</div>
          <div className="typing-effect" style={{animationDelay: "4s"}}>{'> Loading user profile...'}</div>
        </div>
      </div>
      
      <div className="circuit-lines absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-secondary--500 opacity-30"
            style={{ 
              height: '1px',
              width: `${Math.random() * 80 + 20}%`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 20}%`,
              boxShadow: '0 0 8px var(--colors-secondary--500)',
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Add hexagon grid background */}
      <div className="hexagon-grid"></div>
      
      {/* Add style for the new elements */}
      <style>
        {`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          pointer-events: none;
        }
        
        .scan-lines {
          background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0, 237, 255, 0.05) 50%, rgba(0, 237, 255, 0.05));
          background-size: 100% 4px;
          pointer-events: none;
        }
        
        .scanner-line {
          position: absolute;
          height: 2px;
          width: 100%;
          background: rgba(0, 237, 255, 0.5);
          top: 0;
          box-shadow: 0 0 8px rgba(0, 237, 255, 0.8);
          animation: scan 4s linear infinite;
          pointer-events: none;
        }
        
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        .pulse-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          0% { filter: drop-shadow(0 0 1px rgba(0, 237, 255, 0.2)); }
          100% { filter: drop-shadow(0 0 5px rgba(0, 237, 255, 0.8)); }
        }
        
        .terminal-text {
          font-family: monospace;
          max-width: 300px;
        }
        
        .typing-effect {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 3s steps(40, end) forwards;
          opacity: 0;
        }
        
        @keyframes typing {
          0% {
            width: 0;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
        
        .glitch-text {
          position: relative;
          color: #00edff;
          font-weight: bold;
          text-shadow: 
            0 0 2px #00edff,
            0 0 5px #00edff;
          animation: glitch 2s infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          color: #00edff;
          background: black;
          clip-path: inset(0 0 0 0);
        }

        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 red;
          animation: glitchTop 2s infinite;
        }

        .glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 blue;
          animation: glitchBottom 2s infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitchTop {
          0% { clip-path: inset(0 0 85% 0); }
          10% { clip-path: inset(0 0 45% 0); transform: translate(2px, -2px); }
          20% { clip-path: inset(0 0 65% 0); transform: translate(-2px, 2px); }
          30% { clip-path: inset(0 0 55% 0); transform: translate(2px, -1px); }
          100% { clip-path: inset(0 0 85% 0); transform: translate(0, 0); }
        }

        @keyframes glitchBottom {
          0% { clip-path: inset(85% 0 0 0); }
          10% { clip-path: inset(45% 0 0 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(65% 0 0 0); transform: translate(2px, -2px); }
          30% { clip-path: inset(55% 0 0 0); transform: translate(-2px, 1px); }
          100% { clip-path: inset(85% 0 0 0); transform: translate(0, 0); }
        }

        .hexagon-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%239C92AC' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
        `}
      </style>
    </div>
  );
};

export default LoadingAnimation;
