import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle } from 'lucide-react';

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const isDone = localStorage.getItem('himars_onboarding_done');
    if (!isDone) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('himars_onboarding_done', 'true');
    setIsOpen(false);
    
    // Trigger event so banner can update
    window.dispatchEvent(new Event('onboarding_completed'));
  };

  const steps = [
    {
      title: 'Selamat Datang di HIMARS Workspace! 👋',
      description: 'Ini adalah pusat kendali organisasi kita. Mari ikuti tur singkat untuk mengenal fitur-fitur utamanya.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Dasbor & Ringkasan 📊',
      description: 'Di Dasbor, Anda bisa melihat ringkasan aktivitas, statistik presensi, keuangan, dan tugas proker yang harus segera diselesaikan.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Data Anggota & Presensi 👥',
      description: 'Kelola data anggota, peran (Admin/Anggota), dan pantau kehadiran mereka melalui fitur Presensi QR yang terintegrasi.',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Tracking Proker 🚀',
      description: 'Pantau seluruh program kerja dari tahap Pengajuan, Persetujuan, Pelaksanaan, hingga Evaluasi dalam satu papan Kanban interaktif.',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="h-48 relative">
          <img src={steps[step].image} alt="Onboarding" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-white/40'}`} />
            ))}
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3">{steps[step].title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">{steps[step].description}</p>
          
          <div className="flex items-center justify-between">
            <button onClick={handleClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
              Lewati Tur
            </button>
            
            {step < steps.length - 1 ? (
              <button 
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleClose}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
              >
                Selesai <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
