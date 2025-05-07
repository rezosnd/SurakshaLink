
import { XCircle } from "lucide-react";
import { useState } from "react";

interface ComingSoonOverlayProps {
  message?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const ComingSoonOverlay = ({ 
  message = "This feature is coming soon!", 
  onClose, 
  showCloseButton = true 
}: ComingSoonOverlayProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-colors-bg--900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className="bg-colors-bg--300 p-6 rounded-lg max-w-md border-2 border-tertiary--500 relative"
        data-augmented-ui="tr-clip bl-clip border"
      >
        {showCloseButton && (
          <button 
            onClick={handleClose} 
            className="absolute top-2 right-2 text-primary--300 hover:text-secondary--500"
          >
            <XCircle className="h-6 w-6" />
          </button>
        )}
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-tertiary--500 bg-opacity-20 flex items-center justify-center">
            <span className="text-tertiary--500 text-2xl font-bold">!</span>
          </div>
          
          <h3 className="text-xl font-bold text-secondary--500">Coming Soon</h3>
          
          <p className="text-primary--200 text-center">{message}</p>
          
          <div className="mt-4 text-xs text-primary--300 bg-colors-bg--500 p-2 rounded-md w-full text-center">
            The QR code generation will still work for testing purposes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
