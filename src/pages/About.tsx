
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Globe } from "lucide-react";

const About = () => {
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
    <div className="min-h-screen relative overflow-hidden bg-[#05040B] text-white flex flex-col">
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
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
          <div>
            <Link to="/" className="block">
              <h1 className="text-3xl font-bold text-cyan-400 glitch-text cyberpunk-header animate-text-glow">
                SURAKSHA <span className="text-fuchsia-400">LINK</span>
              </h1>
              <div className="text-cyan-300/80 mt-1 tracking-wider text-xs">PERSONAL SAFETY APPLICATION</div>
            </Link>
          </div>
          <Link to="/" 
            className="px-4 py-2 border border-cyan-500/60 bg-[#0c0a14]/80 hover:bg-[#151029]/80 text-white flex items-center justify-center relative overflow-hidden group transition-all duration-300"
            style={{
              clipPath: "polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)"
            }}
          >
            <span className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300"></span>
            <span className="text-cyan-300 text-sm">RETURN TO APP</span>
          </Link>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <div 
            className="p-6 border-2 border-cyan-500/80 bg-[#0f0b1c]/80 backdrop-blur-sm relative overflow-hidden mb-8"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0% 50%)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1)"
            }}
          >
            {/* Section title */}
            <div className="mb-8">
              <div className="text-xs text-cyan-400/80">SYSTEM OVERVIEW</div>
              <h2 className="text-2xl font-bold text-cyan-400 mt-1">SurakshaLink System</h2>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-4"></div>
            </div>

            {/* Project overview */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-fuchsia-400 mb-4 pb-2 border-b border-cyan-500/40">Project Overview</h3>
                <p className="text-cyan-100/90 mb-4">
                  SurakshaLink is a cutting-edge emergency alert system designed to provide users with a discreet
                  way to signal for help during dangerous situations. Using voice-activated code words,
                  real-time location tracking, and emergency contact alerts, this cyberpunk-inspired
                  application offers a layer of security for those who need it most.
                </p>
                <p className="text-cyan-100/90">
                  The system continuously monitors for user-defined trigger words and immediately
                  initiates emergency protocols when detected, capturing live video footage and precise location
                  data to provide to emergency contacts.
                </p>
              </div>

              {/* Key features */}
              <div>
                <h3 className="text-xl font-bold text-fuchsia-400 mb-4 pb-2 border-b border-cyan-500/40">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-cyan-100/90">
                  <li className="flex items-start">
                    <div className="text-cyan-400 mr-2">▸</div>
                    <span>Voice-activated emergency triggers with customizable code words</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-cyan-400 mr-2">▸</div>
                    <span>Real-time location tracking and reverse geocoding</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-cyan-400 mr-2">▸</div>
                    <span>Live video footage capture during emergencies</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-cyan-400 mr-2">▸</div>
                    <span>Emergency contact management system</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-cyan-400 mr-2">▸</div>
                    <span>Volume button activation for stealth operation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-cyan-400 mr-2">▸</div>
                    <span>Cyberpunk-inspired UI design for an immersive experience</span>
                  </li>
                </ul>
              </div>

              {/* How to use */}
              <div>
                <h3 className="text-xl font-bold text-fuchsia-400 mb-4 pb-2 border-b border-cyan-500/40">How to Use</h3>
                <div 
                  className="p-5 bg-[#0a0816]/90 relative"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 95%, 98% 100%, 0 100%, 0% 5%)",
                    boxShadow: "inset 0 0 20px rgba(0, 255, 255, 0.1)"
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 via-fuchsia-500/20 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan-500/50 via-fuchsia-500/20 to-transparent"></div>
                  
                  <div className="space-y-4 text-cyan-100/90">
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">📢</span>
                      <span><span className="text-fuchsia-400 font-bold">FIRST:</span> GO TO SETUP and ADD a CODE WORD like "APPLE". 
                      When you SPEAK this code word, voice recording and location detection will automatically start.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">🆘</span>
                      <span><span className="text-fuchsia-400 font-bold">NEXT:</span> Add your EMERGENCY CONTACTS — these are the people who will be alerted.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">📞</span>
                      <span><span className="text-fuchsia-400 font-bold">THEN:</span> Add YOUR OWN MOBILE NUMBER for verification.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">✅</span>
                      <span><span className="text-fuchsia-400 font-bold">DONE!</span> You're now ready.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">📱</span>
                      <span>On <span className="text-fuchsia-400 font-bold">MOBILE:</span> You'll see an "INSTALL APP" button. Download it to enable features properly.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">🚨</span>
                      <span>DURING <span className="text-fuchsia-400 font-bold">EMERGENCY:</span> Just open the app and SAY YOUR CODE WORD. That triggers recording, location detection, and prepares the emergency message.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">📍</span>
                      <span>A '<span className="text-fuchsia-400 font-bold">SEND</span>' button will appear to send everything instantly.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">🎙️</span>
                      <span>In the <span className="text-fuchsia-400 font-bold">MONITOR</span> section, you'll find a SPEAK button.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-cyan-400 font-bold mr-2">🚧</span>
                      <span>The app is still under development — please wait patiently while we finalize the features.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/*My Information */}
              <div>
                <h3 className="text-xl font-bold text-fuchsia-400 mb-4 pb-2 border-b border-cyan-500/40">Developer Information</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-32 h-32 md:w-40 md:h-40 relative mx-auto md:mx-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)",
                      }}
                    >
                      <div className="absolute inset-0 border-2 border-cyan-500/70 p-1"
                        style={{clipPath: "polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)"}}
                      >
                        <img 
                          src="https://media.licdn.com/dms/image/v2/D4D03AQGvPIn4k93zZg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1695129967224?e=1752105600&v=beta&t=TcFpt2oHzSVOVufFlyGUJud8S2O9OD1xJ8bD5ngGcmo" 
                          alt="Rehan Suman" 
                          className="w-full h-full object-cover"
                          style={{clipPath: "polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)"}}
                        />
                      </div>
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl text-cyan-400 mb-2 text-center md:text-left">Created by <span className="text-fuchsia-400">Rehan Suman</span></h4>
                    <p className="text-cyan-100/90 mb-6">
                      Full-stack developer specializing in cybersecurity applications and immersive user experiences.
                      With expertise in React, TypeScript, and real-time data processing, I create security solutions
                      that combine functionality with cutting-edge design.
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <a
                        href="https://github.com/rezosnd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 border border-cyan-500/40 bg-[#0a0816]/80 text-cyan-300 hover:bg-cyan-900/20 transition-colors duration-300"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
                        }}
                      >
                        <Github size={16} />
                        <span>GitHub</span>
                      </a>
                      
                      <a
                        href="https://linkedin.com/in/rezosnd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 border border-cyan-500/40 bg-[#0a0816]/80 text-cyan-300 hover:bg-cyan-900/20 transition-colors duration-300"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
                        }}
                      >
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                      </a>
                      
                      <a
                        href="https://instagram.com/r_e_z_o_s_nd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 border border-cyan-500/40 bg-[#0a0816]/80 text-cyan-300 hover:bg-cyan-900/20 transition-colors duration-300"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
                        }}
                      >
                        <Globe size={16} />
                        <span>Instagram</span>
                      </a>
                      
                      <a
                        href="mailto:contact@rehansuman.com"
                        className="flex items-center gap-2 px-3 py-1.5 border border-cyan-500/40 bg-[#0a0816]/80 text-cyan-300 hover:bg-cyan-900/20 transition-colors duration-300"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
                        }}
                      >
                        <Mail size={16} />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Button (for mobile) */}
              <div className="mt-8 flex justify-center md:hidden">
                <Link to="/" 
                  className="px-6 py-3 border border-cyan-500/60 bg-[#0c0a14]/80 hover:bg-[#151029]/80 text-white flex items-center justify-center relative overflow-hidden group transition-all duration-300"
                  style={{
                    clipPath: "polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)"
                  }}
                >
                  <span className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300"></span>
                  <span className="text-cyan-300">RETURN TO APPLICATION</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-cyan-400/50 text-sm mt-8 pb-4 relative z-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-4"></div>
          <p>© 2025 SurakshaLink. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
