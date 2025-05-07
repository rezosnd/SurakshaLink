
import { useEffect, useState } from "react";
import SafeWordsApp from "@/components/SafeWordsApp";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [stars, setStars] = useState<Array<{ id: number; top: string; left: string; delay: string; size: string }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        size: `star-${Math.floor(Math.random() * 3) + 1}`,
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <>
      {/* Animated Space Background */}
      <div className="background-container">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
        <div className="fast-clouds"></div>
        <img 
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" 
          alt="moon" 
          className="moon float" 
          style={{ 
            height: isMobile ? '30vh' : '70vh',
            width: isMobile ? '30vh' : '70vh',
            right: isMobile ? '-10px' : '20px',
            top: isMobile ? '5vh' : '20px',
            zIndex: 3,
            position: 'absolute'
          }}
        />
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star ${star.size}`}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              zIndex: 2
            }}
          />
        ))}
      </div>

      {/* Grid and noise overlay effects */}
      <div className="grid-overlay"></div>
      <div className="noise-overlay"></div>
      <div className="scanline"></div>
      
      {/* Content */}
      <div className="content-container min-h-screen">
        <SafeWordsApp />
      </div>
    </>
  );
};

export default Index;
