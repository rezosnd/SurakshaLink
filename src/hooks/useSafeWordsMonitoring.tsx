
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

interface UseSafeWordsMonitoringProps {
  codeWords: string[];
  contacts: {name: string, phone: string, email: string}[];
  onTriggerAlert: (word: string) => void;
}

const useSafeWordsMonitoring = ({ 
  codeWords, 
  contacts,
  onTriggerAlert
}: UseSafeWordsMonitoringProps) => {
  const [isListening, setIsListening] = useState(false);
  
  const { 
    transcript, 
    resetTranscript, 
    startListening, 
    stopListening, 
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition();

 
  useEffect(() => {
    if (!isListening || !transcript) return;
    
    const words = transcript.toLowerCase().split(' ');
    const foundCodeWord = codeWords.find(codeWord => 
      words.includes(codeWord.toLowerCase())
    );
    
    if (foundCodeWord) {
      onTriggerAlert(foundCodeWord);
    }
  }, [transcript, isListening, codeWords, onTriggerAlert]);

  const toggleListening = () => {
    if (codeWords.length === 0) {
      toast.warning("Please add at least one code word before listening");
      return;
    }
    
    if (contacts.length === 0) {
      toast.warning("Please add at least one emergency contact before listening");
      return;
    }
    
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition");
      return;
    }
    
    if (isListening) {
      stopListening();
      setIsListening(false);
      toast.info("Stopped listening for code words");
    } else {
      startListening({ continuous: true });
      setIsListening(true);
      toast.success("Now listening for your code words");
    }
  };

  return {
    isListening,
    transcript,
    resetTranscript,
    toggleListening,
    stopListening: () => {
      stopListening();
      setIsListening(false);
    }
  };
};

export default useSafeWordsMonitoring;
