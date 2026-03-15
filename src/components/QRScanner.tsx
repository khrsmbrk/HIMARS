import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload'>('camera');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (scanMethod === 'camera') {
      html5QrCode = new Html5Qrcode("reader");
      
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
          if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(console.error);
          }
        },
        (errorMessage) => {
          // Silent error for scanning
        }
      ).catch((err) => {
        console.error("Error starting scanner", err);
        setError("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin kamera.");
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [scanMethod]);

  const handleScanSuccess = (text: string) => {
    setSuccess("QR Code berhasil dipindai!");
    setTimeout(() => {
      onScan(text);
      onClose();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleScanSuccess(code.data);
        } else {
          setError("Tidak dapat menemukan QR Code pada gambar ini.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Pindai QR Acara</h3>
          <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mt-1">HIMARS UMLA Presence System</p>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm aspect-square relative">
          {/* Scanning Frame Corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-himars-peach rounded-tl-3xl z-20"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-himars-peach rounded-tr-3xl z-20"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-himars-peach rounded-bl-3xl z-20"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-himars-peach rounded-br-3xl z-20"></div>
          
          {/* Scanning Line Animation */}
          <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-himars-peach to-transparent shadow-[0_0_15px_rgba(249,168,117,0.8)] z-20 animate-[scan_2s_linear_infinite]"></div>

          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
            {scanMethod === 'camera' ? (
              <div id="reader" className="w-full h-full [&_video]:object-cover"></div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900">
                <Upload className="w-16 h-16 text-white/20 mb-6" />
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-8">Pilih foto QR Code dari galeri</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-10 py-4 bg-white text-himars-dark rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-himars-peach hover:text-white transition-all shadow-xl"
                >
                  Pilih Gambar
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* Success Overlay */}
          {success && (
            <div className="absolute inset-0 z-30 bg-himars-green/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center rounded-3xl animate-in fade-in">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tight">Berhasil!</h4>
              <p className="text-sm font-bold opacity-80 mt-2 uppercase tracking-widest">{success}</p>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-x-0 -bottom-20 z-30 bg-red-500 text-white p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-[10px] font-black uppercase tracking-widest underline">Tutup</button>
            </div>
          )}
        </div>

        <p className="mt-12 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-center max-w-xs leading-relaxed">
          Posisikan QR Code di dalam kotak untuk memindai secara otomatis
        </p>
      </div>

      {/* Footer Controls */}
      <div className="p-10 flex justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
        <button 
          onClick={() => setScanMethod('camera')}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            scanMethod === 'camera' ? 'bg-himars-peach text-white scale-110 shadow-2xl shadow-himars-peach/40' : 'bg-white/10 text-white/40'
          }`}
        >
          <Camera className="w-8 h-8" />
        </button>
        <button 
          onClick={() => setScanMethod('upload')}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            scanMethod === 'upload' ? 'bg-himars-peach text-white scale-110 shadow-2xl shadow-himars-peach/40' : 'bg-white/10 text-white/40'
          }`}
        >
          <Upload className="w-8 h-8" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        #reader__dashboard_section_csr { display: none !important; }
        #reader__status_span { display: none !important; }
        #reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
      `}} />
    </div>
  );
}
