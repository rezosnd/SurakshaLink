
import { useRef, useState, useEffect, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin, Video, Loader2, Camera, MessageSquareMore, RefreshCcw, Undo, FlipHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AlertModalProps {
  codeWord: string;
  location: { lat: number; lng: number } | null;
  locationName: string | null;
  onCancel: () => void;
  onSend: () => void;
  whatsappConnected?: boolean;
  isSending?: boolean;
  onUpdateMedia?: (url: string, type: 'image' | 'video') => void;
}

const AlertModal = ({ 
  codeWord, 
  location, 
  locationName, 
  onCancel, 
  onSend, 
  whatsappConnected = false,
  isSending = false,
  onUpdateMedia
}: AlertModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [loadingCamera, setLoadingCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Create a style element for animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes scan {
        0% { top: -5%; }
        100% { top: 105%; }
      }
      
      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }
      
      @keyframes pulse-animation {
        0% { transform: scale(0.8); opacity: 0.8; }
        50% { transform: scale(1.5); opacity: 0; }
        100% { transform: scale(0.8); opacity: 0.8; }
      }
      
      .pulse-animation {
        animation: pulse-animation 2s infinite;
      }
      
      .scanline::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: rgba(0, 255, 255, 0.3);
        animation: scan 2s linear infinite;
      }
      
      .camera-container {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        background-color: #0c0a14;
      }
      
      .camera-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Function to switch camera
  const switchCamera = useCallback(async () => {
    if (stream) {
      // Stop current stream
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setLoadingCamera(true);
    setCameraActive(true);
    
    // Camera will be reinitialized in the useEffect below
  }, [stream]);

  // Request camera access
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const setupCamera = async () => {
      try {
        console.log(`Attempting to access camera with facing mode: ${facingMode}...`);
        
        // Force environment camera on mobile, fallback to any camera
        const constraints = { 
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true 
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Camera access successful, stream tracks:", mediaStream.getTracks().length);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Ensure video is visible with opacity 1
          videoRef.current.style.opacity = '1';
          videoRef.current.style.visibility = 'visible';
          videoRef.current.style.display = 'block';
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log("Video playing successfully");
                })
                .catch(e => {
                  console.error("Error playing video:", e);
                  setCameraError("Could not play camera stream");
                });
            }
          };
        } else {
          console.error("Video reference is null");
        }
        
        setStream(mediaStream);
        setLoadingCamera(false);
        
        // Auto-start recording
        try {
          const mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
              ? 'video/webm;codecs=vp9' 
              : 'video/webm'
          });
          
          setRecorder(mediaRecorder);
          
          const chunks: Blob[] = [];
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
              setRecordedChunks([...chunks]);
              console.log("Recorded chunk size:", e.data.size);
            }
          };
          
          mediaRecorder.onstop = () => {
            console.log("Media recorder stopped, processing chunks...");
            if (chunks.length > 0) {
              const blob = new Blob(chunks, { type: 'video/webm' });
              const url = URL.createObjectURL(blob);
              setVideoUrl(url);
              
              // Save to localStorage for sending
              try {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  const base64data = reader.result as string;
                  localStorage.setItem('emergencyVideo', base64data);
                  console.log("Video stored in localStorage");
                  if (onUpdateMedia) {
                    onUpdateMedia(base64data, 'video');
                  }
                };
              } catch (err) {
                console.error("Error saving video to localStorage:", err);
              }
            }
          };
          
          mediaRecorder.start(1000);
          setIsRecording(true);
          console.log("Recording started");
          
          // Recording progress timer (10 seconds max)
          let progress = 0;
          timer = setInterval(() => {
            progress += 1;
            setRecordingProgress(progress * 10);
            
            // Take a snapshot for evidence every 3 seconds
            if (progress % 3 === 0) {
              captureImage();
            }
            
            if (progress >= 10) {
              clearInterval(timer);
              if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                setIsRecording(false);
                console.log("Recording stopped after 10 seconds");
              }
            }
          }, 1000);
        } catch (err) {
          console.error("Error setting up media recorder:", err);
          setCameraError("Could not initialize recording");
        }
        
      } catch (error) {
        console.error("Error accessing camera:", error);
        setLoadingCamera(false);
        setCameraError(`Could not access camera: ${(error as Error).message}`);
      }
    };
    
    if (cameraActive) {
      setupCamera();
    }
    
    return () => {
      // Clean up
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log("Camera track stopped");
        });
      }
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [cameraActive, facingMode, onUpdateMedia]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && !loadingCamera && cameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Only capture if video is actually playing with valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log("Video not ready for capture");
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(imageDataUrl);
          
          // Save the latest image to localStorage
          localStorage.setItem('emergencyImage', imageDataUrl);
          console.log("Image captured and stored");
          
          // Send to parent component
          if (onUpdateMedia) {
            onUpdateMedia(imageDataUrl, 'image');
          }
          
          // Toggle between live and captured for 1 second
          setShowLivePreview(false);
          setTimeout(() => {
            if (cameraActive) {
              setShowLivePreview(true);
            }
          }, 1000);
          
          // After third image capture, turn off camera
          if (recordingProgress >= 80) {
            setCameraActive(false);
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            if (recorder && recorder.state === 'recording') {
              recorder.stop();
            }
          }
        } catch (err) {
          console.error("Error capturing image:", err);
        }
      }
    } else {
      console.log("Cannot capture - video ref:", videoRef.current ? "exists" : "missing", 
                 "canvas ref:", canvasRef.current ? "exists" : "missing", 
                 "loading:", loadingCamera, "active:", cameraActive);
    }
  };

  const reactivateCamera = () => {
    if (!cameraActive) {
      setCameraActive(true);
      setRecordingProgress(0);
      setIsRecording(false);
      setRecordedChunks([]);
      setVideoUrl(null);
    }
  };

  const handleSend = () => {
    // Stop recording before sending
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      setIsRecording(false);
    }
    
    // Make sure we save our current state before sending
    if (capturedImage) {
      localStorage.setItem('emergencyImage', capturedImage);
      if (onUpdateMedia) {
        onUpdateMedia(capturedImage, 'image');
      }
    }
    
    // Let parent component know to send the alert
    onSend();
  };

  // Futuristic time display
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Store location in localStorage for service to use
  useEffect(() => {
    if (location) {
      localStorage.setItem('lastLocation', JSON.stringify(location));
    }
  }, [location]);

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="max-w-md border-2 border-cyan-500/80 bg-[#0f0b1c]/90 backdrop-blur-sm text-white p-6"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%, 0% 10%)",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 15px rgba(0, 255, 255, 0.1)"
        }}>
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-cyan-400 text-xl font-bold tracking-wider uppercase flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2" style={{ animation: "pulse 1s infinite" }}></span>
              Code Word Detected
            </AlertDialogTitle>
            <div className="text-cyan-300 text-xs font-mono bg-[#0c0a14]/80 px-2 py-1 border border-cyan-500/30">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            <div className="px-2 py-1 bg-[#0c0a14]/80 border border-cyan-500/50 text-cyan-300 text-xs">{codeWord}</div>
            <div className="px-2 py-1 bg-[#0c0a14]/80 border border-fuchsia-500/50 text-fuchsia-400 text-xs">Priority: HIGH</div>
            <div className="px-2 py-1 bg-[#0c0a14]/80 border border-cyan-500/50 text-cyan-300 text-xs">Status: ACTIVE</div>
            {whatsappConnected && (
              <div className="px-2 py-1 bg-[#0c0a14]/80 border border-cyan-500/50 text-cyan-400 text-xs flex items-center">
                <MessageSquareMore className="h-3 w-3 mr-1" /> WhatsApp Ready
              </div>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-4"></div>
          
          <AlertDialogDescription>
            <div className="space-y-4">
              <p className="text-lg font-medium text-fuchsia-400">
                Emergency protocol activated. Preparing to send alert with location and evidence.
              </p>
              
              <div className="mt-4 rounded-md overflow-hidden bg-[#0c0a14]/80 border-2 border-cyan-500/60 relative" 
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 90% 100%, 0 100%, 0% 5%)" }}>
                {loadingCamera ? (
                  <div className="h-48 flex flex-col items-center justify-center text-cyan-400">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Accessing camera...</p>
                  </div>
                ) : cameraError ? (
                  <div className="h-48 flex flex-col items-center justify-center text-red-400 p-4">
                    <p className="text-center">{cameraError}</p>
                    <p className="text-center text-sm mt-2">Emergency alert will still be sent without footage</p>
                    <button 
                      onClick={reactivateCamera}
                      className="mt-3 bg-[#0c0a14] text-cyan-400 p-2 rounded border border-cyan-500/50"
                    >
                      <RefreshCcw className="h-4 w-4 mr-1" />
                      Retry Camera
                    </button>
                  </div>
                ) : (
                  <div className="relative camera-container" style={{ height: "200px" }}>
                    {cameraActive ? (
                      showLivePreview ? (
                        <div className="relative w-full h-full">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            className="w-full h-48 object-cover bg-[#0c0a14]"
                            style={{ opacity: 1, visibility: "visible", display: "block" }}
                          />
                          <div className="absolute top-0 left-0 w-full">
                            <div className="flex justify-between items-center px-2 py-1">
                              <div className="text-xs text-cyan-400 font-mono bg-[#0c0a14]/70 px-1">LIVE</div>
                              <div className="text-xs text-cyan-400 font-mono bg-[#0c0a14]/70 px-1">{currentTime.toLocaleTimeString()}</div>
                            </div>
                            {/* Add scanning effect */}
                            <div className="absolute top-0 left-0 w-full h-48 overflow-hidden pointer-events-none scanline"></div>
                          </div>
                          {/* Camera switch button on mobile */}
                          {isMobile && (
                            <button 
                              onClick={switchCamera}
                              className="absolute bottom-10 right-2 bg-[#0c0a14] text-cyan-400 p-1 rounded-full border border-cyan-500/50"
                              style={{ boxShadow: "0 0 8px rgba(0, 255, 255, 0.3)" }}
                            >
                              <FlipHorizontal className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        capturedImage && (
                          <div className="relative w-full h-full">
                            <img 
                              src={capturedImage} 
                              alt="Captured image" 
                              className="w-full h-48 object-cover"
                              style={{ opacity: 1, visibility: "visible", display: "block" }}
                            />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                              <div className="bg-[#0c0a14]/70 p-2 rounded border border-cyan-500/50">
                                <span className="text-cyan-400 font-bold" style={{ animation: "pulse 1s infinite" }}>EVIDENCE CAPTURED</span>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 text-xs text-cyan-400 font-mono bg-[#0c0a14]/70 px-1">
                              {currentTime.toLocaleTimeString()}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="relative w-full h-full">
                        {capturedImage ? (
                          <img 
                            src={capturedImage} 
                            alt="Final captured image" 
                            className="w-full h-48 object-cover"
                            style={{ opacity: 1, visibility: "visible", display: "block" }}
                          />
                        ) : videoUrl ? (
                          <video 
                            src={videoUrl} 
                            controls
                            className="w-full h-48 object-cover"
                            style={{ opacity: 1, visibility: "visible", display: "block" }}
                          />
                        ) : (
                          <div className="h-48 flex flex-col items-center justify-center text-cyan-400">
                            <p>No image captured</p>
                          </div>
                        )}
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <div className="bg-[#0c0a14]/70 p-2 rounded border border-cyan-500/50">
                            <span className="text-cyan-400 font-bold">CAMERA DEACTIVATED</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 text-xs text-cyan-400 font-mono bg-[#0c0a14]/70 px-1">
                          {currentTime.toLocaleTimeString()}
                        </div>
                        <button 
                          onClick={reactivateCamera}
                          className="absolute bottom-2 right-2 bg-[#0c0a14] text-cyan-400 p-1 rounded border border-cyan-500/50 flex items-center gap-1"
                        >
                          <RefreshCcw className="h-4 w-4" /> Restart
                        </button>
                      </div>
                    )}
                    
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {isRecording && (
                      <div className="absolute top-2 right-2 flex items-center gap-2 bg-[#0c0a14]/70 px-2 py-1 rounded border border-red-500/30">
                        <div className="h-2 w-2 rounded-full bg-red-500" style={{ animation: "pulse 1s infinite" }}></div>
                        <span className="text-xs text-red-400">REC</span>
                      </div>
                    )}
                    
                    {cameraActive && (
                      <button 
                        onClick={captureImage}
                        className="absolute bottom-2 right-2 bg-[#0c0a14] text-cyan-400 p-1 rounded-full border border-cyan-500/50"
                        style={{ boxShadow: "0 0 8px rgba(0, 255, 255, 0.3)" }}
                      >
                        <Camera className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
                
                <div className="p-2 border-t border-cyan-500/30 bg-[#0c0a14]/80">
                  <Progress value={recordingProgress} className="h-1 bg-[#151029]" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-cyan-400/80 flex items-center gap-1">
                      <Video size={12} /> {cameraActive ? "Recording footage" : "Recording complete"}
                    </span>
                    <span className="text-xs text-cyan-400/80">
                      {Math.min(Math.floor(recordingProgress / 10), 10)}s / 10s
                    </span>
                  </div>
                </div>
              </div>
              
              {location && (
                <div className="p-4 bg-[#0c0a14]/80 text-sm border-2 border-cyan-500/60 relative" 
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0% 15%)" }}>
                  <div className="flex items-center gap-2 font-medium mb-2 text-fuchsia-400 uppercase tracking-wider">
                    <MapPin className="text-cyan-400" /> 
                    <span>Your current location:</span>
                  </div>
                  
                  {locationName && (
                    <p className="font-semibold text-base mb-2 text-cyan-400">{locationName}</p>
                  )}
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-cyan-300">Latitude: {location.lat.toFixed(6)}</p>
                      <p className="text-cyan-300">Longitude: {location.lng.toFixed(6)}</p>
                    </div>
                    <div className="h-16 w-16 bg-[#0c0a14] rounded-md flex items-center justify-center overflow-hidden relative border border-cyan-500/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 to-transparent opacity-50"></div>
                      <div className="relative z-10">
                        <span className="text-cyan-400 text-xs">MAP VIEW</span>
                      </div>
                      {/* Grid overlay */}
                      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="border border-cyan-500/20"></div>
                        ))}
                      </div>
                      {/* Center point */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-animation"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {whatsappConnected && (
                <div className="p-4 bg-[#0c0a14]/80 text-sm border-2 border-fuchsia-500/60 relative" 
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%, 0% 15%)" }}>
                  <div className="flex items-center gap-2 font-medium mb-2 text-fuchsia-400 uppercase tracking-wider">
                    <MessageSquareMore className="text-fuchsia-400" /> 
                    <span>WhatsApp Alert Ready:</span>
                  </div>
                  
                  <p className="text-cyan-300 mb-1">
                    Alert will be sent via WhatsApp with location and emergency details.
                  </p>
                  
                  <div className="mt-2 bg-[#151029] p-2 rounded text-xs border border-fuchsia-500/30">
                    <span className="text-fuchsia-400 font-semibold">ALERT MESSAGE:</span><br />
                    <span className="text-cyan-300">🚨 EMERGENCY ALERT: Code word "{codeWord}" detected! Help needed immediately.</span>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-cyan-300 mt-2 p-3 rounded border-2 border-cyan-500/30 bg-[#0c0a14]/80">
                <span className="text-fuchsia-400 font-bold">WARNING:</span> If this was triggered accidentally, click "Cancel" to stop the alert.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel 
            onClick={onCancel} 
            className="bg-[#0c0a14] text-cyan-400 hover:bg-[#151029] hover:text-cyan-300 border border-cyan-500/50" 
            style={{ 
              clipPath: "polygon(0 0, 95% 0, 100% 25%, 100% 100%, 5% 100%, 0 75%)",
              boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)"
            }}
            disabled={isSending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSend}
            className="bg-fuchsia-900/80 text-fuchsia-200 hover:bg-fuchsia-800/80 border border-fuchsia-500/50"
            style={{ 
              clipPath: "polygon(0 0, 95% 0, 100% 25%, 100% 100%, 5% 100%, 0 75%)",
              boxShadow: "0 0 10px rgba(255, 0, 255, 0.2)"
            }}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : "Send Alert"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;

