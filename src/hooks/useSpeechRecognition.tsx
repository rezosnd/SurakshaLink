
import { useState, useEffect, useCallback } from "react";

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  listening: boolean;
  resetTranscript: () => void;
  startListening: (options?: SpeechRecognitionOptions) => void;
  stopListening: () => void;
  browserSupportsSpeechRecognition: boolean;
}

// Define types for the Web Speech API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [browserSupports, setBrowserSupports] = useState(false);
  
  useEffect(() => {
  
    const SpeechRecognitionAPI = (
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      null
    ) as SpeechRecognitionConstructor | null;
    
    if (SpeechRecognitionAPI) {
      setBrowserSupports(true);
    }
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);
  
  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);
  
  const startListening = useCallback((options: SpeechRecognitionOptions = {}) => {
    const SpeechRecognitionAPI = (
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      null
    ) as SpeechRecognitionConstructor | null;
    
    if (!SpeechRecognitionAPI) {
      console.error("Speech recognition is not supported in this browser");
      return;
    }
    
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || false;
    recognition.lang = "en-US";
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = "";

      if (event.results) {
        for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
          if (event.results[i] && event.results[i][0]) {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        
        setTranscript(prev => prev + " " + currentTranscript);
      }
    };
    
    recognition.onend = () => {

      
      if (options.continuous && listening) {
        recognition.start();
      } else {
        setListening(false);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      setListening(false);
    };
    
    setRecognitionInstance(recognition);
    recognition.start();
    setListening(true);
    
  }, [recognitionInstance, listening]);
  
  const stopListening = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setListening(false);
  }, [recognitionInstance]);
  
  return {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition: browserSupports
  };
};

export default useSpeechRecognition;
