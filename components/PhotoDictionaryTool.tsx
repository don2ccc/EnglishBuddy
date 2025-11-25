import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Volume2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { analyzeImage } from '../services/aiService';
import { UserSettings, DictionaryResult } from '../types';

interface PhotoDictionaryProps {
  settings: UserSettings;
  onSaveWord: (word: DictionaryResult) => void;
}

const PhotoDictionaryTool: React.FC<PhotoDictionaryProps> = ({ settings, onSaveWord }) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream when component unmounts or camera closes
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      // Try environment facing camera first (rear camera on phones)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
      } catch (err) {
        // Fallback to any available video source (laptops/desktops)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      let msg = "Could not access camera.";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = "Access denied. Please allow camera permissions in your browser settings.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          msg = "No camera found on this device.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          msg = "Camera is already in use by another application.";
      }

      setCameraError(msg);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        setImage(base64);
        stopCamera(); // Close camera view
        processImage(base64); // Analyze immediately
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setResult(null);
    // Remove data url prefix for API
    const base64Data = base64.split(',')[1];
    
    try {
      const data = await analyzeImage(base64Data, settings);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        {/* Left: Camera/Image Area */}
        <div className="w-full md:w-1/2 bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden group">
          
          {/* Live Camera View */}
          {isCameraOpen && (
             <div className="absolute inset-0 z-20 flex flex-col">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
                    <button 
                        onClick={() => stopCamera()}
                        className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={takePhoto}
                        className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                    >
                        <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-900"></div>
                    </button>
                </div>
             </div>
          )}

          {/* Captured Image View */}
          {!isCameraOpen && image ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img src={image} alt="Captured" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 right-4">
                  <button onClick={() => { setImage(null); startCamera(); }} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <RefreshCw className="w-4 h-4" /> <span>Retake</span>
                  </button>
              </div>
            </div>
          ) : !isCameraOpen && (
            /* Initial State */
            <div className="text-center p-8 z-10">
              <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-700">
                <Camera className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Photo Dictionary</h3>
              <p className="text-slate-400 max-w-xs mx-auto mb-8 text-sm">
                Point your camera at any object to learn its English name!
              </p>
              
              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <button 
                  onClick={startCamera}
                  className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload Photo
                </button>
                {cameraError && (
                    <div className="flex items-center gap-2 text-red-300 text-xs mt-2 bg-red-900/30 p-3 rounded-lg border border-red-500/20 text-left">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{cameraError}</p>
                    </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}
          
          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right: Results Area */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col bg-white">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-blue-500" />
                  </div>
              </div>
              <p className="font-medium animate-pulse">Analyzing image...</p>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black tracking-wider uppercase mb-3">
                            {result.partOfSpeech}
                        </span>
                        <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{result.word}</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-mono text-xl bg-slate-100 px-2 py-1 rounded">/{result.phonetic}/</span>
                            <button 
                                onClick={() => playAudio(result.word)} 
                                className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                                <Volume2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Definition</h4>
                        <p className="text-xl font-medium text-slate-800 mb-1">{result.meaning}</p>
                        <p className="text-slate-500">{result.translation}</p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <h4 className="text-xs font-bold text-amber-400 uppercase mb-2 tracking-wider">Example</h4>
                        <p className="text-lg text-amber-900 italic mb-2 font-serif">"{result.exampleSentence}"</p>
                        <p className="text-amber-700/70 text-sm font-medium">{result.exampleTranslation}</p>
                    </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                  <button 
                        onClick={() => onSaveWord(result)}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all active:scale-[0.99]"
                    >
                        Save to Notebook
                    </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                     <ImageIcon className="w-8 h-8 text-slate-200" />
                </div>
                <p>Ready to snap!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDictionaryTool;